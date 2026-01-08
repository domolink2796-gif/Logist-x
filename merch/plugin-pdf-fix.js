(function() {
    console.log("📡 Плагин Stock-Fix: Связь с сервером установлена");

    // 1. ФУНКЦИЯ ЗАПРОСА ДАННЫХ С СЕРВЕРА
    window.fetchShopStock = async function(addr) { 
        if(!DATA.key) return; 
        
        console.log("📥 Запрос последних данных с сервера для:", addr);
        
        try { 
            // Запрашиваем данные именно по этому адресу
            const res = await fetch(`${API}/get-shop-stock?key=${DATA.key}&addr=${encodeURIComponent(addr)}`); 
            
            if(res.ok) { 
                const serverData = await res.json(); 
                
                if (serverData && serverData.length > 0) {
                    // Заполняем массив данными с сервера
                    window.CURRENT_ITEMS = serverData.map(i => ({ 
                        bc: i.bc, 
                        name: i.name, 
                        shelf: parseInt(i.shelf) || 0, 
                        stock: parseInt(i.stock) || 0 
                    })); 
                    console.log("✅ Данные получены:", window.CURRENT_ITEMS);
                } else {
                    console.log("ℹ️ На сервере пока нет данных по этой точке.");
                }

                // Перерисовываем список на экране
                if (typeof refreshList === 'function') refreshList(); 
            } 
        } catch(e) { 
            console.error("❌ Ошибка связи с сервером:", e); 
        } 
    };

    // 2. ПЕРЕХВАТ ОТКРЫТИЯ МОДАЛКИ
    // Как только ты нажимаешь на магазин - плагин сразу бежит на сервер за данными
    const originalOpenModal = window.openModal;
    window.openModal = function(id) {
        // Вызываем стандартное открытие
        originalOpenModal.apply(this, arguments);

        // Если это не архивный (уже закрытый) визит, то тянем свежие данные
        if (window.cur && !window.cur.done) {
            window.fetchShopStock(window.cur.addr);
        }
    };
})();
