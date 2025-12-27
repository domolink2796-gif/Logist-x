const CACHE_NAME = 'logist-x-elite-pro-v3';

// Список файлов, которые SW должен забрать в память телефона
// ВАЖНО: прописаны пути выхода из папки app в корень (../)
const urlsToCache = [
  './',                 // Сама папка app
  './index.html',       // Терминал (700+ строк)
  './manifest.json',    // Настройки PWA
  './icon-1024.png',    // Твоя главная иконка
  '../',                // Выход в корень (Лендинг)
  '../index.html'       // Файл лендинга
];

// Установка: сохраняем всё в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('LOGIST_X SW: КэшированиеElite Pro завершено');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация: удаляем старые версии кэша, если они были
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

// Fetch: работа в офлайне и быстрая загрузка иконки
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если файл есть в кэше — отдаем его, если нет — тянем из сети
        return response || fetch(event.request);
      })
  );
});
