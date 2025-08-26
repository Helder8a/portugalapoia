// --- CÓDIGO FINAL Y CORRECTO para blog.js ---

document.addEventListener("DOMContentLoaded", () => {
    // Función para esperar a que window.carregarConteudo esté disponible
    function onScriptReady(callback) {
        if (window.carregarConteudo) {
            callback();
        } else {
            setTimeout(() => onScriptReady(callback), 50);
        }
    }

    onScriptReady(() => {
        function renderBlogPost(post) {
    const postDate = new Date(post.date);
    // Formato de fecha para Schema.org (YYYY-MM-DD)
    const schemaDate = postDate.toISOString().split('T')[0];
    const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Añadimos los atributos itemscope, itemtype, e itemprop
    return `
    <div class="col-lg-4 col-md-6 mb-4 blog-post-item" itemscope itemtype="https://schema.org/BlogPosting" data-category="${post.category}">
        
        <meta itemprop="datePublished" content="${schemaDate}">
        <meta itemprop="image" content="${window.location.origin}${post.image}">
        
        <div class="blog-post-card">
            <img class="card-img-top lazy" data-src="${post.image}" alt="${post.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title" itemprop="headline">${post.title}</h5>
                <p class="text-muted small">Publicado em: ${formattedDate}</p>
                <p class="card-text summary-content flex-grow-1" itemprop="description">${post.summary}</p>
                <div class="full-content" style="display: none;" itemprop="articleBody">
                    <p>${post.body.replace(/\\n/g, '</p><p>')}</p>
                </div>
                <button class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</button>
            </div>
        </div>
    </div>`;
}

        function renderGalleryItem(item) {
            return `
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="gallery-item">
                    <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}">
                        <img class="lazy" data-src="${item.image}" alt="${item.title}">
                    </a>
                </div>
            </div>`;
        }

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
            const allPosts = postsSection.querySelectorAll('.blog-post-item');

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

        async function carregarTudo() {
            await Promise.all([
                window.carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'posts'),
                window.carregarConteudo('/_dados/galeria.json', 'gallery-section', renderGalleryItem, 'imagens')
            ]);
            setupBlogFunctionality();
        }

        carregarTudo();
    });
});