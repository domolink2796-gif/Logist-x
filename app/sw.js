const CACHE_NAME = 'logistx-smart-cache-v1';

// При установке ничего не кэшируем заранее, чтобы не привязываться к списку файлов
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// ГЛАВНАЯ ЛОГИКА: Сначала сеть, если сети нет — Кэш
self.addEventListener('fetch', (event) => {
    // API (загрузку фото) вообще не трогаем, это святое
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
                // ЕСЛИ ИНТЕРНЕТА НЕТ (глухой подвал) — отдаем из памяти
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    
                    // Если это навигация, а в кэше нет — корень (главная страница)
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html') || caches.match('./');
                    }
                });
            })
    );
});

// Слушаем команду на обновление, если она придет из приложения
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') self.skipWaiting();
});
