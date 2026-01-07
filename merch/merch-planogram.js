// ФИНАЛЬНЫЙ МОДУЛЬ ПЛАНОГРАММ (Синхронизировано с Server.js)
console.log("Модуль планограмм запущен...");

// Функция генерации имени файла (в точности как на сервере)
function getSafeFileName(addr) {
    return addr.replace(/[^а-яёa-z0-9]/gi, '_') + ".jpg";
}

window.checkPlanogram = async function(addr) {
    const box = document.getElementById('plan-btn-box');
    if (!box) return;

    // Берем данные из системы
    const currentAPI = 'https://logist-x-server-production.up.railway.app';
    const currentKey = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');

    try {
        // Запрос к серверу
        const res = await fetch(`${currentAPI}/get-planogram?addr=${encodeURIComponent(addr)}&key=${encodeURIComponent(currentKey)}&t=${Date.now()}`);
        const d = await res.json();
        
        if (d.exists && d.url) {
            box.innerHTML = `
                <div style="border: 2px solid var(--accent); padding: 10px; border-radius: 15px; background: rgba(245, 158, 11, 0.05);">
                    <div style="font-size: 9px; color: var(--accent); font-weight: 800; margin-bottom: 5px;">ПЛАНОГРАММА НАЙДЕНА</div>
                    <button class="btn-blue" style="background:var(--accent); color:#000; font-weight:900;" onclick="window.open('${d.url}', '_blank')">
                        👁️ ПОСМОТРЕТЬ СХЕМУ
                    </button>
                </div>`;
        } else {
            box.innerHTML = `
                <label class="btn-blue" for="up-plan" style="background:#222; border:1px dashed #444; padding:15px; font-size:12px;">
                    📸 СДЕЛАТЬ ФОТО ЭТАЛОННОЙ ПОЛКИ
                </label>
                <input type="file" id="up-plan" accept="image/*" capture="camera" class="hidden" onchange="uploadPlanogram(this)">`;
        }
    } catch (e) {
        console.error("Ошибка планограммы:", e);
    }
};

window.uploadPlanogram = async function(inp) {
    if (!inp.files[0]) return;
    
    const box = document.getElementById('plan-btn-box');
    box.innerHTML = '<div style="color:var(--accent); font-weight:800; padding:10px;">⏳ ЗАГРУЗКА НА СЕРВЕР...</div>';
    
    const currentAPI = 'https://logist-x-server-production.up.railway.app';
    const currentKey = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');
    const currentAddr = (window.cur && window.cur.addr) ? window.cur.addr : addr;

    const r = new FileReader();
    r.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            // Делаем качественное сжатие для сервера
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
                        image: c.toDataURL('image/jpeg', 0.7)
                    })
                });
                
                if (res.ok) {
                    if (window.speak) speak("Схема привязана");
                    // Сразу обновляем кнопку на "Посмотреть"
                    setTimeout(() => checkPlanogram(currentAddr), 1500);
                } else {
                    alert("Ошибка сервера при сохранении");
                    checkPlanogram(currentAddr);
                }
            } catch (err) {
                alert("Ошибка сети");
                checkPlanogram(currentAddr);
            }
        };
    };
    r.readAsDataURL(inp.files[0]);
};
