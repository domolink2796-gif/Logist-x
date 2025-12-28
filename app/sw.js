const CACHE_NAME = 'logistx-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Просто пропускаем запросы, этого достаточно для установки PWA
    event.respondWith(fetch(event.request));
});
