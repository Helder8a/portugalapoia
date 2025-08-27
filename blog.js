// ==================================================================
// === CÓDIGO FINAL Y CORREGIDO para blog.js (Reparado y Mejorado) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Variables globales
    let allPostsData = [];
    let allPostElements = [];
    const postsPerPage = 5;
    let currentPage = 1;
    const originalTitle = document.title; 
    const metaDescription = document.getElementById('meta-description');
    const originalDescription = metaDescription ? metaDescription.content : '';

    // --- FUNCIÓN PRINCIPAL PARA INICIAR EL BLOG ---
    async function iniciarBlog() {
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const featuredSection = document.getElementById('featured-post-section');
        if (!postsSection || !gallerySection || !featuredSection) return;

        try {
            const [postsData, galeria] = await Promise.all([
                fetch('/_dados/blog.json').then(res => res.json()),
                fetch('/_dados/galeria.json').then(res => res.json())
            ]);
            
            allPostsData = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Renderizar todos los elementos pero mantenerlos ocultos
            postsSection.innerHTML = allPostsData.map(renderBlogPost).join('');
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            allPostElements = document.querySelectorAll('.blog-post-item');
            
            setupBlogFunctionality();
            if (window.lightbox) window.lightbox.init();

            checkUrlForPost();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsSection.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações.</p></div>`;
        }
    }

    // --- FUNCIONES PARA GENERAR HTML ---
    function renderFeaturedPost(post) {
        if (!post) return ''; // Prevenir error si no hay posts
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return `
        <div class="container">
            <div class="featured-post">
                <div class="featured-post-image">
                    <a href="#${slug}" class="featured-post-link">
                        <img src="${post.image}" alt="${post.title}">
                    </a>
                </div>
                <div class="featured-post-content">
                    <span class="badge">Artigo em Destaque</span>
                    <h2>${post.title}</h2>
                    <p>${post.summary}</p>
                    <a href="#${slug}" class="btn btn-primary featured-post-link">Ler Artigo Completo</a>
                </div>
            </div>
        </div>
        `;
    }

    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        const processedBody = marked.parse(post.body || '', { gfm: true });
        const keywords = `${post.title} ${post.summary} ${post.body}`.toLowerCase();
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        return `
        <div class="col-lg-8 offset-lg-2 col-md-12 blog-post-item" data-category="${post.category}" data-keywords="${keywords}" data-slug="${slug}" style="display: none;">
            <article class="blog-post-card" id="${slug}">
                <div class="card-body">
                    <header class="post-header">
                        <h1 class="card-title">${post.title}</h1>
                        <div class="post-meta">
                            <span>${formattedDate}</span>
                            <span class="separator">|</span>
                            <span class="reading-time"></span>
                        </div>
                    </header>
                    <figure class="post-image-container">
                        <img class="lazy" data-src="${post.image}" alt="${post.title}">
                        <figcaption>${imageCaption}</figcaption>
                    </figure>
                    <div class="summary-content card-text">${post.summary}</div>
                    <div class="full-content" style="display: none;">
                        ${processedBody}
                        ${createSocialShareLinks(post.title, slug)}
                        ${renderRelatedPosts(post)}
                    </div>
                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                    <a href="#" class="btn btn-secondary back-to-blog" style="display: none;">Ver Todos os Artigos</a>
                </div>
            </article>
        </div>`;
    }

    function createSocialShareLinks(postTitle, slug) { /* ... (sin cambios) ... */ }
    function renderRelatedPosts(currentPost) { /* ... (sin cambios) ... */ }
    function renderGalleryItem(item) { /* ... (sin cambios) ... */ }

    // --- Lógica de Paginación y Filtros ---
    function displayPage(page, posts) {
        currentPage = page;
        allPostElements.forEach(post => post.style.display = 'none');
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const pagePosts = posts.slice(startIndex, endIndex);
        pagePosts.forEach(post => post.style.display = 'block');
        renderPaginationControls(posts.length, page);
        if (!window.location.hash) {
            const recentPostsSection = document.getElementById('recent-posts');
            if (recentPostsSection) {
                window.scrollTo({ top: recentPostsSection.offsetTop - 100, behavior: 'smooth' });
            }
        }
    }

    function renderPaginationControls(totalPosts, currentPage) { /* ... (sin cambios) ... */ }
    function getFilteredPosts() {
        const searchTerm = document.getElementById('blog-search-input').value.toLowerCase();
        const activeCategory = document.querySelector('.blog-nav .nav-link.active').getAttribute('data-target');
        
        return Array.from(allPostElements).filter(post => {
            const categoryMatch = (activeCategory === 'all' || post.dataset.category === activeCategory);
            const searchMatch = (post.dataset.keywords.includes(searchTerm));
            return categoryMatch && searchMatch;
        });
    }

    function filterAndShowPosts() {
        history.pushState("", document.title, window.location.pathname);
        document.title = originalTitle;
        if (metaDescription) metaDescription.content = originalDescription;

        const filteredPosts = getFilteredPosts();
        const noResultsMessage = document.getElementById('no-results-message');
        noResultsMessage.style.display = filteredPosts.length === 0 ? 'block' : 'none';
        
        // CORREGIDO: El artículo destacado se oculta si no es el post más reciente de la categoría seleccionada
        const featuredPostData = allPostsData[0];
        const featuredSection = document.getElementById('featured-post-section');
        const activeCategory = document.querySelector('.blog-nav .nav-link.active').getAttribute('data-target');

        if (activeCategory === 'all' || activeCategory === featuredPostData.category) {
            featuredSection.style.display = 'block';
        } else {
            featuredSection.style.display = 'none';
        }
        
        displayPage(1, filteredPosts);
    }

    // --- FUNCIONES DE MEJORA (SEO y UX) ---
    function updateMetadata(postData) { /* ... (sin cambios) ... */ }

    function showSinglePost(slug) {
        const postElement = document.getElementById(slug);
        const postData = allPostsData.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug);
        if (postElement && postData) {
            // Ocultar la lista y elementos de navegación
            document.getElementById('featured-post-section').style.display = 'none';
            document.getElementById('pagination-container').style.display = 'none';
            document.querySelector('.search-section').style.display = 'none';
            document.querySelector('.blog-nav').style.display = 'none';
            document.getElementById('recent-posts').querySelector('.section-title').style.display = 'none';
            allPostElements.forEach(p => p.style.display = 'none');

            // Mostrar y expandir solo el post seleccionado
            postElement.style.display = 'block';
            const cardBody = postElement.querySelector('.card-body');
            cardBody.querySelector('.summary-content').style.display = 'none';
            cardBody.querySelector('.full-content').style.display = 'block';
            cardBody.querySelector('.read-more-btn').style.display = 'none';
            cardBody.querySelector('.back-to-blog').style.display = 'block'; // Mostrar botón de volver

            updateMetadata(postData);
            history.pushState(null, '', `#${slug}`);
            
            setTimeout(() => postElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }
    
    function showPostList() {
        // Restaurar la vista de lista
        history.pushState("", originalTitle, window.location.pathname);
        document.title = originalTitle;
        if (metaDescription) metaDescription.content = originalDescription;
        
        document.getElementById('featured-post-section').style.display = 'block';
        document.getElementById('pagination-container').style.display = 'flex';
        document.querySelector('.search-section').style.display = 'block';
        document.querySelector('.blog-nav').style.display = 'flex';
        document.getElementById('recent-posts').querySelector('.section-title').style.display = 'block';
        
        // Restaurar el contenido de los posts a su estado resumido
        allPostElements.forEach(post => {
            const cardBody = post.querySelector('.card-body');
            cardBody.querySelector('.summary-content').style.display = 'block';
            cardBody.querySelector('.full-content').style.display = 'none';
            cardBody.querySelector('.read-more-btn').style.display = 'block';
            cardBody.querySelector('.back-to-blog').style.display = 'none';
        });

        filterAndShowPosts();
    }

    function checkUrlForPost() {
        const slug = window.location.hash.substring(1);
        if (slug) {
            showSinglePost(slug);
        } else {
            showPostList();
        }
    }

    // --- Configuración de Eventos ---
    function setupBlogFunctionality() {
        document.querySelectorAll('img.lazy').forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
        allPostElements.forEach(calculateReadingTime);

        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.read-more-btn, .related-post-link, .featured-post-link, .back-to-blog');
            if (link) {
                e.preventDefault();
                if (link.classList.contains('back-to-blog')) {
                    window.location.hash = '';
                } else {
                    let slug;
                    if(link.classList.contains('read-more-btn')){
                        slug = link.closest('.blog-post-item').dataset.slug;
                    } else {
                        slug = new URL(link.href).hash.substring(1);
                    }
                    window.location.hash = slug;
                }
            }
        });
        
        window.addEventListener('hashchange', checkUrlForPost, false);
        
        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const gallerySection = document.getElementById('gallery-section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                const targetCategory = e.target.getAttribute('data-target');
                
                document.getElementById('blog-search-input').value = '';

                if (targetCategory === 'galeria') {
                    document.getElementById('featured-post-section').style.display = 'none';
                    document.getElementById('recent-posts').style.display = 'none';
                    document.querySelector('.search-section').style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    document.getElementById('recent-posts').style.display = 'block';
                    gallerySection.style.display = 'none';
                    showPostList();
                }
            });
        });
        
        const searchInput = document.getElementById('blog-search-input');
        const clearButton = document.getElementById('blog-search-clear');
        searchInput.addEventListener('keyup', filterAndShowPosts);
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            filterAndShowPosts();
        });
    }

    iniciarBlog();
});