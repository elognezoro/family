const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = express.Router();

const prisma = require('../data/prisma-store');
const email = require('../services/email');
const { go, redirectIfAuth } = require('../middleware/auth');
const { countries: COUNTRY_LIST } = require('../data/countries');
const COUNTRY_CODES = new Set(COUNTRY_LIST.map((c) => c.code));

// Détection automatique du pays depuis l'en-tête géo de l'hébergeur (Vercel / Cloudflare).
function detectCountry(req) {
  const raw = (req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || '').toString().toLowerCase();
  return COUNTRY_CODES.has(raw) ? raw : 'ci';
}
// Normalise le pays soumis (repli sur la détection puis « ci »).
function cleanCountry(value, req) {
  const v = (value || '').toString().trim().toLowerCase();
  return COUNTRY_CODES.has(v) ? v : detectCountry(req);
}

// Helpers de normalisation des noms (règle impérative #9)
function formatName(nom, prenom) {
  const NOM = (nom || '').trim().toUpperCase();
  const Prenom = (prenom || '')
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
  return [NOM, Prenom].filter(Boolean).join(' ');
}

// Code de parrainage unique (8 caractères)
async function uniqueRefCode() {
  for (let i = 0; i < 6; i++) {
    const code = crypto.randomBytes(8).toString('base64').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
    if (code.length < 6) continue;
    const exists = await prisma.user.findUnique({ where: { referralCode: code }, select: { id: true } });
    if (!exists) return code;
  }
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

// ─── Inscription ───
router.get('/register', redirectIfAuth, (req, res) => {
  res.render('auth/register', {
    title: 'Créer un compte — EduWeb',
    ref: req.query.ref || '',
    detectedCountry: detectCountry(req),
    bodyClass: 'page-auth',
    hideChrome: true,
  });
});

router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email: rawEmail, password, confirm, gender, role } = req.body;
    const mail = (rawEmail || '').trim().toLowerCase();
    const accountRole = ['coach', 'commercial'].includes(role) ? role : 'parent';
    const pays = cleanCountry(req.body.pays, req);

    // Parrain éventuel (?ref=CODE)
    let referredById = null;
    const refCode = (req.body.ref || '').trim();
    if (refCode) {
      const sponsor = await prisma.user.findUnique({ where: { referralCode: refCode }, select: { id: true } });
      if (sponsor) referredById = sponsor.id;
    }

    if (!nom || !prenom || !mail || !password) {
      return go(res, '/auth/register', 'error', 'Tous les champs sont obligatoires.');
    }
    if (password.length < 6) {
      return go(res, '/auth/register', 'error', 'Le mot de passe doit contenir au moins 6 caractères.');
    }
    if (password !== confirm) {
      return go(res, '/auth/register', 'error', 'Les mots de passe ne correspondent pas.');
    }

    const existing = await prisma.user.findUnique({ where: { email: mail } });
    if (existing) {
      return go(res, '/auth/register', 'error', 'Un compte existe déjà avec cet email.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const baseData = {
      email: mail,
      passwordHash,
      name: formatName(nom, prenom),
      gender: gender || null,
      role: accountRole,
      referredById,
      referralCode: await uniqueRefCode(),
      emailVerified: false,
      verifyToken: token,
      verifyTokenExpiry: expiry,
    };
    // Le pays n'est enregistré que si la colonne « pays » est présente en base ;
    // sinon l'inscription se poursuit sans bloquer (repli sans le pays).
    let user;
    try {
      user = await prisma.user.create({ data: { ...baseData, pays } });
    } catch (e) {
      if (/pays|Unknown arg|column|does not exist/i.test(e && e.message || '')) {
        console.warn('Inscription sans pays (colonne absente ?) :', (e && (e.code || e.message)) || e);
        user = await prisma.user.create({ data: baseData });
      } else {
        throw e;
      }
    }

    // Espace selon le rôle
    if (accountRole === 'coach') {
      await prisma.coachProfile.create({ data: { userId: user.id, statut: 'pending' } });
    } else if (accountRole === 'parent') {
      await prisma.family.create({ data: { ownerUserId: user.id, label: 'Ma Famille' } });
    }

    const sent = await email.sendVerification(user, token);

    // Aucune session créée — le compte est inactif
    if (email.isConfigured()) {
      if (sent) {
        return go(res, '/auth/login', 'success',
          'Compte créé ! Un email d’activation vient de vous être envoyé. Vérifiez votre boîte de réception (pensez aux spams).');
      }
      return go(res, '/auth/login', 'warning',
        'Compte créé, mais l’email d’activation n’a pas pu être envoyé. Utilisez « Compte non activé ? Renvoyer le lien » ci-dessous.');
    }
    return go(res, '/auth/login', 'info',
      'Compte créé ! (Mode développement : le lien d’activation s’affiche dans la console du serveur.)');
  } catch (e) {
    console.error(e);
    return go(res, '/auth/register', 'error', 'Une erreur est survenue lors de l’inscription.');
  }
});

