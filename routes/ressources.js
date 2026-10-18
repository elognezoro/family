// Banque de ressources didactiques — page publique structurée par niveau,
// alimentée par l'admin (/admin/ressources). Les visiteurs peuvent soutenir
// la banque par un don (/dons, mobile money déclaré vérifié par l'admin).
// Fréquentation : consultations de la banque (SiteStat.ressourcesVisites),
// consultations et téléchargements de chaque ressource (vues / telechargements).
// Téléchargement payant (ressources marquées par l'admin) : le visiteur verse
// le prix par mobile money et le déclare ; un admin vérifie puis lui envoie
// par e-mail un lien personnel (/ressources/telechargement/<jeton>). Pour une
// leçon en chanson, ce paiement débloque aussi le quiz complet ; sans achat,
// le quiz se limite à quelques questions d'essai (services/acces-lecons.js).
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');
const email = require('../services/email');
const chantsData = require('../data/chants');
const auteursData = require('../data/auteurs');
const competitions = require('../services/competitions');
const accesLecons = require('../services/acces-lecons');

// Cycles d'enseignement (barre latérale de la banque). Le niveau d'une
// ressource est un texte libre saisi par l'admin : son rang le range dans un
// cycle (dizaine du rang) et l'ordonne dans ce cycle.
const CYCLES = [
  { id: 'primaire', nom: 'Cycle primaire', sous: 'CP1 → CM2', icone: '🧒', min: 0, max: 9 },
  { id: 'secondaire1', nom: '1er cycle secondaire', sous: '6e → 3e', icone: '📗', min: 10, max: 19 },
  { id: 'secondaire2', nom: '2nd cycle secondaire', sous: '2nde → Terminale', icone: '📘', min: 20, max: 29 },
  { id: 'superieur', nom: 'Cycle supérieur', sous: 'BTS, licence, master…', icone: '🎓', min: 30, max: 39 },
];

// Rang canonique des niveaux, du préscolaire au supérieur (testés dans l’ordre) :
// le supérieur passe avant le collège (« Licence 3e année » ne doit pas tomber en 3e),
// les libellés de cycle avant Seconde / Première (« 2nd cycle », « Premier cycle »).
const RANGS_NIVEAUX = [
  [/pr[ée]scolaire|maternelle/i, 0],
  [/(^|[^a-z])bts(\W|$)|(^|[^a-z])dut(\W|$)/i, 31],
  [/licence\s*1|(^|[^a-z])l\s*1(\D|$)/i, 32],
  [/licence\s*2|(^|[^a-z])l\s*2(\D|$)/i, 33],
  [/licence\s*3|(^|[^a-z])l\s*3(\D|$)/i, 34],
  [/master\s*1|(^|[^a-z])m\s*1(\D|$)/i, 35],
  [/master\s*2|(^|[^a-z])m\s*2(\D|$)/i, 36],
  [/doctorat/i, 37],
  [/licence|master|universit|ing[ée]nieur|m[ée]decine|facult/i, 39],
  [/premier\s*cycle|(^|\D)1\s*er\s*cycle/i, 19],
  [/second\s*cycle|deuxi[eè]me\s*cycle|(^|\D)2\s*(n?d|e|è|eme|ème)\s*cycle/i, 29],
  [/(^|[^a-z])cp\s*1(\D|$)/i, 1],
  [/(^|[^a-z])cp\s*2(\D|$)/i, 2],
  [/(^|[^a-z])ce\s*1(\D|$)/i, 3],
  [/(^|[^a-z])ce\s*2(\D|$)/i, 4],
  [/(^|[^a-z])cm\s*1(\D|$)/i, 5],
  [/(^|[^a-z])cm\s*2(\D|$)/i, 6],
  [/primaire/i, 9],
  [/sixi|(^|\D)6\s*(e|è|eme|ème)/i, 11],
  [/cinqu|(^|\D)5\s*(e|è|eme|ème)/i, 12],
  [/quatri|(^|\D)4\s*(e|è|eme|ème)/i, 13],
  [/troisi|(^|\D)3\s*(e|è|eme|ème)/i, 14],
  [/coll[èe]ge/i, 19],
  [/seconde|(^|\D)2\s*(nde?|de)/i, 21],
  [/premi|(^|\D)1\s*(re|ère|ere)/i, 22],
  [/terminale|(^|\W)tle/i, 23],
  [/lyc[ée]e/i, 29],
  [/sup[ée]rieur/i, 39], // repli générique (« Cycle supérieur », « Enseignement supérieur »)
];
function rangNiveau(niveau) {
  for (const [re, rang] of RANGS_NIVEAUX) if (re.test(niveau)) return rang;
  return /tous/i.test(niveau) ? 99 : 90; // inconnus après le supérieur, « Tous niveaux » en dernier
}
function cycleDuRang(rang) {
  return CYCLES.find((c) => rang >= c.min && rang <= c.max) || null;
}

