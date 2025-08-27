// ==================================================================
// === CÓDIGO FINAL Y MEJORADO para blog.js (con Paginación + SEO) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Variables globales
    let allPostsData = [];
    let allPostElements = [];
    const postsPerPage = 5;
    let currentPage = 1;
    const originalTitle = document.title; // Guardar el título original de la página

    // --- FUNCIÓN PRINCIPAL PARA INICIAR EL BLOG ---
    async function iniciarBlog() {
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        if (!postsSection || !gallerySection) return;

        try {
            const [postsData, galeria] = await Promise.all([
                fetch('/_dados/blog.json').then(res => res.json()),
                fetch('/_dados/galeria.json').then(res => res.json())
            ]);
            
            allPostsData = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            postsSection.innerHTML = allPostsData.map(renderBlogPost).join('');
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            allPostElements = document.querySelectorAll('.blog-post-item');
            
            setupBlogFunctionality();
            if (window.lightbox) window.lightbox.init();

            // Comprobar si hay un ancla en la URL al cargar
            checkUrlForPost();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsSection.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações.</p></div>`;
        }
    }

    // --- FUNCIONES PARA GENERAR HTML ---
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
        const postUrl = `${window.location.origin}${window.location.pathname}#${slug}`; // URL con ancla
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
            // CORREGIDO: El enlace ahora apunta al ancla del post relacionado
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
        // No hacer scroll al inicio si estamos mostrando un post específico
        if (!window.location.hash) {
            window.scrollTo({ top: document.getElementById('posts-section').offsetTop - 100, behavior: 'smooth' });
        }
    }

    function renderPaginationControls(totalPosts, currentPage) { /* ... (sin cambios) ... */ }
    function getFilteredPosts() { /* ... (sin cambios) ... */ }

    function filterAndShowPosts() {
        // Limpiar el ancla y restaurar el título al filtrar
        history.pushState("", document.title, window.location.pathname + window.location.search);
        document.title = originalTitle;

        const filteredPosts = getFilteredPosts();
        const noResultsMessage = document.getElementById('no-results-message');
        noResultsMessage.style.display = filteredPosts.length === 0 ? 'block' : 'none';
        displayPage(1, filteredPosts);
    }

    // --- FUNCIONES DE MEJORA (SEO y UX) ---
    function expandAndFocusPost(slug) {
        const postElement = document.getElementById(slug);
        if (postElement) {
            const cardBody = postElement.querySelector('.card-body');
            cardBody.querySelector('.summary-content').style.display = 'none';
            cardBody.querySelector('.full-content').style.display = 'block';
            cardBody.querySelector('.read-more-btn').style.display = 'none';

            // Actualizar título y URL
            const postTitle = postElement.querySelector('.card-title').textContent;
            document.title = `${postTitle} | PortugalApoia Blog`;
            history.pushState(null, '', `#${slug}`);
            
            // Hacer scroll hacia el post
            setTimeout(() => {
                postElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    function checkUrlForPost() {
        const slug = window.location.hash.substring(1);
        if (slug) {
            const postToExpand = document.querySelector(`.blog-post-item[data-slug='${slug}']`);
            if (postToExpand) {
                // Mostrar todos los posts temporalmente para encontrar el correcto
                allPostElements.forEach(p => p.style.display = 'block');
                expandAndFocusPost(slug);
                // Ocultar los demás después de expandir
                allPostElements.forEach(p => {
                    if (p.dataset.slug !== slug) {
                        p.style.display = 'none';
                    }
                });
                document.getElementById('pagination-container').style.display = 'none'; // Ocultar paginación
            } else {
                 filterAndShowPosts(); // Si el ancla no es válida, mostrar la primera página
            }
        } else {
            filterAndShowPosts(); // Mostrar la primera página si no hay ancla
        }
    }

    // --- Configuración de Eventos ---
    function setupBlogFunctionality() {
        // Lazy loading y tiempo de lectura
        document.querySelectorAll('img.lazy').forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
        allPostElements.forEach(calculateReadingTime);

        // Botones "Leer más"
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const post = e.target.closest('.blog-post-item');
                expandAndFocusPost(post.dataset.slug);
            });
        });
        
        // CORREGIDO: Eventos para los enlaces de "Artículos Relacionados"
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.related-post-link');
            if (link) {
                e.preventDefault();
                const slug = new URL(link.href).hash.substring(1);
                window.location.hash = slug; // Esto dispara el evento 'hashchange'
            }
        });

        // Evento para navegar con los botones "atrás/adelante" del navegador
        window.addEventListener('hashchange', checkUrlForPost, false);
        
        // Filtros y Búsqueda
        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const paginationContainer = document.getElementById('pagination-container');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                const targetCategory = e.target.getAttribute('data-target');
                
                document.getElementById('blog-search-input').value = ''; // Limpiar búsqueda al cambiar de categoría

                if (targetCategory === 'galeria') {
                    postsSection.style.display = 'none';
                    paginationContainer.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    gallerySection.style.display = 'none';
                    paginationContainer.style.display = 'flex';
                    postsSection.style.display = 'block'; // Usar block para el contenedor
                    filterAndShowPosts();
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