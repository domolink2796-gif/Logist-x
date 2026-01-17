(function() {
    window.pluginSpeak = function(t) {
        // 1. ПРИОРИТЕТ: сначала смотрим выбор в приложении, 
        // если его нет — берем язык системы телефона (первые 2 буквы: "ru", "en", "de"...)
        const savedLang = localStorage.getItem('app_lang');
        const systemLang = navigator.language.substring(0, 2).toLowerCase();
        const lang = savedLang || (systemLang === 'en' ? 'en' : 'ru');
        
        // 2. СЛОВАРЬ ПЕРЕВОДА (для системных фраз сканера и GPS)
        let textToSay = t;
        if (lang === 'en') {
            const dictionary = {
                "Проверяю адрес": "Checking store location",
                "Адрес подтверждён": "Location confirmed",
                "Включите GPS": "Please enable GPS",
                "Доступ запрещен. Вы далеко.": "Access denied. Too far",
                "Новый товар": "New item found",
                "Отчет готов": "Report is ready",
                "Ок": "Done"
            };
            
            // Если фраза есть в словаре — переводим
            for (let key in dictionary) {
                if (t.includes(key)) {
                    textToSay = dictionary[key];
                    break;
                }
            }
        }

        // 3. ОЗВУЧКА
        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(textToSay);
        
        // Устанавливаем голос: если язык телефона/системы английский — ставим US голос
        m.lang = (lang === 'en') ? 'en-US' : 'ru-RU';
        m.rate = 1.0;
        
        window.speechSynthesis.speak(m);
    };
    console.log("✅ Голос настроен: Система телефона + выбор в приложении");
})();
