// Banque de ressources didactiques — page publique structurée par niveau,
// alimentée par l'admin (/admin/ressources). Les visiteurs peuvent soutenir
// la banque par un don (/dons, mobile money déclaré vérifié par l'admin).
// Fréquentation : consultations de la banque (SiteStat.ressourcesVisites),
// consultations et téléchargements de chaque ressource (vues / telechargements).
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');
const chantsData = require('../data/chants');
const auteursData = require('../data/auteurs');
const competitions = require('../services/competitions');

// Cycles d'enseignement (barre latérale de la banque). Le niveau d'une
// ressource est un texte libre saisi par l'admin : son rang le range dans un
// cycle (dizaine du rang) et l'ordonne dans ce cycle.
const CYCLES = [
  { id: 'primaire', nom: 'Cycle primaire', sous: 'CP1 → CM2', icone: '🧒', min: 0, max: 9 },
  { id: 'secondaire1', nom: '1er cycle secondaire', sous: '6e → 3e', icone: '📗', min: 10, max: 19 },
  { id: 'secondaire2', nom: '2nd cycle secondaire', sous: '2nde → Terminale', icone: '📘', min: 20, max: 29 },
  { id: 'superieur', nom: 'Cycle supérieur', sous: 'BTS, licence, master…', icone: '🎓', min: 30, max: 39 },
];

// Rang canonique des niveaux, du préscolaire au supérieur (testés dans l'ordre).
const RANGS_NIVEAUX = [
  [/pr[ée]scolaire|maternelle/i, 0],
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
  [/(^|[^a-z])bts(\W|$)|(^|[^a-z])dut(\W|$)/i, 31],
  [/licence\s*1|(^|[^a-z])l\s*1(\D|$)/i, 32],
  [/licence\s*2|(^|[^a-z])l\s*2(\D|$)/i, 33],
  [/licence\s*3|(^|[^a-z])l\s*3(\D|$)/i, 34],
  [/master\s*1|(^|[^a-z])m\s*1(\D|$)/i, 35],
  [/master\s*2|(^|[^a-z])m\s*2(\D|$)/i, 36],
  [/doctorat/i, 37],
  [/licence|master|sup[ée]rieur|universit/i, 39],
  [/seconde|(^|\D)2\s*(nde?|de)/i, 21],
  [/premi|(^|\D)1\s*(re|ère|ere)/i, 22],
  [/terminale|(^|\W)tle/i, 23],
  [/lyc[ée]e/i, 29],
];
function rangNiveau(niveau) {
  for (const [re, rang] of RANGS_NIVEAUX) if (re.test(niveau)) return rang;
  return /tous/i.test(niveau) ? 99 : 90; // inconnus après le supérieur, « Tous niveaux » en dernier
}
function cycleDuRang(rang) {
  return CYCLES.find((c) => rang >= c.min && rang <= c.max) || null;
}

const nombreFr = (n) => Number(n || 0).toLocaleString('fr-FR');

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

// ─── La banque : accordéons par niveau (6e → Tle) → tuiles par discipline ───
router.get('/', async (req, res) => {
  const compter = nouvelleConsultation(req);
  const [ressources, statSite] = await Promise.all([
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
    auteursDe: auteursData.pour, // tuile → accordéon « Auteurs » (discipline, niveau)
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
    ressources = await prisma.ressourceDidactique.findMany({ where: { actif: true } });
  } catch (e) { /* la page reste utilisable sans média de la banque */ }
  const media = chantsData.mediaDe(chant, ressources);
  // Pendant une compétition qui utilise ce chant, le quiz d'entraînement (et
  // son corrigé) est mis en pause : il ne doit pas servir d'antisèche.
  const verrou = (await competitions.chantsVerrouilles()).get(chant.slug) || null;
  res.render('ressource-chant', {
    title: `${chant.titre} — chanson & évaluation ${chant.discipline} ${chant.niveau} — EduWeb`,
    bodyClass: 'page-ressources',
    chant,
    mediaType: media.type,
    mediaUrl: media.url,
    ressourceId: media.ressourceId,
    verrou,
    formatDate: competitions.formatDate,
  });
});

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

module.exports = router;
