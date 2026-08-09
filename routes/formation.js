// EduWeb Formation — tests psychotechniques (exerciseurs objectifs)
//
// Parcours : découverte publique → demande d'inscription (validée par un
// administrateur) → théorie & astuces → tests (entraînement ou conditions de
// concours), questions mélangées à chaque tentative et par utilisateur, en
// difficulté croissante → score + diagnostic de performance par IA +
// conseils de perspectives.

const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireAuth } = require('../middleware/auth');
const bank = require('../data/formation');
const meta = require('../data/formation/meta');
const diagnostic = require('../services/diagnostic');
const webauthn = require('../services/webauthn');
const email = require('../services/email');

// Fenêtre de validité de la vérification biométrique avant un test (10 min)
const BIOMETRIE_TTL_MS = 10 * 60 * 1000;

// ─── Aides ───
async function enrollmentOf(userId) {
  if (!userId) return null;
  try {
    return await prisma.formationEnrollment.findUnique({ where: { userId } });
  } catch (e) {
    // Table absente (migration pas encore appliquée) : la page reste consultable
    console.warn('[formation] enrollment indisponible :', e.message);
    return null;
  }
}

function isApproved(enr) { return !!(enr && enr.statut === 'approuve'); }

// Réservé aux inscrits validés (les admins ont accès pour contrôle)
async function requireApproved(req, res, next) {
  const user = req.session.user;
  if (!user) return go(res, '/auth/login', 'warning', 'Veuillez vous connecter pour continuer.');
  if (user.role === 'admin') { req.formationEnrollment = null; return next(); }
  const enr = await enrollmentOf(user.id);
  if (!isApproved(enr)) {
    return go(res, '/formation', 'warning', 'Votre inscription à la Formation doit d’abord être validée par un administrateur.');
  }
  req.formationEnrollment = enr;
  next();
}

// ─── Accueil de la section Formation ───
router.get('/', async (req, res) => {
  const user = req.session.user || null;
  const enr = user ? await enrollmentOf(user.id) : null;

  // Progression par catégorie (pour les inscrits validés)
  let progression = null;
  let dernieres = [];
  if (user && (isApproved(enr) || user.role === 'admin')) {
    try {
      const attempts = await prisma.quizAttempt.findMany({
        where: { userId: user.id, statut: 'termine' },
        orderBy: { createdAt: 'desc' },
      });
      progression = {};
      for (const c of meta.CATEGORIES) {
        const das = attempts.filter((a) => a.categorie === c.id);
        // Le « meilleur » score n'agrège pas les modes : un entraînement (corrections
        // affichées) ne vaut pas un test en conditions de concours.
        const exam = das.filter((a) => a.mode === 'examen');
        const entr = das.filter((a) => a.mode !== 'examen');
        const pctMax = (arr) => (arr.length ? Math.max(...arr.map((a) => Math.round((a.score / a.nbQuestions) * 100))) : null);
        progression[c.id] = {
          tentatives: das.length,
          meilleurExamen: pctMax(exam),
          meilleurEntrainement: pctMax(entr),
        };
      }
      dernieres = attempts.slice(0, 5);
    } catch (e) { /* tables pas encore migrées */ }
  }

  res.render('formation/accueil', {
    title: 'Formation — Tests psychotechniques — EduWeb',
    bodyClass: 'page-formation',
    categories: meta.CATEGORIES,
    niveaux: meta.NIVEAUX,
    enrollment: enr,
    approved: user && (isApproved(enr) || user.role === 'admin'),
    progression,
    dernieres,
    totalQuestions: bank.totalCount(),
  });
});

