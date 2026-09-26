// Migration ADDITIVE n° 11 — colonne discipline sur les ressources didactiques
// Usage : node scripts/migrate-ressources-discipline.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  await prisma.$executeRawUnsafe(`ALTER TABLE "RessourceDidactique" ADD COLUMN IF NOT EXISTS "discipline" TEXT`);
  console.log('OK : colonne RessourceDidactique.discipline');
  // Remplissage des ressources existantes
  const pc = await prisma.$executeRawUnsafe(
    `UPDATE "RessourceDidactique" SET "discipline" = 'Physique-Chimie' WHERE "discipline" IS NULL AND "niveau" ILIKE '%troisi%'`
  );
  const svt = await prisma.$executeRawUnsafe(
    `UPDATE "RessourceDidactique" SET "discipline" = 'SVT' WHERE "discipline" IS NULL AND "niveau" ILIKE '%sixi%'`
  );
  console.log(`OK : disciplines renseignées (Physique-Chimie : ${pc}, SVT : ${svt})`);
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
