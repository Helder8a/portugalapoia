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

        if (typeof renderFunction !== 'function') {
            console.error(`A função para renderizar a secção "${containerId}" não foi encontrada.`);
            return;
        }

        const items = await fetchJson(jsonPath);

        if (!items || items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));

        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
        
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

    function renderShareButtons(item, page) {
        const url = `https://portugalapoia.com/${page}#${item.id}`;
        const text = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${item.titulo}"`;
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        return `<div class="share-buttons"><small class="share-label">Partilhar:</small><a href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a></div>`;
    }

    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    
        return `
            <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
                <div class="blog-post-card card">
                    <div class="card-number">${post.id || ''}</div>
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
    
    function renderDoacao(pedido, pageName) {
        const imagemHTML = pedido.imagem ? `<img src="${pedido.imagem}" class="card-img-top" alt="${pedido.titulo}">` : `<div class="image-placeholder">${pedido.titulo}</div>`;
        return `
            <div class="col-lg-4 col-md-6 mb-4 announcement-item" id="${pedido.id}">
                <div class="card h-100 announcement-card">
                    ${imagemHTML}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${pedido.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6>
                        <p class="card-text flex-grow-1">${pedido.descricao}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        ${formatarDatas(pedido)}
                        ${renderShareButtons(pedido, pageName)}
                    </div>
                </div>
            </div>`;
    }

    function renderEmprego(item, pageName) {
        return `
            <div class="col-lg-4 col-md-6 mb-4 job-item" id="${item.id}">
                <div class="card h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                        <p class="card-text flex-grow-1">${item.descricao.substring(0, 150)}...</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        ${formatarDatas(item)}
                        ${renderShareButtons(item, pageName)}
                    </div>
                </div>
            </div>`;
    }

    function renderServico(item, pageName) {
        const logoHTML = item.logo_empresa ? `<div class="service-card-logo"><img src="${item.logo_empresa}" alt="Logo"></div>` : '';
        const precoHTML = item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : '';
        return `
            <div class="col-lg-4 col-md-6 mb-4 service-item" id="${item.id}">
                <div class="card h-100">
                    <div class="card-body d-flex flex-column">
                        ${logoHTML}
                        ${precoHTML}
                        <h5 class="card-title mt-4">${item.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                        <p class="card-text flex-grow-1">${item.descricao}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                         ${formatarDatas(item)}
                        ${renderShareButtons(item, pageName)}
                    </div>
                </div>
            </div>`;
    }

    function renderHabitacao(anuncio, pageName) {
        const imagemHTML = anuncio.imagens && anuncio.imagens.length > 0 ? `<img src="${anuncio.imagens[0]}" class="card-img-top" alt="${anuncio.titulo}">` : `<div class="image-placeholder">${anuncio.titulo}</div>`;
        return `
            <div class="col-lg-4 col-md-6 mb-4 housing-item" id="${anuncio.id}">
                <div class="card h-100">
                    ${imagemHTML}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${anuncio.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${anuncio.localizacao}</h6>
                        <p class="card-text flex-grow-1">${anuncio.descricao}</p>
                        <p class="h5 text-right font-weight-bold mt-2">${anuncio.valor_anuncio}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        ${formatarDatas(anuncio)}
                        ${renderShareButtons(anuncio, pageName)}
                    </div>
                </div>
            </div>`;
    }

    // --- FUNCIONALIDADES ESPECÍFICAS ---
    function setupBlogFunctionality() {
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

        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');

                const targetCategory = e.target.getAttribute('data-target');

                if (targetCategory === 'galeria') {
                    if (postsSection) postsSection.style.display = 'none';
                    if (gallerySection) gallerySection.style.display = 'flex';
                } else {
                    if (gallerySection) gallerySection.style.display = 'none';
                    if (postsSection) postsSection.style.display = 'flex';

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

    // --- CARGA INICIAL ---
    if (document.getElementById('announcements-grid')) {
        carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    }
    if (document.getElementById('jobs-grid')) {
        carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    }
    if (document.getElementById('services-grid')) {
        carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    }
    if (document.getElementById('housing-grid')) {
        carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    }
    if (document.getElementById('posts-section')) {
        carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'blog.html');
    }
});