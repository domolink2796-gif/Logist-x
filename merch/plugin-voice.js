(function() {
    // Функция для определения текущего рабочего языка
    const getActiveLang = () => {
        const savedLang = localStorage.getItem('app_lang');
        if (savedLang) return savedLang;
        
        // Если в приложении язык не выбран, берем язык системы телефона
        const systemLang = navigator.language || navigator.userLanguage;
        return systemLang.startsWith('en') ? 'en' : 'ru';
    };

    const coreSpeak = function(t) {
        const lang = getActiveLang();
        let textToSay = t;
        
        // Словарь перевода для системных фраз
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
        
        // Принудительная установка голоса под язык телефона/приложения
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

    console.log("✅ Голос синхронизирован. Текущий системный язык: " + navigator.language);
})();
