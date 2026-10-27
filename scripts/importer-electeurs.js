// Importe la liste électorale (Excel) du scrutin « aidus-2026 » et crée le scrutin
// s'il n'existe pas (vote le 29/10/2026 de 9 h à 16 h GMT, réinitialisation des
// votes de test le 28/10/2026 à 16 h GMT, les trois candidats de l'affiche officielle,
// dans son ordre ; photos à ajouter dans /admin/elections).
// Colonnes attendues (1re ligne) : Classe | Promotion | Arrivée en | Campus | Civilité |
//   Nom | Prénom | Spécialité | Situation professionnelle actuelle | Courriel 1 | Courriel 2 | WhatsApp
// Usage : node scripts/importer-electeurs.js "<fichier.xlsx>" [--remplacer]
//   --remplacer : remplace la liste existante (refusé si des votes sont enregistrés).
require('dotenv').config();
const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SCRUTIN = 'aidus-2026';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const texte = (c) => {
  let v = c.value;
  if (v && typeof v === 'object') v = v.text || v.result || (v.richText ? v.richText.map((t) => t.text).join('') : v.hyperlink || '');
  return String(v == null ? '' : v).trim();
};

(async () => {
  const [fichier, option] = process.argv.slice(2);
  if (!fichier) throw new Error('Indiquez le fichier Excel de la liste électorale.');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(fichier);
  const ws = wb.worksheets[0];
  const entetes = Array.from(ws.getRow(1).values, (v) => String(v || '').trim().toLowerCase()); // Array.from : comble les cases vides
  const col = (nom) => entetes.findIndex((h) => h.startsWith(nom));
  const C = { classe: col('classe'), arrivee: col('arrivée'), campus: col('campus'), civilite: col('civilité'), nom: col('nom'), prenom: col('prénom'), specialite: col('spécialité'), mail1: col('courriel 1'), mail2: col('courriel 2') };
  if (Object.values(C).some((i) => i < 1)) throw new Error('Colonnes introuvables : ' + JSON.stringify(C));

  const electeurs = [];
  const rejets = [];
  ws.eachRow((row, r) => {
    if (r === 1) return;
    const g = (i) => texte(row.getCell(i));
    const nom = g(C.nom), prenom = g(C.prenom), classe = g(C.classe);
    if (!nom && !prenom) return;
    const m = /^(\d{4})\D+(\d{4})$/.exec(classe);
    if (!nom || !prenom || !m) { rejets.push(r); return; }
    const arrivee = parseInt(g(C.arrivee), 10);
    const emails = [g(C.mail1), g(C.mail2)].map((x) => x.toLowerCase()).filter((x) => EMAIL_RE.test(x));
    electeurs.push({
      scrutinId: SCRUTIN, civilite: g(C.civilite) || null, nom, prenom, classe,
      anneeEntree: +m[1], anneeDiplome: +m[2], arriveeEn: arrivee >= 1950 ? arrivee : null,
      campus: g(C.campus) || null, specialite: g(C.specialite) || null, emails: emails.join(',') || null,
    });
  });

  let s = await prisma.scrutin.findUnique({ where: { id: SCRUTIN } });
  if (!s) {
    s = await prisma.scrutin.create({
      data: {
        id: SCRUTIN, titre: 'Élection du Président de l’AIDUS',
        sousTitre: 'Liste électorale : diplômés de l’Université Senghor — Côte d’Ivoire.',
        debut: new Date('2026-10-29T09:00:00Z'), fin: new Date('2026-10-29T16:00:00Z'),
        reinitialiserA: new Date('2026-10-28T16:00:00Z'),
      },
    });
    console.log('Scrutin créé :', s.id);
  }
  if (!(await prisma.scrutinCandidat.count({ where: { scrutinId: SCRUTIN } }))) {
    await prisma.scrutinCandidat.createMany({ data: ['BROU BOKA', 'Lydie Yolande Abokan Dogbo', 'Pascald DJADOU'].map((nom, i) => ({ scrutinId: SCRUTIN, ordre: i + 1, nom })) });
    console.log('3 candidats créés (photos à ajouter dans /admin/elections).');
  }

  const deja = await prisma.electeur.count({ where: { scrutinId: SCRUTIN } });
  if (deja && option !== '--remplacer') {
    console.log(`Liste déjà importée (${deja} électeurs) : rien n’est modifié (option --remplacer pour la remplacer).`);
  } else {
    if (deja) {
      const votes = await prisma.emargement.count({ where: { scrutinId: SCRUTIN } });
      if (votes) throw new Error(`${votes} votes sont enregistrés : remplacement refusé (effacez d’abord les votes de test).`);
      await prisma.voteEnAttente.deleteMany({ where: { scrutinId: SCRUTIN } });
      await prisma.electeur.deleteMany({ where: { scrutinId: SCRUTIN } });
    }
    await prisma.electeur.createMany({ data: electeurs });
    console.log(`Électeurs importés : ${electeurs.length} (dont ${electeurs.filter((e) => e.emails).length} avec un e-mail).`);
  }
  if (rejets.length) console.log('Lignes ignorées (nom, prénom ou classe manquants) :', rejets.join(', '));
  console.log('Électeurs en base :', await prisma.electeur.count({ where: { scrutinId: SCRUTIN } }));
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
