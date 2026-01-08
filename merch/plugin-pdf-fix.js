(function() {
    console.log("🚀 Клиентский плагин: СУПЕР-СИНХРОНИЗАЦИЯ С КОНТРОЛЕМ");

    // Функция для уведомлений на экране телефона
    function showStatus(text, color) {
        let box = document.getElementById('sync-status-popup');
        if(!box) {
            box = document.createElement('div');
            box.id = 'sync-status-popup';
            box.style = 'position:fixed; top:10px; right:10px; padding:8px 15px; border-radius:10px; font-size:10px; font-weight:800; z-index:9999; color:#000; transition:all 0.3s;';
            document.body.appendChild(box);
        }
        box.innerText = text;
        box.style.background = color;
        box.style.opacity = '1';
        setTimeout(() => box.style.opacity = '0', 2000);
    }

    // Основная функция отправки с контролем ошибки
    window.sendToTableDirectly = async function(itm, retry = 0) {
        if (!itm || !window.cur || window.cur.done) return;
        
        try {
            const res = await fetch(`${API}/save-partial-stock`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    key: DATA.key, 
                    addr: window.cur.addr, 
                    item: itm, 
                    userName: DATA.name 
                })
            });

            if(res.ok) {
                console.log("✅ Таблица обновлена");
                showStatus("ТАБЛИЦА ОБНОВЛЕНА", "#00ff00"); // Зеленый
            } else {
                throw new Error("Ошибка сервера");
            }
        } catch (e) {
            console.error("📡 Ошибка связи:", e);
            showStatus("ОШИБКА СВЯЗИ...", "#ff3b30"); // Красный
            
            // Если не дошло, пробуем еще раз 1 раз через 3 секунды
            if (retry < 1) {
                setTimeout(() => window.sendToTableDirectly(itm, retry + 1), 3000);
            }
        }
    };

    // Перехват ручного изменения
    const originalUpdateVal = window.updateVal;
    window.updateVal = function(bc, f, v) {
        if (originalUpdateVal) originalUpdateVal.apply(this, arguments);
        const itm = CURRENT_ITEMS.find(x => x.bc === bc);
        if (itm) window.sendToTableDirectly(itm);
    };

    // Перехват сканирования
    const originalAddItem = window.addItem;
    window.addItem = function(bc, name, inc) {
        if (originalAddItem) originalAddItem.apply(this, arguments);
        const itm = CURRENT_ITEMS.find(i => i.bc === bc);
        if (itm) window.sendToTableDirectly(itm);
    };

    // Загрузка данных команды
    const originalOpenModal = window.openModal;
    window.openModal = function(id) {
        if (originalOpenModal) originalOpenModal.apply(this, arguments);
        if (window.cur && !window.cur.done) {
            // Подгружаем, что насканировали другие мерчи в этой точке
            fetch(`${API}/get-shop-stock?key=${DATA.key}&addr=${encodeURIComponent(window.cur.addr)}`)
                .then(r => r.json())
                .then(data => {
                    if(data.length > 0) {
                        window.CURRENT_ITEMS = data.map(i => ({bc:i.bc, name:i.name, shelf:i.shelf, stock:i.stock}));
                        if(typeof refreshList === 'function') refreshList();
                        showStatus("ДАННЫЕ ОБНОВЛЕНЫ", "#007aff"); // Синий
                    }
                }).catch(e => {});
        }
    };

    console.log("✅ Мобильный плагин с контролем связи готов");
})();
