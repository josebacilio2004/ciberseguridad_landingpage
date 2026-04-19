/**
 * Domain Detective v1.0
 * Heuristic Link Analysis & Reputation Engine
 */

document.getElementById('domain-input')?.addEventListener('input', function(e) {
    const url = e.target.value.trim();
    const resultDiv = document.getElementById('domain-result');
    
    if (!url) {
        resultDiv.innerHTML = '<p style="color: var(--text-dim); text-align: center; font-size: 0.8rem;">Ingrese una URL para iniciar análisis de heurística.</p>';
        return;
    }

    try {
        // Limpiar URL si el usuario pega algo sucio
        let hostname = url;
        if (url.includes('://')) {
            hostname = new URL(url).hostname;
        } else {
            hostname = url.split('/')[0];
        }

        const analysis = analyzeHeuristics(hostname);
        renderAnalysis(analysis, hostname);
    } catch (err) {
        resultDiv.innerHTML = '<p style="color: var(--accent); font-size: 0.8rem;">[!] URL No Válida para análisis.</p>';
    }
});

function analyzeHeuristics(domain) {
    const risks = [];
    let score = 0; // 0-100 (100 = Peligro Extremo)

    // 1. TLDs de alto riesgo
    const riskyTLDs = ['.top', '.xyz', '.icu', '.cloud', '.zip', '.info', '.biz', '.online', '.site', '.click', '.monster'];
    const matchedTLD = riskyTLDs.find(tld => domain.toLowerCase().endsWith(tld));
    if (matchedTLD) {
        risks.push(`Extensión sospechosa détectada (${matchedTLD})`);
        score += 40;
    }

    // 2. Longitud excesiva (Phishing)
    if (domain.length > 25) {
        risks.push("Longitud de dominio inusual (Posible Phishing)");
        score += 20;
    }

    // 3. Subdominios anidados
    const parts = domain.split('.');
    if (parts.length > 3) {
        risks.push("Estructura de subdominios compleja");
        score += 30;
    }

    // 4. Caracteres sospechosos (Dígitos excesivos o símbolos)
    if ((domain.match(/\d/g) || []).length > 4) {
        risks.push("Presencia excesiva de números (Dominios temporales)");
        score += 25;
    }

    // Capitán del score
    if (score > 100) score = 95;

    return { score, risks };
}

function renderAnalysis(analysis, domain) {
    const resultDiv = document.getElementById('domain-result');
    const color = analysis.score > 60 ? 'var(--accent)' : (analysis.score > 30 ? '#eab308' : 'var(--secondary)');

    let html = `
        <div style="padding: 1.5rem; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid ${color};">
            <p style="font-size: 0.7rem; color: var(--text-dim); margin-bottom: 0.5rem;">SCORE DE RIESGO ESTIMADO:</p>
            <div style="font-size: 2rem; font-weight: 800; color: ${color};">${analysis.score}%</div>
            
            <ul style="margin-top: 1rem; color: #fff; font-size: 0.85rem; padding-left: 1rem;">
                ${analysis.risks.map(r => `<li>${r}</li>`).join('')}
                ${analysis.risks.length === 0 ? "<li>No se detectaron patrones de riesgo obvios (Heurística).</li>" : ""}
            </ul>

            <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <a href="https://www.virustotal.com/gui/search/${domain}" target="_blank" class="btn-tool" style="font-size: 0.7rem; text-align: center; border-color: #004cff; color: #fff; padding: 0.5rem;">Consultar VirusTotal</a>
                <a href="https://urlscan.io/search/#${domain}" target="_blank" class="btn-tool" style="font-size: 0.7rem; text-align: center; border-color: #ff9900; color: #fff; padding: 0.5rem;">Consultar URLScan</a>
            </div>
            <p style="font-size: 0.65rem; color: var(--text-dim); margin-top: 1rem; text-align: center;">Consulte servicios externos para reputación en tiempo real.</p>
        </div>
    `;

    resultDiv.innerHTML = html;
}
