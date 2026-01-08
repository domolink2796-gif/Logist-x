(function() {
    // 1. Стили для инструкции
    const styles = `
        .manual-btn { 
            background: #222; 
            color: #f59e0b; 
            border: 1px solid #f59e0b; 
            padding: 8px 15px; 
            border-radius: 10px; 
            font-size: 10px; 
            font-weight: 800; 
            cursor: pointer;
            margin: 10px 15px;
            display: inline-block;
        }
        .m-overlay { 
            position: fixed; inset: 0; background: rgba(0,0,0,0.95); 
            z-index: 3000; display: none; padding: 20px; 
            overflow-y: auto; color: #fff; font-family: sans-serif;
        }
        .m-content { max-width: 500px; margin: 0 auto; line-height: 1.6; }
        .m-header { color: #f59e0b; font-size: 1.5rem; font-weight: 900; margin-bottom: 20px; }
        .m-step { background: #111; padding: 15px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #222; }
        .m-step b { color: #007aff; display: block; margin-bottom: 5px; font-size: 14px; }
        .m-close { 
            background: #f59e0b; color: #000; padding: 15px; 
            text-align: center; border-radius: 15px; font-weight: 900; margin-top: 20px; 
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. HTML структура инструкции
    const manualHTML = `
        <div id="manual-overlay" class="m-overlay">
            <div class="m-content">
                <div class="m-header">ИНСТРУКЦИЯ LOGIST_X</div>
                
                <div class="m-step">
                    <b>1. НАЧАЛО РАБОТЫ</b>
                    Выберите магазин из списка. Если вы находитесь дальше 600 метров от точки, система не даст открыть визит (нужен GPS).
                </div>

                <div class="m-step">
                    <b>2. СКАНЕР И ЖИВАЯ ПАМЯТЬ</b>
                    Нажмите кнопку СКАНЕР. При каждом сканировании данные сразу улетают в Google Таблицу. Если вы выйдете из приложения, при повторном входе в этот магазин список товаров подгрузится автоматически.
                </div>

                <div class="m-step">
                    <b>3. РЕЖИМ СЧЕТА</b>
                    Если включен «РЕЖИМ СЧЕТА (+1)», каждое сканирование одного и того же товара прибавляет 1 единицу. Если выключен — сканер просто находит товар в списке.
                </div>

                <div class="m-step">
                    <b>4. ФОТО И ОТЧЕТ</b>
                    Сделайте 3 обязательных фото (ДО, ПОСЛЕ, ЦЕННИК). Только после этого кнопка «ОТПРАВИТЬ ОТЧЕТ» станет активной.
                </div>

                <div class="m-step">
                    <b>5. ОЧЕРЕДЬ ОТПРАВКИ</b>
                    Если интернета нет, отчет сохранится в память (иконка коробки вверху). Он отправится автоматически, когда появится связь.
                </div>

                <div class="m-close" onclick="document.getElementById('manual-overlay').style.display='none'">ПОНЯТНО</div>
            </div>
        </div>
    `;

    // 3. Добавление в интерфейс
    document.body.insertAdjacentHTML('beforeend', manualHTML);

    // Ждем загрузки DOM, чтобы вставить кнопку
    window.addEventListener('load', () => {
        const header = document.querySelector('.header');
        if (header) {
            const btn = document.createElement('div');
            btn.className = 'manual-btn';
            btn.innerText = '❓ КАК ПОЛЬЗОВАТЬСЯ';
            btn.onclick = () => {
                document.getElementById('manual-overlay').style.display = 'block';
            };
            header.appendChild(btn);
        }
    });
})();
