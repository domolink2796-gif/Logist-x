// Плагин для добавления кнопки "МАРШРУТ" в Merch_X
(function() {
    console.log("📍 Плагин Навигации запущен");

    function injectNavButtons() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            // Проверяем, не добавили ли мы уже кнопку, чтобы не дублировать
            if (card.querySelector('.plugin-nav-btn')) return;

            const addrElem = card.querySelector('.card-addr');
            const netElem = card.querySelector('.card-net');
            
            if (addrElem) {
                const address = addrElem.innerText;
                const network = netElem ? netElem.innerText : "";
                
                // Создаем контейнер для кнопок
                const btnContainer = document.createElement('div');
                btnContainer.className = 'plugin-nav-btn';
                btnContainer.style = "display: flex; gap: 8px; margin-top: 12px;";

                const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;

                btnContainer.innerHTML = `
                    <a href="${mapUrl}" target="_blank" style="flex: 1; background: #1a1a1a; border: 1px solid #333; color: white; text-decoration: none; padding: 10px; border-radius: 12px; font-size: 0.65rem; font-weight: 800; text-align: center; display: flex; align-items: center; justify-content: center; gap: 5px;">
                        <span>📍</span> КАРТА
                    </a>
                    <div style="flex: 2;"></div> 
                `;

                // Вставляем кнопку в карточку
                card.appendChild(btnContainer);
            }
        });
    }

    // Запускаем проверку каждые 2 секунды, чтобы кнопки появлялись при поиске или обновлении списка
    setInterval(injectNavButtons, 2000);
})();
