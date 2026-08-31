// Migration ADDITIVE n° 8 — librairie en ligne (prix des livres + commandes)
// Usage : node scripts/migrate-librairie.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await prisma.$executeRawUnsafe(`ALTER TABLE "LivreVitrine"
    ADD COLUMN IF NOT EXISTS "description" TEXT,
    ADD COLUMN IF NOT EXISTS "prix" INTEGER`);
  console.log('OK : colonnes LivreVitrine.description / prix');

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "LivreCommande" (
    "id" TEXT NOT NULL, "livreId" TEXT, "livreTitre" TEXT NOT NULL,
    "userId" TEXT, "nom" TEXT NOT NULL, "telephone" TEXT NOT NULL, "email" TEXT,
    "quantite" INTEGER NOT NULL DEFAULT 1, "lieu" TEXT NOT NULL, "note" TEXT,
    "modePaiement" TEXT NOT NULL, "operateur" TEXT, "refTransaction" TEXT,
    "montant" INTEGER, "statut" TEXT NOT NULL DEFAULT 'nouvelle', "noteAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LivreCommande_pkey" PRIMARY KEY ("id")
  )`);
  console.log('OK : table LivreCommande');

  // FK : la commande survit à la suppression du livre ou du compte (SET NULL).
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "LivreCommande" ADD CONSTRAINT "LivreCommande_livreId_fkey"
      FOREIGN KEY ("livreId") REFERENCES "LivreVitrine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  await prisma.$executeRawUnsafe(`DO $$ BEGIN
    ALTER TABLE "LivreCommande" ADD CONSTRAINT "LivreCommande_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  console.log('OK : clés étrangères (SET NULL)');

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "LivreCommande_statut_createdAt_idx" ON "LivreCommande"("statut", "createdAt")`
  );
  console.log('OK : index statut/createdAt');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
