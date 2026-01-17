(function() {
    let currentLang = localStorage.getItem('app_lang') || 'ru';

    const dictionary = {
        en: {
            "ЗАГРУЗИТЬ ПЛАН": "LOAD PLAN",
            "Поиск магазина...": "Search store...",
            "Точек": "Points",
            "Визитов": "Visits",
            "Ключ Лицензии": "License Key",
            "Твое Имя": "Your Name",
            "АКТИВИРОВАТЬ СИСТЕМУ": "ACTIVATE SYSTEM",
            "ОТКРЫТЬ ВИЗИТ": "START VISIT",
            "ОТПРАВИТЬ ОТЧЕТ": "SEND REPORT",
            "АДРЕС ТОЧКИ": "ADDRESS",
            "ОБЩИЙ ОСТАТОК": "TOTAL STOCK",
            "НАШ ФЕЙСИНГ": "OUR FACING",
            "ЦЕНА (НАША)": "PRICE (OUR)",
            "ЦЕНА (КОНКУР.)": "PRICE (COMP.)",
            "ВСЕГО НА ПОЛКЕ": "SHELF TOTAL",
            "ДОЛЯ %": "SHARE %",
            "СРОК ГОДНОСТИ": "EXPIRY DATE",
            "ДО": "BEFORE",
            "ПОСЛЕ": "AFTER",
            "ЦЕННИК": "PRICE TAG",
            "ЗАКРЫТЬ": "CLOSE",
            "📸 ПОЛКА": "📸 SHELF",
            "📸 СКЛАД": "📸 STOCK",
            "РЕЖИМ СЧЕТА (+1)": "COUNT MODE (+1)",
            "🔄 НОВЫЙ ВИЗИТ": "🔄 NEW VISIT"
        }
    };

    // Исправление вёрстки через инъекцию стилей
    function injectFixStyles() {
        if (currentLang === 'ru') return;
        const style = document.createElement('style');
        style.id = "lang-fix-styles";
        style.innerHTML = `
            /* Фикс сетки полей ввода, чтобы текст не слипался */
            #report-block div[style*="display:grid"] {
                display: flex !important;
                flex-direction: column !important;
                gap: 5px !important;
                margin-bottom: 10px !important;
            }
            #report-block .f-label {
                margin-top: 5px !important;
                margin-bottom: 2px !important;
                height: auto !important;
                display: block !important;
            }
            #report-block input {
                margin-top: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.translateUI = function() {
        const langData = dictionary[currentLang];
        if (!langData) return;

        // Перевод всех элементов по тексту
        const elements = document.querySelectorAll('button, div, span, label, b');
        elements.forEach(el => {
            const txt = el.innerText.trim().toUpperCase();
            if (langData[txt]) {
                el.innerText = langData[txt];
            }
        });

        // Перевод плейсхолдеров
        document.querySelectorAll('input').forEach(inp => {
            if (inp.placeholder && langData[inp.placeholder.toUpperCase()]) {
                inp.placeholder = langData[inp.placeholder.toUpperCase()];
            }
        });
        
        injectFixStyles();
    };

    // Перехват озвучки
    const originalSpeak = window.speak;
    window.speak = function(text) {
        if (currentLang === 'en') {
            const msg = new SpeechSynthesisUtterance();
            let translatedText = text;
            if (text.includes("Проверяю адрес")) translatedText = "Checking address";
            if (text.includes("Адрес подтверждён")) translatedText = "Address confirmed";
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
            btn.innerText = currentLang.toUpperCase();
            btn.style = "position:absolute; top:20px; right:15px; background:#111; border:1px solid #222; padding:5px 12px; border-radius:10px; font-size:11px; font-weight:900; color:#f59e0b; cursor:pointer; z-index:1001;";
            btn.onclick = () => {
                currentLang = currentLang === 'ru' ? 'en' : 'ru';
                localStorage.setItem('app_lang', currentLang);
                location.reload();
            };
            header.appendChild(btn);
        }
        setTimeout(window.translateUI, 100);
    });
})();
