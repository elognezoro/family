const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireRole, requirePerm, requireSuperAdmin } = require('../middleware/auth');
const niveauxData = require('../data/niveaux');
const disciplinesData = require('../data/disciplines');
const { countryName, getCountry } = require('../data/countries');
const fxrates = require('../services/fxrates');
const maintenance = require('../services/maintenance');
const email = require('../services/email');
const geo = require('../data/geo-service');
const coachRoutes = require('./coach'); // getProfileData() pour l'édition admin
const APP = require('../config/app');

router.use(requireRole('admin'));

// ─── Tableau de bord ───
router.get('/', async (req, res) => {
  const [
    totalUsers, parents, coaches, admins,
    pendingCoaches, validCoaches, refusedCoaches, certifiedCoaches,
    learners, needs, missions, paymentsAgg, promoCount,
    pendingList, recentUsers, commUnpaidAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'parent' } }),
    prisma.user.count({ where: { role: 'coach' } }),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.coachProfile.count({ where: { statut: 'pending', user: { role: 'coach' } } }),
    prisma.coachProfile.count({ where: { statut: 'valide', user: { role: 'coach' } } }),
    prisma.coachProfile.count({ where: { statut: 'refuse', user: { role: 'coach' } } }),
    prisma.coachProfile.count({ where: { certifie: true, user: { role: 'coach' } } }),
    prisma.learner.count(),
    prisma.need.count(),
    prisma.mission.count(),
    prisma.payment.aggregate({ _sum: { net: true }, _count: true }),
    prisma.promoCode.count(),
    prisma.coachProfile.findMany({
      where: { statut: 'pending', user: { role: 'coach' } },
      include: { user: true, disciplines: true, documents: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.commission.aggregate({ _sum: { amount: true }, _count: true, where: { paid: false } }),
  ]);

  const revenue = paymentsAgg._sum.net || 0;
  const paymentsCount = paymentsAgg._count || 0;
  const commUnpaid = commUnpaidAgg._sum.amount || 0;
  const commUnpaidCount = commUnpaidAgg._count || 0;

  res.render('admin/dashboard', {
    title: 'Espace Admin — EduWeb',
    bodyClass: 'page-admin',
    stats: {
      totalUsers, parents, coaches, admins,
      pendingCoaches, validCoaches, refusedCoaches, certifiedCoaches,
      learners, needs, missions, revenue, paymentsCount, promoCount,
      commUnpaid, commUnpaidCount,
    },
    pendingList,
    recentUsers,
    fxMeta: fxrates.meta(),
    countryName,
    APP,
  });
});

// ════════════════ GESTION DES UTILISATEURS ════════════════

router.get('/users', requirePerm('users'), async (req, res) => {
  const roleFilter = req.query.role;
  const q = (req.query.q || '').trim();
  const where = {};
  if (roleFilter && ['parent', 'coach', 'commercial', 'candidat', 'admin'].includes(roleFilter)) where.role = roleFilter;
  if (q) where.OR = [
    { name: { contains: q } },
    { email: { contains: q } },
  ];

  const users = await prisma.user.findMany({
    where,
    include: { coachProfile: true },
    orderBy: { createdAt: 'desc' },
  });

  res.render('admin/users', {
    title: 'Gestion des utilisateurs — EduWeb',
    bodyClass: 'page-admin',
    users,
    filters: { role: roleFilter || '', q },
    counts: {
      all: await prisma.user.count(),
      parent: await prisma.user.count({ where: { role: 'parent' } }),
      coach: await prisma.user.count({ where: { role: 'coach' } }),
      admin: await prisma.user.count({ where: { role: 'admin' } }),
    },
  });
});

// Helpers de normalisation (cohérent avec l'inscription)
function formatName(nom, prenom) {
  const NOM = (nom || '').trim().toUpperCase();
  const Prenom = (prenom || '')
    .trim().split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
  return [NOM, Prenom].filter(Boolean).join(' ') || NOM || Prenom;
}

// Créer un utilisateur (pré-provisionné, activé directement, « compte tout prêt »)
router.post('/users', requirePerm('users'), async (req, res) => {
  try {
    const { nom, prenom, email: rawEmail, password, gender, role, phone } = req.body;
    const mail = (rawEmail || '').trim().toLowerCase();
    const accountRole = ['parent', 'coach', 'commercial', 'candidat', 'admin'].includes(role) ? role : 'parent';
    const pwd = (password || '').trim();
    const pays = getCountry((req.body.pays || '').toString().trim().toLowerCase()) ? req.body.pays.trim().toLowerCase() : 'ci';
    const sendEmail = !!req.body.sendEmail;

    if (!nom || !mail || !pwd) {
      return go(res, '/admin/users', 'error', 'Nom, email et mot de passe sont obligatoires.');
    }
    if (pwd.length < 6) {
      return go(res, '/admin/users', 'error', 'Le mot de passe doit contenir au moins 6 caractères.');
    }
    const existing = await prisma.user.findUnique({ where: { email: mail } });
    if (existing) return go(res, '/admin/users', 'error', 'Un compte existe déjà avec cet email.');

    const baseData = {
      email: mail,
      passwordHash: await bcrypt.hash(pwd, 10),
      name: formatName(nom, prenom),
      gender: gender || null,
      phone: (phone || '').trim() || null,
      role: accountRole,
      emailVerified: true, // créé par l'admin → directement actif
    };
    let user;
    try {
      user = await prisma.user.create({ data: { ...baseData, pays } });
    } catch (e) {
      // Repli si la colonne « pays » n'est pas encore présente en base.
      if (/pays|Unknown arg|column|does not exist/i.test((e && e.message) || '')) {
        user = await prisma.user.create({ data: baseData });
      } else { throw e; }
    }
    if (accountRole === 'coach') {
      await prisma.coachProfile.create({ data: { userId: user.id, statut: 'pending' } });
    } else if (accountRole === 'parent') {
      await prisma.family.create({ data: { ownerUserId: user.id, label: 'Ma Famille' } });
    }

    const loginUrl = APP.baseUrl(req) + '/auth/login';
    let emailSent = null;
    if (sendEmail) emailSent = await email.sendCredentials(user, pwd, loginUrl);

    return res.render('admin/user-created', {
      title: 'Compte créé — EduWeb',
      bodyClass: 'page-admin',
      newUser: { name: user.name, email: user.email, role: accountRole },
      password: pwd,
      loginUrl,
      emailRequested: sendEmail,
      emailSent,
    });
  } catch (e) {
    console.error(e);
    return go(res, '/admin/users', 'error', 'Création impossible.');
  }
});

// Changer le rôle d'un utilisateur
router.post('/user/:id/role', requirePerm('users'), async (req, res) => {
  try {
    const newRole = req.body.role;
    if (!['parent', 'coach', 'commercial', 'candidat', 'admin'].includes(newRole)) {
      return go(res, '/admin/users', 'error', 'Rôle invalide.');
    }
    if (req.params.id === req.session.user.id) {
      return go(res, '/admin/users', 'error', 'Vous ne pouvez pas modifier votre propre rôle.');
    }
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, include: { coachProfile: true, families: true } });
    if (!user) return go(res, '/admin/users', 'error', 'Utilisateur introuvable.');

    await prisma.user.update({ where: { id: user.id }, data: { role: newRole } });
    if (newRole === 'coach' && !user.coachProfile) {
      await prisma.coachProfile.create({ data: { userId: user.id, statut: 'pending' } });
    }
    if (newRole === 'parent' && user.families.length === 0) {
      await prisma.family.create({ data: { ownerUserId: user.id, label: 'Ma Famille' } });
    }
    return go(res, '/admin/users', 'success', 'Rôle mis à jour.');
  } catch (e) {
    console.error(e);
    return go(res, '/admin/users', 'error', 'Modification impossible.');
  }
});

