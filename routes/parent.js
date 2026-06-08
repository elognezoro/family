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

  // Contexte « recherche pour un apprenant » : besoins (discipline + mode) + localisation
  let learner = null;
  let learnerNeeds = [];
  let learnerDisciplines = [];
  let locationMatters = true; // visio pur → la distance n'a pas d'importance
  if (learnerId) {
    learner = await prisma.learner.findUnique({
      where: { id: learnerId },
      include: { needs: true, family: true },
    });
    if (learner && learner.family.ownerUserId === req.session.user.id) {
      learnerNeeds = learner.needs.map((n) => ({ disciplineId: n.disciplineId, mode: n.mode }));
      learnerDisciplines = [...new Set(learnerNeeds.map((n) => n.disciplineId))];
      locationMatters = learnerNeeds.some((n) => n.mode === 'presentiel' || n.mode === 'hybride');
      if (locationMatters && !region) region = learner.commune || '';
      if (!locationMatters) region = ''; // visio uniquement → on n'impose pas la zone
    } else {
      learner = null;
    }
  }

  const coaches = await prisma.coachProfile.findMany({
    where: { statut: 'valide' },
    include: { user: true, disciplines: true, modes: true, niveaux: true },
  });

  // Compatibilité de mode entre un besoin et l'offre du coach
  function coachOffers(c, m) { return c.modes.some((x) => x.mode === m); }
  function satisfiesNeed(c, need) {
    if (!c.disciplines.some((d) => d.disciplineId === need.disciplineId)) return false;
    if (need.mode === 'presentiel') return coachOffers(c, 'presentiel') || coachOffers(c, 'hybride');
    if (need.mode === 'visio') return coachOffers(c, 'visio') || coachOffers(c, 'hybride');
    return coachOffers(c, 'presentiel') || coachOffers(c, 'visio') || coachOffers(c, 'hybride'); // hybride
  }
  // Tarif « à partir de » pertinent (discipline la moins chère parmi celles autorisées)
  function coachPricing(c, allowed) {
    const list = c.disciplines.filter((d) => !allowed || allowed.includes(d.disciplineId));
    if (!list.length) return null;
    let best = null;
    list.forEach((d) => {
      const cyc = (disciplinesData.getDiscipline(d.disciplineId) || {}).cycle;
      const monthly = APP.factureMensuelle(d.tarifMensuel, cyc);
      if (!best || d.tarifMensuel < best.hourly) best = { hourly: d.tarifMensuel, monthly };
    });
    return best;
  }

  // Filtrage
  let filtered = coaches.filter((c) => c.user.status === 'active');
  if (learner && learnerNeeds.length) {
    filtered = filtered.filter((c) => learnerNeeds.some((n) => satisfiesNeed(c, n)));
  } else {
    if (discipline) filtered = filtered.filter((c) => c.disciplines.some((d) => d.disciplineId === discipline));
    if (mode) filtered = filtered.filter((c) => c.modes.some((m) => m.mode === mode));
  }
  if (region) {
    const r = region.toLowerCase();
    filtered = filtered.filter((c) => (c.region || '').toLowerCase().includes(r) || (c.commune || '').toLowerCase().includes(r));
  }

  // Tarifs « à partir de » par coach (visibles par les parents)
  const allowedDisc = learner ? learnerDisciplines : null;
  filtered.forEach((c) => { c.pricing = coachPricing(c, allowedDisc); });

  const markers = filtered
    .filter((c) => c.gpsLat && c.gpsLng)
    .map((c) => ({
      id: c.id, name: c.user.name, lat: c.gpsLat, lng: c.gpsLng,
      note: c.note, certifie: c.certifie, commune: c.commune,
      photo: c.user.photo || null,
      initial: c.user.name.charAt(0).toUpperCase(),
      hourly: c.pricing ? c.pricing.hourly : null,
    }));

  res.render('parent/recherche', {
    title: 'Rechercher un coach — EduWeb',
    bodyClass: 'page-parent',
    coaches: filtered,
    markers,
    filters: { discipline: discipline || '', mode: mode || '', region: region || '' },
    learner,
    learnerNeeds,
    learnerDisciplines,
    locationMatters,
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
    return go(res, '/parent#paiements', 'success', `Paiement simulé de ${APP.money(net)} via ${operateur}.`);
  } catch (e) {
    console.error(e);
    return go(res, '/parent#paiements', 'error', 'Paiement impossible.');
  }
});

// ════════════════ RÉSERVATION D'UN COACH ════════════════

