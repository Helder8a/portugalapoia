document.addEventListener('DOMContentLoaded', function () {
    const getEl = (id) => document.getElementById(id);
    // ... (resto de las constantes de elementos)
    const carbonCalculatorBtn = getEl('carbonCalculatorBtn');

    // ... (código existente)

    function showSolutionsModal(vertente, area) {
        // ... (código existente)
    }

    evaluationFormEl.addEventListener('click', (e) => {
        const infoTarget = e.target.closest('.info-icon');
        if (infoTarget) {
            const { vertente, area } = infoTarget.dataset;
            const infoData = certificationsDB[currentCert]?.data[vertente]?.[area]?.info;
            if (infoData) {
                getEl('infoModalTitle').textContent = `Critério: ${area}`;
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
                getEl('infoModalBody').innerHTML = `
                    <h6>Objetivo</h6><p>${infoData.objetivo}</p>
                    <h6>Exemplo de Aplicação</h6><p>${infoData.exemplo}</p>
                    <h6>Benefícios do Projeto</h6><p>${infoData.beneficios}</p>
                    ${normativaHTML}`;
                $('#infoModal').modal('show');
            }
        }

        const solutionsTarget = e.target.closest('.solutions-icon');
        if (solutionsTarget) {
            const { vertente, area } = solutionsTarget.dataset;
            showSolutionsModal(vertente, area);
        }
    });

    // --- LÓGICA DE LA CALCULADORA DE CARBONO ---
    const carbonModal = getEl('carbonCalculatorModal');
    const materialSelect = getEl('materialSelect');
    const materialQuantity = getEl('materialQuantity');
    const addMaterialBtn = getEl('addMaterialBtn');
    const carbonTableBody = getEl('carbon-table-body');
    const totalCarbonFootprintEl = getEl('totalCarbonFootprint');
    let projectMaterials = [];

    function populateMaterialSelect() {
        materialSelect.innerHTML = '<option value="">Selecione um material...</option>';
        for (const vertente in certificationsDB.lidera.data) {
            for (const area in certificationsDB.lidera.data[vertente]) {
                const solucoes = certificationsDB.lidera.data[vertente][area].solucoes_pt;
                if (solucoes) {
                    solucoes.forEach(s => {
                        if (s.kgCO2e !== undefined) {
                            const option = document.createElement('option');
                            option.value = JSON.stringify(s);
                            option.textContent = `${s.nome} (${vertente} > ${area})`;
                            materialSelect.appendChild(option);
                        }
                    });
                }
            }
        }
    }

    function updateCarbonTable() {
        carbonTableBody.innerHTML = '';
        let totalFootprint = 0;
        projectMaterials.forEach((item, index) => {
            const impact = item.material.kgCO2e * item.quantity;
            totalFootprint += impact;
            const row = `
                <tr>
                    <td>${item.material.nome}</td>
                    <td>${item.quantity}</td>
                    <td>${impact.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" data-index="${index}">&times;</button></td>
                </tr>`;
            carbonTableBody.insertAdjacentHTML('beforeend', row);
        });
        totalCarbonFootprintEl.textContent = `${totalFootprint.toFixed(2)} kgCO₂e`;
    }

    carbonCalculatorBtn.addEventListener('click', () => {
        populateMaterialSelect();
        $('#carbonCalculatorModal').modal('show');
    });

    addMaterialBtn.addEventListener('click', () => {
        if (!materialSelect.value || !materialQuantity.value || materialQuantity.value <= 0) {
            alert('Por favor, selecione um material e insira uma quantidade válida.');
            return;
        }
        const material = JSON.parse(materialSelect.value);
        const quantity = parseFloat(materialQuantity.value);
        projectMaterials.push({ material, quantity });
        updateCarbonTable();
        materialSelect.value = '';
        materialQuantity.value = '';
    });

    carbonTableBody.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            projectMaterials.splice(index, 1);
            updateCarbonTable();
        }
    });

    // ... (resto del código del evaluador: LCCA, guardado de proyectos, etc.)
    // El resto de tu código de app_evaluador.js va aquí sin cambios.
});