const API_PLANO = 'https://logist-x-server-production.up.railway.app';

async function checkPlanogram(addr) {
    const box = document.getElementById('plan-btn-box');
    if (!box || !DATA.key) return;

    try {
        const cleanAddr = addr.trim();
        const res = await fetch(`${API_PLANO}/get-planogram?addr=${encodeURIComponent(cleanAddr)}&key=${encodeURIComponent(DATA.key)}`);
        const d = await res.json();

        if (d.exists && d.url) {
            box.innerHTML = `<button class="btn-blue" style="background:var(--accent); color:#000; padding:10px; font-size:12px;" onclick="window.open('${d.url}', '_blank')">СХЕМА ПЛАНОГРАММЫ</button>`;
        } else {
            box.innerHTML = `
                <label class="btn-blue" for="up-plan" style="background:#222; border:1px solid #333; padding:10px; font-size:12px;">📸 ПРИВЯЗАТЬ СХЕМУ</label>
                <input type="file" id="up-plan" accept="image/*" capture="camera" class="hidden" onchange="uploadPlanogram(this)">
            `;
        }
    } catch (e) {
        console.error("Ошибка планограммы:", e);
    }
}

async function uploadPlanogram(inp) {
    if (!inp.files[0]) return;
    const box = document.getElementById('plan-btn-box');
    const originalContent = box.innerHTML;
    box.innerHTML = 'ЗАГРУЗКА...';

    const r = new FileReader();
    r.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            const maxW = 1000;
            c.width = maxW;
            c.height = img.height * (maxW / img.width);
            ctx.drawImage(img, 0, 0, c.width, c.height);

            try {
                const res = await fetch(`${API_PLANO}/upload-planogram`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        addr: cur.addr,
                        key: DATA.key,
                        image: c.toDataURL('image/jpeg', 0.6)
                    })
                });
                
                if (res.ok) {
                    speak("Схема привязана");
                    checkPlanogram(cur.addr); // Сразу обновляем кнопку на "ОТКРЫТЬ"
                } else {
                    alert("Ошибка сервера при загрузке");
                    box.innerHTML = originalContent;
                }
            } catch (err) {
                alert("Нет связи с сервером");
                box.innerHTML = originalContent;
            }
        };
    };
    r.readAsDataURL(inp.files[0]);
}
