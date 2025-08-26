// --- CÓDIGO FINAL CON BÚSQUEDA CENTRALIZADA Y CARGA INTELIGENTE ---

document.addEventListener("DOMContentLoaded", () => {
    // --- GESTORES BÁSICOS (Preloader, Scroll, etc.) ---
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
        scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // --- FUNCIÓN PARA LEER DATOS JSON ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(`Error al cargar ${url}:`, error);
            return null;
        }
    }

    // --- FUNCIÓN DE LAZY LOADING PARA IMÁGENES ---
    function ativarLazyLoading() {
        const lazyImages = document.querySelectorAll("img.lazy:not(.loaded)");
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add("loaded");
                        img.classList.remove("lazy");
                        observer.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => observer.observe(img));
        }
    }

    // --- FUNCIONES PARA CREAR LAS TARJETAS DE ANUNCIOS ---
    function renderDoacao(item) {
        return `<div class="col-lg-4 col-md-6 mb-4 announcement-card" data-title="${item.titulo}" data-location="${item.localizacao}"><div class="card h-100"><div class="card-number">${item.id||""}</div>${item.imagem?`<img src="${item.imagem}" class="card-img-top lazy" data-src="${item.imagem}" alt="${item.titulo}">`:'<div class="image-placeholder">PortugalApoia</div>'}<div class="card-body d-flex flex-column"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6><p class="card-text flex-grow-1">${item.descricao}</p><div class="card-contact-icons mt-auto">${item.link_contato?`<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`:""}${item.contato?`<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>`:""}</div></div></div></div>`;
    }
    function renderEmprego(item) {
        return `<div class="col-lg-4 col-md-6 mb-4 announcement-card" data-title="${item.titulo}" data-location="${item.localizacao}"><div class="card h-100"><div class="card-number">${item.id||""}</div><div class="card-body d-flex flex-column"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6><p class="card-text flex-grow-1">${item.descricao}</p><div class="card-contact-icons mt-auto">${item.link_contato?`<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`:""}${item.contato?`<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>`:""}</div></div></div></div>`;
    }
    function renderServico(item) {
        return `<div class="col-lg-4 col-md-6 mb-4 announcement-card" data-title="${item.titulo}" data-location="${item.localizacao}"><div class="card h-100"><div class="card-number">${item.id||""}</div>${item.logo_empresa?`<div class="service-card-logo"><img src="${item.logo_empresa}" class="lazy" data-src="${item.logo_empresa}" alt="Logo"></div>`:""}<div class="card-body d-flex flex-column"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6><p class="card-text flex-grow-1">${item.descricao}</p><div class="card-contact-icons mt-auto">${item.link_contato?`<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`:""}${item.contato?`<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>`:""}</div></div></div></div>`;
    }
    function renderHabitacao(item) {
        return `<div class="col-lg-4 col-md-6 mb-4 announcement-card" data-title="${item.titulo}" data-location="${item.localizacao}"><div class="card h-100"><div class="card-number">${item.id||""}</div>${item.imagens&&item.imagens.length>0?`<img src="${item.imagens[0].imagem_url}" class="card-img-top lazy" data-src="${item.imagens[0].imagem_url}" alt="${item.titulo}">`:'<div class="image-placeholder">PortugalApoia</div>'}<div class="card-body d-flex flex-column"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6><p class="card-text flex-grow-1">${item.descricao}</p><div class="card-contact-icons mt-auto">${item.link_contato?`<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`:""}${item.contato?`<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>`:""}</div></div></div></div>`;
    }
    
    // --- FUNCIÓN GLOBAL PARA CARGAR CONTENIDO ---
    async function carregarConteudo(jsonPath, containerId, renderFunction, dataKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const data = await fetchJson(jsonPath);
        const items = data ? data[dataKey] : [];
        if (!items || items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            return;
        }
        items.sort((a, b) => new Date(b.date || b.data_publicacao || 0) - new Date(a.date || a.data_publicacao || 0));
        container.innerHTML = items.map(renderFunction).join('');
        ativarLazyLoading();
    }

    // --- LÓGICA DE BÚSQUEDA ---
    function handleCentralSearch() {
        const form = document.getElementById('central-search-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const term = document.getElementById('search-term').value;
                const location = document.getElementById('search-location').value;
                const categoryPage = document.getElementById('search-category').value;
                const url = new URL(categoryPage, window.location.origin);
                if (term) url.searchParams.append('term', term);
                if (location) url.searchParams.append('location', location);
                window.location.href = url.toString();
            });
        }
    }

    function setupPageSearch(containerId, formId, noResultsId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const termParam = urlParams.get('term') || '';
        const locationParam = urlParams.get('location') || '';
        
        const termInput = form.querySelector('input[id*="search-term"]');
        const locationInput = form.querySelector('input[id*="search-location"]');
        
        if (termInput) termInput.value = termParam;
        if (locationInput) locationInput.value = locationParam;

        const filterItems = () => {
            const currentTerm = termInput ? termInput.value.toLowerCase() : '';
            const currentLocation = locationInput ? locationInput.value.toLowerCase() : '';
            const items = document.querySelectorAll(`#${containerId} .announcement-card`);
            const noResults = document.getElementById(noResultsId);
            let visibleCount = 0;

            items.forEach(item => {
                const title = item.dataset.title.toLowerCase();
                const loc = item.dataset.location.toLowerCase();
                const termMatch = title.includes(currentTerm);
                const locMatch = loc.includes(currentLocation);

                if (termMatch && locMatch) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            filterItems();
        });

        if (termParam || locationParam) {
            setTimeout(filterItems, 500);
        }
    }

    // --- INICIALIZAÇÃO INTELIGENTE POR PÁGINA ---
    ativarLazyLoading();

    // Página Principal
    if (document.body.classList.contains('home')) {
        handleCentralSearch();
        carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos');
    }
    // Página de Doações
    else if (document.getElementById('search-form-doacoes')) {
        carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos').then(() => {
            setupPageSearch('announcements-grid', 'search-form-doacoes', 'no-results-doacoes');
        });
    }
    // Página de Empregos
    else if (document.getElementById('search-form-empregos')) {
        carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas').then(() => {
            setupPageSearch('jobs-grid', 'search-form-empregos', 'no-results-empregos');
        });
    }
    // Página de Serviços
    else if (document.getElementById('search-form-servicos')) {
        carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos').then(() => {
            setupPageSearch('services-grid', 'search-form-servicos', 'no-results-servicos');
        });
    }
     // Página de Habitação
    else if (document.getElementById('search-form-habitacao')) {
        carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios').then(() => {
            setupPageSearch('housing-grid', 'search-form-habitacao', 'no-results-habitacao');
        });
    }
});