const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { countries } = require('../data/countries');
const disciplinesData = require('../data/disciplines');
const APP = require('../config/app');

// Mélange Fisher-Yates (sélection aléatoire des coachs en vedette)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
    // Coachs en vedette : 3 coachs validés ET certifiés, tirés au hasard à chaque visite.
    const certifies = await prisma.coachProfile.findMany({
      where: { statut: 'valide', certifie: true },
      include: { user: true, disciplines: { orderBy: { ordre: 'asc' } } },
    });
    featuredCoaches = shuffle(certifies).slice(0, 3);
    // Moins de 3 certifiés : on complète avec des coachs validés (aléatoires aussi).
    if (featuredCoaches.length < 3) {
      const autres = await prisma.coachProfile.findMany({
        where: { statut: 'valide', certifie: false },
        include: { user: true, disciplines: { orderBy: { ordre: 'asc' } } },
      });
      featuredCoaches = featuredCoaches.concat(shuffle(autres).slice(0, 3 - featuredCoaches.length));
    }
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
const { requireAuth, go } = require('../middleware/auth');
const referral = require('../services/referral');

// Données financières du moteur Formation (portefeuille, progression, QR…) —
// tolérant : la page fonctionne même si le moteur n'est pas encore migré.
async function donneesFinance(userId, link) {
  const fin = { actif: false };
  try {
    const retrocession = require('../services/finance/retrocession');
    const parrainageFin = require('../services/finance/parrainage');
    const politiqueFin = require('../services/finance/politique');
    fin.progression = await retrocession.progressionParrain(userId);
    fin.stats = await parrainageFin.statsParrain(userId);
    fin.slots = await parrainageFin.etatSlots(userId);
    fin.policy = await politiqueFin.active();
    fin.payouts = await prisma.payout.findMany({ where: { userId }, orderBy: { requestedAt: 'desc' }, take: 10 });
    try {
      const QRCode = require('qrcode');
      fin.qr = await QRCode.toDataURL(link, { width: 220, margin: 1, color: { dark: '#0E6B3A' } });
    } catch (e) { fin.qr = null; }
    fin.actif = true;
  } catch (e) { /* tables du moteur absentes : section masquée */ }
  return fin;
}

router.get('/parrainage', requireAuth, async (req, res) => {
  const baseUrl = APP.baseUrl(req);
  const data = await referral.buildData(req.session.user.id, baseUrl);
  const fin = await donneesFinance(req.session.user.id, data.link);
  res.render('referral', {
    title: 'Parrainage & gains — EduWeb',
    bodyClass: 'page-parrainage',
    isCommercial: false,
    data,
    fin,
    APP,
  });
});

// Demande de versement des rétrocessions (§15)
router.post('/parrainage/versement', requireAuth, async (req, res) => {
  try {
    const payoutSvc = require('../services/finance/payout');
    const antifraude = require('../services/finance/antifraude');
    await antifraude.controlerPayout(req.session.user.id, req.body.numero);
    const r = await payoutSvc.demander(req.session.user.id, {
      montant: req.body.montant,
      moyen: req.body.moyen,
      numero: req.body.numero,
    });
    if (r.erreur) return go(res, '/parrainage', 'error', r.erreur);
    return go(res, '/parrainage', 'success', `Demande de versement de ${APP.formatFCFA(r.payout.montant)} enregistrée : elle sera traitée par l’équipe EduWeb.`);
  } catch (e) {
    console.error('[payout] demande impossible :', e.message);
    return go(res, '/parrainage', 'error', 'Le service de versement est momentanément indisponible.');
  }
});

// ─── Changer la langue de lecture ───
const i18n = require('../config/i18n');
router.post('/lang', async (req, res) => {
  const code = (req.body.lang || '').trim();
  if (i18n.isValid(code)) {
    req.session.lang = code;
    if (req.session.user) {
      try { await prisma.user.update({ where: { id: req.session.user.id }, data: { lang: code } }); } catch (e) { /* non bloquant */ }
    }
  }
  const back = req.get('referer') || (req.session.user ? '/' + req.session.user.role : '/');
  res.redirect(back);
});

module.exports = router;
