// ==================================================================
// === CÓDIGO FINAL Y CORREGIDO para blog.js (Robusto) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    // --- FUNCIÓN PRINCIPAL PARA INICIAR EL BLOG ---
    async function iniciarBlog() {
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');

        if (!postsSection || !gallerySection) {
            console.error("Error: No se encontraron los contenedores #posts-section o #gallery-section.");
            return;
        }

        try {
            // Cargar posts y galería en paralelo para mayor eficiencia
            const [posts, galeria] = await Promise.all([
                fetch('/_dados/blog.json').then(res => res.json()),
                fetch('/_dados/galeria.json').then(res => res.json())
            ]);

            // Renderizar el contenido en el HTML
            postsSection.innerHTML = posts.posts.map(renderBlogPost).join('');
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            // Configurar toda la interactividad (botones, filtros, etc.)
            setupBlogFunctionality();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsSection.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.</p></div>`;
        }
    }

    // --- FUNCIONES AUXILIARES ---

    // Calcula el tiempo de lectura
    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');
        if (content && timePlaceholder) {
            const text = content.textContent || content.innerText;
            const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const wordsPerMinute = 225;
            const readingTime = Math.ceil(wordCount / wordsPerMinute) || 1; // Muestra al menos 1 min
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    // Genera el HTML para cada post del blog
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        // Usa la librería 'marked' para convertir el texto a HTML
        const processedBody = marked.parse(post.body || '', { gfm: true });

        // Clase para una sola columna centrada: col-lg-8 offset-lg-2
        return `
        <div class="col-lg-8 offset-lg-2 col-md-12 blog-post-item" data-category="${post.category}">
            <div class="blog-post-card">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <div class="post-meta">
                        <span>${formattedDate}</span>
                        <span class="separator">|</span>
                        <span class="reading-time"></span>
                    </div>
                    <figure class="post-image-container">
                        <img class="lazy" data-src="${post.image}" alt="${post.title}">
                        <figcaption>${imageCaption}</figcaption>
                    </figure>
                    <p class="card-text summary-content">${post.summary}</p>
                    <div class="full-content" style="display: none;">${processedBody}</div>
                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                </div>
            </div>
        </div>`;
    }

    // Genera el HTML para cada item de la galería
    function renderGalleryItem(item) {
        return `<div class="col-lg-6 col-md-12 mb-4"><div class="gallery-item"><a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}"><img class="lazy" data-src="${item.image}" alt="${item.title}"></a></div></div>`;
    }

    // Configura los eventos (clics en botones, filtros de categoría)
    function setupBlogFunctionality() {
        const allPosts = document.querySelectorAll('.blog-post-item');
        
        // Calcular tiempo de lectura y lazy loading para cada post
        allPosts.forEach(post => {
            calculateReadingTime(post);
            const img = post.querySelector('img.lazy');
            if(img && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });

        // Eventos para los botones "Leer más"
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cardBody = e.target.closest('.card-body');
                cardBody.querySelector('.summary-content').style.display = 'none';
                cardBody.querySelector('.full-content').style.display = 'block';
                e.target.style.display = 'none';
            });
        });

        // Eventos para los filtros de categoría
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
                    allPosts.forEach(post => {
                        post.style.display = (targetCategory === 'all' || post.dataset.category === targetCategory) ? 'block' : 'none';
                    });
                }
            });
        });
    }

    // --- INICIAR TODO ---
    iniciarBlog();
});