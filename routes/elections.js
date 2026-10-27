// Espace de vote en ligne (élection du Président de l'AIDUS) — /elections/aidus
// Parcours : 1. identification (liste électorale + pièce d'identité) → 2. bulletin
// (choix du candidat, e-mail, photo de la pièce prise directement) → 3. code de confirmation
// reçu par e-mail, saisi sur le même appareil → vote enregistré (émargement +
// bulletin anonyme). Liste d'émargement : super admin et membres du bureau de vote
// (connexion par lien reçu par e-mail). Règles et secret du vote : services/elections.js.
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const Cookies = require('cookies');
const router = express.Router();
const prisma = require('../data/prisma-store');
const APP = require('../config/app');
const { go } = require('../middleware/auth');
const email = require('../services/email');
const el = require('../services/elections');

const PAGE = '/elections/aidus';
const RETOUR = PAGE + '#vote';
const EMARGEMENT = PAGE + '/emargement';
const COOKIE_BUREAU = 'eduweb_bureau_vote';
const CLES = [process.env.SESSION_SECRET || 'eduweb_dev_secret'];

// Terminal du bureau de vote (présentiel) : cookie signé portant la clé du scrutin
// (posée par le super admin, révocable, effacée à la réinitialisation)
function cookieTerminal(req, res) {
  return new Cookies(req, res, { keys: CLES, secure: !!req.secure }).get(COOKIE_BUREAU, { signed: true });
}
const estTerminalBureau = (req, res, s) => el.terminalValide(s, cookieTerminal(req, res));
// Formulaires acceptés seulement depuis le site
function depuisLeSite(req) {
  const site = req.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none';
  const origine = req.get('origin');
  if (!origine) return true;
  try { return new URL(origine).host === req.get('host'); } catch (e) { return false; }
}
// État du parcours dans la session (identifiant d'appareil gardé d'un vote à l'autre)
function etat(req) {
  if (!req.session.election || typeof req.session.election !== 'object') req.session.election = {};
  if (!req.session.election.terminal) req.session.election.terminal = crypto.randomBytes(12).toString('hex');
  return req.session.election;
}
function remettreAZero(req, garder = {}) {
  const st = etat(req);
  req.session.election = { terminal: st.terminal, cycle: st.cycle, ...garder };
}
// L'état du parcours appartient à un « cycle » du scrutin : la réinitialisation (fin des
// tests) l'efface, pour qu'aucun vote de test ne reste affiché le jour du vote
function synchroniser(req, s) {
  const cycle = s.reinitialiseLe ? new Date(s.reinitialiseLe).toISOString() : 'test';
  const st = etat(req);
  if (st.cycle !== cycle) req.session.election = { terminal: st.terminal, cycle };
  return etat(req);
}

// Limites par adresse IP et par quart d'heure (meilleur effort, par instance) :
// identifications échouées, bulletins et renvois de code, demandes de lien du bureau
const _essais = new Map();
function limiteAtteinte(cle, max) {
  const t = Date.now();
  const liste = (_essais.get(cle) || []).filter((x) => t - x < 15 * 60 * 1000);
  _essais.set(cle, liste);
  return liste.length >= max;
}
function noter(cle) {
  const liste = _essais.get(cle) || [];
  liste.push(Date.now());
  _essais.set(cle, liste);
  if (_essais.size > 5000) _essais.clear();
}

// Pièce d'identité jointe (vote en ligne) : image réduite dans le navigateur avant
// l'envoi ; 4 Mo au plus (limite des requêtes sur Vercel : 4,5 Mo) ; JPEG, PNG, WebP
const uploadPiece = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => { const ok = /^image\/(jpe?g|png|webp)$/i.test(file.mimetype); cb(ok ? null : new Error('format'), ok); },
});
function pieceMiddleware(req, res, next) {
  uploadPiece.single('piece')(req, res, (err) => {
    if (err) req._pieceErreur = err.code === 'LIMIT_FILE_SIZE' ? 'Image trop lourde (4 Mo au plus) : reprenez la photo ou réduisez-la.' : 'Photo refusée : reprenez la photo de votre pièce d’identité.';
    next();
  });
}

