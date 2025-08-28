// ==================================================================
// === CÓDIGO FINAL Y PERFECTO para blog.js (Solo Blog) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    let allPostsData = [];
    let postsContainer;

    // --- FUNCIÓN PRINCIPAL PARA INICIAR EL BLOG ---
    async function iniciarBlog() {
        postsContainer = document.getElementById('posts-section');
        if (!postsContainer) return;

        try {
            const postsResponse = await fetch('/_dados/blog.json?v=' + new Date().getTime());
            
            if (!postsResponse.ok) {
                throw new Error('Falha ao carregar os dados do blog.');
            }

            const postsData = await postsResponse.json();
            
            // Ordena los posts por fecha, del más reciente al más antiguo
            allPostsData = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            renderPosts(allPostsData); // Renderiza todos los posts inicialmente
            setupBlogFunctionality();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsContainer.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.</p></div>`;
        }
    }

    // --- FUNCIÓN PARA RENDERIZAR (GENERAR HTML) POSTS ---
    function renderPosts(postsToRender) {
        if (!postsContainer) return;
        if (postsToRender.length === 0) {
            postsContainer.innerHTML = `<div class="col-12 text-center" id="no-results-message"><p class="lead text-muted mt-5">Nenhum artigo encontrado.</p></div>`;
        } else {
            postsContainer.innerHTML = postsToRender.map(renderBlogPost).join('');
            document.querySelectorAll('.blog-post-item').forEach(calculateReadingTime);
        }
    }

    // --- FUNCIÓN PARA GENERAR EL HTML DE UN ÚNICO POST ---
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        const processedBody = marked.parse(post.body || '', { gfm: true, breaks: true });

        return `
        <div class="col-lg-8 offset-lg-2 col-md-12 blog-post-item" data-category="${post.category}" data-title="${post.title.toLowerCase()}">
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
                        <img src="${post.image}" alt="${post.title}">
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

    // --- FUNCIONES AUXILIARES (PARTILHAR, POSTS RELACIONADOS) ---
    function createSocialShareLinks(postTitle) {
        const postUrl = encodeURIComponent(window.location.href.split('?')[0].split('#')[0]);
        const encodedTitle = encodeURIComponent(postTitle);
        return `
            <div class="social-share">
                <strong>Partilhar:</strong>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${postUrl}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no Twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="https://wa.me/?text=${encodedTitle}%20${postUrl}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>`;
    }

    function renderRelatedPosts(currentPost) {
        const related = allPostsData
            .filter(post => post.category === currentPost.category && post.title !== currentPost.title)
            .slice(0, 3);

        if (related.length === 0) return '';

        let relatedHTML = related.map(post => `
            <div class="related-post-item">
                <a href="#" class="related-post-link" data-title="${post.title.toLowerCase()}">
                    <img src="${post.image}" alt="${post.title}" class="related-post-img">
                    <h4 class="related-post-title">${post.title}</h4>
                </a>
            </div>`).join('');

        return `
            <div class="related-posts">
                <h3>Artigos Relacionados</h3>
                <div class="related-posts-grid">${relatedHTML}</div>
            </div>`;
    }

    // --- FUNCIÓN PARA CALCULAR EL TIEMPO DE LECTURA ---
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

    // --- FUNCIÓN CENTRAL PARA FILTRAR Y MOSTRAR POSTS ---
    function filterAndShowPosts() {
        const searchTerm = document.getElementById('blog-search-input').value.toLowerCase().trim();
        const activeCategory = document.querySelector('.blog-nav .nav-link.active').getAttribute('data-target');

        let filteredPosts = allPostsData;

        if (activeCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === activeCategory);
        }

        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.summary.toLowerCase().includes(searchTerm) ||
                post.body.toLowerCase().includes(searchTerm));
        }
        renderPosts(filteredPosts);
    }
    
    // --- CONFIGURACIÓN DE TODOS LOS EVENTOS DE LA PÁGINA ---
    function setupBlogFunctionality() {
        const searchInput = document.getElementById('blog-search-input');
        const clearButton = document.getElementById('blog-search-clear');
        const navLinks = document.querySelectorAll('.blog-nav .nav-link');

        // Evento para "Ler Mais" / "Ler Menos" y Artículos Relacionados
        postsContainer.addEventListener('click', (e) => {
            const readMoreBtn = e.target.closest('.read-more-btn');
            const relatedLink = e.target.closest('.related-post-link');

            if (readMoreBtn) {
                const cardBody = readMoreBtn.closest('.card-body');
                const summary = cardBody.querySelector('.summary-content');
                const fullContent = cardBody.querySelector('.full-content');
                const isExpanded = fullContent.style.display === 'block';

                summary.style.display = isExpanded ? 'block' : 'none';
                fullContent.style.display = isExpanded ? 'none' : 'block';
                readMoreBtn.textContent = isExpanded ? 'Ler Mais' : 'Ler Menos';
            }
            
            if (relatedLink) {
                e.preventDefault();
                const targetTitle = relatedLink.dataset.title;
                const targetPostElement = document.querySelector(`.blog-post-item[data-title="${targetTitle}"]`);
                if (targetPostElement) {
                    targetPostElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        // Eventos para la navegación por categorías
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                filterAndShowPosts();
            });
        });

        // Eventos para la barra de búsqueda
        searchInput.addEventListener('input', filterAndShowPosts);
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            filterAndShowPosts();
        });
    }

    iniciarBlog();
});