// Suspendre / réactiver
router.post('/user/:id/toggle', requirePerm('users'), async (req, res) => {
  const redirect = req.body.redirect || '/admin/users';
  if (req.params.id === req.session.user.id) {
    return go(res, redirect, 'error', 'Vous ne pouvez pas suspendre votre propre compte.');
  }
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { status: user.status === 'active' ? 'suspended' : 'active' },
    });
  }
  return go(res, redirect, 'success', 'Statut utilisateur mis à jour.');
});

// Supprime un utilisateur et TOUTES ses données liées (messages, commissions, missions…)
async function deleteUserCascade(userId) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, include: { coachProfile: true, families: true } });
    if (!user) return;
    await tx.message.deleteMany({ where: { OR: [{ senderId: userId }, { recipientId: userId }] } });
    await tx.commission.deleteMany({ where: { referrerUserId: userId } });
    await tx.user.updateMany({ where: { referredById: userId }, data: { referredById: null } }); // détache les filleuls
    await tx.notification.deleteMany({ where: { userId } });
    await tx.mission.deleteMany({ where: { OR: [{ parentUserId: userId }, { coachUserId: userId }] } });
    await tx.payment.deleteMany({ where: { parentUserId: userId } });
    // Progression Fonction Publique (tables autonomes, absentes avant migration)
    try { await tx.fpMastery.deleteMany({ where: { userId } }); } catch (e) { /* pas encore migrée */ }
    try { await tx.fpGamif.deleteMany({ where: { userId } }); } catch (e) { /* pas encore migrée */ }
    // Loterie : l'historique des lauréats est conservé (anonyme) ; les codes
    // enregistrés par le compte supprimé redeviennent libres s'ils n'ont pas gagné
    try {
      const gagnes = (await tx.loterieLaureat.findMany({ where: { userId }, select: { codeId: true } })).map((l) => l.codeId);
      await tx.loterieCode.updateMany({
        where: { userId, id: { notIn: gagnes } },
        data: { userId: null, statut: 'libre', enregistreAt: null },
      });
    } catch (e) { /* pas encore migrée */ }
    if (user.coachProfile) {
      await tx.avis.deleteMany({ where: { coachProfileId: user.coachProfile.id } });
      await tx.carnetEntry.deleteMany({ where: { coachProfileId: user.coachProfile.id } });
      await tx.mission.deleteMany({ where: { coachProfileId: user.coachProfile.id } });
      await tx.coachProfile.delete({ where: { id: user.coachProfile.id } });
    }
    // Familles → apprenants (cascade) ; on purge d'abord besoins/carnets/missions des apprenants
    for (const fam of user.families) {
      const learners = await tx.learner.findMany({ where: { familyId: fam.id } });
      for (const l of learners) {
        await tx.mission.deleteMany({ where: { learnerId: l.id } });
        await tx.carnetEntry.deleteMany({ where: { learnerId: l.id } });
        await tx.need.deleteMany({ where: { learnerId: l.id } });
      }
      await tx.learner.deleteMany({ where: { familyId: fam.id } });
    }
    await tx.family.deleteMany({ where: { ownerUserId: userId } });
    await tx.user.delete({ where: { id: userId } });
  });
}

// Supprimer un utilisateur (et ses données liées)
router.post('/user/:id/delete', requirePerm('users'), async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) {
      return go(res, '/admin/users', 'error', 'Vous ne pouvez pas supprimer votre propre compte.');
    }
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return go(res, '/admin/users', 'error', 'Utilisateur introuvable.');
    await deleteUserCascade(user.id);
    return go(res, '/admin/users', 'success', `Utilisateur « ${user.name} » supprimé.`);
  } catch (e) {
    console.error(e);
    return go(res, '/admin/users', 'error', 'Suppression impossible (données liées).');
  }
});

// ─── Actions par lot (sélection multiple) ───
router.post('/users/bulk', requirePerm('users'), async (req, res) => {
  const redirect = req.body.redirect || '/admin/users';
  const action = req.body.action;
  let ids = [].concat(req.body.ids || []).filter(Boolean);
  ids = ids.filter((id) => id !== req.session.user.id); // jamais soi-même
  if (!ids.length) return go(res, redirect, 'warning', 'Aucun utilisateur sélectionné.');
  try {
    if (action === 'activate') {
      const r = await prisma.user.updateMany({ where: { id: { in: ids } }, data: { status: 'active' } });
      return go(res, redirect, 'success', `${r.count} compte(s) réactivé(s).`);
    }
    if (action === 'suspend') {
      const r = await prisma.user.updateMany({ where: { id: { in: ids } }, data: { status: 'suspended' } });
      return go(res, redirect, 'success', `${r.count} compte(s) suspendu(s).`);
    }
    if (action === 'delete') {
      let n = 0;
      for (const id of ids) {
        try { await deleteUserCascade(id); n += 1; } catch (e) { console.error('[bulk delete]', id, e.message); }
      }
      return go(res, redirect, 'success', `${n} compte(s) supprimé(s).`);
    }
    return go(res, redirect, 'error', 'Action inconnue.');
  } catch (e) {
    console.error(e);
    return go(res, redirect, 'error', 'Action par lot impossible.');
  }
});

// ════════════════ MON COMPTE / SÉCURITÉ ════════════════

router.get('/account', async (req, res) => {
  const account = await prisma.user.findUnique({ where: { id: req.session.user.id } });
  res.render('admin/account', {
    title: 'Mon compte — EduWeb',
    bodyClass: 'page-admin',
    account,
  });
});

router.post('/account/password', async (req, res) => {
  try {
    const { current, password, confirm } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    if (!user || !(await bcrypt.compare(current || '', user.passwordHash))) {
      return go(res, '/admin/account', 'error', 'Mot de passe actuel incorrect.');
    }
    if (!password || password.length < 6) {
      return go(res, '/admin/account', 'error', 'Le nouveau mot de passe doit contenir au moins 6 caractères.');
    }
    if (password !== confirm) {
      return go(res, '/admin/account', 'error', 'Les deux nouveaux mots de passe ne correspondent pas.');
    }
    if (await bcrypt.compare(password, user.passwordHash)) {
      return go(res, '/admin/account', 'warning', 'Le nouveau mot de passe doit être différent de l’actuel.');
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(password, 10) },
    });
    return go(res, '/admin/account', 'success', 'Mot de passe mis à jour avec succès.');
  } catch (e) {
    console.error(e);
    return go(res, '/admin/account', 'error', 'Modification impossible.');
  }
});

// ════════════════ RECHERCHE & ÉDITION DES COACHS ════════════════

// Recherche d'un coach (par nom ou email) pour consulter / modifier son profil.
router.get('/coaches', requirePerm('coaches'), async (req, res) => {
  const q = (req.query.q || '').trim();
  const where = { role: 'coach' };
  if (q) where.OR = [{ name: { contains: q } }, { email: { contains: q } }];
  const coaches = await prisma.user.findMany({
    where,
    include: { coachProfile: true },
    orderBy: { createdAt: 'desc' },
    take: q ? 100 : 50,
  });
  res.render('admin/coaches', {
    title: 'Coachs — EduWeb',
    bodyClass: 'page-admin',
    coaches,
    q,
  });
});

// Édition du profil d'un coach par l'admin (réutilise la vue de config coach).
router.get('/coach/:userId/edit', requirePerm('coaches'), async (req, res) => {
  const data = await coachRoutes.getProfileData(req.params.userId);
  if (!data) return go(res, '/admin/coaches', 'error', 'Coach introuvable.');
  res.render('coach/profil', {
    title: 'Modifier le profil coach — EduWeb',
    bodyClass: 'page-coach page-admin-edit',
    profile: data.profile,
    currency: data.currency,
    tarifMoyen: data.tarifMoyen,
    nameParts: data.nameParts,
    suggestions: data.suggestions,
    completion: data.completion,
    niveauxData,
    disciplinesData,
    countryName,
    APP,
    targetUserId: req.params.userId,
    adminEdit: true,
  });
});

