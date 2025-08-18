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
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme("dark");
        }
        themeToggle.addEventListener("change", () => {
            const newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        });
    }

    // --- LÓGICA DE DADOS ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`); // Evita o cache
            if (!response.ok) {
                console.error(`Erro ao carregar ${url}: ${response.statusText}`);
                return [];
            }
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

        if (items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há anúncios publicados nesta secção.</p>`;
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || 0) - new Date(a.data_publicacao || 0));

        // Construir todo o HTML de uma só vez para melhor performance e segurança
        const htmlContent = items.map(item => renderFunction(item, pageName)).join('');
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
    function formatarDatas(item) {
        if (!item || !item.data_publicacao) return `<small class="text-muted">ID: ${item.id || 'N/A'}</small>`;
        const dataPublicacao = new Date(item.data_publicacao);
        const dataVencimento = new Date(item.data_vencimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const isVencido = dataVencimento < hoje;
        const classeVencido = isVencido ? 'vencido' : '';
        const textoVencido = isVencido ? '(Vencido)' : '';

        return `<small class="text-muted">Publicado em: ${dataFormatada}</small>
                <small class="text-muted ml-2 ${classeVencido}">${textoVencido}</small>`;
    }

    function renderShareButtons(item, page) {
        const url = `https://portugalapoia.com/${page}#${item.id}`;
        const text = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${item.titulo}"`;
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        return `
        <div class="share-buttons">
            <small class="share-label">Partilhar:</small>
            <a href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a>
        </div>`;
    }

    function renderEmprego(item, pageName) {
        // Limpa a descrição para o JSON-LD, removendo quebras de linha e aspas
        const cleanDescription = (item.descricao || '').replace(/["\n\r]/g, ' ');

        const jobPostingSchema = {
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": item.titulo,
            "description": cleanDescription, // Usa a descrição limpa
            "datePosted": item.data_publicacao,
            "validThrough": item.data_vencimento,
            "hiringOrganization": { "@type": "Organization", "name": "Empresa Anunciante (via PortugalApoia)" },
            "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": item.localizacao, "addressCountry": "PT" } },
            "employmentType": "FULL_TIME, PART_TIME"
        };

        let contatoHTML = '';
        if (item.contato) { contatoHTML += `<p class="card-text small mb-1"><strong>Tel:</strong> <a href="tel:${item.contato.replace(/[\s+()-]/g, '')}">${item.contato}</a></p>`; }
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
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div>${formatarDatas(item)}</div>
                    ${renderShareButtons(item, pageName)}
                </div>
            </div>
        </div>
        <script type="application/ld+json">${JSON.stringify(jobPostingSchema)}</script>`;
    }
    
    // As outras funções de renderização (renderDoacao, renderServico, renderHabitacao) permanecem as mesmas
    function renderDoacao(pedido, pageName) {
        const productSchema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": pedido.titulo,
            "description": pedido.descricao,
            "image": pedido.imagem ? `https://portugalapoia.com${pedido.imagem}` : `https://portugalapoia.com/images/img_portada.webp`,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            },
            "itemCondition": "https://schema.org/UsedCondition"
        };
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '<div class="image-placeholder">SEM IMAGEM</div>';
        let contatoHTML = '';
        if (pedido.contato) { contatoHTML = `<p class="card-text small"><strong>Tel:</strong> <a href="tel:${pedido.contato.replace(/[\s+()-]/g, '')}">${pedido.contato}</a></p>`; }
        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-item">
            <div class="card h-100 shadow-sm" id="${pedido.id}">
                ${badgeUrgente}${imagemHTML}
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
        </div>
        <script type="application/ld+json">${JSON.stringify(productSchema)}</script>`;
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
                ${logoHTML}${precoHTML}
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

    // --- CARGA INICIAL ---
    if (document.getElementById('announcements-grid')) carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    if (document.getElementById('jobs-grid')) carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    if (document.getElementById('services-grid')) carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    if (document.getElementById('housing-grid')) carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    if (document.getElementById('contador-total')) {
        atualizarContadores();
    }
});