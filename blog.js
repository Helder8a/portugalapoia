// ==================================================================
// ===     CÓDIGO FINAL, CORREGIDO Y FUNCIONAL para blog.js       ===
// ==================================================================
document.addEventListener("DOMContentLoaded", () => {

    const elements = {
        views: {
            list: document.getElementById('blog-list-view'),
            single: document.getElementById('blog-single-view'),
            gallery: document.getElementById('gallery-view'),
        },
        containers: {
            postsGrid: document.getElementById('blog-posts-grid'),
            galleryGrid: document.getElementById('gallery-view'),
        },
        controls: {
            navLinks: document.querySelectorAll('.blog-nav .nav-link'),
            searchInput: document.getElementById('blog-search-input'),
            searchClearBtn: document.getElementById('blog-search-clear'),
            searchBarWrapper: document.getElementById('search-bar-wrapper'),
        },
        messages: {
            noResults: document.getElementById('no-results-message'),
        }
    };

    let allPosts = [];
    let allGalleryItems = [];
    let state = { filter: 'all', searchTerm: '' };

    async function init() {
        try {
            const [postsRes, galleryRes] = await Promise.all([
                fetch('/_dados/blog.json'),
                fetch('/_dados/galeria.json')
            ]);
            if (!postsRes.ok || !galleryRes.ok) throw new Error('Falha ao carregar dados.');
            
            const postsData = await postsRes.json();
            const galleryData = await galleryRes.json();
            
            allPosts = postsData.posts.map(post => ({ ...post, id: generateId(post.title) }));
            allGalleryItems = galleryData.imagens;

            addEventListeners();
            renderContent();
            if (window.lightbox) { lightbox.init(); }
        } catch (error) {
            console.error("Erro ao inicializar o blog:", error);
            elements.containers.postsGrid.innerHTML = `<p class="text-danger text-center col-12">Ocorreu um erro ao carregar o conteúdo.</p>`;
        }
    }

    function addEventListeners() {
        elements.controls.navLinks.forEach(link => link.addEventListener('click', handleFilterClick));
        elements.controls.searchInput.addEventListener('input', () => {
            state.searchTerm = elements.controls.searchInput.value.toLowerCase();
            renderContent();
        });
        elements.controls.searchClearBtn.addEventListener('click', () => {
            elements.controls.searchInput.value = '';
            state.searchTerm = '';
            renderContent();
        });
    }

    function handleFilterClick(e) {
        e.preventDefault();
        elements.controls.navLinks.forEach(link => link.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.filter = e.currentTarget.dataset.target;
        renderContent();
    }
    
    function renderContent() {
        hideAllViews();
        
        if (state.filter === 'galeria') {
            elements.controls.searchBarWrapper.style.display = 'none';
            elements.views.gallery.style.display = 'block';
            renderGallery();
        } else {
            elements.controls.searchBarWrapper.style.display = 'flex';
            elements.views.list.style.display = 'block';
            renderPosts();
        }
    }

    function renderPosts() {
        const filteredPosts = allPosts.filter(post => 
            (state.filter === 'all' || post.category === state.filter) &&
            (post.title.toLowerCase().includes(state.searchTerm) || post.summary.toLowerCase().includes(state.searchTerm))
        );

        elements.containers.postsGrid.innerHTML = '';
        if (filteredPosts.length > 0) {
            filteredPosts.forEach(post => {
                const postCard = createPostCard(post);
                elements.containers.postsGrid.appendChild(postCard);
            });
            elements.messages.noResults.style.display = 'none';
        } else {
            elements.messages.noResults.style.display = 'block';
        }
    }

    function renderGallery() {
        elements.containers.galleryGrid.innerHTML = allGalleryItems.map(item => `
            <div class="col-lg-3 col-md-4 col-sm-6 gallery-item-wrapper">
                <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}" class="gallery-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="caption">${item.title}</div>
                </a>
            </div>
        `).join('');
    }

    function createPostCard(post) {
        const wrapper = document.createElement('div');
        wrapper.className = 'col-lg-4 col-md-6 blog-post-card-wrapper';
        wrapper.innerHTML = `
            <div class="blog-post-card" data-id="${post.id}">
                <div class="post-image-container"><img src="${post.image}" alt="${post.title}"></div>
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-text">${post.summary}</p>
                    <a href="#" class="read-more-link mt-auto">Ler Mais <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`;
        wrapper.querySelector('.blog-post-card').addEventListener('click', (e) => {
            e.preventDefault();
            showSinglePost(post.id);
        });
        return wrapper;
    }

    function showSinglePost(postId) {
        const post = allPosts.find(p => p.id === postId);
        if (!post) return;

        elements.views.single.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <button class="btn btn-outline-primary back-to-blog-btn"><i class="fas fa-arrow-left"></i> Voltar à lista</button>
                    <header class="text-center my-4">
                        <h1 class="single-post-title">${post.title}</h1>
                    </header>
                    <img src="${post.image}" alt="${post.title}" class="single-post-image">
                    <div class="single-post-content">${marked.parse(post.body || '')}</div>
                </div>
            </div>`;
        
        elements.views.single.querySelector('.back-to-blog-btn').addEventListener('click', showListView);
        hideAllViews();
        elements.views.single.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    function showListView() {
        hideAllViews();
        elements.views.list.style.display = 'block';
    }
    
    function hideAllViews() {
        Object.values(elements.views).forEach(view => view.style.display = 'none');
    }

    const generateId = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    init();
});