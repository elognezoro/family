// Migration ADDITIVE n° 14 — téléchargement payant des ressources didactiques
//   RessourceDidactique.telechargementPayant (faux pour les ressources existantes)
//   Table AchatTelechargement (versements déclarés, liens personnels)
// Usage : node scripts/migrate-telechargements-payants.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  console.log('Ressources AVANT :', await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM "RessourceDidactique"`));

  await prisma.$executeRawUnsafe(`ALTER TABLE "RessourceDidactique" ADD COLUMN IF NOT EXISTS "telechargementPayant" BOOLEAN NOT NULL DEFAULT false`);
  console.log('OK : colonne RessourceDidactique.telechargementPayant');

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "AchatTelechargement" (
    "id" TEXT NOT NULL, "ressourceId" TEXT, "titreRessource" TEXT NOT NULL,
    "nom" TEXT, "email" TEXT NOT NULL, "telephone" TEXT,
    "montant" INTEGER NOT NULL, "operateur" TEXT NOT NULL, "refTransaction" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'declare', "noteAdmin" TEXT,
    "jeton" TEXT NOT NULL, "expireAt" TIMESTAMP(3), "lienEnvoyeAt" TIMESTAMP(3),
    "telechargements" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AchatTelechargement_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "AchatTelechargement_jeton_key" ON "AchatTelechargement"("jeton")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AchatTelechargement_statut_createdAt_idx" ON "AchatTelechargement"("statut", "createdAt")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "AchatTelechargement" ADD CONSTRAINT "AchatTelechargement_ressourceId_fkey"
      FOREIGN KEY ("ressourceId") REFERENCES "RessourceDidactique"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : table AchatTelechargement');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  console.log('Ressources APRÈS :', await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM "RessourceDidactique"`));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
