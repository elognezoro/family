// Leçons dont le clip est en téléchargement payant : un seul paiement (confirmé
// par un admin) débloque à la fois le téléchargement et le quiz complet ; sans
// achat, le visiteur fait un quiz d'ESSAI de quelques questions tirées au sort.
//
// - Les questions d'essai sont tirées une fois et gardées dans la session :
//   recharger la page ne fait pas défiler toute la banque, deux par deux.
// - Le cookie signé eduweb_lecons (un an) retient les ACHATS dont ce navigateur
//   a ouvert le lien personnel. L'accès est revérifié en base à chaque vue :
//   « Remettre à vérifier », « Rejeter » ou « Supprimer » un paiement le retire.
// - Un compte connecté (e-mail vérifié) qui a payé débloque aussi la leçon, sur
//   tout appareil, tant qu'il est connecté — sans écrire le cookie (ordinateur
//   partagé : rien ne reste après la déconnexion).
const crypto = require('crypto');
const Cookies = require('cookies');

const NB_ESSAI = 2; // questions du quiz d'essai
const COOKIE = 'eduweb_lecons';
const DUREE_COOKIE = 365 * 24 * 3600 * 1000; // un an
const MAX_ACHATS = 60; // borne la taille du cookie (60 identifiants ≈ 2,2 Ko)
const MAX_ESSAIS = 30; // leçons dont le tirage d'essai est gardé en session
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CLES = [process.env.SESSION_SECRET || 'eduweb_dev_secret'];
const enHttps = (process.env.BASE_URL || '').startsWith('https');

function cookies(req, res) {
  return new Cookies(req, res, { keys: CLES, secure: !!req.secure });
}

// Identifiants des achats retenus par ce navigateur (cookie falsifié ou absent : aucun)
function achats(req, res) {
  const brut = cookies(req, res).get(COOKIE, { signed: true }) || '';
  return brut.split('.').filter((id) => UUID_RE.test(id));
}

function retenirAchat(req, res, achatId) {
  if (!UUID_RE.test(achatId || '')) return;
  const liste = achats(req, res).filter((id) => id !== achatId);
  liste.push(achatId);
  cookies(req, res).set(COOKIE, liste.slice(-MAX_ACHATS).join('.'), {
    signed: true,
    httpOnly: true,
    sameSite: 'lax',
    secure: enHttps && !!req.secure,
    maxAge: DUREE_COOKIE,
    overwrite: true,
  });
}

// Conditions « ce visiteur a payé » : achat retenu par le navigateur, ou achat
// fait avec l'e-mail du compte connecté. null : aucune voie possible.
function voiesAchat(req, res) {
  const ou = [];
  const ids = achats(req, res);
  if (ids.length) ou.push({ id: { in: ids } });
  const u = req.session && req.session.user;
  if (u && u.email) ou.push({ email: { equals: String(u.email).trim(), mode: 'insensitive' } });
  return ou.length ? ou : null;
}

// Achat confirmé, par ce visiteur, de l'une de ces ressources (ou null).
// Une erreur de base laisse le visiteur en essai.
async function achatDuVisiteur(prisma, req, res, ressourceIds) {
  const ids = (ressourceIds || []).filter(Boolean);
  const ou = voiesAchat(req, res);
  if (!ids.length || !ou) return null;
  return prisma.achatTelechargement.findFirst({
    where: { ressourceId: { in: ids }, statut: 'confirme', OR: ou },
    orderBy: { expireAt: 'desc' },
    select: { id: true, jeton: true, ressourceId: true },
  }).catch(() => null);
}

// Ressources déjà payées par ce visiteur (cartes de la banque : « déjà payé »)
async function ressourcesPayees(prisma, req, res) {
  const ou = voiesAchat(req, res);
  if (!ou) return [];
  const liste = await prisma.achatTelechargement.findMany({
    where: { statut: 'confirme', ressourceId: { not: null }, OR: ou },
    select: { ressourceId: true },
    take: 500,
  }).catch(() => []);
  return [...new Set(liste.map((a) => a.ressourceId))];
}

// Indices des questions d'essai d'une leçon : tirés au sort au premier passage,
// puis les mêmes pendant toute la session (« Refaire l'essai » rejoue les mêmes).
function questionsEssai(session, slug, total) {
  const n = Math.min(NB_ESSAI, total);
  const valide = (t) => Array.isArray(t) && t.length === n && new Set(t).size === n
    && t.every((i) => Number.isInteger(i) && i >= 0 && i < total);
  const essais = (session && typeof session.essaisQuiz === 'object' && session.essaisQuiz) || {};
  if (valide(essais[slug])) return essais[slug].slice();
  const restants = Array.from({ length: total }, (_, i) => i);
  const tirage = [];
  while (tirage.length < n) tirage.push(restants.splice(crypto.randomInt(restants.length), 1)[0]);
  if (session) {
    const autres = Object.keys(essais).filter((s) => s !== slug).slice(-(MAX_ESSAIS - 1));
    const garde = {};
    autres.forEach((s) => { garde[s] = essais[s]; });
    garde[slug] = tirage;
    session.essaisQuiz = garde;
  }
  return tirage.slice();
}

module.exports = { NB_ESSAI, COOKIE, achats, retenirAchat, achatDuVisiteur, ressourcesPayees, questionsEssai };
