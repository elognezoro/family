require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieSession = require('cookie-session');
const expressLayouts = require('express-ejs-layouts');

const APP = require('./config/app');
const { icon } = require('./config/icons');
const { groups: countryGroups } = require('./data/countries');
const geoService = require('./data/geo-service');
const prisma = require('./data/prisma-store');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Vues ───
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// ─── Body parsers ───
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Statique ───
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Sessions (cookie signé — compatible serverless / Vercel) ───
const isHttps = (process.env.BASE_URL || '').startsWith('https');
app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'eduweb_session',
    secret: process.env.SESSION_SECRET || 'eduweb_dev_secret',
    maxAge: 1000 * 60 * 60 * 24, // 24h par défaut (modifiable par « Me maintenir connecté »)
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps,
  })
);

// ─── Variables locales globales pour les vues ───
app.use((req, res, next) => {
  res.locals.APP = APP;
  res.locals.icon = icon;
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.countryGroups = countryGroups;
  res.locals.dialCodes = geoService.dialCodes();
  // Anti-cache des assets : version = date de modification du fichier
  res.locals.v = (rel) => {
    try { return fs.statSync(path.join(__dirname, 'public', rel)).mtimeMs.toString(36); }
    catch (e) { return '1'; }
  };
  // Flash via query params
  res.locals.mt = req.query.mt || null;
  res.locals.mm = req.query.mm || null;
  // Valeurs par défaut surchargeables par chaque vue
  res.locals.title = 'EduWeb — Family & Coaching';
  res.locals.bodyClass = '';
  res.locals.hideChrome = false;
  next();
});

// ─── Rafraîchit l'utilisateur connecté depuis la base (rôle, permissions, photo)
//      pour que les changements soient immédiats — sans alourdir le cookie. ───
app.use(async (req, res, next) => {
  res.locals.currentUserPhoto = null;
  res.locals.unreadCount = 0;
  if (req.session && req.session.user) {
    try {
      const u = await prisma.user.findUnique({
        where: { id: req.session.user.id },
        select: { photo: true, role: true, status: true, isSuperAdmin: true, permissions: true, name: true },
      });
      if (!u) { req.session = null; return res.redirect('/'); }
      if (u.status === 'suspended') {
        req.session = null;
        return res.redirect('/auth/login?mt=error&mm=' + encodeURIComponent('Votre compte a été suspendu.'));
      }
      req.session.user.role = u.role;
      req.session.user.isSuperAdmin = u.isSuperAdmin;
      req.session.user.permissions = u.permissions;
      req.session.user.name = u.name;
      res.locals.currentUser = req.session.user;
      res.locals.currentUserPhoto = u.photo || null;
      res.locals.unreadCount = await prisma.message.count({ where: { recipientId: req.session.user.id, read: false } });
    } catch (e) { /* non bloquant */ }
  }
  next();
});

// ─── Compteur de visites (une fois par session/visiteur) ───
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.session.seen && !req.path.startsWith('/api') && req.accepts('html')) {
    req.session.seen = true;
    prisma.siteStat
      .upsert({ where: { id: 'site' }, create: { id: 'site', visits: 1 }, update: { visits: { increment: 1 } } })
      .catch(() => { /* non bloquant */ });
  }
  next();
});

// ─── Routes ───
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/parent', require('./routes/parent'));
app.use('/coach', require('./routes/coach'));
app.use('/commercial', require('./routes/commercial'));
app.use('/admin', require('./routes/admin'));
app.use('/messages', require('./routes/messages'));
app.use('/api', require('./routes/api'));

// ─── 404 ───
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page introuvable',
    code: 404,
    message: "La page que vous cherchez n'existe pas.",
  });
});

// ─── Gestion d'erreurs ───
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).render('error', {
    title: 'Erreur serveur',
    code: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue.',
  });
});

// En local : on démarre le serveur. Sur Vercel (serverless) : on exporte l'app.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n  ✦ EduWeb démarré sur ${process.env.BASE_URL || `http://localhost:${PORT}`}\n`);
  });
  // Purge des pièces jointes expirées (Vercel utilise un Cron ; en local on planifie ici,
  // toutes les heures — runScheduledPurge respecte l'heure configurée par le super-admin).
  const maintenance = require('./services/maintenance');
  maintenance.runScheduledPurge(false).catch(() => {});
  setInterval(() => { maintenance.runScheduledPurge(false).catch(() => {}); }, 60 * 60 * 1000);
}

module.exports = app;
