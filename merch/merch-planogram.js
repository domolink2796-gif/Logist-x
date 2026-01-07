// ВЕРСИЯ 2.0 - С ПОЛНОЙ ПРОВЕРКОЙ ОШИБОК
console.log("Модуль планограмм запущен...");

window.checkPlanogram = async function(addr) {
    const box = document.getElementById('plan-btn-box');
    if (!box) return;

    const currentAPI = 'https://logist-x-server-production.up.railway.app';
    const currentKey = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');

    try {
        const res = await fetch(`${currentAPI}/get-planogram?addr=${encodeURIComponent(addr)}&key=${encodeURIComponent(currentKey)}&t=${Date.now()}`);
        const d = await res.json();
        
        if (d.exists && d.url) {
            box.innerHTML = `<button class="btn-blue" style="background:#f59e0b; color:#000; font-weight:900; padding:15px; border-radius:15px; width:100%; border:none;" onclick="window.open('${d.url}', '_blank')">🖼️ ОТКРЫТЬ СХЕМУ</button>`;
        } else {
            box.innerHTML = `
                <label class="btn-blue" for="up-plan" style="background:#222; border:1px dashed #555; padding:15px; font-size:14px; display:block; text-align:center; border-radius:15px; color:#fff;">📸 ПРИВЯЗАТЬ НОВУЮ СХЕМУ</label>
                <input type="file" id="up-plan" accept="image/*" capture="camera" style="display:none;" onchange="uploadPlanogram(this)">`;
        }
    } catch (e) {
        console.error("Ошибка при поиске:", e);
    }
};

window.uploadPlanogram = async function(inp) {
    if (!inp.files[0]) return;
    
    const box = document.getElementById('plan-btn-box');
    const originalContent = box.innerHTML;
    box.innerHTML = '<div style="color:#f59e0b; font-weight:800; padding:15px; text-align:center;">⏳ СОХРАНЕНИЕ НА СЕРВЕР...</div>';
    
    const currentAPI = 'https://logist-x-server-production.up.railway.app';
    const currentKey = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');
    // Берем адрес либо из текущего объекта, либо из поля ввода
    const currentAddr = (window.cur && window.cur.addr) ? window.cur.addr : document.getElementById('inp-addr').value;

    if (!currentKey || !currentAddr) {
        alert("Ошибка: Не найден ключ или адрес магазина!");
        box.innerHTML = originalContent;
        return;
    }

    const r = new FileReader();
    r.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            c.width = 800; // Немного уменьшим размер для гарантии загрузки
            c.height = img.height * (800 / img.width);
            ctx.drawImage(img, 0, 0, c.width, c.height);
            
            const base64Image = c.toDataURL('image/jpeg', 0.6);

            try {
                const res = await fetch(`${currentAPI}/upload-planogram`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        addr: currentAddr,
                        key: currentKey,
                        image: base64Image
                    })
                });
                
                const result = await res.json();

                if (res.ok && result.success) {
                    alert("✅ УСПЕШНО: Схема сохранена!");
                    if (window.speak) speak("Схема сохранена");
                    // Ждем чуть дольше, чтобы Google Drive успел проиндексировать файл
                    setTimeout(() => checkPlanogram(currentAddr), 3000);
                } else {
                    alert("❌ ОШИБКА СЕРВЕРА: " + (result.error || "Неизвестная ошибка"));
                    box.innerHTML = originalContent;
                }
            } catch (err) {
                alert("❌ ОШИБКА СЕТИ: Сервер недоступен или плохой интернет");
                box.innerHTML = originalContent;
            }
        };
    };
    r.readAsDataURL(inp.files[0]);
};
