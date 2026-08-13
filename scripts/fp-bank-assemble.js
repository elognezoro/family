// Assemble la banque « Fonction Publique » :
//   data/formation/fp/gen/s<no>.json → data/formation/fp/questions/s<no>.json
// - valide STRICTEMENT chaque exercice selon son type ;
// - attribue des identifiants stables fp-s<no>-### ;
// - contrôle la couverture d'articles et l'équilibre des clés ;
// - affiche les statistiques (types, difficultés, positions).
// Usage : node scripts/fp-bank-assemble.js
const fs = require('fs');
const path = require('path');

const GEN = path.join(__dirname, '..', 'data', 'formation', 'fp', 'gen');
const OUT = path.join(__dirname, '..', 'data', 'formation', 'fp', 'questions');
fs.mkdirSync(OUT, { recursive: true });

const TYPES = ['qcm', 'vrai_faux', 'trous', 'multi', 'association', 'classement', 'cas'];
let total = 0; let rejets = 0;
const parType = {}; const parDiff = {}; const posClef = [0, 0, 0, 0, 0];

function valide(q) {
  if (!q || typeof q.question !== 'string' || !q.question.trim()) return 'énoncé';
  if (!TYPES.includes(q.type)) return 'type';
  if (!(Number.isInteger(q.difficulte) && q.difficulte >= 1 && q.difficulte <= 5)) return 'difficulté';
  if (!(Number.isInteger(q.article) && q.article >= 1 && q.article <= 116)) return 'article';
  if (typeof q.explication !== 'string' || !q.explication.trim()) return 'explication';
  if (typeof q.reference !== 'string' || !/^Art\./.test(q.reference.trim())) return 'référence';
  const optsOk = (n) => Array.isArray(q.options) && q.options.length === n && q.options.every((o) => typeof o === 'string' && o.trim());
  switch (q.type) {
    case 'qcm': case 'trous': case 'cas':
      if (!optsOk(4)) return 'options(4)';
      if (!(Number.isInteger(q.bonneReponse) && q.bonneReponse >= 0 && q.bonneReponse <= 3)) return 'clé';
      break;
    case 'vrai_faux':
      if (!optsOk(2)) return 'options(2)';
      if (![0, 1].includes(q.bonneReponse)) return 'clé';
      break;
    case 'multi':
      if (!(Array.isArray(q.options) && q.options.length >= 4 && q.options.length <= 6)) return 'options(4-6)';
      if (!(Array.isArray(q.bonnesReponses) && q.bonnesReponses.length >= 2
        && q.bonnesReponses.every((b) => Number.isInteger(b) && b >= 0 && b < q.options.length)
        && new Set(q.bonnesReponses).size === q.bonnesReponses.length
        && q.bonnesReponses.length < q.options.length)) return 'clés multi';
      break;
    case 'association':
      if (!(Array.isArray(q.gauche) && q.gauche.length >= 3 && q.gauche.length <= 5)) return 'gauche';
      if (!(Array.isArray(q.droite) && q.droite.length === q.gauche.length)) return 'droite';
      if (!(Array.isArray(q.appariement) && q.appariement.length === q.gauche.length
        && q.appariement.every((a) => Number.isInteger(a) && a >= 0 && a < q.droite.length)
        && new Set(q.appariement).size === q.appariement.length)) return 'appariement';
      break;
    case 'classement':
      if (!(Array.isArray(q.items) && q.items.length >= 3 && q.items.length <= 6)) return 'items';
      if (!(Array.isArray(q.ordre) && q.ordre.length === q.items.length
        && q.ordre.every((o) => Number.isInteger(o) && o >= 0 && o < q.items.length)
        && new Set(q.ordre).size === q.items.length)) return 'ordre';
      break;
  }
  return null;
}

const articlesCouverts = new Set();
for (const f of fs.readdirSync(GEN).filter((x) => /^s\d+\.json$/.test(x)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))) {
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(GEN, f), 'utf8')); }
  catch (e) { console.error('!! JSON invalide :', f, e.message); continue; }
  const no = data.sequence;
  const propres = [];
  const vus = new Set();
  for (const q of data.questions || []) {
    const err = valide(q);
    if (err) { rejets++; console.warn(`  rejet (${err}) s${no} :`, String(q && q.question).slice(0, 70)); continue; }
    const clef = q.question.trim().toLowerCase() + '|' + JSON.stringify(q.options || q.gauche || q.items).toLowerCase();
    if (vus.has(clef)) { rejets++; console.warn(`  rejet (doublon) s${no} :`, q.question.slice(0, 70)); continue; }
    vus.add(clef);
    const item = {
      id: `fp-s${no}-${String(propres.length + 1).padStart(3, '0')}`,
      sequence: no,
      article: q.article,
      type: q.type,
      difficulte: q.difficulte,
      duree: Number.isInteger(q.duree) && q.duree >= 15 && q.duree <= 180 ? q.duree
        : { vrai_faux: 30, qcm: 40, trous: 40, multi: 60, association: 60, classement: 60, cas: 80 }[q.type],
      question: q.question.trim(),
      explication: q.explication.trim(),
      reference: q.reference.trim(),
      sousCategorie: q.type,
    };
    if (q.options) item.options = q.options.map((o) => o.trim());
    if (q.type === 'multi') item.bonnesReponses = [...q.bonnesReponses].sort((a, b) => a - b);
    else if (q.bonneReponse !== undefined) item.bonneReponse = q.bonneReponse;
    if (q.type === 'association') { item.gauche = q.gauche.map((x) => x.trim()); item.droite = q.droite.map((x) => x.trim()); item.appariement = q.appariement; }
    if (q.type === 'classement') { item.items = q.items.map((x) => x.trim()); item.ordre = q.ordre; }

    propres.push(item);
    total++;
    articlesCouverts.add(q.article);
    parType[q.type] = (parType[q.type] || 0) + 1;
    parDiff[q.difficulte] = (parDiff[q.difficulte] || 0) + 1;
    if (item.bonneReponse !== undefined) posClef[item.bonneReponse] = (posClef[item.bonneReponse] || 0) + 1;
  }
  fs.writeFileSync(path.join(OUT, `s${no}.json`), JSON.stringify({ sequence: no, questions: propres }, null, 1), 'utf8');
  console.log(`s${no}.json : ${propres.length} exercices`);
}

console.log(`\nTOTAL : ${total} exercices valides, ${rejets} rejetés.`);
console.log('Types :', JSON.stringify(parType));
console.log('Difficultés :', JSON.stringify(parDiff));
console.log('Positions des clés simples (A-D) :', posClef.join(' / '));
console.log('Articles couverts :', articlesCouverts.size, '/ 116');
if (total < 580) console.log(`⚠️ Objectif 580 : il manque ${580 - total} exercices.`);
else console.log('✅ Objectif ≥ 580 exercices atteint.');
