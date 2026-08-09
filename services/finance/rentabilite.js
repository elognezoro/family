// Pilotage de rentabilité (§20-§30) — KPI, snapshots quotidiens, alertes.
// Les calculs réutilisent les fonctions PURES de regles.js.

const prisma = require('../../data/prisma-store');
const regles = require('./regles');
const politique = require('./politique');

// KPI globaux sur une période [debut, fin) — calculés depuis les Subscriptions
// et le ledger (source de vérité), jamais depuis des soldes cachés.
async function kpis(debut, fin) {
  const where = { statut: { in: ['active', 'expired'] } };
  if (debut || fin) where.startedAt = { gte: debut || undefined, lt: fin || undefined };

  const subs = await prisma.subscription.findMany({ where, select: { prixFacial: true, reduction: true, montantPaye: true, userId: true, referralId: true } });
  const caFacial = subs.reduce((s, x) => s + x.prixFacial, 0);
  const reductions = subs.reduce((s, x) => s + x.reduction, 0);
  const encaissements = subs.reduce((s, x) => s + x.montantPaye, 0);

  const ledgerWhere = { createdAt: { gte: debut || undefined, lt: fin || undefined } };
  const [acq, rev, payes] = await Promise.all([
    prisma.financialLedgerEntry.aggregate({ _sum: { montant: true }, where: { ...ledgerWhere, type: 'REFERRAL_COMMISSION_VALIDATED' } }),
    prisma.financialLedgerEntry.aggregate({ _sum: { montant: true }, where: { ...ledgerWhere, type: { in: ['COMMISSION_REVERSED', 'REFUND_ADJUSTMENT'] } } }),
    prisma.payout.aggregate({ _sum: { montant: true }, where: { statut: 'paid', processedAt: { gte: debut || undefined, lt: fin || undefined } } }),
  ]);
  const retroAcquises = (acq._sum.montant || 0) + (rev._sum.montant || 0); // reversals sont négatifs
  const retroPayees = payes._sum.montant || 0;

  // Engagements restants (toutes périodes confondues) : dû mais pas encore versé
  const wallets = await prisma.financialWallet.aggregate({ _sum: { disponible: true, enAttente: true } });
  const engagementsRestants = (wallets._sum.disponible || 0) + (wallets._sum.enAttente || 0);

  const rarTotal = regles.rar({ caFacial, reductionsAccordees: reductions, retrocessionsAcquises: retroAcquises });
  const nbPayants = subs.length;

  // Coefficient K (§25) : proportion d'abonnés qui parrainent × moyenne de filleuls payants
  const abonnes = await prisma.subscription.groupBy({ by: ['userId'], where: { statut: { in: ['active', 'expired'] } } });
  const parrainsActifs = await prisma.referralAttribution.groupBy({ by: ['parrainUserId'], where: { statut: 'valide' }, _count: true });
  const totalFilleulsPayants = parrainsActifs.reduce((s, p) => s + p._count, 0);
  const proportionParrains = abonnes.length ? parrainsActifs.length / abonnes.length : 0;
  const moyenneFilleuls = parrainsActifs.length ? totalFilleulsPayants / parrainsActifs.length : 0;
  const coefK = regles.coefficientK(proportionParrains, moyenneFilleuls);

  // CAC parrainage moyen (§24) : (réductions + rétrocessions) / filleuls payants
  const filleulsPayants = subs.filter((s) => s.referralId).length || totalFilleulsPayants;
  const referralCac = filleulsPayants ? Math.round((reductions + retroAcquises) / filleulsPayants) : 0;

  const policy = await politique.active();
  const rarMoyenVal = Math.round(regles.rarMoyen(rarTotal, nbPayants));
  return {
    caFacial, reductions, encaissements, retroAcquises, retroPayees, engagementsRestants,
    rar: rarTotal,
    rarMoyen: rarMoyenVal,
    rarStatut: regles.statutRar(rarMoyenVal, policy.rarCibleMoyen, { seuilOrangePct: policy.rarSeuilOrangePct }),
    rarCible: policy.rarCibleMoyen,
    margeContributive: rarTotal, // frais externes réels non connus → paramétrables au simulateur
    abonnesPayants: nbPayants,
    coefK: Math.round(coefK * 100) / 100,
    proportionParrains: Math.round(proportionParrains * 100),
    moyenneFilleuls: Math.round(moyenneFilleuls * 100) / 100,
    referralCac,
  };
}

