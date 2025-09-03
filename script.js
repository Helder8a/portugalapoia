// --- CÓDIGO FINAL, ESTABLE Y CON ANUNCIOS FUNCIONANDO ---

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
    
    // --- FUNCIÓN MEJORADA PARA CREAR TARJETAS DE ANUNCIOS ---
    function renderCard(item, category) {
        const defaultImagePlaceholder = '<div class="image-placeholder"></div>';
        let imageUrl = item.imagem || item.logo_empresa || (item.imagens && item.imagens.length > 0 ? item.imagens[0].imagem_url : null);
        
        const imageHtml = imageUrl 
            ? `<img src="${imageUrl}" class="card-img-top lazy" data-src="${imageUrl}" alt="${item.titulo}">`
            : defaultImagePlaceholder;

        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-card" data-title="${item.titulo}" data-location="${item.localizacao}">
            <div class="card h-100">
                <div class="card-number">${item.id || ''}</div>
                ${imageHtml}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i> ${item.localizacao}</h6>
                    <p class="card-text flex-grow-1">${item.descricao}</p>
                    <div class="card-contact-icons mt-auto">
                        ${item.contato ? `<a href="tel:${item.contato}" class="contact-icon" title="Contactar por Telefone"><i class="fas fa-phone"></i> <span>${item.contato}</span></a>` : ''}
                        ${item.link_contato ? `<a href="${item.link_contato}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i> <span>Email</span></a>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }

    // --- FUNCIÓN GLOBAL PARA CARGAR TODO EL CONTENIDO ---
    async function carregarConteudo(jsonPath, containerId, dataKey) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = await fetchJson(jsonPath);
        const items = data ? data[dataKey] : [];

        if (!items || items.length === 0) {
            container.innerHTML = '<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>';
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || 0) - new Date(a.data_publicacao || 0));
        container.innerHTML = items.map(item => renderCard(item, dataKey)).join('');
        ativarLazyLoading();
    }
    
    // --- INICIALIZACIÓN DE LAS CARGAS ---
    if (document.getElementById('announcements-grid')) {
        carregarConteudo('/_dados/doacoes.json', 'announcements-grid', 'pedidos');
    }
    if (document.getElementById('jobs-grid')) {
        carregarConteudo('/_dados/empregos.json', 'jobs-grid', 'vagas');
    }
    if (document.getElementById('services-grid')) {
        carregarConteudo('/_dados/servicos.json', 'services-grid', 'servicos');
    }
    if (document.getElementById('housing-grid')) {
        carregarConteudo('/_dados/habitacao.json', 'housing-grid', 'anuncios');
    }
    
    ativarLazyLoading();
});