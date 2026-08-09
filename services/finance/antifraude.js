// Antifraude (§31) — détection de signaux, JAMAIS de blocage automatique sur
// un seul signal ambigu : les signaux créent des FraudFlag en file de revue,
// la DÉCISION (NORMAL / SUSPICIOUS / BLOCKED) appartient à l'administrateur.

const prisma = require('../../data/prisma-store');
const audit = require('./audit');

async function signaler(userId, type, severite, detail) {
  try {
    // Pas de doublon de signal ouvert du même type pour le même utilisateur
    const existant = await prisma.fraudFlag.findFirst({ where: { userId, type, statut: 'REVIEW' } });
    if (existant) return existant;
    return await prisma.fraudFlag.create({
      data: { userId, type, severite, detail: detail ? JSON.stringify(detail) : null },
    });
  } catch (e) {
    console.error('[antifraude] signal impossible :', e.message);
    return null;
  }
}

// Normalisation d'e-mail (gmail : points et +suffixe ignorés → multi-comptes)
function emailNormalise(email) {
  const [local, domaine] = String(email || '').toLowerCase().split('@');
  if (!domaine) return String(email || '').toLowerCase();
  let l = local.split('+')[0];
  if (['gmail.com', 'googlemail.com'].includes(domaine)) l = l.replace(/\./g, '');
  return l + '@' + domaine;
}

// ─── Contrôles à l'inscription d'un filleul ───
async function controlerInscription(filleul, parrainUserId) {
  if (!parrainUserId) return;
  const parrain = await prisma.user.findUnique({ where: { id: parrainUserId }, select: { email: true, phone: true } });
  if (!parrain) return;
  if (parrain.phone && filleul.phone && parrain.phone.replace(/\D/g, '') === filleul.phone.replace(/\D/g, '')) {
    await signaler(parrainUserId, 'multi_comptes', 'eleve', { motif: 'Même numéro de téléphone parrain/filleul', filleulId: filleul.id });
  }
  if (emailNormalise(parrain.email) === emailNormalise(filleul.email)) {
    await signaler(parrainUserId, 'auto_parrainage', 'eleve', { motif: 'E-mails équivalents parrain/filleul', filleulId: filleul.id });
  }
  // Rythme anormal : plus de 5 filleuls inscrits en 1 h
  const ilYaUneHeure = new Date(Date.now() - 3600 * 1000);
  const recents = await prisma.referralAttribution.count({ where: { parrainUserId, createdAt: { gte: ilYaUneHeure } } });
  if (recents >= 5) {
    await signaler(parrainUserId, 'rythme_anormal', 'moyen', { motif: recents + ' filleuls inscrits en moins d’une heure' });
  }
}

// ─── Contrôles à la déclaration de paiement ───
// Retourne la liste des signaux (l'admin les verra sur la demande) — ne bloque pas.
async function controlerDeclaration(userId, refTransaction) {
  const signaux = [];
  const ref = (refTransaction || '').trim();
  if (ref) {
    // Même référence de transaction déjà déclarée par un AUTRE compte
    const autres = await prisma.formationEnrollment.count({
      where: { refTransaction: ref, userId: { not: userId } },
    });
    if (autres > 0) {
      await signaler(userId, 'meme_ref_transaction', 'eleve', { motif: 'Référence de versement déjà déclarée par un autre compte', ref });
      signaux.push('meme_ref_transaction');
    }
  }
  return signaux;
}

// ─── Contrôles à la demande de versement ───
async function controlerPayout(userId, numero) {
  const num = (numero || '').replace(/\D/g, '');
  if (num.length < 8) return;
  // Le même numéro bénéficiaire est-il utilisé par un AUTRE compte ? (collusion / multi-comptes)
  const autres = await prisma.financialWallet.count({
    where: { numeroPaiement: { contains: num.slice(-8) }, userId: { not: userId } },
  });
  if (autres > 0) {
    await signaler(userId, 'meme_numero_versement', 'eleve', { motif: 'Numéro bénéficiaire partagé avec un autre compte', numero: num.slice(-8) });
  }
}

// ─── Décision de l'admin sur un signal ───
async function decider(flagId, acteurId, decision) {
  if (!['NORMAL', 'SUSPICIOUS', 'BLOCKED'].includes(decision)) throw new Error('Décision invalide');
  const flag = await prisma.fraudFlag.update({
    where: { id: flagId },
    data: { statut: decision, resolvedById: acteurId, resolvedAt: new Date() },
  });
  // Le statut utilisateur reflète la décision la plus sévère active
  const restants = await prisma.fraudFlag.findMany({ where: { userId: flag.userId, statut: { in: ['SUSPICIOUS', 'BLOCKED'] } } });
  const statutUser = restants.some((f) => f.statut === 'BLOCKED') ? 'BLOCKED'
    : restants.some((f) => f.statut === 'SUSPICIOUS') ? 'SUSPICIOUS' : 'NORMAL';
  await prisma.user.update({ where: { id: flag.userId }, data: { fraudStatus: statutUser } });
  await audit.log(acteurId, 'fraude.decision', 'FraudFlag', flagId, null, { decision, statutUser });
  return flag;
}

module.exports = { signaler, controlerInscription, controlerDeclaration, controlerPayout, decider, emailNormalise };
