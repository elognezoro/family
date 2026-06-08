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

// ─── Routes ───
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/parent', require('./routes/parent'));
app.use('/coach', require('./routes/coach'));
app.use('/admin', require('./routes/admin'));
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
}

module.exports = app;
