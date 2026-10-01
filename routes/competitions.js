// Mode compétition (public) — inscription libre SANS compte : identité,
// e-mail dont le fonctionnement est vérifié (domaine qui reçoit du courrier,
// puis code reçu par e-mail), engagement volontaire ; épreuves = quiz des
// chants, CHRONOMÉTRÉES et corrigées côté serveur ; classement automatique
// dès la fin de la compétition.
//
// Session (cookie signé) :
//   req.session.competitions[compId] = jeton   → compétiteur VALIDÉ (code saisi)
//   req.session.compAttente[compId] = { id, identite? } → en attente du code
// Un jeton n'est écrit en session qu'après un code juste, et il est régénéré à
// chaque validation : connaître l'e-mail d'un camarade ne permet ni de prendre
// sa place ni de le gêner.
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

const GRACE_MS = 20 * 1000; // tolérance réseau après la date limite de remise
const CODE_VALIDITE_MS = 30 * 60 * 1000;
const CODE_PENALITE_MS = 6 * 60 * 1000; // chaque code faux raccourcit la validité : 5 échecs = code mort
const CLASSES = ['6e', '5e', '4e', '3e', '2nde', '1re', 'Tle'];

// ─── Garde-fous (mémoire de l'instance : un frein anti-rafale, pas une sécurité) ───
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
const nouveauJeton = () => crypto.randomBytes(24).toString('hex');

