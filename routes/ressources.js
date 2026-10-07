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

  res.render('ressources', {
    title: 'Banque de ressources didactiques — EduWeb',
    bodyClass: 'page-ressources',
    niveaux,
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
