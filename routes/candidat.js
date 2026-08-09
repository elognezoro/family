// Espace du rôle « Candidat Tests Psychotechniques » : un tableau de bord
// entièrement tourné vers la préparation aux concours.
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { requireRole } = require('../middleware/auth');
const bank = require('../data/formation');
const meta = require('../data/formation/meta');

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

  // Progression par catégorie (examens et entraînements séparés)
  const progression = meta.CATEGORIES.map((c) => {
    const das = attempts.filter((a) => a.categorie === c.id);
    const pctMax = (arr) => (arr.length ? Math.max(...arr.map((a) => Math.round((a.score / a.nbQuestions) * 100))) : null);
    return {
      cat: c,
      tentatives: das.length,
      meilleurExamen: pctMax(das.filter((a) => a.mode === 'examen')),
      meilleurEntrainement: pctMax(das.filter((a) => a.mode !== 'examen')),
    };
  });

  res.render('candidat/dashboard', {
    title: 'Mon espace Candidat — EduWeb',
    bodyClass: 'page-candidat',
    enrollment,
    approuve,
    attempts: attempts.slice(0, 5),
    totalTentatives: attempts.length,
    progression,
    meta,
    totalQuestions: bank.totalCount(),
  });
});

module.exports = router;
