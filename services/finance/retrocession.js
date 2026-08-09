// Rétrocessions — LE point d'entrée unique « paiement confirmé » (§11, §34)
//
// Aujourd'hui appelé par la validation humaine de l'admin ; demain, un webhook
// d'agrégateur (CinetPay, Wave…) appellera LA MÊME fonction. Tout se joue dans
// UNE transaction : activation de l'abonnement, confirmation de la place promo,
// validation de l'attribution, rétrocession PLAFONNÉE (§6-§8), écriture ledger
// idempotente, mise à jour du portefeuille, audit.
//
// Idempotence : - l'enrollment est « réclamé » par updateMany conditionnel ;
//               - l'écriture de rétrocession porte l'idempotencyKey COMM:<subId>
//                 (unique en base) — jamais deux rétrocessions pour un abonnement.

const prisma = require('../../data/prisma-store');
const regles = require('./regles');
const politique = require('./politique');
const audit = require('./audit');

// Somme des rétrocessions ACQUISES par le parrain pour SA période d'abonnement
// courante (le plancher s'applique « pour la période concernée » — §6, §9).
// Les contre-écritures (remboursements) ne sont comptées QUE si elles annulent
// une commission DE CETTE PÉRIODE : un remboursement tardif d'une période
// antérieure ne regonfle pas la capacité de la période courante.
async function acquisPeriode(tx, parrainUserId, depuis) {
  const commissions = await tx.financialLedgerEntry.findMany({
    where: {
      userId: parrainUserId,
      type: 'REFERRAL_COMMISSION_VALIDATED',
      createdAt: depuis ? { gte: depuis } : undefined,
    },
    select: { montant: true, subscriptionId: true },
  });
  let total = commissions.reduce((s, c) => s + c.montant, 0);
  const subIds = commissions.map((c) => c.subscriptionId).filter(Boolean);
  if (subIds.length) {
    const reversals = await tx.financialLedgerEntry.aggregate({
      _sum: { montant: true },
      where: {
        userId: parrainUserId,
        type: { in: ['COMMISSION_REVERSED', 'REFUND_ADJUSTMENT'] },
        subscriptionId: { in: subIds },
      },
    });
    total += reversals._sum.montant || 0; // contre-écritures négatives
  }
  return Math.max(0, total);
}

async function majWallet(tx, userId, delta) {
  await tx.financialWallet.upsert({
    where: { userId },
    create: {
      userId,
      acquis: Math.max(0, delta.acquis || 0),
      disponible: delta.disponible || 0,
      enAttente: delta.enAttente || 0,
      verse: delta.verse || 0,
    },
    update: {
      acquis: { increment: delta.acquis || 0 },
      disponible: { increment: delta.disponible || 0 },
      enAttente: { increment: delta.enAttente || 0 },
      verse: { increment: delta.verse || 0 },
    },
  });
}

