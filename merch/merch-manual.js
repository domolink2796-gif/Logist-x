(function() {
    // 1. УМНОЕ ОПРЕДЕЛЕНИЕ ЯЗЫКА (Система телефона -> Память приложения)
    const getActiveLang = () => {
        try {
            const navLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
            // Если в системе телефона есть английский — выбираем его
            if (navLang.includes('en')) return 'en';
            // Иначе смотрим ручной выбор
            return localStorage.getItem('app_lang') || 'ru';
        } catch(e) { return 'ru'; }
    };

    const currentLang = getActiveLang();

    // Словарь для инструкции
    const manualDict = {
        ru: {
            btn: '❓ КАК ПОЛЬЗОВАТЬСЯ',
            header: 'ИНСТРУКЦИЯ LOGIST_X',
            close: 'ПОНЯТНО',
            steps: [
                { b: '1. НАЧАЛО РАБОТЫ', t: 'Выберите магазин из списка. Если вы находитесь дальше 600 метров от точки, система не даст открыть визит (нужен GPS).' },
                { b: '2. СКАНЕР И ЖИВАЯ ПАМЯТЬ', t: 'Нажмите кнопку СКАНЕР. При каждом сканировании данные сразу улетают в Google Таблицу. Если вы выйдете из приложения, список товаров подгрузится автоматически.' },
                { b: '3. РЕЖИМ СЧЕТА', t: 'Если включен «РЕЖИМ СЧЕТА (+1)», каждое сканирование прибавляет 1 единицу. Если выключен — сканер просто находит товар.' },
                { b: '4. ФОТО И ОТЧЕТ', t: 'Сделайте 3 обязательных фото (ДО, ПОСЛЕ, ЦЕННИК). Только после этого кнопка «ОТПРАВИТЬ ОТЧЕТ» станет активной.' },
                { b: '5. ОЧЕРЕДЬ ОТПРАВКИ', t: 'Если интернета нет, отчет сохранится в память (иконка коробки). Он отправится автоматически при появлении связи.' }
            ]
        },
        en: {
            btn: '❓ HOW TO USE',
            header: 'LOGIST_X MANUAL',
            close: 'UNDERSTOOD',
            steps: [
                { b: '1. GETTING STARTED', t: 'Select a store from the list. If you are further than 600m from the point, the system will not allow starting the visit (GPS required).' },
                { b: '2. SCANNER & LIVE MEMORY', t: 'Press the SCANNER button. Each scan sends data directly to Google Sheets. If you exit the app, the product list will reload automatically.' },
                { b: '3. COUNT MODE', t: 'If "COUNT MODE (+1)" is enabled, each scan adds 1 unit. If disabled, the scanner simply finds the item in the list.' },
                { b: '4. PHOTOS & REPORT', t: 'Take 3 mandatory photos (BEFORE, AFTER, PRICE). Only then the "SEND REPORT" button will become active.' },
                { b: '5. SENDING QUEUE', t: 'If there is no internet, the report stays in memory (box icon). It will be sent automatically once connection is restored.' }
            ]
        }
    };

    const t = manualDict[currentLang];

    // Стили
    const styles = `
        .manual-btn { background: #222; color: #f59e0b; border: 1px solid #f59e0b; padding: 8px 15px; border-radius: 10px; font-size: 10px; font-weight: 800; cursor: pointer; margin: 10px 15px; display: inline-block; }
        .m-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 3000; display: none; padding: 20px; overflow-y: auto; color: #fff; font-family: sans-serif; }
        .m-content { max-width: 500px; margin: 0 auto; line-height: 1.6; }
        .m-header { color: #f59e0b; font-size: 1.5rem; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; }
        .m-step { background: #111; padding: 15px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #222; }
        .m-step b { color: #007aff; display: block; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; }
        .m-close { background: #f59e0b; color: #000; padding: 15px; text-align: center; border-radius: 15px; font-weight: 900; margin-top: 20px; cursor: pointer; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // HTML структура
    const stepsHTML = t.steps.map(s => `
        <div class="m-step">
            <b>${s.b}</b>
            ${s.t}
        </div>
    `).join('');

    const manualHTML = `
        <div id="manual-overlay" class="m-overlay">
            <div class="m-content">
                <div class="m-header">${t.header}</div>
                ${stepsHTML}
                <div class="m-close" onclick="document.getElementById('manual-overlay').style.display='none'">${t.close}</div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', manualHTML);

    window.addEventListener('load', () => {
        const header = document.querySelector('.header');
        if (header) {
            const btn = document.createElement('div');
            btn.className = 'manual-btn';
            btn.innerText = t.btn;
            btn.onclick = () => {
                document.getElementById('manual-overlay').style.display = 'block';
            };
            header.appendChild(btn);
        }
    });
})();
