// Politique commerciale VERSIONNÉE (§2) — jamais de valeurs codées en dur.
// Chaque modification crée une NOUVELLE version ; les transactions passées
// gardent la leur (policyId figé sur Subscription).

const prisma = require('../../data/prisma-store');
const { POLICY_DEFAUT } = require('./regles');
const audit = require('./audit');

// Politique active (créée à la volée depuis les valeurs par défaut de la spec
// si aucune n'existe encore — version 1)
async function active() {
  let p = await prisma.referralPolicy.findFirst({ where: { actif: true }, orderBy: { version: 'desc' } });
  if (!p) {
    p = await prisma.referralPolicy.create({
      data: {
        version: 1,
        basePriceRef: POLICY_DEFAUT.basePrice,
        discountRate: POLICY_DEFAUT.discountRate,
        commissionRate: POLICY_DEFAUT.commissionRate,
        discountedReferralsLimit: POLICY_DEFAUT.discountedReferralsLimit,
        minimumNetCost: POLICY_DEFAUT.minimumNetCost,
        referralDepth: 1,
      },
    });
  }
  return p;
}

// Adapte une ligne ReferralPolicy au format attendu par les fonctions pures
function versRegles(p, basePrice) {
  return {
    basePrice: basePrice != null ? basePrice : p.basePriceRef,
    discountRate: p.discountRate,
    commissionRate: p.commissionRate,
    discountedReferralsLimit: p.discountedReferralsLimit,
    minimumNetCost: p.minimumNetCost,
    referralDepth: p.referralDepth,
  };
}

// Nouvelle version (l'ancienne est désactivée mais JAMAIS supprimée — historisation)
async function nouvelleVersion(champs, acteurId) {
  const courante = await active();
  const data = {
    version: courante.version + 1,
    basePriceRef: int(champs.basePriceRef, courante.basePriceRef),
    discountRate: int(champs.discountRate, courante.discountRate),
    commissionRate: int(champs.commissionRate, courante.commissionRate),
    discountedReferralsLimit: int(champs.discountedReferralsLimit, courante.discountedReferralsLimit),
    minimumNetCost: int(champs.minimumNetCost, courante.minimumNetCost),
    referralDepth: 1, // §10 : strictement direct, non modifiable
    slotTtlHeures: int(champs.slotTtlHeures, courante.slotTtlHeures),
    payoutMinimum: int(champs.payoutMinimum, courante.payoutMinimum),
    payoutDelaiJours: int(champs.payoutDelaiJours, courante.payoutDelaiJours),
    payoutLimiteJour: intOuNull(champs.payoutLimiteJour, courante.payoutLimiteJour),
    payoutLimiteMois: intOuNull(champs.payoutLimiteMois, courante.payoutLimiteMois),
    rarCibleMoyen: int(champs.rarCibleMoyen, courante.rarCibleMoyen),
    rarSeuilOrangePct: int(champs.rarSeuilOrangePct, courante.rarSeuilOrangePct),
    alertes: champs.alertes !== undefined ? champs.alertes : courante.alertes,
    messagesPartage: champs.messagesPartage !== undefined ? champs.messagesPartage : courante.messagesPartage,
    createdById: acteurId || null,
  };
  const [nouvelle] = await prisma.$transaction([
    prisma.referralPolicy.create({ data }),
    prisma.referralPolicy.update({ where: { id: courante.id }, data: { actif: false } }),
  ]);
  await audit.log(acteurId, 'policy.nouvelle-version', 'ReferralPolicy', nouvelle.id, courante, data);
  return nouvelle;
}

function int(v, defaut) { const n = parseInt(v, 10); return Number.isFinite(n) ? n : defaut; }
function intOuNull(v, defaut) {
  if (v === '' || v === null) return null;
  if (v === undefined) return defaut;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : defaut;
}

module.exports = { active, versRegles, nouvelleVersion };
