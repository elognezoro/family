// Service géographique
//  - Côte d'Ivoire : données locales (data/regions.js)
//  - Autres pays : librairie country-state-city (ISO 3166-2)

const { districts } = require('./regions');

let CSC = null;
try {
  CSC = require('country-state-city');
} catch (e) {
  console.warn('[geo] country-state-city indisponible :', e.message);
}

// Libellé du niveau « région » adapté au pays
const REGION_LABELS = {
  ci: 'Région',
  fr: 'Région',
  us: 'État',
  dz: 'Wilaya',
  jp: 'Préfecture',
  ch: 'Canton',
  ca: 'Province',
  de: 'Land',
  es: 'Communauté autonome',
  it: 'Région',
  br: 'État',
  ng: 'État',
  ma: 'Région',
  default: 'Région / État / Province',
};

function regionLabel(countryCode) {
  return REGION_LABELS[countryCode] || REGION_LABELS.default;
}

// ─── Côte d'Ivoire ───
function ciDistricts() {
  return districts.map((d) => ({ id: d.id, label: d.label }));
}
function ciRegions(districtId) {
  const d = districts.find((x) => x.id === districtId);
  return d ? d.regions.map((r) => ({ id: r.id, label: r.label })) : [];
}
function ciCommunes(districtId, regionId) {
  const d = districts.find((x) => x.id === districtId);
  if (!d) return [];
  const r = d.regions.find((x) => x.id === regionId);
  return r ? r.communes.map((c) => ({ id: c, label: c })) : [];
}

// ─── Autres pays (country-state-city) ───
function statesOf(countryCode) {
  if (!CSC) return [];
  const code = countryCode.toUpperCase();
  return (CSC.State.getStatesOfCountry(code) || []).map((s) => ({
    id: s.isoCode,
    label: s.name,
  }));
}
function citiesOf(countryCode, stateCode) {
  if (!CSC) return [];
  const cc = countryCode.toUpperCase();
  return (CSC.City.getCitiesOfState(cc, stateCode) || []).map((c) => ({
    id: c.name,
    label: c.name,
  }));
}

// Un pays a-t-il des subdivisions ISO 3166-2 ?
function hasStates(countryCode) {
  return statesOf(countryCode).length > 0;
}

// Indicatifs téléphoniques par code ISO alpha-2 (minuscule) → "+225"
let _dialCache = null;
function dialCodes() {
  if (_dialCache) return _dialCache;
  const map = {};
  if (CSC) {
    (CSC.Country.getAllCountries() || []).forEach((c) => {
      let code = (c.phonecode || '').toString().replace(/^\+/, '').trim();
      if (code) map[c.isoCode.toLowerCase()] = '+' + code;
    });
  }
  map.ci = map.ci || '+225'; // garantie Côte d'Ivoire
  _dialCache = map;
  return map;
}

function dialCode(countryCode) {
  return dialCodes()[countryCode] || '';
}

module.exports = {
  regionLabel,
  ciDistricts,
  ciRegions,
  ciCommunes,
  statesOf,
  citiesOf,
  hasStates,
  dialCodes,
  dialCode,
};