async function envoyerCode(competiteur, competition, code) {
  const html = `
    <p>Bonjour <strong>${competiteur.prenoms} ${competiteur.nom}</strong>,</p>
    <p>Voici votre code de vérification pour la compétition <strong>${competition.titre}</strong> :</p>
    <p style="font-size:30px;font-weight:800;letter-spacing:6px;text-align:center;margin:18px 0;color:#0E6B3A;">${code}</p>
    <p>Saisissez-le sur la page de la compétition pour accéder aux épreuves. Il expire dans 30 minutes.</p>
    <p style="font-size:13px;color:#7A8A7A;">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : personne ne peut accéder à votre participation sans ce code.</p>`;
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
function attenteDe(req, competition) {
  const a = req.session && req.session.compAttente && req.session.compAttente[competition.id];
  return a && a.id ? a : null;
}
function mettreEnAttente(req, competition, attente) {
  req.session.compAttente = Object.assign({}, req.session.compAttente || {}, { [competition.id]: attente });
}
function oublier(req, competition) {
  if (req.session.competitions) { const c = { ...req.session.competitions }; delete c[competition.id]; req.session.competitions = c; }
  if (req.session.compAttente) { const a = { ...req.session.compAttente }; delete a[competition.id]; req.session.compAttente = a; }
}
// Compétiteur validé de cette session
async function competiteurDe(req, competition) {
  const jeton = jetonDe(req, competition);
  if (!jeton) return null;
  const k = await prisma.competiteur.findUnique({ where: { jeton }, include: { resultats: true } });
  return k && k.competitionId === competition.id && k.emailVerifie ? k : null;
}
// Compétiteur dont cette session attend la saisie du code (inscription ou reprise)
async function competiteurEnAttente(req, competition) {
  const a = attenteDe(req, competition);
  if (!a) return null;
  const k = await prisma.competiteur.findUnique({ where: { id: a.id } });
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

// Vérification instantanée de l'e-mail (formulaire d'inscription). Au-delà du
// plafond (une classe entière sur une seule IP), réponse NEUTRE : le code par
// e-mail fera foi.
router.get('/verifier-email', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (tropDeRequetes('mail|' + (req.ip || '?'), 120, 60 * 1000)) {
    return res.json({ ok: null, message: 'Vérification différée — le code envoyé par e-mail fera foi.' });
  }
  res.json(await verifierEmail(req.query.e));
});

// ─── Page d'une compétition : inscription → code → épreuves → classement ───
async function rendrePage(req, res, competition, extra) {
  const maintenant = new Date();
  const etat = comp.etat(competition, maintenant);
  const epreuves = comp.epreuvesDe(competition);
  const competiteur = await competiteurDe(req, competition);
  const attente = competiteur ? null : await competiteurEnAttente(req, competition);
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
    competition, etat, epreuves, competiteur, attente, classement, admin, prefill,
    emailMasque: attente ? comp.masquerEmail(attente.email) : '',
    totalPossible: comp.totalPossible(competition),
    reglement: competition.reglement || comp.REGLEMENT_DEFAUT,
    classes: CLASSES,
    vueClassement: false,
    maintenant,
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

// ─── Inscription (ou reprise d'une inscription existante depuis un autre appareil) ───
router.post('/:slug/inscription', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const retour = `/competitions/${competition.slug}`;
  if ((req.body.website || '').trim()) return go(res, retour, 'error', 'Inscription refusée.');
  if (comp.etat(competition) === 'terminee') return go(res, retour, 'error', 'Cette compétition est terminée : les inscriptions sont closes.');

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

  // Garde-fous APRÈS validation (un essai raté ne consomme rien) : plafond serré
  // par boîte e-mail (anti-bombardement), plafond large par IP (une classe entière
  // partage souvent une seule adresse publique).
  if (tropDeRequetes('insc-mail|' + adresse, 3, 10 * 60 * 1000)) {
    return go(res, retour, 'error', 'Un code vient déjà d’être envoyé à cette adresse : vérifiez vos courriers indésirables, puis réessayez dans quelques minutes.');
  }
  if (tropDeRequetes('insc-ip|' + (req.ip || '?'), 60, 10 * 60 * 1000)) {
    return go(res, retour, 'error', 'Trop d’inscriptions en peu de temps depuis votre réseau — patientez quelques minutes puis réessayez.');
  }

  const identite = { nom, prenoms, genre, niveau, etablissement: etablissement || null, ville: ville || null, telephone, userId: (req.session.user && req.session.user.id) || null };
  const code = nouveauCode();
  const donneesCode = { codeEmail: sha(code), codeExpireAt: new Date(Date.now() + CODE_VALIDITE_MS) };
  let competiteur = await prisma.competiteur.findUnique({ where: { competitionId_email: { competitionId: competition.id, email: adresse } } });
  if (competiteur) {
    // Déjà inscrit (autre appareil, cookie expiré, saisie répétée, ou quelqu'un
    // qui tape l'e-mail d'un autre) : identité, statut vérifié et jeton INTACTS.
    // Cette session garde l'identité saisie : elle ne sera appliquée qu'au code
    // juste, et seulement si la fiche n'avait jamais été validée (anti-squat).
    competiteur = await prisma.competiteur.update({ where: { id: competiteur.id }, data: donneesCode });
    mettreEnAttente(req, competition, { id: competiteur.id, identite });
  } else {
    competiteur = await prisma.competiteur.create({ data: {
      competitionId: competition.id, ...identite, email: adresse,
      jeton: nouveauJeton(), engagementAt: new Date(), ...donneesCode,
    } });
    mettreEnAttente(req, competition, { id: competiteur.id });
  }
  const envoye = await envoyerCode(competiteur, competition, code);
  if (!envoye) return go(res, retour, 'warning', 'Inscription enregistrée, mais l’e-mail n’a pas pu partir. Utilisez « Renvoyer le code » dans un instant.');
  // Même message qu'il y ait déjà une inscription ou non (pas d'énumération des inscrits)
  return go(res, retour, 'success', `Un code de vérification a été envoyé à ${comp.masquerEmail(adresse)} : saisissez-le pour accéder aux épreuves.`);
});

// ─── Code de vérification ───
router.post('/:slug/code', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const retour = `/competitions/${competition.slug}`;
  if (await competiteurDe(req, competition)) return go(res, retour, 'success', 'Votre e-mail est déjà vérifié.');
  const attente = attenteDe(req, competition);
  const competiteur = await competiteurEnAttente(req, competition);
  if (!competiteur) return go(res, retour, 'error', 'Inscrivez-vous d’abord.');
  if (tropDeRequetes('code|' + competiteur.id, 10, 10 * 60 * 1000)) return go(res, retour, 'error', 'Trop d’essais : demandez un nouveau code dans quelques minutes.');
  if (!competiteur.codeEmail || !competiteur.codeExpireAt) return go(res, retour, 'error', 'Aucun code en attente : demandez-en un nouveau.');
  if (new Date(competiteur.codeExpireAt) < new Date()) return go(res, retour, 'error', 'Ce code a expiré : demandez-en un nouveau.');
  const code = String(req.body.code || '').replace(/\D/g, '');
  if (code.length !== 6 || sha(code) !== competiteur.codeEmail) {
    // Chaque échec raccourcit la validité du code (en base, donc fiable sur
    // lambdas sans état) : au 5e, il est mort et il faut en redemander un.
    const expire = new Date(new Date(competiteur.codeExpireAt).getTime() - CODE_PENALITE_MS);
    await prisma.competiteur.update({ where: { id: competiteur.id }, data: { codeExpireAt: expire } });
    return go(res, retour, 'error', expire < new Date() ? 'Code incorrect — ce code est annulé, demandez-en un nouveau.' : 'Code incorrect.');
  }
  const data = { emailVerifie: true, codeEmail: null, codeExpireAt: null, jeton: nouveauJeton() }; // rotation : seul cet appareil est connecté
  // Fiche jamais validée (créée par cette session… ou par un tiers avec cet e-mail) :
  // c'est l'identité de celui qui prouve la boîte qui compte.
  if (!competiteur.emailVerifie && attente && attente.identite) Object.assign(data, attente.identite);
  const maj = await prisma.competiteur.update({ where: { id: competiteur.id }, data });
  oublier(req, competition);
  memoriser(req, competition, maj.jeton);
  return go(res, retour, 'success', 'E-mail vérifié ✅ Vous pouvez commencer les épreuves.');
});

