document.addEventListener("DOMContentLoaded", async () => {
    // --- ELEMENTOS DO DOM ---
    const postsGrid = document.getElementById('posts-grid');
    const categoryNav = document.getElementById('category-filter-nav');
    const searchInput = document.getElementById('blog-search-input');
    const noPostsMessage = document.getElementById('no-posts-message');
    const loadMoreBtn = document.getElementById('load-more-posts');
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // --- ESTADO DA APLICAÇÃO ---
    let allPosts = [];
    let authorsMap = new Map();
    let currentFilter = 'todos';
    let currentSearchTerm = '';
    let visiblePostsCount = 0;
    const POSTS_PER_PAGE = 6;

    // --- FUNÇÕES DE CARREGAMENTO ---
    const fetchData = async (url) => {
        try {
            const response = await fetch(`${url}?v=${new Date().getTime()}`);
            if (!response.ok) throw new Error(`Erro ao carregar ${url}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    
    // Carregar Header e Footer
    const loadTemplate = async (url, element) => {
        const response = await fetch(url);
        const text = await response.text();
        const template = document.createElement('template');
        template.innerHTML = text;
        const nav = template.content.querySelector('.navbar');
        if (nav) {
            element.appendChild(nav);
        } else {
             element.innerHTML = text;
        }
    };
    
    // --- FUNÇÕES AUXILIARES ---
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    const calculateReadingTime = (text) => {
        if (!text) return '1 min';
        const wordsPerMinute = 225;
        const wordCount = text.trim().split(/\s+/).length;
        return `${Math.ceil(wordCount / wordsPerMinute)} min de leitura`;
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderPosts = () => {
        const filteredPosts = allPosts.filter(post => 
            (currentFilter === 'todos' || post.category === currentFilter) &&
            (post.title.toLowerCase().includes(currentSearchTerm) || post.summary.toLowerCase().includes(currentSearchTerm))
        );

        postsGrid.innerHTML = '';
        visiblePostsCount = 0;
        
        if (filteredPosts.length === 0) {
            noPostsMessage.style.display = 'block';
            loadMoreBtn.style.display = 'none';
        } else {
            noPostsMessage.style.display = 'none';
            appendPosts(filteredPosts);
        }
    };

    const appendPosts = (posts) => {
        const postsToAppend = posts.slice(visiblePostsCount, visiblePostsCount + POSTS_PER_PAGE);
        postsToAppend.forEach(post => {
            const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "/images_pta/logocuadrado.jpg" };
            const postCard = `
                <div class="col-lg-4 col-md-6 mb-5 journal-article">
                    <div class="post-card" data-post='${JSON.stringify(post)}' data-toggle="modal" data-target="#postModal">
                        <img src="${post.image}" class="card-img-top post-card-img" alt="${post.title}" loading="lazy">
                        <div class="card-body p-0">
                            <p class="text-muted mb-2">${formatDate(post.date)} &bull; ${post.category.toUpperCase()}</p>
                            <h5 class="post-card-title">${post.title}</h5>
                            <p class="post-card-summary">${post.summary}</p>
                        </div>
                    </div>
                </div>`;
            postsGrid.innerHTML += postCard;
        });
        visiblePostsCount += postsToAppend.length;
        loadMoreBtn.style.display = visiblePostsCount < posts.length ? 'block' : 'none';
    };

    const createCategoryFilters = () => {
        const categories = ['todos', ...new Set(allPosts.map(p => p.category))];
        categoryNav.innerHTML = categories.map(cat => 
            `<button class="btn category-btn ${cat === 'todos' ? 'active' : ''}" data-category="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`
        ).join('');
    };

    // --- EVENT LISTENERS ---
    const setupEventListeners = () => {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            renderPosts();
        });

        categoryNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                document.querySelector('.category-btn.active').classList.remove('active');
                e.target.classList.add('active');
                currentFilter = e.target.dataset.category;
                renderPosts();
            }
        });
        
        loadMoreBtn.addEventListener('click', () => {
            const filteredPosts = allPosts.filter(post => 
                (currentFilter === 'todos' || post.category === currentFilter) &&
                (post.title.toLowerCase().includes(currentSearchTerm) || post.summary.toLowerCase().includes(currentSearchTerm))
            );
            appendPosts(filteredPosts);
        });

        $('#postModal').on('show.bs.modal', function(event) {
            const card = $(event.relatedTarget);
            const post = card.data('post');
            const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "/images_pta/logocuadrado.jpg", bio: "" };
            
            document.title = `${post.title} | Blog PortugalApoia`;
            $('#meta-description').attr('content', post.meta_description || post.summary);
            $('#meta-keywords').attr('content', post.tags ? post.tags.join(', ') : '');
            $('#meta-author').attr('content', author.nome);

            const modal = $(this);
            modal.find('#modal-image').attr('src', post.image);
            modal.find('.modal-title').text(post.title);
            modal.find('#modal-author-info').html(`<img src="${author.avatar}" alt="${author.nome}" class="rounded-circle mr-3" style="width:50px; height:50px;"><div><strong class="d-block">${author.nome}</strong><small class="text-muted">${author.bio || ''}</small></div>`);
            modal.find('#modal-meta').html(`<span class="category text-primary">${post.category}</span> &bull; <span>${calculateReadingTime(post.body)}</span> &bull; <span class="text-muted">${formatDate(post.date)}</span>`);
            modal.find('#modal-body').html(marked.parse(post.body || ''));
        });

        $('#postModal').on('hidden.bs.modal', function() {
            document.title = 'Blog PortugalApoia | Notícias, Guias e Histórias da Comunidade';
            $('#meta-description').attr('content', 'Explore o nosso blog para encontrar as últimas notícias...');
            $('#meta-keywords').attr('content', 'blog, portugal, comunidade...');
            $('#meta-author').attr('content', 'PortugalApoia');
        });
    };
    
    // --- INICIALIZAÇÃO ---
    const init = async () => {
        await Promise.all([
            loadTemplate('index.html #main-nav', headerPlaceholder),
            loadTemplate('index.html .main-footer', footerPlaceholder)
        ]);

        const [postsData, authorsData] = await Promise.all([
            fetchData('/_dados/blog.json'),
            fetchData('/_dados/autores.json')
        ]);

        if (postsData && postsData.posts) {
            allPosts = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        if (authorsData) {
            authorsMap = new Map(authorsData.map(author => [author.id, author]));
        }

        if (allPosts.length > 0) {
            createCategoryFilters();
            renderPosts();
            setupEventListeners();
        } else {
             postsGrid.innerHTML = "<p class='col-12 text-center lead'>Não foi possível carregar os artigos do blog.</p>";
        }
    };

    init();
});