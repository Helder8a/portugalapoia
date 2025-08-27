// ==================================================================
// === CÓDIGO FINAL Y MEJORADO para blog.js (con navegación dinámica) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Almacenamiento global para los datos y estado de la aplicación
    let allPostsData = [];
    let allGalleryData = [];
    let activeFilter = 'all';
    let currentSearchTerm = '';

    const blogView = document.getElementById('blog-view');
    const galleryView = document.getElementById('gallery-view');
    const noResultsMessage = document.getElementById('no-results-message');

    // --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---
    async function initializeBlog() {
        try {
            const [postsResponse, galleryResponse] = await Promise.all([
                fetch('/_dados/blog.json'),
                fetch('/_dados/galeria.json')
            ]);

            if (!postsResponse.ok || !galleryResponse.ok) {
                throw new Error('Falha ao carregar os ficheiros de dados.');
            }

            const postsData = await postsResponse.json();
            const galleryData = await galleryResponse.json();
            
            allPostsData = postsData.posts.map(post => ({...post, id: generatePostId(post.title)}));
            allGalleryData = galleryData.imagens;

            renderBlogList();
            renderGallery();
            setupEventListeners();
            
            if (window.lightbox) window.lightbox.init();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            blogView.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações.</p></div>`;
        }
    }

    // --- FUNCIONES DE RENDERIZACIÓN DE HTML ---
    
    // Renderiza la lista de tarjetas de posts
    function renderBlogList() {
        const filteredPosts = allPostsData.filter(post => 
            (activeFilter === 'all' || post.category === activeFilter) &&
            (post.title.toLowerCase().includes(currentSearchTerm) || post.summary.toLowerCase().includes(currentSearchTerm))
        );

        if (filteredPosts.length > 0) {
            blogView.innerHTML = filteredPosts.map(renderPostCard).join('');
            noResultsMessage.style.display = 'none';
        } else {
            blogView.innerHTML = '';
            noResultsMessage.style.display = 'block';
        }
        addCardEventListeners();
    }

    // Renderiza la vista de un único post
    function renderSinglePost(postId) {
        const post = allPostsData.find(p => p.id === postId);
        if (!post) return;

        blogView.innerHTML = `
            <div class="col-12 single-post-view">
                <a href="#" class="back-to-blog" role="button"><i class="fas fa-arrow-left"></i> Voltar ao Blog</a>
                <article class="blog-post-card">
                    <div class="card-body">
                        <header class="post-header">
                            <h1 class="card-title">${post.title}</h1>
                            <div class="post-meta">
                                <span>${formatDate(post.date)}</span>
                                <span class="separator">|</span>
                                <span class="reading-time">${calculateReadingTime(post.body)}</span>
                            </div>
                        </header>
                        <figure class="post-image-container">
                            <img src="${post.image}" alt="${post.title}">
                            <figcaption>${post.caption || `Ilustração para o artigo: ${post.title}`}</figcaption>
                        </figure>
                        <div class="full-content">${marked.parse(post.body || '', { gfm: true })}</div>
                        ${createSocialShareLinks(post.title)}
                        ${renderRelatedPosts(post)}
                    </div>
                </article>
            </div>`;
        
        document.querySelector('.back-to-blog').addEventListener('click', (e) => {
            e.preventDefault();
            renderBlogList();
        });
        addRelatedPostEventListeners();
    }

    function renderPostCard(post) {
        return `
        <article class="blog-post-card" data-id="${post.id}">
            <div class="post-image-container">
                <img src="${post.image}" alt="${post.title}" class="lazy">
            </div>
            <div class="card-body">
                <header>
                    <div class="post-meta">${formatDate(post.date)}</div>
                    <h2 class="card-title">${post.title}</h2>
                </header>
                <p class="card-text">${post.summary}</p>
                <button class="btn btn-outline-primary read-more-btn mt-auto" data-id="${post.id}" aria-label="Ler mais sobre ${post.title}">Ler Mais</button>
            </div>
        </article>`;
    }

    function renderGallery() {
        galleryView.innerHTML = allGalleryData.map(item => `
            <div class="col-md-6 col-lg-4 mb-4 gallery-item-wrapper">
                <div class="gallery-item">
                    <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="caption">${item.title}</div>
                    </a>
                </div>
            </div>`).join('');
    }

    function renderRelatedPosts(currentPost) {
        const related = allPostsData
            .filter(post => post.category === currentPost.category && post.id !== currentPost.id)
            .slice(0, 3);

        if (related.length === 0) return '';

        return `
            <div class="related-posts">
                <h3>Artigos Relacionados</h3>
                <div class="related-posts-grid">
                    ${related.map(post => `
                    <div class="related-post-item">
                        <a href="#" class="related-post-link" data-id="${post.id}">
                            <img src="${post.image}" alt="${post.title}" class="related-post-img">
                            <h4 class="related-post-title">${post.title}</h4>
                        </a>
                    </div>`).join('')}
                </div>
            </div>`;
    }

    // --- FUNCIONES DE UTILIDAD ---
    const generatePostId = title => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const formatDate = dateString => new Date(dateString).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    const calculateReadingTime = content => `<i class="fa-regular fa-clock"></i> ${Math.ceil((content || '').trim().split(/\s+/).length / 225) || 1} min de leitura`;
    
    function createSocialShareLinks(postTitle) {
        const postUrl = window.location.href;
        const encodedUrl = encodeURIComponent(postUrl);
        const encodedTitle = encodeURIComponent(postTitle);
        return `
            <div class="social-share">
                <strong>Compartilhar:</strong>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>`;
    }

    // --- GESTIÓN DE EVENTOS ---
    function setupEventListeners() {
        // Navegación de categorías
        document.querySelectorAll('.blog-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.blog-nav .nav-link.active').classList.remove('active');
                e.target.classList.add('active');
                
                activeFilter = e.target.getAttribute('data-target');
                
                if (activeFilter === 'galeria') {
                    blogView.style.display = 'none';
                    galleryView.style.display = 'flex';
                    noResultsMessage.style.display = 'none';
                } else {
                    blogView.style.display = 'grid';
                    galleryView.style.display = 'none';
                    renderBlogList();
                }
            });
        });

        // Búsqueda
        const searchInput = document.getElementById('blog-search-input');
        searchInput.addEventListener('keyup', () => {
            currentSearchTerm = searchInput.value.toLowerCase();
            renderBlogList();
        });

        document.getElementById('blog-search-clear').addEventListener('click', () => {
            searchInput.value = '';
            currentSearchTerm = '';
            renderBlogList();
        });
    }

    function addCardEventListeners() {
        document.querySelectorAll('.read-more-btn, .blog-post-card .card-title, .blog-post-card .post-image-container').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = e.currentTarget.closest('.blog-post-card').dataset.id;
                renderSinglePost(postId);
                window.scrollTo(0, 0);
            });
        });
    }

    function addRelatedPostEventListeners() {
        document.querySelectorAll('.related-post-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = e.currentTarget.dataset.id;
                renderSinglePost(postId);
                window.scrollTo(0, 0);
            });
        });
    }

    // --- INICIAR LA APLICACIÓN ---
    initializeBlog();
});