const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { requireAuth, go } = require('../middleware/auth');

const GUIDES_DIR = path.join(__dirname, '..', 'guides');

// Catalogue des guides. slug = identifiant URL ; role = rôle autorisé.
const CATALOG = [
  { slug: 'parent', role: 'parent', label: 'Parent', file: 'Guide-Parent-EduWeb',
    desc: 'Trouver, réserver et suivre un coach pour vos enfants.' },
  { slug: 'coach', role: 'coach', label: 'Coach', file: 'Guide-Coach-EduWeb',
    desc: 'Constituer votre profil, recevoir des missions, suivre vos revenus.' },
  { slug: 'commercial', role: 'commercial', label: 'Commercial', file: 'Guide-Commercial-EduWeb',
    desc: 'Recruter parents et coachs, suivre vos filleuls et vos gains.' },
  { slug: 'admin', role: 'admin', label: 'Admin', file: 'Guide-Admin-EduWeb',
    desc: 'Gérer les utilisateurs, valider les coachs, suivre les finances.' },
  { slug: 'super-admin', role: '__super__', label: 'Super-Admin', file: 'Guide-Super-Admin-EduWeb',
    desc: 'Administrateurs, paramètres de la plateforme, support.' },
];

// Support de formation : document transversal (PDF), accessible à tout utilisateur connecté.
const FORMATION = {
  slug: 'support-formation', label: 'Support de formation', file: 'Support-Formation-EduWeb',
  desc: 'Programme complet : syllabus, modules par rôle, travaux pratiques et évaluation.',
};

// Guides accessibles à un utilisateur : le sien uniquement ; le super-admin a tous les guides.
function allowedFor(user) {
  if (user && user.isSuperAdmin) return CATALOG.slice();
  if (user && user.role === 'admin') return CATALOG.filter((c) => c.slug === 'admin');
  return CATALOG.filter((c) => user && c.slug === user.role);
}

router.use(requireAuth);

// Page « Guides d'utilisation »
router.get('/', (req, res) => {
  res.render('guides', {
    title: 'Guides d\'utilisation — EduWeb',
    bodyClass: 'page-guides',
    guides: allowedFor(req.session.user),
    formation: FORMATION,
  });
});

// Téléchargement / consultation d'un guide (contrôle d'accès par rôle)
router.get('/:slug.:ext', (req, res) => {
  const { slug, ext } = req.params;
  if (!['pdf', 'docx'].includes(ext)) return go(res, '/guides', 'error', 'Format non disponible.');
  // Support de formation : PDF, ouvert à tout utilisateur connecté.
  if (slug === FORMATION.slug) {
    if (ext !== 'pdf') return go(res, '/guides', 'error', 'Le support de formation est disponible en PDF.');
    const fp = path.join(GUIDES_DIR, FORMATION.file + '.pdf');
    if (!fs.existsSync(fp)) return go(res, '/guides', 'error', 'Fichier indisponible.');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + FORMATION.file + '.pdf"');
    return res.sendFile(fp);
  }
  const entry = CATALOG.find((c) => c.slug === slug);
  if (!entry) return go(res, '/guides', 'error', 'Guide introuvable.');
  if (!allowedFor(req.session.user).some((c) => c.slug === slug)) {
    return go(res, '/guides', 'error', 'Ce guide ne vous est pas accessible.');
  }
  const filePath = path.join(GUIDES_DIR, entry.file + '.' + ext);
  if (!fs.existsSync(filePath)) return go(res, '/guides', 'error', 'Fichier indisponible.');

  res.setHeader('Content-Type', ext === 'pdf'
    ? 'application/pdf'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  // PDF : consultation en ligne ; Word : téléchargement.
  res.setHeader('Content-Disposition', (ext === 'pdf' ? 'inline' : 'attachment') + '; filename="' + entry.file + '.' + ext + '"');
  res.sendFile(filePath);
});

module.exports = router;
module.exports.allowedFor = allowedFor;
module.exports.CATALOG = CATALOG;
