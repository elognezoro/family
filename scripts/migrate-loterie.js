// Migration ADDITIVE n° 6 — Loterie EduWeb Éditions
// 5 tables autonomes : séries de codes, codes, tirages, lauréats, réglages.
// Idempotente, zéro impact sur l'existant.
// Usage : node scripts/migrate-loterie.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

const SQL = [
  `CREATE TABLE IF NOT EXISTS "LoterieSerie" (
    "id" TEXT NOT NULL, "ouvrage" TEXT NOT NULL, "discipline" TEXT,
    "anneeScolaire" TEXT NOT NULL, "codeAnnee" TEXT NOT NULL,
    "niveauCode" TEXT NOT NULL, "niveauLabel" TEXT NOT NULL,
    "nbCodes" INTEGER NOT NULL, "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoterieSerie_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "LoterieSerie_codeAnnee_niveauCode_key" ON "LoterieSerie"("codeAnnee", "niveauCode")`,
  `CREATE TABLE IF NOT EXISTS "LoterieCode" (
    "id" TEXT NOT NULL, "serieId" TEXT NOT NULL, "numero" INTEGER NOT NULL,
    "code" TEXT NOT NULL, "codeNorm" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'libre',
    "userId" TEXT, "enregistreAt" TIMESTAMP(3),
    CONSTRAINT "LoterieCode_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "LoterieCode_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "LoterieSerie"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "LoterieCode_code_key" ON "LoterieCode"("code")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "LoterieCode_codeNorm_key" ON "LoterieCode"("codeNorm")`,
  `CREATE INDEX IF NOT EXISTS "LoterieCode_userId_idx" ON "LoterieCode"("userId")`,
  `CREATE INDEX IF NOT EXISTS "LoterieCode_serieId_statut_idx" ON "LoterieCode"("serieId", "statut")`,
  `CREATE TABLE IF NOT EXISTS "LoterieTirage" (
    "id" TEXT NOT NULL, "nbLaureats" INTEGER NOT NULL,
    "automatique" BOOLEAN NOT NULL DEFAULT false, "effectueParId" TEXT,
    "effectueAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoterieTirage_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "LoterieLaureat" (
    "id" TEXT NOT NULL, "tirageId" TEXT NOT NULL, "codeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL, "rang" INTEGER NOT NULL,
    "notifieEmail" BOOLEAN NOT NULL DEFAULT false,
    "notifieSms" BOOLEAN NOT NULL DEFAULT false,
    "notifieWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "notifieAt" TIMESTAMP(3),
    CONSTRAINT "LoterieLaureat_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "LoterieLaureat_tirageId_fkey" FOREIGN KEY ("tirageId") REFERENCES "LoterieTirage"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "LoterieLaureat_codeId_key" ON "LoterieLaureat"("codeId")`,
  `CREATE INDEX IF NOT EXISTS "LoterieLaureat_userId_idx" ON "LoterieLaureat"("userId")`,
  `CREATE TABLE IF NOT EXISTS "LoterieConfig" (
    "id" TEXT NOT NULL DEFAULT 'loterie', "actif" BOOLEAN NOT NULL DEFAULT true,
    "nbParTirage" INTEGER NOT NULL DEFAULT 3, "periodeJours" INTEGER NOT NULL DEFAULT 30,
    "prochainTirage" TIMESTAMP(3),
    "canalEmail" BOOLEAN NOT NULL DEFAULT true,
    "canalSms" BOOLEAN NOT NULL DEFAULT true,
    "canalWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "messageTemplate" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoterieConfig_pkey" PRIMARY KEY ("id")
  )`,
];

(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  for (const sql of SQL) {
    await prisma.$executeRawUnsafe(sql);
    console.log('OK :', sql.replace(/\s+/g, ' ').slice(0, 70) + '…');
  }
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  const t = await prisma.$queryRawUnsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'Loterie%' ORDER BY table_name`);
  console.log('Tables :', t.map((x) => x.table_name).join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
