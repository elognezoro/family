// Tests des photos de profil (node:test — natif). Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const photo = require('../services/photo');

// PNG 1×1 opaque (rouge)
const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC';
const DATA = 'data:image/png;base64,' + PNG;

test('photoSrc : URL Blob ou /uploads inchangée, rien sans photo', () => {
  assert.equal(photo.photoSrc('u1', 'https://x.public.blob.vercel-storage.com/eduweb/a.jpg'), 'https://x.public.blob.vercel-storage.com/eduweb/a.jpg');
  assert.equal(photo.photoSrc('u1', '/uploads/a.jpg'), '/uploads/a.jpg');
  assert.equal(photo.photoSrc('u1', null), null);
  assert.equal(photo.photoSrc('u1', ''), null);
});

test('photoSrc : URI base64 → URL dédiée versionnée par empreinte, jamais le base64', () => {
  const src = photo.photoSrc('u1', DATA, 96);
  assert.equal(src, `/users/u1/photo?v=${photo.empreinte(DATA)}&s=96`);
  assert.match(photo.empreinte(DATA), /^[a-f0-9]{16}$/);
  assert.ok(!src.includes('base64'));
  assert.notEqual(photo.empreinte(DATA), photo.empreinte(DATA + 'A')); // photo changée → nouvelle URL
  assert.equal(photo.photoSrc('u1', DATA, 999), `/users/u1/photo?v=${photo.empreinte(DATA)}&s=96`); // taille hors liste
  assert.equal(photo.photoSrc(null, DATA), null);
});

test('decoderDataUri : formats matriciels seulement (jamais SVG)', () => {
  const img = photo.decoderDataUri(DATA);
  assert.equal(img.mime, 'image/png');
  assert.ok(img.buffer.length > 0);
  assert.equal(photo.decoderDataUri('data:image/jpg;base64,' + PNG).mime, 'image/jpeg');
  assert.equal(photo.decoderDataUri('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='), null);
  assert.equal(photo.decoderDataUri('data:text/html;base64,PGI+'), null);
  assert.equal(photo.decoderDataUri('https://exemple.ci/a.jpg'), null);
});

test('miniature : carré à la taille demandée ; reduite : ≤ 512 px, proportions conservées', async () => {
  const sharp = require('sharp');
  const grande = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#3366cc' } }).jpeg().toBuffer();
  const mini = await photo.miniature(grande, 96);
  assert.equal(mini.mime, 'image/jpeg');
  const m = await sharp(mini.buffer).metadata();
  assert.deepEqual([m.width, m.height], [96, 96]);
  const red = await photo.reduite(grande);
  const r = await sharp(red.buffer).metadata();
  assert.deepEqual([r.width, r.height], [512, 341]);
  const petite = await photo.reduite(Buffer.from(PNG, 'base64'));
  const p = await sharp(petite.buffer).metadata();
  assert.deepEqual([p.width, p.height], [1, 1]); // jamais agrandie
});
