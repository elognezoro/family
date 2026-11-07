// Librairie /ouvrages : regroupement des versions d'un même niveau
// (« CE1 · Livre apprenant » / « CE1 · Livre enseignant ») côte à côte.
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const APP = require('../config/app');
const { regrouper, ancreDe, estAnnale } = require('../services/librairie');

const INFO = 'Informatique et culture numérique';
const livre = (id, titre, niveau, extra) => Object.assign({ id, titre, niveau, sousTitre: null, description: null, prix: null, imageUrl: null }, extra);

const CATALOGUE = [
  livre('pc3', 'Physique-Chimie', 'Troisième', { prix: 3000 }),
  livre('ia-a', 'Préserver l’humain', 'Version apprenant', { prix: 3500 }),
  livre('mat-a', INFO, 'Maternelle · Livre apprenant', { prix: 3000, sousTitre: 'Petite section · Moyenne section · Grande section' }),
  livre('mat-e', INFO, 'Maternelle · Livre enseignant', { prix: 3500, sousTitre: 'Petite section · Moyenne section · Grande section' }),
  livre('cp1-a', INFO, 'CP1 · Livre apprenant', { prix: 3000, sousTitre: 'Faire ses premiers pas avec les outils numériques' }),
  livre('cp1-e', INFO, 'CP1 · Livre enseignant', { prix: 3500, sousTitre: 'Faire ses premiers pas avec les outils numériques' }),
];

test('regrouper : livres simples en grille, versions réunies par niveau', () => {
  const blocs = regrouper(CATALOGUE);
  assert.equal(blocs.length, 2);
  assert.equal(blocs[0].type, 'grille');
  assert.deepEqual(blocs[0].livres.map((l) => l.id), ['pc3', 'ia-a']);
  assert.equal(blocs[1].type, 'collection');
  assert.equal(blocs[1].titre, INFO);
  assert.deepEqual(blocs[1].niveaux.map((n) => n.niveau), ['Maternelle', 'CP1']);
  // Le « · » du sous-titre ne compte pas : seul le niveau est découpé.
  assert.equal(blocs[1].niveaux[0].sousTitre, 'Petite section · Moyenne section · Grande section');
  assert.deepEqual(blocs[1].niveaux[1].versions.map((v) => [v.livre.id, v.version]),
    [['cp1-a', 'Livre apprenant'], ['cp1-e', 'Livre enseignant']]);
});

test('regrouper : un livre simple après une collection rouvre une grille', () => {
  const blocs = regrouper([CATALOGUE[2], CATALOGUE[3], CATALOGUE[0]]);
  assert.deepEqual(blocs.map((b) => b.type), ['collection', 'grille']);
  assert.deepEqual(regrouper([]), []);
});

test('ancre de collection : dérivée du titre, sans accent, unique, jamais vide', () => {
  const prises = new Set();
  assert.equal(ancreDe('Leadership administratif et pédagogique', prises), 'leadership-administratif-et-pedagogique');
  assert.equal(ancreDe('Leadership administratif et pédagogique', prises), 'leadership-administratif-et-pedagogique-2');
  assert.equal(ancreDe('Préserver l’humain à l’ère de l’IA !', prises), 'preserver-l-humain-a-l-ere-de-l-ia');
  assert.equal(ancreDe(' — ', prises), 'collection');
  const blocs = regrouper([...CATALOGUE, livre('lsd', 'Leadership administratif et pédagogique', 'Livret de formation · Cadres scolaires', { prix: 2000 })]);
  assert.deepEqual(blocs.filter((b) => b.type === 'collection').map((b) => b.ancre), ['informatique-et-culture-numerique', 'leadership-administratif-et-pedagogique']);
});

