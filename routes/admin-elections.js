// Administration des élections en ligne (super admin) — /admin/elections
// Candidats (nom, photo, présentation), dates du scrutin, effacement des votes de
// test et réinitialisation, publication des résultats après la clôture, terminal
// du bureau de vote (présentiel), membres du bureau de vote et représentants des
// candidats (enregistrés par e-mail), suppression des pièces d'identité après l'élection.
// Chaque action est inscrite au journal des opérations (lisible par le bureau de vote et
// les candidats) ; aucune ne peut modifier un vote émis le jour du scrutin (verrous ici et
// en base : scripts/migrate-elections-integrite.js).
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
// Inscription au journal des opérations (une erreur d'écriture ne bloque pas l'action déjà faite,
// mais est signalée dans les journaux du serveur)
function journal(req, action, details) {
  return el.journaliser(prisma, { scrutinId: el.SCRUTIN, ...el.acteurDe(req), action, details })
    .catch((e) => console.error('[admin/elections] journal :', e.message));
}
// Le vote est ouvert (ou clos) : candidats verrouillés, aucun vote modifiable
const voteCommence = (s) => ['ouvert', 'clos'].includes(el.phase(s));
const baseLiens = (req) => (/\.vercel\.app$/i.test(req.hostname || '') ? `${req.protocol}://${req.get('host')}` : APP.baseUrl(req));

router.get('/', async (req, res) => {
  const maintenant = new Date();
  let s = null;
  try { s = await el.charger(prisma, maintenant); } catch (e) { console.warn('[admin/elections] :', e.message); }
  if (!s) return go(res, '/admin', 'error', 'Aucun scrutin : importez d’abord la liste électorale (scripts/importer-electeurs.js).');
  const ph = el.phase(s, maintenant);
  const [candidats, part, enAttente, derniers, membres, pieces, votesReels] = await Promise.all([
    prisma.scrutinCandidat.findMany({ where: { scrutinId: s.id }, orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }] }),
    el.participation(prisma, s.id),
    prisma.voteEnAttente.count({ where: { scrutinId: s.id, expireAt: { gt: maintenant } } }),
    prisma.emargement.findMany({ where: { scrutinId: s.id }, orderBy: { voteLe: 'desc' }, take: 15, include: { electeur: { select: { civilite: true, nom: true, prenom: true, classe: true } } } }),
    prisma.membreBureau.findMany({ where: { scrutinId: s.id }, orderBy: { createdAt: 'asc' } }),
    prisma.electionPiece.aggregate({ where: { scrutinId: s.id }, _count: { _all: true }, _sum: { taille: true } }),
    el.nbVotesReels(prisma, s),
  ]);
  res.render('admin/elections', {
    title: 'Élections — Admin EduWeb',
    bodyClass: 'page-admin',
    s, ph, candidats, part, enAttente, derniers,
    membres: membres.filter((m) => (m.role || 'bureau') === 'bureau'),
    representants: membres.filter((m) => m.role === 'candidat'),
    pieces: { nombre: pieces._count._all, taille: pieces._sum.taille || 0 },
    resultats: el.resultatsVisibles(s, ph, true) ? await el.resultats(prisma, s) : null,
    terminal: estTerminal(req, res, s),
    candidatsVerrouilles: voteCommence(s), votesReels,
    champGmt, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt, masquerEmail: el.masquerEmail,
  });
});