// ─── Demande d'inscription ───
router.post('/inscription', requireAuth, async (req, res) => {
  const user = req.session.user;
  const { niveau, objectif } = req.body;
  if (!meta.niveau(niveau)) return go(res, '/formation', 'error', 'Choisissez un niveau valide.');

  const existing = await enrollmentOf(user.id);
  if (existing && existing.statut === 'approuve') return go(res, '/formation', 'success', 'Votre inscription est déjà validée.');
  if (existing && existing.statut === 'pending') return go(res, '/formation', 'warning', 'Votre demande est déjà en attente de validation.');

  try {
    if (existing) {
      await prisma.formationEnrollment.update({
        where: { id: existing.id },
        data: { niveau, objectif: (objectif || '').trim() || null, statut: 'pending', motifRefus: null },
      });
    } else {
      await prisma.formationEnrollment.create({
        data: { userId: user.id, niveau, objectif: (objectif || '').trim() || null },
      });
    }
  } catch (e) {
    console.error('[formation] inscription impossible :', e.message);
    return go(res, '/formation', 'error', 'Le service d’inscription est momentanément indisponible. Réessayez dans un instant.');
  }

  // Prévenir les administrateurs habilités (notification interne + e-mail)
  try {
    const admins = await prisma.user.findMany({ where: { role: 'admin', status: 'active' } });
    const habilites = admins.filter((a) => a.isSuperAdmin || (a.permissions || '').includes('formation'));
    const cibles = habilites.length ? habilites : admins.filter((a) => a.isSuperAdmin);
    await Promise.all(cibles.map((a) => prisma.notification.create({
      data: { userId: a.id, type: 'formation_demande', payload: JSON.stringify({ userId: user.id, name: user.name }) },
    })));
    cibles.forEach((a) => email.sendFormationRequest(a, user, niveau).catch(() => {}));
  } catch (e) { /* non bloquant */ }

  return go(res, '/formation', 'success', 'Votre demande d’inscription a été envoyée. Un administrateur va la valider : vous serez prévenu par e-mail.');
});

// ─── Théorie & astuces ───
router.get('/theorie', requireAuth, requireApproved, (req, res) => {
  res.render('formation/theorie-index', {
    title: 'Théorie et astuces — Formation EduWeb',
    bodyClass: 'page-formation',
    categories: meta.CATEGORIES,
    general: bank.theorie('general'),
  });
});

router.get('/theorie/:categorie', requireAuth, requireApproved, (req, res) => {
  const id = req.params.categorie;
  const fiche = bank.theorie(id);
  if (!fiche) return go(res, '/formation/theorie', 'error', 'Fiche introuvable.');
  res.render('formation/theorie', {
    title: `${fiche.titre} — Formation EduWeb`,
    bodyClass: 'page-formation',
    fiche,
    cat: meta.categorie(id),
    categories: meta.CATEGORIES,
    estGeneral: id === 'general',
  });
});

// ─── Choix d'un test ───
router.get('/tests', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;
  const enr = req.formationEnrollment;
  const compteurs = {};
  for (const c of meta.CATEGORIES) {
    compteurs[c.id] = {};
    for (const n of meta.NIVEAUX) compteurs[c.id][n.id] = bank.countFor(c.id, n.id);
  }
  res.render('formation/tests', {
    title: 'Passer un test — Formation EduWeb',
    bodyClass: 'page-formation',
    categories: meta.CATEGORIES,
    niveaux: meta.NIVEAUX,
    reglages: meta.REGLAGES,
    niveauDefaut: (enr && enr.niveau) || 'bepc',
    compteurs,
    biometrie: {
      dispo: await webauthn.hasCredential(user.id),
      valide: !!(req.session.biometrieOk && Date.now() - req.session.biometrieOk < BIOMETRIE_TTL_MS),
    },
  });
});

// ─── Démarrer un test ───
router.post('/tests/demarrer', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;
  const { categorie, niveau, mode, nb } = req.body;
  if (!meta.categorie(categorie)) return go(res, '/formation/tests', 'error', 'Catégorie invalide.');
  if (!meta.niveau(niveau)) return go(res, '/formation/tests', 'error', 'Niveau invalide.');
  const leMode = ['entrainement', 'examen'].includes(mode) ? mode : 'entrainement';
  const nbQ = meta.REGLAGES.nbQuestionsChoix.includes(Number(nb)) ? Number(nb) : meta.REGLAGES.nbQuestionsDefaut;

  // Empreinte digitale : si l'utilisateur en a enregistré une, elle doit avoir
  // été vérifiée il y a moins de 10 minutes.
  if (await webauthn.hasCredential(user.id)) {
    const ok = req.session.biometrieOk && Date.now() - req.session.biometrieOk < BIOMETRIE_TTL_MS;
    if (!ok) return go(res, '/formation/tests', 'warning', 'Confirmez d’abord votre empreinte digitale (bouton « Vérifier mon identité »).');
  }

  const fixed = bank.buildTest(categorie, niveau, nbQ);
  if (!fixed || !fixed.length) return go(res, '/formation/tests', 'error', 'Aucune question disponible pour cette combinaison pour le moment.');

  const tempsMaxSec = leMode === 'examen'
    ? fixed.reduce((s, q) => s + (q.duree || 60), 0) + fixed.reduce((s, q) => s + (q.memoSec || 0), 0)
    : null;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      categorie,
      niveau,
      mode: leMode,
      nbQuestions: fixed.length,
      questions: JSON.stringify(fixed),
      tempsMaxSec,
    },
  });
  res.redirect('/formation/tests/' + attempt.id);
});

