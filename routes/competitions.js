// Mode compétition (public) — inscription libre SANS compte : identité,
// e-mail dont le fonctionnement est vérifié (domaine qui reçoit du courrier,
// puis code reçu par e-mail), engagement volontaire ; épreuves = quiz des
// chants, CHRONOMÉTRÉES et corrigées côté serveur ; classement automatique
// dès la fin de la compétition.
const express = require('express');
const crypto = require('crypto');
const dns = require('dns').promises;
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');
const email = require('../services/email');
const correction = require('../services/quiz-correction');
const comp = require('../services/competitions');

const GRACE_MS = 20 * 1000; // tolérance réseau après la fin du chrono
const CODE_VALIDITE_MS = 30 * 60 * 1000;
const CLASSES = ['6e', '5e', '4e', '3e', '2nde', '1re', 'Tle'];

// ─── Garde-fous (mémoire de l'instance : suffisant contre les rafales) ───
const _compteurs = new Map();
function tropDeRequetes(cle, max, fenetreMs) {
  const maintenant = Date.now();
  const liste = (_compteurs.get(cle) || []).filter((t) => maintenant - t < fenetreMs);
  if (liste.length >= max) return true;
  liste.push(maintenant);
  _compteurs.set(cle, liste);
  if (_compteurs.size > 5000) _compteurs.clear();
  return false;
}

// ─── E-mail « fonctionnel » : syntaxe + domaine qui reçoit du courrier (MX, sinon A) ───
const _domaines = new Map(); // domaine → { ok, at }
function emailBienForme(e) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e) && e.length <= 120;
}
async function domaineRecoitDuCourrier(domaine) {
  const cache = _domaines.get(domaine);
  if (cache && Date.now() - cache.at < 10 * 60 * 1000) return cache.ok;
  const delai = (ms) => new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('timeout'), { code: 'TIMEOUT' })), ms));
  let ok = true;
  try {
    const mx = await Promise.race([dns.resolveMx(domaine), delai(3000)]);
    ok = Array.isArray(mx) && mx.length > 0;
  } catch (e) {
    if (/ENOTFOUND|NXDOMAIN|NOTFOUND|ENODATA/i.test(e.code || e.message)) {
      // Pas de MX : certains petits domaines reçoivent quand même via leur enregistrement A
      try { ok = (await Promise.race([dns.resolve4(domaine), delai(2000)])).length > 0; } catch (e2) { ok = false; }
    } else ok = true; // panne DNS : on ne bloque pas l'inscription, le code par e-mail tranchera
  }
  _domaines.set(domaine, { ok, at: Date.now() });
  if (_domaines.size > 2000) _domaines.clear();
  return ok;
}
async function verifierEmail(e) {
  const adresse = String(e || '').trim().toLowerCase();
  if (!emailBienForme(adresse)) return { ok: false, message: 'Adresse e-mail incomplète (ex. prenom@exemple.ci).' };
  const domaine = adresse.split('@')[1];
  if (!(await domaineRecoitDuCourrier(domaine))) {
    return { ok: false, message: `Le domaine « ${domaine} » ne reçoit pas de courrier : vérifiez l’orthographe de votre adresse.` };
  }
  return { ok: true, message: 'Adresse valide — un code de vérification vous sera envoyé.' };
}

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const nouveauCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');

async function envoyerCode(competiteur, competition, code) {
  const html = `
    <p>Bonjour <strong>${competiteur.prenoms} ${competiteur.nom}</strong>,</p>
    <p>Voici votre code de vérification pour la compétition <strong>${competition.titre}</strong> :</p>
    <p style="font-size:30px;font-weight:800;letter-spacing:6px;text-align:center;margin:18px 0;color:#0E6B3A;">${code}</p>
    <p>Saisissez-le sur la page de la compétition pour accéder aux épreuves. Il expire dans 30 minutes.</p>
    <p style="font-size:13px;color:#7A8A7A;">Si vous n’êtes pas à l’origine de cette inscription, ignorez cet e-mail.</p>`;
  return email.send(competiteur.email, `Votre code EduWeb : ${code} — ${competition.titre}`, html);
}

