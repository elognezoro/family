// Migration ADDITIVE n° 10 — banque de ressources didactiques + dons
// Usage : node scripts/migrate-ressources-dons.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "RessourceDidactique" (
    "id" TEXT NOT NULL, "titre" TEXT NOT NULL, "description" TEXT,
    "niveau" TEXT NOT NULL, "type" TEXT NOT NULL, "url" TEXT NOT NULL,
    "mime" TEXT, "taille" INTEGER, "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RessourceDidactique_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "RessourceDidactique_actif_ordre_idx" ON "RessourceDidactique"("actif", "ordre")`
  );
  console.log('OK : table RessourceDidactique');

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Don" (
    "id" TEXT NOT NULL, "userId" TEXT, "nom" TEXT NOT NULL,
    "telephone" TEXT, "email" TEXT, "montant" INTEGER NOT NULL,
    "operateur" TEXT NOT NULL, "refTransaction" TEXT NOT NULL,
    "message" TEXT, "statut" TEXT NOT NULL DEFAULT 'declare', "noteAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Don_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "Don" ADD CONSTRAINT "Don_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "Don_statut_createdAt_idx" ON "Don"("statut", "createdAt")`
  );
  console.log('OK : table Don (FK SET NULL)');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
