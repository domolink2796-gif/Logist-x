const CACHE_NAME = 'logist-x-elite-pro-v2';

// ВАЖНО: кэшируем и корень, и папку app, чтобы браузер видел ПРИЛОЖЕНИЕ целиком
const urlsToCache = [
  '../',                // Главная страница (лендинг)
  '../index.html',      // Файл лендинга
  './',                 // Папка app
  './index.html',       // Рабочий терминал
  './manifest.json',    // Мозги
  './icon-1024.png'     // Та самая иконка
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Elite Pro Cache: Все файлы (корень + app) сохранены');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
