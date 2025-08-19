document.addEventListener("DOMContentLoaded", async () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO (SIN CAMBIOS) ---
    // (Esta parte del código no necesita cambios, la mantienes como está)

    // --- CARGA DINÁMICA DE HEADER Y FOOTER ---
    const headerHTML = `
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <a class="navbar-brand logo" href="index.html" style="display: inline-flex; align-items: center;">
                    <img src="images_pta/logocuadrado.jpg" alt="Logo PortugalApoia" style="height: 35px; margin-right: 10px;">
                    <span class="brand-text-responsive">PortugalApoia</span>
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="main-nav">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item"><a class="nav-link" href="doações.html">Doações</a></li>
                        <li class="nav-item"><a class="nav-link" href="empregos.html">Emprego</a></li>
                        <li class="nav-item"><a class="nav-link" href="serviços.html">Serviços</a></li>
                        <li class="nav-item"><a class="nav-link" href="habitação.html">Habitação</a></li>
                        <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
                        <li class="nav-item"><a class="nav-link btn btn-primary publish-btn" href="publicar.html">Publicar</a></li>
                    </ul>
                </div>
            </div>
        </nav>`;

    const footerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <img src="images_pta/logocuadrado.jpg" alt="Logo de PortugalApoia" style="height: 45px; margin-bottom: 15px;">
                    <h4>PortugalApoia</h4>
                    <p>A conectar a generosidade à necessidade.</p>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <h4>Navegação</h4>
                    <ul class="list-unstyled">
                        <li><a href="doações.html">Doações</a></li>
                        <li><a href="empregos.html">Emprego</a></li>
                        <li><a href="serviços.html">Serviços</a></li>
                        <li><a href="habitação.html">Habitação</a></li>
                        <li><a href="blog.html">Blog</a></li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <h4>Contacto</h4>
                    <p>Um projeto desenvolvido e patrocinado pela <a href="mailto:hbo.consulting.pt@gmail.com">HBO Consulting</a>.</p>
                </div>
            </div>
            <div class="footer-bottom text-center pt-3 mt-3">
                <p>&copy; 2025 PortugalApoia.com | <a href="politica-privacidade.html">Política de Privacidade</a></p>
            </div>
        </div>`;

    const headerElement = document.querySelector("header.main-header");
    if (headerElement) headerElement.innerHTML = headerHTML;
    const footerElement = document.querySelector("footer.main-footer");
    if (footerElement) footerElement.innerHTML = footerHTML;


    // --- LÓGICA DE DADOS (SIN CAMBIOS) ---
    // (Esta parte del código no necesita cambios, la mantienes como está)

    // --- FUNÇÕES DE RENDERIZAÇÃO (SIN CAMBIOS) ---
    // (Esta parte del código no necesita cambios, la mantienes como está)

    // --- LÓGICA DO BUSCADOR (SIN CAMBIOS) ---
    // (Esta parte del código no necesita cambios, la mantienes como está)

    // --- LÓGICA PARA A PÁGINA DO BLOG (CORREGIDA Y COMPLETA) ---
    function displayBlogPosts(posts) {
        const grid = document.getElementById('blog-posts-grid');
        const noResults = document.getElementById('no-results-blog');
        if (!grid) return;
        grid.innerHTML = '';
        if (!posts || posts.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        if (noResults) noResults.style.display = 'none';

        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'col-lg-4 col-md-6';
            const bodyHtml = post.corpo.replace(/\n/g, '<br>');

            postCard.innerHTML = `
                <div class="card blog-card shadow-sm h-100">
                    ${post.imagem ? `<img src="${post.imagem}" class="card-img-top" alt="${post.titulo}">` : ''}
                    <div class="card-body d-flex flex-column">
                        <span class="badge badge-primary badge-category mb-2">${post.categoria}</span>
                        <h5 class="card-title">${post.titulo}</h5>
                        <p class="card-text flex-grow-1">${bodyHtml.substring(0, 120)}...</p>
                        <p class="card-text mt-auto"><small class="text-muted">Publicado em ${new Date(post.data).toLocaleDateString('pt-PT')}</small></p>
                    </div>
                </div>`;
            grid.appendChild(postCard);
        });
    }

    async function loadAndFilterBlogPosts() {
        if (!document.getElementById('blog-posts-grid')) return;
        try {
            const response = await fetch('_dados/blog.json');
            const data = await response.json();
            const allPosts = data.posts.sort((a, b) => new Date(b.data) - new Date(a.data));
            displayBlogPosts(allPosts);

            const filterButtons = document.querySelectorAll('#category-filters button');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.replace('btn-primary', 'btn-secondary'));
                    button.classList.replace('btn-secondary', 'btn-primary');
                    const category = button.getAttribute('data-category');
                    if (category === 'all') {
                        displayBlogPosts(allPosts);
                    } else {
                        const filteredPosts = allPosts.filter(post => post.categoria === category);
                        displayBlogPosts(filteredPosts);
                    }
                });
            });
        } catch (error) {
            console.error('Erro ao carregar as publicações do blog:', error);
            const grid = document.getElementById('blog-posts-grid');
            if(grid) grid.innerHTML = '<p class="col-12 text-center text-danger">Não foi possível carregar as publicações do blog.</p>';
        }
    }

    // --- CARGAS DE CONTEÚDO E INICIALIZAÇÃO (COMPLETO) ---
    // (El resto de tu script.js, incluyendo las llamadas a carregarConteudo, etc.)
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    updateImpactCounters();
    setupSearch();
    loadAndFilterBlogPosts();
});