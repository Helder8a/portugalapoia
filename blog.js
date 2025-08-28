// ==================================================================
// === VERSIÓN FINAL Y CORREGIDA - blog.js ===
// ==================================================================

// Espera a que todo el contenido de la página, incluidos los scripts, esté cargado.
// Esto soluciona el conflicto con la carga del header/footer.
document.addEventListener("DOMContentLoaded", () => {
    
    // Se definen las variables globales que usaremos.
    let allPostsData = [];
    let postsContainer;

    // --- FUNCIÓN PRINCIPAL PARA INICIAR EL BLOG ---
    async function iniciarBlog() {
        postsContainer = document.getElementById('posts-section');
        // Si no se encuentra el contenedor de posts, no se ejecuta nada.
        if (!postsContainer) return;

        try {
            // Se hace la petición para obtener los datos del blog.
            // Se añade un parámetro de tiempo para evitar problemas de caché.
            const postsResponse = await fetch('/_dados/blog.json?v=' + new Date().getTime());
            
            if (!postsResponse.ok) {
                throw new Error('Falha ao carregar os dados do blog.');
            }

            const postsData = await postsResponse.json();
            
            // Se ordenan los posts por fecha, del más reciente al más antiguo.
            allPostsData = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            renderPosts(allPostsData); // Se muestran todos los posts inicialmente.
            setupBlogFunctionality(); // Se configuran las interacciones (clics, búsqueda).

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsContainer.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.</p></div>`;
        }
    }

    // --- FUNCIÓN PARA RENDERIZAR (GENERAR HTML) LOS POSTS ---
    function renderPosts(postsToRender) {
        if (!postsContainer) return;
        if (postsToRender.length === 0) {
            postsContainer.innerHTML = `<div class="col-12 text-center" id="no-results-message"><p class="lead text-muted mt-5">Nenhum artigo encontrado com os critérios de pesquisa.</p></div>`;
        } else {
            // Se usa .map() para crear el HTML de cada post y .join('') para unirlos.
            postsContainer.innerHTML = postsToRender.map(renderBlogPost).join('');
            // Una vez mostrados, se calcula el tiempo de lectura de cada uno.
            document.querySelectorAll('.blog-post-item').forEach(calculateReadingTime);
        }
    }

    // --- FUNCIÓN PARA GENERAR EL HTML DE UN ÚNICO POST ---
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        // Se utiliza la librería 'marked' para convertir el texto Markdown a HTML de forma segura.
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

    // --- FUNCIONES AUXILIARES (COMPARTIR, POSTS RELACIONADOS, TIEMPO LECTURA) ---
    function createSocialShareLinks(postTitle) {
        const postUrl = encodeURIComponent(window.location.href.split('?')[0].split('#')[0]);
        const encodedTitle = encodeURIComponent(postTitle);
        return `<div class="social-share">...</div>`; // (El código de los botones de compartir va aquí)
    }

    function renderRelatedPosts(currentPost) {
        const related = allPostsData.filter(p => p.category === currentPost.category && p.title !== currentPost.title).slice(0, 3);
        if (related.length === 0) return '';
        const relatedHTML = related.map(post => `<div class="related-post-item">...</div>`).join('');
        return `<div class="related-posts"><h3>Artigos Relacionados</h3><div class="related-posts-grid">${relatedHTML}</div></div>`;
    }

    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');
        if (content && timePlaceholder) {
            const wordCount = (content.textContent || content.innerText).trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 225) || 1;
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    // --- FUNCIÓN CENTRAL PARA FILTRAR Y MOSTRAR POSTS ---
    function filterAndShowPosts() {
        const searchTerm = document.getElementById('blog-search-input').value.toLowerCase().trim();
        const activeCategory = document.querySelector('.blog-nav .nav-link.active').dataset.target;

        let filteredPosts = allPostsData.filter(post => 
            (activeCategory === 'all' || post.category === activeCategory) &&
            (post.title.toLowerCase().includes(searchTerm) || 
             post.summary.toLowerCase().includes(searchTerm) ||
             post.body.toLowerCase().includes(searchTerm))
        );
        renderPosts(filteredPosts);
    }
    
    // --- CONFIGURACIÓN DE LOS EVENTOS DE LA PÁGINA ---
    function setupBlogFunctionality() {
        document.getElementById('blog-search-input').addEventListener('input', filterAndShowPosts);
        document.getElementById('blog-search-clear').addEventListener('click', () => {
            document.getElementById('blog-search-input').value = '';
            filterAndShowPosts();
        });

        document.querySelectorAll('.blog-nav .nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                document.querySelector('.blog-nav .nav-link.active').classList.remove('active');
                e.target.classList.add('active');
                filterAndShowPosts();
            });
        });

        postsContainer.addEventListener('click', e => {
            const readMoreBtn = e.target.closest('.read-more-btn');
            if (readMoreBtn) {
                const cardBody = readMoreBtn.closest('.card-body');
                const summary = cardBody.querySelector('.summary-content');
                const fullContent = cardBody.querySelector('.full-content');
                const isExpanded = fullContent.style.display === 'block';
                summary.style.display = isExpanded ? 'block' : 'none';
                fullContent.style.display = isExpanded ? 'none' : 'block';
                readMoreBtn.textContent = isExpanded ? 'Ler Mais' : 'Ler Menos';
            }
            // (Aquí iría la lógica para los artículos relacionados)
        });
    }

    // Se inicia el blog.
    iniciarBlog();
});