const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireRole } = require('../middleware/auth');
const niveauxData = require('../data/niveaux');
const disciplinesData = require('../data/disciplines');
const { countryName } = require('../data/countries');
const APP = require('../config/app');

router.use(requireRole('parent'));

// Récupère (ou crée) la famille du parent connecté avec ses apprenants
async function getFamily(userId) {
  let family = await prisma.family.findFirst({
    where: { ownerUserId: userId },
    include: {
      learners: {
        include: { needs: true },
        orderBy: { id: 'asc' },
      },
    },
  });
  if (!family) {
    family = await prisma.family.create({
      data: { ownerUserId: userId, label: 'Ma Famille' },
      include: { learners: { include: { needs: true } } },
    });
  }
  return family;
}

// ─── Tableau de bord ───
router.get('/', async (req, res) => {
  const family = await getFamily(req.session.user.id);
  const missions = await prisma.mission.findMany({
    where: { parentUserId: req.session.user.id },
    include: { learner: true, coach: true },
    orderBy: { createdAt: 'desc' },
  });
  const payments = await prisma.payment.findMany({
    where: { parentUserId: req.session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const totalNeeds = family.learners.reduce((s, l) => s + l.needs.length, 0);
  const totalPaid = payments.reduce((s, p) => s + (p.net || 0), 0);

  res.render('parent/dashboard', {
    title: 'Espace Parent — EduWeb',
    bodyClass: 'page-parent',
    family,
    missions,
    payments,
    stats: { learners: family.learners.length, needs: totalNeeds, missions: missions.length, totalPaid },
    niveauxData,
    disciplinesData,
    countryName,
  });
});

// ─── Ajouter un apprenant (sans nom — protection mineurs) ───
router.post('/learner', async (req, res) => {
  try {
    const family = await getFamily(req.session.user.id);
    const { sexe, age, pays, region, commune, quartier, cycle, niveau, serie } = req.body;
    await prisma.learner.create({
      data: {
        familyId: family.id,
        sexe: sexe || null,
        age: age ? parseInt(age, 10) : null,
        pays: pays || 'ci',
        region: region || null,
        commune: commune || null,
        quartier: quartier || null,
        cycle: cycle || null,
        niveau: niveau || null,
        serie: serie || null,
      },
    });
    return go(res, '/parent#famille', 'success', 'Apprenant ajouté.');
  } catch (e) {
    console.error(e);
    return go(res, '/parent#famille', 'error', 'Impossible d’ajouter l’apprenant.');
  }
});

// ─── Supprimer un apprenant ───
router.post('/learner/:id/delete', async (req, res) => {
  try {
    const learner = await prisma.learner.findUnique({
      where: { id: req.params.id },
      include: { family: true },
    });
    if (!learner || learner.family.ownerUserId !== req.session.user.id) {
      return go(res, '/parent#famille', 'error', 'Apprenant introuvable.');
    }
    await prisma.learner.delete({ where: { id: req.params.id } });
    return go(res, '/parent#famille', 'success', 'Apprenant supprimé.');
  } catch (e) {
    console.error(e);
    return go(res, '/parent#famille', 'error', 'Suppression impossible.');
  }
});

// ─── Déclarer un besoin (discipline) ───
router.post('/learner/:id/need', async (req, res) => {
  try {
    const learner = await prisma.learner.findUnique({
      where: { id: req.params.id },
      include: { family: true },
    });
    if (!learner || learner.family.ownerUserId !== req.session.user.id) {
      return go(res, '/parent#besoins', 'error', 'Apprenant introuvable.');
    }
    const disciplineIds = [].concat(req.body.disciplineId || []);
    const mode = req.body.mode || 'presentiel';
    const heures = req.body.heuresSemaine ? parseInt(req.body.heuresSemaine, 10) : 2;

    for (const disciplineId of disciplineIds.filter(Boolean)) {
      const exists = await prisma.need.findFirst({ where: { learnerId: learner.id, disciplineId } });
      if (!exists) {
        await prisma.need.create({
          data: { learnerId: learner.id, disciplineId, mode, heuresSemaine: heures },
        });
      }
    }
    return go(res, '/parent#besoins', 'success', 'Besoin(s) enregistré(s).');
  } catch (e) {
    console.error(e);
    return go(res, '/parent#besoins', 'error', 'Impossible d’enregistrer le besoin.');
  }
});

// ─── Modifier un besoin (mode + heures) ───
router.post('/need/:id/update', async (req, res) => {
  try {
    const need = await prisma.need.findUnique({
      where: { id: req.params.id },
      include: { learner: { include: { family: true } } },
    });
    if (!need || need.learner.family.ownerUserId !== req.session.user.id) {
      return go(res, '/parent#besoins', 'error', 'Besoin introuvable.');
    }
    const mode = ['presentiel', 'visio', 'hybride'].includes(req.body.mode) ? req.body.mode : need.mode;
    const heures = req.body.heuresSemaine ? parseInt(req.body.heuresSemaine, 10) : need.heuresSemaine;
    await prisma.need.update({
      where: { id: need.id },
      data: { mode, heuresSemaine: isNaN(heures) ? need.heuresSemaine : heures },
    });
    return go(res, '/parent#besoins', 'success', 'Besoin modifié.');
  } catch (e) {
    console.error(e);
    return go(res, '/parent#besoins', 'error', 'Modification impossible.');
  }
});

router.post('/need/:id/delete', async (req, res) => {
  try {
    const need = await prisma.need.findUnique({
      where: { id: req.params.id },
      include: { learner: { include: { family: true } } },
    });
    if (need && need.learner.family.ownerUserId === req.session.user.id) {
      await prisma.need.delete({ where: { id: req.params.id } });
    }
    return go(res, '/parent#besoins', 'success', 'Besoin supprimé.');
  } catch (e) {
    console.error(e);
    return go(res, '/parent#besoins', 'error', 'Suppression impossible.');
  }
});

// ─── Recherche de coachs ───
router.get('/recherche', async (req, res) => {
  let { discipline, mode, region } = req.query;
  const learnerId = req.query.learner;

  // Contexte « recherche pour un apprenant » : pré-filtre par ses besoins + sa localisation
  let learner = null;
  let learnerDisciplines = [];
  if (learnerId) {
    learner = await prisma.learner.findUnique({
      where: { id: learnerId },
      include: { needs: true, family: true },
    });
    if (learner && learner.family.ownerUserId === req.session.user.id) {
      learnerDisciplines = [...new Set(learner.needs.map((n) => n.disciplineId))];
      if (!region) region = learner.commune || '';
    } else {
      learner = null; // pas autorisé / introuvable
    }
  }

  const coaches = await prisma.coachProfile.findMany({
    where: { statut: 'valide' },
    include: { user: true, disciplines: true, modes: true, niveaux: true },
  });

  // Filtrage applicatif
  let filtered = coaches.filter((c) => c.user.status === 'active');
  if (learner && learnerDisciplines.length) {
    // Le coach doit couvrir au moins une discipline du besoin de l'apprenant
    filtered = filtered.filter((c) => c.disciplines.some((d) => learnerDisciplines.includes(d.disciplineId)));
  } else if (discipline) {
    filtered = filtered.filter((c) => c.disciplines.some((d) => d.disciplineId === discipline));
  }
  if (mode) filtered = filtered.filter((c) => c.modes.some((m) => m.mode === mode));
  if (region) filtered = filtered.filter((c) => (c.region || '').toLowerCase().includes(region.toLowerCase()) || (c.commune || '').toLowerCase().includes(region.toLowerCase()));

  const markers = filtered
    .filter((c) => c.gpsLat && c.gpsLng)
    .map((c) => ({
      id: c.id, name: c.user.name, lat: c.gpsLat, lng: c.gpsLng,
      note: c.note, certifie: c.certifie, commune: c.commune,
      photo: c.user.photo || null,
      initial: c.user.name.charAt(0).toUpperCase(),
    }));

  res.render('parent/recherche', {
    title: 'Rechercher un coach — EduWeb',
    bodyClass: 'page-parent',
    coaches: filtered,
    markers,
    filters: { discipline: discipline || '', mode: mode || '', region: region || '' },
    learner,
    learnerDisciplines,
    disciplinesData,
    APP,
  });
});

// ─── Paiement (simulé) ───
router.post('/payment', async (req, res) => {
  try {
    const brut = parseInt(req.body.brut || '0', 10);
    const operateur = req.body.operateur || 'wave';
    const promoCode = (req.body.promoCode || '').trim().toUpperCase() || null;

    let pct = 0;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (promo && promo.actif && (!promo.expiration || promo.expiration > new Date())) {
        if (promo.usageMax == null || promo.usageCount < promo.usageMax) {
          pct = promo.pct;
          await prisma.promoCode.update({
            where: { code: promoCode },
            data: { usageCount: { increment: 1 } },
          });
        }
      } else {
        return go(res, '/parent#paiements', 'error', 'Code promo invalide ou expiré.');
      }
    }

    const remise = Math.round((brut * pct) / 100);
    const net = brut - remise;

    await prisma.payment.create({
      data: {
        parentUserId: req.session.user.id,
        brut,
        pct,
        remise,
        net,
        promoCode,
        operateur,
        transactionId: 'TX-' + Date.now().toString(36).toUpperCase(),
      },
    });
    return go(res, '/parent#paiements', 'success', `Paiement simulé de ${APP.formatFCFA(net)} via ${operateur}.`);
  } catch (e) {
    console.error(e);
    return go(res, '/parent#paiements', 'error', 'Paiement impossible.');
  }
});

module.exports = router;
