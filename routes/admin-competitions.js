// Administration du mode compétition (permission « Éditions ») : création et
// réglage des compétitions (épreuves chronométrées, calendrier), suivi des
// inscrits, classement et export Excel des résultats.
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireRole, requirePerm } = require('../middleware/auth');
const chantsData = require('../data/chants');
const comp = require('../services/competitions');

router.use(requireRole('admin'), requirePerm('loterie'));

const RETOUR = '/admin/competitions';

// Catalogue des épreuves possibles = tous les chants, groupés par discipline/niveau
function catalogueChants() {
  return chantsData.toutes().map((c) => ({ slug: c.slug, titre: c.titre, discipline: c.discipline, niveau: c.niveau, numero: c.numero, total: c.quiz.length }));
}

router.get('/', async (req, res) => {
  let competitions = [];
  try {
    competitions = await prisma.competition.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: { _count: { select: { competiteurs: true } } },
    });
  } catch (e) { console.warn('[admin/competitions] table indisponible :', e.message); }
  const maintenant = new Date();
  res.render('admin/competitions', {
    title: 'Compétitions — Admin EduWeb',
    bodyClass: 'page-admin',
    competitions: competitions.map((c) => ({ ...c, etat: comp.etat(c, maintenant), epreuves: comp.epreuvesDe(c), inscrits: c._count.competiteurs })),
    chants: catalogueChants(),
    comp,
  });
});

// Créer ou modifier (champ caché id)
router.post('/', async (req, res) => {
  const titre = String(req.body.titre || '').trim().slice(0, 120);
  if (titre.length < 3) return go(res, RETOUR, 'error', 'Donnez un titre à la compétition (3 caractères minimum).');
  const description = String(req.body.description || '').trim().slice(0, 600) || null;
  const reglement = String(req.body.reglement || '').trim().slice(0, 2000) || null;
  const debutAt = comp.depuisInputDate(req.body.debutAt);
  const finAt = comp.depuisInputDate(req.body.finAt);
  if (debutAt && finAt && finAt <= debutAt) return go(res, RETOUR, 'error', 'La fin doit être postérieure au début.');
  const statut = ['brouillon', 'ouverte', 'terminee'].includes(req.body.statut) ? req.body.statut : 'brouillon';

  // Épreuves cochées, avec leur durée en minutes
  const coches = [].concat(req.body.epreuve || []).map(String);
  const epreuves = catalogueChants().filter((c) => coches.includes(c.slug)).map((c) => {
    const minutes = parseInt(req.body['duree_' + c.slug], 10);
    const dureeSec = Math.min(comp.DUREE_MAX_SEC, Math.max(comp.DUREE_MIN_SEC, (Number.isInteger(minutes) ? minutes : 10) * 60));
    return { slug: c.slug, dureeSec };
  });
  if (!epreuves.length) return go(res, RETOUR, 'error', 'Choisissez au moins une épreuve.');

  const id = String(req.body.id || '').trim();
  const data = { titre, description, reglement, debutAt, finAt, statut, epreuves };
  try {
    if (id) {
      await prisma.competition.update({ where: { id }, data });
      return go(res, RETOUR, 'success', 'Compétition mise à jour.');
    }
    let slug = comp.slugifier(titre);
    for (let n = 2; await prisma.competition.findUnique({ where: { slug } }); n++) slug = comp.slugifier(titre) + '-' + n;
    const c = await prisma.competition.create({ data: { ...data, slug } });
    return go(res, RETOUR, 'success', `Compétition créée. Adresse publique : /competitions/${c.slug}`);
  } catch (e) {
    console.error('[admin/competitions] enregistrement :', e.message);
    return go(res, RETOUR, 'error', 'Enregistrement impossible : ' + e.message);
  }
});

router.post('/:id/statut', async (req, res) => {
  const statut = ['brouillon', 'ouverte', 'terminee'].includes(req.body.statut) ? req.body.statut : null;
  if (!statut) return go(res, RETOUR, 'error', 'Statut inconnu.');
  await prisma.competition.update({ where: { id: req.params.id }, data: { statut } });
  return go(res, RETOUR, 'success', statut === 'ouverte' ? 'Compétition ouverte.' : statut === 'terminee' ? 'Compétition clôturée : le classement est public.' : 'Compétition repassée en brouillon.');
});

router.post('/:id/supprimer', async (req, res) => {
  await prisma.competition.delete({ where: { id: req.params.id } }); // inscrits et résultats supprimés en cascade
  return go(res, RETOUR, 'success', 'Compétition supprimée (inscrits et résultats compris).');
});

// Détail : inscrits, classement provisoire ou final
router.get('/:id', async (req, res) => {
  const competition = await prisma.competition.findUnique({ where: { id: req.params.id }, include: { competiteurs: { include: { resultats: true }, orderBy: { createdAt: 'asc' } } } });
  if (!competition) return go(res, RETOUR, 'error', 'Compétition introuvable.');
  const epreuves = comp.epreuvesDe(competition);
  res.render('admin/competition-detail', {
    title: `${competition.titre} — Compétitions — Admin EduWeb`,
    bodyClass: 'page-admin',
    competition, epreuves,
    etat: comp.etat(competition),
    totalPossible: comp.totalPossible(competition),
    classement: comp.classer(competition.competiteurs),
    nonVerifies: competition.competiteurs.filter((k) => !k.emailVerifie),
    comp,
  });
});

router.post('/:id/competiteurs/:kid/supprimer', async (req, res) => {
  await prisma.competiteur.deleteMany({ where: { id: req.params.kid, competitionId: req.params.id } });
  return go(res, `${RETOUR}/${req.params.id}`, 'success', 'Compétiteur retiré.');
});

