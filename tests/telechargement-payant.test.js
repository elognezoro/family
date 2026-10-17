// Téléchargement payant des ressources : prix affiché et cartes de la banque
// (aucun lien vers le fichier brut pour une ressource payante).
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const APP = require('../config/app');

const BLOB = 'https://exemple.public.blob.vercel-storage.com/eduweb/ressources/clip-abc.mp4';

function carte(ressource) {
  const fichier = path.join(__dirname, '..', 'views', 'partials', 'banque-niveau.ejs');
  const n = { niveau: 'Sixième', total: 1, disciplines: [{ nom: 'Physique-Chimie', ressources: [ressource] }] };
  return new Promise((ok, ko) => ejs.renderFile(fichier, {
    n, groupe: 'niv', rangNiv: 1,
    chantDe: () => null, auteursDe: () => null,
    nombreFr: (x) => String(x || 0),
    paiement: { prix: 200, euros: '0,30 €' },
  }, (err, html) => (err ? ko(err) : ok(html))));
}
const ressource = (payant) => ({
  id: '11111111-2222-3333-4444-555555555555', titre: 'Leçon 1 — Le circuit', description: null,
  niveau: 'Sixième', discipline: 'Physique-Chimie', type: 'fichier', url: BLOB, mime: 'video/mp4',
  taille: 12 * 1048576, vues: 0, telechargements: 0, telechargementPayant: payant,
});
const liens = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((m) => m[1]);

test('prix : 200 FCFA ≈ 0,30 € (parité fixe 655,957), Wave et Flooz (Moov Money)', () => {
  assert.equal(APP.telechargementPayant.prix, 200);
  assert.equal(APP.telechargementPayant.euros, '0,30 €');
  assert.deepEqual(APP.telechargementPayant.operateurs.map((o) => o.id), ['wave', 'moov']);
  assert.equal(APP.numeroOperateur('wave'), '(+225) 07 0985 8042');
  assert.equal(APP.numeroOperateur('moov'), '(+225) 01 5263 3030');
});

test('carte payante : « Télécharger » mène au paiement, aucun lien vers le fichier', async () => {
  const html = await carte(ressource(true));
  assert.ok(!liens(html).some((h) => h.includes('blob.vercel-storage.com')), 'aucun <a> vers le fichier brut');
  assert.ok(liens(html).includes('/ressources/11111111-2222-3333-4444-555555555555/telecharger'));
  assert.match(html, /data-paiement="11111111-2222-3333-4444-555555555555"/);
  assert.match(html, /12,0 Mo · 200 FCFA/);
  assert.match(html, /<video[^>]*controlslist="nodownload"[^>]*data-protege/);
  assert.match(html, /data-plein-ecran/);
  assert.doesNotMatch(html, /<a[^>]*\sdownload[\s>]/, 'aucun lien avec l’attribut download');
});

test('carte gratuite : téléchargement direct inchangé', async () => {
  const html = await carte(ressource(false));
  assert.ok(liens(html).includes(BLOB + '?download=1'));
  assert.doesNotMatch(html, /data-paiement/);
  assert.doesNotMatch(html, /controlslist/);
});
