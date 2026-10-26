// Guide d'utilisation de l'École chantée (/ressources/guide) : contenu bien formé,
// chiffres conformes au fonctionnement du site, rendu de la page (rubriques, sommaire,
// tableaux, gras, échappement du texte).
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const APP = require('../config/app');
const guide = require('../data/guide-ecole-chantee');
const acces = require('../services/acces-lecons');

const TYPES = ['sous-titre', 'paragraphe', 'liste', 'etapes', 'tableau', 'encadre', 'faq'];
const texte = JSON.stringify(guide);

test('cinq rubriques, blocs bien formés, aucun HTML dans les textes', () => {
  assert.deepEqual(guide.rubriques.map((r) => r.id), ['decouvrir', 'enseignant', 'apprenant', 'parent', 'questions']);
  for (const r of guide.rubriques) {
    assert.ok(r.titre && r.icone && r.accroche, r.id);
    for (const [i, b] of r.blocs.entries()) {
      assert.ok(TYPES.includes(b.type), `${r.id}#${i} : type ${b.type}`);
      if (b.type === 'tableau') b.lignes.forEach((l, k) => assert.equal(l.length, b.colonnes.length, `${r.id}#${i} ligne ${k}`));
      if (b.type === 'etapes') b.etapes.forEach((e) => assert.ok(e.titre && e.texte, `${r.id}#${i}`));
      if (b.type === 'faq') b.items.forEach((it) => assert.ok(it.q && it.r, `${r.id}#${i}`));
    }
  }
  assert.doesNotMatch(texte, /<[a-z\/][^>]*>/i, 'pas de balise HTML');
  assert.doesNotMatch(texte, /&amp;|&nbsp;/, 'pas d’entité HTML');
});

test('chiffres et coordonnées conformes au site', () => {
  assert.equal(APP.telechargementPayant.prix, 200);
  assert.match(texte, /200 FCFA/);
  assert.match(texte, new RegExp(`${acces.NB_ESSAI} questions`), 'quiz d’essai');
  assert.match(texte, /8\/10/, 'seuil « Je maîtrise »');
  assert.match(texte, /10 questions/);
  assert.match(texte, new RegExp(`${APP.telechargementPayant.delaiHeures} heures`));
  assert.match(texte, new RegExp(`${APP.telechargementPayant.validiteJours} jours`));
  // Numéros de paiement écrits comme dans la fenêtre de paiement du site
  assert.ok(texte.includes(APP.numeroOperateur('wave')), 'numéro Wave');
  assert.ok(texte.includes(APP.numeroOperateur('moov')), 'numéro Flooz');
  assert.doesNotMatch(texte, /rubrique Contact/, 'les coordonnées sont dans le pied de page');
});

function page(g) {
  const fichier = path.join(__dirname, '..', 'views', 'ressources-guide.ejs');
  return new Promise((ok, ko) => ejs.renderFile(fichier, { guide: g }, (err, html) => (err ? ko(err) : ok(html))));
}

test('page : rubriques, profils, sommaire avec ancres valides, gras rendu', async () => {
  const html = await page(guide);
  for (const r of guide.rubriques) assert.match(html, new RegExp(`<article class="panel guide-rubrique" id="${r.id}">`));
  assert.equal((html.match(/class="guide-profil"/g) || []).length, 3);
  const ancres = [...html.matchAll(/class="guide-sommaire"[\s\S]*?<\/aside>/g)][0][0].match(/href="#([^"]+)"/g).map((h) => h.slice(7, -1));
  ancres.forEach((a) => assert.ok(html.includes(`id="${a}"`), 'ancre ' + a));
  assert.ok(!html.includes('**'), 'tout le gras est converti');
  assert.match(html, /<strong>/);
});

test('page : le texte du guide est échappé (seul **gras** est interprété)', async () => {
  const g = { rubriques: [{ id: 'decouvrir', titre: 'T', icone: '🎵', accroche: 'a <script>x</script>', blocs: [
    { type: 'paragraphe', texte: '**fort** et <img src=x onerror=alert(1)>' },
    { type: 'tableau', colonnes: ['A', 'B'], lignes: [['<b>1</b>', '2']] },
  ] }] };
  const html = await page(g);
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('<strong>fort</strong>'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;b&gt;1&lt;/b&gt;'));
});

test('rubrique enseignant : partie « éducation inclusive » complète, compléments parent et apprenant', () => {
  const ens = guide.rubriques.find((r) => r.id === 'enseignant').blocs;
  const i7 = ens.findIndex((b) => b.type === 'sous-titre' && /^7\. Une éducation inclusive/.test(b.texte));
  const i8 = ens.findIndex((b) => b.type === 'sous-titre' && /^8\./.test(b.texte));
  assert.ok(i7 > 0 && i8 > i7, 'partie 7 inclusive avant la partie 8');
  const partie = ens.slice(i7, i8);
  const titres = partie.map((b) => b.titre || '').join(' | ');
  for (const attendu of [/piliers/i, /chaque moment de la séance/i, /besoins de chaque élève/i, /équité/i, /familles/i, /Ma séance est-elle inclusive/i]) {
    assert.match(titres, attendu);
  }
  const besoins = partie.find((b) => b.type === 'tableau' && /besoins de chaque élève/i.test(b.titre || ''));
  assert.ok(besoins.lignes.length >= 10, 'au moins 10 profils de besoins');
  assert.match(JSON.stringify(partie), /n.est pas chronométré/, 'quiz d’entraînement sans chronomètre');
  assert.match(JSON.stringify(partie), /ne le faites pas circuler/, 'pas de partage du lien personnel');
  assert.match(JSON.stringify(guide.rubriques.find((r) => r.id === 'parent')), /besoins particuliers/);
  assert.match(JSON.stringify(guide.rubriques.find((r) => r.id === 'apprenant')), /du mal à lire/);
});
