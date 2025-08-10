document.addEventListener('DOMContentLoaded', () => {
    // Verifica si estamos en la página del evaluador antes de ejecutar el código.
    if (!document.getElementById('evaluationForm')) {
        return;
    }

    const evaluationFormEl = document.getElementById('evaluationForm');
    const totalScoreEl = document.getElementById('totalScore');
    const progressBarEl = document.getElementById('progressBar');
    const levelTextEl = document.getElementById('levelText');

    let userScores = {};

    function renderForm() {
        evaluationFormEl.innerHTML = '';
        Object.entries(liderAData).forEach(([vertente, areas], vIndex) => {
            const vertenteId = `vertente-${vIndex}`;
            let areasHTML = '';
            Object.entries(areas).forEach(([area, data]) => {
                let creditsHTML = '';
                Object.keys(data.credits).forEach(credit => {
                    const creditId = `${vertente}-${area}-${credit}`.replace(/[^a-zA-Z0-9]/g, '');
                    creditsHTML += `
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="${creditId}" data-vertente="${vertente}" data-area="${area}" data-credit="${credit}">
                            <label class="custom-control-label" for="${creditId}">${credit}</label>
                        </div>`;
                });
                areasHTML += `
                    <div class="mb-4">
                        <h5>
                            <span class="area-label">${area}
                                <i class="fas fa-info-circle info-icon" data-info-title="${area}" data-info-content='${JSON.stringify(data.info)}'></i>
                            </span>
                        </h5>
                        ${creditsHTML}
                    </div>`;
            });

            const vertenteHTML = `
                <div class="card mb-3">
                    <div class="card-header vertente-header" data-toggle="collapse" data-target="#${vertenteId}">
                        <h4 class="mb-0">${vertente}</h4>
                    </div>
                    <div id="${vertenteId}" class="collapse ${vIndex === 0 ? 'show' : ''}" data-parent="#evaluationForm">
                        <div class="card-body">${areasHTML.replace(/<div class="mb-4">/g, '<hr><div class="mb-4">').replace('<hr>', '')}</div>
                    </div>
                </div>`;
            evaluationFormEl.insertAdjacentHTML('beforeend', vertenteHTML);
        });
        initializeScores();
    }

    function initializeScores() {
        userScores = {};
        for (const vertente in liderAData) {
            userScores[vertente] = {};
            for (const area in liderAData[vertente]) {
                userScores[vertente][area] = 0;
            }
        }
        updateTotal();
    }

    function calculateTotal() {
        let total = 0;
        for (const vertente in userScores) {
            for (const area in userScores[vertente]) {
                const score = userScores[vertente][area];
                const weight = liderAData[vertente][area].weight;
                const maxScore = Object.values(liderAData[vertente][area].credits).reduce((a, b) => a + b, 0);
                if (maxScore > 0) {
                    total += (score / maxScore) * weight;
                }
            }
        }
        return total;
    }

    function updateTotal() {
        const total = calculateTotal();
        totalScoreEl.textContent = total.toFixed(1);
        
        const maxPossibleScore = Object.values(liderAData).flatMap(areas => Object.values(areas)).reduce((sum, area) => sum + area.weight, 0);
        const percentage = (total / maxPossibleScore) * 100;
        progressBarEl.style.width = `${percentage}%`;

        let level = "G";
        if (total >= 11) level = "A++"; else if (total >= 9.5) level = "A+"; else if (total >= 8.0) level = "A";
        else if (total >= 6.5) level = "B"; else if (total >= 5.0) level = "C"; else if (total >= 3.5) level = "D";
        else if (total >= 2.0) level = "E"; else if (total >= 1.0) level = "F";
        levelTextEl.textContent = level;
    }

    evaluationFormEl.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const { vertente, area, credit } = e.target.dataset;
            const pointValue = liderAData[vertente][area].credits[credit];
            userScores[vertente][area] += e.target.checked ? pointValue : -pointValue;
            updateTotal();
        }
    });

    evaluationFormEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('info-icon')) {
            const title = e.target.dataset.infoTitle;
            const content = e.target.dataset.infoContent;
            document.getElementById('infoModalTitle').textContent = title;
            document.getElementById('infoModalBody').innerHTML = `<p>${content}</p>`; // Simplificado para evitar errores de JSON
            $('#infoModal').modal('show');
        }
    });
    
    document.getElementById('resetButton').addEventListener('click', () => {
         document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
         initializeScores();
    });

    renderForm();
});