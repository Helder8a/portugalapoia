// ==================================================================
// ===      CÓDIGO PROFESIONAL Y REPARADO para blog.js            ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {

    // --- Selectores de elementos del DOM ---
    const elements = {
        listView: document.getElementById('blog-list-view'),
        singleView: document.getElementById('blog-single-view'),
        postsGrid: document.getElementById('blog-posts-grid'),
        noResultsMsg: document.getElementById('no-results-message'),
        navLinks: document.querySelectorAll('.blog-nav .nav-link'),
        searchInput: document.getElementById('blog-search-input'),
        searchClearBtn: document.getElementById('blog-search-clear'),
    };

    // --- Estado de la aplicación ---
    let allPosts = [];
    let state = {
        activeFilter: 'all',
        searchTerm: '',
    };

    // --- FUNCIÓN PRINCIPAL DE INICIO ---
    async function init() {
        try {
            const response = await fetch('/_dados/blog.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            allPosts = data.posts.map(post => ({
                ...post,
                id: generateId(post.title)
            }));
            addEventListeners();
            renderPosts();
        } catch (error) {
            console.error("Error al cargar las publicaciones del blog:", error);
            elements.postsGrid.innerHTML = `<p class="text-danger text-center col-12">Ocorreu um erro ao carregar o conteúdo. Por favor, tente novamente mais tarde.</p>`;
        }
    }

    // --- MANEJADORES DE EVENTOS ---
    function addEventListeners() {
        elements.navLinks.forEach(link => link.addEventListener('click', handleFilterClick));
        elements.searchInput.addEventListener('input', handleSearch);
        elements.searchClearBtn.addEventListener('click', clearSearch);
    }

    function handleFilterClick(e) {
        e.preventDefault();
        elements.navLinks.forEach(link => link.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.activeFilter = e.currentTarget.dataset.target;
        renderPosts();
    }
    
    function handleSearch() {
        state.searchTerm = elements.searchInput.value.toLowerCase();
        renderPosts();
    }

    function clearSearch() {
        elements.searchInput.value = '';
        state.searchTerm = '';
        renderPosts();
    }
    
    // --- LÓGICA DE RENDERIZACIÓN ---
    function renderPosts() {
        const filteredPosts = allPosts.filter(post => {
            const matchesCategory = state.activeFilter === 'all' || post.category === state.activeFilter;
            const matchesSearch = post.title.toLowerCase().includes(state.searchTerm) || post.summary.toLowerCase().includes(state.searchTerm);
            return matchesCategory && matchesSearch;
        });

        elements.postsGrid.innerHTML = ''; // Limpiar vista
        if (filteredPosts.length > 0) {
            filteredPosts.forEach(post => {
                const postCard = createPostCard(post);
                elements.postsGrid.appendChild(postCard);
            });
            elements.noResultsMsg.style.display = 'none';
        } else {
            elements.noResultsMsg.style.display = 'block';
        }
    }
    
    function createPostCard(post) {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'col-lg-4 col-md-6 mb-4 blog-post-card-wrapper';
        cardWrapper.innerHTML = `
            <div class="blog-post-card" data-id="${post.id}">
                <div class="post-image-container">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <div class="post-meta">${formatDate(post.date)}</div>
                    <p class="card-text">${post.summary}</p>
                    <span class="read-more-link mt-auto">Ler Mais <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>`;
        cardWrapper.querySelector('.blog-post-card').addEventListener('click', () => showSinglePost(post.id));
        return cardWrapper;
    }

    function showSinglePost(postId) {
        const post = allPosts.find(p => p.id === postId);
        if (!post) return;

        elements.singleView.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <button class="btn btn-outline-primary back-to-blog-btn"><i class="fas fa-arrow-left"></i> Voltar à lista</button>
                    <header class="single-post-header">
                        <h1 class="single-post-title">${post.title}</h1>
                        <div class="single-post-meta">Publicado em ${formatDate(post.date)}</div>
                    </header>
                    <img src="${post.image}" alt="${post.title}" class="single-post-image">
                    <div class="single-post-content">${marked.parse(post.body || '')}</div>
                </div>
            </div>`;
            
        elements.singleView.querySelector('.back-to-blog-btn').addEventListener('click', showListView);

        elements.listView.style.display = 'none';
        elements.singleView.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    function showListView() {
        elements.singleView.style.display = 'none';
        elements.listView.style.display = 'block';
    }

    // --- FUNCIONES DE UTILIDAD ---
    const generateId = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const formatDate = dateStr => new Date(dateStr).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });

    // --- INICIAR EL BLOG ---
    init();
});