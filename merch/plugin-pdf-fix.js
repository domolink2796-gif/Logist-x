(function() {
    console.log("📦 Плагин Stock-Fix: Режим восстановления данных активен");

    // Перехватываем открытие модалки, чтобы восстановить данные при повторном входе
    const originalOpenModal = window.openModal;

    window.openModal = async function(id) {
        // Сначала вызываем родную функцию, чтобы открылись окна
        originalOpenModal.apply(this, arguments);

        // Если визит уже был начат (повторный вход)
        if (cur.start && !cur.done) {
            console.log("🔄 Повторный вход в точку. Восстанавливаю насканированные данные...");
            
            // Если массив пуст, пробуем достать данные из архива IndexedDB
            if (window.db && (!window.CURRENT_ITEMS || window.CURRENT_ITEMS.length === 0)) {
                const tx = db.transaction("archive", "readonly");
                const store = tx.objectStore("archive");
                const request = store.get(cur.addr);

                request.onsuccess = (e) => {
                    const savedData = e.target.result;
                    if (savedData && savedData.items) {
                        window.CURRENT_ITEMS = savedData.items;
                        console.log("✅ Данные восстановлены из архива:", window.CURRENT_ITEMS);
                        if (typeof refreshList === 'function') refreshList();
                    } else {
                        // Если в архиве нет, тянем с сервера последние сохраненные
                        fetchShopStock(cur.addr);
                    }
                };
            }
        }
    };

    // Оставляем исправление функции загрузки с сервера (чтобы не было нулей)
    const originalFetch = window.fetchShopStock;
    window.fetchShopStock = async function(addr) {
        if(!DATA.key) return;
        try {
            const res = await fetch(`${API}/get-shop-stock?key=${DATA.key}&addr=${encodeURIComponent(addr)}`);
            if(res.ok) {
                const prev = await res.json();
                // ВАЖНО: берем реальные цифры из базы сервера
                window.CURRENT_ITEMS = prev.map(i => ({
                    bc: i.bc,
                    name: i.name,
                    shelf: parseInt(i.shelf) || 0,
                    stock: parseInt(i.stock) || 0
                }));
                if (typeof refreshList === 'function') refreshList();
            }
        } catch(e) {
            console.error("Ошибка Stock-Fix:", e);
        }
    };

    console.log("✅ Плагин Stock-Fix: Теперь данные сохраняются при повторном входе.");
})();