test('page /ouvrages : apprenant et enseignant dans le même bloc de niveau, prix affichés', async () => {
  const html = await ejs.renderFile(path.join(__dirname, '..', 'views', 'ouvrages.ejs'), { APP, blocs: regrouper(CATALOGUE) });
  const duos = html.split('<section class="duo"').slice(1);
  assert.equal(duos.length, 2);
  assert.match(duos[1], /CP1/);
  assert.match(duos[1], /Livre apprenant[\s\S]*3\s000\sFCFA[\s\S]*Livre enseignant[\s\S]*3\s500\sFCFA/);
  assert.match(duos[1], /href="\/ouvrages\/cp1-a\/commander"[\s\S]*href="\/ouvrages\/cp1-e\/commander"/);
  // Les livres simples gardent leur carte complète (titre — niveau).
  assert.match(html, /Physique-Chimie — <span>Troisième<\/span>/);
  // Chaque collection porte son ancre (lien direct /ouvrages#…).
  assert.match(html, /<div class="collection librairie__bloc" id="informatique-et-culture-numerique">/);
  // Sans annale, la grille n'a ni titre ni ancre (rendu inchangé).
  assert.doesNotMatch(html, /Annales du secondaire|Autres ouvrages/);
});

// Catalogue réel (ordre d'affichage) : annales de Terminale glissées après celles de
// Physique-Chimie, puis les autres ouvrages et les collections.
const BAC = { sousTitre: 'Préparation au BAC' };
const VITRINE = [
  livre('pc3', 'Physique-Chimie', 'Troisième', { prix: 3000, sousTitre: 'Préparation au BEPC' }),
  livre('pc-tc', 'Physique-Chimie', 'Terminale C', { prix: 3000, ...BAC }),
  livre('pc-td', 'Physique-Chimie', 'Terminale D', { prix: 3000, ...BAC }),
  livre('m-a1', 'Mathématiques', 'Terminale A1', BAC),
  livre('m-a2', 'Mathématiques', 'Terminale A2', BAC),
  livre('m-c', 'Mathématiques', 'Terminale C', BAC),
  livre('m-d', 'Mathématiques', 'Terminale D', BAC),
  livre('svt-a', 'SVT', 'Terminale A', BAC),
  livre('svt-c', 'SVT', 'Terminale C', BAC),
  livre('svt-d', 'SVT', 'Terminale D', BAC),
  livre('m6', 'Mathématiques', 'Sixième', { prix: 6000, sousTitre: 'J’apprends avec mes camarades' }),
  livre('tsd', 'Traitement statistique des données', 'Initiation à la recherche', { prix: 5000 }),
  livre('lsd', 'Leadership administratif et pédagogique', 'Livret de formation · Cadres scolaires', { prix: 2000 }),
  livre('pc-1d', 'physique-chimie ', 'Première D', { sousTitre: 'préparation au bac' }), // ajoutée plus tard, en fin de liste
];

test('annales du secondaire : un bloc, rangé par discipline dans l’ordre d’affichage', () => {
  const blocs = regrouper(VITRINE);
  assert.deepEqual(blocs.map((b) => b.type), ['annales', 'grille', 'collection']);
  const [annales, autres] = blocs;
  assert.equal(annales.titre, 'Annales du secondaire');
  assert.equal(annales.ancre, 'annales-du-secondaire');
  assert.deepEqual(annales.disciplines.map((d) => [d.discipline, d.ancre]),
    [['Physique-Chimie', 'physique-chimie'], ['Mathématiques', 'mathematiques'], ['SVT', 'svt']]);
  // Une annale ajoutée plus loin rejoint sa discipline (casse et espaces ignorés).
  assert.deepEqual(annales.disciplines[0].livres.map((l) => l.id), ['pc3', 'pc-tc', 'pc-td', 'pc-1d']);
  assert.deepEqual(annales.disciplines[1].livres.map((l) => l.id), ['m-a1', 'm-a2', 'm-c', 'm-d']);
  // Le manuel de Sixième (sans « Préparation au… ») n'est pas une annale.
  assert.deepEqual(autres.livres.map((l) => l.id), ['m6', 'tsd']);
  assert.equal(autres.titre, 'Autres ouvrages');
  assert.equal(autres.ancre, 'autres-ouvrages');
  assert.equal(estAnnale(livre('x', 'SVT', 'Terminale D · Livre enseignant', BAC)), false, 'une version de collection reste dans sa collection');
  assert.equal(estAnnale(livre('x', 'SVT', 'Terminale D', { sousTitre: 'Préparation au Brevet' })), true);
  assert.equal(estAnnale(livre('x', 'SVT', 'Terminale D', { sousTitre: 'Préparation au Baccalauréat' })), true);
  assert.equal(estAnnale(livre('x', 'SVT', 'Terminale D', { sousTitre: 'Préparation aux concours' })), false);
  assert.equal(estAnnale(null), false);
});