// Alertes (§30) — évaluées sur les KPI globaux ; seuils administrables (policy.alertes JSON)
async function alertes() {
  const policy = await politique.active();
  const seuils = safeJson(policy.alertes) || { retroPctEncaissementsMax: 15, engagementsMax: 500000 };
  const k = await kpis();
  const liste = [];
  if (k.rarStatut !== 'vert') {
    liste.push({ niveau: k.rarStatut, texte: `Le RAR moyen (${k.rarMoyen.toLocaleString('fr-FR')} FCFA) est ${k.rarStatut === 'rouge' ? 'sensiblement ' : ''}inférieur à la cible (${k.rarCible.toLocaleString('fr-FR')} FCFA).` });
  }
  if (k.encaissements > 0 && (k.retroAcquises / k.encaissements) * 100 > seuils.retroPctEncaissementsMax) {
    liste.push({ niveau: 'orange', texte: `Les rétrocessions représentent ${Math.round((k.retroAcquises / k.encaissements) * 100)} % des encaissements (seuil : ${seuils.retroPctEncaissementsMax} %).` });
  }
  if (k.engagementsRestants > seuils.engagementsMax) {
    liste.push({ niveau: 'orange', texte: `Les engagements de rétrocessions non versées (${k.engagementsRestants.toLocaleString('fr-FR')} FCFA) dépassent le seuil configuré.` });
  }
  return { kpis: k, alertes: liste };
}

// Snapshot quotidien (§29 graphiques d'évolution) — idempotent par jour (upsert)
async function snapshotDuJour() {
  // Balayage : les abonnements échus passent à 'expired' (fin de droit aux
  // rétrocessions), les réservations de places périmées expirent.
  await prisma.subscription.updateMany({
    where: { statut: 'active', expiresAt: { not: null, lt: new Date() } },
    data: { statut: 'expired' },
  }).catch(() => {});
  await prisma.referralPromotionSlot.updateMany({
    where: { statut: 'reserve', expiresAt: { lt: new Date() } },
    data: { statut: 'expire' },
  }).catch(() => {});

  const jour = new Date(); jour.setUTCHours(0, 0, 0, 0);
  const k = await kpis();
  const nouveaux = await prisma.subscription.count({ where: { startedAt: { gte: jour } } });
  const actifs = await prisma.subscription.count({ where: { statut: 'active' } });
  const a = await alertes();
  return prisma.profitabilitySnapshot.upsert({
    where: { jour },
    create: {
      jour, caFacial: k.caFacial, encaissements: k.encaissements, reductions: k.reductions,
      retroAcquises: k.retroAcquises, retroPayees: k.retroPayees, engagementsRestants: k.engagementsRestants,
      rar: k.rar, rarMoyen: k.rarMoyen, margeContributive: k.margeContributive, referralCac: k.referralCac,
      coefK: k.coefK, abonnesActifs: actifs, nouveauxAbonnes: nouveaux,
      detail: JSON.stringify({ alertes: a.alertes }),
    },
    update: {
      caFacial: k.caFacial, encaissements: k.encaissements, reductions: k.reductions,
      retroAcquises: k.retroAcquises, retroPayees: k.retroPayees, engagementsRestants: k.engagementsRestants,
      rar: k.rar, rarMoyen: k.rarMoyen, margeContributive: k.margeContributive, referralCac: k.referralCac,
      coefK: k.coefK, abonnesActifs: actifs, nouveauxAbonnes: nouveaux,
      detail: JSON.stringify({ alertes: a.alertes }),
    },
  });
}

function safeJson(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }

module.exports = { kpis, alertes, snapshotDuJour };
