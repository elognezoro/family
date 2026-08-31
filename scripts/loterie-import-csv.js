// Import des codes de loterie IMPRIMÉS (Annales de Physique-Chimie 2026-2027)
// depuis les CSV générés par generer_codes_loterie.py.
// Idempotent : les séries/codes déjà importés sont ignorés.
// Usage : node scripts/loterie-import-csv.js "<dossier des CSV>"
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const loterie = require('../services/loterie');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });

const DOSSIER = process.argv[2] || 'C:/Users/elogn/Downloads';
const FICHIERS = [
  { fichier: 'codes_loterie_2026-2027_3eme.csv', niveauCode: '3EM', niveauLabel: '3ème' },
  { fichier: 'codes_loterie_2026-2027_terminale_C.csv', niveauCode: 'TLC', niveauLabel: 'Terminale C' },
  { fichier: 'codes_loterie_2026-2027_terminale_D.csv', niveauCode: 'TLD', niveauLabel: 'Terminale D' },
];
const OUVRAGE = 'Annales de Physique-Chimie';
const DISCIPLINE = 'Physique-Chimie';
const ANNEE = '2026-2027';

(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());
  for (const f of FICHIERS) {
    const chemin = path.join(DOSSIER, f.fichier);
    const brut = fs.readFileSync(chemin, 'utf8').replace(/^\uFEFF/, '');
    const lignes = brut.split(/\r?\n/).filter(Boolean);
    const entete = lignes.shift().split(';');
    const iNumero = entete.indexOf('numero');
    const iCode = entete.indexOf('code');
    if (iNumero < 0 || iCode < 0) throw new Error('En-tête inattendu dans ' + f.fichier);

    const codes = lignes.map((l) => {
      const c = l.split(';');
      return { numero: parseInt(c[iNumero], 10), code: c[iCode].trim() };
    });
    // Contrôles : effectif, unicité, format
    if (codes.length !== 1000) throw new Error(f.fichier + ' : ' + codes.length + ' codes (1000 attendus)');
    if (new Set(codes.map((c) => c.code)).size !== codes.length) throw new Error('doublons dans ' + f.fichier);
    for (const c of codes) {
      if (!/^EW-2627-(3EM|TLC|TLD)-\d{4}-[0-9A-Z]{6}$/.test(c.code)) throw new Error('format invalide : ' + c.code);
    }

    let serie = await prisma.loterieSerie.findUnique({ where: { codeAnnee_niveauCode: { codeAnnee: '2627', niveauCode: f.niveauCode } } });
    if (!serie) {
      serie = await prisma.loterieSerie.create({
        data: { ouvrage: OUVRAGE, discipline: DISCIPLINE, anneeScolaire: ANNEE, codeAnnee: '2627', niveauCode: f.niveauCode, niveauLabel: f.niveauLabel, nbCodes: codes.length },
      });
    }
    const existants = await prisma.loterieCode.count({ where: { serieId: serie.id } });
    if (existants >= codes.length) { console.log('  =', f.niveauLabel, ': déjà importé (' + existants + ')'); continue; }
    const data = codes.map((c) => ({ serieId: serie.id, numero: c.numero, code: c.code, codeNorm: loterie.normaliser(c.code) }));
    for (let i = 0; i < data.length; i += 500) {
      await prisma.loterieCode.createMany({ data: data.slice(i, i + 500), skipDuplicates: true });
    }
    console.log('  ✓', f.niveauLabel, ':', codes.length, 'codes importés');
  }
  const total = await prisma.loterieCode.count();
  console.log('Total des codes en base :', total);
  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
