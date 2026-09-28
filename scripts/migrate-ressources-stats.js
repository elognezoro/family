// Migration ADDITIVE n° 12 — compteurs de fréquentation de la banque de ressources
//   RessourceDidactique.vues / .telechargements (par ressource)
//   SiteStat.ressourcesVisites (consultations de la page /ressources)
// Usage : node scripts/migrate-ressources-stats.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  await prisma.$executeRawUnsafe(`ALTER TABLE "RessourceDidactique" ADD COLUMN IF NOT EXISTS "vues" INTEGER NOT NULL DEFAULT 0`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "RessourceDidactique" ADD COLUMN IF NOT EXISTS "telechargements" INTEGER NOT NULL DEFAULT 0`);
  console.log('OK : colonnes RessourceDidactique.vues / telechargements');
  await prisma.$executeRawUnsafe(`ALTER TABLE "SiteStat" ADD COLUMN IF NOT EXISTS "ressourcesVisites" INTEGER NOT NULL DEFAULT 0`);
  console.log('OK : colonne SiteStat.ressourcesVisites');
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