const nombreFr = (n) => Number(n || 0).toLocaleString('fr-FR');

// Conditions du téléchargement payant, avec le numéro de réception de chaque opérateur
function infosPaiement() {
  const c = APP.telechargementPayant;
  return {
    prix: c.prix,
    euros: c.euros,
    delaiHeures: c.delaiHeures,
    validiteJours: c.validiteJours,
    questionsEssai: accesLecons.NB_ESSAI, // quiz d'une leçon en chanson sans achat
    operateurs: c.operateurs.map((o) => ({ id: o.id, label: o.label, numero: APP.numeroOperateur(o.id) })),
  };
}
const estPayante = (r) => !!(r && r.type === 'fichier' && r.telechargementPayant);
const lienFichier = (url) => url + (url.indexOf('?') >= 0 ? '&' : '?') + 'download=1';

// Une consultation de la banque = une visite de /ressources par visiteur,
// au plus une fois par demi-heure (les rechargements ne gonflent pas le compteur).
const FENETRE_CONSULTATION = 30 * 60 * 1000;
function nouvelleConsultation(req) {
  if (!req.session) return false;
  const maintenant = Date.now();
  if (req.session.banqueVueAt && maintenant - req.session.banqueVueAt < FENETRE_CONSULTATION) return false;
  req.session.banqueVueAt = maintenant;
  return true;
}

