// Photos de profil : adresse servie au navigateur.
//
// Les nouvelles photos sont sur Vercel Blob (User.photo = URL https). Les plus
// anciennes sont encore en base sous forme d'URI « data:image/…;base64,… »
// (jusqu'à ~1,4 Mo) : les intégrer telles quelles au HTML alourdissait CHAQUE
// page (l'avatar de l'en-tête figure deux fois). On les sert donc par une URL
// dédiée, /users/:id/photo?v=<empreinte>&s=<taille>, redimensionnée et mise en
// cache (voir routes/photos.js).
//
// L'empreinte du contenu sert à la fois de version (cache « immutable ») et de
// clé : sans elle, l'identifiant d'un utilisateur ne suffit pas à obtenir sa
// photo (même logique que les URL Blob, non énumérables).

const crypto = require('crypto');

const TAILLES = [96, 256]; // 96 : avatars de l'en-tête (36 et 48 px) ; 256 : grands avatars
const TAILLE_DEFAUT = 96;

// Seuls les formats matriciels sont acceptés (jamais image/svg+xml : servi
// depuis notre origine, un SVG pourrait exécuter du script).
const DATA_URI = /^data:image\/(jpeg|jpg|png|webp|gif);base64,([A-Za-z0-9+/=\s]+)$/i;

function estDataUri(photo) {
  return typeof photo === 'string' && /^data:/i.test(photo);
}

function empreinte(photo) {
  return crypto.createHash('sha1').update(photo).digest('hex').slice(0, 16);
}

function taille(s) {
  const n = Number(s);
  return TAILLES.includes(n) ? n : TAILLE_DEFAUT;
}

// URL à placer dans <img src> : inchangée pour une photo déjà stockée par URL,
// URL dédiée pour une photo en base64.
function photoSrc(userId, photo, s) {
  if (!photo) return null;
  if (!estDataUri(photo)) return photo;
  if (!userId) return null;
  return `/users/${encodeURIComponent(userId)}/photo?v=${empreinte(photo)}&s=${taille(s)}`;
}

// { mime, buffer } d'une URI data:image (null si format refusé ou illisible)
function decoderDataUri(photo) {
  const m = DATA_URI.exec(photo || '');
  if (!m) return null;
  const buffer = Buffer.from(m[2].replace(/\s+/g, ''), 'base64');
  if (!buffer.length) return null;
  const ext = m[1].toLowerCase();
  return { mime: 'image/' + (ext === 'jpg' ? 'jpeg' : ext), buffer };
}

// Réencode une image : JPEG, ou WebP si elle a de vraies zones transparentes
// (le fond de l'avatar doit rester visible ; un PNG resterait lourd).
// Renvoie { buffer, mime }.
// ⚠️ sharp est chargé ICI, jamais au niveau module (voir routes/admin.js).
// Sur Vercel, son binaire natif et libvips (libvips-cpp.so, chargée par le
// binaire, invisible au traçage des dépendances) sont embarqués par
// « includeFiles » dans vercel.json. Contrôle : GET /api/sante/images.
async function encoder(buffer, redimensionner) {
  const sharp = require('sharp');
  const { isOpaque } = await sharp(buffer).stats();
  const img = redimensionner(sharp(buffer).rotate()); // rotate : orientation EXIF (téléphones)
  if (!isOpaque) return { buffer: await img.webp({ quality: 82, alphaQuality: 90 }).toBuffer(), mime: 'image/webp' };
  return { buffer: await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer(), mime: 'image/jpeg' };
}

// Vignette carrée (cadrage centré, comme object-fit: cover des avatars)
function miniature(buffer, s) {
  const n = taille(s);
  return encoder(buffer, (img) => img.resize(n, n, { fit: 'cover', position: 'centre' }));
}

// Photo réduite à 512 px de côté au plus, proportions et cadrage conservés
// (reprise des anciennes photos vers Vercel Blob)
function reduite(buffer) {
  return encoder(buffer, (img) => img.resize(512, 512, { fit: 'inside', withoutEnlargement: true }));
}

module.exports = { TAILLES, estDataUri, empreinte, taille, photoSrc, decoderDataUri, miniature, reduite };
