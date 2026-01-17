(function() {
    // Внутренняя функция для работы с голосом
    const coreSpeak = function(t) {
        // 1. ПРИОРИТЕТ: Выбор в приложении -> Язык системы телефона
        const savedLang = localStorage.getItem('app_lang');
        const systemLang = navigator.language.substring(0, 2).toLowerCase();
        const lang = savedLang || (systemLang === 'en' ? 'en' : 'ru');
        
        let textToSay = t;
        
        // 2. СЛОВАРЬ ПЕРЕВОДА
        if (lang === 'en') {
            const dictionary = {
                "Проверяю адрес": "Checking store location",
                "Адрес подтверждён": "Location confirmed",
                "Включите GPS": "Please enable GPS",
                "Доступ запрещен. Вы далеко.": "Access denied. Too far",
                "Новый товар": "New item found",
                "Отчет готов": "Report is ready",
                "Ок": "Done",
                "Система мерчендайзинга запущена. Удачной смены!": "Merchandising system started. Have a good shift!"
            };
            
            for (let key in dictionary) {
                if (t.includes(key)) {
                    textToSay = dictionary[key];
                    break;
                }
            }
        }

        // 3. СИНТЕЗ РЕЧИ
        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(textToSay);
        m.lang = (lang === 'en') ? 'en-US' : 'ru-RU';
        m.rate = 0.95; // Чуть медленнее для четкости
        window.speechSynthesis.speak(m);
    };

    // Экспортируем функцию для основного кода (index.html)
    window.pluginSpeak = coreSpeak;

    // --- ПЛАГИН ПРИВЕТСТВИЯ ВНУТРИ ---
    // Браузеры требуют клика для активации звука
    document.addEventListener('click', function() {
        if (!window.wasGreeted) {
            coreSpeak("Система мерчендайзинга запущена. Удачной смены!");
            window.wasGreeted = true;
        }
    }, { once: true });

    console.log("✅ Умный голос и приветствие активны (RU/EN)");
})();
