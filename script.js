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
            if (containerId !== 'gallery-section') {
                container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            }
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));

        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;

        // ***** CÓDIGO AÑADIDO PARA EL SCHEMA *****
        // Después de renderizar, añadimos los datos estructurados si es la página de empleos
        if (pageName === 'empregos.html') {
            items.forEach(item => {
                const schema = {
                    "@context": "https://schema.org/",
                    "@type": "JobPosting",
                    "title": item.titulo,
                    "description": item.descricao,
                    "datePosted": item.data_publicacao,
                    "validThrough": item.data_vencimento || '',
                    "employmentType": "FULL_TIME",
                    "hiringOrganization": {
                        "@type": "Organization",
                        "name": "Empresa (Confidencial)" // El JSON no tiene nombre de empresa, ponemos un placeholder
                    },
                    "jobLocation": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": item.localizacao,
                            "addressCountry": "PT"
                        }
                    }
                };

                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(schema);
                document.head.appendChild(script);
            });
        }

        // Ativar funcionalidades específicas da página após o carregamento
        if (pageName === 'blog.html') {
            setupBlogFunctionality();
        }
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
            <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
                <div class="blog-post-card">
                    <img class="card-img-top" src="${post.image}" alt="${post.title}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="text-muted small">Publicado em: ${formattedDate}</p>
                        <p class="card-text summary-content">${post.summary}</p>
                        <div class="full-content" style="display: none;">
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

    function renderGalleryItem(item) {
        const itemDate = new Date(item.date);
        const formattedDate = itemDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        return `
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="gallery-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="caption">
                        <h5>${item.title}</h5>
                        <p>${item.caption}</p>
                        <small class="text-white-50">${formattedDate}</small>
                    </div>
                </div>
            </div>
        `;
    }

    function renderEmprego(item, pageName, idAnuncio) {
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.localizacao}</h6>
                    <p class="card-text">${item.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(item)}
                    ${renderShareButtons(item, pageName)}
                </div>
            </div>
        </div>
        `;
    }
    function renderDoacao(pedido, pageName) {
        const imagemHTML = pedido.imagem ? `<img src="${pedido.imagem}" class="card-img-top" alt="${pedido.titulo}">` : `<div class="image-placeholder">${pedido.titulo}</div>`;
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                ${imagemHTML}
                <div class="card-body">
                    <h5 class="card-title">${pedido.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${pedido.localizacao}</h6>
                    <p class="card-text">${pedido.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(pedido)}
                    ${renderShareButtons(pedido, pageName)}
                </div>
            </div>
        </div>
        `;
    }
    function renderServico(item, pageName) {
        const logoHTML = item.logo_empresa ? `<div class="service-card-logo"><img src="${item.logo_empresa}" alt="Logo"></div>` : '';
        const precoHTML = item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : '';

        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                ${precoHTML}
                <div class="card-body">
                    ${logoHTML}
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.localizacao}</h6>
                    <p class="card-text">${item.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(item)}
                    ${renderShareButtons(item, pageName)}
                </div>
            </div>
        </div>
        `;
    }
    function renderHabitacao(anuncio, pageName) {
        const imagemHTML = anuncio.imagens && anuncio.imagens.length > 0 && anuncio.imagens[0].imagem_url ? `<img src="${anuncio.imagens[0].imagem_url}" class="card-img-top" alt="${anuncio.titulo}">` : `<div class="image-placeholder">${anuncio.titulo}</div>`;
        const precoHTML = anuncio.valor_anuncio ? `<div class="card-price">${anuncio.valor_anuncio}</div>` : '';

        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                ${imagemHTML}
                ${precoHTML}
                <div class="card-body">
                    <h5 class="card-title">${anuncio.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${anuncio.localizacao}</h6>
                    <p class="card-text">${anuncio.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(anuncio)}
                    ${renderShareButtons(anuncio, pageName)}
                </div>
            </div>
        </div>
        `;
    }

    // --- FUNCIONALIDADES ESPECÍFICAS ---

    function setupBlogFunctionality() {
        // Lógica dos botões "Ler Mais"
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.blog-post-card');
                const summary = card.querySelector('.summary-content');
                const fullContent = card.querySelector('.full-content');

                summary.style.display = 'none';
                fullContent.style.display = 'block';
                e.target.style.display = 'none';
            });
        });

        // Lógica da Navegação por Tabs (Categorias)
        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Atualiza a classe 'active'
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');

                const targetCategory = e.target.getAttribute('data-target');

                if (targetCategory === 'galeria') {
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex'; // Usamos flex por ser 'row'
                } else {
                    gallerySection.style.display = 'none';
                    postsSection.style.display = 'flex';

                    const allPosts = document.querySelectorAll('.blog-post-item');
                    allPosts.forEach(post => {
                        if (targetCategory === 'all' || post.dataset.category === targetCategory) {
                            post.style.display = 'block';
                        } else {
                            post.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    async function loadHomepageContent() {
        const homeData = await fetchJson('/_dados/homepage.json');
        if (homeData) {
            document.getElementById('hero-title').textContent = homeData.hero_title || "Bem-vindo ao Portugal Apoia";
            document.getElementById('hero-subtitle').textContent = homeData.hero_subtitle || "A sua plataforma de apoio comunitário para encontrar e oferecer ajuda.";
            document.getElementById('doacoes-text').textContent = homeData.impact_counters.doacoes_text || "Doações Realizadas";
            document.getElementById('empregos-text').textContent = homeData.impact_counters.emprego_text || "Empregos Publicados";
            document.getElementById('total-text').textContent = homeData.impact_counters.total_text || "Total de Anúncios";
        }
    }

    async function updateImpactCounters() {
        const doacoes = await fetchJson('/_dados/doacoes.json');
        const empregos = await fetchJson('/_dados/empregos.json');
        const servicos = await fetchJson('/_dados/servicos.json');

        const totalDoacoes = doacoes.length;
        const totalEmpregos = empregos.length;
        const totalServicos = servicos.length;
        const totalGeral = totalDoacoes + totalEmpregos + totalServicos;

        document.getElementById('contador-doacoes').textContent = `${totalDoacoes}+`;
        document.getElementById('contador-empregos').textContent = `${totalEmpregos}+`;
        document.getElementById('contador-total').textContent = `${totalGeral}+`;
    }


    // --- CARGA INICIAL Y LLAMADAS A FUNCIONES ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'blog.html');
    carregarConteudo('/_dados/galeria.json', 'gallery-section', renderGalleryItem, 'blog.html');


    updateImpactCounters();
    if (document.body.classList.contains('home')) {
        loadHomepageContent();
    }

    function setupSearch() {
        const searchButton = document.getElementById('searchButton');
        const clearButton = document.getElementById('clearButton');
        const searchInput = document.getElementById('searchInput');
        const locationInput = document.getElementById('locationInput');
        const noResults = document.getElementById('no-results');
        const gridId = document.querySelector('.row[id$="-grid"]').id;
        const grid = document.getElementById(gridId);

        function filter() {
            const searchTerm = searchInput.value.toLowerCase();
            const locationTerm = locationInput.value.toLowerCase();
            const items = grid.querySelectorAll('.col-md-4');
            let found = false;

            items.forEach(item => {
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const location = item.querySelector('.card-subtitle').textContent.toLowerCase();
                const description = item.querySelector('.card-text').textContent.toLowerCase();

                const textMatch = title.includes(searchTerm) || description.includes(searchTerm);
                const locationMatch = location.includes(locationTerm);

                if (textMatch && locationMatch) {
                    item.style.display = '';
                    found = true;
                } else {
                    item.style.display = 'none';
                }
            });

            noResults.style.display = found ? 'none' : 'block';
        }

        function clear() {
            searchInput.value = '';
            locationInput.value = '';
            filter();
        }

        if (searchButton) searchButton.addEventListener('click', filter);
        if (clearButton) clearButton.addEventListener('click', clear);
    }
    setupSearch();
});