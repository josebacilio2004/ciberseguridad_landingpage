/**
 * Main Intelligence Logic v2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initTypewriter();
    initSearch();
    initSimulator();
    initCharts();
});

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
    const interval = window.innerWidth < 768 ? 50 : 35;
    setInterval(draw, interval);
    window.addEventListener('resize', setup);
}

// --- Typewriter Terminal ---
function initTypewriter() {
    const body = document.getElementById('terminal-body');
    if (!body) return;
    const lines = [
        { text: "[OK] Protocolo de seguridad cargado.", color: "#0f0" },
        { text: "[OK] Escaneo de IPs regionales activado.", color: "#0f0" },
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
            item.dni.includes(query) ||
            item.plataforma.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            container.innerHTML = '<p style="color: var(--accent);">No se encontraron registros en la base de datos de inteligencia.</p>';
            return;
        }

        results.forEach(res => {
            const card = document.createElement('div');
            card.className = 'result-card fade-in';
            card.innerHTML = `
                <h4 style="color: var(--secondary);">${res.nombre}</h4>
                <p style="font-size: 0.8rem; margin: 0.5rem 0;"><strong>DNI:</strong> ${res.dni} | <strong>Riesgo:</strong> <span style="color: var(--accent);">${res.riesgo}</span></p>
                <p style="font-size: 0.9rem; color: var(--text-dim);">${res.detalle}</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; border-top: 1px solid var(--border); padding-top: 0.5rem;"><strong>Nodo:</strong> ${res.plataforma} | <strong>Origen:</strong> ${res.ubicacion}</p>
            `;
            container.appendChild(card);
        });
    });
}

// --- Cyber-Gym Simulator ---
function initSimulator() {
    const container = document.getElementById('sim-content');
    if (!container) return;

    const scenarios = [
        {
            text: "Recibes un mensaje de AliExpress indicando que ganaste S/ 1,000 pero debes pagar S/ 50 de comisión. ¿Qué haces?",
            options: [
                { text: "Pagar, es solo una comisión pequeña.", correct: false, feedback: "ERROR: Has caído en una estafa de pago previo." },
                { text: "Ignorar y bloquear al remitente.", correct: true, feedback: "CORRECTO: AliExpress nunca pide comisiones por fuera de su app." }
            ]
        },
        {
            text: "Un 'asesor financiero' te pide capturas de tu saldo bancario para 'validar tu perfil'. ¿Lo envías?",
            options: [
                { text: "Sí, es para validar mi cuenta.", correct: false, feedback: "ERROR: Nunca compartas saldos bancarios; les ayuda a dimensionar el robo." },
                { text: "No, es información sensible.", correct: true, feedback: "CORRECTO: La ingeniería social busca conocer tu capacidad económica." }
            ]
        }
    ];

    let current = 0;
    function render() {
        if (current >= scenarios.length) {
            container.innerHTML = '<h3 style="color: var(--secondary);">Simulación Completada: Resiliencia Digital Máxima</h3><button class="btn btn-primary" onclick="location.reload()" style="margin-top: 2rem;">Reiniciar Entrenamiento</button>';
            return;
        }
        const s = scenarios[current];
        container.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">${s.text}</p>
            <div class="sim-choice">
                ${s.options.map((o, i) => `<button class="btn ${i === 0 ? 'btn-primary' : 'btn-accent'}" onclick="handleSim(${o.correct}, '${o.feedback}')">${o.text}</button>`).join('')}
            </div>
        `;
    }

    window.handleSim = (correct, feedback) => {
        alert(feedback);
        if (correct) current++;
        render();
    };

    render();
}

// --- Charts ---
function initCharts() {
    const ctx = document.getElementById('intelChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Phishing SMS', 'Ingeniería Social', 'SIM Swapping', 'Otros'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#3b82f6', '#10b981', '#f43f5e', '#6366f1'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } }
            }
        }
    });
}
