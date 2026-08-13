// Tests du moteur multi-types (Statut général de la Fonction Publique) :
// notation par type + préservation des clés lors du mélange des questions.
const test = require('node:test');
const assert = require('node:assert/strict');
const scoring = require('../data/formation/scoring');
const fp = require('../data/formation/fp');

const QCM = { type: 'qcm', options: ['a', 'b', 'c', 'd'], bonneReponse: 2, question: 'q' };
const VF = { type: 'vrai_faux', options: ['Vrai', 'Faux'], bonneReponse: 1, question: 'q' };
const MULTI = { type: 'multi', options: ['a', 'b', 'c', 'd', 'e'], bonnesReponses: [0, 3], question: 'q' };
const ASSOC = { type: 'association', gauche: ['G1', 'G2', 'G3'], droite: ['D1', 'D2', 'D3'], appariement: [2, 0, 1], question: 'q' };
const CLASS = { type: 'classement', items: ['I0', 'I1', 'I2', 'I3'], ordre: [3, 1, 0, 2], question: 'q' };

test('notation — choix unique et vrai/faux', () => {
  assert.equal(scoring.estCorrect(QCM, 2), true);
  assert.equal(scoring.estCorrect(QCM, 1), false);
  assert.equal(scoring.estCorrect(QCM, null), false);
  assert.equal(scoring.estCorrect(VF, 1), true);
  // question psychotechnique historique sans champ type
  assert.equal(scoring.estCorrect({ options: ['a', 'b', 'c', 'd'], bonneReponse: 0 }, 0), true);
});

test('notation — multi : la sélection doit être EXACTE', () => {
  assert.equal(scoring.estCorrect(MULTI, [0, 3]), true);
  assert.equal(scoring.estCorrect(MULTI, [3, 0]), false); // non trié = déjà normalisé avant
  assert.equal(scoring.estCorrect(MULTI, scoring.validerReponse(MULTI, [3, 0])), true); // via validation
  assert.equal(scoring.estCorrect(MULTI, [0]), false); // oubli
  assert.equal(scoring.estCorrect(MULTI, [0, 3, 4]), false); // réponse en trop
});

test('notation — association et classement', () => {
  assert.equal(scoring.estCorrect(ASSOC, [2, 0, 1]), true);
  assert.equal(scoring.estCorrect(ASSOC, [2, 1, 0]), false);
  assert.equal(scoring.estCorrect(CLASS, [3, 1, 0, 2]), true);
  assert.equal(scoring.estCorrect(CLASS, [3, 1, 2, 0]), false);
});

test('validation des réponses invalides', () => {
  assert.equal(scoring.validerReponse(QCM, 9), undefined);
  assert.equal(scoring.validerReponse(MULTI, [0, 9]), undefined);
  assert.equal(scoring.validerReponse(ASSOC, [0, 1]), undefined); // longueur ≠ gauche
  assert.equal(scoring.validerReponse(CLASS, [0, 0, 1, 2]), undefined); // pas une permutation
  assert.equal(scoring.validerReponse(QCM, null), null); // passage volontaire
});

test('mélange — la clé reste correcte après remappage (100 tirages par type)', () => {
  for (let k = 0; k < 100; k++) {
    const q1 = fp.fixerQuestion(QCM);
    assert.equal(q1.options[q1.bonneReponse], 'c');

    const q2 = fp.fixerQuestion(MULTI);
    assert.deepEqual(q2.bonnesReponses.map((i) => q2.options[i]).sort(), ['a', 'd']);

    const q3 = fp.fixerQuestion(ASSOC);
    // G1→D3, G2→D1, G3→D2 doivent être préservés
    assert.deepEqual(q3.appariement.map((d, g) => q3.gauche[g] + '→' + q3.droite[d]), ['G1→D3', 'G2→D1', 'G3→D2']);

    const q4 = fp.fixerQuestion(CLASS);
    assert.deepEqual(q4.ordre.map((i) => q4.items[i]), ['I3', 'I1', 'I0', 'I2']);

    const vf = fp.fixerQuestion(VF);
    assert.deepEqual(vf.options, ['Vrai', 'Faux']); // jamais mélangé
    assert.equal(vf.bonneReponse, 1);
  }
});

test('pourClient ne divulgue AUCUNE clé de correction', () => {
  const client = fp.pourClient([QCM, MULTI, ASSOC, CLASS].map((q, i) => ({ ...q, id: 'x' + i, difficulte: 2, duree: 40, sequence: 0 })));
  const s = JSON.stringify(client);
  for (const fuite of ['bonneReponse', 'bonnesReponses', 'appariement', '"ordre"', 'explication', 'reference']) {
    assert.equal(s.includes(fuite), false, 'fuite : ' + fuite);
  }
  // mais les éléments d'interaction sont bien présents
  assert.ok(client[2].gauche && client[2].droite && client[3].items);
});
