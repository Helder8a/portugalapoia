// --- CÓDIGO FINAL Y CORRECTO para blog.js (Versión Revista) ---

document.addEventListener("DOMContentLoaded", () => {
    function onScriptReady(callback) {
        if (window.carregarConteudo) {
            callback();
        } else {
            setTimeout(() => onScriptReady(callback), 50);
        }
    }

    function renderFeaturedBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        return `
        <div class="featured-post-card d-flex flex-column flex-lg-row">
            <img class="lazy card-img-top" data-src="${post.image}" alt="${post.title}">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="text-muted small">Publicado em: ${formattedDate}</p>
                <p class="card-text summary-content">${post.summary}</p>
                <div class="full-content" style="display: none;">
                    <p>${post.body.replace(/\\n/g, '</p><p>')}</p>
                </div>
                <button class="btn btn-primary read-more-btn">Ler Mais</button>
            </div>
        </div>`;
    }

    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        return `
        <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
            <div class="blog-post-card">
                <img class="card-img-top lazy" data-src="${post.image}" alt="${post.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="text-muted small">Publicado em: ${formattedDate}</p>
                    <p class="card-text summary-content flex-grow-1">${post.summary}</p>
                    <div class="full-content" style="display: none;">
                        <p>${post.body.replace(/\\n/g, '</p><p>')}</p>
                    </div>
                    <button class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</button>
                </div>
            </div>
        </div>`;
    }

    function renderGalleryItem(item) {
        return `<div class="col-lg-6 col-md-12 mb-4"><div class="gallery-item"><a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}"><img class="lazy" data-src="${item.image}" alt="${item.title}"></a></div></div>`;
    }

    function setupBlogFunctionality() {
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.blog-post-card, .featured-post-card');
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
        const blogContentGrid = document.getElementById('blog-content-grid');
        const gallerySection = document.getElementById('gallery-section');
        const postsSection = document.getElementById('posts-section'); // La sección principal de posts
        
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
                    const allPosts = document.querySelectorAll('.blog-post-item');
                    allPosts.forEach(post => {
                        post.style.display = (targetCategory === 'all' || post.dataset.category === targetCategory) ? 'block' : 'none';
                    });
                }
            });
        });
    }

    async function carregarTudo() {
        // Cargar los datos del blog
        const postsData = await window.carregarConteudo('/_dados/blog.json');

        if (postsData && postsData.posts && postsData.posts.length > 0) {
            const featuredPost = postsData.posts[0];
            const otherPosts = postsData.posts.slice(1);

            // Renderizar el post destacado
            const featuredPostSection = document.getElementById('featured-post-section');
            if (featuredPostSection) {
                featuredPostSection.innerHTML = renderFeaturedBlogPost(featuredPost);
            }

            // Renderizar el resto de los posts en la cuadrícula
            const blogContentGrid = document.getElementById('blog-content-grid');
            if (blogContentGrid) {
                blogContentGrid.innerHTML = otherPosts.map(renderBlogPost).join('');
            }
        }
        
        // Cargar la galería
        await window.carregarConteudo('/_dados/galeria.json', 'gallery-section', renderGalleryItem);

        // Configurar la funcionalidad después de que todo se ha cargado
        setupBlogFunctionality();
    }

    onScriptReady(() => {
        carregarTudo();
    });
});