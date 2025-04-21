const CACHE_NAME = 'navcerti-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
];

// 📦 INSTALLATION : mise en cache initiale
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force l’activation immédiate
});

// 🔁 ACTIVATION : nettoyage des anciens caches si besoin
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Supprime ancien cache :', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 🌐 FETCH : intercepte les requêtes
self.addEventListener('fetch', (event) => {
  // On ne gère que les requêtes GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          new Response('⚠️ Impossible de charger la ressource hors ligne.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        )
      );
    })
  );
});
