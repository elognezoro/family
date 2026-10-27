// Migration ADDITIVE n° 20 — horodatage des photos de pièces d'identité (élection AIDUS)
//   ElectionPiece.prisLe : heure de prise relevée sur l'appareil de l'électeur (indicative)
//   ElectionPiece.source : « camera » (caméra du site) ou « appareil » (appareil photo du téléphone)
//   L'heure de réception (serveur, fiable) est ElectionPiece.createdAt ; elle est aussi
//   incrustée dans l'image. Aucune donnée existante n'est modifiée.
// Usage : node scripts/migrate-elections-horodatage.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const sql = (s) => prisma.$executeRawUnsafe(s);
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  await sql(`ALTER TABLE "ElectionPiece" ADD COLUMN IF NOT EXISTS "prisLe" TIMESTAMP(3)`);
  await sql(`ALTER TABLE "ElectionPiece" ADD COLUMN IF NOT EXISTS "source" TEXT`);
  console.log('OK : ElectionPiece.prisLe, ElectionPiece.source');
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
