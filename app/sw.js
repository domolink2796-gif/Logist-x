const CACHE_NAME = 'logist-x-elite-v1';

// Список файлов для кэширования (теперь всё локально в папке app)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-1024.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш открыт, сохраняем иконку и манифест');
        return cache.addAll(urlsToCache);
      })
  );
});

// Критически важно для появления кнопки "Установить" и иконки
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем файл из кэша, если он там есть, иначе идем в сеть
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
