// Assemble la banque de questions de la Formation :
//   data/formation/gen/{categorie}-{niveau}.json  →  data/formation/questions/{categorie}.json
// - attribue des identifiants stables ({cat}-{niveau}-{numéro}) ;
// - valide chaque question (4 options, clé 0-3, explication, difficulté 1-5) ;
// - élimine les doublons d'énoncé (par catégorie+niveau) ;
// - affiche la répartition par difficulté et la position des bonnes réponses.
// Usage : node scripts/formation-bank-assemble.js

const fs = require('fs');
const path = require('path');

const GEN = path.join(__dirname, '..', 'data', 'formation', 'gen');
const OUT = path.join(__dirname, '..', 'data', 'formation', 'questions');
fs.mkdirSync(OUT, { recursive: true });

const parCategorie = new Map();
let total = 0;
let rejets = 0;
const posClef = [0, 0, 0, 0];

function normalise(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

for (const file of fs.readdirSync(GEN).filter((f) => f.endsWith('.json')).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(GEN, file), 'utf8'));
  const { categorie, niveau } = data;
  if (!categorie || !niveau) { console.error('!! fichier sans catégorie/niveau :', file); continue; }
  const vus = new Set();
  let n = 0;
  for (const q of data.questions || []) {
    // Validation stricte
    const ok = q && typeof q.question === 'string' && q.question.trim()
      && Array.isArray(q.options) && q.options.length === 4
      && q.options.every((o) => typeof o === 'string' && o.trim() !== '')
      && Number.isInteger(q.bonneReponse) && q.bonneReponse >= 0 && q.bonneReponse <= 3
      && typeof q.explication === 'string' && q.explication.trim()
      && Number.isInteger(q.difficulte) && q.difficulte >= 1 && q.difficulte <= 5
      && (categorie !== 'memoire' || (q.memo && q.memoSec));
    if (!ok) { rejets++; console.warn('  rejet (schéma) dans', file, ':', normalise(q && q.question).slice(0, 60)); continue; }
    // Doublons : même énoncé ET mêmes options (des intrus partagent l'énoncé
    // « Quel est l'intrus ? » avec des options différentes — pas des doublons)
    const clef = normalise(q.question) + '|' + q.options.map(normalise).sort().join('|') + '|' + normalise(q.memo);
    if (vus.has(clef)) { rejets++; console.warn('  rejet (doublon) dans', file, ':', normalise(q.question).slice(0, 60)); continue; }
    vus.add(clef);

    n++;
    posClef[q.bonneReponse]++;
    const item = {
      id: `${categorie}-${niveau}-${String(n).padStart(3, '0')}`,
      categorie,
      niveau,
      sousCategorie: q.sousCategorie || 'autre',
      difficulte: q.difficulte,
      question: q.question.trim(),
      options: q.options.map((o) => o.trim()),
      bonneReponse: q.bonneReponse,
      explication: q.explication.trim(),
      duree: Number.isInteger(q.duree) && q.duree > 0 ? q.duree : [0, 30, 40, 60, 75, 90][q.difficulte],
    };
    if (q.mono) item.mono = true;
    if (categorie === 'memoire') { item.memo = String(q.memo).trim(); item.memoSec = Math.min(60, Math.max(15, q.memoSec)); }

    if (!parCategorie.has(categorie)) parCategorie.set(categorie, []);
    parCategorie.get(categorie).push(item);
    total++;
  }
}

// Écriture par catégorie
for (const [categorie, questions] of parCategorie) {
  const out = path.join(OUT, categorie + '.json');
  fs.writeFileSync(out, JSON.stringify({ categorie, questions }, null, 1), 'utf8');
  const parNiveau = {};
  const parDiff = {};
  for (const q of questions) {
    parNiveau[q.niveau] = (parNiveau[q.niveau] || 0) + 1;
    parDiff[q.difficulte] = (parDiff[q.difficulte] || 0) + 1;
  }
  console.log(`${categorie}.json : ${questions.length} questions`, parNiveau, 'difficultés', parDiff);
}

console.log(`\nTOTAL : ${total} questions valides, ${rejets} rejetées.`);
console.log('Position des bonnes réponses (A/B/C/D) :', posClef.join(' / '));
if (total < 500) console.log(`⚠️ Objectif ≥ 500 : encore ${500 - total} questions à générer.`);
else console.log('✅ Objectif ≥ 500 questions atteint.');