// Candidats (verrouillés dès l'ouverture du vote)
router.post('/candidats', async (req, res) => {
  if (voteCommence(await el.charger(prisma))) return go(res, RETOUR + '#candidats', 'error', 'Vote ouvert : les candidats sont verrouillés.');
  const nom = (req.body.nom || '').trim().slice(0, 120);
  if (!nom) return go(res, RETOUR, 'error', 'Indiquez le nom du candidat.');
  const dernier = await prisma.scrutinCandidat.findFirst({ where: { scrutinId: el.SCRUTIN }, orderBy: { ordre: 'desc' } });
  await prisma.scrutinCandidat.create({ data: { scrutinId: el.SCRUTIN, nom, ordre: (dernier ? dernier.ordre : 0) + 1 } });
  await journal(req, 'Candidat ajouté', `« ${nom} »`);
  return go(res, RETOUR + '#candidats', 'success', `Candidat « ${nom} » ajouté.`);
});
router.post('/candidats/:id', photoMiddleware, async (req, res) => {
  if (voteCommence(await el.charger(prisma))) return go(res, RETOUR + '#candidats', 'error', 'Vote ouvert : les candidats sont verrouillés.');
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
  const changements = [
    data.nom !== c.nom ? `nom « ${c.nom} » → « ${data.nom} »` : null,
    data.ordre !== c.ordre ? `ordre ${c.ordre} → ${data.ordre}` : null,
    (data.presentation || null) !== (c.presentation || null) ? 'présentation modifiée' : null,
    'photoUrl' in data ? (data.photoUrl ? 'photo remplacée' : 'photo retirée') : null,
  ].filter(Boolean);
  if (changements.length) await journal(req, 'Candidat modifié', `« ${c.nom} » : ${changements.join(' ; ')}`);
  return go(res, RETOUR + '#candidats', req._photoErreur ? 'warning' : 'success', req._photoErreur ? `Candidat enregistré, mais ${req._photoErreur.toLowerCase()}` : `Candidat « ${nom} » enregistré.`);
});
router.post('/candidats/:id/supprimer', async (req, res) => {
  if (voteCommence(await el.charger(prisma))) return go(res, RETOUR + '#candidats', 'error', 'Vote ouvert : les candidats sont verrouillés.');
  const c = await prisma.scrutinCandidat.findFirst({ where: { id: req.params.id, scrutinId: el.SCRUTIN } });
  if (!c) return go(res, RETOUR, 'error', 'Candidat introuvable.');
  const voix = await prisma.bulletin.count({ where: { scrutinId: el.SCRUTIN, candidatId: c.id } });
  if (voix) return go(res, RETOUR + '#candidats', 'error', 'Ce candidat a déjà des votes : effacez d’abord les votes de test.');
  await prisma.scrutinCandidat.delete({ where: { id: c.id } });
  await journal(req, 'Candidat retiré', `« ${c.nom} »`);
  return go(res, RETOUR + '#candidats', 'success', `Candidat « ${c.nom} » retiré.`);
});

// Dates (heure GMT). Une fois des votes émis le jour du scrutin : ouverture figée, clôture
// seulement prolongeable ; après la clôture, plus aucun changement.
router.post('/dates', async (req, res) => {
  const s = await el.charger(prisma);
  const debut = dateGmt(req.body.debut), fin = dateGmt(req.body.fin);
  const reinitialiserA = dateGmt(req.body.reinitialiserA);
  if (!debut || !fin || fin <= debut) return go(res, RETOUR + '#dates', 'error', 'Dates invalides : la clôture doit suivre l’ouverture.');
  const ph = el.phase(s);
  const votes = await el.nbVotesReels(prisma, s);
  if (ph === 'clos' && votes) return go(res, RETOUR + '#dates', 'error', 'Le vote est clos : les dates ne peuvent plus changer.');
  if (votes) {
    if (+debut !== +s.debut) return go(res, RETOUR + '#dates', 'error', 'Des votes ont été émis : l’heure d’ouverture ne peut plus changer.');
    if (fin < s.fin) return go(res, RETOUR + '#dates', 'error', 'Des votes ont été émis : la clôture ne peut être que prolongée, jamais avancée.');
  }
  if (fin <= new Date()) return go(res, RETOUR + '#dates', 'error', 'La clôture doit être dans le futur.');
  const nouveau = { debut, fin, ...(s.reinitialiseLe ? {} : { reinitialiserA }) };
  await prisma.scrutin.update({ where: { id: s.id }, data: nouveau });
  el.oublierCache();
  const changements = [
    +debut !== +s.debut ? `ouverture ${el.formatGmt(s.debut)} → ${el.formatGmt(debut)}` : null,
    +fin !== +s.fin ? `clôture ${el.formatGmt(s.fin)} → ${el.formatGmt(fin)}` : null,
    'reinitialiserA' in nouveau && +(reinitialiserA || 0) !== +(s.reinitialiserA || 0) ? `fin des tests ${s.reinitialiserA ? el.formatGmt(s.reinitialiserA) : '—'} → ${reinitialiserA ? el.formatGmt(reinitialiserA) : '—'}` : null,
  ].filter(Boolean);
  if (changements.length) await journal(req, 'Dates modifiées', changements.join(' ; '));
  return go(res, RETOUR + '#dates', 'success', 'Dates enregistrées.');
});

// Pendant les tests : effacer les votes de test (la période de test continue)
router.post('/effacer-tests', async (req, res) => {
  const s = await el.charger(prisma);
  if (el.phase(s) !== 'test') return go(res, RETOUR, 'error', 'La période de test est terminée.');
  let n = 0;
  try {
    await prisma.$transaction(async (tx) => { n = await el.effacerVotes(tx, s.id); }, { timeout: 30000 });
  } catch (e) {
    return go(res, RETOUR, 'error', e.code === 'VOTES_REELS' ? e.message : 'Les votes de test n’ont pas pu être effacés.');
  }
  el.oublierCache();
  await journal(req, 'Votes de test effacés', `${n} vote(s) de test effacé(s) ; la période de test continue.`);
  return go(res, RETOUR, 'success', 'Votes de test effacés. La période de test continue.');
});

