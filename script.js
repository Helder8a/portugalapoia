// --- CÓDIGO FINAL CON SEO TÉCNICO COMPLETADO ---

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
    
    // --- FUNCIONES PARA CREAR LAS TARJETAS DE ANUNCIOS (CON SCHEMA.ORG) ---

    function renderDoacao(item) {
        // Usamos el schema 'Demand' para representar una necesidad o pedido.
        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-card" itemscope itemtype="https://schema.org/Demand" data-title="${item.titulo}" data-location="${item.localizacao}">
            <meta itemprop="name" content="${item.titulo}">
            <div itemprop="location" itemscope itemtype="https://schema.org/Place">
                <meta itemprop="name" content="${item.localizacao}">
            </div>

            <div class="card h-100">
                <div class="card-number">${item.id || ''}</div>
                ${item.imagem ? `<img itemprop="image" src="${item.imagem}" class="card-img-top lazy" data-src="${item.imagem}" alt="${item.titulo}">` : '<div class="image-placeholder">PortugalApoia</div>'}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6>
                    <p class="card-text flex-grow-1" itemprop="description">${item.descricao}</p>
                    <div class="card-contact-icons mt-auto">
                        ${item.link_contato ? `<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${item.contato ? `<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }

    function renderEmprego(item) {
        // Este ya estaba implementado, se mantiene.
        return `<div class="col-lg-4 col-md-6 mb-4 announcement-card" itemscope itemtype="https://schema.org/JobPosting" data-title="${item.titulo}" data-location="${item.localizacao}"><meta itemprop="datePosted" content="${item.data_publicacao}"><div itemprop="hiringOrganization" itemscope itemtype="https://schema.org/Organization"><meta itemprop="name" content="PortugalApoia"></div><div itemprop="jobLocation" itemscope itemtype="https://schema.org/Place"><meta itemprop="address" content="${item.localizacao}"></div><div class="card h-100"><div class="card-number">${item.id||""}</div><div class="card-body d-flex flex-column"><h5 class="card-title" itemprop="title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6><p class="card-text flex-grow-1" itemprop="description">${item.descricao}</p><div class="card-contact-icons mt-auto">${item.link_contato?`<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`:""}${item.contato?`<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>`:""}</div></div></div></div>`;
    }

    function renderServico(item) {
        // Usamos el schema 'Service' para los servicios ofrecidos.
        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-card" itemscope itemtype="https://schema.org/Service" data-title="${item.titulo}" data-location="${item.localizacao}">
            <meta itemprop="name" content="${item.titulo}">
            <div itemprop="provider" itemscope itemtype="https://schema.org/Organization">
                <meta itemprop="name" content="Serviço Local">
            </div>

            <div class="card h-100">
                <div class="card-number">${item.id || ''}</div>
                ${item.logo_empresa ? `<div class="service-card-logo"><img itemprop="image" src="${item.logo_empresa}" class="lazy" data-src="${item.logo_empresa}" alt="Logo"></div>` : ''}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6>
                    <p class="card-text flex-grow-1" itemprop="description">${item.descricao}</p>
                    <div class="card-contact-icons mt-auto">
                        ${item.link_contato ? `<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${item.contato ? `<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }

    function renderHabitacao(item) {
        // Usamos 'Residence' para una propiedad y 'RentAction' para indicar que es para alquiler.
        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-card" itemscope itemtype="https://schema.org/Residence" data-title="${item.titulo}" data-location="${item.localizacao}">
            <meta itemprop="name" content="${item.titulo}">
            <div itemprop="potentialAction" itemscope itemtype="https://schema.org/RentAction">
                <div itemprop="priceSpecification" itemscope itemtype="https://schema.org/PriceSpecification">
                    <meta itemprop="price" content="${(item.valor_anuncio || '').replace(/[^0-9]/g, '')}">
                    <meta itemprop="priceCurrency" content="EUR">
                </div>
            </div>

            <div class="card h-100">
                <div class="card-number">${item.id || ''}</div>
                ${item.imagens && item.imagens.length > 0 ? `<img itemprop="image" src="${item.imagens[0].imagem_url}" class="card-img-top lazy" data-src="${item.imagens[0].imagem_url}" alt="${item.titulo}">` : '<div class="image-placeholder">PortugalApoia</div>'}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt"></i> ${item.localizacao}</h6>
                    <p class="card-text flex-grow-1" itemprop="description">${item.descricao}</p>
                    <div class="card-contact-icons mt-auto">
                        ${item.link_contato ? `<a href="mailto:${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>` : ''}
                        ${item.contato ? `<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }

    // --- FUNCIÓN GLOBAL PARA CARGAR TODO EL CONTENIDO ---
    window.carregarConteudo = async function(jsonPath, containerId, renderFunction, dataKey) {
        // (Esta función se mantiene igual)
    };
    
    // --- LÓGICA DE BÚSQUEDA ---
    function handleCentralSearch() {
        // (Esta función se mantiene igual)
    }

    function setupPageSearch(containerId, formId, noResultsId) {
        // (Esta función se mantiene igual)
    }

    // --- INICIALIZACIÓN INTELIGENTE POR PÁGINA ---
    // (Esta sección se mantiene igual)
});