// Adresse du site pour les liens envoyés par e-mail (aperçus Vercel : leur propre adresse)
const baseLiens = (req) => (/\.vercel\.app$/i.test(req.hostname || '') ? `${req.protocol}://${req.get('host')}` : APP.baseUrl(req));

// Accès à la liste d'émargement : super admin, ou membre du bureau de vote connecté
async function accesEmargement(req) {
  if (req.session.user && req.session.user.isSuperAdmin) return { superAdmin: true, membre: null };
  const b = req.session.bureauVote;
  if (!b || !b.id || !(b.jusqua > Date.now())) return null;
  const membre = await prisma.membreBureau.findFirst({ where: { id: b.id, scrutinId: el.SCRUTIN } }).catch(() => null);
  if (!membre) { delete req.session.bureauVote; return null; }
  return { superAdmin: false, membre };
}

router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
router.post('*', (req, res, next) => (depuisLeSite(req) ? next() : go(res, PAGE, 'error', 'Formulaire refusé.')));

router.get('/aidus', async (req, res) => {
  const maintenant = new Date();
  let s = null;
  try { s = await el.charger(prisma, maintenant); } catch (e) { console.error('[elections] chargement :', e.message); }
  if (!s) return go(res, '/', 'error', 'L’espace de vote n’est pas encore ouvert.');
  const ph = el.phase(s, maintenant);
  const superAdmin = !!(req.session.user && req.session.user.isSuperAdmin);
  // Candidats dans l'ordre officiel de l'affiche
  const [candidats, part] = await Promise.all([
    prisma.scrutinCandidat.findMany({ where: { scrutinId: s.id }, orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }] }),
    el.participation(prisma, s.id),
  ]);
  const res_ = el.resultatsVisibles(s, ph, superAdmin) ? await el.resultats(prisma, s) : null;

  const st = synchroniser(req, s);
  const bureau = estTerminalBureau(req, res, s);
  let attente = null;
  if (st.attenteId) {
    attente = await prisma.voteEnAttente.findUnique({ where: { id: st.attenteId } }).catch(() => null);
    if (!attente || attente.expireAt < maintenant || attente.terminal !== st.terminal) { attente = null; delete st.attenteId; }
    // Choix introuvable dans la session (envoi interrompu…) : retour au bulletin, pièce gardée
    else if (!st.choix || !candidats.some((c) => c.id === st.choix)) {
      await el.annulerAttente(prisma, attente, { garderPiece: true }).catch(() => {});
      attente = null;
      delete st.attenteId;
    }
  }
  const etape = st.fait ? 'fait' : attente ? 'code' : st.electeurId ? 'bulletin' : 'identification';
  // Pièce déjà envoyée (après « Changer de choix ») : pas besoin de la joindre de nouveau
  let pieceJointe = false;
  if (etape === 'bulletin' && !bureau && st.pieceId) {
    pieceJointe = !!(await prisma.electionPiece.findFirst({ where: { id: st.pieceId, scrutinId: s.id }, select: { id: true } }).catch(() => null));
    if (!pieceJointe) delete st.pieceId;
  }
  res.render('election', {
    title: `${s.titre} — EduWeb`,
    bodyClass: 'page-election',
    s, ph, candidats, part, resultats: res_, superAdmin,
    etape, st, attente, bureau, pieceJointe,
    brouillon: (!bureau && st.brouillon) || {},
    candidatChoisi: attente && st.choix ? candidats.find((c) => c.id === st.choix) || null : null,
    formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt,
    minutesCode: el.DUREE_CODE / 60000,
  });
});