test('« Autres ouvrages » : une seule fois, pour la grille qui suit les annales', () => {
  const m6 = VITRINE[10], tsd = VITRINE[11], lsd = VITRINE[12];
  const ia = livre('ia', 'Préserver l’humain', 'Version apprenant');
  // Livre simple avant les annales, puis d'autres après une collection : seuls ceux
  // qui suivent directement les annales prennent le titre.
  const blocs = regrouper([m6, VITRINE[1], VITRINE[7], tsd, lsd, ia]);
  assert.deepEqual(blocs.map((b) => [b.type, b.titre]), [
    ['grille', null], ['annales', 'Annales du secondaire'], ['grille', 'Autres ouvrages'], ['collection', lsd.titre], ['grille', null],
  ]);
  assert.deepEqual(blocs[2].livres.map((l) => l.id), ['tsd']);
  assert.deepEqual(regrouper([VITRINE[1], lsd, ia]).map((b) => [b.type, b.titre]),
    [['annales', 'Annales du secondaire'], ['collection', lsd.titre], ['grille', null]]);
});

test('page /ouvrages : annales par discipline, liens rapides, cartes réduites au niveau', async () => {
  const html = await ejs.renderFile(path.join(__dirname, '..', 'views', 'ouvrages.ejs'), { APP, blocs: regrouper(VITRINE) });
  const bloc = html.slice(html.indexOf('<div class="annales librairie__bloc" id="annales-du-secondaire">'), html.indexOf('id="autres-ouvrages"'));
  assert.ok(bloc.length > 0, 'bloc des annales avant les autres ouvrages');
  assert.match(bloc, /href="#physique-chimie">Physique-Chimie <span>\(4\)<\/span>[\s\S]*href="#mathematiques">Mathématiques <span>\(4\)<\/span>[\s\S]*href="#svt">SVT <span>\(3\)<\/span>/);
  const sections = bloc.split('<section class="annales__discipline"').slice(1);
  assert.deepEqual(sections.map((s) => (s.match(/<h3 class="annales__titre" id="[^"]+">([^<]+)<\/h3>/) || [])[1]), ['Physique-Chimie', 'Mathématiques', 'SVT']);
  assert.match(sections[0], /^ id="physique-chimie" aria-labelledby="physique-chimie-titre">\s*<h3 class="annales__titre" id="physique-chimie-titre">/);
  // Sous sa discipline (h3), la carte ne répète que le niveau (h4) ; sans prix, pas de commande.
  assert.match(sections[1], /<h4><span>Terminale A1<\/span><\/h4>\s*<p>Préparation au BAC<\/p>/);
  assert.doesNotMatch(sections[1], /Mathématiques — <span>/);
  assert.match(sections[1], /commande en ligne bientôt ouverte/);
  assert.match(sections[0], /href="\/ouvrages\/pc-tc\/commander"/);
  // Les autres ouvrages gardent leur carte complète, sous leur titre.
  assert.match(html, /<div class="librairie__bloc" id="autres-ouvrages">\s*<h2 class="collection__titre">Autres ouvrages<\/h2>[\s\S]*Mathématiques — <span>Sixième<\/span>/);
});