// ════════════════ EXAMEN PROFIL COACH ════════════════

router.get('/coach-profile/:id', requirePerm('coaches'), async (req, res) => {
  const profile = await prisma.coachProfile.findUnique({
    where: { id: req.params.id },
    include: { user: true, niveaux: true, disciplines: true, modes: true, documents: true, avis: true },
  });
  if (!profile) return go(res, '/admin', 'error', 'Profil introuvable.');

  res.render('admin/coach-profile', {
    title: 'Examen profil coach — EduWeb',
    bodyClass: 'page-admin',
    profile,
    niveauxData,
    disciplinesData,
    countryName,
    APP,
  });
});

router.post('/coach-profile/:id/valider', requirePerm('coaches'), async (req, res) => {
  await prisma.coachProfile.update({
    where: { id: req.params.id },
    data: { statut: 'valide', motifRefus: null },
  });
  return go(res, '/admin', 'success', 'Profil coach validé.');
});

router.post('/coach-profile/:id/refuser', requirePerm('coaches'), async (req, res) => {
  const motif = (req.body.motif || '').trim();
  if (motif.length < 10) {
    return go(res, `/admin/coach-profile/${req.params.id}`, 'error', 'Le motif doit contenir au moins 10 caractères.');
  }
  await prisma.coachProfile.update({
    where: { id: req.params.id },
    data: { statut: 'refuse', motifRefus: motif },
  });
  return go(res, '/admin', 'success', 'Profil coach refusé.');
});

// Refus groupé : plusieurs coachs en attente refusés d'un coup, au même motif.
router.post('/coaches/bulk-refuse', requirePerm('coaches'), async (req, res) => {
  const ids = [].concat(req.body.ids || []).filter(Boolean);
  const motif = (req.body.motif || '').trim();
  if (!ids.length) return go(res, '/admin#pending', 'error', 'Aucun coach sélectionné.');
  if (motif.length < 10) return go(res, '/admin#pending', 'error', 'Le motif doit contenir au moins 10 caractères.');
  const r = await prisma.coachProfile.updateMany({
    where: { id: { in: ids }, statut: 'pending' }, // garde-fou : uniquement les profils en attente
    data: { statut: 'refuse', motifRefus: motif },
  });
  return go(res, '/admin#pending', 'success', r.count + ' coach(s) refusé(s) avec le même motif.');
});

router.post('/coach-profile/:id/certifier', requirePerm('coaches'), async (req, res) => {
  const profile = await prisma.coachProfile.findUnique({ where: { id: req.params.id } });
  await prisma.coachProfile.update({
    where: { id: req.params.id },
    data: { certifie: !profile.certifie },
  });
  return go(res, `/admin/coach-profile/${req.params.id}`, 'success', profile.certifie ? 'Certification retirée.' : 'Coach certifié.');
});

// ════════════════ COMMISSIONS DE PARRAINAGE (finance) ════════════════

// Récapitulatif des commissions à payer, regroupées par parrain.
router.get('/commissions', requirePerm('finance'), async (req, res) => {
  const filter = ['unpaid', 'paid', 'all'].includes(req.query.statut) ? req.query.statut : 'unpaid';
  const where = filter === 'unpaid' ? { paid: false } : filter === 'paid' ? { paid: true } : {};

  const commissions = await prisma.commission.findMany({ where, orderBy: { createdAt: 'desc' } });

  // Noms des parrains + filleuls concernés
  const userIds = [...new Set(commissions.flatMap((c) => [c.referrerUserId, c.refereeUserId]))];
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true, role: true } })
    : [];
  const uById = {};
  users.forEach((u) => { uById[u.id] = u; });

  // Regroupement par parrain
  const groupMap = {};
  for (const c of commissions) {
    const g = groupMap[c.referrerUserId] || (groupMap[c.referrerUserId] = {
      referrer: uById[c.referrerUserId] || { id: c.referrerUserId, name: '—', email: '', role: '' },
      items: [], total: 0, totalUnpaid: 0, totalPaid: 0,
    });
    g.items.push(c);
    g.total += c.amount;
    if (c.paid) g.totalPaid += c.amount; else g.totalUnpaid += c.amount;
  }
  const groups = Object.values(groupMap).sort((a, b) => b.totalUnpaid - a.totalUnpaid || b.total - a.total);

  // Totaux globaux (indépendants du filtre)
  const [aggUnpaid, aggPaid] = await Promise.all([
    prisma.commission.aggregate({ _sum: { amount: true }, _count: true, where: { paid: false } }),
    prisma.commission.aggregate({ _sum: { amount: true }, _count: true, where: { paid: true } }),
  ]);

  res.render('admin/commissions', {
    title: 'Commissions de parrainage — EduWeb',
    bodyClass: 'page-admin',
    groups,
    uById,
    filter,
    totals: {
      unpaid: aggUnpaid._sum.amount || 0, unpaidCount: aggUnpaid._count || 0,
      paid: aggPaid._sum.amount || 0, paidCount: aggPaid._count || 0,
    },
    APP,
  });
});

// Marquer une commission comme payée
router.post('/commissions/:id/pay', requirePerm('finance'), async (req, res) => {
  await prisma.commission.update({ where: { id: req.params.id }, data: { paid: true, paidAt: new Date() } });
  return go(res, '/admin/commissions', 'success', 'Commission marquée comme payée.');
});

// Annuler le paiement d'une commission (repasse « à payer »)
router.post('/commissions/:id/unpay', requirePerm('finance'), async (req, res) => {
  await prisma.commission.update({ where: { id: req.params.id }, data: { paid: false, paidAt: null } });
  return go(res, '/admin/commissions?statut=paid', 'info', 'Commission repassée en « à payer ».');
});

// Régler toutes les commissions en attente d'un parrain
router.post('/commissions/pay-referrer', requirePerm('finance'), async (req, res) => {
  const referrerUserId = req.body.referrerUserId;
  if (!referrerUserId) return go(res, '/admin/commissions', 'error', 'Parrain non spécifié.');
  const r = await prisma.commission.updateMany({
    where: { referrerUserId, paid: false },
    data: { paid: true, paidAt: new Date() },
  });
  return go(res, '/admin/commissions', 'success', `${r.count} commission(s) marquée(s) comme payée(s).`);
});

// ════════════════ PARAMÈTRES PLATEFORME (super-admin) ════════════════

router.get('/settings', requireSuperAdmin, async (req, res) => {
  const settings = await maintenance.getSettings();
  const eco = await require('../services/eco-coaching').rafraichir(true);
  res.render('admin/settings', {
    title: 'Paramètres — EduWeb',
    bodyClass: 'page-admin',
    settings,
    eco,
    mail: email.config(),
  });
});

// Diagnostic : envoie un e-mail de test à l'adresse du super-admin et affiche le résultat exact.
router.post('/settings/test-email', requireSuperAdmin, async (req, res) => {
  const to = req.session.user.email;
  const r = await email.sendTest(to);
  if (r.ok) {
    return go(res, '/admin/settings', 'success',
      'E-mail de test envoyé à ' + to + ' (expéditeur : ' + r.from + '). Vérifiez votre boîte de réception et le dossier spam.');
  }
  if (!r.configured) {
    return go(res, '/admin/settings', 'warning', r.error);
  }
  return go(res, '/admin/settings', 'error',
    'Resend a refusé l’envoi (expéditeur : ' + r.from + ') — ' + r.error);
});