// ─── Connexion ───
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('auth/login', {
    title: 'Connexion — EduWeb',
    bodyClass: 'page-auth',
    hideChrome: true,
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email: rawEmail, password, remember } = req.body;
    const mail = (rawEmail || '').trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: mail } });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return go(res, '/auth/login', 'error', 'Email ou mot de passe incorrect.');
    }
    if (user.status === 'suspended') {
      return go(res, '/auth/login', 'error', 'Ce compte est suspendu. Contactez l’administration.');
    }
    if (!user.emailVerified) {
      return go(
        res,
        '/auth/login',
        'warning',
        'Compte non activé. Vérifiez votre email ou demandez un nouveau lien ci-dessous.'
      );
    }

    // NB : ne PAS stocker la photo dans la session (cookie-session) — une photo
    // base64 ferait exploser la taille du cookie (crash serverless). La photo
    // est lue depuis la base via profile.user.photo quand nécessaire.
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      isSuperAdmin: user.isSuperAdmin,
      permissions: user.permissions,
    };
    req.session.lang = user.lang || req.session.lang || 'fr'; // langue de lecture mémorisée

    if (remember) {
      req.sessionOptions.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 jours
    }

    return res.redirect(`/${user.role}`);
  } catch (e) {
    console.error(e);
    return go(res, '/auth/login', 'error', 'Une erreur est survenue lors de la connexion.');
  }
});

// ─── Vérification email ───
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return go(res, '/auth/login', 'error', 'Lien d’activation invalide.');

    const user = await prisma.user.findUnique({ where: { verifyToken: token } });
    if (!user) return go(res, '/auth/login', 'error', 'Lien d’activation invalide ou déjà utilisé.');

    if (user.verifyTokenExpiry && user.verifyTokenExpiry < new Date()) {
      return go(res, '/auth/login', 'error', 'Lien expiré. Demandez un nouveau lien d’activation.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null, verifyTokenExpiry: null },
    });

    await email.sendWelcome(user);
    return go(res, '/auth/login', 'success', 'Compte activé ! Vous pouvez maintenant vous connecter.');
  } catch (e) {
    console.error(e);
    return go(res, '/auth/login', 'error', 'Une erreur est survenue lors de l’activation.');
  }
});

// ─── Renvoyer le lien d'activation ───
router.post('/resend', async (req, res) => {
  try {
    const mail = (req.body.email || '').trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: mail } });
    if (user && !user.emailVerified) {
      const token = crypto.randomBytes(32).toString('hex');
      await prisma.user.update({
        where: { id: user.id },
        data: { verifyToken: token, verifyTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24) },
      });
      await email.sendVerification(user, token);
    }
    // Réponse identique quel que soit le cas (anti-énumération)
    return go(res, '/auth/login', 'info', 'Si un compte non activé existe, un nouveau lien a été envoyé.');
  } catch (e) {
    console.error(e);
    return go(res, '/auth/login', 'error', 'Une erreur est survenue.');
  }
});

// ─── Déconnexion ───
router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
