// ==================================================================
// === CÓDIGO FINAL Y CORREGIDO para blog.js (Galería Reparada) ===
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
            const [posts, galeria] = await Promise.all([
                fetch('/_dados/blog.json').then(res => res.json()),
                fetch('/_dados/galeria.json').then(res => res.json())
            ]);

            postsSection.innerHTML = posts.posts.map(renderBlogPost).join('');
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            setupBlogFunctionality();

            // ======> CLAVE: RE-INICIALIZAR LIGHTBOX DESPUÉS DE CARGAR LAS IMÁGENES <======
            if (window.lightbox) {
                window.lightbox.init();
            }

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsSection.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.</p></div>`;
        }
    }

    // --- FUNCIONES AUXILIARES ---

    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');
        if (content && timePlaceholder) {
            const text = content.textContent || content.innerText;
            const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const wordsPerMinute = 225;
            const readingTime = Math.ceil(wordCount / wordsPerMinute) || 1;
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        const processedBody = marked.parse(post.body || '', { gfm: true });

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

    // ======> CORRECCIÓN EN LA FUNCIÓN DE LA GALERÍA <======
    function renderGalleryItem(item) {
        // Se elimina la clase 'lazy' y se usa 'src' directamente para forzar la carga de la imagen
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

    function setupBlogFunctionality() {
        // Activar lazy loading SOLO para los posts, no para la galería
        document.querySelectorAll('.blog-post-item img.lazy').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        
        document.querySelectorAll('.blog-post-item').forEach(calculateReadingTime);

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
                    document.querySelectorAll('.blog-post-item').forEach(post => {
                        post.style.display = (targetCategory === 'all' || post.dataset.category === targetCategory) ? 'block' : 'none';
                    });
                }
            });
        });
    }

    iniciarBlog();
});