router.post('/settings', requireSuperAdmin, async (req, res) => {
  const saved = await maintenance.saveSettings({ purgeDays: req.body.purgeDays, purgeHour: req.body.purgeHour });
  // Modèle économique du coaching (part coach / commission parrainage missions)
  let msgEco = '';
  if (req.body.coachSharePct !== undefined || req.body.coachingReferralPct !== undefined) {
    try {
      const eco = await require('../services/eco-coaching').enregistrer({
        coachSharePct: req.body.coachSharePct,
        coachingReferralPct: req.body.coachingReferralPct,
      });
      msgEco = ` Coaching : ${eco.coachSharePct} % au coach (plateforme ${100 - eco.coachSharePct} %), parrainage ${eco.coachingReferralPct} % de la part plateforme — pour les missions futures uniquement.`;
    } catch (e) {
      msgEco = ' ⚠️ Modèle coaching non enregistré : appliquez d’abord la migration (node scripts/migrate-eco-coaching.js).';
    }
  }
  return go(res, '/admin/settings', 'success',
    `Paramètres enregistrés : pièces jointes supprimées après ${saved.purgeDays} jours, purge à ${saved.purgeHour}h UTC.` + msgEco);
});

router.post('/settings/purge-now', requireSuperAdmin, async (req, res) => {
  try {
    const r = await maintenance.runScheduledPurge(true);
    return go(res, '/admin/settings', 'success', `Purge exécutée : ${r.purged || 0} pièce(s) jointe(s) supprimée(s).`);
  } catch (e) {
    console.error('[purge-now]', e.message);
    return go(res, '/admin/settings', 'error', 'Purge impossible.');
  }
});

// ════════════════ GESTION DES ADMINISTRATEURS (super-admin) ════════════════

const VALID_PERMS = APP.adminPermissions.map((p) => p.key);
function cleanPerms(body) {
  const raw = [].concat(body.perm || []);
  return raw.filter((p) => VALID_PERMS.includes(p)).join(',');
}

router.get('/admins', requireSuperAdmin, async (req, res) => {
  const admins = await prisma.user.findMany({
    where: { role: 'admin' },
    orderBy: [{ isSuperAdmin: 'desc' }, { name: 'asc' }],
  });
  res.render('admin/admins', {
    title: 'Administrateurs — EduWeb',
    bodyClass: 'page-admin',
    admins,
  });
});

// Nommer un administrateur (à partir d'un email existant) avec des permissions
router.post('/admins/nominate', requireSuperAdmin, async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const permissions = cleanPerms(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return go(res, '/admin/admins', 'error', 'Aucun utilisateur avec cet email.');
    if (user.isSuperAdmin) return go(res, '/admin/admins', 'warning', 'Cet utilisateur est déjà super-administrateur.');
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin', permissions, emailVerified: true },
    });
    return go(res, '/admin/admins', 'success', `${user.name} est désormais administrateur.`);
  } catch (e) {
    console.error(e);
    return go(res, '/admin/admins', 'error', 'Nomination impossible.');
  }
});

// Modifier les permissions d'un admin
router.post('/admins/:id/perms', requireSuperAdmin, async (req, res) => {
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target || target.role !== 'admin') return go(res, '/admin/admins', 'error', 'Administrateur introuvable.');
  if (target.isSuperAdmin) return go(res, '/admin/admins', 'warning', 'Les permissions du super-administrateur ne se modifient pas.');
  await prisma.user.update({ where: { id: target.id }, data: { permissions: cleanPerms(req.body) } });
  return go(res, '/admin/admins', 'success', 'Permissions mises à jour.');
});

// Révoquer un admin (redevient parent)
router.post('/admins/:id/revoke', requireSuperAdmin, async (req, res) => {
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return go(res, '/admin/admins', 'error', 'Administrateur introuvable.');
  if (target.isSuperAdmin) return go(res, '/admin/admins', 'error', 'Impossible de révoquer un super-administrateur.');
  if (target.id === req.session.user.id) return go(res, '/admin/admins', 'error', 'Vous ne pouvez pas vous révoquer vous-même.');
  await prisma.user.update({ where: { id: target.id }, data: { role: 'parent', permissions: '' } });
  // S'assure qu'il a une famille (espace parent)
  const fam = await prisma.family.findFirst({ where: { ownerUserId: target.id } });
  if (!fam) await prisma.family.create({ data: { ownerUserId: target.id, label: 'Ma Famille' } });
  return go(res, '/admin/admins', 'success', `${target.name} n'est plus administrateur.`);
});

// ─── Formation : formules tarifaires + validation des accès ───
router.get('/formation', requirePerm('formation'), async (req, res) => {
  let enrollments = [];
  let offres = [];
  let statsTests = { tentatives: 0, terminees: 0 };
  try {
    enrollments = await prisma.formationEnrollment.findMany({
      include: { user: true, approvedBy: true, offre: true },
      orderBy: { createdAt: 'desc' },
    });
    offres = await prisma.formationOffre.findMany({ orderBy: [{ ordre: 'asc' }, { prix: 'asc' }] });
    statsTests.tentatives = await prisma.quizAttempt.count();
    statsTests.terminees = await prisma.quizAttempt.count({ where: { statut: 'termine' } });
  } catch (e) {
    console.warn('[admin/formation] tables indisponibles :', e.message);
  }
  res.render('admin/formation', {
    title: 'Formation — inscriptions — Admin EduWeb',
    bodyClass: 'page-admin',
    enrollments,
    offres,
    statsTests,
    formationMeta: require('../data/formation/meta'),
  });
});

// Créer / modifier une formule (tarif, durée, quota — fixés par l'admin)
router.post('/formation/offres', requirePerm('formation'), async (req, res) => {
  const { id, nom, description, prix, dureeJours, quotaTentatives, ordre } = req.body;
  const nomOk = (nom || '').trim();
  const prixOk = parseInt(prix, 10);
  if (!nomOk || !(prixOk >= 0)) return go(res, '/admin/formation', 'error', 'Nom et prix (FCFA) sont obligatoires.');
  const data = {
    nom: nomOk,
    description: (description || '').trim() || null,
    prix: prixOk,
    dureeJours: dureeJours ? Math.max(1, parseInt(dureeJours, 10) || 0) : null,
    quotaTentatives: quotaTentatives ? Math.max(1, parseInt(quotaTentatives, 10) || 0) : null,
    ordre: parseInt(ordre, 10) || 0,
  };
  if (id) await prisma.formationOffre.update({ where: { id }, data });
  else await prisma.formationOffre.create({ data });
  return go(res, '/admin/formation', 'success', `Formule « ${nomOk} » enregistrée.`);
});

router.post('/formation/offres/:id/toggle', requirePerm('formation'), async (req, res) => {
  const offre = await prisma.formationOffre.findUnique({ where: { id: req.params.id } });
  if (!offre) return go(res, '/admin/formation', 'error', 'Formule introuvable.');
  await prisma.formationOffre.update({ where: { id: offre.id }, data: { actif: !offre.actif } });
  return go(res, '/admin/formation', 'success', `Formule « ${offre.nom} » ${offre.actif ? 'désactivée' : 'activée'}.`);
});

// Autoriser directement un utilisateur (sans paiement) par son e-mail
router.post('/formation/autoriser', requirePerm('formation'), async (req, res) => {
  const emailCible = (req.body.email || '').trim().toLowerCase();
  const dureeJours = req.body.dureeJours ? Math.max(1, parseInt(req.body.dureeJours, 10) || 0) : null;
  const cible = await prisma.user.findUnique({ where: { email: emailCible } });
  if (!cible) return go(res, '/admin/formation', 'error', 'Aucun utilisateur avec cet e-mail.');
  const data = {
    statut: 'approuve',
    accessType: 'autorise',
    offreId: null,
    montantAttendu: null,
    operateur: null,
    refTransaction: null,
    promoCode: null,
    motifRefus: null,
    approvedById: req.session.user.id,
    approvedAt: new Date(),
    expiresAt: dureeJours ? new Date(Date.now() + dureeJours * 24 * 3600 * 1000) : null,
  };
  const existing = await prisma.formationEnrollment.findUnique({ where: { userId: cible.id } });
  if (existing) await prisma.formationEnrollment.update({ where: { id: existing.id }, data });
  else await prisma.formationEnrollment.create({ data: Object.assign({ userId: cible.id, niveau: 'bepc' }, data) });
  await prisma.notification.create({ data: { userId: cible.id, type: 'formation_validee', payload: null } }).catch(() => {});
  email.sendFormationApproved(cible).catch(() => {});
  return go(res, '/admin/formation', 'success', `Accès Formation accordé à ${cible.name}${dureeJours ? ' pour ' + dureeJours + ' jours' : ''}.`);
});

