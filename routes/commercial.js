const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const referral = require('../services/referral');
const APP = require('../config/app');

router.use(requireRole('commercial'));

// ─── Tableau de bord commercial ───
router.get('/', async (req, res) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const data = await referral.buildData(req.session.user.id, baseUrl);
  res.render('referral', {
    title: 'Espace Commercial — EduWeb',
    bodyClass: 'page-commercial',
    isCommercial: true,
    data,
    APP,
  });
});

module.exports = router;
