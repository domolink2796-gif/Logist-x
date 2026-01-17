(function() {
    // 1. УМНОЕ ОПРЕДЕЛЕНИЕ ЯЗЫКА:
    // Сначала смотрим, выбирал ли пользователь язык вручную (localStorage).
    // Если нет — берем язык системы телефона.
    let currentLang = localStorage.getItem('app_lang');
    
    if (!currentLang) {
        const systemLang = navigator.language.substring(0, 2).toLowerCase();
        currentLang = (systemLang === 'en') ? 'en' : 'ru';
        // Сохраняем, чтобы при переходах между страницами язык не прыгал
        localStorage.setItem('app_lang', currentLang);
    }

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
            "Адрес подтверждён.": "Address confirmed."
        }
    };

    window.translateUI = function() {
        if (currentLang === 'ru') return;
        const langData = dictionary[currentLang];

        // Перевод кнопок и меток
        document.querySelectorAll('.btn-blue, .scan-btn, .f-label, .s-t, #begin-btn').forEach(el => {
            let t = el.innerText.trim();
            if (langData[t]) el.innerText = langData[t];
        });

        // Перевод текстовых узлов модалки
        const taskModal = document.getElementById('task-modal');
        if (taskModal) {
            const walk = document.createTreeWalker(taskModal, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while(node = walk.nextNode()) {
                let t = node.nodeValue.trim();
                if (langData[t]) node.nodeValue = langData[t];
            }
        }

        // Плейсхолдеры (поиск и т.д.)
        document.querySelectorAll('input').forEach(inp => {
            if (inp.placeholder && langData[inp.placeholder]) {
                inp.placeholder = langData[inp.placeholder];
            }
        });
    };

    // Слежка за изменениями (чтобы перевод не слетал)
    const observer = new MutationObserver(() => {
        if (currentLang === 'en') window.translateUI();
    });

    window.addEventListener('load', () => {
        const header = document.querySelector('.header');
        if (header) {
            const btn = document.createElement('div');
            btn.id = "lang-switcher";
            btn.innerText = currentLang.toUpperCase();
            btn.style = "position:absolute; top:20px; right:15px; background:rgba(255,255,255,0.05); border:1px solid #333; padding:6px 12px; border-radius:12px; font-size:11px; font-weight:900; color:#f59e0b; cursor:pointer; z-index:9999;";
            btn.onclick = () => {
                const newLang = currentLang === 'ru' ? 'en' : 'ru';
                localStorage.setItem('app_lang', newLang);
                location.reload();
            };
            header.appendChild(btn);
        }
        
        const modal = document.getElementById('task-modal');
        if (modal) observer.observe(modal, { childList: true, subtree: true });

        window.translateUI();
    });
})();