// ─── Accès aux objets ───
async function trouverCompetition(slug) {
  const c = await prisma.competition.findUnique({ where: { slug: String(slug || '').toLowerCase() } });
  return c && c.statut !== 'brouillon' ? c : null;
}
function jetonDe(req, competition) {
  return (req.session && req.session.competitions && req.session.competitions[competition.id]) || null;
}
function memoriser(req, competition, jeton) {
  req.session.competitions = Object.assign({}, req.session.competitions || {}, { [competition.id]: jeton });
}
async function competiteurDe(req, competition) {
  const jeton = jetonDe(req, competition);
  if (!jeton) return null;
  const k = await prisma.competiteur.findUnique({ where: { jeton }, include: { resultats: true } });
  return k && k.competitionId === competition.id ? k : null;
}
function estAdmin(req) { return APP.hasPerm(req.session && req.session.user, 'loterie'); }

// ─── Liste ───
router.get('/', async (req, res) => {
  let liste = [];
  try {
    liste = await prisma.competition.findMany({
      where: { statut: { not: 'brouillon' } },
      orderBy: [{ createdAt: 'desc' }],
      include: { _count: { select: { competiteurs: { where: { emailVerifie: true } } } } },
    });
  } catch (e) { console.warn('[competitions] table indisponible :', e.message); }
  const maintenant = new Date();
  const competitions = liste.map((c) => ({ ...c, etat: comp.etat(c, maintenant), epreuves: comp.epreuvesDe(c), inscrits: c._count.competiteurs }));
  res.render('competitions', {
    title: 'Compétitions — EduWeb',
    bodyClass: 'page-ressources',
    enCours: competitions.filter((c) => c.etat !== 'terminee'),
    terminees: competitions.filter((c) => c.etat === 'terminee'),
    comp,
  });
});

// Vérification instantanée de l'e-mail (formulaire d'inscription)
router.get('/verifier-email', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (tropDeRequetes('mail|' + (req.ip || '?'), 30, 60 * 1000)) return res.json({ ok: false, message: 'Trop de vérifications : patientez un instant.' });
  res.json(await verifierEmail(req.query.e));
});

// ─── Page d'une compétition : inscription → code → épreuves → classement ───
async function rendrePage(req, res, competition, extra) {
  const maintenant = new Date();
  const etat = comp.etat(competition, maintenant);
  const epreuves = comp.epreuvesDe(competition);
  const competiteur = await competiteurDe(req, competition);
  const admin = estAdmin(req);
  let classement = null;
  if (etat === 'terminee' || admin) {
    const tous = await prisma.competiteur.findMany({ where: { competitionId: competition.id }, include: { resultats: true } });
    classement = comp.classer(tous);
  }
  const u = req.session.user;
  const prefill = u ? { nom: '', prenoms: u.name || '', email: u.email || '' } : { nom: '', prenoms: '', email: '' };
  res.render('competition', Object.assign({
    title: `${competition.titre} — Compétition EduWeb`,
    bodyClass: 'page-ressources',
    competition, etat, epreuves, competiteur, classement, admin, prefill,
    totalPossible: comp.totalPossible(competition),
    reglement: competition.reglement || comp.REGLEMENT_DEFAUT,
    classes: CLASSES,
    vueClassement: false,
    comp,
  }, extra || {}));
}

router.get('/:slug', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  return rendrePage(req, res, competition);
});

// Classement (public dès la fin ; aperçu admin avant)
router.get('/:slug/classement', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  if (comp.etat(competition) !== 'terminee' && !estAdmin(req)) {
    return go(res, `/competitions/${competition.slug}`, 'warning', 'Le classement sera publié à la fin de la compétition.');
  }
  return rendrePage(req, res, competition, { vueClassement: true });
});

