// Contenido COMPLETO y CORRECTO para blog.js

document.addEventListener("DOMContentLoaded", () => {

    // Función para renderizar las publicaciones del blog
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        return `
        <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
            <div class="blog-post-card">
                <img class="card-img-top lazy" data-src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="text-muted small">Publicado em: ${formattedDate}</p>
                    <p class="card-text summary-content">${post.summary}</p>
                    <div class="full-content" style="display: none;">
                        <p>${post.body.replace(/\\n/g, '</p><p>')}</p>
                    </div>
                    <button class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</button>
                </div>
            </div>
        </div>
        `;
    }

    // Función para renderizar los ítems de la galería
    function renderGalleryItem(item) {
        const itemDate = new Date(item.date);
        const formattedDate = itemDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        return `
        <div class="col-lg-6 col-md-12 mb-4">
            <div class="gallery-item">
                <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </a>
                <div class="caption">
                    <h5>${item.title}</h5>
                    <p>${item.caption}</p>
                    <small class="text-white-50">${formattedDate}</small>
                </div>
            </div>
        </div>
        `;
    }

    // Funcionalidad específica del blog (botones y filtros)
    function setupBlogFunctionality() {
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.blog-post-card');
                const summary = card.querySelector('.summary-content');
                const fullContent = card.querySelector('.full-content');

                if (summary && fullContent) {
                    summary.style.display = 'none';
                    fullContent.style.display = 'block';
                    e.target.style.display = 'none';
                }
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
                    gallerySection.style.display = 'none';
                    postsSection.style.display = 'flex';
                    const allPosts = document.querySelectorAll('.blog-post-item');
                    allPosts.forEach(post => {
                        post.style.display = (targetCategory === 'all' || post.dataset.category === targetCategory) ? 'block' : 'none';
                    });
                }
            });
        });
    }

    // Llamadas para cargar contenido del blog y la galería
    // Asume que la función carregarConteudo está en script.js y es accesible globalmente
    if (typeof carregarConteudo === 'function') {
        carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'blog.html');
        carregarConteudo('/_dados/galeria.json', 'gallery-section', renderGalleryItem, 'blog.html');
    } else {
        console.error("La función carregarConteudo no está definida. Asegúrate de que script.js se carga antes de blog.js");
    }
});