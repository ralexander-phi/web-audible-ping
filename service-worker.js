var dataCacheName = 'web-audible-ping-pwa';
var cacheName = 'web-audible-ping-pwa';
var filesToCache = [
  "/",
  "/web-audible-ping/",
  "/web-audible-ping/assets/icon/128x128.png",
  "/web-audible-ping/assets/icon/144x144.png",
  "/web-audible-ping/assets/icon/152x152.png",
  "/web-audible-ping/assets/icon/192x192.png",
  "/web-audible-ping/assets/icon/256x256.png",
  "/web-audible-ping/assets/fail.wav",
  "/web-audible-ping/assets/start.wav",
  "/web-audible-ping/assets/success.wav",
  "/web-audible-ping/assets/success.png",
  "/web-audible-ping/assets/ready.png",
  "/web-audible-ping/assets/failure.png",
  "/web-audible-ping/index.html",
  "/web-audible-ping/manifest.json",
  "/web-audible-ping/style.css",
  "/web-audible-ping/app.js",
  "/web-audible-ping/ping.js",
  "/web-audible-ping/service-worker.js",
  // Not this one, it must not be cached
  //"/web-audible-ping/pong.txt".
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
