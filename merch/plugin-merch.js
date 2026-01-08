(function() {
    console.log("⏳ [CLIENT] Плагин синхронизации загружен...");

    // 1. Рисуем всплывашку статуса
    function showStatus(text, color) {
        let box = document.getElementById('sync-status-popup');
        if(!box) {
            box = document.createElement('div');
            box.id = 'sync-status-popup';
            box.style = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:15px; font-size:12px; font-weight:900; z-index:10000; color:#000; transition:0.3s; pointer-events:none; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.5);';
            document.body.appendChild(box);
        }
        box.innerText = text;
        box.style.background = color;
        box.style.opacity = '1';
        setTimeout(() => box.style.opacity = '0', 2500);
    }

    // 2. Функция отправки
    window.syncToGoogle = async function(itm) {
        if (!window.cur || !window.DATA || !window.DATA.key) return;
        
        showStatus("📡 СОХРАНЯЮ...", "#ffffff"); // Белая плашка

        try {
            const res = await fetch(`${window.API}/save-partial-stock`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    key: window.DATA.key, 
                    addr: window.cur.addr, 
                    item: itm, 
                    userName: window.DATA.name 
                })
            });
            
            if(res.ok) {
                showStatus("✅ ТАБЛИЦА ОБНОВЛЕНА", "#00ff00"); // Зеленая
            } else {
                showStatus("⚠️ ОШИБКА СЕРВЕРА", "#f59e0b");
            }
        } catch (e) {
            console.error(e);
            showStatus("🚫 НЕТ СЕТИ", "#ff3b30");
        }
    };

    // 3. Ждем загрузки и подключаемся
    window.addEventListener('load', function() {
        console.log("🚀 [CLIENT] Приложение готово. Внедряемся...");

        // Перехват добавления (сканер)
        if (window.addItem) {
            const originalAddItem = window.addItem;
            window.addItem = function(bc, name, inc) {
                originalAddItem.apply(this, arguments);
                setTimeout(() => {
                    const itm = (window.CURRENT_ITEMS || []).find(i => i.bc === bc);
                    if (itm) window.syncToGoogle(itm);
                }, 200);
            };
        }

        // Перехват изменения цифр (руками)
        if (window.updateVal) {
            const originalUpdate = window.updateVal;
            window.updateVal = function(bc, f, v) {
                originalUpdate.apply(this, arguments);
                if (window.syncTimeout) clearTimeout(window.syncTimeout);
                window.syncTimeout = setTimeout(() => {
                    const itm = (window.CURRENT_ITEMS || []).find(x => x.bc === bc);
                    if (itm) window.syncToGoogle(itm);
                }, 1000);
            };
        }
    });
})();
