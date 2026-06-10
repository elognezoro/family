// Parrainage : génération de code unique + données du tableau de bord + commissions.
const crypto = require('crypto');
const prisma = require('../data/prisma-store');
const APP = require('../config/app');

// Code court lisible (8 caractères alphanumériques majuscules)
function genCode() {
  const c = crypto.randomBytes(8).toString('base64').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return (c + crypto.randomBytes(4).toString('hex').toUpperCase()).slice(0, 8);
}

// Garantit qu'un utilisateur a un code de parrainage
async function ensureCode(userId) {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (u && u.referralCode) return u.referralCode;
  for (let i = 0; i < 5; i++) {
    const code = genCode();
    try {
      await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
      return code;
    } catch (e) { /* collision improbable → réessaie */ }
  }
  return null;
}

// Enregistre une commission (idempotent grâce à @@unique(missionId,type))
async function recordCommission({ refereeUserId, missionId, type, montant }) {
  const referee = await prisma.user.findUnique({ where: { id: refereeUserId }, select: { referredById: true } });
  if (!referee || !referee.referredById) return null;
  const amount = APP.partCommercial(montant);
  if (amount <= 0) return null;
  try {
    return await prisma.commission.create({
      data: { referrerUserId: referee.referredById, refereeUserId, missionId, type, amount },
    });
  } catch (e) {
    return null; // déjà enregistrée (contrainte unique)
  }
}

// Données du tableau de bord de parrainage
async function buildData(userId, baseUrl) {
  const code = await ensureCode(userId);
  const referrals = await prisma.user.findMany({
    where: { referredById: userId },
    select: { id: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const commissions = await prisma.commission.findMany({
    where: { referrerUserId: userId },
    orderBy: { createdAt: 'desc' },
  });
  const total = commissions.reduce((s, c) => s + (c.amount || 0), 0);
  const refIds = [...new Set(commissions.map((c) => c.refereeUserId))];
  const refUsers = refIds.length
    ? await prisma.user.findMany({ where: { id: { in: refIds } }, select: { id: true, name: true } })
    : [];
  const nameById = {};
  refUsers.forEach((u) => { nameById[u.id] = u.name; });

  return {
    code,
    link: `${baseUrl}/auth/register?ref=${code}`,
    referrals,
    commissions,
    total,
    nameById,
  };
}

module.exports = { genCode, ensureCode, recordCommission, buildData };