// ─── Player ───
router.get('/tests/:id', requireAuth, requireApproved, async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== req.session.user.id) return go(res, '/formation/tests', 'error', 'Test introuvable.');
  if (attempt.statut === 'termine') return res.redirect('/formation/tests/' + attempt.id + '/resultat');

  const fixed = JSON.parse(attempt.questions);
  const reponses = JSON.parse(attempt.reponses || '{}');
  res.render('formation/player', {
    title: 'Test en cours — Formation EduWeb',
    bodyClass: 'page-formation page-player',
    hideChrome: true,
    attempt,
    cat: meta.categorie(attempt.categorie),
    niv: meta.niveau(attempt.niveau),
    questionsClient: bank.pourClient(fixed),
    reponses,
    tempsEcouleSec: Math.floor((Date.now() - new Date(attempt.createdAt).getTime()) / 1000),
  });
});

// Enregistrer la réponse à UNE question (l'entraînement renvoie la correction)
router.post('/tests/:id/reponse', requireAuth, requireApproved, async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== req.session.user.id) return res.status(404).json({ error: 'introuvable' });
  if (attempt.statut !== 'en_cours') return res.status(400).json({ error: 'test terminé' });

  // Mode examen : la limite de temps est appliquée CÔTÉ SERVEUR (le chrono du
  // navigateur n'est qu'un affichage). 30 s de grâce pour les latences réseau.
  if (attempt.mode === 'examen' && attempt.tempsMaxSec) {
    const ecoule = (Date.now() - new Date(attempt.createdAt).getTime()) / 1000;
    if (ecoule > attempt.tempsMaxSec + 30) {
      return res.status(409).json({ error: 'Temps écoulé', fini: true });
    }
  }

  const i = Number(req.body.i);
  const choix = req.body.choix === null || req.body.choix === undefined ? null : Number(req.body.choix);
  const fixed = JSON.parse(attempt.questions);
  if (!(i >= 0 && i < fixed.length)) return res.status(400).json({ error: 'question invalide' });
  if (choix !== null && !(choix >= 0 && choix <= 3)) return res.status(400).json({ error: 'réponse invalide' });

  const reponses = JSON.parse(attempt.reponses || '{}');
  if (reponses[i] === undefined) { // première réponse seulement (pas de correction rejouée)
    reponses[i] = choix;
    await prisma.quizAttempt.update({ where: { id: attempt.id }, data: { reponses: JSON.stringify(reponses) } });
  }

  if (attempt.mode === 'entrainement') {
    const q = fixed[i];
    return res.json({ ok: true, bonneReponse: q.bonneReponse, explication: q.explication, correct: reponses[i] === q.bonneReponse });
  }
  res.json({ ok: true });
});

// Terminer : score, statistiques, diagnostic IA + perspectives
router.post('/tests/:id/terminer', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== user.id) return res.status(404).json({ error: 'introuvable' });
  if (attempt.statut === 'termine') return res.json({ ok: true, url: '/formation/tests/' + attempt.id + '/resultat' });

  // Idempotence : une seule terminaison possible (double clic / requêtes
  // concurrentes → un seul calcul de score et UN SEUL diagnostic IA).
  const claimed = await prisma.quizAttempt.updateMany({
    where: { id: attempt.id, statut: 'en_cours' },
    data: { statut: 'calcul' },
  });
  if (!claimed.count) return res.json({ ok: true, url: '/formation/tests/' + attempt.id + '/resultat' });

  const fixed = JSON.parse(attempt.questions);
  const reponses = JSON.parse(attempt.reponses || '{}');
  const score = fixed.reduce((s, q, i) => s + (reponses[i] === q.bonneReponse ? 1 : 0), 0);
  const dureeSec = Math.min(
    Math.floor((Date.now() - new Date(attempt.createdAt).getTime()) / 1000),
    (attempt.tempsMaxSec || 24 * 3600) + 60
  );

  // Historique des % précédents (même catégorie) pour commenter la progression
  let historique = [];
  try {
    const prev = await prisma.quizAttempt.findMany({
      where: { userId: user.id, categorie: attempt.categorie, statut: 'termine' },
      orderBy: { createdAt: 'asc' },
      select: { score: true, nbQuestions: true },
    });
    historique = prev.map((a) => Math.round((a.score / a.nbQuestions) * 100));
  } catch (e) { /* non bloquant */ }

  try {
    const enr = await enrollmentOf(user.id);
    const { stats, diagnostic: diag } = await diagnostic.generer(fixed, reponses, {
      categorie: attempt.categorie,
      niveau: attempt.niveau,
      objectif: enr && enr.objectif,
      dureeSec,
      historique: historique.concat([Math.round((score / fixed.length) * 100)]),
    });

    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        score,
        dureeSec,
        statut: 'termine',
        finishedAt: new Date(),
        statsJson: JSON.stringify(stats),
        diagnostic: JSON.stringify(diag),
      },
    });
    res.json({ ok: true, url: '/formation/tests/' + attempt.id + '/resultat' });
  } catch (e) {
    // Échec du calcul : on rend la tentative reprenable plutôt que bloquée en « calcul »
    console.error('[formation] terminaison échouée :', e.message);
    await prisma.quizAttempt.updateMany({ where: { id: attempt.id, statut: 'calcul' }, data: { statut: 'en_cours' } }).catch(() => {});
    res.status(500).json({ error: 'Impossible de calculer le résultat. Réessayez.' });
  }
});

