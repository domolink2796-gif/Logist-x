(function() {
    const getActiveLang = () => {
        try {
            const navLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
            // Если в системе телефона есть английский — выбираем его
            if (navLang.includes('en')) return 'en';
            // Иначе смотрим выбор в приложении
            return localStorage.getItem('app_lang') || 'ru';
        } catch(e) { return 'ru'; }
    };

    const coreSpeak = function(t) {
        const lang = getActiveLang();
        let textToSay = t;
        
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

        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(textToSay);
        m.lang = (lang === 'en') ? 'en-US' : 'ru-RU';
        m.rate = 0.95;
        window.speechSynthesis.speak(m);
    };

    window.pluginSpeak = coreSpeak;

    // Приветствие при первом клике
    document.addEventListener('click', function() {
        if (!window.wasGreeted) {
            coreSpeak("Система мерчендайзинга запущена. Удачной смены!");
            window.wasGreeted = true;
        }
    }, { once: true });
})();
