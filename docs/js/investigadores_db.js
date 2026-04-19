/**
 * Base de datos local de identidades sospechosas detectadas
 * versión 1.0 - Abril 2026
 */
const INVESTIGADORES_DB = [
    {
        nombre: "NATALIA VIVAS VILLACORTA",
        dni: "42730107",
        rol: "Recaudación Primaria",
        plataforma: "Plin (Interbank)",
        ubicacion: "Chimbote, Ancash",
        riesgo: "Alto",
        detalle: "RUC 10427301078. Vinculada a captación de fondos mediante grupos de Telegram."
    },
    {
        nombre: "ELIZABETH VIOLETA CASTILLO HUAMAN",
        dni: "46338438",
        rol: "Dispersión Secundaria",
        plataforma: "Plin (BBVA/Interbank)",
        ubicacion: "Chimbote, Ancash",
        riesgo: "Alto",
        detalle: "RUC 10463384385. Encargada de fraccionar los montos recibidos."
    },
    {
        nombre: "YDROGO RODRIGUEZ BRUNO ANTHONY",
        dni: "74044179",
        rol: "Soporte Operativo",
        plataforma: "Financiera Efectiva",
        ubicacion: "Chimbote, Ancash",
        riesgo: "Crítico",
        detalle: "7 líneas móviles activas detectadas en OSIPTEL. Proporciona infraestructura de comunicación."
    },
    {
        nombre: "FERNANDO ALDAIR MENDOZA ARICA",
        dni: "61208643",
        rol: "Retirada Final",
        plataforma: "Yape (BCP)",
        ubicacion: "Chimbote (Santa)",
        riesgo: "Alto",
        detalle: "Estudiante de la UNS. Nodo principal para el retiro de efectivo o conversión a activos."
    }
];

// Exportación simbólica para uso en main.js
if (typeof module !== 'undefined') {
    module.exports = INVESTIGADORES_DB;
}
