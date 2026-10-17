// Librairie /ouvrages : regroupement des versions d'un même niveau
// (« CE1 · Livre apprenant » / « CE1 · Livre enseignant ») côte à côte.
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const APP = require('../config/app');
const { regrouper } = require('../services/librairie');

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

test('page /ouvrages : apprenant et enseignant dans le même bloc de niveau, prix affichés', async () => {
  const html = await ejs.renderFile(path.join(__dirname, '..', 'views', 'ouvrages.ejs'), { APP, blocs: regrouper(CATALOGUE) });
  const duos = html.split('<section class="duo"').slice(1);
  assert.equal(duos.length, 2);
  assert.match(duos[1], /CP1/);
  assert.match(duos[1], /Livre apprenant[\s\S]*3\s000\sFCFA[\s\S]*Livre enseignant[\s\S]*3\s500\sFCFA/);
  assert.match(duos[1], /href="\/ouvrages\/cp1-a\/commander"[\s\S]*href="\/ouvrages\/cp1-e\/commander"/);
  // Les livres simples gardent leur carte complète (titre — niveau).
  assert.match(html, /Physique-Chimie — <span>Troisième<\/span>/);
});