// ─── Résultat : score, correction expliquée, diagnostic IA, perspectives ───
router.get('/tests/:id/resultat', requireAuth, requireApproved, async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== req.session.user.id) return go(res, '/formation/tests', 'error', 'Résultat introuvable.');
  if (attempt.statut !== 'termine') return res.redirect('/formation/tests/' + attempt.id);

  res.render('formation/resultat', {
    title: 'Résultat du test — Formation EduWeb',
    bodyClass: 'page-formation',
    attempt,
    cat: meta.categorie(attempt.categorie),
    niv: meta.niveau(attempt.niveau),
    questions: JSON.parse(attempt.questions),
    reponses: JSON.parse(attempt.reponses || '{}'),
    stats: attempt.statsJson ? JSON.parse(attempt.statsJson) : null,
    diag: attempt.diagnostic ? JSON.parse(attempt.diagnostic) : null,
  });
});

// ─── Historique ───
router.get('/historique', requireAuth, requireApproved, async (req, res) => {
  let attempts = [];
  try {
    attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.session.user.id, statut: 'termine' },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) { /* table pas encore migrée */ }
  res.render('formation/historique', {
    title: 'Mes résultats — Formation EduWeb',
    bodyClass: 'page-formation',
    attempts,
    meta,
  });
});

// ─── Empreinte digitale (WebAuthn) ───
router.post('/biometrie/register-options', requireAuth, requireApproved, async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    res.json(await webauthn.registrationOptions(req, dbUser));
  } catch (e) {
    console.error('[webauthn] options :', e.message);
    res.status(500).json({ error: 'Biométrie indisponible sur cet appareil.' });
  }
});

router.post('/biometrie/register-verify', requireAuth, requireApproved, async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    const ok = await webauthn.verifyRegistration(req, dbUser, req.body);
    if (ok) req.session.biometrieOk = Date.now();
    res.json({ ok });
  } catch (e) {
    console.error('[webauthn] register :', e.message);
    res.status(400).json({ ok: false, error: 'Enregistrement refusé.' });
  }
});

router.post('/biometrie/auth-options', requireAuth, requireApproved, async (req, res) => {
  try {
    const options = await webauthn.authenticationOptions(req, req.session.user);
    if (!options) return res.status(404).json({ error: 'Aucune empreinte enregistrée.' });
    res.json(options);
  } catch (e) {
    res.status(500).json({ error: 'Biométrie indisponible.' });
  }
});

router.post('/biometrie/auth-verify', requireAuth, requireApproved, async (req, res) => {
  try {
    const ok = await webauthn.verifyAuthentication(req, req.session.user, req.body);
    res.json({ ok });
  } catch (e) {
    console.error('[webauthn] verify :', e.message);
    res.status(400).json({ ok: false, error: 'Vérification refusée.' });
  }
});

router.post('/biometrie/supprimer', requireAuth, requireApproved, async (req, res) => {
  await webauthn.removeCredentials(req.session.user.id);
  req.session.biometrieOk = null;
  return go(res, '/formation/tests', 'success', 'Empreinte digitale supprimée.');
});

module.exports = router;
