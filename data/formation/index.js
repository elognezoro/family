// EduWeb Formation — banque de questions psychotechniques
//
// Charge la banque (data/formation/questions/*.json), la valide, et fournit
// la sélection d'un test : questions MÉLANGÉES différemment à chaque tentative
// et d'un utilisateur à l'autre, en DIFFICULTÉ CROISSANTE (1 → 5), avec
// l'ordre des options lui aussi mélangé.

const fs = require('fs');
const path = require('path');
const meta = require('./meta');

const QUESTIONS_DIR = path.join(__dirname, 'questions');
const THEORIE_DIR = path.join(__dirname, 'theorie');

// ─── Chargement (une fois, au démarrage) ───
let BANK = []; // toutes les questions, avec id stable
let BY_KEY = new Map(); // "categorie|niveau" -> questions
let THEORIE = new Map(); // categorie -> fiche théorie (+ 'general')

function load() {
  BANK = [];
  BY_KEY = new Map();
  if (fs.existsSync(QUESTIONS_DIR)) {
    for (const file of fs.readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith('.json'))) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
        for (const q of data.questions || []) {
          if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length !== 4) continue;
          BANK.push(q);
          const key = q.categorie + '|' + q.niveau;
          if (!BY_KEY.has(key)) BY_KEY.set(key, []);
          BY_KEY.get(key).push(q);
        }
      } catch (e) {
        console.error('[formation] fichier invalide :', file, e.message);
      }
    }
  }
  THEORIE = new Map();
  if (fs.existsSync(THEORIE_DIR)) {
    for (const file of fs.readdirSync(THEORIE_DIR).filter((f) => f.endsWith('.json'))) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(THEORIE_DIR, file), 'utf8'));
        if (data.categorie) THEORIE.set(data.categorie, data);
      } catch (e) {
        console.error('[formation] théorie invalide :', file, e.message);
      }
    }
  }
}
load();

// ─── Accès ───
function byId(id) { return BANK.find((q) => q.id === id) || null; }
function pool(categorie, niveau) { return BY_KEY.get(categorie + '|' + niveau) || []; }
function countFor(categorie, niveau) { return pool(categorie, niveau).length; }
function totalCount() { return BANK.length; }
function theorie(categorie) { return THEORIE.get(categorie) || null; }

// Mélange Fisher-Yates (nouvelle copie)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Sélection d'un test ───
// Tirage aléatoire équilibré par difficulté, puis ordre CROISSANT (1 → 5)
// avec mélange à l'intérieur de chaque palier — donc chaque tentative (et
// chaque utilisateur) reçoit des questions et un ordre différents.
// Retourne des questions « figées » : options mélangées + index de la bonne
// réponse recalculé (à stocker côté serveur, jamais envoyé au client).
function buildTest(categorie, niveau, nbQuestions) {
  const all = pool(categorie, niveau);
  if (!all.length) return null;
  const n = Math.min(nbQuestions, all.length);

  // Répartition par difficulté : n/5 par palier, complétée si un palier manque
  const parDiff = new Map();
  for (let d = 1; d <= 5; d++) parDiff.set(d, shuffle(all.filter((q) => q.difficulte === d)));
  const cible = Math.floor(n / 5);
  let reste = n - cible * 5;
  const retenues = [];
  for (let d = 1; d <= 5; d++) {
    let take = cible + (reste > 0 ? 1 : 0);
    if (reste > 0) reste--;
    retenues.push(...parDiff.get(d).splice(0, take));
  }
  // Paliers incomplets : compléter avec le reste de la banque (au hasard)
  if (retenues.length < n) {
    const dejaPris = new Set(retenues.map((q) => q.id));
    const restants = shuffle(all.filter((q) => !dejaPris.has(q.id)));
    retenues.push(...restants.slice(0, n - retenues.length));
  }

  // Difficulté croissante, mélange intra-palier
  retenues.sort((a, b) => (a.difficulte - b.difficulte) || (Math.random() - 0.5));

  // Figer chaque question : options mélangées, bonne réponse suivie
  return retenues.map((q) => {
    const ordre = shuffle([0, 1, 2, 3]);
    return {
      id: q.id,
      sousCategorie: q.sousCategorie,
      difficulte: q.difficulte,
      question: q.question,
      options: ordre.map((i) => q.options[i]),
      bonneReponse: ordre.indexOf(q.bonneReponse),
      explication: q.explication,
      duree: q.duree || 60,
      mono: q.mono || false,
      memo: q.memo || null,
      memoSec: q.memoSec || null,
    };
  });
}

// Version « client » d'une question figée : sans la réponse ni l'explication
function pourClient(fixed) {
  return fixed.map((q, i) => ({
    i,
    sousCategorie: q.sousCategorie,
    difficulte: q.difficulte,
    question: q.question,
    options: q.options,
    duree: q.duree,
    mono: q.mono,
    memo: q.memo,
    memoSec: q.memoSec,
  }));
}

module.exports = {
  reload: load,
  byId,
  pool,
  countFor,
  totalCount,
  theorie,
  buildTest,
  pourClient,
  meta,
};
