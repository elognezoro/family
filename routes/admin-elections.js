// Administration des élections en ligne (super admin) — /admin/elections
// Candidats (nom, photo, présentation), dates du scrutin, effacement des votes de
// test et réinitialisation, publication des résultats après la clôture, terminal
// du bureau de vote (présentiel), membres du bureau de vote (enregistrés par e-mail,
// accès à la liste d'émargement), suppression des pièces d'identité après l'élection.
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const Cookies = require('cookies');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireSuperAdmin } = require('../middleware/auth');
const storage = require('../services/storage');
const email = require('../services/email');
const APP = require('../config/app');
const el = require('../services/elections');
const { COOKIE_BUREAU } = require('./elections');

router.use(requireSuperAdmin);

const RETOUR = '/admin/elections';
const CLES = [process.env.SESSION_SECRET || 'eduweb_dev_secret'];
const enHttps = (process.env.BASE_URL || '').startsWith('https');
const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => { const ok = /^image\/(jpe?g|png|webp)$/i.test(file.mimetype); cb(ok ? null : new Error('format'), ok); },
});
function photoMiddleware(req, res, next) {
  uploadPhoto.single('photo')(req, res, (err) => { if (err) req._photoErreur = 'Photo refusée (JPG, PNG ou WebP, 3 Mo au plus).'; next(); });
}
// Champ « datetime-local » interprété en heure GMT
function dateGmt(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(v || ''));
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])) : null;
}
const champGmt = (d) => (d ? new Date(d).toISOString().slice(0, 16) : '');
function estTerminal(req, res, s) {
  return el.terminalValide(s, new Cookies(req, res, { keys: CLES, secure: !!req.secure }).get(COOKIE_BUREAU, { signed: true }));
}

router.get('/', async (req, res) => {
  const maintenant = new Date();
  let s = null;
  try { s = await el.charger(prisma, maintenant); } catch (e) { console.warn('[admin/elections] :', e.message); }
  if (!s) return go(res, '/admin', 'error', 'Aucun scrutin : importez d’abord la liste électorale (scripts/importer-electeurs.js).');
  const ph = el.phase(s, maintenant);
  const [candidats, part, enAttente, derniers, membres, pieces] = await Promise.all([
    prisma.scrutinCandidat.findMany({ where: { scrutinId: s.id }, orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }] }),
    el.participation(prisma, s.id),
    prisma.voteEnAttente.count({ where: { scrutinId: s.id, expireAt: { gt: maintenant } } }),
    prisma.emargement.findMany({ where: { scrutinId: s.id }, orderBy: { voteLe: 'desc' }, take: 15, include: { electeur: { select: { civilite: true, nom: true, prenom: true, classe: true } } } }),
    prisma.membreBureau.findMany({ where: { scrutinId: s.id }, orderBy: { createdAt: 'asc' } }),
    prisma.electionPiece.aggregate({ where: { scrutinId: s.id }, _count: { _all: true }, _sum: { taille: true } }),
  ]);
  res.render('admin/elections', {
    title: 'Élections — Admin EduWeb',
    bodyClass: 'page-admin',
    s, ph, candidats, part, enAttente, derniers, membres,
    pieces: { nombre: pieces._count._all, taille: pieces._sum.taille || 0 },
    resultats: el.resultatsVisibles(s, ph, true) ? await el.resultats(prisma, s) : null,
    terminal: estTerminal(req, res, s),
    champGmt, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt,
  });
});

// Candidats
router.post('/candidats', async (req, res) => {
  const nom = (req.body.nom || '').trim().slice(0, 120);
  if (!nom) return go(res, RETOUR, 'error', 'Indiquez le nom du candidat.');
  const dernier = await prisma.scrutinCandidat.findFirst({ where: { scrutinId: el.SCRUTIN }, orderBy: { ordre: 'desc' } });
  await prisma.scrutinCandidat.create({ data: { scrutinId: el.SCRUTIN, nom, ordre: (dernier ? dernier.ordre : 0) + 1 } });
  return go(res, RETOUR + '#candidats', 'success', `Candidat « ${nom} » ajouté.`);
});
router.post('/candidats/:id', photoMiddleware, async (req, res) => {
  const c = await prisma.scrutinCandidat.findFirst({ where: { id: req.params.id, scrutinId: el.SCRUTIN } });
  if (!c) return go(res, RETOUR, 'error', 'Candidat introuvable.');
  const nom = (req.body.nom || '').trim().slice(0, 120);
  if (!nom) return go(res, RETOUR + '#candidats', 'error', 'Le nom du candidat ne peut pas être vide.');
  const data = {
    nom,
    presentation: (req.body.presentation || '').trim().slice(0, 1500) || null,
    ordre: parseInt(req.body.ordre, 10) || c.ordre,
  };
  if (req.file && !req._photoErreur) {
    const ext = { 'image/png': '.png', 'image/webp': '.webp' }[req.file.mimetype] || '.jpg';
    data.photoUrl = await storage.save(req.file.buffer, 'candidat' + ext, req.file.mimetype);
  }
  if (req.body.retirerPhoto === '1') data.photoUrl = null;
  await prisma.scrutinCandidat.update({ where: { id: c.id }, data });
  return go(res, RETOUR + '#candidats', req._photoErreur ? 'warning' : 'success', req._photoErreur ? `Candidat enregistré, mais ${req._photoErreur.toLowerCase()}` : `Candidat « ${nom} » enregistré.`);
});
router.post('/candidats/:id/supprimer', async (req, res) => {
  const c = await prisma.scrutinCandidat.findFirst({ where: { id: req.params.id, scrutinId: el.SCRUTIN } });
  if (!c) return go(res, RETOUR, 'error', 'Candidat introuvable.');
  const voix = await prisma.bulletin.count({ where: { scrutinId: el.SCRUTIN, candidatId: c.id } });
  if (voix) return go(res, RETOUR + '#candidats', 'error', 'Ce candidat a déjà des votes : effacez d’abord les votes de test.');
  await prisma.scrutinCandidat.delete({ where: { id: c.id } });
  return go(res, RETOUR + '#candidats', 'success', `Candidat « ${c.nom} » retiré.`);
});

