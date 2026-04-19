/**
 * Generador de Reportes PDF v1.0
 * Utiliza jsPDF (vía CDN)
 */

function downloadDenunciaPDF() {
    // Verificar si jsPDF está cargado
    if (typeof jspdf === 'undefined') {
        alert("Error: El generador de PDF no ha cargado correctamente. Verifica tu conexión.");
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    // Obtener datos del formulario (se asume existencia en index.html)
    const victima = document.getElementById('rep-victima')?.value || "Ciudadano Afectado";
    const monto = document.getElementById('rep-monto')?.value || "0.00";
    const fecha = document.getElementById('rep-fecha')?.value || new Date().toLocaleDateString();
    const sospechoso = document.getElementById('rep-sospechoso')?.value || "Por identificar";
    const descripcion = document.getElementById('rep-desc')?.value || "No se proporcionó descripción.";

    // Estilo del PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("REPORTE TÉCNICO DE INCIDENTE INFORMÁTICO", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha del Reporte: ${new Date().toLocaleString()}`, 20, 30);
    doc.line(20, 35, 190, 35);

    // Sección 1: Datos Generales
    doc.setFont("helvetica", "bold");
    doc.text("1. DATOS DE LA VÍCTIMA / DENUNCIANTE", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${victima}`, 30, 52);
    doc.text(`Fecha del Suceso: ${fecha}`, 30, 59);
    doc.text(`Monto Comprometido: S/ ${monto}`, 30, 66);

    // Sección 2: Identificación del Sospechoso
    doc.setFont("helvetica", "bold");
    doc.text("2. INFORMACIÓN DEL ACTOR MALICIOSO (CUENTA MULA)", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`Identidad / Alias: ${sospechoso}`, 30, 87);
    
    // Sección 3: Descripción Técnica
    doc.setFont("helvetica", "bold");
    doc.text("3. DESCRIPCIÓN DEL MODUS OPERANDI", 20, 100);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(descripcion, 160);
    doc.text(splitDesc, 30, 107);

    // Sección 4: Base Legal
    doc.setFont("helvetica", "bold");
    doc.text("4. FUNDAMENTACIÓN LEGAL", 20, 140);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const ley = "Este reporte ha sido generado bajo los lineamientos de la Ley N° 30096 - Ley de Delitos Informáticos de la República del Perú. La información proporcionada sirve como evidencia técnica para la investigación fiscal correspondiente.";
    doc.text(doc.splitTextToSize(ley, 160), 30, 147);

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Documento generado automáticamente por el Portal de Inteligencia de Ciberseguridad.", 105, 280, { align: "center" });

    // Descargar
    doc.save(`denuncia-ciberseguridad-${victima.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
