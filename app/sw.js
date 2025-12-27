/* LOGIST_X SERVICE WORKER v4.50 */
const CACHE_NAME = 'logistx-core-v450';
const OFFLINE_URL = 'index.html';

// Список файлов для кэширования при установке
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon-1024.png'
];

// Установка: создание кэша и принудительная активация
self.addEventListener('install', (event) => {
  console.log('[SW] Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация: очистка старых версий кэша
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate Event');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Перехват запросов: стратегия "Сначала сеть, потом кэш"
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
