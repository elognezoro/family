// Banque de ressources didactiques — page publique structurée par niveau,
// alimentée par l'admin (/admin/ressources). Les visiteurs peuvent soutenir
// la banque par un don (/dons, mobile money déclaré vérifié par l'admin).
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');
const chantsData = require('../data/chants');

// Rang canonique des niveaux : de la 6e à la Terminale, puis le reste.
const RANGS_NIVEAUX = [
  [/sixi|(^|\D)6\s*(e|è|eme|ème)/i, 1],
  [/cinqu|(^|\D)5\s*(e|è|eme|ème)/i, 2],
  [/quatri|(^|\D)4\s*(e|è|eme|ème)/i, 3],
  [/troisi|(^|\D)3\s*(e|è|eme|ème)/i, 4],
  [/seconde|(^|\D)2\s*(nde?|de)/i, 5],
  [/premi|(^|\D)1\s*(re|ère|ere)/i, 6],
  [/terminale|(^|\W)tle/i, 7],
];
function rangNiveau(niveau) {
  for (const [re, rang] of RANGS_NIVEAUX) if (re.test(niveau)) return rang;
  return /tous/i.test(niveau) ? 99 : 90; // inconnus après la Terminale, « Tous niveaux » en dernier
}

// ─── La banque : accordéons par niveau (6e → Tle) → tuiles par discipline ───
router.get('/', async (req, res) => {
  let ressources = [];
  try {
    ressources = await prisma.ressourceDidactique.findMany({
      where: { actif: true },
      orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (e) { console.warn('[ressources] table indisponible :', e.message); }

  const niveaux = [];
  for (const r of ressources) {
    let n = niveaux.find((x) => x.niveau === r.niveau);
    if (!n) { n = { niveau: r.niveau, rang: rangNiveau(r.niveau), disciplines: [], total: 0 }; niveaux.push(n); }
    const nomDisc = (r.discipline || '').trim() || 'Autres ressources';
    let d = n.disciplines.find((x) => x.nom === nomDisc);
    if (!d) { d = { nom: nomDisc, ressources: [] }; n.disciplines.push(d); }
    d.ressources.push(r); // déjà triées par (ordre, créée le)
    n.total += 1;
  }
  niveaux.sort((a, b) => a.rang - b.rang || a.niveau.localeCompare(b.niveau, 'fr'));
  for (const n of niveaux) {
    n.disciplines.sort((a, b) =>
      (a.nom === 'Autres ressources') - (b.nom === 'Autres ressources') || a.nom.localeCompare(b.nom, 'fr'));
  }

  res.render('ressources', {
    title: 'Banque de ressources didactiques — EduWeb',
    bodyClass: 'page-ressources',
    niveaux,
    chantDe: chantsData.pourRessource, // carte → bouton « Chanson & quiz » si un chant correspond
  });
});

// ─── Chanson + quiz d'une leçon (ex. /ressources/chants/svt6-chant-1) ───
router.get('/chants/:slug', (req, res) => {
  const chant = chantsData.parSlug(req.params.slug);
  if (!chant) return go(res, '/ressources', 'error', 'Ce chant est introuvable.');
  res.render('ressource-chant', {
    title: `${chant.titre} — chanson & quiz ${chant.discipline} ${chant.niveau} — EduWeb`,
    bodyClass: 'page-ressources',
    chant,
  });
});

module.exports = router;
