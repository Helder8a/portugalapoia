document.addEventListener("DOMContentLoaded", async () => {
    // --- ELEMENTOS DO DOM ---
    const postsGridContainer = document.getElementById('posts-grid');
    const loadMoreButton = document.getElementById('load-more-posts');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const searchInput = document.getElementById('blog-search');
    const noResultsMessage = document.getElementById('no-results-message');

    // --- ESTADO DA APLICAÇÃO ---
    let allPosts = [];
    let authorsMap = new Map();
    let currentFilteredPosts = [];
    let displayedPostsCount = 0;
    const POSTS_PER_PAGE = 6;

    // --- FUNÇÕES DE CARREGAMENTO DE DADOS ---
    async function fetchData(url) {
        try {
            const response = await fetch(`${url}?v=${new Date().getTime()}`); // Cache-busting
            if (!response.ok) {
                throw new Error(`A resposta da rede para ${url} não foi bem-sucedida.`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro crítico ao carregar dados de ${url}:`, error);
            postsGridContainer.innerHTML = `<p class='text-center text-danger col-12'>Ocorreu um erro ao carregar o conteúdo do blog. Por favor, tente novamente mais tarde.</p>`;
            return null;
        }
    }

    // --- FUNÇÕES AUXILIARES (HELPERS) ---
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const calculateReadingTime = (text) => {
        if (!text) return '1 min';
        const wordsPerMinute = 225;
        const wordCount = text.trim().split(/\s+/).length;
        return `${Math.ceil(wordCount / wordsPerMinute)} min de leitura`;
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const createPostCard = (post) => {
        const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "/images_pta/logocuadrado.jpg" };
        const postIndex = allPosts.findIndex(p => p.title === post.title && p.date === post.date); // Maneira mais segura de encontrar o índice

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card blog-card h-100" data-post-index="${postIndex}" data-toggle="modal" data-target="#postModal" style="cursor: pointer;">
                <img src="${post.image}" class="card-img-top" alt="${post.title}">
                <div class="card-body d-flex flex-column">
                    <div class="post-meta mb-2">
                        <span class="category">${post.category}</span> &bull;
                        <span class="reading-time">${calculateReadingTime(post.body)}</span>
                    </div>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text flex-grow-1">${post.summary}</p>
                    <div class="author-info d-flex align-items-center mt-auto">
                        <img src="${author.avatar}" alt="${author.nome}" class="rounded-circle mr-2" style="width: 30px; height: 30px;">
                        <small class="text-muted">${author.nome} &bull; ${formatDate(post.date)}</small>
                    </div>
                </div>
            </div>`;
        return card;
    };
    
    const renderPosts = (clear = true) => {
        if (clear) {
            postsGridContainer.innerHTML = '';
            displayedPostsCount = 0;
        }

        const postsToRender = currentFilteredPosts.slice(displayedPostsCount, displayedPostsCount + POSTS_PER_PAGE);

        if (postsToRender.length === 0 && clear) {
            noResultsMessage.classList.remove('d-none');
        } else {
            noResultsMessage.classList.add('d-none');
        }
        
        postsToRender.forEach(post => {
            postsGridContainer.appendChild(createPostCard(post));
        });

        displayedPostsCount += postsToRender.length;
        loadMoreButton.style.display = displayedPostsCount < currentFilteredPosts.length ? 'block' : 'none';
    };

    // --- LÓGICA DE FILTRAGEM E PESQUISA ---
    const filterAndSearchPosts = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeCategory = document.querySelector('.category-filter.active')?.dataset.category || 'todos';

        currentFilteredPosts = allPosts.filter(post => {
            const inCategory = activeCategory === 'todos' || post.category === activeCategory;
            const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm) || post.summary.toLowerCase().includes(searchTerm) || (post.tags && post.tags.join(' ').toLowerCase().includes(searchTerm));
            return inCategory && matchesSearch;
        });

        renderPosts(true); // Renderizar com limpeza do grid
    };

    // --- CONFIGURAÇÃO DOS EVENTOS (EVENT LISTENERS) ---
    const setupEventListeners = () => {
        loadMoreButton.addEventListener('click', () => renderPosts(false)); // Renderizar sem limpar

        searchInput.addEventListener('input', filterAndSearchPosts);

        categoryFilters.forEach(button => {
            button.addEventListener('click', () => {
                categoryFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterAndSearchPosts();
            });
        });

        $('#postModal').on('show.bs.modal', (event) => {
            const card = event.relatedTarget;
            const postIndex = card.dataset.postIndex;
            const post = allPosts[postIndex];

            if (post) {
                const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "/images_pta/logocuadrado.jpg", bio: "" };
                
                // Atualiza meta tags para SEO
                document.title = `${post.title} | Blog PortugalApoia`;
                document.getElementById('meta-description').setAttribute('content', post.meta_description || post.summary || '');
                document.getElementById('meta-keywords').setAttribute('content', post.tags ? post.tags.join(', ') : '');
                document.getElementById('meta-author').setAttribute('content', author.nome);

                // Preenche o modal
                const modal = $('#postModal');
                modal.find('#modal-image').attr('src', post.image);
                modal.find('.modal-title').text(post.title);
                modal.find('#modal-author-info').html(`<img src="${author.avatar}" alt="${author.nome}" class="rounded-circle mr-3" style="width:50px; height:50px;"><div><strong class="d-block">${author.nome}</strong><small class="text-muted">${author.bio || ''}</small></div>`);
                modal.find('#modal-meta').html(`<span class="category">${post.category}</span> &bull; <span>${calculateReadingTime(post.body)}</span> &bull; <span class="text-muted">${formatDate(post.date)}</span>`);
                modal.find('#modal-body').html(marked.parse(post.body || ''));
            }
        });

        $('#postModal').on('hidden.bs.modal', () => {
            // Restaura meta tags padrão
            document.title = 'Blog PortugalApoia | Notícias, Guias e Histórias da Comunidade';
            document.getElementById('meta-description').setAttribute('content', 'Explore o nosso blog...');
            document.getElementById('meta-keywords').setAttribute('content', 'blog, portugal, comunidade...');
            document.getElementById('meta-author').setAttribute('content', 'PortugalApoia');
        });
    };

    // --- FUNÇÃO DE INICIALIZAÇÃO ---
    const init = async () => {
        const [postsData, authorsData] = await Promise.all([
            fetchData('/_dados/blog.json'),
            fetchData('/_dados/autores.json')
        ]);

        if (!postsData || !postsData.posts) return; // Interrompe se os posts não carregarem

        allPosts = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (authorsData) {
            authorsMap = new Map(authorsData.map(author => [author.id, author]));
        }
        
        currentFilteredPosts = [...allPosts];
        setupEventListeners();
        renderPosts(true);
    };

    // --- INICIA A APLICAÇÃO ---
    init();
});