// 1. Identification
router.post('/aidus/identifier', async (req, res) => {
  const maintenant = new Date();
  const s = await el.charger(prisma, maintenant).catch(() => null);
  if (!s || !el.voteOuvert(el.phase(s, maintenant))) return go(res, PAGE, 'error', 'Le vote n’est pas ouvert en ce moment.');
  const st = synchroniser(req, s);
  const ip = req.ip || 'inconnue';
  if (limiteAtteinte('id:' + ip, 8)) return go(res, RETOUR, 'error', 'Trop de tentatives d’identification. Patientez un quart d’heure, puis réessayez.');
  const saisie = {
    nom: (req.body.nom || '').trim().slice(0, 80), prenom: (req.body.prenom || '').trim().slice(0, 120),
    anneeEntree: req.body.anneeEntree, anneeDiplome: req.body.anneeDiplome,
  };
  const typePiece = req.body.typePiece === 'passeport' ? 'passeport' : req.body.typePiece === 'cni' ? 'cni' : '';
  // Gardé pour pré-remplir le formulaire en cas d'erreur (pas le numéro de pièce) ;
  // jamais sur le terminal du bureau de vote (l'électeur suivant le verrait)
  if (!estTerminalBureau(req, res, s)) st.saisie = { nom: saisie.nom, prenom: saisie.prenom, anneeEntree: String(saisie.anneeEntree || '').slice(0, 4), anneeDiplome: String(saisie.anneeDiplome || '').slice(0, 4), typePiece };
  if (!saisie.nom || !saisie.prenom || !el.annee(saisie.anneeEntree) || !el.annee(saisie.anneeDiplome)) {
    return go(res, RETOUR, 'error', 'Renseignez votre nom, vos prénoms, votre année d’entrée et votre année d’obtention du diplôme.');
  }
  if (!typePiece) return go(res, RETOUR, 'error', 'Choisissez votre pièce d’identité : CNI ou passeport.');
  if (!el.pieceValide(typePiece, req.body.numeroPiece)) {
    return go(res, RETOUR, 'error', typePiece === 'cni'
      ? 'Le numéro de CNI doit être au format CIxxxxxxxxx (nouvelle CNI : CI suivi de 9 chiffres) ou C xxxx xxxx xx (ancienne CNI de 2010 : C suivi de 10 chiffres).'
      : 'Le numéro de passeport doit être au format ivoirien : 2 chiffres, 2 lettres puis 5 chiffres (ex. 20AB12345).');
  }
  const cni = el.clePiece(typePiece, req.body.numeroPiece);

  const electeurs = await prisma.electeur.findMany({
    where: { scrutinId: s.id },
    select: { id: true, civilite: true, nom: true, prenom: true, anneeEntree: true, anneeDiplome: true, arriveeEn: true, emails: true },
  });
  const e = el.trouverElecteur(electeurs, saisie);
  if (e === 'ambigu') return go(res, RETOUR, 'error', 'Plusieurs électeurs correspondent à ces informations : adressez-vous au comité électoral.');
  if (!e) {
    noter('id:' + ip);
    return go(res, RETOUR, 'error', 'Ces informations ne correspondent à aucun électeur de la liste électorale. Vérifiez l’orthographe de votre nom et de vos prénoms, et vos années (entrée à l’Université Senghor et obtention du diplôme).');
  }
  const [dejaVote, cniUtilisee] = await Promise.all([
    prisma.emargement.findUnique({ where: { scrutinId_electeurId: { scrutinId: s.id, electeurId: e.id } } }),
    prisma.emargement.findUnique({ where: { scrutinId_cni: { scrutinId: s.id, cni } } }),
  ]);
  if (dejaVote) return go(res, RETOUR, 'error', `Cet électeur a déjà voté (${el.formatGmt(dejaVote.voteLe)}). Un électeur ne vote qu’une fois.`);
  if (cniUtilisee) return go(res, RETOUR, 'error', 'Cette pièce d’identité a déjà servi à voter. Une pièce ne permet qu’un seul vote.');

  const emails = el.emailsListe(e);
  remettreAZero(req, {
    electeurId: e.id, cni,
    nomAffiche: [e.civilite, e.prenom, e.nom].filter(Boolean).join(' '),
    emailsMasques: emails.map(el.masquerEmail), aEmailListe: emails.length > 0,
  });
  return res.redirect(RETOUR);
});

