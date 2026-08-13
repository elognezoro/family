// Migration ADDITIVE n° 5 — répétition espacée et gamification (Fonction Publique)
// Crée 2 nouvelles tables autonomes : FpMastery (maîtrise par article, §10)
// et FpGamif (XP, badges, série, §9). Idempotente, zéro impact sur l'existant.
// Usage : node scripts/migrate-fp-progression.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

const SQL = [
  `CREATE TABLE IF NOT EXISTS "FpMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "article" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "bonnes" INTEGER NOT NULL DEFAULT 0,
    "erreurs" INTEGER NOT NULL DEFAULT 0,
    "intervalIdx" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FpMastery_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "FpMastery_userId_article_key" ON "FpMastery"("userId", "article")`,
  `CREATE INDEX IF NOT EXISTS "FpMastery_userId_nextReview_idx" ON "FpMastery"("userId", "nextReview")`,
  `CREATE TABLE IF NOT EXISTS "FpGamif" (
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "serieJours" INTEGER NOT NULL DEFAULT 0,
    "dernierJourActif" TIMESTAMP(3),
    "xpJour" INTEGER NOT NULL DEFAULT 0,
    "jourXp" TIMESTAMP(3),
    "partiesJouees" INTEGER NOT NULL DEFAULT 0,
    "badges" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FpGamif_pkey" PRIMARY KEY ("userId")
  )`,
];

(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  for (const sql of SQL) {
    await prisma.$executeRawUnsafe(sql);
    console.log('OK :', sql.replace(/\s+/g, ' ').slice(0, 72) + '…');
  }
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  const t = await prisma.$queryRawUnsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('FpMastery','FpGamif') ORDER BY table_name`);
  console.log('Tables :', t.map((x) => x.table_name).join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