// ─── Confirmation d'un paiement d'abonnement (validation admin) ───
// Retourne { ok, dejaTraite?, retrocession?, parrainId? }
//
// Les LECTURES stables (demande, attribution, parrain, abonnement du parrain,
// politique) sont faites AVANT la transaction pour la garder courte (latence
// Neon) ; la cohérence est garantie par la réclamation conditionnelle de
// l'enrollment (une seule validation possible) + l'idempotencyKey du ledger.
async function confirmerPaiement(enrollmentId, acteurId) {
  // Pré-lectures hors transaction
  const enr = await prisma.formationEnrollment.findUnique({ where: { id: enrollmentId }, include: { offre: true, user: true } });
  if (!enr) throw new Error('Demande introuvable');
  const attrPre = await prisma.referralAttribution.findUnique({ where: { filleulUserId: enr.userId } });
  let parrainPre = null;
  let parrainSubPre = null;
  let slotPre = null;
  let slotConfirmePre = null;
  if (attrPre && !['fraude', 'rejete'].includes(attrPre.statut)) {
    [parrainPre, parrainSubPre, slotPre] = await Promise.all([
      prisma.user.findUnique({ where: { id: attrPre.parrainUserId }, select: { id: true, fraudStatus: true } }),
      // Abonnement du parrain : ACTIF et NON ÉCHU (un abonnement expiré ne donne plus droit aux rétrocessions)
      prisma.subscription.findFirst({
        where: { userId: attrPre.parrainUserId, statut: 'active', OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        orderBy: { startedAt: 'desc' },
        include: { policy: true },
      }),
      prisma.referralPromotionSlot.findFirst({ where: { parrainUserId: attrPre.parrainUserId, filleulUserId: enr.userId, statut: 'reserve' } }),
    ]);
    if (!slotPre) {
      slotConfirmePre = await prisma.referralPromotionSlot.findFirst({ where: { parrainUserId: attrPre.parrainUserId, filleulUserId: enr.userId, statut: 'confirme' } });
    }
  }
  const subFilleulPre = enr.subscriptionId
    ? await prisma.subscription.findUnique({ where: { id: enr.subscriptionId }, include: { policy: true } })
    : null;
  const policyFilleul = subFilleulPre && subFilleulPre.policy;

  const resultat = await prisma.$transaction(async (tx) => {
    // Réclamation idempotente de la validation
    const claim = await tx.formationEnrollment.updateMany({
      where: { id: enr.id, statut: 'pending' },
      data: { statut: 'validation' },
    });
    if (!claim.count) return { ok: true, dejaTraite: true };

    const expiresAt = enr.offre && enr.offre.dureeJours
      ? new Date(Date.now() + enr.offre.dureeJours * 24 * 3600 * 1000)
      : null;

    // 1. Activer la période d'abonnement — UNIQUEMENT depuis 'pending' :
    //    on ne ressuscite jamais une période annulée ou remboursée.
    let sub = null;
    if (enr.subscriptionId) {
      const act = await tx.subscription.updateMany({
        where: { id: enr.subscriptionId, statut: 'pending' },
        data: { statut: 'active', startedAt: new Date(), expiresAt },
      });
      if (!act.count) throw new Error('La période d’abonnement n’est plus en attente (annulée ou déjà traitée) — demandez au candidat de re-déclarer son paiement.');
      sub = await tx.subscription.findUnique({ where: { id: enr.subscriptionId } });
    }

    // 1 bis. Si le montant payé intègre la réduction PARRAINAGE, la place
    // promotionnelle doit être consommée MAINTENANT : réservée → confirmée,
    // ou re-réclamée si la réservation avait expiré. À défaut (les places sont
    // parties à d'autres filleuls), on REFUSE la validation : le prix réduit
    // ne peut pas être encaissé sans place (« jamais plus de N réductions »).
    let rang = null;
    const attr = attrPre;
    if (sub && sub.sourceReduction === 'parrainage' && attr) {
      const conf = slotPre ? await tx.referralPromotionSlot.updateMany({
        where: { id: slotPre.id, statut: 'reserve' },
        data: { statut: 'confirme', confirmedAt: new Date(), filleulUserId: enr.userId },
      }) : { count: 0 };
      if (conf.count) rang = slotPre.rang;
      else if (slotConfirmePre) rang = slotConfirmePre.rang; // re-passage idempotent
      else {
        // Réservation expirée : tenter de reprendre une place encore libre
        const policy = policyFilleul || (parrainSubPre && parrainSubPre.policy) || (await tx.referralPolicy.findFirst({ where: { actif: true } }));
        for (let r = 1; r <= policy.discountedReferralsLimit && rang === null; r++) {
          const reclaim = await tx.referralPromotionSlot.updateMany({
            where: { parrainUserId: attr.parrainUserId, rang: r, statut: { in: ['expire', 'libere'] } },
            data: { statut: 'confirme', filleulUserId: enr.userId, confirmedAt: new Date() },
          });
          if (reclaim.count) rang = r;
        }
        if (rang === null) {
          const pris = await tx.referralPromotionSlot.count({ where: { parrainUserId: attr.parrainUserId, statut: { in: ['reserve', 'confirme'] } } });
          if (pris < policy.discountedReferralsLimit) {
            // rang jamais créé : en créer un (contrainte unique = garde-fou)
            for (let r = 1; r <= policy.discountedReferralsLimit && rang === null; r++) {
              try {
                await tx.referralPromotionSlot.create({ data: { parrainUserId: attr.parrainUserId, rang: r, filleulUserId: enr.userId, statut: 'confirme', confirmedAt: new Date(), expiresAt: new Date() } });
                rang = r;
              } catch (e) { if (!(e && e.code === 'P2002')) throw e; }
            }
          }
        }
        if (rang === null) {
          throw new Error('La réservation de la réduction parrainage a expiré et les places sont épuisées : refusez cette demande et invitez le candidat à re-déclarer (le tarif sera alors sans la réduction).');
        }
      }
    }

    // 2. Finaliser l'accès
    await tx.formationEnrollment.update({
      where: { id: enr.id },
      data: { statut: 'approuve', motifRefus: null, approvedById: acteurId, approvedAt: new Date(), expiresAt },
    });

    // 3. Parrainage : attribution validée + rétrocession
    let retro = { montant: 0, parrainId: null, plafond: false };
    if (sub && attr && !['fraude', 'rejete'].includes(attr.statut)) {
      await tx.referralAttribution.update({
        where: { id: attr.id },
        data: { statut: 'valide', subscriptionId: sub.id, slotRang: rang, validatedAt: new Date() },
      });

      // Rétrocession : uniquement si le parrain n'est pas bloqué (§31) et possède
      // lui-même un abonnement ACTIF NON ÉCHU (le plancher se calcule sur SON
      // montant payé, avec SA politique figée ; le taux et l'assiette viennent
      // de la transaction du FILLEUL — sa politique et SON tarif facial).
      const parrain = parrainPre;
      const parrainSub = parrainSubPre;
      if (parrain && parrain.fraudStatus !== 'BLOCKED' && parrainSub) {
        // Verrou de ligne sur le portefeuille du parrain : deux validations
        // CONCURRENTES de filleuls différents ne peuvent pas dépasser le plafond
        // (le calcul acquis→capacité→écriture est sérialisé par parrain).
        await tx.financialWallet.upsert({ where: { userId: attr.parrainUserId }, create: { userId: attr.parrainUserId }, update: {} });
        await tx.$queryRaw`SELECT "id" FROM "FinancialWallet" WHERE "userId" = ${attr.parrainUserId} FOR UPDATE`;

        const polFilleul = politique.versRegles(policyFilleul || parrainSub.policy, sub.prixFacial);
        const polParrain = politique.versRegles(parrainSub.policy);
        const theorique = regles.retrocessionTheorique(polFilleul); // % du TARIF FACIAL de la formule du filleul
        const acquis = await acquisPeriode(tx, attr.parrainUserId, parrainSub.startedAt);
        const capacite = regles.capaciteRestante(parrainSub.montantPaye, polParrain, acquis);
        const montant = Math.min(theorique, capacite);
        retro.parrainId = attr.parrainUserId;
        retro.plafond = montant <= 0;
        if (montant > 0) {
          // Écriture ledger IDEMPOTENTE : COMM:<subscription du filleul>
          try {
            await tx.financialLedgerEntry.create({
              data: {
                userId: attr.parrainUserId,
                type: 'REFERRAL_COMMISSION_VALIDATED',
                montant,
                taux: polFilleul.commissionRate,
                filleulSourceId: enr.userId,
                subscriptionId: sub.id,
                motif: 'Rétrocession filleul direct payant (' + regles.POLICY_DEFAUT.devise + ')',
                creePar: acteurId || 'system',
                idempotencyKey: 'COMM:' + sub.id,
              },
            });
            await majWallet(tx, attr.parrainUserId, { acquis: montant, disponible: montant });
            retro.montant = montant;
          } catch (e) {
            if (e && e.code === 'P2002') retro.montant = 0; // déjà comptabilisée
            else throw e;
          }
        }
      }
    }

    return { ok: true, enrollment: enr, subscription: sub, retro, expiresAt };
  }, { timeout: 30000, maxWait: 10000 }); // latence Neon : transaction courte mais marge large

  if (!resultat.dejaTraite) {
    await audit.log(acteurId, 'formation.paiement-confirme', 'FormationEnrollment', enrollmentId, null, {
      subscriptionId: resultat.subscription && resultat.subscription.id,
      retrocession: resultat.retro,
    });
  }
  return resultat;
}

// ─── Remboursement / annulation (§16) — contre-écritures, jamais d'effacement ───
async function rembourser(subscriptionId, acteurId, motif) {
  return prisma.$transaction(async (tx) => {
    const sub = await tx.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub) throw new Error('Abonnement introuvable');
    const claim = await tx.subscription.updateMany({
      where: { id: sub.id, statut: { in: ['active', 'expired'] } },
      data: { statut: 'refunded' },
    });
    if (!claim.count) return { ok: true, dejaTraite: true };

    // L'accès du filleul est révoqué
    await tx.formationEnrollment.updateMany({
      where: { subscriptionId: sub.id },
      data: { statut: 'refuse', motifRefus: 'Paiement remboursé' + (motif ? ' — ' + motif : '') },
    });

    // Rétrocession générée par cet abonnement ? → contre-écriture
    const commission = await tx.financialLedgerEntry.findUnique({ where: { idempotencyKey: 'COMM:' + sub.id } });
    let reversal = 0;
    if (commission) {
      try {
        await tx.financialLedgerEntry.create({
          data: {
            userId: commission.userId,
            type: 'COMMISSION_REVERSED',
            montant: -commission.montant,
            filleulSourceId: commission.filleulSourceId,
            subscriptionId: sub.id,
            motif: 'Contre-écriture — remboursement du filleul' + (motif ? ' — ' + motif : ''),
            creePar: acteurId || 'system',
            idempotencyKey: 'REV:' + sub.id,
          },
        });
        await majWallet(tx, commission.userId, { acquis: -commission.montant, disponible: -commission.montant });
        reversal = commission.montant;
      } catch (e) {
        if (!(e && e.code === 'P2002')) throw e;
      }
    }
    await audit.log(acteurId, 'subscription.remboursement', 'Subscription', sub.id, null, { motif, reversal });
    return { ok: true, reversal };
  }, { timeout: 30000, maxWait: 10000 });
}

// ─── Progression du parrain (§17) ───
async function progressionParrain(userId) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, statut: 'active', OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { startedAt: 'desc' },
    include: { policy: true },
  });
  const wallet = await prisma.financialWallet.findUnique({ where: { userId } });
  if (!sub) {
    return { abonne: false, wallet, capaciteRestante: 0, coutNet: null };
  }
  const pol = politique.versRegles(sub.policy);
  const acquis = await acquisPeriode(prisma, userId, sub.startedAt);
  return {
    abonne: true,
    subscription: sub,
    wallet,
    acquisPeriode: acquis,
    capaciteRestante: regles.capaciteRestante(sub.montantPaye, pol, acquis),
    coutNet: regles.coutEconomiqueNet(sub.montantPaye, acquis),
    plancher: pol.minimumNetCost,
    plafondAtteint: regles.plafondAtteint(sub.montantPaye, pol, acquis),
  };
}

module.exports = { confirmerPaiement, rembourser, progressionParrain, majWallet, acquisPeriode };