// 2. Bulletin : choix du candidat, pièce d'identité jointe (en ligne) ; envoi du code de confirmation.
// Le choix reste dans la session de l'électeur jusqu'à la confirmation (jamais en base avec son identité).
router.post('/aidus/voter', pieceMiddleware, async (req, res) => {
  const maintenant = new Date();
  const s = await el.charger(prisma, maintenant).catch(() => null);
  if (!s || !el.voteOuvert(el.phase(s, maintenant))) return go(res, PAGE, 'error', 'Le vote n’est pas ouvert en ce moment.');
  const st = synchroniser(req, s);
  if (!st.electeurId) return go(res, RETOUR, 'error', 'Identifiez-vous d’abord.');
  const ip = req.ip || 'inconnue';
  const bureau = estTerminalBureau(req, res, s);
  const adresse = (req.body.email || '').trim().toLowerCase().slice(0, 120);
  // Brouillon (hors terminal du bureau) : le bulletin reste coché et l'e-mail rempli après une erreur
  if (!bureau) st.brouillon = { candidat: String(req.body.candidat || '').slice(0, 60), email: adresse };
  if (limiteAtteinte('voter:' + ip, 12)) return go(res, RETOUR, 'error', 'Trop de tentatives depuis cette connexion. Patientez un quart d’heure, puis réessayez.');
  noter('voter:' + ip);
  const candidat = await prisma.scrutinCandidat.findFirst({ where: { id: String(req.body.candidat || ''), scrutinId: s.id } });
  if (!candidat) return go(res, RETOUR, 'error', 'Choisissez un candidat : cochez la case blanche sous sa photo.');
  const electeur = await prisma.electeur.findUnique({ where: { id: st.electeurId } });
  if (!electeur) { remettreAZero(req); return go(res, RETOUR, 'error', 'Électeur introuvable : identifiez-vous de nouveau.'); }

  const [dejaVote, cniUtilisee] = await Promise.all([
    prisma.emargement.findUnique({ where: { scrutinId_electeurId: { scrutinId: s.id, electeurId: electeur.id } } }),
    prisma.emargement.findUnique({ where: { scrutinId_cni: { scrutinId: s.id, cni: st.cni } } }),
  ]);
  if (dejaVote || cniUtilisee) { remettreAZero(req); return go(res, RETOUR, 'error', 'Un vote a déjà été enregistré pour cet électeur ou cette pièce d’identité.'); }

  // Pièce d'identité (en ligne) : réduite (lisible, légère) puis gardée en base, jamais publique.
  // Traitée avant les contrôles suivants : une erreur (adresse e-mail…) n'oblige pas à reprendre la photo.
  let pieceId = null;
  if (!bureau) {
    if (req._pieceErreur) return go(res, RETOUR, 'error', req._pieceErreur);
    if (req.file) {
      let image;
      try { image = await el.optimiserPiece(req.file.buffer); } catch (e) {
        if (e.code !== 'PIECE') console.error('[elections] pièce :', e.message);
        return go(res, RETOUR, 'error', e.code === 'PIECE' ? e.message : 'L’image n’a pas pu être traitée : réessayez avec une photo JPG ou PNG.');
      }
      const piece = await prisma.electionPiece.create({ data: { scrutinId: s.id, mime: image.mime, taille: image.taille, largeur: image.largeur, hauteur: image.hauteur, data: image.buffer } });
      if (st.pieceId) await el.supprimerPieces(prisma, [st.pieceId]).catch(() => {}); // pièce remplacée
      st.pieceId = piece.id;
    } else if (!st.pieceId || !(await prisma.electionPiece.findFirst({ where: { id: st.pieceId, scrutinId: s.id }, select: { id: true } }))) {
      delete st.pieceId;
      return go(res, RETOUR, 'error', 'Joignez la photo de votre pièce d’identité (celle dont vous avez saisi le numéro) : touchez « Photographier ma pièce ».');
    }
    pieceId = st.pieceId;
  }

  const emails = el.emailsListe(electeur);
  if (!bureau || adresse) {
    if (!el.EMAIL_RE.test(adresse)) return go(res, RETOUR, 'error', 'Indiquez une adresse e-mail valide : le code de confirmation y sera envoyé.');
    if (emails.length && !emails.includes(adresse)) return go(res, RETOUR, 'error', 'Utilisez l’adresse e-mail qui figure pour vous sur la liste électorale.');
    const emailUtilise = await prisma.emargement.findUnique({ where: { scrutinId_email: { scrutinId: s.id, email: adresse } } });
    if (emailUtilise) return go(res, RETOUR, 'error', 'Cette adresse e-mail a déjà servi à confirmer un vote. Une adresse ne confirme qu’un seul vote.');
  }
  await el.purgerAttentes(prisma, s.id, maintenant).catch(() => {});
  const precedents = await prisma.voteEnAttente.findMany({ where: { scrutinId: s.id, electeurId: electeur.id }, select: { id: true, pieceId: true } });
  for (const p of precedents) await el.annulerAttente(prisma, p, { garderPiece: p.pieceId === pieceId });

  // Plafond d'envois de code par électeur (anti-abus, partagé entre instances)
  if (!bureau && !(await el.reserverEnvoi(prisma, electeur.id))) {
    return go(res, RETOUR, 'error', 'Trop de codes ont déjà été demandés pour cet électeur. Adressez-vous au comité électoral.');
  }
  const id = crypto.randomUUID();
  const code = bureau ? null : el.genererCode();
  const attente = await prisma.voteEnAttente.create({
    data: {
      id, scrutinId: s.id, electeurId: electeur.id, candidatId: '', cni: st.cni,
      email: adresse || null, codeHash: code ? el.hacherCode(id, code) : null,
      mode: bureau ? 'presentiel' : 'en_ligne', ip: req.ip || null, terminal: st.terminal, pieceId,
      expireAt: new Date(maintenant.getTime() + el.DUREE_CODE),
    },
  });
  if (code) {
    const envoye = await email.sendCodeVote(adresse, { code, titre: s.titre, minutes: el.DUREE_CODE / 60000 }).catch(() => false);
    if (!envoye) {
      await el.annulerAttente(prisma, attente, { garderPiece: true }).catch(() => {});
      return go(res, RETOUR, 'error', 'Le code n’a pas pu être envoyé à cette adresse. Vérifiez-la, puis réessayez.');
    }
  }
  st.attenteId = attente.id;
  st.choix = candidat.id;
  return res.redirect(RETOUR);
});

