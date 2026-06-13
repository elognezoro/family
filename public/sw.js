/* EduWeb — Family & Coaching · Service Worker (PWA)
 * Stratégie :
 *  - Pages (navigations) : réseau d'abord → repli hors-ligne. On ne met JAMAIS
 *    en cache le HTML (contenu authentifié/dynamique) pour éviter de servir la
 *    page d'un autre utilisateur ou une version périmée.
 *  - Assets statiques same-origin (css/js/images/icônes/polices) :
 *    stale-while-revalidate (réponse immédiate depuis le cache, mise à jour en
 *    arrière-plan).
 *  - API, authentification, uploads, hors-origine (CDN) : toujours réseau.
 */
const VERSION = 'v1';
const STATIC_CACHE = 'eduweb-static-' + VERSION;
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  OFFLINE_URL,
  '/images/logo.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('eduweb-') && k !== STATIC_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Permet à la page de forcer l'activation d'un nouveau SW.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Hors origine (Google Fonts, Leaflet, CDN drapeaux) : laisser le navigateur gérer.
  if (url.origin !== self.location.origin) return;

  // Toujours réseau : contenu dynamique / sensible.
  if (url.pathname.startsWith('/api')
    || url.pathname.startsWith('/auth')
    || url.pathname.startsWith('/uploads')
    || url.pathname === '/sw.js') return;

  // Navigations (pages HTML) : réseau d'abord, repli hors-ligne.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Assets statiques same-origin : stale-while-revalidate.
  if (/\.(?:css|js|mjs|svg|png|jpe?g|webp|gif|ico|woff2?|ttf)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            if (res && res.status === 200 && res.type === 'basic') {
              cache.put(req, res.clone());
            }
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
