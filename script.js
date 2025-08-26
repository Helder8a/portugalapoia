// --- CÓDIGO FINAL Y CORRECTO para script.js ---

document.addEventListener("DOMContentLoaded", () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => preloader.classList.add("hidden"));
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

    // --- FUNCIÓN PARA LEER DATOS (FETCH) ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(`Error al cargar JSON de ${url}:`, error);
            return null;
        }
    }

    // --- FUNCIÓN DEL CONTADOR DE IMPACTO ---
    async function updateImpactCounters() {
        const animateCounter = (element, finalValue) => {
            let startValue = 0;
            const duration = 2000; // 2 segundos
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
        };

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

            animateCounter(document.getElementById('contador-doacoes'), totalDoacoes);
            animateCounter(document.getElementById('contador-empregos'), totalEmpregos);
            animateCounter(document.getElementById('contador-total'), totalAnuncios);

        } catch (error) {
            console.error("Erro ao atualizar os contadores:", error);
        }
    }

    // --- FUNCIÓN DE LAZY LOADING (CARGA DIFERIDA DE IMÁGENES) ---
    function ativarLazyLoading() {
        const lazyImages = document.querySelectorAll("img.lazy:not(.loaded)");
        if ("IntersectionObserver" in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
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

    // --- FUNCIÓN GLOBAL PARA CARGAR CONTENIDO ---
    window.carregarConteudo = async function(jsonPath, containerId, renderFunction, dataKey) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = await fetchJson(jsonPath);
        const items = data ? data[dataKey] : [];

        if (!items || items.length === 0) {
            if (containerId !== 'gallery-section') {
                container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            }
            return;
        }

        items.sort((a, b) => new Date(b.date || b.data_publicacao || 0) - new Date(a.date || a.data_publicacao || 0));
        container.innerHTML = items.map(renderFunction).join('');
        
        // Llama a lazy loading CADA VEZ que se carga contenido nuevo
        ativarLazyLoading();
    }
    
    // --- FUNCIONES DE RENDERIZACIÓN (Sin cambios) ---
    function renderDoacao(item) { /* ... Tu código original ... */ return ''; }
    function renderEmprego(item) { /* ... Tu código original ... */ return ''; }
    function renderServico(item) { /* ... Tu código original ... */ return ''; }
    function renderHabitacao(item) { /* ... Tu código original ... */ return ''; }


    // --- INICIALIZACIÓN DE TODO ---
    if (document.getElementById('impacto')) {
        updateImpactCounters();
    }
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios');
    
    ativarLazyLoading(); // Una llamada inicial por si hay imágenes estáticas
});