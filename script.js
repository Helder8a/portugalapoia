document.addEventListener("DOMContentLoaded", () => {
    // --- FUNCIÓN PARA CARGAR DATOS JSON ---
    async function fetchJsonData(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return [];
            const data = await response.json();
            const key = Object.keys(data)[0];
            return Array.isArray(data[key]) ? data[key] : [];
        } catch (error) {
            console.error(`Error loading data from ${url}:`, error);
            return [];
        }
    }

    // --- FUNCIÓN PARA CREAR Y MOSTRAR LOS POSTS DEL BLOG ---
    async function displayBlogPosts() {
        const container = document.getElementById("posts-section");
        if (!container) return;

        const posts = await fetchJsonData("/_dados/blog.json");
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>';
            return;
        }

        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const postTemplate = (item) => {
            const postDate = new Date(item.date).toLocaleString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
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
        container.innerHTML = posts.map(postTemplate).join("");
    }
    
    // --- LÓGICA DE INTERACTIVIDAD (EVENT DELEGATION) ---
    function initializeInteractions() {
        const body = document.body;
        const blogNav = document.querySelector('.blog-nav');

        // Escucha clics en todo el cuerpo del documento
        body.addEventListener('click', (event) => {
            const readMoreBtn = event.target.closest('.read-more-btn');
            const closeBtn = event.target.closest('.close-btn');

            // Si el clic fue en un botón "Ler Mais"
            if (readMoreBtn) {
                event.preventDefault();
                const card = readMoreBtn.closest('.blog-post-card');
                if (card) {
                    body.classList.add('modal-open');
                    card.classList.add('expanded');
                }
            }

            // Si el clic fue en un botón de cerrar
            if (closeBtn) {
                event.preventDefault();
                const card = closeBtn.closest('.blog-post-card');
                if (card) {
                    body.classList.remove('modal-open');
                    card.classList.remove('expanded');
                }
            }
        });
        
        // Lógica para los filtros de categoría
        if (blogNav) {
            const postsSection = document.getElementById('posts-section');
            const gallerySection = document.getElementById('gallery-section');

            blogNav.addEventListener('click', (event) => {
                const navLink = event.target.closest('.nav-link');
                if (!navLink) return;
                
                event.preventDefault();
                
                // Cierra cualquier ventana modal abierta al cambiar de filtro
                const expandedCard = document.querySelector('.blog-post-card.expanded');
                if(expandedCard) {
                    body.classList.remove('modal-open');
                    expandedCard.classList.remove('expanded');
                }

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
                        post.style.display = (category === 'all' || post.dataset.category === category) ? 'block' : 'none';
                    });
                }
            });
        }
    }

    // --- INICIALIZACIÓN ---
    // Primero, muestra los posts del blog.
    // Luego, activa toda la interactividad de la página.
    displayBlogPosts();
    initializeInteractions();
});