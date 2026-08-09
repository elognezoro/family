// Versements des rétrocessions (§13, §15) — traitement MANUEL par l'admin
// (l'admin envoie le mobile money puis enregistre la référence), architecture
// prête pour un agrégateur. Statuts : requested → processing → paid | failed.

const prisma = require('../../data/prisma-store');
const politique = require('./politique');
const audit = require('./audit');
const { majWallet } = require('./retrocession');

const MOYENS = ['wave', 'orange', 'mtn', 'moov', 'virement'];

// Demande de versement par le parrain
async function demander(userId, { montant, moyen, numero }) {
  const policy = await politique.active();
  const m = parseInt(montant, 10);
  if (!Number.isFinite(m) || m <= 0) return { erreur: 'Montant invalide.' };
  if (m < policy.payoutMinimum) return { erreur: `Le versement minimum est de ${policy.payoutMinimum.toLocaleString('fr-FR')} FCFA.` };
  if (!MOYENS.includes(moyen)) return { erreur: 'Choisissez un moyen de versement valide.' };
  const num = (numero || '').trim();
  if (num.length < 8) return { erreur: 'Indiquez le numéro qui recevra le versement.' };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { fraudStatus: true } });
  if (user && user.fraudStatus === 'BLOCKED') return { erreur: 'Vos versements sont suspendus. Contactez le support.' };

  // Transaction : verrou du portefeuille, PUIS contrôles (délai, plafonds),
  // PUIS réservation — deux demandes simultanées sont sérialisées et ne
  // peuvent contourner ni le solde, ni les plafonds jour/mois (§15).
  try {
    const payout = await prisma.$transaction(async (tx) => {
      const wallet = await tx.financialWallet.findUnique({ where: { userId } });
      if (!wallet || wallet.disponible < m) throw new Error('DISPONIBLE_INSUFFISANT');
      await tx.$queryRaw`SELECT "id" FROM "FinancialWallet" WHERE "userId" = ${userId} FOR UPDATE`;

      // Délai de sécurité (payoutDelaiJours) : les rétrocessions trop récentes
      // ne sont pas encore retirables (protection contre les remboursements).
      if (policy.payoutDelaiJours > 0) {
        const recent = await tx.financialLedgerEntry.aggregate({
          _sum: { montant: true },
          where: { userId, type: 'REFERRAL_COMMISSION_VALIDATED', createdAt: { gte: new Date(Date.now() - policy.payoutDelaiJours * 24 * 3600 * 1000) } },
        });
        const retirable = wallet.disponible - (recent._sum.montant || 0);
        if (m > retirable) throw new Error('DELAI:' + Math.max(0, retirable));
      }

      // Plafonds jour/mois — évalués SOUS verrou
      const debutJour = new Date(); debutJour.setUTCHours(0, 0, 0, 0);
      const debutMois = new Date(); debutMois.setUTCDate(1); debutMois.setUTCHours(0, 0, 0, 0);
      if (policy.payoutLimiteJour) {
        const agg = await tx.payout.aggregate({ _sum: { montant: true }, where: { userId, requestedAt: { gte: debutJour }, statut: { not: 'failed' } } });
        if ((agg._sum.montant || 0) + m > policy.payoutLimiteJour) throw new Error('LIMITE_JOUR');
      }
      if (policy.payoutLimiteMois) {
        const agg = await tx.payout.aggregate({ _sum: { montant: true }, where: { userId, requestedAt: { gte: debutMois }, statut: { not: 'failed' } } });
        if ((agg._sum.montant || 0) + m > policy.payoutLimiteMois) throw new Error('LIMITE_MOIS');
      }

      // Décrément conditionnel — refuse la concurrence (double demande simultanée)
      const upd = await tx.financialWallet.updateMany({
        where: { userId, disponible: { gte: m } },
        data: { disponible: { decrement: m }, enAttente: { increment: m } },
      });
      if (!upd.count) throw new Error('DISPONIBLE_INSUFFISANT');
      const p = await tx.payout.create({
        data: { userId, montant: m, moyen, numeroBeneficiaire: num },
      });
      await tx.financialLedgerEntry.create({
        data: {
          userId, type: 'PAYOUT_REQUESTED', montant: -m, payoutId: p.id,
          motif: `Demande de versement ${moyen} → ${num}`,
          creePar: userId, idempotencyKey: 'PAYREQ:' + p.id,
        },
      });
      // Mémoriser les coordonnées pour la prochaine fois
      await tx.financialWallet.update({ where: { userId }, data: { moyenPaiement: moyen, numeroPaiement: num } });
      return p;
    }, { timeout: 30000, maxWait: 10000 });
    await audit.log(userId, 'payout.demande', 'Payout', payout.id, null, { montant: m, moyen, numero: num });
    return { ok: true, payout };
  } catch (e) {
    if (e.message === 'DISPONIBLE_INSUFFISANT') return { erreur: 'Montant supérieur à votre solde disponible.' };
    if (e.message.startsWith('DELAI:')) return { erreur: `Délai de sécurité : seuls ${Number(e.message.slice(6)).toLocaleString('fr-FR')} FCFA sont retirables pour l’instant (les gains récents le deviennent après ${policy.payoutDelaiJours} jours).` };
    if (e.message === 'LIMITE_JOUR') return { erreur: 'Plafond de versement journalier atteint.' };
    if (e.message === 'LIMITE_MOIS') return { erreur: 'Plafond de versement mensuel atteint.' };
    throw e;
  }
}

// Règlement par l'admin : versé (référence mobile money) ou échec (motif)
async function regler(payoutId, acteurId, { succes, reference, motifEchec }) {
  return prisma.$transaction(async (tx) => {
    const p = await tx.payout.findUnique({ where: { id: payoutId } });
    if (!p) throw new Error('Versement introuvable');
    const claim = await tx.payout.updateMany({
      where: { id: p.id, statut: { in: ['requested', 'processing'] } },
      data: succes
        ? { statut: 'paid', processedAt: new Date(), processedById: acteurId, referenceExterne: (reference || '').trim() || null }
        : { statut: 'failed', processedAt: new Date(), processedById: acteurId, motifEchec: (motifEchec || '').trim() || null },
    });
    if (!claim.count) return { ok: true, dejaTraite: true };

    if (succes) {
      await tx.financialLedgerEntry.create({
        data: {
          userId: p.userId, type: 'PAYOUT_COMPLETED', montant: 0, payoutId: p.id,
          referenceExterne: (reference || '').trim() || null,
          motif: 'Versement effectué', creePar: acteurId, idempotencyKey: 'PAYOK:' + p.id,
        },
      });
      await majWallet(tx, p.userId, { enAttente: -p.montant, verse: p.montant });
    } else {
      await tx.financialLedgerEntry.create({
        data: {
          userId: p.userId, type: 'PAYOUT_FAILED', montant: p.montant, payoutId: p.id,
          motif: 'Échec du versement — montant recrédité' + (motifEchec ? ' — ' + motifEchec : ''),
          creePar: acteurId, idempotencyKey: 'PAYKO:' + p.id,
        },
      });
      await majWallet(tx, p.userId, { enAttente: -p.montant, disponible: p.montant });
    }
    await audit.log(acteurId, succes ? 'payout.regle' : 'payout.echec', 'Payout', p.id, null, { reference, motifEchec });
    return { ok: true };
  }, { timeout: 30000, maxWait: 10000 });
}

module.exports = { demander, regler, MOYENS };
