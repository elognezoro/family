const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const referral = require('../services/referral');
const APP = require('../config/app');
const pageParrainage = require('../services/finance/page-parrainage');

router.use(requireRole('commercial'));

// ─── Tableau de bord commercial ───
router.get('/', async (req, res) => {
  const baseUrl = APP.baseUrl(req);
  const data = await referral.buildData(req.session.user.id, baseUrl);
  const linkFormation = baseUrl + '/formation?ref=' + encodeURIComponent(data.code);
  const fin = await pageParrainage.donnees(req.session.user.id, data.link, linkFormation);
  res.render('referral', {
    title: 'Espace Commercial — EduWeb',
    bodyClass: 'page-commercial',
    isCommercial: true,
    data,
    linkFormation,
    fin,
    APP,
  });
});

module.exports = router;
