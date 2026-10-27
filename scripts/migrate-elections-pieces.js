// Migration ADDITIVE n° 16 — pièce d'identité jointe au vote en ligne (élection AIDUS)
//   Nouvelle table ElectionPiece (scan ou photo de la CNI / du passeport, gardé en base :
//   jamais servi publiquement, vu par le Comité électoral seulement).
//   Colonne facultative « pieceId » ajoutée à Emargement et VoteEnAttente.
//   Aucune donnée existante n'est modifiée.
// Usage : node scripts/migrate-elections-pieces.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const sql = (s) => prisma.$executeRawUnsafe(s);
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await sql(`CREATE TABLE IF NOT EXISTS "ElectionPiece" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL,
    "mime" TEXT NOT NULL, "taille" INTEGER NOT NULL, "largeur" INTEGER, "hauteur" INTEGER,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ElectionPiece_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE INDEX IF NOT EXISTS "ElectionPiece_scrutinId_idx" ON "ElectionPiece"("scrutinId")`);
  console.log('OK : ElectionPiece');

  await sql(`ALTER TABLE "Emargement" ADD COLUMN IF NOT EXISTS "pieceId" TEXT`);
  await sql(`ALTER TABLE "VoteEnAttente" ADD COLUMN IF NOT EXISTS "pieceId" TEXT`);
  console.log('OK : Emargement.pieceId, VoteEnAttente.pieceId');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
