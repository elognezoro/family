// Loterie EduWeb Éditions — page publique et enregistrement des codes.
// Les QR imprimés dans les livres ouvrent /loterie?code=EW-....
const express = require('express');
const router = express.Router();
const { go, requireAuth } = require('../middleware/auth');
const loterie = require('../services/loterie');

router.get('/', async (req, res) => {
  const user = req.session.user || null;
  const stats = await loterie.statsPubliques();
  const codePrefill = (req.query.code || '').trim().slice(0, 30);
  res.render('loterie', {
    title: 'Loterie EduWeb Éditions — enregistrez le code de votre livre',
    bodyClass: 'page-loterie',
    stats,
    codePrefill,
    mesCodes: user ? await loterie.mesCodes(user.id) : [],
  });
});

router.post('/enregistrer', requireAuth, async (req, res) => {
  const saisie = (req.body.code || '').trim();
  if (!saisie) return go(res, '/loterie', 'error', 'Saisissez le code inscrit dans votre livre.');
  try {
    const r = await loterie.enregistrer(req.session.user.id, saisie);
    if (r.ok) {
      return go(res, '/loterie', 'success',
        `🎟️ Code ${r.code.code} enregistré ! Vous participez au prochain tirage (${r.code.serie.ouvrage} — ${r.code.serie.niveauLabel}). Bonne chance !`);
    }
    const messages = {
      'introuvable': 'Ce code est introuvable. Vérifiez la saisie : il est inscrit dans votre livre au format EW-XXXX-XXX-0000-XXXXXX.',
      'deja-a-vous': 'Ce code est déjà enregistré sur votre compte : vous participez bien au tirage.',
      'deja-pris': 'Ce code a déjà été enregistré par une autre personne. Si vous pensez qu’il s’agit d’une erreur, contactez le support.',
      'serie-close': 'La loterie de cette série d’ouvrages est clôturée.',
    };
    return go(res, '/loterie', r.motif === 'deja-a-vous' ? 'info' : 'error', messages[r.motif] || 'Enregistrement impossible.');
  } catch (e) {
    console.error('[loterie] enregistrement :', e.message);
    return go(res, '/loterie', 'error', 'La loterie est momentanément indisponible. Réessayez dans un instant.');
  }
});

module.exports = router;
