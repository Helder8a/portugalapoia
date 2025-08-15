// --- CÓDIGO COMPLETO Y CORREGIDO PARA script.js ---
document.addEventListener("DOMContentLoaded", () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO ---
    let preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => { preloader.classList.add("hidden"); });
        setTimeout(() => { preloader.classList.add("hidden"); }, 1500);
    }
    let scrollTopBtn = document.getElementById("scrollTopBtn");
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
    let themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        let body = document.body;
        const setTheme = (theme) => {
            if (theme === "dark") {
                body.classList.add("dark-theme");
                themeToggle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                themeToggle.checked = false;
            }
        };
        let savedTheme = localStorage.getItem("theme");
        let prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (savedTheme) { setTheme(savedTheme); } else if (prefersDark) { setTheme("dark"); }
        themeToggle.addEventListener("change", () => {
            let newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        });
    }

    // --- FUNCIÓN GENÉRICA PARA CARGAR DATOS JSON ---
    async function carregarConteudo(jsonPath, containerId, renderFunction, dataKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`Erro ao carregar o ficheiro: ${response.statusText}`);
            const data = await response.json();
            const items = data[dataKey] || [];
            if (items.length === 0) {
                container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há anúncios publicados nesta secção.</p>`;
                return;
            }
            container.innerHTML = '';
            items.forEach(item => {
                const itemHTML = renderFunction(item);
                if (itemHTML) { // Verificación para evitar undefined
                    container.innerHTML += itemHTML;
                }
            });
        } catch (error) {
            console.error(`Erro ao carregar conteúdo de ${jsonPath}:`, error);
            container.innerHTML = `<p class="col-12 text-center">Não foi possível carregar o conteúdo neste momento. Tente mais tarde.</p>`;
        }
    }

    // --- FUNCIONES PARA RENDERIZAR CADA TIPO DE ANUNCIO ---

    function renderEmprego(item) {
        let contatoHTML = '';
        if (item.contato) {
            const numeroLimpo = item.contato.replace(/[\s+()-]/g, '');
            contatoHTML += `<p class="card-text small mb-1"><strong>Tel:</strong> <a href="tel:${numeroLimpo}">${item.contato}</a></p>`;
        }
        if (item.link_contato && item.link_contato.includes('@')) {
            const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`;
            contatoHTML += `<p class="card-text small"><strong>Email:</strong> <a href="${emailLink}">${item.link_contato.replace('mailto:', '')}</a></p>`;
        }

        return `
        <div class="col-lg-4 col-md-6 mb-4 job-item">
            <div class="card h-100 shadow-sm" id="${item.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                    <p class="card-text flex-grow-1">${item.descricao}</p>
                    <div class="mt-auto">${contatoHTML}</div>
                </div>
                <div class="card-footer"><small class="text-muted">ID: ${item.id}</small></div>
            </div>
        </div>`;
    }

    function renderDoacao(pedido) {
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '';
        let contatoHTML = '';
        if (pedido.contato) {
            const numeroLimpo = pedido.contato.replace(/[\s+()-]/g, '');
            contatoHTML = `<p class="card-text small"><strong>Tel:</strong> <a href="tel:${numeroLimpo}">${pedido.contato}</a></p>`;
        }
        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-item">
            <div class="card h-100 shadow-sm" id="${pedido.id}">
                ${badgeUrgente}
                ${imagemHTML}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${pedido.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6>
                    <p class="card-text flex-grow-1">${pedido.descricao}</p>
                    <div class="mt-auto">
                        ${contatoHTML}
                        <a href="${pedido.link_contato}" class="btn btn-primary btn-block">Contactar por Email</a>
                    </div>
                </div>
                <div class="card-footer"><small class="text-muted">ID: ${pedido.id}</small></div>
            </div>
        </div>`;
    }

    function renderServico(item) {
        const logoHTML = item.logo_empresa ? `<div class="service-card-logo"><img src="${item.logo_empresa}" alt="Logo"></div>` : '';
        const precoHTML = item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : '';
        let contatoIconsHTML = '';
        if (item.contato) {
            const numeroLimpo = item.contato.replace(/[\s+()-]/g, '');
            contatoIconsHTML += `<a href="https://wa.me/${numeroLimpo}" target="_blank" class="contact-icon" title="Contactar por WhatsApp"><i class="fab fa-whatsapp"></i></a>`;
        }
        if (item.link_contato && item.link_contato.includes('@')) {
            const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`;
            contatoIconsHTML += `<a href="${emailLink}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`;
        }

        return `
        <div class="col-lg-4 col-md-6 mb-4 service-item">
            <div class="card h-100 shadow-sm position-relative" id="${item.id}">
                ${logoHTML}
                ${precoHTML}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title mt-4">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                    <p class="card-text flex-grow-1">${item.descricao}</p>
                    <div class="mt-auto card-contact-icons">${contatoIconsHTML}</div>
                </div>
                <div class="card-footer"><small class="text-muted">ID: ${item.id}</small></div>
            </div>
        </div>`;
    }

    function renderHabitacao(anuncio) {
        let contatoHTML = '';
        if (anuncio.contato) {
            const numeroLimpo = anuncio.contato.replace(/[\s+()-]/g, '');
            contatoHTML += `<strong>Tel:</strong> <a href="tel:${numeroLimpo}">${anuncio.contato}</a><br>`;
        }
        if (anuncio.link_contato && anuncio.link_contato.includes('@')) {
            const emailLink = anuncio.link_contato.startsWith('mailto:') ? anuncio.link_contato : `mailto:${anuncio.link_contato}`;
            const emailText = emailLink.replace('mailto:', '');
            contatoHTML += `<strong>Email:</strong> <a href="${emailLink}">${emailText}</a>`;
        }
        return `
        <div class="col-lg-4 col-md-6 mb-4 housing-item">
            <div class="card h-100 shadow-sm" id="${anuncio.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${anuncio.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${anuncio.localizacao}</h6>
                    <p class="card-text flex-grow-1">${anuncio.descricao}</p>
                    <div class="mt-auto"><p class="card-text small contact-info">${contatoHTML}</p></div>
                </div>
                <div class="card-footer"><small class="text-muted">ID: ${anuncio.id}</small></div>
            </div>
        </div>`;
    }

    // --- CARGA INICIAL DE TODAS LAS SECCIONES ---
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas');
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios');
});

// --- FUNCIONES DE BÚSQUEDA GLOBALES ---
function filterAnnouncements() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const locationText = document.getElementById('locationInput').value.toLowerCase();
    const items = document.querySelectorAll('.job-item, .announcement-item, .service-item, .housing-item');
    const noResultsMessage = document.getElementById('no-results');
    let visibleCount = 0;

    items.forEach(item => {
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const description = item.querySelector('.card-text').textContent.toLowerCase();
        const location = item.querySelector('.card-subtitle').textContent.toLowerCase();
        const textMatch = title.includes(searchText) || description.includes(searchText);
        const locationMatch = location.includes(locationText);

        if (textMatch && locationMatch) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (noResultsMessage) {
        noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationInput').value = '';
    filterAnnouncements();
}

// --- ASIGNAR EVENTOS A LOS INPUTS DE BÚSQUEDA ---
const searchInput = document.getElementById('searchInput');
const locationInput = document.getElementById('locationInput');
if (searchInput && locationInput) {
    searchInput.addEventListener('keyup', filterAnnouncements);
    locationInput.addEventListener('keyup', filterAnnouncements);
}