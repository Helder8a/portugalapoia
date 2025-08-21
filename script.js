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

        // Verifica que la función para renderizar exista antes de continuar
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
    
    // **NOVO**: Função de renderização para o Blog (com o ID incluído)
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    
        return `
            <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
                <div class="blog-post-card">
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

    // **IMPORTANTE**: Funções de placeholder para evitar erros.
    // Substitua estas por suas funções de renderização reais se as tiver.
    function renderDoacao(item) { return `<div class="col-12"><p>Item de doação: ${item.titulo}</p></div>`; }
    function renderEmprego(item) { return `<div class="col-12"><p>Vaga de emprego: ${item.titulo}</p></div>`; }
    function renderServico(item) { return `<div class="col-12"><p>Serviço: ${item.titulo}</p></div>`; }
    function renderHabitacao(item) { return `<div class="col-12"><p>Anúncio de habitação: ${item.titulo}</p></div>`; }


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

    // --- CARGA INICIAL E CHAMADAS A FUNÇÕES ---
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