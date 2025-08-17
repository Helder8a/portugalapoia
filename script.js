// --- CÓDIGO FINAL Y COMPLETO PARA script.js (CON SEO CORREGIDO) ---
document.addEventListener("DOMContentLoaded", async () => {
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

    // --- LÓGICA DEL CONTADOR DE ANUNCIOS ---
    async function fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            const data = await response.json();
            const key = Object.keys(data)[0];
            return data[key] || [];
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return [];
        }
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

    // --- FUNCIÓN GENÉRICA PARA CARGAR ANUNCIOS ---
    async function carregarConteudo(jsonPath, containerId, renderFunction, pageName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const items = await fetchJson(jsonPath);
        if (items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há anúncios publicados nesta secção.</p>`;
            return;
        }
        container.innerHTML = '';
        items.sort((a, b) => (new Date(b.data_publicacao || 0)) - (new Date(a.data_publicacao || 0)));
        items.forEach(item => container.innerHTML += renderFunction(item, pageName));
    }

    // --- FUNCIÓN PARA FORMATEAR FECHAS Y ESTADO ---
    function formatarDatas(item) {
        if (!item || !item.data_publicacao) {
            return `<small class="text-muted">ID: ${item.id}</small>`;
        }
        const dataPublicacao = new Date(item.data_publicacao);
        const dataVencimento = new Date(item.data_vencimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

        let classeVencido = '';
        let textoVencido = '';

        if (dataVencimento < hoje) {
            classeVencido = 'vencido';
            textoVencido = `(Vencido)`;
        }

        return `<small class="text-muted">Publicado em: ${dataFormatada}</small>
                <small class="text-muted ml-2 ${classeVencido}">${textoVencido}</small>`;
    }

    // --- FUNCIÓN PARA LOS BOTONES DE PARTILHAR ---
    function renderShareButtons(item, page) {
        const url = `https://portugalapoia.com/${page}#${item.id}`;
        const text = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${item.titulo}"`;
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

        return `
        <div class="share-buttons">
            <small class="share-label">Partilhar:</small>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a>
            <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a>
        </div>`;
    }

    // --- FUNCIONES PARA RENDERIZAR CADA TIPO DE ANUNCIO ---

    // =================================================================
    // FUNCIÓN DE EMPLEOS CON SEO CORREGIDO Y VALIDADO
    // =================================================================
    function renderEmprego(item, pageName) {
        // Objeto de datos estructurados (Schema.org) para Google
        const jobPostingSchema = {
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": item.titulo,
            "description": `<p>${item.descricao}</p>`,
            "datePosted": item.data_publicacao, // Usando el campo correcto de tu JSON
            "validThrough": item.data_vencimento, // Añadido campo de expiración
            "hiringOrganization": {
                "@type": "Organization",
                "name": "Empresa Anunciante (via PortugalApoia)" // Valor por defecto ya que no existe en el JSON
            },
            "jobLocation": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": item.localizacao,
                    "addressCountry": "PT"
                }
            },
            "employmentType": "FULL_TIME, PART_TIME" // Valor por defecto ya que no existe en el JSON
        };

        let contatoHTML = '';
        if (item.contato) { contatoHTML += `<p class="card-text small mb-1"><strong>Tel:</strong> <a href="tel:${item.contato.replace(/[\s+()-]/g, '')}">${item.contato}</a></p>`; }
        if (item.link_contato && item.link_contato.includes('@')) { const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`; contatoHTML += `<p class="card-text small"><strong>Email:</strong> <a href="${emailLink}">${item.link_contato.replace('mailto:', '')}</a></p>`; }
        
        // El return ahora incluye el SCRIPT de JSON-LD al final
        return `
        <div class="col-lg-4 col-md-6 mb-4 job-item">
            <div class="card h-100 shadow-sm" id="${item.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                    <p class="card-text flex-grow-1">${item.descricao}</p>
                    <div class="mt-auto">${contatoHTML}</div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div class="date-info">${formatarDatas(item)}</div>
                    ${renderShareButtons(item, pageName)}
                </div>
            </div>
        </div>
        <script type="application/ld+json">
            ${JSON.stringify(jobPostingSchema)}
        </script>`;
    }

    function renderDoacao(pedido, pageName) {
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '<div class="image-placeholder">SEM IMAGEM</div>';
        let contatoHTML = '';
        if (pedido.contato) { contatoHTML = `<p class="card-text small"><strong>Tel:</strong> <a href="tel:${pedido.contato.replace(/[\s+()-]/g, '')}">${pedido.contato}</a></p>`; }
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
                        <a href="mailto:${pedido.link_contato}" class="btn btn-primary btn-block">Contactar por Email</a>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div>${formatarDatas(pedido)}</div>
                    ${renderShareButtons(pedido, pageName)}
                </div>
            </div>
        </div>`;
    }

    function renderServico(item, pageName) {
        const logoHTML = item.logo_empresa ? `<div class="service-card-logo"><img src="${item.logo_empresa}" alt="Logo"></div>` : '';
        const precoHTML = item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : '';
        let contatoIconsHTML = '<small class="contact-label">Contacto:</small>';
        if (item.contato) { contatoIconsHTML += `<a href="https://wa.me/${item.contato.replace(/[\s+()-]/g, '')}" target="_blank" class="contact-icon" title="Contactar por WhatsApp"><i class="fab fa-whatsapp"></i></a>`; }
        if (item.link_contato && item.link_contato.includes('@')) { const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`; contatoIconsHTML += `<a href="${emailLink}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`; }
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
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div>${formatarDatas(item)}</div>
                    ${renderShareButtons(item, pageName)}
                </div>
            </div>
        </div>`;
    }

    function renderHabitacao(anuncio, pageName) {
        let contatoHTML = '';
        if (anuncio.contato) { contatoHTML += `<strong>Tel:</strong> <a href="tel:${anuncio.contato.replace(/[\s+()-]/g, '')}">${anuncio.contato}</a><br>`; }
        if (anuncio.link_contato && anuncio.link_contato.includes('@')) { const emailLink = anuncio.link_contato.startsWith('mailto:') ? anuncio.link_contato : `mailto:${anuncio.link_contato}`; const emailText = emailLink.replace('mailto:', ''); contatoHTML += `<strong>Email:</strong> <a href="${emailLink}">${emailText}</a>`; }
        return `
        <div class="col-lg-4 col-md-6 mb-4 housing-item">
            <div class="card h-100 shadow-sm" id="${anuncio.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${anuncio.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${anuncio.localizacao}</h6>
                    <p class="card-text flex-grow-1">${anuncio.descricao}</p>
                    <div class="mt-auto"><p class="card-text small contact-info">${contatoHTML}</p></div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div>${formatarDatas(anuncio)}</div>
                    ${renderShareButtons(anuncio, pageName)}
                </div>
            </div>
        </div>`;
    }

    // --- CARGA INICIAL DE TODO ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');

    if (document.getElementById('contador-total')) {
        atualizarContadores();
    }
});