// Dates (heure GMT)
router.post('/dates', async (req, res) => {
  const s = await el.charger(prisma);
  const debut = dateGmt(req.body.debut), fin = dateGmt(req.body.fin);
  const reinitialiserA = dateGmt(req.body.reinitialiserA);
  if (!debut || !fin || fin <= debut) return go(res, RETOUR + '#dates', 'error', 'Dates invalides : la clôture doit suivre l’ouverture.');
  const ph = el.phase(s);
  if (ph === 'clos') return go(res, RETOUR + '#dates', 'error', 'Le vote est clos : les dates ne peuvent plus changer.');
  if (ph === 'ouvert') {
    if (+debut !== +s.debut) return go(res, RETOUR + '#dates', 'error', 'Le vote a commencé : l’heure d’ouverture ne peut plus changer.');
    if (fin < s.fin) return go(res, RETOUR + '#dates', 'error', 'Le vote a commencé : la clôture ne peut être que prolongée, jamais avancée.');
  }
  if (fin <= new Date() && ph !== 'clos') return go(res, RETOUR + '#dates', 'error', 'La clôture doit être dans le futur.');
  await prisma.scrutin.update({ where: { id: s.id }, data: { debut, fin, ...(s.reinitialiseLe ? {} : { reinitialiserA }) } });
  el.oublierCache();
  return go(res, RETOUR + '#dates', 'success', 'Dates enregistrées.');
});

// Pendant les tests : effacer les votes de test (la période de test continue)
router.post('/effacer-tests', async (req, res) => {
  const s = await el.charger(prisma);
  if (el.phase(s) !== 'test') return go(res, RETOUR, 'error', 'La période de test est terminée.');
  await prisma.$transaction(async (tx) => { await el.effacerVotes(tx, s.id); }, { timeout: 30000 });
  el.oublierCache();
  return go(res, RETOUR, 'success', 'Votes de test effacés. La période de test continue.');
});

// Réinitialisation définitive (fin des tests), possible jusqu'à l'ouverture du vote
router.post('/reinitialiser', async (req, res) => {
  const maintenant = new Date();
  const s = await el.charger(prisma, maintenant);
  if (maintenant >= s.debut) return go(res, RETOUR, 'error', 'Le vote a commencé : la réinitialisation n’est plus possible.');
  if (req.body.confirmation !== 'REINITIALISER') return go(res, RETOUR, 'error', 'Tapez REINITIALISER pour confirmer.');
  await prisma.$transaction(async (tx) => {
    await el.effacerVotes(tx, s.id);
    await tx.scrutin.update({ where: { id: s.id }, data: { reinitialiseLe: maintenant, resultatsPublies: false, terminalCle: null } });
  }, { timeout: 30000 });
  el.oublierCache();
  return go(res, RETOUR, 'success', 'Espace de vote réinitialisé : tous les votes de test sont effacés et les terminaux du bureau de vote révoqués (à réactiver). Le vote ouvrira à l’heure prévue.');
});

// Résultats : publication après la clôture
router.post('/publier', async (req, res) => {
  const s = await el.charger(prisma);
  if (el.phase(s) !== 'clos') return go(res, RETOUR, 'error', 'Les résultats ne peuvent être publiés qu’après la clôture du vote.');
  await prisma.scrutin.update({ where: { id: s.id }, data: { resultatsPublies: req.body.publier === '1' } });
  el.oublierCache();
  return go(res, RETOUR, 'success', req.body.publier === '1' ? 'Résultats publiés sur l’espace de vote.' : 'Résultats retirés de l’espace de vote.');
});