// 3. Confirmation (code saisi sur le même appareil ; au bureau de vote : validation directe)
router.post('/aidus/confirmer', async (req, res) => {
  const maintenant = new Date();
  const s = await el.charger(prisma, maintenant).catch(() => null);
  if (!s || !el.voteOuvert(el.phase(s, maintenant))) return go(res, PAGE, 'error', 'Le vote n’est pas ouvert en ce moment.');
  const st = synchroniser(req, s);
  const attente = st.attenteId ? await prisma.voteEnAttente.findUnique({ where: { id: st.attenteId } }).catch(() => null) : null;
  if (!attente || attente.terminal !== st.terminal) {
    // Double envoi : le premier a déjà enregistré le vote depuis cet appareil
    const deja = st.electeurId ? await prisma.emargement.findUnique({ where: { scrutinId_electeurId: { scrutinId: s.id, electeurId: st.electeurId } } }).catch(() => null) : null;
    if (deja && deja.terminal === st.terminal) { remettreAZero(req, { fait: { le: deja.voteLe.toISOString(), mode: deja.mode } }); return res.redirect(RETOUR); }
    delete st.attenteId;
    return go(res, RETOUR, 'error', 'Aucun vote en attente sur cet appareil : recommencez.');
  }
  const annuler = async () => { await el.annulerAttente(prisma, attente, { garderPiece: true }).catch(() => {}); delete st.attenteId; delete st.choix; };
  if (attente.expireAt < maintenant) {
    await annuler();
    return go(res, RETOUR, 'error', 'Le code a expiré : validez de nouveau votre choix pour recevoir un nouveau code.');
  }
  if (attente.mode === 'presentiel') {
    if (!estTerminalBureau(req, res, s)) return go(res, RETOUR, 'error', 'Cette validation n’est possible que sur le terminal du bureau de vote.');
  } else {
    // Essai compté avant la comparaison, de façon atomique (pas de contournement par requêtes parallèles)
    const r = await prisma.voteEnAttente.updateMany({ where: { id: attente.id, essais: { lt: el.ESSAIS_MAX } }, data: { essais: { increment: 1 } } });
    const restants = el.ESSAIS_MAX - (attente.essais + 1);
    if (!r.count) { await annuler(); return go(res, RETOUR, 'error', 'Trop de codes erronés : le vote en attente est annulé. Recommencez.'); }
    if (!el.codeJuste(attente, req.body.code)) {
      if (restants <= 0) { await annuler(); return go(res, RETOUR, 'error', 'Trop de codes erronés : le vote en attente est annulé. Recommencez.'); }
      return go(res, RETOUR, 'error', `Code incorrect. Il vous reste ${restants} essai${restants > 1 ? 's' : ''}.`);
    }
  }
  const candidat = st.choix ? await prisma.scrutinCandidat.findFirst({ where: { id: st.choix, scrutinId: s.id }, select: { id: true } }) : null;
  if (!candidat) { await annuler(); return go(res, RETOUR, 'error', 'Votre choix n’a pas été retrouvé : cochez de nouveau votre candidat.'); }
  try {
    await el.enregistrerVote(prisma, attente, candidat.id);
  } catch (e) {
    const deja = await prisma.emargement.findUnique({ where: { scrutinId_electeurId: { scrutinId: s.id, electeurId: attente.electeurId } } }).catch(() => null);
    if (deja && deja.terminal === st.terminal) { remettreAZero(req, { fait: { le: deja.voteLe.toISOString(), mode: deja.mode } }); return res.redirect(RETOUR); }
    remettreAZero(req);
    if (e.code === 'P2002' || e.code === 'ATTENTE') {
      await el.annulerAttente(prisma, attente).catch(() => {});
      return go(res, RETOUR, 'error', 'Un vote a déjà été enregistré pour cet électeur, cette pièce d’identité ou cette adresse e-mail.');
    }
    console.error('[elections] enregistrement :', e.message);
    return go(res, RETOUR, 'error', 'Le vote n’a pas pu être enregistré. Réessayez dans un instant.');
  }
  el.oublierCache();
  remettreAZero(req, { fait: { le: maintenant.toISOString(), mode: attente.mode } });
  return res.redirect(RETOUR);
});

