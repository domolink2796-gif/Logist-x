(function() {
    console.log("📄 Плагин PDF-Fix: Настройка красивого отчета запущена");

    // Перехватываем функцию сохранения, чтобы сначала заполнить PDF-форму
    const originalSave = window.saveToQueue;

    window.saveToQueue = async function() {
        console.log("📝 Заполнение данных в PDF-шаблон...");

        // 1. Проверяем фотки (это у тебя уже есть, но продублируем для надежности)
        if(!IMGS.pre || !IMGS.post || !IMGS.price) return alert("Нужны все 3 фото для отчета!");

        const now = Date.now();
        const startT = new Date(cur.start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        const endT = new Date(now).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        let dur = Math.round((now - cur.start) / 60000); if(dur < 1) dur = 1;

        // 2. ВПИСЫВАЕМ ДАННЫЕ В PDF-RENDER (ТО, ЧЕГО НЕ ХВАТАЛО)
        document.getElementById('p-net-addr').innerText = `${cur.net} | ${cur.addr}`;
        document.getElementById('p-worker-val').innerText = DATA.name;
        document.getElementById('p-date-full').innerText = new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        document.getElementById('p-time-start').innerText = startT;
        document.getElementById('p-time-end').innerText = endT;
        document.getElementById('p-duration').innerText = dur;

        // Цифры
        document.getElementById('p-stock-val').innerText = document.getElementById('i-stock').value;
        document.getElementById('p-faces-val').innerText = document.getElementById('i-faces').value;
        document.getElementById('p-share-big').innerText = document.getElementById('share-val').innerText + "%";
        document.getElementById('p-our-price-val').innerText = document.getElementById('i-our-price').value + " ₽";
        document.getElementById('p-comp-price-val').innerText = document.getElementById('i-comp-price').value + " ₽";
        document.getElementById('p-exp-date-val').innerText = document.getElementById('i-exp-date').value || "—";

        // Список товаров (делаем красиво с проверкой)
        const listContainer = document.getElementById('p-items-list');
        if (window.CURRENT_ITEMS && CURRENT_ITEMS.length > 0) {
            listContainer.innerHTML = CURRENT_ITEMS.map((i, idx) => 
                `<div style="border-bottom:1px solid #eee; padding:2px 0;">${idx+1}. <b>${i.name}</b> <span style="float:right;">П: ${i.shelf} / С: ${i.stock}</span></div>`
            ).join('');
        } else {
            listContainer.innerHTML = "<i style='color:red;'>Товары не были отсканированы</i>";
        }

        // Фотографии в PDF
        document.getElementById('p-i1').src = IMGS.pre;
        document.getElementById('p-i2').src = IMGS.post;
        document.getElementById('p-i3').src = IMGS.price;

        console.log("✅ PDF-шаблон готов. Запускаю стандартное сохранение...");

        // Теперь вызываем родную функцию, которая сделает скриншот этого блока
        return originalSave.apply(this, arguments);
    };

    console.log("✅ Плагин PDF-Fix успешно перехватил управление");
})();