// Réinitialisation définitive (fin des tests), possible jusqu'à l'ouverture du vote
router.post('/reinitialiser', async (req, res) => {
  const maintenant = new Date();
  const s = await el.charger(prisma, maintenant);
  if (maintenant >= s.debut) return go(res, RETOUR, 'error', 'Le vote a commencé : la réinitialisation n’est plus possible.');
  if (req.body.confirmation !== 'REINITIALISER') return go(res, RETOUR, 'error', 'Tapez REINITIALISER pour confirmer.');
  let n = 0;
  try {
    await prisma.$transaction(async (tx) => {
      n = await el.effacerVotes(tx, s.id);
      await tx.scrutin.update({ where: { id: s.id }, data: { reinitialiseLe: maintenant, resultatsPublies: false, terminalCle: null } });
    }, { timeout: 30000 });
  } catch (e) {
    return go(res, RETOUR, 'error', e.code === 'VOTES_REELS' ? e.message : 'La réinitialisation a échoué.');
  }
  el.oublierCache();
  await journal(req, 'Réinitialisation manuelle', `Fin de la période de test : ${n} vote(s) de test effacé(s), terminaux du bureau de vote révoqués.`);
  return go(res, RETOUR, 'success', 'Espace de vote réinitialisé : tous les votes de test sont effacés et les terminaux du bureau de vote révoqués (à réactiver). Le vote ouvrira à l’heure prévue.');
});

// Résultats : publication après la clôture
router.post('/publier', async (req, res) => {
  const s = await el.charger(prisma);
  if (el.phase(s) !== 'clos') return go(res, RETOUR, 'error', 'Les résultats ne peuvent être publiés qu’après la clôture du vote.');
  const publier = req.body.publier === '1';
  await prisma.scrutin.update({ where: { id: s.id }, data: { resultatsPublies: publier } });
  el.oublierCache();
  await journal(req, publier ? 'Résultats publiés' : 'Résultats retirés', publier ? 'Résultats rendus publics sur l’espace de vote.' : 'Résultats retirés de l’espace de vote.');
  return go(res, RETOUR, 'success', publier ? 'Résultats publiés sur l’espace de vote.' : 'Résultats retirés de l’espace de vote.');
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
    // Durée indépendante de la clôture (qui peut être prolongée) : la validité est contrôlée à chaque
    // requête (clé révocable, refus après la clôture)
    const maxAge = Math.max(24 * 3600 * 1000, s.fin.getTime() + 7 * 24 * 3600 * 1000 - Date.now());
    cookies.set(COOKIE_BUREAU, s.terminalCle, { signed: true, httpOnly: true, sameSite: 'lax', secure: enHttps && !!req.secure, maxAge, overwrite: true });
    await journal(req, 'Terminal du bureau de vote activé', 'Un appareil devient terminal du bureau de vote (votes en présentiel).');
    return go(res, RETOUR, 'success', 'Cet appareil est maintenant un terminal du bureau de vote (votes en présentiel).');
  }
  cookies.set(COOKIE_BUREAU, '', { signed: true, maxAge: 0, overwrite: true });
  await journal(req, 'Terminal du bureau de vote retiré', 'Un appareil n’est plus terminal du bureau de vote.');
  return go(res, RETOUR, 'success', 'Cet appareil n’est plus un terminal du bureau de vote.');
});
router.post('/terminal/revoquer', async (req, res) => {
  await prisma.scrutin.update({ where: { id: el.SCRUTIN }, data: { terminalCle: null } });
  await journal(req, 'Terminaux du bureau de vote révoqués', 'Tous les terminaux sont révoqués.');
  return go(res, RETOUR, 'success', 'Tous les terminaux du bureau de vote sont révoqués. Réactivez ceux du bureau, un par un.');
});

// Émargement : page et export partagés avec le bureau de vote (routes/elections.js)
router.get('/emargement.csv', (req, res) => res.redirect('/elections/aidus/emargement.csv'));

