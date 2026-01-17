(function() {
    let currentLang = localStorage.getItem('app_lang') || 'ru';

    const dictionary = {
        en: {
            "ЗАГРУЗИТЬ ПЛАН": "LOAD PLAN",
            "Поиск магазина...": "Search store...",
            "ТОЧЕК": "POINTS",
            "ВИЗИТОВ": "VISITS",
            "Ключ Лицензии": "License Key",
            "Твое Имя": "Your Name",
            "АКТИВИРОВАТЬ СИСТЕМУ": "ACTIVATE SYSTEM",
            "ОТКРЫТЬ ВИЗИТ": "START VISIT",
            "ОТПРАВИТЬ ОТЧЕТ": "SEND REPORT",
            "Адрес точки": "Store Address",
            "Общий Остаток": "Total Stock",
            "Наш Фейсинг": "Our Facing",
            "Цена (Наша)": "Price (Our)",
            "Цена (Конкур.)": "Price (Comp.)",
            "Всего на полке": "Shelf Total",
            "Доля %": "Share %",
            "Срок годности": "Expiry Date",
            "ДО": "BEFORE",
            "ПОСЛЕ": "AFTER",
            "ЦЕННИК": "PRICE",
            "ЗАКРЫТЬ": "CLOSE",
            "📸 ПОЛКА": "📸 SHELF",
            "📸 СКЛАД": "📸 STOCK",
            "РЕЖИМ СЧЕТА (+1)": "COUNT MODE (+1)",
            "🔄 НОВЫЙ ВИЗИТ": "🔄 NEW VISIT",
            "ПРОВЕРКА GPS...": "CHECKING GPS...",
            "Адрес подтверждён.": "Address confirmed.",
            "СОХРАНЕНИЕ...": "SAVING...",
            "В очереди:": "In queue:"
        }
    };

    window.translateUI = function() {
        if (currentLang === 'ru') return;
        const langData = dictionary[currentLang];

        // 1. Перевод кнопок и специальных меток
        document.querySelectorAll('.btn-blue, .scan-btn, .f-label, .s-t, #begin-btn').forEach(el => {
            let t = el.innerText.trim();
            if (langData[t]) el.innerText = langData[t];
        });

        // 2. Перевод текстовых узлов (чтобы не задеть INPUT)
        const taskModal = document.getElementById('task-modal');
        if (taskModal) {
            const walk = document.createTreeWalker(taskModal, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while(node = walk.nextNode()) {
                let t = node.nodeValue.trim();
                if (langData[t]) node.nodeValue = langData[t];
            }
        }

        // 3. Плейсхолдеры
        document.querySelectorAll('input').forEach(inp => {
            if (inp.placeholder && langData[inp.placeholder]) {
                inp.placeholder = langData[inp.placeholder];
            }
        });
    };

    // АВТО-ПЕРЕВОД ПРИ ИЗМЕНЕНИИ ОКНА (решает проблему с исчезновением кнопок)
    const observer = new MutationObserver(() => {
        if (currentLang === 'en') window.translateUI();
    });

    // Перехват озвучки
    const originalSpeak = window.speak;
    window.speak = function(text) {
        if (currentLang === 'en') {
            const msg = new SpeechSynthesisUtterance();
            let translatedText = text;
            if (text.includes("Проверяю адрес")) translatedText = "Checking location";
            if (text.includes("Адрес подтверждён")) translatedText = "Location confirmed";
            if (text.includes("Включите GPS")) translatedText = "Enable GPS";
            if (text.includes("Отчет готов")) translatedText = "Report ready";
            if (text.includes("Ок")) translatedText = "Done";
            msg.text = translatedText;
            msg.lang = 'en-US';
            window.speechSynthesis.speak(msg);
        } else if (originalSpeak) {
            originalSpeak(text);
        }
    };

    window.addEventListener('load', () => {
        const header = document.querySelector('.header');
        if (header) {
            const btn = document.createElement('div');
            btn.id = "lang-switcher";
            btn.innerText = currentLang.toUpperCase();
            btn.style = "position:absolute; top:20px; right:15px; background:rgba(255,255,255,0.05); border:1px solid #333; padding:6px 12px; border-radius:12px; font-size:11px; font-weight:900; color:#f59e0b; cursor:pointer; z-index:9999;";
            btn.onclick = () => {
                currentLang = currentLang === 'ru' ? 'en' : 'ru';
                localStorage.setItem('app_lang', currentLang);
                location.reload();
            };
            header.appendChild(btn);
        }
        
        // Запускаем слежку за модальным окном
        const modal = document.getElementById('task-modal');
        if (modal) observer.observe(modal, { childList: true, subtree: true });

        setTimeout(window.translateUI, 200);
    });
})();