// ─── Inscription ───
router.post('/:slug/inscription', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const retour = `/competitions/${competition.slug}`;
  if ((req.body.website || '').trim()) return go(res, retour, 'error', 'Inscription refusée.');
  if (comp.etat(competition) === 'terminee') return go(res, retour, 'error', 'Cette compétition est terminée : les inscriptions sont closes.');
  if (tropDeRequetes('insc|' + (req.ip || '?'), 6, 10 * 60 * 1000)) {
    return go(res, retour, 'error', 'Trop d’inscriptions d’affilée depuis cet appareil — patientez quelques minutes.');
  }

  const champ = (n, max) => String(req.body[n] || '').trim().slice(0, max);
  const nom = champ('nom', 60), prenoms = champ('prenoms', 80), genre = champ('genre', 1);
  const niveau = champ('niveau', 40), etablissement = champ('etablissement', 100), ville = champ('ville', 60);
  const telephone = champ('telephone', 25);
  const adresse = champ('email', 120).toLowerCase();
  const engagement = req.body.engagement === 'oui';

  if (nom.length < 2 || prenoms.length < 2) return go(res, retour, 'error', 'Indiquez votre nom et vos prénoms.');
  if (!['F', 'M'].includes(genre)) return go(res, retour, 'error', 'Indiquez votre genre.');
  if (!niveau) return go(res, retour, 'error', 'Indiquez votre classe.');
  if (telephone.replace(/\D/g, '').length < 8) return go(res, retour, 'error', 'Indiquez un numéro de téléphone valide (au moins 8 chiffres).');
  const verif = await verifierEmail(adresse);
  if (!verif.ok) return go(res, retour, 'error', verif.message);
  if (!engagement) return go(res, retour, 'error', 'Vous devez valider la condition d’engagement volontaire pour participer.');

  const code = nouveauCode();
  const donnees = { codeEmail: sha(code), codeExpireAt: new Date(Date.now() + CODE_VALIDITE_MS) };
  let competiteur = await prisma.competiteur.findUnique({ where: { competitionId_email: { competitionId: competition.id, email: adresse } } });
  let message;
  if (competiteur) {
    // Déjà inscrit (autre appareil, ou saisie répétée) : on ne touche pas à
    // l'identité enregistrée, on redemande simplement un code — seul le
    // propriétaire de la boîte peut reprendre la participation.
    competiteur = await prisma.competiteur.update({ where: { id: competiteur.id }, data: { ...donnees, emailVerifie: false } });
    message = 'Cet e-mail est déjà inscrit à la compétition : un nouveau code vous a été envoyé pour reprendre votre participation.';
  } else {
    competiteur = await prisma.competiteur.create({ data: {
      competitionId: competition.id,
      userId: (req.session.user && req.session.user.id) || null,
      nom, prenoms, genre, niveau, etablissement: etablissement || null, ville: ville || null,
      telephone, email: adresse, jeton: crypto.randomBytes(24).toString('hex'),
      engagementAt: new Date(), ...donnees,
    } });
    message = 'Inscription enregistrée ! Saisissez le code envoyé à votre adresse e-mail pour accéder aux épreuves.';
  }
  memoriser(req, competition, competiteur.jeton);
  const envoye = await envoyerCode(competiteur, competition, code);
  if (!envoye) return go(res, retour, 'warning', 'Inscription enregistrée, mais l’e-mail n’a pas pu partir. Utilisez « Renvoyer le code » dans un instant.');
  return go(res, retour, 'success', message);
});