function disciplineOptions(coach) {
  return coach.disciplines.map((d) => {
    const cyc = (disciplinesData.getDiscipline(d.disciplineId) || {}).cycle;
    return {
      id: d.disciplineId,
      label: disciplinesData.disciplineLabel(d.disciplineId),
      hourly: d.tarifMensuel,
      eng: APP.engagementMensuel(cyc),
      monthly: APP.factureMensuelle(d.tarifMensuel, cyc),
    };
  });
}

// ─── Page de réservation (facture pré-remplie) ───
router.get('/reserver', async (req, res) => {
  const family = await getFamily(req.session.user.id);
  const coach = await prisma.coachProfile.findUnique({
    where: { id: req.query.coach || '' },
    include: { user: true, disciplines: true, modes: true },
  });
  if (!coach || coach.statut !== 'valide' || coach.user.status !== 'active') {
    return go(res, '/parent/recherche', 'error', 'Coach introuvable ou non disponible.');
  }
  if (!coach.disciplines.length) {
    return go(res, '/parent/recherche', 'error', 'Ce coach n’a pas encore défini de tarif.');
  }
  if (!family.learners.length) {
    return go(res, '/parent#famille', 'warning', 'Ajoutez d’abord un apprenant avant de réserver.');
  }

  const discOptions = disciplineOptions(coach);
  const coachModes = coach.modes.map((m) => m.mode);

  res.render('parent/reserver', {
    title: 'Réserver un coach — EduWeb',
    bodyClass: 'page-parent',
    coach,
    learners: family.learners,
    discOptions,
    coachModes,
    selected: {
      learner: req.query.learner || family.learners[0].id,
      discipline: req.query.discipline || discOptions[0].id,
      mode: req.query.mode || coachModes[0] || 'presentiel',
    },
    disciplinesData,
    niveauxData,
    APP,
  });
});

// ─── Confirmation : paiement + création de mission ───
router.post('/reserver', async (req, res) => {
  try {
    const family = await getFamily(req.session.user.id);
    const { coach: coachId, learner: learnerId, discipline: disciplineId, mode } = req.body;
    const operateur = req.body.operateur || 'wave';

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId || '' },
      include: { user: true, disciplines: true, modes: true },
    });
    if (!coach || coach.statut !== 'valide') return go(res, '/parent/recherche', 'error', 'Coach indisponible.');

    const learner = family.learners.find((l) => l.id === learnerId);
    if (!learner) return go(res, '/parent/recherche', 'error', 'Apprenant invalide.');

    const cd = coach.disciplines.find((d) => d.disciplineId === disciplineId);
    if (!cd) return go(res, '/parent/recherche', 'error', 'Discipline non proposée par ce coach.');

    const chosenMode = ['presentiel', 'visio', 'hybride'].includes(mode) ? mode : 'presentiel';
    const cyc = (disciplinesData.getDiscipline(disciplineId) || {}).cycle;
    const eng = APP.engagementMensuel(cyc);
    const brut = APP.factureMensuelle(cd.tarifMensuel, cyc); // tarif horaire × engagement

    // Code promo (optionnel)
    let pct = 0;
    const promoCode = (req.body.promoCode || '').trim().toUpperCase() || null;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (promo && promo.actif && (!promo.expiration || promo.expiration > new Date()) &&
          (promo.usageMax == null || promo.usageCount < promo.usageMax)) {
        pct = promo.pct;
        await prisma.promoCode.update({ where: { code: promoCode }, data: { usageCount: { increment: 1 } } });
      } else {
        const back = `/parent/reserver?coach=${coachId}&learner=${learnerId}&discipline=${disciplineId}&mode=${chosenMode}`;
        return go(res, back, 'error', 'Code promo invalide ou expiré.');
      }
    }

    const remise = Math.round((brut * pct) / 100);
    const net = brut - remise;

    await prisma.payment.create({
      data: {
        parentUserId: req.session.user.id,
        brut, pct, remise, net, promoCode, operateur,
        transactionId: 'TX-' + Date.now().toString(36).toUpperCase(),
      },
    });

    await prisma.mission.create({
      data: {
        parentUserId: req.session.user.id,
        coachProfileId: coach.id,
        coachUserId: coach.userId,
        learnerId: learner.id,
        disciplineId,
        mode: chosenMode,
        heuresMois: eng,
        montant: net,
        statut: 'active',
      },
    });

    // Notifie le coach
    await prisma.notification.create({
      data: {
        userId: coach.userId,
        type: 'mission',
        payload: JSON.stringify({ discipline: disciplineId, montant: net }),
      },
    });

    return go(res, '/parent#missions', 'success',
      `Réservation confirmée ! ${APP.money(net)} payés via ${operateur}. ${coach.user.name} a été notifié.`);
  } catch (e) {
    console.error(e);
    return go(res, '/parent/recherche', 'error', 'Réservation impossible.');
  }
});

module.exports = router;
