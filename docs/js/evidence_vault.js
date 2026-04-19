/**
 * Evidence Vault & Certification v1.0
 * Generates SHA-256 Hashes and Official PDF Certificates
 */

let currentFileData = {
    name: "",
    size: 0,
    hash: "",
    timestamp: ""
};

document.getElementById('vault-input')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const status = document.getElementById('vault-status');
    const resultDiv = document.getElementById('vault-result');
    const hashOutput = document.getElementById('hash-output');

    status.textContent = "Calculando huella digital (SHA-256)...";

    // Leer archivo y calcular HASH
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Guardar metadata
    currentFileData = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        hash: hashHex,
        timestamp: new Date().toLocaleString()
    };

    hashOutput.textContent = hashHex;
    resultDiv.style.display = 'block';
    status.textContent = "Archivo procesado con éxito.";
});

/**
 * Genera el PDF con diseño de Acta Oficial
 */
function downloadCertificate() {
    if (!currentFileData.hash) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // --- DISEÑO DE ACTA OFICIAL ---
    // Borde de seguridad
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    doc.rect(12, 12, 186, 273);

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ACTA DE CERTIFICACIÓN DE EVIDENCIA DIGITAL", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("LABORATORIO DE CIBERSEGURIDAD AVANZADA - DEFENSA DIGITAL", 105, 38, { align: "center" });
    doc.line(30, 42, 180, 42);

    // Cuerpo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.text("1. INFORMACIÓN DEL ARCHIVO CERTIFICADO", 25, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`Nombre del Archivo: ${currentFileData.name}`, 30, y); y += 8;
    doc.text(`Tamaño: ${currentFileData.size}`, 30, y); y += 8;
    doc.text(`Fecha/Hora de Procesamiento: ${currentFileData.timestamp}`, 30, y);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("2. IMPRONTA DIGITAL (HASH INTEGRITY)", 25, y);
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    y += 10;
    const splitHash = doc.splitTextToSize(currentFileData.hash, 150);
    doc.text(splitHash, 30, y);

    y += 30;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("3. DECLARACIÓN DE NO ALTERACIÓN", 25, y);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    y += 10;
    const legalText = "Se certifica que el archivo arriba mencionado posee la impronta digital (hash) descrita. Cualquier alteración de un solo bit en el contenido original del archivo resultará en un hash diferente, invalidando esta certificación. Este documento sirve como prueba de integridad inicial ante autoridades policiales y judiciales.";
    doc.text(doc.splitTextToSize(legalText, 160), 30, y);

    // Sellos/Firmas (Visuales)
    y = 220;
    doc.setFont("helvetica", "normal");
    doc.line(60, y, 150, y);
    doc.text("Sello de Integridad Digital", 105, y + 5, { align: "center" });
    doc.text("Defensa Digital v4.0", 105, y + 10, { align: "center" });

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Verifique este hash usando herramientas estándar como CertUtil o OpenSSL.", 105, 270, { align: "center" });

    doc.save(`acta-evidencia-${currentFileData.name.split('.')[0]}.pdf`);
}
