// Migration ADDITIVE n° 18 — sécurité de l'élection AIDUS
//   Scrutin.terminalCle : clé aléatoire des terminaux du bureau de vote (révocable ;
//     régénérée à la réinitialisation, donc les appareils de test perdent ce statut).
//   Electeur.envoisCode : nombre de codes de confirmation envoyés pour l'électeur
//     (plafond contre l'envoi massif d'e-mails ; remis à zéro avec les votes).
//   Aucune donnée existante n'est modifiée.
// Usage : node scripts/migrate-elections-securite.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const sql = (s) => prisma.$executeRawUnsafe(s);
(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await sql(`ALTER TABLE "Scrutin" ADD COLUMN IF NOT EXISTS "terminalCle" TEXT`);
  await sql(`ALTER TABLE "Electeur" ADD COLUMN IF NOT EXISTS "envoisCode" INTEGER NOT NULL DEFAULT 0`);
  console.log('OK : Scrutin.terminalCle, Electeur.envoisCode');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
