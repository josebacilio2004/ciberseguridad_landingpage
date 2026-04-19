/**
 * Forensic QR Scanner v1.1
 * Includes EMVCo (Yape/Plin) Parser for Human-Readable Analysis
 */

document.getElementById('qr-input')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const status = document.getElementById('qr-status');
    const resultDiv = document.getElementById('qr-result');
    status.textContent = "Analizando estructura EMVCo...";

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
                displayQRInfo(code.data);
            } else {
                status.textContent = "Error: No se detectó un código QR válido.";
                resultDiv.style.display = 'none';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

/**
 * Parsea la cadena EMVCo para extraer campos clave
 */
function parseEMVCo(data) {
    const fields = {};
    let i = 0;
    while (i < data.length) {
        const id = data.substring(i, i + 2);
        const length = parseInt(data.substring(i + 2, i + 4));
        const value = data.substring(i + 4, i + 4 + length);
        fields[id] = value;
        i += 4 + length;
    }
    return fields;
}

function displayQRInfo(data) {
    const resultDiv = document.getElementById('qr-result');
    const status = document.getElementById('qr-status');
    
    resultDiv.style.display = 'block';
    status.textContent = "Análisis Técnico Completado";

    const fields = parseEMVCo(data);
    
    // Diccionario de categorías comunes
    const mccList = { "4829": "Transferencia de Fondos / Giros", "6011": "Cajero Automático", "5812": "Restaurante" };
    
    let infoHTML = `
        <h4 style="color: var(--secondary); margin-bottom: 1rem;">[+] ESTRUCTURA DETECTADA: EMVCo (PAGO DIGITAL)</h4>
        <div style="display: grid; gap: 0.8rem; font-size: 0.9rem;">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                <span style="color: var(--text-dim);">Entidad / Titular:</span><br>
                <strong style="font-size: 1.1rem; color: #fff;">${fields['59'] || 'No identificado'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><span style="color: var(--text-dim);">Ciudad:</span> <strong>${fields['60'] || 'PE'}</strong></span>
                <span><span style="color: var(--text-dim);">País:</span> <strong>${fields['58'] || 'PE'}</strong></span>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
                <span style="color: var(--text-dim);">Categoría de Comercio (MCC):</span><br>
                <span style="color: #ff0;">${fields['52'] ? (mccList[fields['52']] || fields['52']) : 'Desconocido'}</span>
            </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(244, 63, 94, 0.1); border-radius: 8px; border-left: 4px solid var(--accent);">
            <p style="font-size: 0.8rem; color: var(--accent); font-weight: 800;">ALERTA DE INTELIGENCIA:</p>
            <p style="font-size: 0.85rem; margin-top: 0.3rem;">
                ${fields['59']?.includes('P2P') ? 'Este QR corresponde a una transferencia Personal (P2P). Si se presenta como un negocio formal, podría tratarse de una CUENTA MULA.' : 'Verifica que el nombre del titular coincida con el destinatario real.'}
            </p>
        </div>

        <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; font-size: 0.8rem;" onclick="copyRawQR('${data}')">Copiar Cadena Cruda</button>
    `;

    resultDiv.innerHTML = infoHTML;
    
    // Autocompletar el campo de sospechoso en el formulario si está presente
    const suspectInput = document.getElementById('rep-sospechoso');
    if (suspectInput) {
        suspectInput.value = `${fields['59'] || ''} (Detectado vía QR)`;
    }
}

window.copyRawQR = (data) => {
    navigator.clipboard.writeText(data);
    alert("Cadena copiada al portapapeles para análisis forense externo.");
};
