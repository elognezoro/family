// Chansons mnémotechniques des annales — pages partageables (/chansons/:slug).
// Le bloc est le même que sur la page de commande du livre ; l'écoute se
// débloque avec le code de loterie de l'annale (un code = un seul compte).
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');
const chansonsData = require('../data/chansons');
const loterie = require('../services/loterie');

// /chansons → l'unique série (redirection) ; en cas de séries multiples,
// la première reste une porte d'entrée raisonnable tant qu'il n'y a pas d'index.
router.get('/', (req, res) => {
  const series = chansonsData.toutes();
  if (!series.length) return go(res, '/ouvrages', 'info', 'Aucune série de chansons pour le moment.');
  return res.redirect(`/chansons/${series[0].slug}`);
});

router.get('/:slug', async (req, res) => {
  const serie = chansonsData.parSlug(req.params.slug);
  if (!serie) return go(res, '/ouvrages', 'error', 'Cette série de chansons est introuvable.');
  const u = req.session.user || null;
  const lienPartage = `${APP.baseUrl(req)}/chansons/${serie.slug}`;

  // Livre de la librairie correspondant (pour le bouton « Commander l'annale »)
  let livreAssocie = null;
  try {
    const livres = await prisma.livreVitrine.findMany({ where: { actif: true } });
    livreAssocie = livres.find((l) => chansonsData.pourLivre(l) === serie) || null;
  } catch (e) { /* librairie indisponible : la page reste utilisable */ }

  let qr = null;
  try {
    const QRCode = require('qrcode');
    qr = await QRCode.toDataURL(lienPartage, { margin: 1, width: 160, color: { dark: '#0E6B3A' } });
  } catch (e) { /* facultatif */ }

  res.render('chansons', {
    title: `${serie.label} — EduWeb Éditions`,
    bodyClass: 'page-ouvrages',
    serie,
    acces: u ? await chansonsData.aAcces(u.id) : false,
    lienPartage,
    qr,
    livreAssocie,
  });
});

router.post('/:slug/debloquer', async (req, res) => {
  const serie = chansonsData.parSlug(req.params.slug);
  if (!serie) return go(res, '/ouvrages', 'error', 'Cette série de chansons est introuvable.');
  const retour = `/chansons/${serie.slug}`;
  if (!req.session.user) {
    return go(res, retour, 'info', 'Connectez-vous (ou créez un compte gratuit) pour débloquer les chansons avec le code de votre annale.');
  }
  const saisie = (req.body.code || '').trim();
  if (!saisie) return go(res, retour, 'error', 'Saisissez le code unique inscrit dans votre annale.');
  try {
    const r = await loterie.enregistrer(req.session.user.id, saisie);
    if (r.ok) {
      return go(res, retour, 'success', '🎵 Code validé, les chansons sont débloquées — bonne écoute ! Votre code participe aussi aux tirages de la loterie.');
    }
    return go(res, retour, r.motif === 'deja-a-vous' ? 'info' : 'error',
      chansonsData.MESSAGES_DEBLOCAGE[r.motif] || 'Déblocage impossible.');
  } catch (e) {
    console.error('[chansons] déblocage :', e.message);
    return go(res, retour, 'error', 'Le déblocage est momentanément indisponible. Réessayez dans un instant.');
  }
});

module.exports = router;
