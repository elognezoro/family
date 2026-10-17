// Reprise de DONNÉES (aucune migration de schéma) — photos de profil en base64
//   User.photo = « data:image/…;base64,… » (jusqu'à ~1,4 Mo, relue en base à
//   chaque page) → image réduite (≤ 512 px, proportions conservées) déposée sur
//   Vercel Blob, User.photo = son URL (comme pour les photos téléversées depuis).
//
// Sans perte :
//   - sauvegarde COMPLÈTE des URI d'origine dans backups/ AVANT toute écriture ;
//   - mise à jour conditionnelle : si la photo a changé entre-temps, rien n'est
//     écrasé (le fichier déposé sur Blob est alors supprimé) ;
//   - format refusé (ex. SVG) ou image illisible : photo laissée telle quelle ;
//   - retour arrière possible avec --restaurer.
//
// Usage :
//   node scripts/migrate-photos-blob.js                       → inventaire seul, AUCUNE écriture
//   node scripts/migrate-photos-blob.js --appliquer           → sauvegarde + Blob + mise à jour
//   node scripts/migrate-photos-blob.js --restaurer <fichier> → remet les URI d'origine
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const photo = require('../services/photo');
const storage = require('../services/storage');

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const args = process.argv.slice(2);
const APPLIQUER = args.includes('--appliquer');
const iRestaurer = args.indexOf('--restaurer');
const ko = (n) => (n / 1024).toFixed(0) + ' Ko';

async function inventaire() {
  const ids = await prisma.user.findMany({ where: { photo: { startsWith: 'data:' } }, select: { id: true }, orderBy: { createdAt: 'asc' } });
  const lignes = [];
  for (const { id } of ids) {
    // Une photo à la fois (chacune peut peser plus d'1 Mo)
    const u = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true, isSuperAdmin: true, photo: true } });
    if (u && photo.estDataUri(u.photo)) lignes.push(u);
  }
  return lignes;
}

async function appliquer(lignes) {
  if (!storage.hasBlob()) throw new Error('BLOB_READ_WRITE_TOKEN absent : impossible de déposer les photos sur Vercel Blob.');
  const dir = path.join(__dirname, '..', 'backups');
  fs.mkdirSync(dir, { recursive: true });
  const fichier = path.join(dir, `photos-base64-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`);
  // 1. Sauvegarde intégrale AVANT toute écriture (une ligne JSON par photo)
  fs.writeFileSync(fichier, lignes.map((u) => JSON.stringify({ id: u.id, photo: u.photo })).join('\n') + '\n');
  console.log('Sauvegarde des', lignes.length, 'photo(s) d’origine :', fichier);

  let faits = 0, ignores = 0;
  for (const u of lignes) {
    const img = photo.decoderDataUri(u.photo);
    if (!img) { ignores++; console.log('  IGNORÉE (format non pris en charge) :', u.id); continue; }
    let sortie;
    try { sortie = await photo.reduite(img.buffer); }
    catch (e) { ignores++; console.log('  IGNORÉE (image illisible) :', u.id, '—', e.message); continue; }
    const url = await storage.save(sortie.buffer, sortie.mime === 'image/webp' ? 'photo.webp' : 'photo.jpg', sortie.mime);
    // 2. Mise à jour seulement si la photo n'a pas changé depuis l'inventaire
    const r = await prisma.user.updateMany({ where: { id: u.id, photo: u.photo }, data: { photo: url } });
    if (r.count !== 1) {
      ignores++;
      await storage.remove(url);
      console.log('  IGNORÉE (photo modifiée entre-temps) :', u.id);
      continue;
    }
    // 3. Journal pour le retour arrière
    fs.appendFileSync(fichier, JSON.stringify({ id: u.id, url }) + '\n');
    faits++;
    console.log(`  OK ${u.id} : ${ko(u.photo.length)} en base → ${ko(sortie.buffer.length)} sur Blob`);
  }
  console.log(`Terminé : ${faits} photo(s) reprise(s), ${ignores} ignorée(s). Sauvegarde : ${fichier}`);
}

async function restaurer(fichier) {
  const lignes = fs.readFileSync(fichier, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const origine = {}; const urls = {};
  lignes.forEach((l) => { if (l.photo) origine[l.id] = l.photo; if (l.url) urls[l.id] = l.url; });
  let faits = 0;
  for (const id of Object.keys(urls)) {
    // Uniquement si la photo est toujours celle déposée par la reprise
    const r = await prisma.user.updateMany({ where: { id, photo: urls[id] }, data: { photo: origine[id] } });
    if (r.count === 1) faits++;
    else console.log('  inchangée (photo modifiée depuis la reprise) :', id);
  }
  console.log(`Restauration : ${faits} photo(s) remise(s) en base64.`);
}

(async () => {
  if (iRestaurer !== -1) {
    if (!args[iRestaurer + 1]) throw new Error('Préciser le fichier de sauvegarde : --restaurer backups/photos-base64-….jsonl');
    await restaurer(args[iRestaurer + 1]);
    return;
  }
  const lignes = await inventaire();
  let total = 0;
  console.log(`${lignes.length} photo(s) de profil encore en base64 :`);
  for (const u of lignes) {
    total += u.photo.length;
    const img = photo.decoderDataUri(u.photo);
    console.log(`  ${u.id}  ${u.role}${u.isSuperAdmin ? ' (super-admin)' : ''}  ${ko(u.photo.length)}  ${img ? img.mime : 'FORMAT NON PRIS EN CHARGE'}`);
  }
  console.log('Total en base :', ko(total));
  if (!APPLIQUER) { console.log('Inventaire seul : aucune écriture. Relancer avec --appliquer pour la reprise.'); return; }
  await appliquer(lignes);
})()
  .catch((e) => { console.error('ÉCHEC :', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
