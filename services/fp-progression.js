// Progression « Fonction Publique » : répétition espacée par article (§10),
// gamification XP/badges/série (§9), carte de maîtrise (§13).
// TOLÉRANT : tant que la migration n'est pas appliquée, chaque fonction
// échoue en silence (les pages restent utilisables sans persistance).
const prisma = require('../data/prisma-store');

// Échelle de réactivation après le palier atteint : J0, J1, J3, J7, J14, J30
const ECHELLE_JOURS = [0, 1, 3, 7, 14, 30];
const XP_JOUR_MAX = 300; // plafond quotidien (anti-abus)
const NIVEAUX = [
  { id: 'bronze', label: 'Bronze', min: 0 },
  { id: 'argent', label: 'Argent', min: 500 },
  { id: 'or', label: 'Or', min: 1500 },
  { id: 'expert', label: 'Expert', min: 4000 },
];
const BADGES = [
  { id: 'premiere-partie', label: 'Première partie', emoji: '🎮', test: (g) => g.partiesJouees >= 1 },
  { id: 'dix-parties', label: '10 parties', emoji: '🕹️', test: (g) => g.partiesJouees >= 10 },
  { id: 'serie-3', label: 'Série de 3 jours', emoji: '🔥', test: (g) => g.serieJours >= 3 },
  { id: 'serie-7', label: 'Série de 7 jours', emoji: '⚡', test: (g) => g.serieJours >= 7 },
  { id: 'xp-500', label: '500 XP (Argent)', emoji: '🥈', test: (g) => g.xp >= 500 },
  { id: 'xp-1500', label: '1 500 XP (Or)', emoji: '🥇', test: (g) => g.xp >= 1500 },
  { id: 'xp-4000', label: '4 000 XP (Expert)', emoji: '🏆', test: (g) => g.xp >= 4000 },
  { id: 'millionnaire', label: 'Millionnaire (15/15)', emoji: '💎', test: (g, drapeaux) => !!(drapeaux && drapeaux.millionnaire) },
  { id: 'boss', label: 'Boss vaincu', emoji: '🐉', test: (g, drapeaux) => !!(drapeaux && drapeaux.boss) },
];

function niveauPour(xp) {
  let n = NIVEAUX[0];
  for (const x of NIVEAUX) if (xp >= x.min) n = x;
  return n;
}

function memeJour(a, b) {
  return a && b && new Date(a).toISOString().slice(0, 10) === new Date(b).toISOString().slice(0, 10);
}
function hier(d) {
  const y = new Date(); y.setUTCDate(y.getUTCDate() - 1);
  return d && new Date(d).toISOString().slice(0, 10) === y.toISOString().slice(0, 10);
}

// ─── §10 Maîtrise par article ───
// resultats = [{ article, correct }] (une entrée par question répondue)
async function majMaitrise(userId, resultats) {
  try {
    // Agréger par article (une question ratée ET une réussie → l'erreur prime)
    const parArticle = new Map();
    for (const r of resultats) {
      if (!r || !Number.isInteger(r.article)) continue;
      const cur = parArticle.get(r.article) || { bonnes: 0, erreurs: 0 };
      if (r.correct) cur.bonnes++; else cur.erreurs++;
      parArticle.set(r.article, cur);
    }
    for (const [article, r] of parArticle) {
      const existant = await prisma.fpMastery.findUnique({ where: { userId_article: { userId, article } } });
      const rate = r.erreurs > 0;
      const score = Math.max(0, Math.min(100, (existant ? existant.score : 0) + (rate ? -20 : 15)));
      const intervalIdx = rate ? 0 : Math.min((existant ? existant.intervalIdx : 0) + 1, ECHELLE_JOURS.length - 1);
      const nextReview = new Date(Date.now() + ECHELLE_JOURS[intervalIdx] * 24 * 3600 * 1000);
      await prisma.fpMastery.upsert({
        where: { userId_article: { userId, article } },
        create: { userId, article, score, bonnes: r.bonnes, erreurs: r.erreurs, intervalIdx, nextReview },
        update: { score, bonnes: { increment: r.bonnes }, erreurs: { increment: r.erreurs }, intervalIdx, nextReview },
      });
    }
    return true;
  } catch (e) { return false; }
}

// Articles dus pour la révision du jour (score fragile ET échéance atteinte)
async function articlesARevoir(userId, limite) {
  try {
    const rows = await prisma.fpMastery.findMany({
      where: { userId, nextReview: { lte: new Date() }, score: { lt: 85 } },
      orderBy: { score: 'asc' },
      take: limite || 20,
    });
    return rows.map((r) => ({ article: r.article, score: r.score, erreurs: r.erreurs }));
  } catch (e) { return []; }
}