// Renvoyer le code (3 envois au plus par vote en attente, plafond par électeur)
router.post('/aidus/renvoyer', async (req, res) => {
  const maintenant = new Date();
  const s = await el.charger(prisma, maintenant).catch(() => null);
  if (!s || !el.voteOuvert(el.phase(s, maintenant))) return go(res, PAGE, 'error', 'Le vote n’est pas ouvert en ce moment.');
  const st = synchroniser(req, s);
  const attente = st.attenteId ? await prisma.voteEnAttente.findUnique({ where: { id: st.attenteId } }).catch(() => null) : null;
  if (!attente || attente.terminal !== st.terminal || attente.mode !== 'en_ligne' || !attente.email) return go(res, RETOUR, 'error', 'Aucun code à renvoyer : recommencez.');
  if (attente.envois >= el.ENVOIS_MAX) return go(res, RETOUR, 'error', 'Le code a déjà été envoyé trois fois. Vérifiez vos courriers indésirables, ou recommencez avec une autre adresse.');
  const ip = req.ip || 'inconnue';
  if (limiteAtteinte('voter:' + ip, 12)) return go(res, RETOUR, 'error', 'Trop de tentatives depuis cette connexion. Patientez un quart d’heure, puis réessayez.');
  noter('voter:' + ip);
  if (!(await el.reserverEnvoi(prisma, attente.electeurId))) return go(res, RETOUR, 'error', 'Trop de codes ont déjà été demandés pour cet électeur. Adressez-vous au comité électoral.');
  const code = el.genererCode();
  await prisma.voteEnAttente.update({
    where: { id: attente.id },
    data: { codeHash: el.hacherCode(attente.id, code), envois: attente.envois + 1, expireAt: new Date(maintenant.getTime() + el.DUREE_CODE) },
  });
  const envoye = await email.sendCodeVote(attente.email, { code, titre: s.titre, minutes: el.DUREE_CODE / 60000 }).catch(() => false);
  return go(res, RETOUR, envoye ? 'success' : 'error', envoye ? 'Un nouveau code vient d’être envoyé.' : 'Le code n’a pas pu être renvoyé. Réessayez dans un instant.');
});

// Aperçu de SA pièce d'identité déjà envoyée (session de l'électeur uniquement)
router.get('/aidus/piece', async (req, res) => {
  const st = etat(req);
  const p = st.pieceId ? await prisma.electionPiece.findFirst({ where: { id: st.pieceId, scrutinId: el.SCRUTIN } }).catch(() => null) : null;
  if (!p) return res.status(404).type('text').send('Aucune pièce jointe.');
  res.set({ 'Content-Type': p.mime, 'X-Content-Type-Options': 'nosniff' });
  return res.send(Buffer.from(p.data));
});

