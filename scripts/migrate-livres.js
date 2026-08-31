// Migration ADDITIVE n° 7 — vitrine des ouvrages (couvertures administrables)
// Usage : node scripts/migrate-livres.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "LivreVitrine" (
    "id" TEXT NOT NULL, "titre" TEXT NOT NULL, "niveau" TEXT NOT NULL,
    "sousTitre" TEXT, "imageUrl" TEXT, "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LivreVitrine_pkey" PRIMARY KEY ("id")
  )`);
  console.log('OK : table LivreVitrine');
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
