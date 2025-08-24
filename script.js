document.addEventListener("DOMContentLoaded", () => {
    // --- LÓGICA DEL PRELOADER ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => preloader.classList.add("hidden"));
        setTimeout(() => preloader.classList.add("hidden"), 1500);
    }

    // --- LÓGICA DEL BOTÓN SCROLL-TO-TOP ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = () => {
            scrollTopBtn.classList.toggle("visible", document.body.scrollTop > 200 || document.documentElement.scrollTop > 200);
        };
        scrollTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

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

    // --- FUNCIÓN PRINCIPAL PARA RENDERIZAR CONTENIDO ---
    async function renderContent(jsonUrl, elementId, templateFunction, pageName) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const data = await fetchJsonData(jsonUrl);
        if (!data || data.length === 0) {
            if (elementId !== "gallery-section") {
                container.innerHTML = '<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>';
            }
            return;
        }

        data.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));
        container.innerHTML = data.map(item => templateFunction(item, pageName)).join("");

        // Inicializa la lógica específica después de renderizar
        if (pageName === "blog.html" && elementId === "posts-section") {
            initializeBlogLogic();
        }
    }

    // --- PLANTILLA PARA LOS POSTS DEL BLOG ---
    const blogPostTemplate = (item) => {
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
    
    // --- LÓGICA ESPECÍFICA Y ESTABLE PARA EL BLOG ---
    function initializeBlogLogic() {
        const blogContainer = document.querySelector('.page-header-blog')?.closest('body');
        if (!blogContainer) return;

        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const blogNav = document.querySelector('.blog-nav');

        const closeExpandedPost = () => {
            const expandedCard = document.querySelector('.blog-post-card.expanded');
            if (expandedCard) {
                expandedCard.classList.remove('expanded');
            }
            document.body.classList.remove('modal-open');
        };

        postsSection.addEventListener('click', (event) => {
            const readMoreBtn = event.target.closest('.read-more-btn');
            const closeBtn = event.target.closest('.close-btn');

            if (readMoreBtn) {
                event.preventDefault();
                const card = readMoreBtn.closest('.blog-post-card');
                card.classList.add('expanded');
                document.body.classList.add('modal-open');
            }

            if (closeBtn) {
                event.preventDefault();
                closeExpandedPost();
            }
        });

        if (blogNav) {
            blogNav.addEventListener('click', (event) => {
                const navLink = event.target.closest('.nav-link');
                if (!navLink) return;

                event.preventDefault();
                closeExpandedPost(); // Cierra cualquier modal al cambiar de filtro

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
            });
        }
    }

    // --- INICIALIZACIÓN DE CONTENIDO ---
    renderContent("/_dados/blog.json", "posts-section", blogPostTemplate, "blog.html");
    // Puedes añadir las llamadas para otras páginas aquí si es necesario
});