router.post('/formation/:id/valider', requirePerm('formation'), async (req, res) => {
  const enr = await prisma.formationEnrollment.findUnique({ where: { id: req.params.id }, include: { user: true, offre: true } });
  if (!enr) return go(res, '/admin/formation', 'error', 'Demande introuvable.');

  // Paiement déclaré + moteur financier disponible → transaction complète :
  // activation, place promo confirmée, RÉTROCESSION du parrain (plafonnée), ledger.
  if (enr.accessType === 'paye' && enr.subscriptionId) {
    try {
      const retrocession = require('../services/finance/retrocession');
      const r = await retrocession.confirmerPaiement(enr.id, req.session.user.id);
      await prisma.notification.create({ data: { userId: enr.userId, type: 'formation_validee', payload: null } }).catch(() => {});
      email.sendFormationApproved(enr.user).catch(() => {});
      if (r.retro && r.retro.montant > 0) {
        // Prévenir le parrain de son gain (notification + e-mail)
        prisma.notification.create({ data: { userId: r.retro.parrainId, type: 'retrocession_gagnee', payload: JSON.stringify({ montant: r.retro.montant }) } }).catch(() => {});
        prisma.user.findUnique({ where: { id: r.retro.parrainId } })
          .then((p) => p && email.sendRetrocession(p, r.retro.montant, enr.user.name).catch(() => {}))
          .catch(() => {});
      }
      const msgRetro = r.retro && r.retro.montant > 0
        ? ` Rétrocession de ${APP.formatFCFA(r.retro.montant)} créditée au parrain.`
        : (r.retro && r.retro.parrainId && r.retro.plafond ? ' Plafond personnel du parrain atteint : pas de rétrocession.' : '');
      return go(res, '/admin/formation', 'success', `Paiement confirmé : accès de ${enr.user.name} activé${r.expiresAt ? ' jusqu’au ' + new Date(r.expiresAt).toLocaleDateString('fr-FR') : ''}.${msgRetro}`);
    } catch (e) {
      console.error('[admin/formation] confirmation échouée :', e.message);
      return go(res, '/admin/formation', 'error', 'Confirmation impossible : ' + e.message);
    }
  }

  // Autorisation gratuite (ou moteur non migré) : activation simple
  const expiresAt = enr.offre && enr.offre.dureeJours
    ? new Date(Date.now() + enr.offre.dureeJours * 24 * 3600 * 1000)
    : null;
  await prisma.formationEnrollment.update({
    where: { id: enr.id },
    data: { statut: 'approuve', motifRefus: null, approvedById: req.session.user.id, approvedAt: new Date(), expiresAt },
  });
  await prisma.notification.create({
    data: { userId: enr.userId, type: 'formation_validee', payload: null },
  }).catch(() => {});
  email.sendFormationApproved(enr.user).catch(() => {});
  return go(res, '/admin/formation', 'success', `Accès de ${enr.user.name} activé${expiresAt ? ' jusqu’au ' + expiresAt.toLocaleDateString('fr-FR') : ''}.`);
});

router.post('/formation/:id/refuser', requirePerm('formation'), async (req, res) => {
  const enr = await prisma.formationEnrollment.findUnique({ where: { id: req.params.id }, include: { user: true } });
  if (!enr) return go(res, '/admin/formation', 'error', 'Demande introuvable.');
  const motif = (req.body.motif || '').trim() || null;
  // Réclamation CONDITIONNELLE : on ne refuse qu'une demande en attente — une
  // demande déjà validée se révoque par « Rembourser » (contre-écritures), pas ici.
  const claim = await prisma.formationEnrollment.updateMany({
    where: { id: enr.id, statut: { in: ['pending', 'refuse'] } },
    data: { statut: 'refuse', motifRefus: motif, approvedById: req.session.user.id, approvedAt: new Date() },
  });
  if (!claim.count) {
    return go(res, '/admin/formation', 'error', 'Cette demande a déjà été validée : pour révoquer l’accès, utilisez « Rembourser » dans Finance & parrainage (les rétrocessions seront contre-passées).');
  }
  // Libérer la place promotionnelle éventuellement réservée + clore l'abonnement en attente
  try {
    const parrainageFin = require('../services/finance/parrainage');
    await parrainageFin.libererSlot(enr.userId);
    if (enr.subscriptionId) {
      await prisma.subscription.updateMany({ where: { id: enr.subscriptionId, statut: 'pending' }, data: { statut: 'cancelled' } });
    }
  } catch (e) { /* moteur non migré */ }
  email.sendFormationRejected(enr.user, motif).catch(() => {});
  return go(res, '/admin/formation', 'success', `Demande de ${enr.user.name} refusée.`);
});

// ═══════════ Finance & parrainage : pilotage de rentabilité (§20-§30) ═══════════
const rentabilite = require('../services/finance/rentabilite');
const politiqueFin = require('../services/finance/politique');
const payoutSvc = require('../services/finance/payout');
const antifraudeSvc = require('../services/finance/antifraude');
const retrocessionSvc = require('../services/finance/retrocession');
const reglesFin = require('../services/finance/regles');

router.get('/finance', requirePerm('finance'), async (req, res) => {
  let donnees = { dispo: false };
  try {
    const { kpis, alertes } = await rentabilite.alertes().then((a) => ({ kpis: a.kpis, alertes: a.alertes }));
    const [policy, snapshots, payoutsAttente, fraudeAttente, subsRecentes, scenarios] = await Promise.all([
      politiqueFin.active(),
      prisma.profitabilitySnapshot.findMany({ orderBy: { jour: 'asc' }, take: 90 }),
      prisma.payout.findMany({ where: { statut: { in: ['requested', 'processing'] } }, include: { user: true }, orderBy: { requestedAt: 'asc' } }),
      prisma.fraudFlag.findMany({ where: { statut: 'REVIEW' }, include: { user: true }, orderBy: { createdAt: 'asc' } }),
      prisma.subscription.findMany({ include: { user: true, plan: true }, orderBy: { createdAt: 'desc' }, take: 15 }),
      prisma.profitabilityScenario.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 }),
    ]);
    donnees = { dispo: true, kpis, alertes, policy, snapshots, payoutsAttente, fraudeAttente, subsRecentes, scenarios };
  } catch (e) {
    console.warn('[admin/finance] moteur indisponible :', e.message);
  }
  res.render('admin/finance', {
    title: 'Finance & parrainage — Admin EduWeb',
    bodyClass: 'page-admin',
    d: donnees,
    scenarioDefaut: reglesFin.SCENARIO_10000,
  });
});

// Nouvelle version de la politique commerciale (historisée — §2)
router.post('/finance/politique', requirePerm('finance'), async (req, res) => {
  try {
    const p = await politiqueFin.nouvelleVersion(req.body, req.session.user.id);
    return go(res, '/admin/finance', 'success', `Politique commerciale v${p.version} activée (les transactions passées sont inchangées).`);
  } catch (e) {
    return go(res, '/admin/finance', 'error', 'Enregistrement impossible : ' + e.message);
  }
});

