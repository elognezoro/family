// Migration ADDITIVE n° 4 — configuration admin du modèle économique COACHING
// Ajoute 2 colonnes à la ligne singleton SiteStat (part coach %, taux de
// commission parrainage coaching %). Idempotente, zéro impact sur l'existant :
// les valeurs par défaut sont les taux historiques codés en dur (80 / 10).
// Usage : node scripts/migrate-eco-coaching.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

(async () => {
  const avant = await prisma.user.count();
  console.log('Utilisateurs AVANT :', avant);
  for (const sql of [
    `ALTER TABLE "SiteStat" ADD COLUMN IF NOT EXISTS "coachSharePct" INTEGER NOT NULL DEFAULT 80`,
    `ALTER TABLE "SiteStat" ADD COLUMN IF NOT EXISTS "coachingReferralPct" INTEGER NOT NULL DEFAULT 10`,
  ]) {
    await prisma.$executeRawUnsafe(sql);
    console.log('OK :', sql.replace(/\s+/g, ' ').slice(0, 80));
  }
  const rows = await prisma.$queryRawUnsafe(`SELECT "coachSharePct", "coachingReferralPct" FROM "SiteStat" WHERE "id" = 'site'`);
  console.log('Valeurs actuelles :', rows[0] || '(ligne site absente — créée au premier réglage)');
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
