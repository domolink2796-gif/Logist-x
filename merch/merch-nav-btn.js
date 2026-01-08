(function() {
    console.log("📍 Плагин 'Чистая Навигация' активен");

    function injectMapButtons() {
        // Ищем все карточки магазинов
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            // Если кнопка карты уже есть в этой карточке, пропускаем
            if (card.querySelector('.map-link-btn')) return;

            const addrElem = card.querySelector('.card-addr');
            const cityElem = card.querySelector('.card-city'); // если есть город в разметке
            
            if (addrElem) {
                const address = addrElem.innerText;
                const city = cityElem ? cityElem.innerText : "";
                
                // Создаем контейнер для кнопок, чтобы они стояли в ряд
                const actionsContainer = document.createElement('div');
                actionsContainer.style = "display: flex; gap: 8px; margin-top: 12px;";

                // 1. Создаем кнопку КАРТА (только навигация)
                const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(city + ' ' + address)}`;
                const mapBtn = document.createElement('a');
                mapBtn.href = mapUrl;
                mapBtn.target = "_blank";
                mapBtn.className = "map-link-btn";
                mapBtn.style = "flex: 1; background: #222; border: 1px solid #444; color: white; text-decoration: none; padding: 10px; border-radius: 10px; font-size: 0.65rem; font-weight: 800; text-align: center; display: flex; align-items: center; justify-content: center; gap: 5px;";
                mapBtn.innerHTML = "📍 КАРТА";

                // 2. Находим родную кнопку открытия визита (обычно это вся карточка или её часть)
                // Чтобы не ломать логику приложения, мы просто добавляем кнопку КАРТА рядом
                card.appendChild(actionsContainer);
                actionsContainer.appendChild(mapBtn);
                
                // Переносим существующую логику открытия (если она была в карточке) в новую кнопку рядом
                // Или просто оставляем КАРТУ как дополнение.
            }
        });
    }

    // Следим за обновлением списка (например, при поиске)
    setInterval(injectMapButtons, 1500);
})();
