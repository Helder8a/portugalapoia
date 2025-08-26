// --- CÓDIGO FINAL Y CORRECTO para script.js ---

document.addEventListener("DOMContentLoaded", () => {
    // --- FUNCIÓN PARA LEER DATOS (FETCH) ---
    // Definida primero para estar disponible globalmente
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) {
                console.error(`Error al cargar JSON de ${url}: ${response.statusText}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Excepción al procesar JSON de ${url}:`, error);
            return null;
        }
    }

    // --- FUNCIÓN DEL CONTADOR DE IMPACTO ---
    function animateCounter(id, finalValue) {
        const element = document.getElementById(id);
        if (!element) return;
        
        let startValue = 0;
        const duration = 2000; // 2 segundos para una animación más suave
        if (finalValue === 0) {
            element.textContent = 0;
            return;
        }
        
        const stepTime = Math.max(1, Math.floor(duration / finalValue));

        const timer = setInterval(() => {
            startValue += 1;
            if (startValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = startValue;
            }
        }, stepTime);
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

            // IDs correctos del HTML
            animateCounter('contador-doacoes', totalDoacoes);
            animateCounter('contador-empregos', totalEmpregos);
            animateCounter('contador-total', totalAnuncios);

        } catch (error) {
            console.error("Erro ao atualizar os contadores de impacto:", error);
        }
    }

    // --- FUNCIÓN GLOBAL PARA CARGAR OTROS CONTENIDOS ---
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

    // --- FUNCIONES DE RENDERIZACIÓN (Sin cambios) ---
    function renderDoacao(pedido, pageName) { /* ... */ }
    function renderEmprego(item, pageName, idAnuncio) { /* ... */ }
    function renderServico(item, pageName) { /* ... */ }
    function renderHabitacao(anuncio, pageName) { /* ... */ }

    // --- FUNCIONALIDADES GENERALES Y LAZY LOADING ---
    function ativarLazyLoading() {
        const lazyImages = [].slice.call(document.querySelectorAll("img.lazy:not(.loaded)"));
        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add("loaded");
                        lazyImage.classList.remove("lazy");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));
        }
    }

    // --- INICIALIZACIÓN DE TODO ---

    // 1. Activar el contador si estamos en la página correcta
    if (document.getElementById('impacto')) {
        updateImpactCounters();
    }

    // 2. Cargar el resto del contenido dinámico
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos', 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas', 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos', 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios', 'habitação.html');

    // 3. Activar otras funcionalidades
    ativarLazyLoading();
});