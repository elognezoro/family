// Migration ADDITIVE n° 13 — mode compétition (Competition, Competiteur, ResultatEpreuve)
// Usage : node scripts/migrate-competitions.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Competition" (
    "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "titre" TEXT NOT NULL,
    "description" TEXT, "reglement" TEXT,
    "epreuves" JSONB NOT NULL DEFAULT '[]',
    "debutAt" TIMESTAMP(3), "finAt" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'brouillon',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Competition_slug_key" ON "Competition"("slug")`);
  console.log('OK : table Competition');

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Competiteur" (
    "id" TEXT NOT NULL, "competitionId" TEXT NOT NULL, "userId" TEXT,
    "nom" TEXT NOT NULL, "prenoms" TEXT NOT NULL, "genre" TEXT NOT NULL, "niveau" TEXT NOT NULL,
    "etablissement" TEXT, "ville" TEXT, "telephone" TEXT NOT NULL, "email" TEXT NOT NULL,
    "emailVerifie" BOOLEAN NOT NULL DEFAULT false, "codeEmail" TEXT, "codeExpireAt" TIMESTAMP(3),
    "engagementAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jeton" TEXT NOT NULL,
    "scoreTotal" INTEGER NOT NULL DEFAULT 0, "tempsTotalMs" INTEGER NOT NULL DEFAULT 0,
    "nbEpreuves" INTEGER NOT NULL DEFAULT 0, "termineAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Competiteur_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Competiteur_jeton_key" ON "Competiteur"("jeton")`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Competiteur_competitionId_email_key" ON "Competiteur"("competitionId", "email")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Competiteur_competitionId_scoreTotal_tempsTotalMs_idx" ON "Competiteur"("competitionId", "scoreTotal", "tempsTotalMs")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "Competiteur" ADD CONSTRAINT "Competiteur_competitionId_fkey"
      FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "Competiteur" ADD CONSTRAINT "Competiteur_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : table Competiteur (FK competition CASCADE, user SET NULL)');

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ResultatEpreuve" (
    "id" TEXT NOT NULL, "competiteurId" TEXT NOT NULL, "epreuveSlug" TEXT NOT NULL,
    "debutAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "finAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0, "total" INTEGER NOT NULL DEFAULT 0,
    "tempsMs" INTEGER NOT NULL DEFAULT 0, "reponses" JSONB,
    CONSTRAINT "ResultatEpreuve_pkey" PRIMARY KEY ("id")
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ResultatEpreuve_competiteurId_epreuveSlug_key" ON "ResultatEpreuve"("competiteurId", "epreuveSlug")`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "ResultatEpreuve" ADD CONSTRAINT "ResultatEpreuve_competiteurId_fkey"
      FOREIGN KEY ("competiteurId") REFERENCES "Competiteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : table ResultatEpreuve (FK competiteur CASCADE)');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