// Règlement d'un versement (succès avec référence, ou échec avec motif)
router.post('/finance/payout/:id/regler', requirePerm('finance'), async (req, res) => {
  try {
    const succes = req.body.action === 'paye';
    await payoutSvc.regler(req.params.id, req.session.user.id, {
      succes,
      reference: req.body.reference,
      motifEchec: req.body.motif,
    });
    return go(res, '/admin/finance', 'success', succes ? 'Versement marqué comme effectué.' : 'Versement marqué en échec — montant recrédité au parrain.');
  } catch (e) {
    return go(res, '/admin/finance', 'error', 'Traitement impossible : ' + e.message);
  }
});

// Décision antifraude (§31) — jamais automatique
router.post('/finance/fraude/:id/decision', requirePerm('finance'), async (req, res) => {
  try {
    await antifraudeSvc.decider(req.params.id, req.session.user.id, req.body.decision);
    return go(res, '/admin/finance', 'success', 'Décision enregistrée.');
  } catch (e) {
    return go(res, '/admin/finance', 'error', 'Décision impossible : ' + e.message);
  }
});

// Remboursement d'un abonnement (§16) — contre-écritures, jamais d'effacement
router.post('/finance/rembourser/:subscriptionId', requirePerm('finance'), async (req, res) => {
  try {
    const r = await retrocessionSvc.rembourser(req.params.subscriptionId, req.session.user.id, (req.body.motif || '').trim());
    return go(res, '/admin/finance', 'success', 'Abonnement remboursé.' + (r.reversal ? ` Contre-écriture de ${APP.formatFCFA(r.reversal)} appliquée au parrain.` : ''));
  } catch (e) {
    return go(res, '/admin/finance', 'error', 'Remboursement impossible : ' + e.message);
  }
});

// Simulateur (§26-§28) — calcul par les fonctions pures, enregistrement facultatif
router.post('/finance/simuler', requirePerm('finance'), async (req, res) => {
  const params = {
    nbAbonnes: parseInt(req.body.nbAbonnes, 10) || 0,
    prixFacial: parseInt(req.body.prixFacial, 10) || 0,
    pctIssusParrainage: parseFloat(req.body.pctIssusParrainage) || 0,
    tauxReduction: parseFloat(req.body.tauxReduction) || 0,
    nbFilleulsReduits: parseInt(req.body.nbFilleulsReduits, 10) || 0,
    tauxRetrocession: parseFloat(req.body.tauxRetrocession) || 0,
    plancher: parseInt(req.body.plancher, 10) || 0,
    retrocessionsEstimees: req.body.retrocessionsEstimees ? parseInt(req.body.retrocessionsEstimees, 10) : null,
    fraisPaiementPct: parseFloat(req.body.fraisPaiementPct) || 0,
    commissionsExternes: parseInt(req.body.commissionsExternes, 10) || 0,
    coutsVariables: parseInt(req.body.coutsVariables, 10) || 0,
    chargesFixes: parseInt(req.body.chargesFixes, 10) || 0,
  };
  const resultats = reglesFin.simuler(params);
  if (req.body.enregistrer === '1' && (req.body.nomScenario || '').trim()) {
    await prisma.profitabilityScenario.create({
      data: {
        nom: req.body.nomScenario.trim(),
        params: JSON.stringify(params),
        resultats: JSON.stringify(resultats),
        createdById: req.session.user.id,
      },
    }).catch(() => {});
  }
  res.json({ params, resultats });
});

// ─── Codes promo : création, réductions, liens partageables ───
router.get('/promos', requirePerm('finance'), async (req, res) => {
  const promos = await prisma.promoCode.findMany({ orderBy: { code: 'asc' } });
  res.render('admin/promos', {
    title: 'Codes promo — Admin EduWeb',
    bodyClass: 'page-admin',
    promos,
    baseUrl: APP.baseUrl(req),
  });
});

router.post('/promos', requirePerm('finance'), async (req, res) => {
  const code = (req.body.code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const pct = parseInt(req.body.pct, 10);
  if (!code || code.length < 3) return go(res, '/admin/promos', 'error', 'Le code doit faire au moins 3 caractères (lettres/chiffres).');
  if (!(pct >= 1 && pct <= 100)) return go(res, '/admin/promos', 'error', 'La réduction doit être entre 1 et 100 %.');
  const usageMax = req.body.usageMax ? Math.max(1, parseInt(req.body.usageMax, 10) || 0) : null;
  const expiration = req.body.expiration ? new Date(req.body.expiration + 'T23:59:59Z') : null;
  await prisma.promoCode.upsert({
    where: { code },
    create: { code, pct, usageMax, expiration, actif: true },
    update: { pct, usageMax, expiration },
  });
  return go(res, '/admin/promos', 'success', `Code « ${code} » (−${pct} %) enregistré.`);
});

router.post('/promos/:code/toggle', requirePerm('finance'), async (req, res) => {
  const promo = await prisma.promoCode.findUnique({ where: { code: req.params.code } });
  if (!promo) return go(res, '/admin/promos', 'error', 'Code introuvable.');
  await prisma.promoCode.update({ where: { code: promo.code }, data: { actif: !promo.actif } });
  return go(res, '/admin/promos', 'success', `Code « ${promo.code} » ${promo.actif ? 'désactivé' : 'réactivé'}.`);
});

// ─── Vitrine « Nos ouvrages scolaires » : livres en vogue + couvertures ───
// ⚠️ sharp N'EST JAMAIS chargé au niveau module : son binaire natif fait
// échouer le démarrage des lambdas Vercel (même raison que routes/coach.js,
// qui le charge dans le handler). Chargement paresseux uniquement.
const multer = require('multer');
const storage = require('../services/storage');
const uploadCouverture = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 Mo
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpe?g|png|webp)$/i.test(file.mimetype);
    cb(ok ? null : new Error('Format non autorisé'), ok);
  },
});
function couvertureMiddleware(req, res, next) {
  uploadCouverture.single('couverture')(req, res, (err) => {
    if (err) req._couvertureErreur = err.code === 'LIMIT_FILE_SIZE' ? 'L’image dépasse 3 Mo.' : 'Image invalide (JPG, PNG ou WebP).';
    next();
  });
}

router.get('/livres', requirePerm('loterie'), async (req, res) => {
  let livres = [];
  let commandes = [];
  let nbNouvelles = 0;
  let totalCommandes = 0;
  try {
    livres = await prisma.livreVitrine.findMany({ orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }] });
  } catch (e) { console.warn('[admin/livres] table indisponible :', e.message); }
  try {
    commandes = await prisma.livreCommande.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
    nbNouvelles = await prisma.livreCommande.count({ where: { statut: 'nouvelle' } });
    totalCommandes = await prisma.livreCommande.count();
  } catch (e) { console.warn('[admin/livres] commandes indisponibles :', e.message); }
  res.render('admin/livres', {
    title: 'Librairie des ouvrages — Admin EduWeb',
    bodyClass: 'page-admin',
    livres,
    commandes,
    nbNouvelles,
    totalCommandes,
  });
});

