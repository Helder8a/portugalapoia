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

    // --- LÓGICA DE DATOS ---
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

        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));

        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function formatarDatas(item) {
        if (!item || !item.data_publicacao || !item.data_vencimento) {
            return `<div class="date-info">ID: ${item.id || 'N/A'}</div>`;
        }
        const dataPublicacao = new Date(item.data_publicacao);
        const dataVencimento = new Date(item.data_vencimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const pubFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const vencFormatada = dataVencimento.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const isVencido = dataVencimento < hoje;
        const classeVencido = isVencido ? 'vencido' : '';
        const textoVencido = isVencido ? '(Vencido)' : '';
        return `<div class="date-info">Publicado: ${pubFormatada} <br> <span class="${classeVencido}">Vencimento: ${vencFormatada} ${textoVencido}</span></div>`;
    }
    
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    
        return `
            <div class="col-lg-4 col-md-6 mb-4 tab-pane" data-category="all ${post.category}">
                <div class="blog-post-card">
                    <img class="card-img-top" src="${post.image}" alt="${post.title}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="text-muted small">Publicado em: ${formattedDate}</p>
                        <p class="card-text">${post.summary}</p>
                        <div class="full-content">
                            <p>${post.body.replace(/\n/g, '</p><p>')}</p>
                        </div>
                        <button class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderShareButtons(item, page) {
        const url = `https://portugalapoia.com/${page}#${item.id}`;
        const text = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${item.titulo}"`;
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        return `<div class="share-buttons"><small class="share-label">Partilhar:</small><a href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a></div>`;
    }

    function renderEmprego(item, pageName, idAnuncio) {
        const jobPostingSchema = { "@context": "https://schema.org/", "@type": "JobPosting", "title": item.titulo, "description": (item.descricao || '').replace(/["\n\r]/g, ' ').trim(), "datePosted": item.data_publicacao, "validThrough": item.data_vencimento, "hiringOrganization": { "@type": "Organization", "name": "Empresa Anunciante (via PortugalApoia)" }, "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": item.localizacao, "addressCountry": "PT" } }, "employmentType": "FULL_TIME, PART_TIME" };
        let contatoHTML = '';
        if (item.contato) { contatoHTML += `<p class="card-text small mb-1"><strong>Tel:</strong> <a href="tel:${item.contato.replace(/[\s+()-]/g, '')}">${item.contato}</a></p>`; }
        if (item.link_contato && item.link_contato.includes('@')) { const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`; contatoHTML += `<p class="card-text small"><strong>Email:</strong> <a href="${emailLink}">${item.link_contato.replace('mailto:', '')}</a></p>`; }
        return `<div class="col-lg-4 col-md-6 mb-4 job-item"><div class="card h-100 shadow-sm" id="${item.id}"><div class="card-body d-flex flex-column"><h5 class="card-title">${item.titulo || 'Sem Título'}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao || 'N/A'}</h6><p class="card-text flex-grow-1">${item.descricao || 'Sem Descrição'}</p><div class="mt-auto">${contatoHTML}</div></div><div class="card-footer d-flex justify-content-between align-items-center"><div class="date-info">${formatarDatas(item)}</div>${renderShareButtons(item, pageName)}</div></div></div><script type="application/ld+json">${JSON.stringify(jobPostingSchema)}</script>`;
    }

    function renderDoacao(pedido, pageName) {
        const productSchema = { "@context": "https://schema.org/", "@type": "Product", "name": pedido.titulo, "description": pedido.descricao, "image": pedido.imagem ? `https://portugalapoia.com${pedido.imagem}` : `https://portugalapoia.com/images/img_portada.webp`, "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" }, "itemCondition": "https://schema.org/UsedCondition" };
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '<div class="image-placeholder">SEM IMAGEM</div>';
        let contatoHTML = '';
        if (pedido.contato) { contatoHTML = `<p class="card-text small"><strong>Tel:</strong> <a href="tel:${pedido.contato.replace(/[\s+()-]/g, '')}">${pedido.contato}</a></p>`; }
        return `<div class="col-lg-4 col-md-6 mb-4 announcement-item"><div class="card h-100 shadow-sm" id="${pedido.id}">${badgeUrgente}${imagemHTML}<div class="card-body d-flex flex-column"><h5 class="card-title">${pedido.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6><p class="card-text flex-grow-1">${pedido.descricao}</p><div class="mt-auto">${contatoHTML}<a href="mailto:${pedido.link_contato}" class="btn btn-primary btn-block">Contactar por Email</a></div></div><div class="card-footer d-flex justify-content-between align-items-center"><div class="date-info">${formatarDatas(pedido)}</div>${renderShareButtons(pedido, pageName)}</div></div></div><script type="application/ld+json">${JSON.stringify(productSchema)}</script>`;
    }

    function renderServico(item, pageName) {
        const logoHTML = item.logo_empresa ? `<div class="service-card-logo"><img src="${item.logo_empresa}" alt="Logo"></div>` : '';
        const precoHTML = item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : '';
        let contatoIconsHTML = '<small class="contact-label">Contacto:</small>';
        if (item.contato) { contatoIconsHTML += `<a href="https://wa.me/${item.contato.replace(/[\s+()-]/g, '')}" target="_blank" class="contact-icon" title="Contactar por WhatsApp"><i class="fab fa-whatsapp"></i></a>`; }
        if (item.link_contato && item.link_contato.includes('@')) { const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`; contatoIconsHTML += `<a href="${emailLink}" class="contact-icon" title="Contactar por Email"><i class="fas fa-envelope"></i></a>`; }
        return `<div class="col-lg-4 col-md-6 mb-4 service-item"><div class="card h-100 shadow-sm position-relative" id="${item.id}">${logoHTML}${precoHTML}<div class="card-body d-flex flex-column"><h5 class="card-title mt-4">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6><p class="card-text flex-grow-1">${item.descricao}</p><div class="mt-auto card-contact-icons">${contatoIconsHTML}</div></div><div class="card-footer d-flex justify-content-between align-items-center">${formatarDatas(item)}${renderShareButtons(item, pageName)}</div></div></div>`;
    }

    function renderHabitacao(anuncio, pageName) {
        const precoHTML = anuncio.valor_anuncio ? `<div class="card-price">${anuncio.valor_anuncio}</div>` : '';

        let imagensHTML = '';
        if (anuncio.imagens && anuncio.imagens.length > 0) {
            if (anuncio.imagens.length > 1) {
                const carouselId = `carousel-${anuncio.id}`;
                const indicators = anuncio.imagens.map((_, index) =>
                    `<li data-target="#${carouselId}" data-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>`
                ).join('');
                const items = anuncio.imagens.map((img, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${img.imagem_url || img}" class="d-block w-100" alt="${anuncio.titulo}" style="height: 200px; object-fit: cover;">
                </div>
            `).join('');

                imagensHTML = `
                <div id="${carouselId}" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">${indicators}</ol>
                    <div class="carousel-inner">${items}</div>
                    <a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>
                    </a>
                </div>`;
            } else {
                imagensHTML = `<img loading="lazy" src="${anuncio.imagens[0].imagem_url || anuncio.imagens[0]}" class="d-block w-100" alt="${anuncio.titulo}" style="height: 200px; object-fit: cover;">`;
            }
        } else {
            imagensHTML = '<div class="image-placeholder">SEM IMAGEM</div>';
        }

        let contatoHTML = '';
        if (anuncio.contato) {
            contatoHTML += `<strong>Tel:</strong> <a href="tel:${anuncio.contato.replace(/[\s+()-]/g, '')}">${anuncio.contato}</a><br>`;
        }
        if (anuncio.link_contato && anuncio.link_contato.includes('@')) {
            const emailLink = anuncio.link_contato.startsWith('mailto:') ? anuncio.link_contato : `mailto:${anuncio.link_contato}`;
            const emailText = emailLink.replace('mailto:', '');
            contatoHTML += `<strong>Email:</strong> <a href="${emailLink}">${emailText}</a>`;
        }

        return `<div class="col-lg-4 col-md-6 mb-4 housing-item">
                <div class="card h-100 shadow-sm position-relative" id="${anuncio.id}">
                    ${precoHTML}
                    ${imagensHTML}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${anuncio.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${anuncio.localizacao}</h6>
                        <p class="card-text flex-grow-1">${anuncio.descricao}</p>
                        <div class="mt-auto">
                            <p class="card-text small contact-info">${contatoHTML}</p>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        ${formatarDatas(anuncio)}
                        ${renderShareButtons(anuncio, pageName)}
                    </div>
                </div>
            </div>`;
    }
    
    // --- NUEVA FUNCIÓN PARA LA PÁGINA PRINCIPAL ---
    async function loadHomepageContent() {
        try {
            const response = await fetch('/_dados/homepage.json?t=' + new Date().getTime());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const heroTitle = document.getElementById('hero-title');
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroTitle) heroTitle.textContent = data.hero_title;
            if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle;

            const doacoesText = document.getElementById('doacoes-text');
            const empregosText = document.getElementById('empregos-text');
            const totalText = document.getElementById('total-text');
            if (doacoesText) doacoesText.textContent = data.impact_counters.doacoes_text;
            if (empregosText) empregosText.textContent = data.impact_counters.emprego_text;
            if (totalText) totalText.textContent = data.impact_counters.total_text;

        } catch (error) {
            console.error("Erro ao carregar o conteúdo da página principal:", error);
            document.getElementById('hero-title').textContent = 'Bem-vindo ao Portugal Apoia';
            document.getElementById('hero-subtitle').textContent = 'A sua plataforma de apoio comunitário.';
        }
    }
    
    // Función para actualizar los contadores del impacto en la comunidad
    async function updateImpactCounters() {
        const doacoes = await fetchJson('/_dados/doacoes.json');
        const empregos = await fetchJson('/_dados/empregos.json');
        const servicos = await fetchJson('/_dados/servicos.json');
        const habitacao = await fetchJson('/_dados/habitacao.json');

        document.getElementById('contador-doacoes').textContent = `${doacoes.length}+`;
        document.getElementById('contador-empregos').textContent = `${empregos.length}+`;
        document.getElementById('contador-total').textContent = `${doacoes.length + empregos.length + servicos.length + habitacao.length}+`;
    }

    // --- CARGA INICIAL Y LLAMADAS A FUNCIONES ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'blog.html');

    // Llamada a las funciones de contadores y contenido de la home
    updateImpactCounters();
    if (document.body.classList.contains('home')) {
        loadHomepageContent();
    }

    // --- LÓGICA DO BUSCADOR ---
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

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
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