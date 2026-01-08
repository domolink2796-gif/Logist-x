(function() {
    console.log("🚀 Запуск прямого контроля таблицы...");

    let lastDataHash = ""; // Для слежки за изменениями

    // Всплывающее окно статуса
    function showStatus(text, color) {
        let box = document.getElementById('sync-status-popup');
        if(!box) {
            box = document.createElement('div');
            box.id = 'sync-status-popup';
            box.style = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:15px; font-size:12px; font-weight:900; z-index:10000; color:#000; transition:0.3s; pointer-events:none; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.5);';
            document.body.appendChild(box);
        }
        box.innerText = text;
        box.style.background = color;
        box.style.opacity = '1';
        setTimeout(() => box.style.opacity = '0', 2000);
    }

    // Функция принудительной отправки всей текущей корзины магазина
    window.forceSyncToTable = async function() {
        if (!window.cur || !window.CURRENT_ITEMS || window.CURRENT_ITEMS.length === 0) return;
        
        // Считаем "отпечаток" данных, чтобы не слать одно и то же 100 раз
        const currentHash = JSON.stringify(window.CURRENT_ITEMS);
        if (currentHash === lastDataHash) return; 

        try {
            // Отправляем массив товаров целиком или по одному
            for (let itm of window.CURRENT_ITEMS) {
                await fetch(`${API}/save-partial-stock`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        key: DATA.key, 
                        addr: window.cur.addr, 
                        item: itm, 
                        userName: DATA.name 
                    })
                });
            }
            lastDataHash = currentHash;
            showStatus("✅ ТАБЛИЦА ОБНОВЛЕНА", "#00ff00");
        } catch (e) {
            console.error("Sync error:", e);
            showStatus("📡 ОШИБКА СЕТИ", "#ff3b30");
        }
    };

    // Запускаем "авто-пульс" — проверяем изменения каждые 5 секунд
    setInterval(() => {
        if (window.cur && !window.cur.done) {
            window.forceSyncToTable();
        }
    }, 5000);

    // Дополнительно вешаем на кнопку "Закрыть", чтобы точно ушло при выходе из карточки
    const originalClose = window.closeModal;
    window.closeModal = function() {
        window.forceSyncToTable();
        if (originalClose) originalClose.apply(this, arguments);
    };

    console.log("✅ Авто-синхронизация активна");
})();
