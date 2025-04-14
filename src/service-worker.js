self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('navcerti-cache-v1').then(cache => {
        return cache.addAll([
          './index.html',
          './style/style.css',
          './assets/icons/icon-192x192.png',
          './assets/icons/icon-512x512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  });
  