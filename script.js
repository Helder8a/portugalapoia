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
    // --- FUNÇÃO MELHORADA PARA CRIAR CARTÕES DE ANÚNCIOS ---
function renderCard(item, category) {
    // Define uma imagem de substituição padrão caso não haja uma imagem específica.
    const defaultImagePlaceholder = '<div class="image-placeholder"></div>';
    let imageUrl = item.imagem || item.logo_empresa || (item.imagens && item.imagens.length > 0 ? item.imagens[0].imagem_url : null);

    // Constrói o HTML da imagem, usando a imagem de substituição se não houver URL.
    const imageHtml = imageUrl
        ? `<img src="${imageUrl}" class="card-img-top lazy" data-src="${imageUrl}" alt="${item.titulo}">`
        : defaultImagePlaceholder;

    // Constrói o HTML dos ícones de contato (telefone e email), apenas se existirem.
    const contatoHtml = `
        <div class="card-contact-details">
            ${item.contato ? `
            <a href="tel:${item.contato}" class="contact-link" title="Contactar por Telefone">
                <i class="fas fa-phone-alt"></i>
                <span>${item.contato}</span>
            </a>` : ''}
            ${item.link_contato ? `
            <a href="mailto:${item.link_contato}" class="contact-link" title="Contactar por Email">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
            </a>` : ''}
        </div>
    `;

    // Retorna a estrutura HTML completa do cartão.
    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100 shadow-sm announcement-card-simple">
            ${imageHtml}
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.titulo}</h5>
                <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                <p class="card-text flex-grow-1">${item.descricao}</p>
                ${contatoHtml}
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