// Migration ADDITIVE n° 17 — membres du bureau de vote (élection AIDUS)
//   Nouvelle table MembreBureau : adresses e-mail enregistrées par le super admin ;
//   ces membres consultent la liste d'émargement après connexion par lien reçu par e-mail.
//   Aucune table existante n'est modifiée.
// Usage : node scripts/migrate-elections-bureau.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const sql = (s) => prisma.$executeRawUnsafe(s);
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await sql(`CREATE TABLE IF NOT EXISTS "MembreBureau" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL, "email" TEXT NOT NULL, "nom" TEXT,
    "derniereConnexion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MembreBureau_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "MembreBureau_scrutinId_email_key" ON "MembreBureau"("scrutinId", "email")`);
  console.log('OK : MembreBureau');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