router.post('/:slug/code/renvoyer', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const retour = `/competitions/${competition.slug}`;
  if (await competiteurDe(req, competition)) return go(res, retour, 'success', 'Votre e-mail est déjà vérifié.');
  const competiteur = await competiteurEnAttente(req, competition);
  if (!competiteur) return go(res, retour, 'error', 'Inscrivez-vous d’abord.');
  if (tropDeRequetes('insc-mail|' + competiteur.email, 3, 10 * 60 * 1000)) {
    return go(res, retour, 'error', 'Un code vient déjà d’être envoyé : vérifiez vos courriers indésirables, puis réessayez dans quelques minutes.');
  }
  const code = nouveauCode();
  await prisma.competiteur.update({ where: { id: competiteur.id }, data: { codeEmail: sha(code), codeExpireAt: new Date(Date.now() + CODE_VALIDITE_MS) } });
  const envoye = await envoyerCode(competiteur, competition, code);
  return go(res, retour, envoye ? 'success' : 'error', envoye ? 'Nouveau code envoyé.' : 'L’e-mail n’a pas pu partir : réessayez dans un instant.');
});

// Ce n'est pas vous ? (appareil partagé) : on oublie le compétiteur de cette session
router.post('/:slug/quitter', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  oublier(req, competition);
  return go(res, `/competitions/${competition.slug}`, 'success', 'Vous pouvez inscrire un autre compétiteur sur cet appareil.');
});

