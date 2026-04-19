/**
 * Forensic QR Scanner v1.0
 * Uses jsQR library
 */

document.getElementById('qr-input')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const status = document.getElementById('qr-status');
    const resultDiv = document.getElementById('qr-result');
    status.textContent = "Procesando imagen...";

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                console.log("QR Detectado:", code.data);
                displayQRInfo(code.data);
            } else {
                status.textContent = "No se detectó código QR legal. Intente con otra toma.";
                resultDiv.style.display = 'none';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function displayQRInfo(data) {
    const resultDiv = document.getElementById('qr-result');
    const status = document.getElementById('qr-status');
    
    resultDiv.style.display = 'block';
    status.textContent = "¡Código QR Decodificado!";

    // Lógica para extraer datos si es un QR de pagos (EMVCo)
    let infoHTML = `<h4>Resultado del Análisis:</h4>
                   <p style="word-break: break-all; color: var(--secondary); font-family: 'JetBrains Mono'; margin-top: 1rem;">${data}</p>`;
    
    // Si contiene datos de mercante reconocibles
    if (data.includes('BCP') || data.includes('YAPE') || data.includes('PLIN')) {
        infoHTML += `<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                       <p style="color: #ff0;">[!] ALERTA: Identificado como Nodo de Pago Bancario.</p>
                       <p>Posible Cuenta Mula detectada. Se recomienda cruzar con el Buscador de Inteligencia.</p>
                     </div>`;
    }

    resultDiv.innerHTML = infoHTML;
    
    // Autocompletar el campo de sospechoso si detectamos algo (Opcional simplificado)
    if (document.getElementById('rep-sospechoso')) {
        document.getElementById('rep-sospechoso').value = "Detectado vía QR: [Ver logs de análisis]";
    }
}
