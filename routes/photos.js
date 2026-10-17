// Photos de profil encore stockées en base (URI data:image en base64) :
// servies comme de vraies images, redimensionnées et mises en cache, au lieu
// d'être recopiées dans le HTML de chaque page. Voir services/photo.js.
//
// Monté AVANT la session (server.js) : réponse sans cookie, donc cachable par
// le navigateur ET le CDN de Vercel ; pas de lecture superflue de l'utilisateur
// connecté pour chaque image.
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const photo = require('../services/photo');

const CACHE = 'public, max-age=31536000, s-maxage=31536000, immutable'; // l'URL change avec la photo

router.get('/:id/photo', async (req, res) => {
  const v = String(req.query.v || '');
  if (!/^[a-f0-9]{16}$/.test(v)) return res.sendStatus(404);
  const s = photo.taille(req.query.s);
  const etag = `"${v}-${s}"`;

  // Le navigateur a déjà cette version : inutile de relire la base.
  const inm = String(req.headers['if-none-match'] || '').split(',').map((t) => t.trim());
  if (inm.includes(etag)) {
    res.set({ ETag: etag, 'Cache-Control': CACHE });
    return res.status(304).end();
  }

  const u = await prisma.user.findUnique({ where: { id: req.params.id }, select: { photo: true } });
  // Empreinte différente = photo changée (ou URL inventée) : rien à servir.
  if (!u || !photo.estDataUri(u.photo) || photo.empreinte(u.photo) !== v) return res.sendStatus(404);
  const img = photo.decoderDataUri(u.photo);
  if (!img) return res.sendStatus(404);

  let corps = img.buffer;
  let type = img.mime;
  try {
    ({ buffer: corps, mime: type } = await photo.miniature(img.buffer, s));
  } catch (e) {
    // sharp indisponible ou image illisible : on sert l'original (format déjà contrôlé).
    console.warn('[photo] miniature impossible, image d’origine servie :', e && e.message);
  }
  res.set({
    'Content-Type': type,
    'Cache-Control': CACHE,
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
  });
  res.send(corps);
});

module.exports = router;
