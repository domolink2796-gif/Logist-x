const CACHE_NAME = 'merch-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Игнорируем запросы к серверу (отправка отчетов и проверка ключей)
    // Нам нужно кэшировать только оболочку (интерфейс)
    if (event.request.url.includes('/merch-upload') || event.request.url.includes('/api')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Если интернет есть, обновляем копию интерфейса в кэше
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Если интернета нет — достаем сохраненный интерфейс из памяти телефона
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Если зашли по адресу папки /merch/, отдаем главный файл
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
