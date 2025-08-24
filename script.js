document.addEventListener("DOMContentLoaded", () => {
    // --- FUNCIÓN PARA OBTENER DATOS JSON ---
    async function fetchJsonData(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return [];
            const data = await response.json();
            const key = Object.keys(data)[0];
            return Array.isArray(data[key]) ? data[key] : [];
        } catch (error) {
            console.error(`Error processing JSON from ${url}:`, error);
            return [];
        }
    }

    // --- FUNCIÓN PARA RENDERIZAR LOS POSTS DEL BLOG ---
    async function renderBlogPosts() {
        const container = document.getElementById("posts-section");
        if (!container) return;

        const posts = await fetchJsonData("/_dados/blog.json");
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>';
            return;
        }
        
        posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        const template = (item) => {
            const postDate = new Date(item.date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
            return `
                <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${item.category}">
                    <div class="blog-post-card">
                        <img class="card-img-top" src="${item.image}" alt="${item.title}" loading="lazy">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="text-muted small">Publicado em: ${postDate}</p>
                            <div class="summary-content">
                                <p class="card-text">${item.summary}</p>
                                <a href="#" class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</a>
                            </div>
                            <div class="full-content">
                                <p>${item.body.replace(/\n/g, "</p><p>")}</p>
                            </div>
                        </div>
                        <button class="btn btn-light close-btn" aria-label="Fechar">&times;</button>
                    </div>
                </div>`;
        };

        container.innerHTML = posts.map(template).join("");
    }

    // --- LÓGICA DE INTERACTIVIDAD DEL BLOG ---
    function initializeBlogLogic() {
        const blogContainer = document.getElementById('blog-content');
        if (!blogContainer) return;

        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const blogNav = document.querySelector('.blog-nav');

        // Función para cerrar cualquier modal que esté abierta
        const closeExpandedPost = () => {
            const expandedCard = document.querySelector('.blog-post-card.expanded');
            if (expandedCard) {
                expandedCard.classList.remove('expanded');
            }
            document.body.classList.remove('modal-open');
        };

        // Manejador de clics para toda el área del blog (posts y galería)
        blogContainer.addEventListener('click', (event) => {
            const readMoreBtn = event.target.closest('.read-more-btn');
            const closeBtn = event.target.closest('.close-btn');
            const navLink = event.target.closest('.nav-link');

            // Si se hace clic en "Ler Mais"
            if (readMoreBtn) {
                event.preventDefault();
                const card = readMoreBtn.closest('.blog-post-card');
                card.classList.add('expanded');
                document.body.classList.add('modal-open');
            }

            // Si se hace clic en el botón de cerrar
            if (closeBtn) {
                event.preventDefault();
                closeExpandedPost();
            }

            // Si se hace clic en un filtro de categoría
            if (navLink) {
                event.preventDefault();
                closeExpandedPost();

                blogNav.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
                
                const category = navLink.getAttribute('data-target');

                if (category === 'galeria') {
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    postsSection.style.display = 'flex';
                    gallerySection.style.display = 'none';
                    document.querySelectorAll('.blog-post-item').forEach(post => {
                        const postCategory = post.getAttribute('data-category');
                        post.style.display = (category === 'all' || postCategory === category) ? 'block' : 'none';
                    });
                }
            }
        });
    }

    // --- INICIALIZACIÓN ---
    // Renderiza los posts y LUEGO inicializa la lógica de clics
    renderBlogPosts().then(() => {
        initializeBlogLogic();
    });
});