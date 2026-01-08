(function() {
    console.log("🚀 Клиентский плагин: Синхронизация папок ВКЛЮЧЕНА");

    // 1. Функция получения данных (чтобы Ваня видел данные Кати)
    window.fetchShopStock = async function(addr) { 
        if(!DATA.key || !addr) return; 
        try { 
            const res = await fetch(`${API}/get-shop-stock?key=${DATA.key}&addr=${encodeURIComponent(addr)}`); 
            if(res.ok) { 
                const teamData = await res.json(); 
                if (teamData && teamData.length > 0) {
                    window.CURRENT_ITEMS = teamData.map(i => ({ 
                        bc: i.bc, name: i.name, shelf: parseInt(i.shelf) || 0, stock: parseInt(i.stock) || 0 
                    })); 
                }
                if (typeof refreshList === 'function') refreshList(); 
            } 
        } catch(e) { console.error("Ошибка загрузки данных команды"); } 
    };

    // 2. Функция отправки (создает таблицу в папке ПРИ ПЕРВОМ ИЗМЕНЕНИИ)
    const originalUpdateVal = window.updateVal;
    window.updateVal = function(bc, f, v) {
        if (originalUpdateVal) originalUpdateVal.apply(this, arguments);
        
        const itm = CURRENT_ITEMS.find(x => x.bc === bc);
        if (itm && window.cur && !window.cur.done) {
            // Отправляем на сервер сразу, чтобы он создал/обновил таблицу в папке
            fetch(`${API}/save-partial-stock`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    key: DATA.key, 
                    addr: window.cur.addr, 
                    item: itm, 
                    userName: DATA.name 
                })
            }).then(() => console.log("✅ Данные пика ушли на сервер"))
              .catch(e => console.error("📡 Ошибка отправки:", e));
        }
    };

    // 3. Перехват сканера (чтобы таблица создалась сразу как только пикнул)
    const originalAddItem = window.addItem;
    window.addItem = function(bc, name, inc) {
        if (originalAddItem) originalAddItem.apply(this, arguments);
        const itm = CURRENT_ITEMS.find(i => i.bc === bc);
        if (itm) {
            // Принудительно вызываем обновление, чтобы сработал fetch к серверу
            window.updateVal(bc, 'shelf', itm.shelf); 
        }
    };

    // 4. Загрузка данных при входе в магазин
    const originalOpenModal = window.openModal;
    window.openModal = function(id) {
        originalOpenModal.apply(this, arguments);
        if (window.cur && !window.cur.done) {
            window.fetchShopStock(window.cur.addr);
        }
    };

    console.log("✅ Клиентский плагин полностью готов");
})();
