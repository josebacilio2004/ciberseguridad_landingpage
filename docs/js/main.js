/**
 * Main Intelligence Logic v3.0
 */

document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initTypewriter();
    initSearch();
    initPanic();
    initMap();
});

// --- Panic Button Toggle ---
window.togglePanic = function() {
    const modal = document.getElementById('panic-modal');
    if (!modal) return;
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
};

function initPanic() {
    // Escuchar tecla ESC para cerrar modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('panic-modal');
            if (modal) modal.style.display = 'none';
        }
    });
}

// --- Matrix Rain Animation ---
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;
    const fontSize = 16;
    const letters = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$";

    function setup() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = new Array(columns).fill(1);
    }
    setup();

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px 'JetBrains Mono'";
        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.985) drops[i] = 0;
            drops[i]++;
        }
    }
    
    // Low FPS for mobile
    const interval = window.innerWidth < 768 ? 50 : 35;
    setInterval(draw, interval);
    window.addEventListener('resize', setup);
}

// --- Typewriter Terminal ---
function initTypewriter() {
    const body = document.getElementById('terminal-body');
    if (!body) return;
    const lines = [
        { text: "[OK] Protocolo de defensa v3.0 activo.", color: "#0f0" },
        { text: "[OK] Escaneo de IPs regionales activo.", color: "#0f0" },
        { text: "[!] Alerta: Red Criminal identificada.", color: "#ff0" }
    ];
    let lIdx = 0, cIdx = 0;

    function type() {
        if (lIdx < lines.length) {
            if (cIdx === 0) {
                const p = document.createElement('p');
                p.style.color = lines[lIdx].color;
                p.style.marginBottom = '0.4rem';
                body.appendChild(p);
            }
            const cur = lines[lIdx].text;
            if (cIdx < cur.length) {
                body.lastChild.textContent += cur.charAt(cIdx);
                cIdx++;
                setTimeout(type, 30);
            } else {
                lIdx++; cIdx = 0;
                setTimeout(type, 400);
            }
        }
    }
    setTimeout(type, 800);
}

// --- Search Engine ---
function initSearch() {
    const input = document.getElementById('forensic-search');
    const container = document.getElementById('search-results');
    if (!input || !container) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        container.innerHTML = '';
        if (query.length < 2) return;

        const results = INVESTIGADORES_DB.filter(item => 
            item.nombre.toLowerCase().includes(query) || 
            item.dni.includes(query)
        );

        if (results.length === 0) {
            container.innerHTML = '<p style="color: var(--accent);">No se encontraron registros de inteligencia.</p>';
            return;
        }

        results.forEach(res => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <h4 style="color: var(--secondary);">${res.nombre}</h4>
                <p style="font-size: 0.8rem; margin: 0.4rem 0;"><strong>DNI:</strong> ${res.dni} | <strong>Riesgo:</strong> ${res.riesgo}</p>
                <p style="font-size: 0.8rem; color: var(--text-dim);">${res.detalle}</p>
            `;
            container.appendChild(card);
        });
    });
}

// --- Geographic Map (Leaflet) ---
function initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    // Inicializar mapa centrado en Perú
    const map = L.map('map').setView([-9.19, -75.01], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Nodos Críticos Detectados
    const nodes = [
        { name: "Epicentro: Red Chimbote", coords: [-9.07, -78.59], color: "red" },
        { name: "Alerta: Transacciones Lima", coords: [-12.04, -77.03], color: "orange" },
        { name: "Alerta: Nodo Trujillo", coords: [-8.11, -79.03], color: "orange" }
    ];

    nodes.forEach(node => {
        const marker = L.circleMarker(node.coords, {
            radius: 12,
            fillColor: node.color,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`<strong>${node.name}</strong><br>Estado: Inteligencia Activa`);
    });
}
