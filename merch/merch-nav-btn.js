(function() {
    // 1. УМНОЕ ОПРЕДЕЛЕНИЕ ЯЗЫКА (Система телефона -> Память приложения)
    const getActiveLang = () => {
        try {
            const navLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
            // Если в системе телефона есть английский — выбираем его
            if (navLang.includes('en')) return 'en';
            // Иначе смотрим ручной выбор в приложении
            return localStorage.getItem('app_lang') || 'ru';
        } catch(e) { return 'ru'; }
    };

    const currentLang = getActiveLang();
    
    // Тексты для кнопки навигации
    const navText = {
        ru: "📍 КАРТА / МАРШРУТ",
        en: "📍 MAP / ROUTE"
    };

    console.log(`📍 Плагин навигации активен. Язык: ${currentLang}`);

    function injectMapButtons() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            // Проверяем, нет ли уже нашей кнопки
            if (card.querySelector('.plugin-nav-container')) return;

            const addrElem = card.querySelector('.card-addr');
            const cityElem = card.querySelector('.card-city'); 
            
            if (addrElem) {
                const address = addrElem.innerText;
                const city = cityElem ? cityElem.innerText : "";
                
                // Создаем контейнер-обертку
                const navContainer = document.createElement('div');
                navContainer.className = 'plugin-nav-container';
                navContainer.style = "display: flex; gap: 8px; margin-top: 12px; position: relative; z-index: 100;";

                const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(city + ' ' + address)}`;

                // Создаем саму кнопку
                const mapBtn = document.createElement('a');
                mapBtn.href = mapUrl;
                mapBtn.target = "_blank";
                mapBtn.style = "flex: 1; background: #1a1a1a; border: 1px solid #444; color: white; text-decoration: none; padding: 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);";
                
                // Используем текст из нашего словаря в зависимости от языка
                mapBtn.innerHTML = navText[currentLang] || navText.ru;

                // Останавливаем событие, чтобы не открывался визит при клике на карту
                mapBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                navContainer.appendChild(mapBtn);
                
                // Пустой блок справа для баланса
                const spacer = document.createElement('div');
                spacer.style = "flex: 1; pointer-events: none;"; 
                navContainer.appendChild(spacer);

                card.appendChild(navContainer);
            }
        });
    }

    // Запускаем проверку списка
    setInterval(injectMapButtons, 1000);
})();
