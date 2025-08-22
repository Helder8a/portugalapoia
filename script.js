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
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));

        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
        
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

    function renderEmprego(item, pageName, idAnuncio) { /* ... (código existente) ... */ }
    function renderDoacao(pedido, pageName) { /* ... (código existente) ... */ }
    function renderServico(item, pageName) { /* ... (código existente) ... */ }
    function renderHabitacao(anuncio, pageName) { /* ... (código existente) ... */ }
    
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

    async function loadHomepageContent() { /* ... (código existente) ... */ }
    async function updateImpactCounters() { /* ... (código existente) ... */ }

    // --- CARGA INICIAL Y LLAMADAS A FUNCIONES ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'blog.html');

    updateImpactCounters();
    if (document.body.classList.contains('home')) {
        loadHomepageContent();
    }

    function setupSearch() { /* ... (código existente) ... */ }
    setupSearch();
});