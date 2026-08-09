// Migration ADDITIVE n° 2 — accès payant/autorisé à la Formation
// - Nouvelle table FormationOffre (formules tarifaires fixées par l'admin)
// - Nouvelles colonnes sur FormationEnrollment (type d'accès, paiement déclaré,
//   réduction, expiration)
// Idempotente, sans impact sur les données existantes.
// Usage : node scripts/migrate-formation-offres.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

const SQL = [
  `CREATE TABLE IF NOT EXISTS "FormationOffre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" INTEGER NOT NULL,
    "dureeJours" INTEGER,
    "quotaTentatives" INTEGER,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormationOffre_pkey" PRIMARY KEY ("id")
  )`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "accessType" TEXT NOT NULL DEFAULT 'autorise'`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "offreId" TEXT`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "operateur" TEXT`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "refTransaction" TEXT`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "montantAttendu" INTEGER`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "promoCode" TEXT`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3)`,
  `DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FormationEnrollment_offreId_fkey') THEN
       ALTER TABLE "FormationEnrollment" ADD CONSTRAINT "FormationEnrollment_offreId_fkey"
         FOREIGN KEY ("offreId") REFERENCES "FormationOffre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
     END IF;
   END $$`,
];

(async () => {
  const avant = await prisma.user.count();
  console.log('Utilisateurs AVANT :', avant);
  for (const sql of SQL) {
    await prisma.$executeRawUnsafe(sql);
    console.log('OK :', sql.trim().slice(0, 72).replace(/\s+/g, ' ') + '…');
  }
  const apres = await prisma.user.count();
  console.log('Utilisateurs APRÈS :', apres);
  const cols = await prisma.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'FormationEnrollment' ORDER BY ordinal_position`
  );
  console.log('Colonnes FormationEnrollment :', cols.map((c) => c.column_name).join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
