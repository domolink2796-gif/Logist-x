(function() {
    console.log("🎤 Плагин приветствия (RU/EN) активен");

    // Функция самой озвучки
    function welcomeTalk(text, lang) {
        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(text);
        m.lang = lang === 'en' ? 'en-US' : 'ru-RU';
        m.rate = 0.95; 
        window.speechSynthesis.speak(m);
    }

    // Ждем, пока пользователь кликнет первый раз
    document.addEventListener('click', function() {
        if (!window.wasGreeted) {
            // Проверяем текущий язык из памяти
            const currentLang = localStorage.getItem('app_lang') || 'ru';
            
            let message = "Система мерчендайзинга запущена. Удачной смены!";
            if (currentLang === 'en') {
                message = "Merchandising system started. Have a good shift!";
            }

            welcomeTalk(message, currentLang);
            window.wasGreeted = true;
        }
    }, { once: true });

    console.log("✅ Ожидание клика. Язык приветствия привязан к настройкам системы.");
})();
