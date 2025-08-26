// --- CÓDIGO FINAL Y CORRECTO para script.js ---

document.addEventListener("DOMContentLoaded", async () => {
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

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        const body = document.body;
        const setTheme = (theme) => {
            if (theme === "dark") {
                body.classList.add("dark-theme");
                themeToggle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                themeToggle.checked = false;
            }
        };
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (savedTheme) { setTheme(savedTheme); } else if (prefersDark) { setTheme("dark"); }
        themeToggle.addEventListener("change", () => {
            const newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
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

    // A função agora aceita uma "dataKey" para saber o que procurar no JSON
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

        // Ativa o lazy loading para as novas imagens
        ativarLazyLoading();
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    // (As funções de renderDoacao, renderEmprego, etc. permanecem iguais)
    function formatarDatas(item) { /* ... (código sin cambios) ... */ }
    function renderShareButtons(item, page) { /* ... (código sin cambios) ... */ }
    function renderEmprego(item, pageName, idAnuncio) { /* ... (código sin cambios) ... */ }
    function renderDoacao(pedido, pageName) { /* ... (código sin cambios) ... */ }
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

    async function updateImpactCounters() { /* ... (código sin cambios) ... */ }
    function setupSearch() { /* ... (código sin cambios) ... */ }

    // --- CARGA INICIAL (COM A dataKey ESPECIFICADA) ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos', 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas', 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos', 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios', 'habitação.html');

    updateImpactCounters();
    setupSearch();
    ativarLazyLoading();
});