// ─── Code de vérification ───
router.post('/:slug/code', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const retour = `/competitions/${competition.slug}`;
  const competiteur = await competiteurDe(req, competition);
  if (!competiteur) return go(res, retour, 'error', 'Inscrivez-vous d’abord.');
  if (tropDeRequetes('code|' + competiteur.id, 10, 10 * 60 * 1000)) return go(res, retour, 'error', 'Trop d’essais : demandez un nouveau code dans quelques minutes.');
  const code = String(req.body.code || '').replace(/\D/g, '');
  if (code.length !== 6 || !competiteur.codeEmail || sha(code) !== competiteur.codeEmail) return go(res, retour, 'error', 'Code incorrect.');
  if (!competiteur.codeExpireAt || new Date(competiteur.codeExpireAt) < new Date()) return go(res, retour, 'error', 'Ce code a expiré : demandez-en un nouveau.');
  await prisma.competiteur.update({ where: { id: competiteur.id }, data: { emailVerifie: true, codeEmail: null, codeExpireAt: null } });
  return go(res, retour, 'success', 'E-mail vérifié ✅ Vous pouvez commencer les épreuves.');
});

router.post('/:slug/code/renvoyer', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const retour = `/competitions/${competition.slug}`;
  const competiteur = await competiteurDe(req, competition);
  if (!competiteur) return go(res, retour, 'error', 'Inscrivez-vous d’abord.');
  if (competiteur.emailVerifie) return go(res, retour, 'success', 'Votre e-mail est déjà vérifié.');
  if (tropDeRequetes('renvoi|' + competiteur.id, 3, 10 * 60 * 1000)) return go(res, retour, 'error', 'Un code vient déjà d’être envoyé : vérifiez vos courriers indésirables, puis réessayez dans quelques minutes.');
  const code = nouveauCode();
  await prisma.competiteur.update({ where: { id: competiteur.id }, data: { codeEmail: sha(code), codeExpireAt: new Date(Date.now() + CODE_VALIDITE_MS) } });
  const envoye = await envoyerCode(competiteur, competition, code);
  return go(res, retour, envoye ? 'success' : 'error', envoye ? 'Nouveau code envoyé.' : 'L’e-mail n’a pas pu partir : réessayez dans un instant.');
});

// Ce n'est pas vous ? (appareil partagé) : on oublie le compétiteur de cette session
router.post('/:slug/quitter', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  if (req.session.competitions) delete req.session.competitions[competition.id];
  return go(res, `/competitions/${competition.slug}`, 'success', 'Vous pouvez inscrire un autre compétiteur sur cet appareil.');
});

// ─── Épreuve chronométrée ───
async function contexteEpreuve(req, res, competition) {
  const retour = `/competitions/${competition.slug}`;
  if (comp.etat(competition) !== 'en_cours') { go(res, retour, 'warning', 'Les épreuves ne sont pas ouvertes en ce moment.'); return null; }
  const competiteur = await competiteurDe(req, competition);
  if (!competiteur) { go(res, retour, 'warning', 'Inscrivez-vous pour participer.'); return null; }
  if (!competiteur.emailVerifie) { go(res, retour, 'warning', 'Saisissez d’abord le code reçu par e-mail.'); return null; }
  const epreuve = comp.epreuvesDe(competition).find((e) => e.slug === req.params.eslug);
  if (!epreuve) { go(res, retour, 'error', 'Cette épreuve ne fait pas partie de la compétition.'); return null; }
  return { retour, competiteur, epreuve };
}

// Clôture d'une épreuve (une seule fois, même en cas de double envoi)
async function cloturer(resultat, competiteur, epreuves, data) {
  const r = await prisma.resultatEpreuve.updateMany({ where: { id: resultat.id, finAt: null }, data: { finAt: new Date(), ...data } });
  if (r.count === 0) return false;
  const agg = await prisma.resultatEpreuve.aggregate({ where: { competiteurId: competiteur.id, finAt: { not: null } }, _sum: { score: true, tempsMs: true }, _count: { _all: true } });
  const nb = agg._count._all;
  await prisma.competiteur.update({ where: { id: competiteur.id }, data: {
    scoreTotal: agg._sum.score || 0, tempsTotalMs: agg._sum.tempsMs || 0, nbEpreuves: nb,
    termineAt: nb >= epreuves.length ? new Date() : null,
  } });
  return true;
}

