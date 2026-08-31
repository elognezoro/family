// Service de stockage des fichiers (photos, documents).
// - Production : Vercel Blob (stockage cloud persistant) si BLOB_READ_WRITE_TOKEN est défini.
// - Développement : repli sur le disque local (dossier /uploads).

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let blobPut = null;
try { blobPut = require('@vercel/blob').put; } catch (e) { /* paquet optionnel */ }
let blobDel = null;
try { blobDel = require('@vercel/blob').del; } catch (e) {}

function hasBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN && typeof blobPut === 'function';
}

// Nom de stockage = UUID + extension (STD-010 §6). Le nom d'origine n'est JAMAIS
// réutilisé comme identifiant ; il est conservé comme métadonnée par l'appelant
// (ex. CoachDocument.filename, Message.attachmentName). URL non énumérable.
function safeName(filename) {
  const ext = (path.extname(filename || '').toLowerCase().match(/^\.[a-z0-9]{1,10}$/) || [''])[0];
  return crypto.randomUUID() + ext;
}

// Enregistre un buffer et renvoie son URL publique
async function save(buffer, filename, contentType) {
  const name = safeName(filename);
  if (hasBlob()) {
    const res = await blobPut(`eduweb/${name}`, buffer, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
    });
    return res.url; // URL https du Blob
  }
  // Sur Vercel SANS jeton Blob : le disque des lambdas est en lecture seule —
  // échouer avec un message explicite plutôt qu'un EROFS obscur.
  if (process.env.VERCEL) {
    throw new Error('BLOB_READ_WRITE_TOKEN absent des variables d’environnement Vercel : ajoutez-le (Settings → Environment Variables) puis redéployez.');
  }
  // Repli local (développement)
  const dir = path.join(__dirname, '..', 'uploads');
  try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
  fs.writeFileSync(path.join(dir, name), buffer);
  return '/uploads/' + name;
}

// Supprime un fichier (Blob si URL distante, sinon disque local)
async function remove(url) {
  if (!url) return;
  try {
    if (/^https?:\/\//.test(url)) {
      if (blobDel && hasBlob()) await blobDel(url);
    } else {
      const fp = path.join(__dirname, '..', url);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
  } catch (e) { /* non bloquant */ }
}

module.exports = { save, remove, hasBlob };
