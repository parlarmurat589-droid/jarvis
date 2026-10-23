const CACHE_NAME = 'jarvis-offline-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Uygulama yüklendiğinde dosyaları hafızaya kaydet
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// İnternet yoksa hafızadaki (cache) dosyaları getir
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Çevrimdışı ve önbellekte yoksa index.html'i ver
        return caches.match('./index.html');
      });
    })
  );
});
