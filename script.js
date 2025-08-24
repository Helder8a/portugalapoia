document.addEventListener("DOMContentLoaded", () => {
    // --- PRELOADER ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.onload = () => { preloader.style.display = "none"; };
    }

    // --- BOTÓN SCROLL TOP ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = () => {
            scrollTopBtn.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
        };
        scrollTopBtn.addEventListener("click", () => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }

    // --- MENÚ HAMBURGUESA (Móvil) ---
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener("click", () => navbarCollapse.classList.toggle("show"));
        document.addEventListener("click", (event) => {
            if (!navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
                navbarCollapse.classList.remove("show");
            }
        });
        document.querySelectorAll(".navbar-nav a").forEach(link => {
            link.addEventListener("click", () => {
                if (navbarCollapse.classList.contains("show")) navbarCollapse.classList.remove("show");
            });
        });
    }

    // --- FUNCIÓN HELPER PARA CARGAR DATOS JSON ---
    const fetchData = async (url) => {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar dados de ${url}:`, error);
            return null;
        }
    };

    // --- CONTADOR DE ESTADÍSTICAS ---
    const statsSection = document.querySelector('.statistics-section');
    if (statsSection) {
        const animateCounters = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        counter.innerText = '0';
                        const target = +counter.getAttribute('data-target');
                        const duration = 1000;
                        const stepTime = Math.abs(Math.floor(duration / target));
                        let current = 0;
                        const step = () => {
                            current += 1;
                            if (current <= target) {
                                counter.innerText = current;
                                setTimeout(step, stepTime);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        step();
                    });
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(animateCounters, { threshold: 0.5 });
        observer.observe(statsSection);
    }
    
    // --- LÓGICA PARA OTRAS PÁGINAS (Empleo, Vivienda, etc.) ---
    // Esta sección se mantiene igual, la incluyo para que el archivo esté completo.
    const setupListingPage = async (containerId, jsonFile, cardGenerator) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const data = await fetchData(`/_dados/${jsonFile}`);
        if (data) {
            const items = data[Object.keys(data)[0]];
            container.innerHTML = items.map(cardGenerator).join('');
        }
    };

    setupListingPage("housing-listings", "habitacao.json", item => `...`); // Inserta aquí el HTML de la tarjeta de vivienda
    setupListingPage("donations-listings", "doacoes.json", item => `...`); // Inserta aquí el HTML de la tarjeta de donaciones
    setupListingPage("services-listings", "servicos.json", item => `...`); // Inserta aquí el HTML de la tarjeta de servicios

    // =====================================================================
    // --- **[VERSIÓN FINAL Y SIMPLIFICADA]** LÓGICA PARA EL BLOG ---
    // =====================================================================
    const blogPage = document.getElementById('posts-section');
    if (blogPage) {
        const featuredContainer = document.getElementById('featured-post-section');
        const postsContainer = document.getElementById('posts-section');
        const galleryContainer = document.getElementById('gallery-section');
        const filterLinks = document.querySelectorAll('.filter-link');
        const allPostsTitle = document.querySelector('h2.section-title:last-of-type');

        let allPosts = [];
        let allGalleryItems = [];

        // Función para crear el HTML de la tarjeta de un post
        const createPostCardHTML = (post) => {
            const postDate = new Date(post.date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
            return `
                <div class="card-body">
                    <p class="post-category">${post.category}</p>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-meta">Publicado em: ${postDate}</p>
                    <p class="card-text">${post.summary}</p>
                    <a href="#" class="btn btn-outline-primary read-more-btn mt-auto">Ler Artigo Completo</a>
                </div>`;
        };
        
        // Función principal que actualiza la vista
        const updateView = (filter = 'all') => {
            const isGallery = filter === 'galeria';

            // Mostrar/ocultar secciones principales
            galleryContainer.style.display = isGallery ? 'flex' : 'none';
            postsContainer.style.display = isGallery ? 'none' : 'flex';
            if (allPostsTitle) allPostsTitle.style.display = isGallery ? 'none' : 'block';
            
            // Lógica para el artículo destacado
            if (allPosts.length > 0) {
                const featuredPost = allPosts[0];
                const showFeatured = !isGallery && (filter === 'all' || featuredPost.category.toLowerCase() === filter);
                featuredContainer.style.display = showFeatured ? 'block' : 'none';
            }

            // Filtrar la cuadrícula de artículos
            document.querySelectorAll('.blog-post-item').forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
            });
        };

        // Carga inicial de todos los datos
        const initializeBlog = async () => {
            const blogData = await fetchData('/_dados/blog.json');
            const galleryData = await fetchData('/_dados/galeria.json');

            if (blogData && blogData.posts) {
                allPosts = blogData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Renderizar destacado (una sola vez)
                if (allPosts.length > 0) {
                    const featuredPost = allPosts[0];
                    featuredContainer.innerHTML = `
                        <div class="blog-post-card" data-category="${featuredPost.category.toLowerCase()}">
                            <div class="card-img-wrapper"><img class="card-img-top" src="${featuredPost.image}" alt="${featuredPost.title}"></div>
                            ${createPostCardHTML(featuredPost)}
                        </div>`;
                }

                // Renderizar resto de posts (una sola vez)
                postsContainer.innerHTML = allPosts.slice(1).map(post => `
                    <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category.toLowerCase()}">
                        <div class="blog-post-card">
                            <img class="card-img-top" src="${post.image}" alt="${post.title}">
                            ${createPostCardHTML(post)}
                        </div>
                    </div>`).join('');
            }
            
            if (galleryData && galleryData.imagens) {
                allGalleryItems = galleryData.imagens;
                galleryContainer.innerHTML = allGalleryItems.map(item => `
                    <div class="col-lg-6 mb-4">
                        <div class="gallery-item">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="caption"><h5>${item.title}</h5><p>${new Date(item.date).toLocaleDateString("pt-PT")}</p></div>
                        </div>
                    </div>`).join('');
            }
            
            updateView('all'); // Mostrar la vista inicial
        };

        // Asignar eventos a los filtros
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                filterLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                updateView(e.currentTarget.dataset.target.toLowerCase());
            });
        });

        // Iniciar todo
        initializeBlog();
    }
});