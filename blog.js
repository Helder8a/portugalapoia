// ==================================================================
// === CÓDIGO FINAL Y MEJORADO para blog.js (con todas las mejoras) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Variable global para almacenar todos los posts una vez cargados
    let allPostsData = [];
    let allPosts = [];

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
            
            allPostsData = postsData.posts;
            postsSection.innerHTML = allPostsData.map(renderBlogPost).join('');
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            // Guardar referencia a los elementos de post después de crearlos
            allPosts = document.querySelectorAll('.blog-post-item');
            
            setupBlogFunctionality();
            if (window.lightbox) window.lightbox.init();

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

        // Añadimos data-keywords para la búsqueda
        const keywords = `${post.title} ${post.summary} ${post.body}`.toLowerCase();

        return `
        <div class="col-lg-8 offset-lg-2 col-md-12 blog-post-item" data-category="${post.category}" data-keywords="${keywords}">
            <article class="blog-post-card">
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
                        ${createSocialShareLinks(post.title)}
                        ${renderRelatedPosts(post)}
                    </div>
                    
                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                </div>
            </article>
        </div>`;
    }

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
            </div>
        `;
    }

    function renderRelatedPosts(currentPost) {
        const related = allPostsData
            .filter(post => post.category === currentPost.category && post.title !== currentPost.title)
            .slice(0, 3);

        if (related.length === 0) return '';

        let relatedHTML = related.map(post => `
            <div class="related-post-item">
                <a href="javascript:void(0);" onclick="location.reload()">
                    <img src="${post.image}" alt="${post.title}" class="related-post-img">
                    <h4 class="related-post-title">${post.title}</h4>
                </a>
            </div>
        `).join('');

        return `
            <div class="related-posts">
                <h3>Artigos Relacionados</h3>
                <div class="related-posts-grid">${relatedHTML}</div>
            </div>
        `;
    }

    function renderGalleryItem(item) {
        return `
        <div class="col-md-6 mb-4 gallery-item-wrapper">
            <div class="gallery-item">
                <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="caption">${item.title}</div>
                </a>
            </div>
        </div>`;
    }

    // --- FUNCIONES DE UTILIDAD Y CONFIGURACIÓN DE EVENTOS ---

    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');
        if (content && timePlaceholder) {
            const text = content.textContent || content.innerText;
            const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
            const readingTime = Math.ceil(wordCount / 225) || 1;
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    // NUEVO: Función para filtrar y mostrar posts
    function filterAndShowPosts() {
        const searchTerm = document.getElementById('blog-search-input').value.toLowerCase();
        const activeCategory = document.querySelector('.blog-nav .nav-link.active').getAttribute('data-target');
        const noResultsMessage = document.getElementById('no-results-message');
        
        let visiblePosts = 0;

        allPosts.forEach(post => {
            const categoryMatch = (activeCategory === 'all' || post.dataset.category === activeCategory);
            const searchMatch = (post.dataset.keywords.includes(searchTerm));

            if (categoryMatch && searchMatch) {
                post.style.display = 'block';
                visiblePosts++;
            } else {
                post.style.display = 'none';
            }
        });

        noResultsMessage.style.display = visiblePosts === 0 ? 'block' : 'none';
    }

    function setupBlogFunctionality() {
        document.querySelectorAll('img.lazy').forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
        });
        
        allPosts.forEach(calculateReadingTime);

        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cardBody = e.target.closest('.card-body');
                cardBody.querySelector('.summary-content').style.display = 'none';
                cardBody.querySelector('.full-content').style.display = 'block';
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
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    postsSection.style.display = 'flex';
                    gallerySection.style.display = 'none';
                    filterAndShowPosts(); // Usar la nueva función de filtro
                }
            });
        });

        // NUEVO: Eventos para la barra de búsqueda
        const searchInput = document.getElementById('blog-search-input');
        const clearButton = document.getElementById('blog-search-clear');

        searchInput.addEventListener('keyup', filterAndShowPosts);
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            filterAndShowPosts();
        });
    }

    // --- INICIAR TODO ---
    iniciarBlog();
});