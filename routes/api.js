const express = require('express');
const router = express.Router();
const geo = require('../data/geo-service');
const { districts: ciTree } = require('../data/regions');

// ─── Côte d'Ivoire ───
// Arbre complet (districts → régions → communes) pour la cascade client
router.get('/ci/all', (req, res) => res.json(ciTree));
router.get('/ci/districts', (req, res) => res.json(geo.ciDistricts()));
router.get('/ci/regions/:district', (req, res) => res.json(geo.ciRegions(req.params.district)));
router.get('/ci/communes/:district/:region', (req, res) =>
  res.json(geo.ciCommunes(req.params.district, req.params.region))
);

// ─── Autres pays (ISO 3166-2 via country-state-city) ───
router.get('/geo/:country/states', (req, res) => {
  res.json({
    label: geo.regionLabel(req.params.country),
    items: geo.statesOf(req.params.country),
  });
});
router.get('/geo/:country/cities/:state', (req, res) =>
  res.json(geo.citiesOf(req.params.country, req.params.state))
);

// Métadonnées d'un pays (a-t-il des subdivisions ?)
router.get('/geo/:country/meta', (req, res) => {
  const cc = req.params.country;
  res.json({
    country: cc,
    regionLabel: geo.regionLabel(cc),
    hasStates: cc === 'ci' ? true : geo.hasStates(cc),
    isCI: cc === 'ci',
  });
});

module.exports = router;
