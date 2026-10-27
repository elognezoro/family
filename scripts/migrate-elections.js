// Migration ADDITIVE n° 15 — élections en ligne (élection du Président de l'AIDUS)
//   Tables Scrutin, ScrutinCandidat, Electeur, Emargement, Bulletin, VoteEnAttente.
//   Aucune table existante n'est modifiée.
// Usage : node scripts/migrate-elections.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const sql = (s) => prisma.$executeRawUnsafe(s);
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await sql(`CREATE TABLE IF NOT EXISTS "Scrutin" (
    "id" TEXT NOT NULL, "titre" TEXT NOT NULL, "sousTitre" TEXT,
    "debut" TIMESTAMP(3) NOT NULL, "fin" TIMESTAMP(3) NOT NULL,
    "reinitialiserA" TIMESTAMP(3), "reinitialiseLe" TIMESTAMP(3),
    "resultatsPublies" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scrutin_pkey" PRIMARY KEY ("id")
  )`);
  console.log('OK : Scrutin');

  await sql(`CREATE TABLE IF NOT EXISTS "ScrutinCandidat" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL, "ordre" INTEGER NOT NULL DEFAULT 0,
    "nom" TEXT NOT NULL, "presentation" TEXT, "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScrutinCandidat_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE INDEX IF NOT EXISTS "ScrutinCandidat_scrutinId_ordre_idx" ON "ScrutinCandidat"("scrutinId", "ordre")`);
  await sql(`DO $$ BEGIN ALTER TABLE "ScrutinCandidat" ADD CONSTRAINT "ScrutinCandidat_scrutinId_fkey"
    FOREIGN KEY ("scrutinId") REFERENCES "Scrutin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : ScrutinCandidat');

  await sql(`CREATE TABLE IF NOT EXISTS "Electeur" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL, "civilite" TEXT,
    "nom" TEXT NOT NULL, "prenom" TEXT NOT NULL, "classe" TEXT NOT NULL,
    "anneeEntree" INTEGER NOT NULL, "anneeDiplome" INTEGER NOT NULL, "arriveeEn" INTEGER,
    "campus" TEXT, "specialite" TEXT, "emails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Electeur_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE INDEX IF NOT EXISTS "Electeur_scrutinId_nom_idx" ON "Electeur"("scrutinId", "nom")`);
  await sql(`DO $$ BEGIN ALTER TABLE "Electeur" ADD CONSTRAINT "Electeur_scrutinId_fkey"
    FOREIGN KEY ("scrutinId") REFERENCES "Scrutin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : Electeur');

  await sql(`CREATE TABLE IF NOT EXISTS "Emargement" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL, "electeurId" TEXT NOT NULL,
    "cni" TEXT NOT NULL, "email" TEXT, "mode" TEXT NOT NULL, "ip" TEXT, "terminal" TEXT,
    "voteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Emargement_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Emargement_scrutinId_electeurId_key" ON "Emargement"("scrutinId", "electeurId")`);
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Emargement_scrutinId_cni_key" ON "Emargement"("scrutinId", "cni")`);
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Emargement_scrutinId_email_key" ON "Emargement"("scrutinId", "email")`);
  await sql(`CREATE INDEX IF NOT EXISTS "Emargement_scrutinId_voteLe_idx" ON "Emargement"("scrutinId", "voteLe")`);
  await sql(`DO $$ BEGIN ALTER TABLE "Emargement" ADD CONSTRAINT "Emargement_electeurId_fkey"
    FOREIGN KEY ("electeurId") REFERENCES "Electeur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : Emargement');

  await sql(`CREATE TABLE IF NOT EXISTS "Bulletin" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL, "candidatId" TEXT NOT NULL,
    CONSTRAINT "Bulletin_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE INDEX IF NOT EXISTS "Bulletin_scrutinId_candidatId_idx" ON "Bulletin"("scrutinId", "candidatId")`);
  console.log('OK : Bulletin');

  await sql(`CREATE TABLE IF NOT EXISTS "VoteEnAttente" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL, "electeurId" TEXT NOT NULL, "candidatId" TEXT NOT NULL,
    "cni" TEXT NOT NULL, "email" TEXT, "codeHash" TEXT,
    "essais" INTEGER NOT NULL DEFAULT 0, "envois" INTEGER NOT NULL DEFAULT 1,
    "mode" TEXT NOT NULL, "ip" TEXT, "terminal" TEXT, "expireAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VoteEnAttente_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE INDEX IF NOT EXISTS "VoteEnAttente_scrutinId_electeurId_idx" ON "VoteEnAttente"("scrutinId", "electeurId")`);
  console.log('OK : VoteEnAttente');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
