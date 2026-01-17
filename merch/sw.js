const CACHE_NAME = 'merch-v2-lang-smart'; // Поменял версию, чтобы сбросить старый кэш

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Удаляем все старые версии кэша (v1 и прочие), чтобы не было конфликтов
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Удаляем старый кэш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Не кэшируем запросы к серверу и API
    if (event.request.url.includes('/merch-upload') || 
        event.request.url.includes('/api') || 
        event.request.url.includes('/get-') ||
        event.request.url.includes('/save-')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Если файл получен из сети — обновляем кэш свежей версией
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Если СЕТИ НЕТ — только тогда берем из памяти
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