// Membres du bureau de vote (émargement + journal) et candidats ou représentants (journal) :
// enregistrés par e-mail, invités par e-mail
router.post('/bureau', async (req, res) => {
  const role = req.body.role === 'candidat' ? 'candidat' : 'bureau';
  const ancre = role === 'candidat' ? '#representants' : '#bureau';
  const adresse = (req.body.email || '').trim().toLowerCase().slice(0, 120);
  const nom = (req.body.nom || '').trim().slice(0, 80) || null;
  if (!el.EMAIL_RE.test(adresse)) return go(res, RETOUR + ancre, 'error', 'Indiquez une adresse e-mail valide.');
  let candidat = null;
  if (role === 'candidat') {
    candidat = await prisma.scrutinCandidat.findFirst({ where: { id: String(req.body.candidatId || ''), scrutinId: el.SCRUTIN } });
    if (!candidat) return go(res, RETOUR + ancre, 'error', 'Choisissez le candidat représenté.');
  }
  const deja = await prisma.membreBureau.findUnique({ where: { scrutinId_email: { scrutinId: el.SCRUTIN, email: adresse } } });
  if (deja) return go(res, RETOUR + ancre, 'warning', 'Cette adresse est déjà enregistrée (bureau de vote ou représentant).');
  await prisma.membreBureau.create({ data: { scrutinId: el.SCRUTIN, email: adresse, nom, role, candidatId: candidat ? candidat.id : null } });
  const s = await el.charger(prisma);
  const page = baseLiens(req) + (role === 'candidat' ? '/elections/aidus/journal' : '/elections/aidus/emargement');
  const envoye = await email.sendBureauVote(adresse, { nom, titre: s.titre, page, role, candidat: candidat && candidat.nom }).catch(() => false);
  const qui = `${nom ? nom + ' ' : ''}(${el.masquerEmail(adresse)})`;
  await journal(req, role === 'candidat' ? 'Représentant de candidat enregistré' : 'Membre du bureau de vote enregistré',
    role === 'candidat' ? `${qui}, pour « ${candidat.nom} »` : qui);
  const libelle = role === 'candidat' ? `représentant de « ${candidat.nom} »` : 'membre du bureau de vote';
  return go(res, RETOUR + ancre, envoye ? 'success' : 'warning', envoye
    ? `${adresse} est ${libelle} : une invitation lui a été envoyée.`
    : `${adresse} est ${libelle}, mais l’invitation n’a pas pu être envoyée : communiquez-lui l’adresse de la page.`);
});
router.post('/bureau/:id/supprimer', async (req, res) => {
  const m = await prisma.membreBureau.findFirst({ where: { id: req.params.id, scrutinId: el.SCRUTIN } });
  if (!m) return go(res, RETOUR + '#bureau', 'error', 'Membre introuvable.');
  await prisma.membreBureau.delete({ where: { id: m.id } });
  const candidat = m.candidatId ? await prisma.scrutinCandidat.findUnique({ where: { id: m.candidatId } }).catch(() => null) : null;
  const qui = `${m.nom ? m.nom + ' ' : ''}(${el.masquerEmail(m.email)})`;
  await journal(req, m.role === 'candidat' ? 'Représentant de candidat retiré' : 'Membre du bureau de vote retiré',
    m.role === 'candidat' ? `${qui}${candidat ? `, pour « ${candidat.nom} »` : ''}` : qui);
  return go(res, RETOUR + (m.role === 'candidat' ? '#representants' : '#bureau'), 'success', `${m.email} n’a plus accès.`);
});

// Après la clôture : suppression des pièces d'identité (vérifications terminées)
router.post('/effacer-pieces', async (req, res) => {
  const s = await el.charger(prisma);
  if (el.phase(s) !== 'clos') return go(res, RETOUR + '#pieces', 'error', 'Les pièces d’identité ne peuvent être supprimées qu’après la clôture du vote.');
  if (req.body.confirmation !== 'SUPPRIMER') return go(res, RETOUR + '#pieces', 'error', 'Tapez SUPPRIMER pour confirmer.');
  const n = await prisma.electionPiece.count({ where: { scrutinId: s.id } });
  await prisma.$transaction(async (tx) => {
    await tx.emargement.updateMany({ where: { scrutinId: s.id }, data: { pieceId: null } });
    await tx.voteEnAttente.updateMany({ where: { scrutinId: s.id }, data: { pieceId: null } });
    await tx.electionPiece.deleteMany({ where: { scrutinId: s.id } });
  }, { timeout: 30000 });
  await journal(req, 'Pièces d’identité supprimées', `${n} pièce(s) supprimée(s) après vérification ; l’émargement est conservé.`);
  return go(res, RETOUR + '#pieces', 'success', 'Pièces d’identité supprimées. L’émargement est conservé.');
});

module.exports = router;
