// ==================================================================
// === CÓDIGO FINAL Y MEJORADO para blog.js (con Paginación + SEO) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    let allPostsData = [];
    let allPostElements = [];
    const postsPerPage = 5;
    let currentPage = 1;
    const originalTitle = document.title;
    const metaDescription = document.getElementById('meta-description');
    const originalDescription = metaDescription ? metaDescription.content : '';

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

            // Renderizar Artículo Destacado (el más reciente)
            if (allPostsData.length > 0) {
                featuredSection.innerHTML = renderFeaturedPost(allPostsData[0]);
            }

            // Renderizar el resto de los posts
            const regularPosts = allPostsData.slice(1); // Todos menos el primero
            postsSection.innerHTML = regularPosts.map(renderBlogPost).join('');
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
                    <span class="badge badge-primary">Artigo em Destaque</span>
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
                </div>
            </article>
        </div>`;
    }

    function createSocialShareLinks(postTitle, slug) {
        const postUrl = `${window.location.origin}${window.location.pathname}#${slug}`;
        const encodedUrl = encodeURIComponent(postUrl);
        const encodedTitle = encodeURIComponent(postTitle);
        return `
            <div class="social-share">
                <strong>Compartilhar:</strong>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
        `;
    }

    function renderRelatedPosts(currentPost) {
        const related = allPostsData
            .filter(post => post.category === currentPost.category && post.title !== currentPost.title)
            .slice(0, 3);
        if (related.length === 0) return '';
        
        let relatedHTML = related.map(post => {
            const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            return `
            <div class="related-post-item">
                <a href="#${slug}" class="related-post-link">
                    <img src="${post.image}" alt="${post.title}" class="related-post-img">
                    <h4 class="related-post-title">${post.title}</h4>
                </a>
            </div>
        `}).join('');

        return `
            <div class="related-posts">
                <h3>Artigos Relacionados</h3>
                <div class="related-posts-grid">${relatedHTML}</div>
            </div>
        `;
    }

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
            const searchSection = document.querySelector('.search-section');
            if (searchSection) {
                window.scrollTo({ top: searchSection.offsetTop - 100, behavior: 'smooth' });
            }
        }
    }

    function renderPaginationControls(totalPosts, currentPage) { /* ... (sin cambios) ... */ }
    function getFilteredPosts() { /* ... (sin cambios) ... */ }

    function filterAndShowPosts() {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        document.title = originalTitle;
        if (metaDescription) metaDescription.content = originalDescription;

        const filteredPosts = getFilteredPosts();
        const noResultsMessage = document.getElementById('no-results-message');
        noResultsMessage.style.display = filteredPosts.length === 0 ? 'block' : 'none';
        displayPage(1, filteredPosts);
    }

    // --- FUNCIONES DE MEJORA (SEO y UX) ---
    function updateMetadata(postElement) {
        const postTitle = postElement.querySelector('.card-title').textContent;
        const postSummary = postElement.querySelector('.summary-content').textContent;
        document.title = `${postTitle} | PortugalApoia Blog`;
        if (metaDescription) metaDescription.content = postSummary;
    }

    function expandAndFocusPost(slug) {
        const postElement = document.getElementById(slug);
        if (postElement) {
            allPostElements.forEach(p => p.style.display = 'none'); // Ocultar todos
            document.getElementById('featured-post-section').style.display = 'none'; // Ocultar destacado
            postElement.style.display = 'block'; // Mostrar solo el actual
            
            const cardBody = postElement.querySelector('.card-body');
            cardBody.querySelector('.summary-content').style.display = 'none';
            cardBody.querySelector('.full-content').style.display = 'block';
            cardBody.querySelector('.read-more-btn').style.display = 'none';

            updateMetadata(postElement);
            history.pushState(null, '', `#${slug}`);
            
            setTimeout(() => {
                postElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            document.getElementById('pagination-container').style.display = 'none';
        }
    }

    function checkUrlForPost() {
        const slug = window.location.hash.substring(1);
        if (slug) {
            const postData = allPostsData.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug);
            if (postData) {
                if (document.getElementById(slug)) { // Si es un post regular
                     expandAndFocusPost(slug);
                } else { // Si es el post destacado
                    const featuredPostContainer = document.getElementById('featured-post-section');
                    featuredPostContainer.innerHTML = renderBlogPost(postData); // Renderizarlo como un post normal
                    allPostElements = document.querySelectorAll('.blog-post-item'); // Re-seleccionar
                    expandAndFocusPost(slug);
                }
            } else {
                 filterAndShowPosts();
            }
        } else {
            document.getElementById('featured-post-section').style.display = 'block';
            filterAndShowPosts();
        }
    }

    // --- Configuración de Eventos ---
    function setupBlogFunctionality() {
        document.querySelectorAll('img.lazy').forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
        allPostElements.forEach(calculateReadingTime);

        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.read-more-btn, .related-post-link, .featured-post-link');
            if (link) {
                e.preventDefault();
                let slug;
                if(link.classList.contains('read-more-btn')){
                    slug = link.closest('.blog-post-item').dataset.slug;
                } else {
                    slug = new URL(link.href).hash.substring(1);
                }
                window.location.hash = slug;
            }
        });
        
        window.addEventListener('hashchange', checkUrlForPost, false);
        
        // El resto de los listeners (filtros, búsqueda) se mantienen igual...
        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const paginationContainer = document.getElementById('pagination-container');
        
        navLinks.forEach(link => { /* ... */ });
        const searchInput = document.getElementById('blog-search-input');
        const clearButton = document.getElementById('blog-search-clear');
        searchInput.addEventListener('keyup', filterAndShowPosts);
        clearButton.addEventListener('click', () => { /* ... */ });
    }

    iniciarBlog();
});