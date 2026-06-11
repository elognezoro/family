const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { countries } = require('../data/countries');
const disciplinesData = require('../data/disciplines');
const APP = require('../config/app');

router.get('/', async (req, res) => {
  // Bandes défilantes : drapeaux + disciplines
  const flagCodes = countries.map((c) => c.code);
  const disciplineNames = [...new Set(disciplinesData.disciplines.map((d) => d.matiere))];

  // Statistiques + coachs en vedette (avec repli si la base est indisponible)
  let coachsVerifies = 0;
  let featuredCoaches = [];
  let visits = 0;
  let totalUsers = 0;
  let dbOk = true;
  try {
    coachsVerifies = await prisma.coachProfile.count({ where: { statut: 'valide' } });
    featuredCoaches = await prisma.coachProfile.findMany({
      where: { statut: 'valide' },
      include: { user: true, disciplines: true },
      orderBy: { note: 'desc' },
      take: 3,
    });
    const siteStat = await prisma.siteStat.findUnique({ where: { id: 'site' } });
    visits = siteStat ? siteStat.visits : 0;
    totalUsers = await prisma.user.count();
  } catch (e) {
    // Base indisponible (ex. Neon en veille) : on n'affiche pas un « 0 » trompeur.
    dbOk = false;
    console.warn('[home] base indisponible :', e.message);
  }

  const stats = {
    coachs: coachsVerifies,
    disciplines: disciplinesData.disciplines.length,
    pays: countries.length,
    operateurs: APP.operateurs.length,
  };

  res.render('index', {
    title: 'EduWeb — Apprendre • Progresser • Réussir ensemble',
    bodyClass: 'page-home',
    flagCodes,
    disciplineNames,
    stats,
    visits,
    totalUsers,
    dbOk,
    featuredCoaches,
    disciplinesData,
  });
});

// ─── Nos tarifs (officiels, publics) ───
router.get('/tarifs', (req, res) => {
  res.render('tarifs', {
    title: 'Nos tarifs — EduWeb',
    bodyClass: 'page-tarifs',
  });
});

// ─── À propos ───
router.get('/a-propos', (req, res) => {
  res.render('about', {
    title: 'À propos — EduWeb',
    bodyClass: 'page-about',
  });
});

// ─── Parrainage (tout utilisateur connecté) ───
const { requireAuth } = require('../middleware/auth');
const referral = require('../services/referral');
router.get('/parrainage', requireAuth, async (req, res) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const data = await referral.buildData(req.session.user.id, baseUrl);
  res.render('referral', {
    title: 'Parrainage & gains — EduWeb',
    bodyClass: 'page-parrainage',
    isCommercial: false,
    data,
    APP,
  });
});

module.exports = router;
