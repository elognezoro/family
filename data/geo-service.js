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

// ─── Devises ───
// Taux approximatifs : unités de la devise pour 1 € (perEUR). XOF est fixe (656).
const CURRENCY_RATES = {
  EUR: 1, XOF: 656, XAF: 656, USD: 1.08, GBP: 0.85, CAD: 1.47, CHF: 0.95,
  MAD: 10.7, DZD: 145, TND: 3.35, EGP: 53, NGN: 1750, GHS: 16, ZAR: 20,
  KES: 140, GMD: 73, GNF: 9300, LRD: 200, SLL: 24000, MRU: 43, CVE: 110,
  CDF: 3000, AOA: 980, RWF: 1400, UGX: 4100, TZS: 2800, ETB: 130, MGA: 4900,
};
const CURRENCY_SYMBOLS = {
  EUR: '€', XOF: 'FCFA', XAF: 'FCFA', USD: '$', GBP: '£', CAD: '$ CA', CHF: 'CHF',
  MAD: 'DH', DZD: 'DA', TND: 'DT', EGP: 'E£', NGN: '₦', GHS: '₵', ZAR: 'R', KES: 'KSh',
};

let fx = null;
try { fx = require('../services/fxrates'); } catch (e) { /* optionnel */ }

function currencyFor(countryCode) {
  let code = 'XOF';
  if (CSC) {
    const c = CSC.Country.getCountryByCode((countryCode || '').toUpperCase());
    if (c && c.currency) code = c.currency;
  }
  if (fx) fx.ensureFresh(); // rafraîchit les taux si nécessaire (non bloquant)

  // XOF/XAF : ancrés à 656 (base de facturation de la plateforme)
  if (code === 'XOF' || code === 'XAF') {
    return { code, symbol: 'FCFA', perEUR: 656, live: false };
  }
  // Taux réel si disponible, sinon table statique
  const liveRate = fx ? fx.getRate(code) : null;
  const perEUR = liveRate || CURRENCY_RATES[code];
  if (!perEUR) {
    // Devise sans taux connu → repli sur le FCFA (devise de la plateforme)
    return { code: 'XOF', symbol: 'FCFA', perEUR: 656, fallback: true };
  }
  return { code, symbol: CURRENCY_SYMBOLS[code] || code, perEUR, live: !!liveRate };
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
  currencyFor,
};
