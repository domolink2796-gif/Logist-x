/**
 * 🌍 MERCH_X Multi-Language Plugin
 * Поддерживает переключение интерфейса и голоса (RU/EN)
 */
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
            "ОТКРЫТЬ ОТЧЕТ": "OPEN REPORT",
            "ОТПРАВИТЬ ОТЧЕТ": "SEND REPORT",
            "Адрес точки": "Address",
            "Общий Остаток": "Total Stock",
            "Наш Фейсинг": "Our Facing",
            "Цена (Наша)": "Price (Our)",
            "Цена (Конкур.)": "Price (Comp.)",
            "Всего на полке": "Shelf Total",
            "Доля %": "Share %",
            "Срок годности": "Expiry Date",
            "ДО": "BEFORE",
            "ПОСЛЕ": "AFTER",
            "ЦЕННИК": "PRICE TAG",
            "ЗАКРЫТЬ": "CLOSE",
            "🔄 НОВЫЙ ВИЗИТ": "🔄 NEW VISIT",
            "РЕЖИМ СЧЕТА (+1)": "COUNT MODE (+1)",
            "📸 ПОЛКА": "📸 SHELF",
            "📸 СКЛАД": "📸 STOCK"
        }
    };

    // Функция перевода
    window.translateUI = function() {
        if (currentLang === 'ru') return;

        const langData = dictionary[currentLang];
        
        // 1. Перевод кнопок и спанов по тексту
        const elements = document.querySelectorAll('button, div, span, label, input');
        elements.forEach(el => {
            // Перевод текста
            if (langData[el.innerText.trim()]) {
                el.innerText = langData[el.innerText.trim()];
            }
            // Перевод плейсхолдеров
            if (el.placeholder && langData[el.placeholder]) {
                el.placeholder = langData[el.placeholder];
            }
        });

        // 2. Исправление меток (f-label)
        document.querySelectorAll('.f-label').forEach(el => {
            if (langData[el.innerText]) el.innerText = langData[el.innerText];
        });
    };

    // Перехват озвучки (Speak)
    const originalSpeak = window.speak;
    window.speak = function(text) {
        if (currentLang === 'en') {
            const msg = new SpeechSynthesisUtterance();
            // Простой маппинг ключевых фраз для голоса
            let translatedText = text;
            if (text.includes("Проверяю адрес")) translatedText = "Checking address";
            if (text.includes("Адрес подтверждён")) translatedText = "Address confirmed";
            if (text.includes("Включите GPS")) translatedText = "Enable GPS";
            if (text.includes("Отчет готов")) translatedText = "Report is ready";
            if (text.includes("Ок")) translatedText = "Okay";

            msg.text = translatedText;
            msg.lang = 'en-US';
            window.speechSynthesis.speak(msg);
        } else {
            originalSpeak(text);
        }
    };

    // Добавляем кнопку переключения в шапку
    window.addEventListener('load', () => {
        const header = document.querySelector('.header');
        if (header) {
            const btn = document.createElement('div');
            btn.innerText = currentLang.toUpperCase();
            btn.style = "position:absolute; top:20px; right:15px; background:var(--card); border:1px solid var(--border); padding:5px 10px; border-radius:8px; font-size:10px; font-weight:900; color:var(--accent); cursor:pointer;";
            btn.onclick = () => {
                currentLang = currentLang === 'ru' ? 'en' : 'ru';
                localStorage.setItem('app_lang', currentLang);
                location.reload();
            };
            header.appendChild(btn);
        }
        window.translateUI();
    });
})();
