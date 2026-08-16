// Espace du rôle « Candidat Tests Psychotechniques » : un tableau de bord
// entièrement tourné vers la préparation aux concours.
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { requireRole } = require('../middleware/auth');
const bank = require('../data/formation');
const meta = require('../data/formation/meta');
const fpBank = require('../data/formation/fp');
const fpMeta = require('../data/formation/fp/meta');
const fpProgression = require('../services/fp-progression');

router.use(requireRole('candidat'));

router.get('/', async (req, res) => {
  const user = req.session.user;
  let enrollment = null;
  let attempts = [];
  try {
    enrollment = await prisma.formationEnrollment.findUnique({ where: { userId: user.id } });
    attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, statut: 'termine' },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) { /* tables indisponibles : le tableau reste consultable */ }

  const approuve = enrollment && enrollment.statut === 'approuve'
    && (!enrollment.expiresAt || new Date(enrollment.expiresAt) > new Date());

  // ── Épreuve 1 : tests psychotechniques — RÉSUMÉ compact (la progression
  // détaillée par catégorie vit dans le module /formation/psychotechniques) ──
  const attemptsPsy = attempts.filter((a) => a.categorie !== fpMeta.DOMAINE.id);
  const pctMaxPsy = (arr) => (arr.length ? Math.max(...arr.map((a) => Math.round((a.score / a.nbQuestions) * 100))) : null);
  const psy = {
    tests: attemptsPsy.length,
    categoriesTravaillees: new Set(attemptsPsy.map((a) => a.categorie)).size,
    meilleurConcours: pctMaxPsy(attemptsPsy.filter((a) => a.mode === 'examen')),
  };

  // ── Épreuve 2 : Statut général de la Fonction Publique ──
  const attemptsFp = attempts.filter((a) => a.categorie === fpMeta.DOMAINE.id);
  const [carte, gamif, aRevoir] = await Promise.all([
    fpProgression.carte(user.id),
    fpProgression.profilGamif(user.id),
    fpProgression.articlesARevoir(user.id, 20),
  ]);
  const pctMaxFp = (arr) => (arr.length ? Math.max(...arr.map((a) => Math.round((a.score / a.nbQuestions) * 100))) : null);
  const fp = {
    tests: attemptsFp.length,
    meilleureSimulation: pctMaxFp(attemptsFp.filter((a) => a.niveau === 'simulation')),
    maitrisePct: carte.pctGlobal,
    articlesVus: carte.vus,
    xp: gamif.xp,
    niveau: gamif.niveau,
    serie: gamif.serie,
    aRevoir: aRevoir.length,
  };

  res.render('candidat/dashboard', {
    title: 'Mon espace Candidat — EduWeb',
    bodyClass: 'page-candidat',
    enrollment,
    approuve,
    attempts: attempts.slice(0, 5),
    totalTentatives: attempts.length,
    psy,
    fp,
    meta,
    totalQuestions: bank.totalCount(),
    totalFp: fpBank.totalCount(),
  });
});

module.exports = router;
