// Taux de change réels (base EUR) via open.er-api.com.
// - Cache en mémoire (TTL 12 h) + rafraîchissement non bloquant.
// - Repli automatique sur la table statique de geo-service si l'API échoue.
// Les valeurs renvoyées sont des "perEUR" : unités de devise pour 1 €.

let cache = { rates: null, ts: 0 };
let inflight = null;
const TTL = 1000 * 60 * 60 * 12; // 12 h
const API = 'https://open.er-api.com/v6/latest/EUR';

async function fetchRates() {
  if (typeof fetch !== 'function') return null; // environnement sans fetch
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(API, { signal: ctrl.signal });
    const data = await res.json();
    if (data && data.result === 'success' && data.rates) {
      cache = { rates: data.rates, ts: Date.now() };
      console.log(`[fx] Taux de change mis à jour (${Object.keys(data.rates).length} devises).`);
      return cache.rates;
    }
  } catch (e) {
    console.warn('[fx] Échec récupération des taux :', e.message);
  } finally {
    clearTimeout(timer);
  }
  return null;
}

// Déclenche un rafraîchissement si le cache est vide/périmé (non bloquant)
function ensureFresh() {
  const stale = !cache.rates || Date.now() - cache.ts > TTL;
  if (stale && !inflight) {
    inflight = fetchRates().finally(() => { inflight = null; });
  }
  return inflight;
}

function getRate(code) {
  return cache.rates ? cache.rates[code] : null;
}

function meta() {
  return {
    live: !!cache.rates,
    count: cache.rates ? Object.keys(cache.rates).length : 0,
    updatedAt: cache.ts ? new Date(cache.ts) : null,
  };
}

// Rafraîchissement initial (non bloquant) au chargement du module
ensureFresh();

module.exports = { ensureFresh, getRate, fetchRates, meta };