// ─── La banque : cycles → accordéons par niveau → accordéons par discipline ───
router.get('/', async (req, res) => {
  const compter = nouvelleConsultation(req);
  res.set('Cache-Control', 'private, no-store'); // cartes « déjà payé » propres au visiteur
  const [ressources, statSite, ressourcesPayees] = await Promise.all([
    prisma.ressourceDidactique.findMany({
      where: { actif: true },
      orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
    }).catch((e) => { console.warn('[ressources] table indisponible :', e.message); return []; }),
    (compter
      ? prisma.siteStat.upsert({
          where: { id: 'site' },
          create: { id: 'site', ressourcesVisites: 1 },
          update: { ressourcesVisites: { increment: 1 } },
        })
      : prisma.siteStat.findUnique({ where: { id: 'site' } })
    ).catch(() => null),
    accesLecons.ressourcesPayees(prisma, req, res),
  ]);

  const niveaux = [];
  const stats = { consultations: statSite ? statSite.ressourcesVisites || 0 : 0, vues: 0, telechargements: 0 };
  for (const r of ressources) {
    let n = niveaux.find((x) => x.niveau === r.niveau);
    if (!n) { n = { niveau: r.niveau, rang: rangNiveau(r.niveau), disciplines: [], total: 0 }; niveaux.push(n); }
    const nomDisc = (r.discipline || '').trim() || 'Autres ressources';
    let d = n.disciplines.find((x) => x.nom === nomDisc);
    if (!d) { d = { nom: nomDisc, ressources: [] }; n.disciplines.push(d); }
    d.ressources.push(r); // déjà triées par (ordre, créée le)
    n.total += 1;
    stats.vues += r.vues || 0;
    stats.telechargements += r.telechargements || 0;
  }
  niveaux.sort((a, b) => a.rang - b.rang || a.niveau.localeCompare(b.niveau, 'fr'));
  for (const n of niveaux) {
    n.disciplines.sort((a, b) =>
      (a.nom === 'Autres ressources') - (b.nom === 'Autres ressources') || a.nom.localeCompare(b.nom, 'fr'));
  }

  // Répartition par cycle ; les niveaux hors cycle (« Tous niveaux »…) restent
  // visibles sous le cycle choisi, dans « Autres niveaux ».
  const cycles = CYCLES.map((c) => {
    const ns = niveaux.filter((n) => cycleDuRang(n.rang) === c);
    return { id: c.id, nom: c.nom, sous: c.sous, icone: c.icone, niveaux: ns, total: ns.reduce((s, n) => s + n.total, 0) };
  });
  const autresNiveaux = niveaux.filter((n) => !cycleDuRang(n.rang));
  // Cycle affiché : celui de l'adresse (?cycle=…), sinon le premier qui a des ressources
  const demande = cycles.find((c) => c.id === req.query.cycle);
  const cycleActif = (demande || cycles.find((c) => c.total > 0) || cycles[1]).id;

  res.render('ressources', {
    title: 'Banque de ressources didactiques — EduWeb',
    bodyClass: 'page-ressources',
    niveaux,
    cycles,
    autresNiveaux,
    cycleActif,
    stats,
    nombreFr,
    chantDe: chantsData.pourRessource, // carte → bouton « Chanson & évaluation » si un chant correspond
    auteursDe: auteursData.pour, // discipline → accordéon « Auteurs » (discipline, niveau)
    paiement: infosPaiement(), // fenêtre « Télécharger » des ressources payantes
    ressourcesPayees, // déjà payées par ce visiteur : téléchargement sans nouvelle invitation à payer
    prefill: { nom: req.session.user ? req.session.user.name : '', email: req.session.user ? req.session.user.email : '' },
  });
});

// ─── Chanson + quiz d'une leçon (ex. /ressources/chants/svt6-chant-1) ───
router.get('/chants/:slug', async (req, res) => {
  const chant = chantsData.parSlug(req.params.slug);
  if (!chant) return go(res, '/ressources', 'error', 'Ce chant est introuvable.');
  // Le média peut venir de la banque : clip téléversé par l'admin et associé
  // automatiquement (discipline + niveau + numéro de leçon dans le titre).
  // La ressource correspondante est retrouvée dans tous les cas pour compter
  // ses consultations depuis cette page.
  let ressources = [];
  try {
    ressources = await prisma.ressourceDidactique.findMany({ where: { actif: true }, orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }] });
  } catch (e) { /* la page reste utilisable sans média de la banque */ }
  const media = chantsData.mediaDe(chant, ressources);
  // Clip payant à télécharger : lecteur sans menu « Télécharger » + bouton vers le paiement
  const ressource = ressources.find((r) => r.id === media.ressourceId) || null;
  const telechargementPayant = estPayante(ressource);
  // Pendant une compétition qui utilise ce chant, le quiz d'entraînement (et
  // son corrigé) est mis en pause : il ne doit pas servir d'antisèche.
  const verrou = (await competitions.chantsVerrouilles()).get(chant.slug) || null;
  // Clip payant : sans achat, quiz d'essai — seules les questions tirées sont
  // envoyées au navigateur (le reste de la banque et son corrigé n'y sont pas).
  // Le paiement de n'importe quelle ressource de la banque reliée à ce chant suffit.
  const idsDuChant = ressources.filter((r) => r.id === media.ressourceId || chantsData.pourRessource(r) === chant).map((r) => r.id);
  const { acces, achat } = telechargementPayant && !verrou ? await accesQuiz(req, res, idsDuChant) : { acces: 'libre', achat: null };
  const quiz = acces === 'essai'
    ? accesLecons.questionsEssai(req.session, chant.slug, chant.quiz.length).map((i) => chant.quiz[i])
    : chant.quiz;
  // La page dépend du visiteur (essai ou quiz complet) : jamais mise en cache
  res.set('Cache-Control', 'private, no-store');
  const u = req.session.user || null;
  res.render('ressource-chant', {
    title: `${chant.titre} — chanson & évaluation ${chant.discipline} ${chant.niveau} — EduWeb`,
    bodyClass: 'page-ressources',
    chant,
    quiz,
    acces,
    mediaType: media.type,
    mediaUrl: media.url,
    ressourceId: media.ressourceId,
    ressourceTitre: ressource ? ressource.titre : chant.titre,
    telechargementPayant,
    clipPaye: !!(achat && ressource && achat.ressourceId === ressource.id), // « Télécharger le clip (déjà payé) »
    paiement: infosPaiement(),
    prefill: { nom: u ? u.name : '', email: u ? u.email : '' },
    verrou,
    formatDate: competitions.formatDate,
  });
});

