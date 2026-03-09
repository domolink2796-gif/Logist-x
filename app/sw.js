const CACHE_NAME = 'logistx-smart-cache-v1';

// 1. Установка: сразу активируем воркер
self.addEventListener('install', () => self.skipWaiting());

// 2. Активация: вот тут добавлено "ухо" для чистки старых версий
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Если имя кэша не совпадает с текущим — удаляем его нафиг
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаляю старый кэш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. ГЛАВНАЯ ЛОГИКА: Сначала сеть, если сети нет — Кэш
self.addEventListener('fetch', (event) => {
    // API и загрузку фото не трогаем
    if (event.request.url.includes('/upload') || event.request.url.includes('/api')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Если интернет есть, обновляем копию в памяти
                if (response && response.status === 200) {
                    const responseCopy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseCopy);
                    });
                }
                return response;
            })
            .catch(() => {
                // ЕСЛИ ИНТЕРНЕТА НЕТ — отдаем из памяти
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    
                    // Если это навигация, а в кэше нет — корень
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html') || caches.match('./');
                    }
                });
            })
    );
});

// Слушаем команду на обновление из приложения
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') self.skipWaiting();
});
