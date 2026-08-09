// Migration ADDITIVE n° 3 — moteur d'abonnement, parrainage & rétrocessions
// 11 nouvelles tables + 2 colonnes (User.fraudStatus, FormationEnrollment.subscriptionId).
// Idempotente (IF NOT EXISTS partout), AUCUN impact sur les données existantes.
// Usage : node scripts/migrate-parrainage.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

const SQL = [
  `CREATE TABLE IF NOT EXISTS "ReferralPolicy" (
    "id" TEXT NOT NULL, "version" INTEGER NOT NULL, "basePriceRef" INTEGER NOT NULL,
    "discountRate" INTEGER NOT NULL, "commissionRate" INTEGER NOT NULL,
    "discountedReferralsLimit" INTEGER NOT NULL, "minimumNetCost" INTEGER NOT NULL,
    "referralDepth" INTEGER NOT NULL DEFAULT 1, "slotTtlHeures" INTEGER NOT NULL DEFAULT 72,
    "payoutMinimum" INTEGER NOT NULL DEFAULT 1000, "payoutDelaiJours" INTEGER NOT NULL DEFAULT 0,
    "payoutLimiteJour" INTEGER, "payoutLimiteMois" INTEGER,
    "rarCibleMoyen" INTEGER NOT NULL DEFAULT 8500, "rarSeuilOrangePct" INTEGER NOT NULL DEFAULT 95,
    "alertes" TEXT, "messagesPartage" TEXT, "actif" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralPolicy_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ReferralPolicy_version_key" ON "ReferralPolicy"("version")`,

  `CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "planId" TEXT, "policyId" TEXT NOT NULL,
    "referralId" TEXT, "prixFacial" INTEGER NOT NULL, "reduction" INTEGER NOT NULL DEFAULT 0,
    "sourceReduction" TEXT, "montantPaye" INTEGER NOT NULL, "operateur" TEXT, "refTransaction" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'pending', "startedAt" TIMESTAMP(3), "expiresAt" TIMESTAMP(3),
    "idempotencyKey" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "FormationOffre"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Subscription_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "ReferralPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_referralId_key" ON "Subscription"("referralId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_idempotencyKey_key" ON "Subscription"("idempotencyKey")`,
  `CREATE INDEX IF NOT EXISTS "Subscription_userId_statut_idx" ON "Subscription"("userId", "statut")`,

  `CREATE TABLE IF NOT EXISTS "ReferralAttribution" (
    "id" TEXT NOT NULL, "parrainUserId" TEXT NOT NULL, "filleulUserId" TEXT NOT NULL,
    "codeUtilise" TEXT NOT NULL, "statut" TEXT NOT NULL DEFAULT 'inscrit',
    "subscriptionId" TEXT, "slotRang" INTEGER, "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralAttribution_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ReferralAttribution_parrainUserId_fkey" FOREIGN KEY ("parrainUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralAttribution_filleulUserId_fkey" FOREIGN KEY ("filleulUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ReferralAttribution_filleulUserId_key" ON "ReferralAttribution"("filleulUserId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ReferralAttribution_subscriptionId_key" ON "ReferralAttribution"("subscriptionId")`,
  `CREATE INDEX IF NOT EXISTS "ReferralAttribution_parrainUserId_statut_idx" ON "ReferralAttribution"("parrainUserId", "statut")`,

  `CREATE TABLE IF NOT EXISTS "ReferralPromotionSlot" (
    "id" TEXT NOT NULL, "parrainUserId" TEXT NOT NULL, "rang" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'reserve', "filleulUserId" TEXT,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL, "confirmedAt" TIMESTAMP(3),
    CONSTRAINT "ReferralPromotionSlot_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ReferralPromotionSlot_parrainUserId_fkey" FOREIGN KEY ("parrainUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ReferralPromotionSlot_parrainUserId_rang_key" ON "ReferralPromotionSlot"("parrainUserId", "rang")`,
  `CREATE INDEX IF NOT EXISTS "ReferralPromotionSlot_statut_expiresAt_idx" ON "ReferralPromotionSlot"("statut", "expiresAt")`,

  `CREATE TABLE IF NOT EXISTS "FinancialWallet" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "acquis" INTEGER NOT NULL DEFAULT 0,
    "disponible" INTEGER NOT NULL DEFAULT 0, "enAttente" INTEGER NOT NULL DEFAULT 0,
    "verse" INTEGER NOT NULL DEFAULT 0, "moyenPaiement" TEXT, "numeroPaiement" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinancialWallet_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FinancialWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "FinancialWallet_userId_key" ON "FinancialWallet"("userId")`,

  `CREATE TABLE IF NOT EXISTS "FinancialLedgerEntry" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "montant" INTEGER NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'XOF', "taux" INTEGER, "filleulSourceId" TEXT,
    "subscriptionId" TEXT, "payoutId" TEXT, "referenceExterne" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'comptabilise', "motif" TEXT, "creePar" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinancialLedgerEntry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FinancialLedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "FinancialLedgerEntry_idempotencyKey_key" ON "FinancialLedgerEntry"("idempotencyKey")`,
  `CREATE INDEX IF NOT EXISTS "FinancialLedgerEntry_userId_type_idx" ON "FinancialLedgerEntry"("userId", "type")`,
  `CREATE INDEX IF NOT EXISTS "FinancialLedgerEntry_subscriptionId_idx" ON "FinancialLedgerEntry"("subscriptionId")`,

  `CREATE TABLE IF NOT EXISTS "Payout" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "montant" INTEGER NOT NULL,
    "frais" INTEGER NOT NULL DEFAULT 0, "moyen" TEXT NOT NULL, "numeroBeneficiaire" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'requested', "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3), "processedById" TEXT, "referenceExterne" TEXT, "motifEchec" TEXT,
    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Payout_statut_idx" ON "Payout"("statut")`,
  `CREATE INDEX IF NOT EXISTS "Payout_userId_idx" ON "Payout"("userId")`,

  `CREATE TABLE IF NOT EXISTS "FraudFlag" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL,
    "severite" TEXT NOT NULL DEFAULT 'info', "detail" TEXT, "statut" TEXT NOT NULL DEFAULT 'REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "resolvedById" TEXT, "resolvedAt" TIMESTAMP(3),
    CONSTRAINT "FraudFlag_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "FraudFlag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "FraudFlag_statut_idx" ON "FraudFlag"("statut")`,
  `CREATE INDEX IF NOT EXISTS "FraudFlag_userId_idx" ON "FraudFlag"("userId")`,

  `CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL, "acteurId" TEXT, "action" TEXT NOT NULL, "cibleType" TEXT, "cibleId" TEXT,
    "avant" TEXT, "apres" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_cibleType_cibleId_idx" ON "AuditLog"("cibleType", "cibleId")`,

  `CREATE TABLE IF NOT EXISTS "ProfitabilitySnapshot" (
    "id" TEXT NOT NULL, "jour" TIMESTAMP(3) NOT NULL,
    "caFacial" INTEGER NOT NULL DEFAULT 0, "encaissements" INTEGER NOT NULL DEFAULT 0,
    "reductions" INTEGER NOT NULL DEFAULT 0, "retroAcquises" INTEGER NOT NULL DEFAULT 0,
    "retroPayees" INTEGER NOT NULL DEFAULT 0, "engagementsRestants" INTEGER NOT NULL DEFAULT 0,
    "rar" INTEGER NOT NULL DEFAULT 0, "rarMoyen" INTEGER NOT NULL DEFAULT 0,
    "margeContributive" INTEGER NOT NULL DEFAULT 0, "referralCac" INTEGER NOT NULL DEFAULT 0,
    "coefK" DOUBLE PRECISION NOT NULL DEFAULT 0, "abonnesActifs" INTEGER NOT NULL DEFAULT 0,
    "nouveauxAbonnes" INTEGER NOT NULL DEFAULT 0, "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfitabilitySnapshot_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ProfitabilitySnapshot_jour_key" ON "ProfitabilitySnapshot"("jour")`,

  `CREATE TABLE IF NOT EXISTS "ProfitabilityScenario" (
    "id" TEXT NOT NULL, "nom" TEXT NOT NULL, "params" TEXT NOT NULL, "resultats" TEXT,
    "predefini" BOOLEAN NOT NULL DEFAULT false, "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfitabilityScenario_pkey" PRIMARY KEY ("id")
  )`,

  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "fraudStatus" TEXT NOT NULL DEFAULT 'NORMAL'`,
  `ALTER TABLE "FormationEnrollment" ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT`,
];

(async () => {
  const avant = await prisma.user.count();
  console.log('Utilisateurs AVANT :', avant);
  for (const sql of SQL) {
    await prisma.$executeRawUnsafe(sql);
    console.log('OK :', sql.trim().slice(0, 66).replace(/\s+/g, ' ') + '…');
  }
  const apres = await prisma.user.count();
  console.log('Utilisateurs APRÈS :', apres);
  const tables = await prisma.$queryRawUnsafe(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN
     ('ReferralPolicy','Subscription','ReferralAttribution','ReferralPromotionSlot','FinancialWallet',
      'FinancialLedgerEntry','Payout','FraudFlag','AuditLog','ProfitabilitySnapshot','ProfitabilityScenario')
     ORDER BY table_name`
  );
  console.log('Tables créées (' + tables.length + '/11) :', tables.map((t) => t.table_name).join(', '));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