// Accès au quiz d'une leçon dont le clip est payant :
// 'admin' (quiz complet, pour vérifier les questions), 'achat' (paiement
// confirmé, revérifié en base : lien personnel déjà ouvert dans ce navigateur,
// ou compte connecté dont l'e-mail a payé) ou 'essai' (quelques questions, puis
// invitation à payer). achat : l'achat retrouvé (ressource payée, jeton).
async function accesQuiz(req, res, ressourceIds) {
  const u = req.session.user || null;
  if (u && u.role === 'admin') return { acces: 'admin', achat: null };
  const achat = await accesLecons.achatDuVisiteur(prisma, req, res, ressourceIds);
  return { acces: achat ? 'achat' : 'essai', achat };
}

// ─── Comptage d'une consultation / d'un téléchargement (balise envoyée par le navigateur) ───
// Sans corps ni réponse utile : le compteur est un indicateur, pas une donnée
// critique. Même ressource + même type + même visiteur : au plus 1 par minute.
const CHAMPS_STAT = { vue: 'vues', telechargement: 'telechargements' };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const _recents = new Map();
function dejaCompte(cle) {
  const maintenant = Date.now();
  const precedent = _recents.get(cle);
  if (precedent && maintenant - precedent < 60 * 1000) return true;
  _recents.set(cle, maintenant);
  if (_recents.size > 10000) _recents.clear(); // borne mémoire
  return false;
}
router.post('/:id/stat/:type', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const champ = CHAMPS_STAT[req.params.type];
  const id = req.params.id;
  if (!champ || !UUID_RE.test(id)) return res.status(404).end();
  if (dejaCompte(`${req.ip || 'inconnu'}|${id}|${champ}`)) return res.status(204).end();
  try {
    await prisma.ressourceDidactique.updateMany({ where: { id, actif: true }, data: { [champ]: { increment: 1 } } });
  } catch (e) { /* non bloquant */ }
  res.status(204).end();
});

// ─── Téléchargement payant : paiement déclaré, vérifié par un admin ───

// Page de paiement d'une ressource : repli sans JavaScript de la fenêtre
// « Télécharger » de la banque, et bouton de la page chanson. Une ressource
// gratuite part directement en téléchargement.
router.get('/:id/telecharger', async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return go(res, '/ressources', 'error', 'Ressource introuvable.');
  const r = await prisma.ressourceDidactique.findFirst({ where: { id: req.params.id, actif: true } }).catch(() => null);
  if (!r || r.type !== 'fichier') return go(res, '/ressources', 'error', 'Ressource introuvable.');
  if (!estPayante(r)) return res.redirect(lienFichier(r.url));
  res.set('Cache-Control', 'private, no-store');
  // Déjà payé (ce navigateur a ouvert le lien, ou compte qui a payé) : jamais de
  // nouveau paiement — la page du lien donne le fichier, ou la marche à suivre s'il a expiré.
  const dejaPaye = await accesLecons.achatDuVisiteur(prisma, req, res, [r.id]);
  if (dejaPaye) return res.redirect(`/ressources/telechargement/${encodeURIComponent(dejaPaye.jeton)}`);
  const u = req.session.user || null;
  res.render('ressource-telecharger', {
    title: `Télécharger « ${r.titre} » — EduWeb`,
    bodyClass: 'page-ressources',
    ressource: r,
    paiement: infosPaiement(),
    prefill: { nom: u ? u.name : '', email: u ? u.email : '' },
  });
});

