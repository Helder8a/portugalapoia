document.addEventListener('DOMContentLoaded', function () {
    const getEl = (id) => document.getElementById(id);
    const evaluationFormEl = getEl('evaluationForm');
    const totalScoreEl = getEl('totalScore');
    const maxScoreEl = getEl('maxScore');
    const scoreUnitEl = getEl('scoreUnit');
    const certNameEl = getEl('certName');
    const progressBarEl = getEl('progressBar');
    const levelTextEl = getEl('levelText');
    const certificationSelector = getEl('certificationSelector');
    const projectTypeSelector = getEl('projectTypeSelector');
    const projectNameEl = getEl('projectName');
    const saveProjectButton = getEl('saveProjectButton');
    const loadProjectButton = getEl('loadProjectButton');
    const deleteProjectButton = getEl('deleteProjectButton');
    const savedProjectsSelector = getEl('savedProjectsSelector');
    const exportPdfButton = getEl('exportPdfButton');
    const resetButton = getEl('resetButton');
    const carbonCalculatorBtn = getEl('carbonCalculatorBtn');
    const memoriaGeneratorBtn = getEl('memoriaGeneratorBtn');

    let userScores = {};
    let currentCert = 'lidera';
    let currentProjectType = 'edificio';

    function renderForm() {
        const cert = certificationsDB[currentCert];
        evaluationFormEl.innerHTML = '';
        if (!cert || !cert.data) {
            evaluationFormEl.innerHTML = '<p class="text-muted">Este sistema de certificação ainda não tem critérios definidos na base de dados.</p>';
            initializeScores();
            return;
        }

        Object.entries(cert.data).forEach(([vertente, areas], vIndex) => {
            let areasHTML = '';
            Object.entries(areas).forEach(([area, data]) => {
                let creditsHTML = '';
                if (data.credits) {
                    Object.keys(data.credits).forEach(credit => {
                        const creditId = `${currentCert}-${vertente}-${area}-${credit}`.replace(/[^a-zA-Z0-9]/g, '');
                        creditsHTML += `<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="${creditId}" data-vertente="${vertente}" data-area="${area}" data-credit="${credit}"><label class="custom-control-label" for="${creditId}">${credit}</label></div>`;
                    });
                }

                const solutionsIconHTML = data.solucoes_pt ? `<i class="fas fa-cubes solutions-icon" data-vertente="${vertente}" data-area="${area}" title="Ver Soluções de Mercado"></i>` : '';
                areasHTML += `<div class="mb-4"><h5><span class="area-label">${area}<span class="icon-group"><i class="fas fa-info-circle info-icon" data-vertente="${vertente}" data-area="${area}"></i>${solutionsIconHTML}</span></span></h5>${creditsHTML}</div>`;
            });
            const vertenteHTML = `<div class="card mb-3"><div class="card-header vertente-header" data-toggle="collapse" data-target="#vertente-${vIndex}"><h4 class="mb-0">${vertente}</h4></div><div id="vertente-${vIndex}" class="collapse ${vIndex === 0 ? 'show' : ''}" data-parent="#evaluationForm"><div class="card-body">${areasHTML.replace(/<div class="mb-4">/g, '<hr class="my-4"><div class="mb-4">').replace('<hr class="my-4">', '')}</div></div></div>`;
            evaluationFormEl.insertAdjacentHTML('beforeend', vertenteHTML);
        });
        initializeScores();
    }

    function initializeScores() {
        userScores = {};
        const certData = certificationsDB[currentCert]?.data;
        if (!certData) {
            updateTotal();
            return;
        };
        for (const vertente in certData) {
            userScores[vertente] = {};
            for (const area in certData[vertente]) { userScores[vertente][area] = 0; }
        }
        updateTotal();
    }

    function calculateTotal() {
        const cert = certificationsDB[currentCert];
        if (!cert) return 0;
        let total = 0;
        if (cert.name === "LiderA" && cert.data) {
            const weights = cert.weights[currentProjectType];
            let totalWeightedScore = 0;
            let totalMaxWeight = 0;
            for (const vertente in userScores) {
                const vertenteWeight = weights[vertente] || 1;
                totalMaxWeight += vertenteWeight;
                let vertenteTotalPoints = 0;
                let vertenteMaxPoints = 0;
                for (const area in userScores[vertente]) {
                    vertenteTotalPoints += userScores[vertente][area];
                    if (cert.data[vertente] && cert.data[vertente][area] && cert.data[vertente][area].credits) {
                        vertenteMaxPoints += Object.values(cert.data[vertente][area].credits).reduce((a, b) => a + b, 0);
                    }
                }
                if (vertenteMaxPoints > 0) {
                    totalWeightedScore += (vertenteTotalPoints / vertenteMaxPoints) * vertenteWeight;
                }
            }
            total = totalMaxWeight > 0 ? (totalWeightedScore / totalMaxWeight) * cert.maxScore : 0;
        }
        return total;
    }

    function updateTotal() {
        const cert = certificationsDB[currentCert];
        if (!cert) {
            totalScoreEl.textContent = '0.0';
            maxScoreEl.textContent = '0.0';
            certNameEl.textContent = 'N/A';
            levelTextEl.textContent = 'N/A';
            progressBarEl.style.width = '0%';
            return;
        }
        const total = calculateTotal();
        totalScoreEl.textContent = total.toFixed(1);
        maxScoreEl.textContent = cert.maxScore.toFixed(1);
        scoreUnitEl.textContent = cert.scoreUnit;
        certNameEl.textContent = cert.name;
        const percentage = cert.maxScore > 0 ? (total / cert.maxScore) * 100 : 0;
        progressBarEl.style.width = `${percentage}%`;
        let level = "N/A";
        if (cert.levels) {
            const sortedLevels = Object.entries(cert.levels).sort((a, b) => b[0] - a[0]);
            for (const [score, name] of sortedLevels) {
                if (total >= parseFloat(score)) { level = name; break; }
            }
        }
        levelTextEl.textContent = level;
    }

    evaluationFormEl.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
            const { vertente, area, credit } = e.target.dataset;
            const cert = certificationsDB[currentCert];
            const pointValue = cert.data[vertente][area].credits[credit];
            userScores[vertente][area] += e.target.checked ? pointValue : -pointValue;
            updateTotal();
        }
    });

    evaluationFormEl.addEventListener('click', (e) => {
        const infoTarget = e.target.closest('.info-icon');
        if (infoTarget) {
            const { vertente, area } = infoTarget.dataset;
            const infoData = certificationsDB[currentCert]?.data[vertente]?.[area]?.info;
            if (infoData) {
                const infoModalTitle = document.querySelector('#infoModal .modal-title');
                if (infoModalTitle) infoModalTitle.textContent = `Critério: ${area}`;

                let normativaHTML = '';
                if (infoData.normativa_pt) {
                    normativaHTML = `
                        <div class="normativa-section">
                            <h6>Normativa Aplicável em Portugal</h6>
                            <p><strong>${infoData.normativa_pt.nome}</strong><br>
                               <a href="${infoData.normativa_pt.link}" target="_blank">Consultar Documento Oficial <i class="fas fa-external-link-alt fa-xs"></i></a>
                            </p>
                        </div>`;
                }

                const infoModalBody = document.querySelector('#infoModal .modal-body');
                if (infoModalBody) {
                    infoModalBody.innerHTML = `
                        <h6>Objetivo</h6><p>${infoData.objetivo}</p>
                        <h6>Exemplo de Aplicação</h6><p>${infoData.exemplo}</p>
                        <h6>Benefícios do Projeto</h6><p>${infoData.beneficios}</p>
                        ${normativaHTML}`;
                    $('#infoModal').modal('show');
                }
            }
        }

        const solutionsTarget = e.target.closest('.solutions-icon');
        if (solutionsTarget) {
            const { vertente, area } = solutionsTarget.dataset;
            showSolutionsModal(vertente, area);
        }
    });

    function showSolutionsModal(vertente, area) {
        const certData = certificationsDB[currentCert].data;
        const solucoesData = certData[vertente][area]?.solucoes_pt;
        if (!solucoesData) return;

        const solutionsModalTitle = document.querySelector('#solutionsModal .modal-title');
        if (solutionsModalTitle) solutionsModalTitle.textContent = `Soluções de Mercado para: ${area}`;

        const solutionsModalBody = document.querySelector('#solutionsModal .modal-body');
        if (solutionsModalBody) {
            let solucoesHTML = solucoesData.map(s => {
                const lccaId = s.lcca_id;
                const lccaButton = (lccaId && typeof lccaDB !== 'undefined' && lccaDB[lccaId]) ? `<button class="btn btn-success btn-sm mt-2 launch-lcca-btn" data-lcca-id="${lccaId}">Analisar Custo de Ciclo de Vida</button>` : '';
                return `
                    <div class="solution-card">
                        <h5>${s.nome}</h5>
                        <p class="solution-manufacturer"><strong>Fabricante/Marca:</strong> ${s.fabricante}</p>
                        <p><strong>Descrição:</strong> ${s.descricao}</p>
                        <p><strong>Aplicação Típica:</strong> ${s.aplicacao}</p>
                        <a href="${s.link}" target="_blank" class="btn btn-outline-primary btn-sm">Visitar Website <i class="fas fa-external-link-alt"></i></a>
                        ${lccaButton}
                    </div>`;
            }).join('');
            solutionsModalBody.innerHTML = solucoesHTML;
            $('#solutionsModal').modal('show');
        }
    }

    memoriaGeneratorBtn.addEventListener('click', () => {
        const projectName = projectNameEl.value.trim() || "este projeto";
        let memoriaText = `MEMÓRIA DESCRITIVA DE SUSTENTABILIDADE\n`;
        memoriaText += `PROJETO: ${projectName.toUpperCase()}\n\n`;
        memoriaText += `A presente memória descreve as estratégias de sustentabilidade adotadas para ${projectName}, com base nos critérios do sistema de avaliação LiderA.\n\n`;

        const selectedCredits = document.querySelectorAll('#evaluationForm input[type="checkbox"]:checked');
        if (selectedCredits.length === 0) {
            memoriaText += "Nenhum critério de sustentabilidade foi selecionado na avaliação.";
        } else {
            let addedVertentes = new Set();
            let addedAreas = new Set();

            selectedCredits.forEach(checkbox => {
                const { vertente, area } = checkbox.dataset;

                if (!addedVertentes.has(vertente)) {
                    memoriaText += `\n--- ${vertente.toUpperCase()} ---\n\n`;
                    addedVertentes.add(vertente);
                }

                if (!addedAreas.has(area)) {
                    const info = certificationsDB[currentCert]?.data[vertente]?.[area]?.info;
                    if (info && info.memoria_descritiva) {
                        memoriaText += `>> CRITÉRIO: ${area.toUpperCase()}\n`;
                        memoriaText += `${info.memoria_descritiva}\n\n`;
                        addedAreas.add(area);
                    }
                }
            });
        }

        getEl('memoria-output').value = memoriaText;
        $('#memoriaModal').modal('show');
    });

    getEl('copyMemoriaBtn').addEventListener('click', () => {
        const memoriaOutput = getEl('memoria-output');
        memoriaOutput.select();
        memoriaOutput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        alert('Texto copiado para a área de transferência!');
    });

    // Inicialización al cargar la página
    renderForm();
});