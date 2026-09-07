require('dotenv').config();
const Keygrip = require('keygrip');
const prisma = require('./data/prisma-store');
const B = 'http://localhost:3000';
let ok = 0, ko = 0;
const check = (n, c, d) => { if (c) { ok++; console.log('  ✓', n); } else { ko++; console.log('  ✗', n, d || ''); } };
async function req(path, o = {}) {
  const r = await fetch(B + path, { method: o.method || 'GET', redirect: 'manual',
    headers: { ...(o.cookie ? { cookie: o.cookie } : {}), ...(o.body ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
    body: o.body ? new URLSearchParams(o.body).toString() : undefined });
  return { status: r.status, location: r.headers.get('location') || '', text: r.status === 200 ? await r.text() : '' };
}
(async () => {
  try {
    // 1. Pages : plus de MTN, deux numéros affichés
    for (const [page, libelle] of [['/dons', 'dons'], ['/formation', 'formation']]) {
      const r = await req(page);
      check(`${libelle} : MTN absent`, !r.text.includes('MTN'));
      check(`${libelle} : Wave/Moov 01 5263 3030`, r.text.includes('01 5263 3030'));
      check(`${libelle} : Orange 07 0985 8042`, r.text.includes('07 0985 8042'));
    }
    const livre = await prisma.livreVitrine.findFirst({ where: { prix: { not: null }, actif: true } });
    let r = await req(`/ouvrages/${livre.id}/commander`);
    check('bon de commande : MTN absent, 2 numéros', !r.text.includes('MTN') && r.text.includes('07 0985 8042') && r.text.includes('01 5263 3030'));
    check('bon de commande : 3 pastilles opérateurs', (r.text.match(/name="operateur"/g) || []).length === 3);
    r = await req('/');
    check('accueil (i18n fr) : MTN absent', !r.text.includes('MTN'));

    // 2. Serveur : opérateur mtn refusé partout
    r = await req('/dons', { method: 'POST', body: { nom: 'Test Op', montant: '500', operateur: 'mtn', refTransaction: 'OPREF001', website: '' } });
    check('don via mtn → refusé', decodeURIComponent(r.location).includes('opérateur'));
    r = await req(`/ouvrages/${livre.id}/commander`, { method: 'POST', body: {
      nom: 'Test Op', telephone: '0102030405', quantite: '1', lieu: 'Abidjan', modePaiement: 'mobile_money',
      operateur: 'mtn', refTransaction: 'OPREF002', website: '', prixAffiche: String(livre.prix),
    } });
    check('commande via mtn → refusée', decodeURIComponent(r.location).includes('opérateur'));

    // 3. Confirmation : numéro selon l'opérateur (orange → 07 0985 8042)
    r = await req(`/ouvrages/${livre.id}/commander`, { method: 'POST', body: {
      nom: 'Test Orange', telephone: '0102030405', quantite: '1', lieu: 'Abidjan', modePaiement: 'mobile_money',
      operateur: 'orange', refTransaction: 'OPREF003', website: '', prixAffiche: String(livre.prix),
    } });
    const id = (r.location.match(/commande\/([a-f0-9-]+)/) || [])[1];
    r = await req(`/ouvrages/commande/${id}`);
    check('confirmation Orange → 07 0985 8042', r.text.includes('07 0985 8042') && r.text.includes('Orange Money'));
  } finally {
    await prisma.livreCommande.deleteMany({ where: { refTransaction: { startsWith: 'OPREF' } } });
    await prisma.don.deleteMany({ where: { refTransaction: { startsWith: 'OPREF' } } });
    console.log('Nettoyage fait.');
  }
  console.log(`\nRésultat : ${ok} OK, ${ko} KO`);
  await prisma.$disconnect();
  process.exit(ko ? 1 : 0);
})().catch(async (e) => { console.error('ERREUR :', e); await prisma.$disconnect(); process.exit(1); });
