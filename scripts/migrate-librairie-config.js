// Migration ADDITIVE n° 9 — réglages de la librairie (seuil de prépaiement)
// Usage : node scripts/migrate-librairie-config.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "LibrairieConfig" (
    "id" TEXT NOT NULL, "seuilPrepaiement" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LibrairieConfig_pkey" PRIMARY KEY ("id")
  )`);
  console.log('OK : table LibrairieConfig');
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
