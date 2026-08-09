// Modèle économique du COACHING (préexistant) — désormais CONFIGURABLE par
// l'admin : part reversée au coach (%) et taux de commission de parrainage
// (% de la part plateforme) sur les missions.
//
// Les valeurs vivent sur la ligne singleton SiteStat (colonnes ajoutées par
// scripts/migrate-eco-coaching.js). Lecture en SQL brut TOLÉRANTE : tant que
// la migration n'est pas appliquée, les valeurs historiques de config/app.js
// (80 % / 10 %) restent en vigueur — aucun impact sur l'existant.
//
// Les montants des commissions déjà enregistrées ne sont JAMAIS recalculés :
// un changement de taux ne vaut que pour les missions futures.
const prisma = require('../data/prisma-store');
const APP = require('../config/app');

const DEFAUTS = { coachSharePct: 80, coachingReferralPct: 10 };
let cache = { ...DEFAUTS };
let chargeA = 0;
const TTL_MS = 60 * 1000;

async function rafraichir(force) {
  if (!force && Date.now() - chargeA < TTL_MS) return cache;
  chargeA = Date.now();
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT "coachSharePct", "coachingReferralPct" FROM "SiteStat" WHERE "id" = 'site'`
    );
    const r = rows && rows[0];
    if (r) {
      cache = {
        coachSharePct: r.coachSharePct == null ? DEFAUTS.coachSharePct : Number(r.coachSharePct),
        coachingReferralPct: r.coachingReferralPct == null ? DEFAUTS.coachingReferralPct : Number(r.coachingReferralPct),
      };
    }
  } catch (e) { /* colonnes pas encore migrées : défauts historiques */ }
  // Répercuter sur APP : tous les appels existants (partCoach, partPlateforme,
  // partCommercial) utilisent ces champs — aucun site d'appel à modifier.
  APP.pricing.coachSharePct = cache.coachSharePct;
  APP.referralPct = cache.coachingReferralPct;
  return cache;
}

async function enregistrer({ coachSharePct, coachingReferralPct }) {
  const part = Math.min(95, Math.max(50, parseInt(coachSharePct, 10) || DEFAUTS.coachSharePct));
  const taux = Math.min(100, Math.max(0, parseInt(coachingReferralPct, 10) || 0));
  await prisma.$executeRawUnsafe(
    `UPDATE "SiteStat" SET "coachSharePct" = $1, "coachingReferralPct" = $2 WHERE "id" = 'site'`,
    part, taux
  );
  await rafraichir(true);
  return { coachSharePct: part, coachingReferralPct: taux };
}

module.exports = { rafraichir, enregistrer, DEFAUTS };
