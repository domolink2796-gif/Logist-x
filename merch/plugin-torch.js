(function() {
    console.log("🔦 Плагин 'Умный Фонарик (Датчик яркости)' запущен");

    async function setTorch(state) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.srcObject) {
                const track = video.srcObject.getVideoTracks()[0];
                if (track) {
                    const caps = track.getCapabilities();
                    if (caps.torch) {
                        track.applyConstraints({ advanced: [{ torch: state }] }).catch(() => {});
                    }
                }
            }
        });
    }

    // Функция замера яркости кадра
    function getBrightness(video) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100; // Нам достаточно маленького замера
        canvas.height = 100;
        
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let colorSum = 0;

            for (let x = 0; x < data.length; x += 4) {
                // Считаем среднюю яркость (R+G+B)/3
                colorSum += (data[x] + data[x+1] + data[x+2]) / 3;
            }
            return colorSum / (canvas.width * canvas.height);
        } catch (e) {
            return 255; // Если ошибка, считаем что светло
        }
    }

    const observer = new MutationObserver(() => {
        const reader = document.getElementById('reader');
        const isVisible = reader && (reader.style.display !== 'none' && getComputedStyle(reader).display !== 'none');
        
        if (isVisible) {
            // Проверяем, что это режим СКАНЕРА (по тексту на экране)
            const isScanner = document.body.innerText.includes('СКАНЕР') || document.body.innerText.includes('SCANNER');
            
            if (isScanner) {
                setTimeout(() => {
                    const video = reader.querySelector('video');
                    if (video) {
                        const brightness = getBrightness(video);
                        console.log("💡 Текущая яркость полки:", brightness);

                        // Если яркость меньше 40 (из 255), значит темно — включаем свет
                        if (brightness < 40) {
                            setTorch(true);
                        } else {
                            setTorch(false);
                        }
                    }
                }, 1000); // Даем камере секунду на автонастройку перед замером
            }
        } else {
            setTorch(false);
        }
    });

    observer.observe(document.body, { attributes: true, subtree: true, childList: true });
})();
