(function() {
    console.log("🎤 Плагин Voice: Приветствие при активации активно");

    // Функция приветствия
    function sayWelcome(name) {
        if (!name) return;
        const text = `Приветствую, ${name}. Лицензия подтверждена. Система Логист Икс готова к работе.`;
        
        // Используем твою функцию speak
        if (typeof speak === 'function') {
            speak(text);
        } else {
            const m = new SpeechSynthesisUtterance(text);
            m.lang = 'ru-RU';
            window.speechSynthesis.speak(m);
        }
    }

    // Следим за кнопкой активации
    function watchAuth() {
        const authBtn = document.querySelector('#auth-screen .btn-blue');
        const nameInput = document.getElementById('work-name');

        if (authBtn && nameInput) {
            // Добавляем свое действие на клик
            authBtn.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const key = document.getElementById('lic-key').value.trim();
                
                // Если поля заполнены, здороваемся (с небольшой задержкой для эффекта)
                if (name && key) {
                    setTimeout(() => sayWelcome(name), 1000);
                }
            });
            console.log("✅ Голос привязан к кнопке активации");
        }
    }

    // Проверяем наличие кнопки каждые 2 секунды, пока экран авторизации виден
    const authTimer = setInterval(() => {
        if (document.getElementById('auth-screen').style.display !== 'none') {
            watchAuth();
            clearInterval(authTimer);
        }
    }, 1000);
})();