// ─── Épreuve chronométrée ───
// Ouvrir une NOUVELLE épreuve exige que la compétition soit en cours ; remettre
// une épreuve DÉJÀ ouverte reste possible jusqu'à sa date limite (chrono borné
// par la fin de la compétition) + tolérance, même si la compétition vient de
// se terminer.
async function contexteEpreuve(req, res, competition) {
  const retour = `/competitions/${competition.slug}`;
  const etat = comp.etat(competition);
  if (etat === 'avant' || etat === 'brouillon') { go(res, retour, 'warning', 'Les épreuves ne sont pas encore ouvertes.'); return null; }
  const competiteur = await competiteurDe(req, competition);
  if (!competiteur) {
    go(res, retour, 'warning', attenteDe(req, competition) ? 'Saisissez d’abord le code reçu par e-mail.' : 'Inscrivez-vous pour participer.');
    return null;
  }
  const epreuve = comp.epreuvesDe(competition).find((e) => e.slug === req.params.eslug);
  if (!epreuve) { go(res, retour, 'error', 'Cette épreuve ne fait pas partie de la compétition.'); return null; }
  return { retour, competiteur, epreuve, etat };
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

// Questions d'une épreuve pour UN compétiteur : ordre des questions et des
// propositions propre à son résultat (graine = id du résultat), sans corrigé.
function questionsPour(epreuve, resultat) {
  const quiz = epreuve.chant.quiz;
  return comp.melangeSeme(quiz.length, resultat.id + '|q').map((i) => {
    const q = correction.pourCompetiteur(quiz[i]);
    const base = { i, type: q.type, question: q.question, image: q.image, imageAlt: q.imageAlt, options: null, items: null };
    if (q.options) base.options = comp.melangeSeme(q.options.length, resultat.id + '|o' + i).map((j) => ({ j, texte: q.options[j] }));
    if (q.items) base.items = comp.melangeSeme(q.items.length, resultat.id + '|i' + i).map((j) => ({ j, texte: q.items[j] }));
    return base;
  });
}

router.get('/:slug/epreuve/:eslug', async (req, res) => {
  const competition = await trouverCompetition(req.params.slug);
  if (!competition) return go(res, '/competitions', 'error', 'Cette compétition est introuvable.');
  const ctx = await contexteEpreuve(req, res, competition);
  if (!ctx) return;
  const { retour, competiteur, epreuve, etat } = ctx;
  let resultat = competiteur.resultats.find((r) => r.epreuveSlug === epreuve.slug);
  if (!resultat) {
    if (etat !== 'en_cours') return go(res, retour, 'warning', 'La compétition est terminée : plus aucune épreuve ne peut être commencée.');
    // Le chrono démarre à la PREMIÈRE ouverture (côté serveur)
    resultat = await prisma.resultatEpreuve.create({ data: { competiteurId: competiteur.id, epreuveSlug: epreuve.slug, total: epreuve.total } });
  }
  if (resultat.finAt) return go(res, retour, 'warning', `Vous avez déjà terminé l’épreuve « ${epreuve.chant.titre} ».`);
  const limite = comp.limiteRemise(competition, epreuve, resultat);
  const restant = limite - Date.now();
  if (restant <= -GRACE_MS) {
    await cloturer(resultat, competiteur, comp.epreuvesDe(competition), { score: 0, total: epreuve.total, tempsMs: Math.min(epreuve.dureeSec * 1000, limite - new Date(resultat.debutAt).getTime()), reponses: {} });
    return go(res, retour, 'error', `Temps écoulé pour l’épreuve « ${epreuve.chant.titre} » : elle est comptée 0 / ${epreuve.total}.`);
  }
  res.set('Cache-Control', 'no-store');
  res.render('competition-epreuve', {
    title: `${epreuve.chant.titre} — ${competition.titre}`,
    bodyClass: 'page-ressources',
    competition, epreuve, competiteur,
    questions: questionsPour(epreuve, resultat),
    restantMs: Math.max(0, restant),
    dureeMs: epreuve.dureeSec * 1000,
    ecourtee: competition.finAt && limite < new Date(resultat.debutAt).getTime() + epreuve.dureeSec * 1000, // chrono borné par la fin de la compétition
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
  const limite = comp.limiteRemise(competition, epreuve, resultat);
  const debut = new Date(resultat.debutAt).getTime();
  const ecoule = Date.now() - debut;
  if (Date.now() > limite + GRACE_MS) {
    await cloturer(resultat, competiteur, epreuves, { score: 0, total: epreuve.total, tempsMs: Math.min(epreuve.dureeSec * 1000, limite - debut), reponses: {} });
    return go(res, retour, 'error', `Temps écoulé : les réponses de l’épreuve « ${epreuve.chant.titre} » sont arrivées trop tard (0 / ${epreuve.total}).`);
  }
  // Correction côté serveur (les champs portent les indices d'origine des questions et propositions)
  const reponses = {};
  let score = 0;
  epreuve.chant.quiz.forEach((q, i) => {
    const brut = req.body['q' + i];
    reponses[i] = Array.isArray(brut) ? brut.slice(0, 20).map((v) => String(v).slice(0, 200)) : String(brut == null ? '' : brut).slice(0, 200);
    if (correction.estJuste(q, brut)) score += 1;
  });
  const tempsMs = Math.min(ecoule, epreuve.dureeSec * 1000, Math.max(0, limite - debut));
  const ok = await cloturer(resultat, competiteur, epreuves, { score, total: epreuve.total, tempsMs, reponses });
  if (!ok) return go(res, retour, 'warning', 'Cette épreuve est déjà terminée.');
  return go(res, retour, 'success', `Épreuve « ${epreuve.chant.titre} » terminée : ${score} / ${epreuve.total} en ${comp.formatDuree(tempsMs)}.`);
});

module.exports = router;
