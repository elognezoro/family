// Parrainage — attributions et places promotionnelles (§10-§12, §19)
//
// - L'attribution filleul→parrain est créée à l'inscription (strictement direct).
// - Les N premières places promotionnelles (−discountRate %) sont gérées par
//   ReferralPromotionSlot : RÉSERVATION avec TTL au moment de la déclaration de
//   paiement, CONFIRMATION définitive dans la transaction de validation,
//   expiration/libération automatique sinon. La contrainte unique
//   (parrainUserId, rang) garantit « jamais plus de N » même en concurrence.

const prisma = require('../../data/prisma-store');
const politique = require('./politique');
const regles = require('./regles');

// Attribution à l'inscription (appelée par routes/auth.js) — idempotente
async function creerAttribution(parrainUserId, filleulUserId, codeUtilise) {
  if (!parrainUserId || parrainUserId === filleulUserId) return null; // auto-parrainage impossible
  try {
    return await prisma.referralAttribution.create({
      data: { parrainUserId, filleulUserId, codeUtilise: codeUtilise || '' },
    });
  } catch (e) {
    return null; // déjà attribué (unique filleulUserId) — un filleul n'a qu'un parrain
  }
}

async function attributionDe(filleulUserId) {
  try {
    return await prisma.referralAttribution.findUnique({ where: { filleulUserId } });
  } catch (e) { return null; }
}

// Libère les réservations expirées d'un parrain (balayage paresseux)
async function expirerReservations(parrainUserId) {
  await prisma.referralPromotionSlot.updateMany({
    where: { parrainUserId, statut: 'reserve', expiresAt: { lt: new Date() } },
    data: { statut: 'expire', filleulUserId: null },
  });
}

// État des places promotionnelles d'un parrain
async function etatSlots(parrainUserId) {
  const policy = await politique.active();
  await expirerReservations(parrainUserId);
  const slots = await prisma.referralPromotionSlot.findMany({
    where: { parrainUserId, statut: { in: ['reserve', 'confirme'] } },
    orderBy: { rang: 'asc' },
  });
  return {
    policy,
    limite: policy.discountedReferralsLimit,
    occupes: slots,
    libres: policy.discountedReferralsLimit - slots.length,
  };
}

// §19 — information transparente du filleul AVANT paiement :
// une place promo est-elle disponible chez son parrain ?
// RÈGLE : la réduction est un avantage UNIQUE — un filleul dont la place a déjà
// été CONFIRMÉE (premier abonnement validé au tarif réduit) ne l'a plus jamais
// pour ses renouvellements.
async function infoFilleul(filleulUserId) {
  const attr = await attributionDe(filleulUserId);
  if (!attr) return { aParrain: false };
  const dejaConsomme = await prisma.referralPromotionSlot.findFirst({
    where: { parrainUserId: attr.parrainUserId, filleulUserId, statut: 'confirme' },
  });
  if (dejaConsomme) {
    const etat0 = await etatSlots(attr.parrainUserId);
    return { aParrain: true, parrainUserId: attr.parrainUserId, attribution: attr, placeDisponible: false, dejaConsomme: true, tauxReduction: etat0.policy.discountRate };
  }
  // Place déjà réservée pour LUI ? (re-déclaration en cours)
  const reserveeLui = await prisma.referralPromotionSlot.findFirst({
    where: { parrainUserId: attr.parrainUserId, filleulUserId, statut: 'reserve' },
  });
  const etat = await etatSlots(attr.parrainUserId);
  return {
    aParrain: true,
    parrainUserId: attr.parrainUserId,
    attribution: attr,
    placeDisponible: !!reserveeLui || etat.libres > 0,
    dejaConsomme: false,
    tauxReduction: etat.policy.discountRate,
  };
}

// Réserve une place promotionnelle pour un filleul (TTL slotTtlHeures).
// Retourne { rang } ou null si plus de place. Résiste à la concurrence :
// la contrainte unique (parrain, rang) fait échouer le perdant, qui réessaie
// sur le rang suivant.
async function reserverSlot(parrainUserId, filleulUserId) {
  const policy = await politique.active();
  await expirerReservations(parrainUserId);

  // Réduction déjà CONSOMMÉE par ce filleul (premier abonnement validé au
  // tarif réduit) → plus jamais de nouvelle réduction (renouvellements au plein tarif)
  const consommee = await prisma.referralPromotionSlot.findFirst({
    where: { parrainUserId, filleulUserId, statut: 'confirme' },
  });
  if (consommee) return null;

  // Réservation en cours pour ce filleul ? (re-déclaration) → la prolonger
  const existante = await prisma.referralPromotionSlot.findFirst({
    where: { parrainUserId, filleulUserId, statut: 'reserve' },
  });
  const ttl = new Date(Date.now() + policy.slotTtlHeures * 3600 * 1000);
  if (existante) {
    await prisma.referralPromotionSlot.update({ where: { id: existante.id }, data: { expiresAt: ttl } });
    return { rang: existante.rang };
  }

  for (let essai = 0; essai < policy.discountedReferralsLimit; essai++) {
    const pris = await prisma.referralPromotionSlot.findMany({
      where: { parrainUserId, statut: { in: ['reserve', 'confirme'] } },
      select: { rang: true },
    });
    const occupes = new Set(pris.map((s) => s.rang));
    let rang = null;
    for (let r = 1; r <= policy.discountedReferralsLimit; r++) if (!occupes.has(r)) { rang = r; break; }
    if (rang === null) return null; // toutes les places sont prises

    try {
      // Rang jamais utilisé → create ; rang expiré/libéré → le recycler par update conditionnel
      const recycle = await prisma.referralPromotionSlot.updateMany({
        where: { parrainUserId, rang, statut: { in: ['expire', 'libere'] } },
        data: { statut: 'reserve', filleulUserId, reservedAt: new Date(), expiresAt: ttl, confirmedAt: null },
      });
      if (recycle.count === 1) return { rang };
      await prisma.referralPromotionSlot.create({
        data: { parrainUserId, rang, filleulUserId, expiresAt: ttl },
      });
      return { rang };
    } catch (e) {
      // P2002 : un concurrent a pris ce rang — on retente sur le suivant
      if (e && e.code === 'P2002') continue;
      throw e;
    }
  }
  return null;
}

// Libère la réservation d'un filleul (refus admin, abandon)
async function libererSlot(filleulUserId) {
  await prisma.referralPromotionSlot.updateMany({
    where: { filleulUserId, statut: 'reserve' },
    data: { statut: 'libere', filleulUserId: null },
  });
}

// Statistiques d'acquisition d'un parrain (§17)
async function statsParrain(parrainUserId) {
  const [inscrits, valides, promo] = await Promise.all([
    prisma.referralAttribution.count({ where: { parrainUserId } }),
    prisma.referralAttribution.count({ where: { parrainUserId, statut: 'valide' } }),
    prisma.referralAttribution.count({ where: { parrainUserId, statut: 'valide', slotRang: { not: null } } }),
  ]);
  return { inscrits, filleulsPayants: valides, filleulsPromotionnels: promo, filleulsSupplementaires: valides - promo };
}

module.exports = {
  creerAttribution,
  attributionDe,
  infoFilleul,
  reserverSlot,
  libererSlot,
  expirerReservations,
  etatSlots,
  statsParrain,
};