router.get('/:slug/epreuve/:eslug', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const ctx = await contexteEpreuve(req, res, competition);
  if (!ctx) return;
  const { retour, competiteur, epreuve } = ctx;
  let resultat = competiteur.resultats.find((r) => r.epreuveSlug === epreuve.slug);
  if (!resultat) {
    // Le chrono démarre à la PREMIÈRE ouverture (côté serveur)
    resultat = await prisma.resultatEpreuve.create({ data: { competiteurId: competiteur.id, epreuveSlug: epreuve.slug, total: epreuve.total } });
  }
  if (resultat.finAt) return go(res, retour, 'warning', `Vous avez déjà terminé l’épreuve « ${epreuve.chant.titre} ».`);
  const ecoule = Date.now() - new Date(resultat.debutAt).getTime();
  const restant = epreuve.dureeSec * 1000 - ecoule;
  if (restant <= -GRACE_MS) {
    await cloturer(resultat, competiteur, comp.epreuvesDe(competition), { score: 0, total: epreuve.total, tempsMs: epreuve.dureeSec * 1000, reponses: {} });
    return go(res, retour, 'error', `Temps écoulé pour l’épreuve « ${epreuve.chant.titre} » : elle est comptée 0 / ${epreuve.total}.`);
  }
  res.set('Cache-Control', 'no-store');
  res.render('competition-epreuve', {
    title: `${epreuve.chant.titre} — ${competition.titre}`,
    bodyClass: 'page-ressources',
    competition, epreuve, competiteur,
    questions: epreuve.chant.quiz.map(correction.pourCompetiteur),
    restantMs: Math.max(0, restant),
    comp,
  });
});

router.post('/:slug/epreuve/:eslug', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const ctx = await contexteEpreuve(req, res, competition);
  if (!ctx) return;
  const { retour, competiteur, epreuve } = ctx;
  const resultat = competiteur.resultats.find((r) => r.epreuveSlug === epreuve.slug);
  if (!resultat) return go(res, retour, 'error', 'Ouvrez d’abord l’épreuve.');
  if (resultat.finAt) return go(res, retour, 'warning', 'Cette épreuve est déjà terminée.');
  const epreuves = comp.epreuvesDe(competition);
  const ecoule = Date.now() - new Date(resultat.debutAt).getTime();
  if (ecoule > epreuve.dureeSec * 1000 + GRACE_MS) {
    await cloturer(resultat, competiteur, epreuves, { score: 0, total: epreuve.total, tempsMs: epreuve.dureeSec * 1000, reponses: {} });
    return go(res, retour, 'error', `Temps écoulé : les réponses de l’épreuve « ${epreuve.chant.titre} » sont arrivées trop tard (0 / ${epreuve.total}).`);
  }
  // Correction côté serveur
  const reponses = {};
  let score = 0;
  epreuve.chant.quiz.forEach((q, i) => {
    const brut = req.body['q' + i];
    reponses[i] = Array.isArray(brut) ? brut.map((v) => String(v).slice(0, 200)) : String(brut == null ? '' : brut).slice(0, 200);
    if (correction.estJuste(q, brut)) score += 1;
  });
  const tempsMs = Math.min(ecoule, epreuve.dureeSec * 1000);
  const ok = await cloturer(resultat, competiteur, epreuves, { score, total: epreuve.total, tempsMs, reponses });
  if (!ok) return go(res, retour, 'warning', 'Cette épreuve est déjà terminée.');
  return go(res, retour, 'success', `Épreuve « ${epreuve.chant.titre} » terminée : ${score} / ${epreuve.total} en ${comp.formatDuree(tempsMs)}.`);
});

module.exports = router;