// Fiches « À retenir absolument » : 3 erreurs ou plus sur un article (§10)
async function fichesARetenir(userId) {
  try {
    const rows = await prisma.fpMastery.findMany({
      where: { userId, erreurs: { gte: 3 }, score: { lt: 85 } },
      orderBy: { erreurs: 'desc' },
      take: 10,
    });
    return rows.map((r) => ({ article: r.article, erreurs: r.erreurs, score: r.score }));
  } catch (e) { return []; }
}

// ─── §13 Carte de maîtrise + statistiques ───
async function carte(userId) {
  try {
    const rows = await prisma.fpMastery.findMany({ where: { userId } });
    const parArticle = {};
    for (const r of rows) parArticle[r.article] = { score: r.score, bonnes: r.bonnes, erreurs: r.erreurs, nextReview: r.nextReview };
    const vus = rows.length;
    const maitrises = rows.filter((r) => r.score >= 70).length;
    return { parArticle, vus, maitrises, pctGlobal: Math.round((maitrises / 116) * 100) };
  } catch (e) { return { parArticle: {}, vus: 0, maitrises: 0, pctGlobal: 0 }; }
}

// ─── §9 Gamification ───
// gagner(userId, { xp, drapeaux: {millionnaire, boss}, partie: true })
async function gagner(userId, { xp, drapeaux, partie }) {
  try {
    const now = new Date();
    let g = await prisma.fpGamif.findUnique({ where: { userId } });
    if (!g) g = await prisma.fpGamif.create({ data: { userId } });

    // Plafond quotidien
    const xpJour = memeJour(g.jourXp, now) ? g.xpJour : 0;
    const accorde = Math.max(0, Math.min(xp || 0, XP_JOUR_MAX - xpJour));

    // Série de jours actifs
    let serie = g.serieJours;
    if (!memeJour(g.dernierJourActif, now)) serie = hier(g.dernierJourActif) ? serie + 1 : 1;

    const apres = {
      xp: g.xp + accorde,
      serieJours: serie,
      dernierJourActif: now,
      xpJour: xpJour + accorde,
      jourXp: now,
      partiesJouees: g.partiesJouees + (partie ? 1 : 0),
    };
    // Badges (jamais retirés)
    const dejaGagnes = JSON.parse(g.badges || '[]');
    const nouveaux = [];
    for (const b of BADGES) {
      if (!dejaGagnes.includes(b.id) && b.test(apres, drapeaux)) { dejaGagnes.push(b.id); nouveaux.push(b); }
    }
    await prisma.fpGamif.update({
      where: { userId },
      data: { ...apres, badges: JSON.stringify(dejaGagnes) },
    });
    return {
      ok: true, xpGagne: accorde, xpTotal: apres.xp, serie,
      niveau: niveauPour(apres.xp), nouveauxBadges: nouveaux,
      plafondAtteint: accorde < (xp || 0),
    };
  } catch (e) { return { ok: false }; }
}

async function profilGamif(userId) {
  try {
    const g = await prisma.fpGamif.findUnique({ where: { userId } });
    if (!g) return { xp: 0, serie: 0, niveau: NIVEAUX[0], badges: [], parties: 0, actif: true };
    const ids = JSON.parse(g.badges || '[]');
    return {
      xp: g.xp, serie: g.serieJours, niveau: niveauPour(g.xp),
      badges: BADGES.filter((b) => ids.includes(b.id)), parties: g.partiesJouees, actif: true,
    };
  } catch (e) { return { xp: 0, serie: 0, niveau: NIVEAUX[0], badges: [], parties: 0, actif: false }; }
}

// Statistiques du tableau de bord (§13)
async function statsTableau(userId) {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, categorie: 'fonction-publique', statut: 'termine' },
      select: { score: true, nbQuestions: true, dureeSec: true, niveau: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    const totalQ = attempts.reduce((s, a) => s + a.nbQuestions, 0);
    const totalBonnes = attempts.reduce((s, a) => s + a.score, 0);
    const totalSec = attempts.reduce((s, a) => s + (a.dureeSec || 0), 0);
    return {
      tests: attempts.length,
      questions: totalQ,
      scoreMoyen: totalQ ? Math.round((totalBonnes / totalQ) * 100) : 0,
      tempsMoyenSec: totalQ ? Math.round(totalSec / totalQ) : 0,
      simulations: attempts.filter((a) => a.niveau === 'simulation').length,
      meilleureSimulation: Math.max(0, ...attempts.filter((a) => a.niveau === 'simulation').map((a) => Math.round((a.score / a.nbQuestions) * 100))),
    };
  } catch (e) { return { tests: 0, questions: 0, scoreMoyen: 0, tempsMoyenSec: 0, simulations: 0, meilleureSimulation: 0 }; }
}

module.exports = { majMaitrise, articlesARevoir, fichesARetenir, carte, gagner, profilGamif, statsTableau, ECHELLE_JOURS, NIVEAUX, BADGES };
