alert("СВЯЗЬ ЕСТЬ! Модуль загружен");
/ МОДУЛЬ ПЛАНОГРАММ 3.0 (АВТО-ЗАМЕНА)
console.log("Logist_X: Модуль планограмм активирован");

(function() {
    // Ждем, когда страница полностью загрузится
    window.addEventListener('load', () => {
        console.log("Принудительная перепривязка кнопок...");
        
        // Перехватываем функции, чтобы старый код не мешал
        window.checkPlanogram = async function(addr) {
            const box = document.getElementById('plan-btn-box');
            if (!box) return;

            const api = 'https://logist-x-server-production.up.railway.app';
            const key = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');

            try {
                const res = await fetch(`${api}/get-planogram?addr=${encodeURIComponent(addr)}&key=${encodeURIComponent(key)}&t=${Date.now()}`);
                const d = await res.json();
                
                if (d.exists && d.url) {
                    box.innerHTML = `
                        <button class="btn-blue" style="background:#f59e0b !important; color:#000 !important; font-weight:900; padding:15px; border-radius:15px; width:100%; border:none; display:block; cursor:pointer;" onclick="window.open('${d.url}', '_blank')">
                            👁️ ОТКРЫТЬ СХЕМУ
                        </button>`;
                } else {
                    box.innerHTML = `
                        <label class="btn-blue" for="up-plan" style="background:#222 !important; border:1px dashed #555 !important; padding:15px; font-size:14px; display:block; text-align:center; border-radius:15px; color:#fff; cursor:pointer;">
                            📸 ПРИВЯЗАТЬ НОВУЮ СХЕМУ
                        </label>
                        <input type="file" id="up-plan" accept="image/*" capture="camera" style="display:none;" onchange="uploadPlanogram(this)">`;
                }
            } catch (e) { console.error("Ошибка планограммы:", e); }
        };

        window.uploadPlanogram = async function(inp) {
            if (!inp.files[0]) return;
            
            const api = 'https://logist-x-server-production.up.railway.app';
            const key = (window.DATA && window.DATA.key) ? window.DATA.key : localStorage.getItem('m_key');
            const addr = (window.cur && window.cur.addr) ? window.cur.addr : (document.getElementById('inp-addr') ? document.getElementById('inp-addr').value : '');

            const box = document.getElementById('plan-btn-box');
            const oldHtml = box.innerHTML;
            box.innerHTML = '<div style="color:#f59e0b; font-weight:800; padding:15px; text-align:center;">⏳ СОХРАНЕНИЕ...</div>';

            const r = new FileReader();
            r.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = async () => {
                    const c = document.createElement('canvas');
                    const ctx = c.getContext('2d');
                    c.width = 1000; c.height = img.height * (1000 / img.width);
                    ctx.drawImage(img, 0, 0, c.width, c.height);
                    
                    try {
                        const response = await fetch(`${api}/upload-planogram`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ addr: addr, key: key, image: c.toDataURL('image/jpeg', 0.6) })
                        });
                        const resData = await response.json();
                        if (resData.success) {
                            alert("✅ ГОТОВО: Схема сохранена!");
                            checkPlanogram(addr);
                        } else { 
                            alert("Ошибка сервера: " + resData.error); 
                            box.innerHTML = oldHtml;
                        }
                    } catch (err) { 
                        alert("Ошибка сети. Проверьте интернет."); 
                        box.innerHTML = oldHtml;
                    }
                };
            };
            r.readAsDataURL(inp.files[0]);
        };
    });
})();
