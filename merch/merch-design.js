// Модуль ПРИНУДИТЕЛЬНОГО восстановления планограмм
console.log("Модуль планограмм: запуск глубокой проверки...");

async function checkPlanogram(addr) {
    const box = document.getElementById('plan-btn-box');
    if (!box) return;

    // 1. Очищаем адрес от лишних пробелов по краям, которые могли мешать поиску
    const cleanAddr = addr.trim();

    try {
        // 2. Добавляем параметр cache: "no-store", чтобы браузер НЕ брал старый ответ "файла нет"
        const res = await fetch(`${API}/get-planogram?addr=${encodeURIComponent(cleanAddr)}&key=${encodeURIComponent(DATA.key)}`, {
            cache: "no-store"
        });
        
        const d = await res.json();
        
        if (d.exists && d.url) {
            // 3. Если файл найден - рисуем большую заметную кнопку
            box.innerHTML = `
                <div style="padding: 10px; border: 2px solid var(--accent); border-radius: 12px; background: rgba(245, 158, 11, 0.1);">
                    <div style="font-size: 10px; color: var(--accent); margin-bottom: 8px; font-weight: 800;">ПЛАНОГРАММА НАЙДЕНА</div>
                    <button class="btn-blue" 
                            style="background:var(--accent); color:#000; padding:12px; font-weight:900;" 
                            onclick="window.open('${d.url}', '_blank')">
                        👁️ ПОСМОТРЕТЬ СХЕМУ
                    </button>
                </div>`;
            console.log("✅ Планограмма успешно подгружена для: " + cleanAddr);
        } else {
            // 4. Если сервер реально говорит, что файла нет - даем возможность привязать
            box.innerHTML = `
                <div style="opacity: 0.6;">
                    <span style="font-size: 10px; display: block; margin-bottom: 5px;">Схема не привязана</span>
                    <label class="btn-blue" for="up-plan" style="background:#222; border:1px dashed #444; padding:8px; font-size:10px;">
                        📸 ПРИВЯЗАТЬ ФОТО ПОЛКИ
                    </label>
                </div>
                <input type="file" id="up-plan" accept="image/*" capture="camera" class="hidden" onchange="uploadPlanogram(this)">`;
            console.log("ℹ️ Сервер ответил: файл отсутствует для этого адреса.");
        }
    } catch (e) {
        console.error("❌ Ошибка сети при запросе планограммы:", e);
        box.innerHTML = `<div style="color:var(--red); font-size:10px;">Ошибка связи с сервером схем</div>`;
    }
}