// ─── Export Excel des résultats ───
router.get('/:id/resultats.xlsx', async (req, res) => {
  const competition = await prisma.competition.findUnique({ where: { id: req.params.id }, include: { competiteurs: { include: { resultats: true } } } });
  if (!competition) return go(res, RETOUR, 'error', 'Compétition introuvable.');
  const ExcelJS = require('exceljs'); // chargé à la demande (module volumineux)
  const epreuves = comp.epreuvesDe(competition);
  const totalPossible = comp.totalPossible(competition);
  const classement = comp.classer(competition.competiteurs);
  const dateFr = (d) => (d ? comp.formatDate(d) : '');
  const duree = (ms) => comp.formatDuree(ms);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'EduWeb Family & Coaching';
  wb.created = new Date();

  // Feuille 1 : classement (une ligne par compétiteur validé)
  const f1 = wb.addWorksheet('Classement');
  const colonnes = [
    { header: 'Rang', key: 'rang', width: 7 },
    { header: 'Nom', key: 'nom', width: 18 }, { header: 'Prénoms', key: 'prenoms', width: 22 },
    { header: 'Genre', key: 'genre', width: 7 }, { header: 'Classe', key: 'niveau', width: 9 },
    { header: 'Établissement', key: 'etablissement', width: 26 }, { header: 'Ville', key: 'ville', width: 14 },
    { header: 'Téléphone', key: 'telephone', width: 16 }, { header: 'E-mail', key: 'email', width: 28 },
    { header: 'Points', key: 'score', width: 8 }, { header: 'Sur', key: 'sur', width: 6 },
    { header: 'Temps total', key: 'temps', width: 13 }, { header: 'Temps (s)', key: 'tempsSec', width: 10 },
    { header: 'Épreuves terminées', key: 'nb', width: 12 },
  ];
  epreuves.forEach((e, i) => {
    colonnes.push({ header: `É${i + 1} ${e.chant.titre} — points`, key: `e${i}s`, width: 16 });
    colonnes.push({ header: `É${i + 1} — temps`, key: `e${i}t`, width: 11 });
  });
  colonnes.push({ header: 'Engagement validé le', key: 'engagement', width: 20 }, { header: 'Inscrit le', key: 'inscrit', width: 20 }, { header: 'Terminé le', key: 'termine', width: 20 });
  f1.columns = colonnes;
  classement.forEach((k) => {
    const ligne = {
      rang: k.rang, nom: k.nom, prenoms: k.prenoms, genre: k.genre, niveau: k.niveau,
      etablissement: k.etablissement || '', ville: k.ville || '', telephone: k.telephone, email: k.email,
      score: k.scoreTotal, sur: totalPossible, temps: duree(k.tempsTotalMs), tempsSec: Math.round(k.tempsTotalMs / 1000), nb: `${k.nbEpreuves} / ${epreuves.length}`,
      engagement: dateFr(k.engagementAt), inscrit: dateFr(k.createdAt), termine: dateFr(k.termineAt),
    };
    epreuves.forEach((e, i) => {
      const r = k.resultats.find((x) => x.epreuveSlug === e.slug && x.finAt);
      ligne[`e${i}s`] = r ? `${r.score} / ${r.total}` : '';
      ligne[`e${i}t`] = r ? duree(r.tempsMs) : '';
    });
    f1.addRow(ligne);
  });
  f1.getRow(1).font = { bold: true };
  f1.views = [{ state: 'frozen', ySplit: 1 }];
  f1.autoFilter = { from: 'A1', to: { row: 1, column: colonnes.length } };

  // Feuille 2 : inscriptions non validées (e-mail jamais confirmé)
  const f2 = wb.addWorksheet('Non validés');
  f2.columns = [
    { header: 'Nom', key: 'nom', width: 18 }, { header: 'Prénoms', key: 'prenoms', width: 22 }, { header: 'Classe', key: 'niveau', width: 9 },
    { header: 'Téléphone', key: 'telephone', width: 16 }, { header: 'E-mail (non vérifié)', key: 'email', width: 28 }, { header: 'Inscrit le', key: 'inscrit', width: 20 },
  ];
  competition.competiteurs.filter((k) => !k.emailVerifie).forEach((k) => f2.addRow({ nom: k.nom, prenoms: k.prenoms, niveau: k.niveau, telephone: k.telephone, email: k.email, inscrit: dateFr(k.createdAt) }));
  f2.getRow(1).font = { bold: true };

  // Feuille 3 : la compétition
  const f3 = wb.addWorksheet('Compétition');
  f3.columns = [{ header: 'Champ', key: 'c', width: 22 }, { header: 'Valeur', key: 'v', width: 60 }];
  [['Titre', competition.titre], ['Adresse', `/competitions/${competition.slug}`], ['État', comp.LIBELLES_ETAT[comp.etat(competition)]],
    ['Début', dateFr(competition.debutAt)], ['Fin', dateFr(competition.finAt)], ['Total de points', totalPossible],
    ...epreuves.map((e, i) => [`Épreuve ${i + 1}`, `${e.chant.titre} (${e.chant.discipline} ${e.chant.niveau}) — ${e.total} questions — ${Math.round(e.dureeSec / 60)} min`]),
    ['Classés', classement.length], ['Export', dateFr(new Date())],
  ].forEach(([c, v]) => f3.addRow({ c, v }));
  f3.getRow(1).font = { bold: true };

  const buffer = await wb.xlsx.writeBuffer();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="resultats-${competition.slug}.xlsx"`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(Buffer.from(buffer));
});

module.exports = router;
