// Auteurs et contributeurs de la banque : accordéon « Auteurs » par discipline,
// crédits par domaine de chansons (ex. chansons d'Histoire d'Éveil au milieu).
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const auteurs = require('../data/auteurs');
const chants = require('../data/chants');

const NAMOI = 'Dr Ahiza Célestine NAMOI, Maître Assistante';

test('accordéon « Auteurs » d’Éveil au milieu : contributrice de l’analyse critique des chansons d’Histoire', () => {
  const e = auteurs.pour('Éveil au milieu', 'CE2');
  assert.ok(e, 'entrée Éveil au milieu');
  assert.match(e.titre, /Analyse critique des contenus/);
  assert.ok(e.liste.some((n) => n.startsWith(NAMOI) && /Histoire/.test(n)), 'nom et portée (Histoire)');
  assert.ok(auteurs.pour('eveil au milieu', 'CM1'), 'comparaison tolérante, tous niveaux');
  assert.equal(auteurs.pour('Physique-Chimie', '6e').liste.length, 9, 'autres disciplines inchangées');
});

test('crédit sur les pages des chansons d’Histoire seulement', () => {
  const histoire = chants.toutes().filter((c) => /^Histoire\s/.test(c.lecon || ''));
  assert.ok(histoire.length >= 4);
  for (const c of histoire) {
    assert.deepEqual(auteurs.pourChant(c), [{ role: 'Analyse critique des contenus', noms: [NAMOI] }], c.slug);
  }
  const autres = chants.toutes().filter((c) => c.discipline === 'Éveil au milieu' && !/^Histoire\s/.test(c.lecon || ''));
  assert.ok(autres.length > 0);
  for (const c of autres) assert.deepEqual(auteurs.pourChant(c), [], c.slug);
  assert.deepEqual(auteurs.pourChant(null), []);
});