// Terminal du bureau de vote (présentiel) : cet appareil
router.post('/terminal', async (req, res) => {
  const cookies = new Cookies(req, res, { keys: CLES, secure: !!req.secure });
  if (req.body.activer === '1') {
    let s = await el.charger(prisma);
    if (el.phase(s) === 'clos') return go(res, RETOUR, 'error', 'Le vote est clos.');
    if (!s.terminalCle) {
      await prisma.scrutin.updateMany({ where: { id: s.id, terminalCle: null }, data: { terminalCle: crypto.randomBytes(24).toString('base64url') } });
      s = await prisma.scrutin.findUnique({ where: { id: s.id } });
    }
    const maxAge = Math.max(3600 * 1000, s.fin.getTime() + 3600 * 1000 - Date.now()); // jusqu'à 1 h après la clôture
    cookies.set(COOKIE_BUREAU, s.terminalCle, { signed: true, httpOnly: true, sameSite: 'lax', secure: enHttps && !!req.secure, maxAge, overwrite: true });
    return go(res, RETOUR, 'success', 'Cet appareil est maintenant un terminal du bureau de vote (votes en présentiel).');
  }
  cookies.set(COOKIE_BUREAU, '', { signed: true, maxAge: 0, overwrite: true });
  return go(res, RETOUR, 'success', 'Cet appareil n’est plus un terminal du bureau de vote.');
});
router.post('/terminal/revoquer', async (req, res) => {
  await prisma.scrutin.update({ where: { id: el.SCRUTIN }, data: { terminalCle: null } });
  return go(res, RETOUR, 'success', 'Tous les terminaux du bureau de vote sont révoqués. Réactivez ceux du bureau, un par un.');
});

// Émargement : page et export partagés avec le bureau de vote (routes/elections.js)
router.get('/emargement.csv', (req, res) => res.redirect('/elections/aidus/emargement.csv'));

// Membres du bureau de vote : enregistrés par e-mail, invités par e-mail
router.post('/bureau', async (req, res) => {
  const adresse = (req.body.email || '').trim().toLowerCase().slice(0, 120);
  const nom = (req.body.nom || '').trim().slice(0, 80) || null;
  if (!el.EMAIL_RE.test(adresse)) return go(res, RETOUR + '#bureau', 'error', 'Indiquez une adresse e-mail valide.');
  const deja = await prisma.membreBureau.findUnique({ where: { scrutinId_email: { scrutinId: el.SCRUTIN, email: adresse } } });
  if (deja) return go(res, RETOUR + '#bureau', 'warning', 'Cette adresse est déjà enregistrée au bureau de vote.');
  await prisma.membreBureau.create({ data: { scrutinId: el.SCRUTIN, email: adresse, nom } });
  const s = await el.charger(prisma);
  const base = /\.vercel\.app$/i.test(req.hostname || '') ? `${req.protocol}://${req.get('host')}` : APP.baseUrl(req);
  const envoye = await email.sendBureauVote(adresse, { nom, titre: s.titre, page: base + '/elections/aidus/emargement' }).catch(() => false);
  return go(res, RETOUR + '#bureau', envoye ? 'success' : 'warning', envoye
    ? `${adresse} est membre du bureau de vote : une invitation lui a été envoyée.`
    : `${adresse} est membre du bureau de vote, mais l’invitation n’a pas pu être envoyée : communiquez-lui l’adresse de la liste d’émargement.`);
});
router.post('/bureau/:id/supprimer', async (req, res) => {
  const m = await prisma.membreBureau.findFirst({ where: { id: req.params.id, scrutinId: el.SCRUTIN } });
  if (!m) return go(res, RETOUR + '#bureau', 'error', 'Membre introuvable.');
  await prisma.membreBureau.delete({ where: { id: m.id } });
  return go(res, RETOUR + '#bureau', 'success', `${m.email} n’a plus accès à la liste d’émargement.`);
});

// Après la clôture : suppression des pièces d'identité (vérifications terminées)
router.post('/effacer-pieces', async (req, res) => {
  const s = await el.charger(prisma);
  if (el.phase(s) !== 'clos') return go(res, RETOUR + '#pieces', 'error', 'Les pièces d’identité ne peuvent être supprimées qu’après la clôture du vote.');
  if (req.body.confirmation !== 'SUPPRIMER') return go(res, RETOUR + '#pieces', 'error', 'Tapez SUPPRIMER pour confirmer.');
  await prisma.$transaction(async (tx) => {
    await tx.emargement.updateMany({ where: { scrutinId: s.id }, data: { pieceId: null } });
    await tx.voteEnAttente.updateMany({ where: { scrutinId: s.id }, data: { pieceId: null } });
    await tx.electionPiece.deleteMany({ where: { scrutinId: s.id } });
  }, { timeout: 30000 });
  return go(res, RETOUR + '#pieces', 'success', 'Pièces d’identité supprimées. L’émargement est conservé.');
});

module.exports = router;
