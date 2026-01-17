// plugin-lang.js - Единый центр управления языком

const LANG_DATA = {
    'ru': {
        // --- ГЛАВНАЯ (index.html) ---
        'h1_main': 'КОНТРОЛЬ ПОЛЕВОГО ПЕРСОНАЛА',
        'desc_main': 'Единая экосистема для логистики, мерчандайзинга и расклейки объявлений. GPS-контроль, фотоотчеты и автоматизация выплат.',
        'btn_login': 'ВОЙТИ В СИСТЕМУ',
        'btn_buy': 'КУПИТЬ ЛИЦЕНЗИЮ',
        'sec_calc': 'КАЛЬКУЛЯТОР ЛИЦЕНЗИИ',
        'lbl_name': 'Название компании',
        'lbl_staff': 'Количество сотрудников',
        'lbl_months': 'Период (месяцев)',
        'voice_welcome': 'Добро пожаловать в икс платформ. Система контроля активирована.',

        // --- MERCH INFO (merch-info.html) ---
        'merch_h1': 'О системе MERCH_X',
        'merch_prob_title': 'Проблема: «Слепая» зона',
        'merch_prob_desc': 'Мерчендайзеры часто не видят реальной картины на полке, а отчеты заполняются "на глаз".',
        'merch_sol_title': 'Решение: Нейросеть',
        'merch_sol_desc': 'Наша нейросеть анализирует фото, считает фейсинг и долю полки с точностью 99%.',
        'btn_install_merch': 'Установить MERCH_X',
        'voice_merch_install': 'Перехожу к установке рабочей версии. Нажмите кнопку поделиться и выберите на экран домой.',

        // --- SUCCESS (success.html) ---
        'success_h1': 'КОМАНДНЫЙ ДОСТУП',
        'success_desc': 'Оплата прошла успешно. Лицензия активирована.',
        'lbl_your_key': 'Ваш ключ доступа:',
        'btn_to_cabinet': 'В ЛИЧНЫЙ КАБИНЕТ',
        'voice_success': 'Оплата прошла успешно. Скопируйте ключ доступа и введите его в личном кабинете.',

        // --- БЛОГИ И ОБЩЕЕ ---
        'nav_home': 'На Главную',
        'blog_read_more': 'Читать далее',
        'footer_rights': '© 2026 LOGIST_X Inc. Все права защищены.',
        'voice_lang_switched': 'Язык переключен на русский.'
    },
    'en': {
        // --- MAIN (index.html) ---
        'h1_main': 'FIELD STAFF CONTROL SYSTEM',
        'desc_main': 'Unified ecosystem for logistics, merchandising, and distribution. GPS tracking, photo reports, and automated payroll.',
        'btn_login': 'SYSTEM LOGIN',
        'btn_buy': 'BUY LICENSE',
        'sec_calc': 'LICENSE CALCULATOR',
        'lbl_name': 'Company Name',
        'lbl_staff': 'Number of Employees',
        'lbl_months': 'Period (Months)',
        'voice_welcome': 'Welcome to X Platform. Control system activated.',

        // --- MERCH INFO ---
        'merch_h1': 'About MERCH_X',
        'merch_prob_title': 'Problem: The "Blind" Spot',
        'merch_prob_desc': 'Merchandisers often miss the real shelf picture, and reports are filled out by guesswork.',
        'merch_sol_title': 'Solution: Neural Network',
        'merch_sol_desc': 'Our AI analyzes photos, counts facings, and shelf share with 99% accuracy.',
        'btn_install_merch': 'Install MERCH_X',
        'voice_merch_install': 'Switching to installation mode. Tap share and select Add to Home Screen.',

        // --- SUCCESS ---
        'success_h1': 'TEAM ACCESS',
        'success_desc': 'Payment successful. License activated.',
        'lbl_your_key': 'Your Access Key:',
        'btn_to_cabinet': 'TO PERSONAL CABINET',
        'voice_success': 'Payment successful. Copy your access key and enter it in the personal cabinet.',

        // --- BLOGS & COMMON ---
        'nav_home': 'Home',
        'blog_read_more': 'Read More',
        'footer_rights': '© 2026 LOGIST_X Inc. All rights reserved.',
        'voice_lang_switched': 'Language switched to English.'
    }
};

// --- ЛОГИКА ---
function initLang() {
    const lang = localStorage.getItem('x_lang') || 'ru';
    document.documentElement.lang = lang;
    updateText(lang);
    
    // Обновляем текст на кнопке языка
    const btnText = document.getElementById('lang-btn-text');
    if(btnText) btnText.innerText = lang.toUpperCase();
}

function updateText(lang) {
    const dict = LANG_DATA[lang];
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (dict[key]) {
            if (el.tagName === 'INPUT') el.placeholder = dict[key];
            else el.innerText = dict[key];
        }
    });
}

function toggleLang() {
    const current = localStorage.getItem('x_lang') || 'ru';
    const next = current === 'ru' ? 'en' : 'ru';
    localStorage.setItem('x_lang', next);
    initLang();
    
    // Говорим о смене языка
    speak('voice_lang_switched', next);
}

// Умный голос
window.speak = function(text, forceLang) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const lang = forceLang || localStorage.getItem('x_lang') || 'ru';
    
    // Если передан ключ словаря, берем перевод. Если нет — читаем как есть.
    const finalTx = LANG_DATA[lang][text] || text; 
    
    const msg = new SpeechSynthesisUtterance(finalTx);
    msg.lang = lang === 'ru' ? 'ru-RU' : 'en-US';
    msg.rate = 1.1;
    window.speechSynthesis.speak(msg);
}

document.addEventListener('DOMContentLoaded', initLang);
