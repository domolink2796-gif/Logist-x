(function() {
    console.log("🎤 Плагин Voice: Проверка связи...");

    // Функция, которая ищет поле поиска и вешает на него микрофон
    function injectVoice() {
        // Ищем поле поиска (в твоем мерче это обычно 'shop-search' или 'search-input')
        const searchInput = document.getElementById('shop-search') || document.querySelector('input[placeholder*="Поиск"]');
        
        if (searchInput && !document.getElementById('voice-btn')) {
            console.log("🎤 Поле найдено! Добавляю кнопку...");
            
            const micBtn = document.createElement('button');
            micBtn.id = 'voice-btn';
            micBtn.innerHTML = '🎤';
            micBtn.style = "margin-left: -35px; background: none; border: none; font-size: 18px; cursor: pointer; position: relative; z-index: 10;";
            
            // Вставляем кнопку сразу после поля поиска
            searchInput.after(micBtn);

            micBtn.onclick = (e) => {
                e.preventDefault();
                const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                
                if (!Recognition) {
                    alert("Голосовой ввод не поддерживается в этом браузере");
                    return;
                }

                const rec = new Recognition();
                rec.lang = 'ru-RU';
                
                micBtn.style.filter = "drop-shadow(0 0 5px red)"; // Подсветка при записи

                rec.onresult = (event) => {
                    const text = event.results[0][0].transcript;
                    searchInput.value = text;
                    // Вызываем событие ввода, чтобы список магазинов сразу отфильтровался
                    searchInput.dispatchEvent(new Event('input'));
                    micBtn.style.filter = "";
                };

                rec.onerror = () => {
                    micBtn.style.filter = "";
                    console.log("Ошибка записи");
                };

                rec.onend = () => {
                    micBtn.style.filter = "";
                };

                rec.start();
            };
        }
    }

    // Запускаем проверку каждые 2 секунды (на случай, если список магазинов еще грузится)
    const checkExist = setInterval(() => {
        injectVoice();
    }, 2000);

    // Остановим проверку через 20 секунд, чтобы не грузить телефон
    setTimeout(() => clearInterval(checkExist), 20000);
})();