// Changer de choix : retour au bulletin ; identité et pièce d'identité déjà envoyée gardées
router.post('/aidus/changer', async (req, res) => {
  const st = etat(req);
  if (st.attenteId) {
    const attente = await prisma.voteEnAttente.findUnique({ where: { id: st.attenteId } }).catch(() => null);
    if (attente && attente.terminal === st.terminal) await el.annulerAttente(prisma, attente, { garderPiece: true }).catch(() => {});
  }
  delete st.attenteId;
  delete st.choix;
  return res.redirect(RETOUR);
});

// Recommencer (ou « Nouveau vote » après « A voté ! ») : parcours effacé, pièce comprise
router.post('/aidus/annuler', async (req, res) => {
  const st = etat(req);
  if (st.attenteId) {
    const attente = await prisma.voteEnAttente.findUnique({ where: { id: st.attenteId } }).catch(() => null);
    if (attente && attente.terminal === st.terminal) await el.annulerAttente(prisma, attente).catch(() => {});
  } else if (st.pieceId && !st.fait) {
    await el.supprimerPieces(prisma, [st.pieceId]).catch(() => {});
  }
  remettreAZero(req);
  return res.redirect(RETOUR);
});

// ─── Liste d'émargement (super admin, membres du bureau de vote) ───

router.get('/aidus/emargement', async (req, res) => {
  const s = await el.charger(prisma).catch(() => null);
  if (!s) return go(res, '/', 'error', 'L’espace de vote n’est pas encore ouvert.');
  const acces = await accesEmargement(req);
  const commun = { title: `Liste d’émargement — ${s.titre}`, bodyClass: 'page-election', s, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt };
  if (!acces) return res.render('election-emargement', { ...commun, mode: 'connexion', jeton: null });
  const [electeurs, part] = await Promise.all([
    prisma.electeur.findMany({
      where: { scrutinId: s.id }, orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
      select: { id: true, civilite: true, nom: true, prenom: true, classe: true, emargements: { where: { scrutinId: s.id }, select: { voteLe: true, mode: true, cni: true, email: true, ip: true, pieceId: true } } },
    }),
    el.participation(prisma, s.id),
  ]);
  return res.render('election-emargement', { ...commun, mode: 'liste', acces, electeurs, part, ph: el.phase(s), maintenant: new Date() });
});

// Membre du bureau : demande d'un lien de connexion (même réponse que l'adresse soit enregistrée ou non)
router.post('/aidus/emargement/connexion', async (req, res) => {
  const ip = req.ip || 'inconnue';
  const adresse = (req.body.email || '').trim().toLowerCase().slice(0, 120);
  if (!el.EMAIL_RE.test(adresse)) return go(res, EMARGEMENT, 'error', 'Indiquez une adresse e-mail valide.');
  if (limiteAtteinte('lien:' + ip, 5)) return go(res, EMARGEMENT, 'error', 'Trop de demandes. Patientez un quart d’heure, puis réessayez.');
  noter('lien:' + ip);
  const membre = await prisma.membreBureau.findUnique({ where: { scrutinId_email: { scrutinId: el.SCRUTIN, email: adresse } } }).catch(() => null);
  if (membre) {
    const s = await el.charger(prisma).catch(() => null);
    const lien = `${baseLiens(req)}${EMARGEMENT}/acces/${el.jetonBureau(membre.id)}`;
    await email.sendBureauVote(membre.email, { nom: membre.nom, titre: s ? s.titre : 'Élection', lien, minutes: el.DUREE_LIEN / 60000 }).catch(() => false);
  }
  return go(res, EMARGEMENT, 'success', 'Si cette adresse est celle d’un membre du bureau de vote, un lien de connexion vient d’y être envoyé (valable 30 minutes).');
});

