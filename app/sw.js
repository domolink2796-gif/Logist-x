const CACHE_NAME = 'logistx-v1';

// При установке активируемся сразу
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Захватываем управление вкладками сразу
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// --- ГЛАВНЫЙ БЛОК: ОБРАБОТКА ЗАПРОСОВ ---
self.addEventListener('fetch', (event) => {
    // Пропускаем запросы к API (чтобы не кэшировать отправку отчетов, только интерфейс)
    if (event.request.url.includes('/upload') || event.request.url.includes('/api')) {
        return; 
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Если интернет есть, делаем копию страницы в кэш
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // ЕСЛИ ИНТЕРНЕТА НЕТ — достаем сохраненную версию из памяти
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Если это переход по страницам (навигация), а в кэше нет — отдаем корень
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
