const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireRole, requirePerm, requireSuperAdmin } = require('../middleware/auth');
const niveauxData = require('../data/niveaux');
const disciplinesData = require('../data/disciplines');
const { countryName } = require('../data/countries');
const fxrates = require('../services/fxrates');
const APP = require('../config/app');

router.use(requireRole('admin'));

// ─── Tableau de bord ───
router.get('/', async (req, res) => {
  const [
    totalUsers, parents, coaches, admins,
    pendingCoaches, validCoaches, refusedCoaches, certifiedCoaches,
    learners, needs, missions, paymentsAgg, promoCount,
    pendingList, recentUsers,
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
  ]);

  const revenue = paymentsAgg._sum.net || 0;
  const paymentsCount = paymentsAgg._count || 0;

  res.render('admin/dashboard', {
    title: 'Espace Admin — EduWeb',
    bodyClass: 'page-admin',
    stats: {
      totalUsers, parents, coaches, admins,
      pendingCoaches, validCoaches, refusedCoaches, certifiedCoaches,
      learners, needs, missions, revenue, paymentsCount, promoCount,
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
  if (roleFilter && ['parent', 'coach', 'admin'].includes(roleFilter)) where.role = roleFilter;
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

// Créer un utilisateur (pré-provisionné, activé directement)
router.post('/users', requirePerm('users'), async (req, res) => {
  try {
    const { nom, prenom, email: rawEmail, password, gender, role } = req.body;
    const mail = (rawEmail || '').trim().toLowerCase();
    const accountRole = ['parent', 'coach', 'admin'].includes(role) ? role : 'parent';

    if (!nom || !mail || !password) {
      return go(res, '/admin/users', 'error', 'Nom, email et mot de passe sont obligatoires.');
    }
    if (password.length < 6) {
      return go(res, '/admin/users', 'error', 'Le mot de passe doit contenir au moins 6 caractères.');
    }
    const existing = await prisma.user.findUnique({ where: { email: mail } });
    if (existing) return go(res, '/admin/users', 'error', 'Un compte existe déjà avec cet email.');

    const user = await prisma.user.create({
      data: {
        email: mail,
        passwordHash: await bcrypt.hash(password, 10),
        name: formatName(nom, prenom),
        gender: gender || null,
        role: accountRole,
        emailVerified: true, // créé par l'admin → directement actif
      },
    });
    if (accountRole === 'coach') {
      await prisma.coachProfile.create({ data: { userId: user.id, statut: 'pending' } });
    } else if (accountRole === 'parent') {
      await prisma.family.create({ data: { ownerUserId: user.id, label: 'Ma Famille' } });
    }
    return go(res, '/admin/users', 'success', `Utilisateur « ${user.name} » créé et activé.`);
  } catch (e) {
    console.error(e);
    return go(res, '/admin/users', 'error', 'Création impossible.');
  }
});

// Changer le rôle d'un utilisateur
router.post('/user/:id/role', requirePerm('users'), async (req, res) => {
  try {
    const newRole = req.body.role;
    if (!['parent', 'coach', 'admin'].includes(newRole)) {
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

// Supprimer un utilisateur (et ses données liées)
router.post('/user/:id/delete', requirePerm('users'), async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) {
      return go(res, '/admin/users', 'error', 'Vous ne pouvez pas supprimer votre propre compte.');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { coachProfile: true, families: true },
    });
    if (!user) return go(res, '/admin/users', 'error', 'Utilisateur introuvable.');

    await prisma.$transaction(async (tx) => {
      await tx.notification.deleteMany({ where: { userId: user.id } });
      await tx.mission.deleteMany({ where: { OR: [{ parentUserId: user.id }, { coachUserId: user.id }] } });
      await tx.payment.deleteMany({ where: { parentUserId: user.id } });
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
      await tx.family.deleteMany({ where: { ownerUserId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
    });

    return go(res, '/admin/users', 'success', `Utilisateur « ${user.name} » supprimé.`);
  } catch (e) {
    console.error(e);
    return go(res, '/admin/users', 'error', 'Suppression impossible (données liées).');
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

router.post('/coach-profile/:id/certifier', requirePerm('coaches'), async (req, res) => {
  const profile = await prisma.coachProfile.findUnique({ where: { id: req.params.id } });
  await prisma.coachProfile.update({
    where: { id: req.params.id },
    data: { certifie: !profile.certifie },
  });
  return go(res, `/admin/coach-profile/${req.params.id}`, 'success', profile.certifie ? 'Certification retirée.' : 'Coach certifié.');
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

module.exports = router;
