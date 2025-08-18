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

    // --- LÓGICA DE DADOS ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return [];
            const data = await response.json();
            const key = Object.keys(data)[0];
            return Array.isArray(data[key]) ? data[key] : [];
        } catch (error) {
            console.error(`Erro ao processar JSON de ${url}:`, error);
            return [];
        }
    }

    async function carregarConteudo(jsonPath, containerId, renderFunction, pageName) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = await fetchJson(jsonPath);

        if (!items || items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há anúncios publicados nesta secção.</p>`;
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || 0) - new Date(a.data_publicacao || 0));
        
        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
    }

    async function atualizarContadores() {
        const [pedidos, vagas, servicos, anuncios] = await Promise.all([
            fetchJson('/_dados/doacoes.json'),
            fetchJson('/_dados/empregos.json'),
            fetchJson('/_dados/servicos.json'),
            fetchJson('/_dados/habitacao.json')
        ]);
        const totalDoacoes = pedidos.length;
        const totalEmpregos = vagas.length;
        const total = totalDoacoes + totalEmpregos + servicos.length + anuncios.length;

        const elContadorDoacoes = document.getElementById('contador-doacoes');
        const elContadorEmpregos = document.getElementById('contador-empregos');
        const elContadorTotal = document.getElementById('contador-total');

        if (elContadorDoacoes) elContadorDoacoes.textContent = `${totalDoacoes}+`;
        if (elContadorEmpregos) elContadorEmpregos.textContent = `${totalEmpregos}+`;
        if (elContadorTotal) elContadorTotal.textContent = `${total}+`;
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function formatarDatas(item) { /* ...código igual... */ }
    function renderShareButtons(item, page) { /* ...código igual... */ }
    function renderEmprego(item, pageName, idAnuncio) { /* ...código igual... */ return `<div class="col-lg-4 col-md-6 mb-4 job-item">...</div>`; }
    function renderDoacao(pedido, pageName, idAnuncio) { /* ...código igual... */ return `<div class="col-lg-4 col-md-6 mb-4 announcement-item">...</div>`; }
    function renderServico(item, pageName, idAnuncio) { /* ...código igual... */ return `<div class="col-lg-4 col-md-6 mb-4 service-item">...</div>`; }
    function renderHabitacao(anuncio, pageName, idAnuncio) { /* ...código igual... */ return `<div class="col-lg-4 col-md-6 mb-4 housing-item">...</div>`; }
    
    // --- CARGA INICIAL ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');

    // --- ATIVAÇÃO DOS CONTADORES (APENAS SE EXISTIREM NA PÁGINA) ---
    if (document.getElementById('contador-total')) {
        atualizarContadores();
    }

    // --- LÓGICA DO BUSCADOR (APENAS SE EXISTIR NA PÁGINA) ---
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const locationInput = document.getElementById('locationInput');
        const searchButton = document.getElementById('searchButton');
        const clearButton = document.getElementById('clearButton');
        const noResults = document.getElementById('no-results');

        function filterCards() {
            const searchText = searchInput.value.toLowerCase().trim();
            const locationText = locationInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.job-item, .announcement-item, .service-item, .housing-item');
            let visibleCount = 0;
            cards.forEach(card => {
                const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
                const description = (card.querySelector('.card-text')?.textContent || '').toLowerCase();
                const location = (card.querySelector('.card-subtitle')?.textContent || '').toLowerCase();
                const textMatch = !searchText || title.includes(searchText) || description.includes(searchText);
                const locationMatch = !locationText || location.includes(locationText);
                if (textMatch && locationMatch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            if (noResults) { noResults.style.display = visibleCount === 0 ? 'block' : 'none'; }
        }

        function clearFilters() {
            searchInput.value = '';
            locationInput.value = '';
            filterCards();
        }

        searchButton.addEventListener('click', filterCards);
        clearButton.addEventListener('click', clearFilters);
        searchInput.addEventListener('keyup', filterCards);
        locationInput.addEventListener('keyup', filterCards);
    }
    setupSearch();
});