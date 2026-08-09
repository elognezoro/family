// Migration ADDITIVE — module Formation (tests psychotechniques)
// Crée 3 nouvelles tables : FormationEnrollment, QuizAttempt, WebAuthnCredential.
// Idempotente (CREATE TABLE IF NOT EXISTS) et SANS AUCUN impact sur les tables
// existantes. Usage : node scripts/migrate-formation.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

const SQL = [
  `CREATE TABLE IF NOT EXISTS "FormationEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "niveau" TEXT NOT NULL DEFAULT 'bepc',
    "objectif" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'pending',
    "motifRefus" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormationEnrollment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FormationEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormationEnrollment_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "FormationEnrollment_userId_key" ON "FormationEnrollment"("userId")`,
  `CREATE INDEX IF NOT EXISTS "FormationEnrollment_statut_idx" ON "FormationEnrollment"("statut")`,

  `CREATE TABLE IF NOT EXISTS "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'entrainement',
    "nbQuestions" INTEGER NOT NULL,
    "questions" TEXT NOT NULL,
    "reponses" TEXT NOT NULL DEFAULT '{}',
    "score" INTEGER,
    "dureeSec" INTEGER,
    "tempsMaxSec" INTEGER,
    "statut" TEXT NOT NULL DEFAULT 'en_cours',
    "statsJson" TEXT,
    "diagnostic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_categorie_idx" ON "QuizAttempt"("userId", "categorie")`,

  `CREATE TABLE IF NOT EXISTS "WebAuthnCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "transports" TEXT,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    CONSTRAINT "WebAuthnCredential_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "WebAuthnCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "WebAuthnCredential_credentialId_key" ON "WebAuthnCredential"("credentialId")`,
  `CREATE INDEX IF NOT EXISTS "WebAuthnCredential_userId_idx" ON "WebAuthnCredential"("userId")`,
];

(async () => {
  const avantUsers = await prisma.user.count();
  console.log('Utilisateurs AVANT migration :', avantUsers);
  for (const sql of SQL) {
    await prisma.$executeRawUnsafe(sql);
    console.log('OK :', sql.trim().slice(0, 70).replace(/\s+/g, ' ') + '…');
  }
  const apresUsers = await prisma.user.count();
  console.log('Utilisateurs APRÈS migration :', apresUsers);
  const tables = await prisma.$queryRawUnsafe(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('FormationEnrollment','QuizAttempt','WebAuthnCredential') ORDER BY table_name`
  );
  console.log('Tables créées :', tables.map((t) => t.table_name).join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
