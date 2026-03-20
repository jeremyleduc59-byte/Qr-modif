const CACHE = 'qr-quantite-v1';
const ASSETS = [
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js',
  'https://cdn.jsdelivr.net/npm/bwip-js@3/dist/bwip-js-min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@800&display=swap'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(err) {
        console.log('Cache partiel:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(resp) {
        var clone = resp.clone();
        caches.open(CACHE).then(function(cache){ cache.put(e.request, clone); });
        return resp;
      }).catch(function() {
        return cached;
      });
    })
  );
});
