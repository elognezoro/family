// Mode compétition — règles communes (état, épreuves, classement, formats).
const crypto = require('crypto');
const chantsData = require('../data/chants');
const prisma = require('../data/prisma-store');

const DUREE_MIN_SEC = 60;
const DUREE_MAX_SEC = 3 * 60 * 60;

// État effectif : le calendrier l'emporte sur le statut saisi par l'admin
// (une compétition « ouverte » dont la date de fin est passée est terminée,
// et son classement devient public automatiquement).
function etat(c, maintenant = new Date()) {
  if (!c || c.statut === 'brouillon') return 'brouillon';
  if (c.statut === 'terminee') return 'terminee';
  if (c.finAt && maintenant >= new Date(c.finAt)) return 'terminee';
  if (c.debutAt && maintenant < new Date(c.debutAt)) return 'avant';
  return 'en_cours';
}

const LIBELLES_ETAT = {
  brouillon: 'Brouillon', avant: 'Inscriptions ouvertes', en_cours: 'En cours', terminee: 'Terminée',
};

// Épreuves d'une compétition avec leur chant (les slugs inconnus sont ignorés)
function epreuvesDe(c) {
  const liste = Array.isArray(c && c.epreuves) ? c.epreuves : [];
  return liste.map((e) => {
    const chant = chantsData.parSlug(e && e.slug);
    if (!chant) return null;
    const dureeSec = Math.min(DUREE_MAX_SEC, Math.max(DUREE_MIN_SEC, parseInt(e.dureeSec, 10) || 600));
    return { slug: chant.slug, dureeSec, chant, total: chant.quiz.length };
  }).filter(Boolean);
}

function totalPossible(c) {
  return epreuvesDe(c).reduce((s, e) => s + e.total, 0);
}

// Classement : score total décroissant, puis nombre d'épreuves terminées,
// puis temps total croissant, puis ordre d'arrivée. Les ex æquo partagent le rang.
function classer(competiteurs) {
  const lignes = competiteurs
    .filter((k) => k.emailVerifie)
    .slice()
    .sort((a, b) =>
      b.scoreTotal - a.scoreTotal ||
      b.nbEpreuves - a.nbEpreuves ||
      a.tempsTotalMs - b.tempsTotalMs ||
      (a.termineAt ? new Date(a.termineAt).getTime() : Infinity) - (b.termineAt ? new Date(b.termineAt).getTime() : Infinity) ||
      new Date(a.createdAt) - new Date(b.createdAt));
  let rang = 0;
  lignes.forEach((k, i) => {
    const prec = lignes[i - 1];
    const exAequo = prec && prec.scoreTotal === k.scoreTotal && prec.nbEpreuves === k.nbEpreuves && prec.tempsTotalMs === k.tempsTotalMs;
    if (!exAequo) rang = i + 1;
    k.rang = rang;
  });
  return lignes;
}

function formatDuree(ms) {
  const s = Math.max(0, Math.round((ms || 0) / 1000));
  const m = Math.floor(s / 60);
  return m ? `${m} min ${String(s % 60).padStart(2, '0')} s` : `${s} s`;
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan', dateStyle: 'medium', timeStyle: 'short' });
}

// Valeur d'un <input type="datetime-local"> : les dates sont saisies et affichées
// à l'heure d'Abidjan (= UTC), quel que soit le fuseau du serveur.
function versInputDate(d) {
  return d ? new Date(d).toISOString().slice(0, 16) : '';
}
function depuisInputDate(v) {
  const s = String(v || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return null;
  const d = new Date(s.slice(0, 16) + ':00Z');
  return isNaN(d.getTime()) ? null : d;
}

function slugifier(titre) {
  return String(titre || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'competition';
}

const REGLEMENT_DEFAUT = `Je participe à cette compétition de mon plein gré. Je certifie que l'identité renseignée est exacte, je réponds seul(e) et sans aide extérieure, je ne participe qu'une seule fois, et j'accepte que mon nom, mon établissement et mon résultat figurent au classement publié en fin de compétition.`;

// Date limite de remise d'une épreuve ouverte : la fin de son chrono, mais
// jamais après la fin programmée de la compétition (le classement est publié
// à cet instant ; rien ne peut arriver après).
function limiteRemise(competition, epreuve, resultat) {
  const finChrono = new Date(resultat.debutAt).getTime() + epreuve.dureeSec * 1000;
  const finComp = competition.finAt ? new Date(competition.finAt).getTime() : Infinity;
  return Math.min(finChrono, finComp);
}

// Permutation déterministe de 0..n-1 à partir d'une graine : chaque compétiteur
// voit les questions et les propositions dans un ordre qui lui est propre,
// stable d'un rechargement à l'autre (les indices d'origine sont conservés
// dans les valeurs des champs, la correction n'en dépend pas).
function melangeSeme(n, graine) {
  const idx = Array.from({ length: n }, (_, k) => k);
  let h = crypto.createHash('sha256').update(String(graine)).digest();
  let p = 0;
  for (let a = n - 1; a > 0; a--) {
    if (p + 4 > h.length) { h = crypto.createHash('sha256').update(h).digest(); p = 0; }
    const b = h.readUInt32BE(p) % (a + 1);
    p += 4;
    [idx[a], idx[b]] = [idx[b], idx[a]];
  }
  return idx;
}

const masquerEmail = (e) => String(e || '').replace(/^(.{1,2})[^@]*@/, '$1***@');

// Chants dont le quiz d'entraînement (et son corrigé) est VERROUILLÉ parce qu'une
// compétition en cours l'utilise : slug → { titre, slug de la compétition, finAt }.
// Mémorisé 60 s par instance.
let _verrou = { at: 0, map: new Map() };
async function chantsVerrouilles() {
  if (Date.now() - _verrou.at < 60 * 1000) return _verrou.map;
  const map = new Map();
  try {
    const liste = await prisma.competition.findMany({ where: { statut: 'ouverte' } });
    const maintenant = new Date();
    for (const c of liste) {
      if (etat(c, maintenant) !== 'en_cours') continue;
      for (const e of epreuvesDe(c)) if (!map.has(e.slug)) map.set(e.slug, { titre: c.titre, slug: c.slug, finAt: c.finAt });
    }
  } catch (e) { /* table indisponible : rien n'est verrouillé */ }
  _verrou = { at: Date.now(), map };
  return map;
}
function oublierVerrous() { _verrou = { at: 0, map: new Map() }; }

module.exports = {
  etat, LIBELLES_ETAT, epreuvesDe, totalPossible, classer, formatDuree, formatDate,
  versInputDate, depuisInputDate, slugifier, REGLEMENT_DEFAUT, DUREE_MIN_SEC, DUREE_MAX_SEC,
  limiteRemise, melangeSeme, masquerEmail, chantsVerrouilles, oublierVerrous,
};
