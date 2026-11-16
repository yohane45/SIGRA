// ============================================
// SIGRA - INDICADORES DE GESTIÓN DEL RIESGO
// Fuente: localStorage - evaluacionesRiesgos
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // Obtener evaluaciones almacenadas
    let evaluaciones = [];
    try {
        evaluaciones = JSON.parse(
            localStorage.getItem("evaluacionesRiesgos")
        ) || [];
    } catch (error) {
        console.error("Error al leer las evaluaciones:", error);
    }

    // Verificar que los datos sean un arreglo
    if (!Array.isArray(evaluaciones)) {
        evaluaciones = [];
    }

    // ========================================
    // IR-01. TOTAL DE EVALUACIONES
    // ========================================

    document.querySelector("#total-evaluaciones").textContent =
        evaluaciones.length;

    // ========================================
    // IR-02. PELIGROS POR CLASIFICACIÓN
    // ========================================

    const clasificaciones = {};
    evaluaciones.forEach(function (evaluacion) {
        const tipo = evaluacion.tipoPeligro || "Sin clasificación";
        clasificaciones[tipo] = (clasificaciones[tipo] || 0) + 1;
    });

    // ========================================
    // IR-03. RIESGOS POR NIVEL DE INTERVENCIÓN
    // ========================================

    const niveles = {
        "Nivel I": 0,
        "Nivel II": 0,
        "Nivel III": 0,
        "Nivel IV": 0
    };

    evaluaciones.forEach(function (evaluacion) {
        const nivel = evaluacion.nivelRiesgo || "";
        const coincidencia = nivel.match(/Nivel\s+(IV|III|II|I)/i);
        if (coincidencia) {
            const nivelEncontrado =
                "Nivel " + coincidencia[1].toUpperCase();
            if (niveles[nivelEncontrado] !== undefined) {
                niveles[nivelEncontrado]++;
            }
        }
    });

    // ========================================
    // IR-04. RIESGOS NO ACEPTABLES
    // ========================================

    const riesgosNoAceptables = evaluaciones.filter(function (evaluacion) {
        const interpretacion = (evaluacion.interpretacion || "")
            .trim()
            .toLowerCase();
        return interpretacion === "no aceptable";
    });
    document.querySelector("#riesgos-no-aceptables").textContent =
        riesgosNoAceptables.length;

    // ========================================
    // IR-05. RIESGOS POR ÁREA
    // ========================================

    const areas = {};
    evaluaciones.forEach(function (evaluacion) {
        const area = evaluacion.area && evaluacion.area.trim()
            ? evaluacion.area.trim()
            : "Sin área registrada";
        areas[area] = (areas[area] || 0) + 1;
    });

    // ========================================
    // GRÁFICO IR-02: CLASIFICACIÓN
    // ========================================

    new Chart(document.querySelector("#grafico-peligros"), {
        type: "pie",
        data: {
            labels: Object.keys(clasificaciones),
            datasets: [{
                data: Object.values(clasificaciones)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });

    // ========================================
    // GRÁFICO IR-03: NIVELES DE RIESGO
    // ========================================

    new Chart(document.querySelector("#grafico-niveles"), {
        type: "bar",
        data: {
            labels: Object.keys(niveles),
            datasets: [{
                label: "Evaluaciones",
                data: Object.values(niveles)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });

    // ========================================
    // GRÁFICO IR-05: DISTRIBUCIÓN POR ÁREA
    // ========================================

    new Chart(document.querySelector("#grafico-areas"), {
        type: "bar",
        data: {
            labels: Object.keys(areas),
            datasets: [{
                label: "Evaluaciones",
                data: Object.values(areas)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
});