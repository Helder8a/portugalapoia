// --- CÓDIGO FINAL Y CORRECTO para script.js ---

document.addEventListener("DOMContentLoaded", () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO ---
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

    // --- LÓGICA DE DATOS (FUNCIÓN GLOBAL MEJORADA) ---
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
    
    // --- FUNCIÓN DEL CONTADOR DE IMPACTO (CORREGIDA) ---
    function animateCounter(id, finalValue) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Elemento com ID "${id}" não encontrado para o contador.`);
            return;
        }
        let startValue = 0;
        const duration = 1500; // 1.5 segundos

        if (finalValue === 0) {
            element.textContent = 0;
            return;
        }
        
        const stepTime = Math.abs(Math.floor(duration / finalValue));

        const timer = setInterval(() => {
            startValue += 1;
            element.textContent = startValue;
            if (startValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            }
        }, stepTime < 1 ? 1 : stepTime);
    }

    async function updateImpactCounters() {
        try {
            const [doacoesData, empregosData, servicosData, habitacaoData] = await Promise.all([
                fetchJson('/_dados/doacoes.json'),
                fetchJson('/_dados/empregos.json'),
                fetchJson('/_dados/servicos.json'),
                fetchJson('/_dados/habitacao.json')
            ]);

            const totalDoacoes = doacoesData?.pedidos?.length || 0;
            const totalEmpregos = empregosData?.vagas?.length || 0;
            const totalServicos = servicosData?.servicos?.length || 0;
            const totalHabitacao = habitacaoData?.anuncios?.length || 0;
            
            const totalAnuncios = totalDoacoes + totalEmpregos + totalServicos + totalHabitacao;

            // Utiliza os IDs corretos do HTML
            animateCounter('contador-doacoes', totalDoacoes);
            animateCounter('contador-empregos', totalEmpregos);
            animateCounter('contador-total', totalAnuncios);

        } catch (error) {
            console.error("Erro ao atualizar os contadores de impacto:", error);
        }
    }


    // --- FUNCIÓN GLOBAL PARA CARGAR CONTENIDO ---
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

    // --- FUNÇÕES DE RENDERIZAÇÃO (Mantidas como estavam) ---
    function renderDoacao(pedido, pageName) { /* ... (código sin cambios) ... */ }
    function renderEmprego(item, pageName, idAnuncio) { /* ... (código sin cambios) ... */ }
    function renderServico(item, pageName) { /* ... (código sin cambios) ... */ }
    function renderHabitacao(anuncio, pageName) { /* ... (código sin cambios) ... */ }

    // --- FUNCIONALIDADES GENERALES Y LAZY LOADING ---
    function ativarLazyLoading() {
        const lazyImages = [].slice.call(document.querySelectorAll("img.lazy:not(.loaded)"));
        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add("loaded");
                        lazyImage.classList.remove("lazy");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    }
    
    function setupSearch() { /* ... (código sin cambios) ... */ }

    // --- CARGA INICIAL DE CONTENIDOS ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos', 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas', 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos', 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios', 'habitação.html');

    // --- EXECUÇÃO CORRIGIDA DO CONTADOR ---
    // Verifica a existência da secção de impacto pelo ID correto
    if (document.getElementById('impacto')) {
        updateImpactCounters();
    }
    setupSearch();
    ativarLazyLoading();
});