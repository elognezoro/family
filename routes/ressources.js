// Banque de ressources didactiques — page publique structurée par niveau,
// alimentée par l'admin (/admin/ressources). Les visiteurs peuvent soutenir
// la banque par un don (/dons, mobile money déclaré vérifié par l'admin).
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');

// ─── La banque, groupée par niveau (ordre d'affichage géré par l'admin) ───
router.get('/', async (req, res) => {
  let ressources = [];
  try {
    ressources = await prisma.ressourceDidactique.findMany({
      where: { actif: true },
      orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (e) { console.warn('[ressources] table indisponible :', e.message); }

  // Groupes par niveau, dans l'ordre d'apparition (donc piloté par « ordre »)
  const groupes = [];
  for (const r of ressources) {
    let g = groupes.find((x) => x.niveau === r.niveau);
    if (!g) { g = { niveau: r.niveau, ressources: [] }; groupes.push(g); }
    g.ressources.push(r);
  }

  res.render('ressources', {
    title: 'Banque de ressources didactiques — EduWeb',
    bodyClass: 'page-ressources',
    groupes,
  });
});

module.exports = router;