// Créer ou modifier un livre (avec couverture facultative)
router.post('/livres', requirePerm('loterie'), couvertureMiddleware, async (req, res) => {
  if (req._couvertureErreur) return go(res, '/admin/livres', 'error', req._couvertureErreur);
  const titre = (req.body.titre || '').trim();
  const niveau = (req.body.niveau || '').trim();
  if (!titre || !niveau) return go(res, '/admin/livres', 'error', 'Titre et niveau sont obligatoires.');

  let imageUrl;
  if (req.file && req.file.buffer) {
    // 1. Optimisation BEST-EFFORT : si sharp est indisponible (binaire natif
    //    capricieux sur les lambdas), la couverture d'origine — déjà validée
    //    (JPG/PNG/WebP, ≤ 3 Mo) — est stockée telle quelle.
    let buf = req.file.buffer;
    let mime = req.file.mimetype;
    let nom = 'couverture' + ({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[mime] || '.jpg');
    try {
      const sharp = require('sharp'); // chargement paresseux (voir note ci-dessus)
      buf = await sharp(req.file.buffer).rotate().resize({ height: 720, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
      mime = 'image/webp';
      nom = 'couverture.webp';
    } catch (e) {
      console.warn('[admin/livres] optimisation sharp indisponible, image d’origine conservée :', e.message);
    }
    // 2. Stockage — seule vraie condition d'échec
    try {
      imageUrl = await storage.save(buf, nom, mime);
    } catch (e) {
      console.error('[admin/livres] stockage couverture :', e.message);
      return go(res, '/admin/livres', 'error', 'Le stockage de la couverture est momentanément indisponible. Réessayez dans un instant.');
    }
  }
  // Prix en FCFA : vide = livre affiché mais non commandable en ligne.
  const prixSaisi = String(req.body.prix || '').replace(/[^\d]/g, '');
  const prix = prixSaisi ? parseInt(prixSaisi, 10) : null;
  if (prix != null && (prix < 100 || prix > 1000000)) {
    return go(res, '/admin/livres', 'error', 'Le prix doit être compris entre 100 et 1 000 000 FCFA (ou laissé vide).');
  }
  const data = {
    titre, niveau,
    sousTitre: (req.body.sousTitre || '').trim() || null,
    description: (req.body.description || '').trim().slice(0, 300) || null,
    prix,
    ordre: parseInt(req.body.ordre, 10) || 0,
  };
  if (imageUrl) data.imageUrl = imageUrl;
  if (req.body.id) await prisma.livreVitrine.update({ where: { id: req.body.id }, data });
  else await prisma.livreVitrine.create({ data });
  return go(res, '/admin/livres', 'success',
    `Livre « ${titre} — ${niveau} » enregistré${imageUrl ? ' avec sa couverture' : ''}. ` +
    (prix != null ? `Commandable en ligne à ${prix.toLocaleString('fr-FR')} FCFA.` : 'Sans prix : affiché en vitrine, non commandable.'));
});

// Changer le statut d'une commande de la librairie
router.post('/livres/commandes/:id/statut', requirePerm('loterie'), async (req, res) => {
  const statuts = ['nouvelle', 'confirmee', 'livree', 'annulee'];
  const statut = req.body.statut;
  if (!statuts.includes(statut)) return go(res, '/admin/livres', 'error', 'Statut inconnu.');
  const cmd = await prisma.livreCommande.findUnique({ where: { id: req.params.id } }).catch(() => null);
  if (!cmd) return go(res, '/admin/livres', 'error', 'Commande introuvable.');
  const noteAdmin = (req.body.noteAdmin || '').trim().slice(0, 300);
  await prisma.livreCommande.update({
    where: { id: cmd.id },
    data: { statut, ...(noteAdmin ? { noteAdmin } : {}) },
  });
  const libelles = { nouvelle: 'remise à « nouvelle »', confirmee: 'confirmée', livree: 'marquée livrée', annulee: 'annulée' };
  return go(res, '/admin/livres', 'success', `Commande ${cmd.id.slice(0, 8).toUpperCase()} (${cmd.livreTitre}) ${libelles[statut]}.`);
});

// Export CSV des commandes de la librairie
router.get('/livres/commandes.csv', requirePerm('loterie'), async (req, res) => {
  const commandes = await prisma.livreCommande.findMany({ orderBy: { createdAt: 'asc' } }).catch(() => []);
  const cols = ['date', 'reference', 'ouvrage', 'quantite', 'montantFCFA', 'nom', 'telephone', 'email', 'lieu', 'modePaiement', 'operateur', 'refTransaction', 'statut', 'note', 'noteAdmin'];
  const lignes = [cols.map(celluleCsv).join(';')].concat(
    commandes.map((c) => [
      new Date(c.createdAt).toISOString(), c.id.slice(0, 8).toUpperCase(), c.livreTitre, c.quantite,
      c.montant == null ? '' : c.montant, c.nom, c.telephone, c.email || '', c.lieu,
      c.modePaiement, c.operateur || '', c.refTransaction || '', c.statut, c.note || '', c.noteAdmin || '',
    ].map(celluleCsv).join(';'))
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="commandes-librairie-eduweb.csv"');
  res.send('﻿' + lignes.join('\n'));
});

router.post('/livres/:id/toggle', requirePerm('loterie'), async (req, res) => {
  const l = await prisma.livreVitrine.findUnique({ where: { id: req.params.id } });
  if (!l) return go(res, '/admin/livres', 'error', 'Livre introuvable.');
  await prisma.livreVitrine.update({ where: { id: l.id }, data: { actif: !l.actif } });
  return go(res, '/admin/livres', 'success', `« ${l.titre} — ${l.niveau} » ${l.actif ? 'retiré de' : 'affiché dans'} la librairie et l'accueil.`);
});

router.post('/livres/:id/supprimer', requirePerm('loterie'), async (req, res) => {
  const l = await prisma.livreVitrine.findUnique({ where: { id: req.params.id } });
  if (!l) return go(res, '/admin/livres', 'error', 'Livre introuvable.');
  await prisma.livreVitrine.delete({ where: { id: l.id } });
  if (l.imageUrl) storage.remove(l.imageUrl).catch(() => {});
  return go(res, '/admin/livres', 'success', `« ${l.titre} — ${l.niveau} » supprimé de la librairie (ses commandes éventuelles sont conservées).`);
});

// ─── Loterie EduWeb Éditions : séries de codes, réglages, tirages ───
const loterie = require('../services/loterie');

router.get('/loterie', requirePerm('loterie'), async (req, res) => {
  let series = [];
  let cfg = null;
  let tirages = [];
  const stats = { enregistres: 0, libres: 0, laureats: 0 };
  try {
    series = await prisma.loterieSerie.findMany({ orderBy: { createdAt: 'desc' } });
    for (const s of series) {
      s.nbEnregistres = await prisma.loterieCode.count({ where: { serieId: s.id, statut: 'enregistre' } });
      stats.enregistres += s.nbEnregistres;
      stats.libres += s.nbCodes - s.nbEnregistres;
    }
    cfg = await loterie.config();
    stats.laureats = await prisma.loterieLaureat.count();
    const bruts = await prisma.loterieTirage.findMany({ orderBy: { effectueAt: 'desc' }, take: 5, include: { laureats: { orderBy: { rang: 'asc' } } } });
    for (const t of bruts) {
      const detail = [];
      for (const l of t.laureats) {
        const [u, c] = await Promise.all([
          prisma.user.findUnique({ where: { id: l.userId }, select: { name: true, email: true, phone: true } }),
          prisma.loterieCode.findUnique({ where: { id: l.codeId }, include: { serie: true } }),
        ]);
        const msg = loterie.messageLaureat(cfg, { nom: u ? u.name : '?', ouvrage: c.serie.ouvrage, niveau: c.serie.niveauLabel, code: c.code });
        detail.push({
          id: l.id, rang: l.rang, nom: u ? u.name : '(compte supprimé)', email: u && u.email, phone: u && u.phone,
          code: c.code, ouvrage: c.serie.ouvrage, niveau: c.serie.niveauLabel,
          notifieEmail: l.notifieEmail, notifieSms: l.notifieSms, notifieWhatsapp: l.notifieWhatsapp,
          waLink: u && u.phone ? 'https://wa.me/' + String(u.phone).replace(/\D/g, '') + '?text=' + encodeURIComponent(msg) : null,
        });
      }
      tirages.push({ id: t.id, effectueAt: t.effectueAt, automatique: t.automatique, laureats: detail });
    }
  } catch (e) { console.warn('[admin/loterie] tables indisponibles :', e.message); }
  res.render('admin/loterie', {
    title: 'Loterie des ouvrages — Admin EduWeb',
    bodyClass: 'page-admin',
    series, cfg, tirages, stats,
    baseUrl: APP.baseUrl(req),
  });
});

// Réglages du tirage (nombre, période, canaux de notification, message)
router.post('/loterie/config', requirePerm('loterie'), async (req, res) => {
  const cfg = await loterie.majConfig({
    actif: req.body.actif === '1',
    nbParTirage: req.body.nbParTirage,
    periodeJours: req.body.periodeJours,
    prochainTirage: req.body.prochainTirage || null,
    canalEmail: req.body.canalEmail === '1',
    canalSms: req.body.canalSms === '1',
    canalWhatsapp: req.body.canalWhatsapp === '1',
    messageTemplate: req.body.messageTemplate,
  });
  return go(res, '/admin/loterie', 'success',
    `Réglages enregistrés : ${cfg.nbParTirage} lauréat(s) par tirage, tous les ${cfg.periodeJours} jours${cfg.prochainTirage ? ', prochain tirage le ' + new Date(cfg.prochainTirage).toLocaleDateString('fr-FR') : ''}.`);
});

// Générer une nouvelle série de codes (futurs annales / ouvrages)
router.post('/loterie/series', requirePerm('loterie'), async (req, res) => {
  try {
    const ouvrage = (req.body.ouvrage || '').trim();
    const anneeScolaire = (req.body.anneeScolaire || '').trim();
    const niveauLabel = (req.body.niveauLabel || '').trim();
    if (!ouvrage || !niveauLabel || !/^\d{4}-\d{4}$/.test(anneeScolaire)) throw new Error('champs');
    const s = await loterie.genererSerie({
      ouvrage,
      discipline: (req.body.discipline || '').trim(),
      anneeScolaire,
      niveauCode: req.body.niveauCode,
      niveauLabel,
      nbCodes: req.body.nbCodes,
      createdById: req.session.user.id,
    });
    return go(res, '/admin/loterie', 'success', `Série « ${s.ouvrage} — ${s.niveauLabel} » créée : ${s.nbCodes} codes générés. Téléchargez le CSV pour l'imprimeur.`);
  } catch (e) {
    const msg = e.code === 'P2002' ? 'Une série existe déjà pour cette année scolaire et ce code niveau.'
      : 'Création impossible : vérifiez l’ouvrage, l’année (format 2027-2028), le code niveau (3 caractères) et le nombre de codes.';
    return go(res, '/admin/loterie', 'error', msg);
  }
});

router.post('/loterie/series/:id/toggle', requirePerm('loterie'), async (req, res) => {
  const s = await prisma.loterieSerie.findUnique({ where: { id: req.params.id } });
  if (!s) return go(res, '/admin/loterie', 'error', 'Série introuvable.');
  await prisma.loterieSerie.update({ where: { id: s.id }, data: { actif: !s.actif } });
  return go(res, '/admin/loterie', 'success', `Série « ${s.ouvrage} — ${s.niveauLabel} » ${s.actif ? 'clôturée' : 'réactivée'}.`);
});

// Export CSV d'une série (pour l'imprimeur — même format que le fichier d'origine)
router.get('/loterie/series/:id/export.csv', requirePerm('loterie'), async (req, res) => {
  const s = await prisma.loterieSerie.findUnique({ where: { id: req.params.id } });
  if (!s) return go(res, '/admin/loterie', 'error', 'Série introuvable.');
  const codes = await prisma.loterieCode.findMany({ where: { serieId: s.id }, orderBy: { numero: 'asc' } });
  const base = APP.baseUrl(req);
  const lignes = ['annee_scolaire;niveau;numero;code;lien_loterie;statut;date_utilisation'].concat(
    codes.map((c) => [
      s.anneeScolaire, s.niveauLabel, c.numero, c.code, base + '/loterie?code=' + c.code,
      c.statut === 'enregistre' ? 'enregistré' : 'non utilisé',
      c.enregistreAt ? new Date(c.enregistreAt).toISOString().slice(0, 10) : '',
    ].map(celluleCsv).join(';'))
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="codes_loterie_${s.anneeScolaire}_${s.niveauCode}.csv"`);
  res.send('﻿' + lignes.join('\n'));
});

// Tirage manuel immédiat
router.post('/loterie/tirer', requirePerm('loterie'), async (req, res) => {
  try {
    const r = await loterie.tirer({ nb: req.body.nb, acteurId: req.session.user.id, automatique: false });
    if (!r.ok) return go(res, '/admin/loterie', 'warning', 'Aucun participant éligible pour un tirage (codes enregistrés non encore lauréats).');
    return go(res, '/admin/loterie', 'success',
      `🎉 Tirage effectué : ${r.laureats.length} lauréat(s) — ${r.laureats.map((l) => l.nom).join(', ')}. Notifications envoyées selon les réglages.`);
  } catch (e) {
    console.error('[admin/loterie] tirage :', e.message);
    return go(res, '/admin/loterie', 'error', 'Tirage impossible pour le moment.');
  }
});

// Marquer la notification WhatsApp comme faite (envoi assisté)
router.post('/loterie/laureats/:id/whatsapp-fait', requirePerm('loterie'), async (req, res) => {
  await prisma.loterieLaureat.updateMany({ where: { id: req.params.id }, data: { notifieWhatsapp: true, notifieAt: new Date() } });
  return go(res, '/admin/loterie', 'success', 'Notification WhatsApp marquée comme envoyée.');
});

// Neutralisation CSV : injection de formules (=, +, −, @) et sauts de ligne,
// champs entre guillemets — les données proviennent de saisies utilisateur.
function celluleCsv(v) {
  let s = v == null ? '' : String(v);
  s = s.replace(/[\r\n]+/g, ' ');
  if (/^[=+\-@\t]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

// Export CSV des snapshots (§29)
router.get('/finance/export.csv', requirePerm('finance'), async (req, res) => {
  const snaps = await prisma.profitabilitySnapshot.findMany({ orderBy: { jour: 'asc' } }).catch(() => []);
  const cols = ['jour', 'caFacial', 'encaissements', 'reductions', 'retroAcquises', 'retroPayees', 'engagementsRestants', 'rar', 'rarMoyen', 'margeContributive', 'referralCac', 'coefK', 'abonnesActifs', 'nouveauxAbonnes'];
  const lignes = [cols.map(celluleCsv).join(';')].concat(snaps.map((s) => cols.map((c) => celluleCsv(c === 'jour' ? new Date(s.jour).toISOString().slice(0, 10) : s[c])).join(';')));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="rentabilite-eduweb.csv"');
  res.send('﻿' + lignes.join('\n'));
});

// Export CSV du ledger (§14 — auditable)
router.get('/finance/ledger.csv', requirePerm('finance'), async (req, res) => {
  const entries = await prisma.financialLedgerEntry.findMany({ orderBy: { createdAt: 'asc' }, include: { user: true } }).catch(() => []);
  const cols = ['date', 'utilisateur', 'type', 'montant', 'devise', 'taux', 'filleulSource', 'abonnement', 'payout', 'reference', 'motif', 'creePar', 'idempotencyKey'];
  const lignes = [cols.map(celluleCsv).join(';')].concat(
    entries.map((e) => [
      new Date(e.createdAt).toISOString(), e.user ? e.user.email : e.userId, e.type, e.montant, e.devise,
      e.taux || '', e.filleulSourceId || '', e.subscriptionId || '', e.payoutId || '',
      e.referenceExterne || '', e.motif || '', e.creePar, e.idempotencyKey,
    ].map(celluleCsv).join(';'))
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="ledger-eduweb.csv"');
  res.send('﻿' + lignes.join('\n'));
});

module.exports = router;
