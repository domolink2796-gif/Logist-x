(function() {
    console.log("🛠️ Plugin PDF-Fix: Командная синхронизация + PDF контроль");

    // --- БЛОК 1: СИНХРОНИЗАЦИЯ (Катя + Ваня + Семён) ---

    // Загрузка данных всей команды с сервера
    window.fetchShopStock = async function(addr) { 
        if(!DATA.key) return; 
        try { 
            const res = await fetch(`${API}/get-shop-stock?key=${DATA.key}&addr=${encodeURIComponent(addr)}`); 
            if(res.ok) { 
                const teamData = await res.json(); 
                if (teamData && teamData.length > 0) {
                    window.CURRENT_ITEMS = teamData.map(i => ({ 
                        bc: i.bc, 
                        name: i.name, 
                        shelf: parseInt(i.shelf) || 0, 
                        stock: parseInt(i.stock) || 0 
                    })); 
                }
                if (typeof refreshList === 'function') refreshList(); 
            } 
        } catch(e) { console.error("Ошибка загрузки командных данных"); } 
    };

    // Моментальная отправка каждой правки в облако
    const originalUpdateVal = window.updateVal;
    window.updateVal = function(bc, f, v) {
        if (originalUpdateVal) originalUpdateVal.apply(this, arguments);
        const itm = CURRENT_ITEMS.find(x => x.bc === bc);
        if (itm && window.cur) {
            fetch(`${API}/save-partial-stock`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ key: DATA.key, addr: window.cur.addr, item: itm })
            }).catch(e => console.warn("Облако временно недоступно"));
        }
    };

    // Перехват открытия окна (обновляем данные при входе)
    const originalOpenModal = window.openModal;
    window.openModal = function(id) {
        originalOpenModal.apply(this, arguments);
        if (window.cur && !window.cur.done) {
            window.fetchShopStock(window.cur.addr);
        }
    };

    // --- БЛОК 2: ФОРМИРОВАНИЕ PDF ---

    const originalSaveToQueue = window.saveToQueue;
    window.saveToQueue = async function() {
        console.log("📸 Подготовка PDF из командных данных...");
        
        // Принудительно пересчитываем суммы перед снимком
        let totalShelf = 0;
        let totalStock = 0;
        CURRENT_ITEMS.forEach(i => {
            totalShelf += (parseInt(i.shelf) || 0);
            totalStock += (parseInt(i.stock) || 0);
        });

        // Заполняем шаблон PDF данными из CURRENT_ITEMS (теперь там точно не 0)
        document.getElementById('p-faces-val').innerText = totalShelf;
        document.getElementById('p-stock-val').innerText = totalStock;
        document.getElementById('p-share-big').innerText = document.getElementById('share-val').innerText + "%";
        
        // Список товаров для PDF
        const listContainer = document.getElementById('p-items-list');
        listContainer.innerHTML = CURRENT_ITEMS.map((i, idx) => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:2px 0; font-size:11px;">
                <span>${idx+1}. <b>${i.name}</b></span>
                <span>П: ${i.shelf} / С: ${i.stock}</span>
            </div>`).join('');

        // Вызываем основной процесс генерации PDF и отправки
        return originalSaveToQueue.apply(this, arguments);
    };

    console.log("✅ Плагин PDF-Fix успешно обновлен: Командный режим активен");
})();
