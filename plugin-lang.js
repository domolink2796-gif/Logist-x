(function() {
    window.pluginSpeak = function(t) {
        // 1. Проверяем язык в памяти
        const lang = localStorage.getItem('app_lang') || 'ru';
        
        // 2. Переводим системные фразы на лету, если включен EN
        let textToSay = t;
        if (lang === 'en') {
            if (t.includes("Проверяю адрес")) textToSay = "Checking location";
            else if (t.includes("Адрес подтверждён")) textToSay = "Location confirmed";
            else if (t.includes("Включите GPS")) textToSay = "Please enable GPS";
            else if (t.includes("Доступ запрещен")) textToSay = "Access denied. Too far";
            else if (t.includes("Новый товар")) textToSay = "New item found";
            else if (t.includes("Отчет готов")) textToSay = "Report is ready";
            else if (t.includes("Ок")) textToSay = "Done";
        }

        // 3. Озвучиваем с правильным акцентом
        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(textToSay);
        
        // Устанавливаем голос: американский или русский
        m.lang = (lang === 'en') ? 'en-US' : 'ru-RU';
        m.rate = 1.0;
        
        window.speechSynthesis.speak(m);
    };
    console.log("✅ Голос плагина синхронизирован с RU/EN");
})();
