// Модуль стабильных планограмм (из старой версии)
window.checkPlanogram = async function(addr) {
    const box = document.getElementById('plan-btn-box');
    if (!box) return;
    try {
        const response = await fetch(`${API}/get-planogram?addr=${encodeURIComponent(addr.trim())}&key=${encodeURIComponent(DATA.key)}&t=${Date.now()}`);
        const data = await response.json();
        if (data.exists) {
            box.innerHTML = `<button class="btn-blue" style="background:var(--accent); color:#000; padding:10px; font-size:12px; font-weight:bold; border-radius:12px;" onclick="window.open('${data.url}', '_blank')">СХЕМА ПЛАНОГРАММЫ</button>`;
        } else {
            box.innerHTML = `<label class="btn-blue" for="up-plan" style="background:#222; border:1px solid #333; padding:10px; font-size:12px;">📸 ПРИВЯЗАТЬ СХЕМУ</label><input type="file" id="up-plan" accept="image/*" capture="camera" class="hidden" onchange="uploadPlanogram(this)">`;
        }
    } catch (e) { console.error("Ошибка планограммы:", e); }
};
