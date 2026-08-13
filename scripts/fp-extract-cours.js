// Extrait les 15 séquences de cours (articles essentiels) de la spécification
// « Statut général de la Fonction Publique » vers data/formation/fp/cours.json.
// Extraction DÉTERMINISTE : le contenu juridique n'est jamais reformulé (§15).
// Usage : node scripts/fp-extract-cours.js
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'docs', 'SPEC-FONCTION-PUBLIQUE.md');
const OUT_DIR = path.join(__dirname, '..', 'data', 'formation', 'fp');
fs.mkdirSync(OUT_DIR, { recursive: true });

const md = fs.readFileSync(SRC, 'utf8');

// ─── Séquences (§5) ───
const sequences = [];
const reSeq = /### Séquence (\d+) — ([^\n]+)\n\*\*Articles : ([^*]+)\*\*\s*\n\*\*Objectif :\*\* ([^\n]+)/g;
let m;
const positions = [];
while ((m = reSeq.exec(md)) !== null) {
  positions.push({ num: parseInt(m[1], 10), titre: m[2].trim(), articles: m[3].trim(), objectif: m[4].trim(), debut: m.index });
}
for (let i = 0; i < positions.length; i++) {
  const bloc = md.slice(positions[i].debut, i + 1 < positions.length ? positions[i + 1].debut : md.indexOf('## 6.'));
  const essentiels = [];
  const reArt = /- \*\*Art\. (\d+)(?:\s*(?:et|à)\s*(\d+))?\*\* — ([^\n]+)/g;
  let a;
  while ((a = reArt.exec(bloc)) !== null) {
    essentiels.push({ article: parseInt(a[1], 10), articleFin: a[2] ? parseInt(a[2], 10) : null, texte: a[3].trim() });
  }
  sequences.push({
    num: positions[i].num,
    titre: positions[i].titre,
    articles: positions[i].articles,
    objectif: positions[i].objectif,
    essentiels,
  });
}

// ─── Méthode C.L.A.I.R. + trucs transversaux (§4) ───
const secMethode = md.slice(md.indexOf('## 4. Méthode'), md.indexOf('## 5.'));
const methode = {
  clair: (secMethode.match(/\*\*C — [^\n]+/) || [''])[0].replace(/\*\*/g, ''),
  astuces: [...secMethode.matchAll(/^- (.+)$/gm)].map((x) => x[1].replace(/\*\*/g, '')),
};

const data = {
  base: 'Loi n° 2023-892 du 23 novembre 2023 portant Statut général de la Fonction Publique de Côte d’Ivoire',
  legalVersion: '2023-892',
  methode,
  sequences,
};
fs.writeFileSync(path.join(OUT_DIR, 'cours.json'), JSON.stringify(data, null, 1), 'utf8');

const totalArts = sequences.reduce((s, q) => s + q.essentiels.reduce((n, e) => n + (e.articleFin ? e.articleFin - e.article + 1 : 1), 0), 0);
console.log('Séquences :', sequences.length, '· entrées d’articles :', sequences.reduce((s, q) => s + q.essentiels.length, 0), '· articles couverts :', totalArts);
sequences.forEach((s) => console.log(`  S${s.num} — ${s.titre} (art. ${s.articles}) : ${s.essentiels.length} essentiels`));
console.log('Astuces transversales :', methode.astuces.length);
