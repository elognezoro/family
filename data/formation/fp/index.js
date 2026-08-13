// Banque « Statut général de la Fonction Publique » — chargement, tirage et
// mélange. Les questions vivent dans data/formation/fp/questions/s<no>.json
// (générées puis contre-vérifiées, assemblées par scripts/fp-bank-assemble.js).
const fs = require('fs');
const path = require('path');
const meta = require('./meta');

const DIR = path.join(__dirname, 'questions');
let CACHE = null;

function charger() {
  if (CACHE) return CACHE;
  const parSequence = new Map();
  let total = 0;
  if (fs.existsSync(DIR)) {
    for (const f of fs.readdirSync(DIR).filter((x) => /^s\d+\.json$/.test(x))) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
        parSequence.set(data.sequence, data.questions);
        total += data.questions.length;
      } catch (e) { console.error('[fp] banque illisible :', f, e.message); }
    }
  }
  CACHE = { parSequence, total };
  return CACHE;
}

function totalCount() { return charger().total; }
function sequencesDisponibles() { return [...charger().parSequence.keys()].sort((a, b) => a - b); }
function countFor(sequences, niveauId) {
  const niveau = meta.niveauFP(niveauId);
  return pool(sequences, niveau).length;
}

function pool(sequences, niveau) {
  const { parSequence } = charger();
  const nums = sequences && sequences.length ? sequences : [...parSequence.keys()];
  let out = [];
  for (const n of nums) out = out.concat(parSequence.get(Number(n)) || []);
  if (!niveau) return out;
  const strict = out.filter((q) => niveau.difficultes.includes(q.difficulte) && niveau.types.includes(q.type));
  return strict;
}

function melanger(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mélange interne d'une question avec REMAPPAGE de la clé selon le type.
function fixerQuestion(q) {
  const c = JSON.parse(JSON.stringify(q));
  if (c.type === 'vrai_faux') return c; // Vrai/Faux : ordre naturel conservé

  if (c.type === 'multi' || c.type === 'qcm' || c.type === 'trous' || c.type === 'cas' || !c.type) {
    const idx = melanger(c.options.map((_, i) => i));
    c.options = idx.map((i) => q.options[i]);
    if (c.type === 'multi') c.bonnesReponses = q.bonnesReponses.map((b) => idx.indexOf(b)).sort((a, b) => a - b);
    else c.bonneReponse = idx.indexOf(q.bonneReponse);
    return c;
  }
  if (c.type === 'association') {
    // Mélanger la colonne de droite et remapper l'appariement
    const idx = melanger(c.droite.map((_, i) => i)); // idx[posNouvelle] = posAncienne
    c.droite = idx.map((i) => q.droite[i]);
    c.appariement = q.appariement.map((anc) => idx.indexOf(anc));
    return c;
  }
  if (c.type === 'classement') {
    // Mélanger l'ordre de PRÉSENTATION des éléments et remapper l'ordre correct
    const idx = melanger(c.items.map((_, i) => i));
    c.items = idx.map((i) => q.items[i]);
    c.ordre = q.ordre.map((anc) => idx.indexOf(anc));
    return c;
  }
  return c;
}

// Tirage d'un test : filtre par séquences + palier, élargit si besoin,
// mélange par tentative, difficulté croissante, clés remappées.
function buildTest(sequences, niveauId, nb) {
  const niveau = meta.niveauFP(niveauId);
  if (!niveau) return null;
  let candidats = pool(sequences, niveau);
  // Élargissements successifs si la banque filtrée est trop petite
  if (candidats.length < nb) {
    const large = { ...niveau, difficultes: [1, 2, 3, 4, 5] };
    candidats = pool(sequences, large);
  }
  if (candidats.length < nb) candidats = pool(sequences, null);
  if (!candidats.length) return null;

  // Tirage stratifié par difficulté pour une montée progressive
  const parDiff = new Map();
  for (const q of melanger(candidats)) {
    if (!parDiff.has(q.difficulte)) parDiff.set(q.difficulte, []);
    parDiff.get(q.difficulte).push(q);
  }
  const diffs = [...parDiff.keys()].sort((a, b) => a - b);
  const cible = Math.min(nb, candidats.length);
  const parPalier = Math.ceil(cible / diffs.length);
  let tirage = [];
  for (const d of diffs) tirage = tirage.concat(parDiff.get(d).slice(0, parPalier));
  // Compléter si certains paliers manquaient de questions
  if (tirage.length < cible) {
    const dejaPris = new Set(tirage.map((q) => q.id));
    for (const q of melanger(candidats)) {
      if (tirage.length >= cible) break;
      if (!dejaPris.has(q.id)) { tirage.push(q); dejaPris.add(q.id); }
    }
  }
  tirage = tirage.slice(0, cible).sort((a, b) => a.difficulte - b.difficulte);
  return tirage.map(fixerQuestion);
}

// Version SANS les clés de correction, envoyée au navigateur
function pourClient(fixed) {
  return fixed.map((q, i) => {
    const c = {
      i, id: q.id, type: q.type, sequence: q.sequence, difficulte: q.difficulte,
      duree: q.duree, question: q.question,
    };
    if (q.options) c.options = q.options;
    if (q.gauche) { c.gauche = q.gauche; c.droite = q.droite; }
    if (q.items) c.items = q.items;
    return c;
  });
}

function byId(id) {
  const { parSequence } = charger();
  for (const qs of parSequence.values()) {
    const q = qs.find((x) => x.id === id);
    if (q) return q;
  }
  return null;
}

module.exports = { charger, totalCount, sequencesDisponibles, countFor, buildTest, pourClient, byId, fixerQuestion };
