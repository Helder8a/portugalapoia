// --- CÓDIGO FINAL CON EL CONTADOR REPARADO ---

document.addEventListener("DOMContentLoaded", async () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO (Sin cambios) ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => preloader.classList.add("hidden"));
        setTimeout(() => preloader.classList.add("hidden"), 1500);
    }

    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        };
        scrollTopBtn.addEventListener("click", e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
    
    // --- LÓGICA DE DATOS (Sin cambios) ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(`Erro ao processar JSON de ${url}:`, error);
            return null;
        }
    }

    // --- FUNCIÓN DEL CONTADOR DE IMPACTO (REPARADA) ---
    async function updateImpactCounters() {
        try {
            // Se obtienen los datos de los archivos JSON
            const [doacoesData, empregosData, servicosData, habitacaoData] = await Promise.all([
                fetchJson('/_dados/doacoes.json'),
                fetchJson('/_dados/empregos.json'),
                fetchJson('/_dados/servicos.json'),
                fetchJson('/_dados/habitacao.json')
            ]);

            // **CORRECCIÓN 1: Se cuenta correctamente el número de elementos en cada lista**
            const totalDoacoes = doacoesData?.pedidos?.length || 0;
            const totalEmpregos = empregosData?.vagas?.length || 0;
            const totalServicos = servicosData?.servicos?.length || 0;
            const totalHabitacao = habitacaoData?.anuncios?.length || 0;
            const totalAnuncios = totalDoacoes + totalEmpregos + totalServicos + totalHabitacao;

            // **CORRECCIÓN 2: Se usan los IDs correctos del HTML**
            const counters = [
                { id: 'contador-doacoes', final: totalDoacoes },
                { id: 'contador-empregos', final: totalEmpregos },
                { id: 'contador-total', final: totalAnuncios }
            ];

            counters.forEach(counterInfo => {
                const counterElement = document.getElementById(counterInfo.id);
                if (counterElement) {
                    let start = 0;
                    const final = counterInfo.final;
                    if (final === 0) {
                        counterElement.textContent = 0;
                        return;
                    }
                    const duration = 2000;
                    const stepTime = Math.max(1, Math.floor(duration / final));
                    
                    const timer = setInterval(() => {
                        start += 1;
                        if (start >= final) {
                            counterElement.textContent = final;
                            clearInterval(timer);
                        } else {
                            counterElement.textContent = start;
                        }
                    }, stepTime);
                }
            });

        } catch (error) {
            console.error("Erro ao carregar dados para os contadores de impacto:", error);
        }
    }

    // --- OTRAS FUNCIONES (Sin cambios) ---
    window.carregarConteudo = async function(jsonPath, containerId, renderFunction, dataKey, pageName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const data = await fetchJson(jsonPath);
        if (!data || !data[dataKey]) {
            if (containerId !== 'gallery-section') {
                 container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            }
            return;
        }
        const items = data[dataKey];
        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));
        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
        ativarLazyLoading();
    }
    function renderDoacao(pedido, pageName) { /* ... */ }
    function renderEmprego(item, pageName, idAnuncio) { /* ... */ }
    function renderServico(item, pageName) { /* ... */ }
    function renderHabitacao(anuncio, pageName) { /* ... */ }
    function ativarLazyLoading() { /* ... */ }
    function setupSearch() { /* ... */ }

    // --- INICIALIZACIÓN (Sin cambios) ---
    if (document.getElementById('impacto')) {
        updateImpactCounters();
    }
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos', 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas', 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos', 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios', 'habitação.html');
    setupSearch();
    ativarLazyLoading();
});