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
  try {
    coachsVerifies = await prisma.coachProfile.count({ where: { statut: 'valide' } });
    featuredCoaches = await prisma.coachProfile.findMany({
      where: { statut: 'valide' },
      include: { user: true, disciplines: true },
      orderBy: { note: 'desc' },
      take: 3,
    });
  } catch (e) {
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

module.exports = router;