// Lien reçu par e-mail : page de confirmation (un simple clic, pas d'ouverture automatique
// par les antivirus des messageries), puis connexion
router.get('/aidus/emargement/acces/:jeton', async (req, res) => {
  const s = await el.charger(prisma).catch(() => null);
  if (!s) return go(res, '/', 'error', 'L’espace de vote n’est pas encore ouvert.');
  if (!el.lireJetonBureau(req.params.jeton)) return go(res, EMARGEMENT, 'error', 'Ce lien n’est plus valable : demandez-en un nouveau.');
  return res.render('election-emargement', { title: `Liste d’émargement — ${s.titre}`, bodyClass: 'page-election', s, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt, mode: 'confirmer', jeton: req.params.jeton });
});
router.post('/aidus/emargement/acces/:jeton', async (req, res) => {
  const j = el.lireJetonBureau(req.params.jeton);
  if (!j) return go(res, EMARGEMENT, 'error', 'Ce lien n’est plus valable : demandez-en un nouveau.');
  const membre = await prisma.membreBureau.findFirst({ where: { id: j.membreId, scrutinId: el.SCRUTIN } }).catch(() => null);
  if (!membre) return go(res, EMARGEMENT, 'error', 'Cette adresse n’est plus enregistrée au bureau de vote.');
  if (membre.derniereConnexion && membre.derniereConnexion.getTime() >= j.emisLe) return go(res, EMARGEMENT, 'error', 'Ce lien a déjà servi : demandez-en un nouveau.');
  const maintenant = new Date();
  // Usage unique, même avec deux clics simultanés : la mise à jour n'aboutit qu'une fois
  const r = await prisma.membreBureau.updateMany({ where: { id: membre.id, OR: [{ derniereConnexion: null }, { derniereConnexion: { lt: new Date(j.emisLe) } }] }, data: { derniereConnexion: maintenant } });
  if (!r.count) return go(res, EMARGEMENT, 'error', 'Ce lien a déjà servi : demandez-en un nouveau.');
  req.session.bureauVote = { id: membre.id, jusqua: maintenant.getTime() + el.DUREE_SESSION_BUREAU };
  return go(res, EMARGEMENT, 'success', `Bienvenue${membre.nom ? ' ' + membre.nom : ''} : vous êtes connecté(e) à la liste d’émargement pour 12 heures.`);
});
router.post('/aidus/emargement/deconnexion', (req, res) => {
  delete req.session.bureauVote;
  return go(res, EMARGEMENT, 'success', 'Vous êtes déconnecté(e) de la liste d’émargement.');
});

// Pièce d'identité jointe à un vote : servie seulement au super admin et au bureau de vote
router.get('/aidus/emargement/pieces/:id', async (req, res) => {
  if (!(await accesEmargement(req))) return res.status(403).type('text').send('Accès réservé au Comité électoral.');
  const p = await prisma.electionPiece.findFirst({ where: { id: String(req.params.id), scrutinId: el.SCRUTIN } }).catch(() => null);
  if (!p) return res.status(404).type('text').send('Pièce introuvable.');
  res.set({ 'Content-Type': p.mime, 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline; filename="piece-identite.jpg"' });
  return res.send(Buffer.from(p.data));
});

// Export CSV de l'émargement (qui a voté) — jamais le choix
router.get('/aidus/emargement.csv', async (req, res) => {
  const acces = await accesEmargement(req);
  if (!acces) return go(res, EMARGEMENT, 'error', 'Connectez-vous d’abord.');
  const lignes = await prisma.emargement.findMany({
    where: { scrutinId: el.SCRUTIN }, orderBy: { voteLe: 'asc' },
    include: { electeur: { select: { civilite: true, nom: true, prenom: true, classe: true, campus: true } } },
  });
  const cel = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const entete = ['Date (GMT)', 'Civilité', 'Nom', 'Prénom', 'Classe', 'Campus', 'Pièce d’identité', 'Mode', 'Pièce jointe']
    .concat(acces.superAdmin ? ['E-mail de confirmation', 'Adresse IP', 'Appareil'] : []);
  const texte = [entete.join(';')]
    .concat(lignes.map((l) => [
      new Date(l.voteLe).toISOString().replace('T', ' ').slice(0, 19), l.electeur.civilite, l.electeur.nom, l.electeur.prenom,
      l.electeur.classe, l.electeur.campus, el.formatPiece(l.cni), l.mode === 'presentiel' ? 'présentiel' : 'en ligne', l.pieceId ? 'oui' : 'non',
    ].concat(acces.superAdmin ? [l.email, l.ip, l.terminal] : []).map(cel).join(';')))
    .join('\r\n');
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="emargement-aidus.csv"');
  return res.send('﻿' + texte);
});

module.exports = router;
module.exports.COOKIE_BUREAU = COOKIE_BUREAU;
