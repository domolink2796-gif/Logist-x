// Модуль ПЛАНОГРАММ - Исправленная версия
console.log("Модуль планограмм: запуск...");

// Функция проверки
window.checkPlanogram = async function(addr) {
    const box = document.getElementById('plan-btn-box');
    if (!box) return;

    // Используем API из основного окна или напрямую, если основной не определен
    const currentAPI = window.API || 'https://logist-x-server-production.up.railway.app';
    const currentKey = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');

    try {
        const res = await fetch(`${currentAPI}/get-planogram?addr=${encodeURIComponent(addr.trim())}&key=${encodeURIComponent(currentKey)}&t=${Date.now()}`);
        const d = await res.json();
        
        if (d.exists && d.url) {
            box.innerHTML = `<button class="btn-blue" style="background:var(--accent); color:#000; padding:12px; font-weight:900; border-radius:14px;" onclick="window.open('${d.url}', '_blank')">🖼️ ОТКРЫТЬ СХЕМУ</button>`;
        } else {
            box.innerHTML = `
                <label class="btn-blue" for="up-plan" style="background:#222; border:1px solid #444; padding:12px; font-size:12px;">📸 ПРИВЯЗАТЬ СХЕМУ</label>
                <input type="file" id="up-plan" accept="image/*" capture="camera" class="hidden" onchange="uploadPlanogram(this)">`;
        }
    } catch (e) {
        console.error("Ошибка связи:", e);
    }
};

// Функция загрузки (фотографирования)
window.uploadPlanogram = async function(inp) {
    if (!inp.files[0]) return;
    
    const box = document.getElementById('plan-btn-box');
    box.innerHTML = '<div style="color:var(--accent); font-weight:800; font-size:14px; animation: blink 1s infinite;">⏳ СОХРАНЯЮ НА СЕРВЕР...</div>';
    
    const currentAPI = window.API || 'https://logist-x-server-production.up.railway.app';
    const currentKey = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');
    const currentAddr = (window.cur && window.cur.addr) ? window.cur.addr : document.getElementById('inp-addr').value;

    const r = new FileReader();
    r.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            c.width = 1000;
            c.height = img.height * (1000 / img.width);
            ctx.drawImage(img, 0, 0, c.width, c.height);
            
            try {
                const res = await fetch(`${currentAPI}/upload-planogram`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        addr: currentAddr,
                        key: currentKey,
                        image: c.toDataURL('image/jpeg', 0.6)
                    })
                });
                
                if (res.ok) {
                    speak("Схема сохранена");
                    setTimeout(() => checkPlanogram(currentAddr), 2000);
                } else {
                    box.innerHTML = '<div style="color:red;">ОШИБКА СЕРВЕРА</div>';
                    setTimeout(() => checkPlanogram(currentAddr), 3000);
                }
            } catch (err) {
                box.innerHTML = '<div style="color:red;">ОШИБКА СЕТИ</div>';
            }
        };
    };
    r.readAsDataURL(inp.files[0]);
};