// Limitation de débit en mémoire : 5 déclarations / 10 min / IP (même
// garde-fou que les dons ; meilleur effort sur lambda).
const _declarations = new Map();
function tropDeDeclarations(ip) {
  const maintenant = Date.now();
  const fenetre = 10 * 60 * 1000;
  const liste = (_declarations.get(ip) || []).filter((t) => maintenant - t < fenetre);
  if (liste.length >= 5) return true;
  liste.push(maintenant);
  _declarations.set(ip, liste);
  if (_declarations.size > 5000) _declarations.clear(); // borne mémoire
  return false;
}

// Alerte les admins « Finance » : le visiteur attend son lien (délai annoncé).
// Attendue (bornée à 4 s) : sur Vercel, un envoi lancé après la réponse peut
// ne jamais partir.
async function prevenirAdmins(achat) {
  try {
    const admins = await prisma.user.findMany({ where: { role: 'admin', status: 'active' } });
    const habilites = admins.filter((a) => APP.hasPerm(a, 'finance'));
    const envois = habilites.map((a) => email.sendAchatTelechargementDeclare(a, achat).catch(() => false));
    await Promise.race([Promise.allSettled(envois), new Promise((ok) => setTimeout(ok, 4000))]);
  } catch (e) { console.warn('[ressources] alerte admins :', e.message); }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.post('/:id/achat', async (req, res) => {
  // La fenêtre de la banque envoie le formulaire en arrière-plan (réponse JSON) ;
  // sans JavaScript, la page de paiement le poste normalement (redirection + message).
  const enJson = (req.get('accept') || '').includes('application/json');
  const valide = UUID_RE.test(req.params.id);
  const retour = valide ? `/ressources/${req.params.id}/telecharger` : '/ressources';
  const refus = (message, code = 400) => (enJson ? res.status(code).json({ ok: false, erreur: message }) : go(res, retour, 'error', message));

  if (!valide) return refus('Ressource introuvable.', 404);
  if ((req.body.website || '').trim()) return refus('Déclaration refusée.'); // piège à robots
  if (tropDeDeclarations(req.ip || 'inconnu')) {
    return refus('Trop de déclarations d’affilée — patientez quelques minutes puis réessayez.', 429);
  }
  const r = await prisma.ressourceDidactique.findFirst({ where: { id: req.params.id, actif: true } }).catch(() => null);
  if (!estPayante(r)) return refus('Cette ressource n’est pas en téléchargement payant.', 404);

  const conf = APP.telechargementPayant;
  const adresse = (req.body.email || '').trim().toLowerCase().slice(0, 120);
  const nom = (req.body.nom || '').trim().slice(0, 80);
  const telephone = (req.body.telephone || '').trim();
  const operateur = req.body.operateur;
  const refTransaction = (req.body.refTransaction || '').trim().slice(0, 60);

  if (!EMAIL_RE.test(adresse)) return refus('Indiquez une adresse e-mail valide : c’est là que vous recevrez le lien de téléchargement.');
  if (!conf.operateurs.some((o) => o.id === operateur)) return refus('Choisissez l’opérateur utilisé : Wave ou Flooz (Moov Money).');
  if (refTransaction.length < 4) return refus('Indiquez la référence (ID) de la transaction — reçue par SMS après le transfert.');
  if (telephone && !/^\+?[0-9 .-]{8,20}$/.test(telephone)) return refus('Le numéro de téléphone saisi est invalide (il est facultatif).');

  try {
    // Anti double-clic : même ressource + même versement + même e-mail = une seule déclaration
    const doublon = await prisma.achatTelechargement.findFirst({
      where: { ressourceId: r.id, operateur, refTransaction, email: adresse },
    });
    if (!doublon) {
      const achat = await prisma.achatTelechargement.create({
        data: {
          ressourceId: r.id,
          titreRessource: r.titre,
          nom: nom || null,
          email: adresse,
          telephone: telephone ? telephone.slice(0, 20) : null,
          montant: conf.prix,
          operateur,
          refTransaction,
          jeton: crypto.randomBytes(24).toString('base64url'),
        },
      });
      await prevenirAdmins(achat);
    }
  } catch (e) {
    console.error('[ressources] déclaration de paiement :', e.message);
    return refus('La déclaration n’a pas pu être enregistrée. Réessayez dans un instant.', 500);
  }
  if (enJson) return res.json({ ok: true, email: adresse, delaiHeures: conf.delaiHeures, validiteJours: conf.validiteJours });
  // Message générique : aucune saisie du visiteur n'est réinjectée dans le flash
  return go(res, retour, 'success',
    `✅ Merci ! Votre paiement de ${conf.prix} FCFA pour « ${r.titre} » est déclaré. Après vérification, vous recevrez le lien de téléchargement par e-mail en moins de ${conf.delaiHeures} heures, à l’adresse indiquée (pensez à regarder vos courriers indésirables).`);
});

// Lien personnel envoyé par e-mail après vérification du paiement : une page
// (titre, validité, bouton) puis le fichier. La page intermédiaire évite que
// les antivirus de messagerie, qui ouvrent les liens, lancent le téléchargement.
const JETON_RE = /^[A-Za-z0-9_-]{32}$/;
async function achatDuJeton(jeton) {
  if (!JETON_RE.test(jeton || '')) return null;
  return prisma.achatTelechargement.findUnique({ where: { jeton }, include: { ressource: true } }).catch(() => null);
}
function etatLien(achat) {
  if (!achat || achat.statut !== 'confirme') return 'invalide';
  if (!achat.expireAt || achat.expireAt < new Date()) return 'expire';
  if (!achat.ressource || !achat.ressource.actif || achat.ressource.type !== 'fichier') return 'indisponible';
  return 'ok';
}
// Un paiement confirmé débloque aussi le quiz complet de la leçon dans ce
// navigateur — même une fois le lien de téléchargement expiré. Le navigateur
// retient l'achat (revérifié en base à chaque vue).
function quizDebloque(req, res, achat) {
  if (!achat || achat.statut !== 'confirme' || !achat.ressource || !achat.ressource.actif) return null;
  accesLecons.retenirAchat(req, res, achat.id);
  return chantsData.pourRessource(achat.ressource);
}
router.get('/telechargement/:jeton', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Robots-Tag', 'noindex');
  const achat = await achatDuJeton(req.params.jeton);
  const chant = quizDebloque(req, res, achat);
  res.render('ressource-lien', {
    title: 'Votre téléchargement — EduWeb',
    bodyClass: 'page-ressources',
    achat,
    etat: etatLien(achat),
    chant, // leçon en chanson : bouton « Faire le quiz complet »
    formatDate: competitions.formatDate,
  });
});
router.get('/telechargement/:jeton/fichier', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const achat = await achatDuJeton(req.params.jeton);
  quizDebloque(req, res, achat);
  if (etatLien(achat) !== 'ok') return res.redirect(`/ressources/telechargement/${encodeURIComponent(req.params.jeton)}`);
  try {
    await prisma.achatTelechargement.update({ where: { id: achat.id }, data: { telechargements: { increment: 1 } } });
    if (!dejaCompte(`${req.ip || 'inconnu'}|${achat.ressource.id}|telechargements`)) {
      await prisma.ressourceDidactique.update({ where: { id: achat.ressource.id }, data: { telechargements: { increment: 1 } } });
    }
  } catch (e) { /* compteurs non bloquants */ }
  return res.redirect(lienFichier(achat.ressource.url));
});

module.exports = router;
