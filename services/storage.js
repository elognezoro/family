// Service de stockage des fichiers (photos, documents).
// - Production : Vercel Blob (stockage cloud persistant) si BLOB_READ_WRITE_TOKEN est défini.
// - Développement : repli sur le disque local (dossier /uploads).

const path = require('path');
const fs = require('fs');

let blobPut = null;
try { blobPut = require('@vercel/blob').put; } catch (e) { /* paquet optionnel */ }
let blobDel = null;
try { blobDel = require('@vercel/blob').del; } catch (e) {}

function hasBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN && typeof blobPut === 'function';
}

function safeName(filename) {
  const base = (filename || 'fichier').replace(/[^\w.\-]+/g, '_');
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}-${base}`;
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
