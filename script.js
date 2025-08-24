document.addEventListener("DOMContentLoaded", () => {
    // --- PRELOADER ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.onload = () => {
            preloader.style.display = "none";
        };
    }

    // --- BOTÓN SCROLL TOP ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
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
        navbarToggler.addEventListener("click", () => {
            navbarCollapse.classList.toggle("show");
        });

        document.addEventListener("click", (event) => {
            if (!navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
                navbarCollapse.classList.remove("show");
            }
        });

        document.querySelectorAll(".navbar-nav a").forEach(link => {
            link.addEventListener("click", () => {
                if (navbarCollapse.classList.contains("show")) {
                    navbarCollapse.classList.remove("show");
                }
            });
        });
    }

    // --- FUNCIÓN HELPER PARA CARGAR DATOS JSON ---
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar dados de ${url}:`, error);
            return null;
        }
    };
    
    // --- **[CORREGIDO]** CONTADOR DE ESTADÍSTICAS ---
    const statsSection = document.querySelector('.statistics-section');
    if (statsSection) {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // La velocidad de la animación

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const increment = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }


    // --- LÓGICA PARA LA PÁGINA DE EMPLEO ---
    const jobListings = document.getElementById("job-listings");
    if (jobListings) {
        // ... (el resto del código para Empleo, Vivienda, etc. se mantiene igual)
    }

    // ... (aquí iría el resto del código para Vivienda, Donaciones y Servicios)
    // Para brevedad, no lo repito, pero debe estar aquí. El código de la respuesta anterior para esas secciones es correcto.


    // =====================================================================
    // --- **[CORREGIDO]** LÓGICA PARA LA PÁGINA DEL BLOG ---
    // =====================================================================
    const blogContent = document.querySelector(".blog-content");
    if (blogContent) {
        const featuredContainer = document.getElementById('featured-post-section');
        const postsContainer = document.getElementById('posts-section');
        const galleryContainer = document.getElementById('gallery-section');
        const filterLinks = document.querySelectorAll('.filter-link');
        const allPostsTitle = Array.from(document.querySelectorAll('h2.section-title span')).find(el => el.textContent === 'Todas as Publicações');

        // Función para crear el HTML de una tarjeta de artículo
        const createPostCardHTML = (post) => {
            const postDate = new Date(post.date).toLocaleDateString("pt-PT", {
                day: "numeric", month: "long", year: "numeric"
            });
            return `
                <div class="card-body">
                    <p class="post-category">${post.category}</p>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-meta">Publicado em: ${postDate}</p>
                    <p class="card-text">${post.summary}</p>
                    <a href="#" class="btn btn-outline-primary read-more-btn mt-auto">Ler Artigo Completo</a>
                </div>
            `;
        };

        const initBlog = async () => {
            const blogData = await fetchData(`/_dados/blog.json?t=${new Date().getTime()}`);
            const galleryData = await fetchData(`/_dados/galeria.json?t=${new Date().getTime()}`);

            if (blogData && blogData.posts) {
                const sortedPosts = blogData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                renderBlog(sortedPosts);
            }

            if (galleryData && galleryData.imagens) {
                renderGallery(galleryData.imagens);
            }
             // Asegurarse de que el estado inicial (filtro "Todos") es correcto
            updateView('all');
        };
        
        const renderBlog = (posts) => {
            if (posts.length > 0) {
                const featuredPost = posts[0];
                featuredContainer.innerHTML = `
                    <div class="blog-post-card" data-category="${featuredPost.category.toLowerCase()}">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="${featuredPost.image}" alt="${featuredPost.title}">
                        </div>
                        ${createPostCardHTML(featuredPost)}
                    </div>`;
            }

            postsContainer.innerHTML = posts.slice(1).map(post => `
                <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category.toLowerCase()}">
                    <div class="blog-post-card">
                        <img class="card-img-top" src="${post.image}" alt="${post.title}">
                        ${createPostCardHTML(post)}
                    </div>
                </div>
            `).join('');
        };
        
        const renderGallery = (images) => {
            galleryContainer.innerHTML = images.map(item => `
                 <div class="col-lg-6 mb-4">
                    <div class="gallery-item">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="caption">
                            <h5>${item.title}</h5>
                            <p>${new Date(item.date).toLocaleDateString("pt-PT")}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        };

        const updateView = (targetCategory) => {
            const isGallery = targetCategory === 'galeria';
            
            // Visibilidad de las secciones principales
            galleryContainer.style.display = isGallery ? 'flex' : 'none';
            postsContainer.style.display = isGallery ? 'none' : 'flex';
            if (allPostsTitle) allPostsTitle.parentElement.style.display = isGallery ? 'none' : 'block';
            
            // Lógica para el artículo destacado
            const featuredCard = featuredContainer.querySelector('.blog-post-card');
            if(featuredCard){
                const featuredCategory = featuredCard.dataset.category;
                const showFeatured = !isGallery && (targetCategory === 'all' || featuredCategory === targetCategory);
                featuredContainer.style.display = showFeatured ? 'block' : 'none';
            }

            // Filtrar la lista de artículos
            document.querySelectorAll('.blog-post-item').forEach(item => {
                const itemCategory = item.dataset.category;
                item.style.display = (targetCategory === 'all' || itemCategory === targetCategory) ? 'block' : 'none';
            });
        };
        
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                filterLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const targetCategory = e.currentTarget.dataset.target.toLowerCase();
                updateView(targetCategory);
            });
        });

        initBlog(); // Iniciar la carga del blog
    }
});