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
            console.error("Erro ao carregar dados:", error);
            return null;
        }
    };

    // --- LÓGICA PARA LA PÁGINA DE EMPLEO ---
    const jobListings = document.getElementById("job-listings");
    if (jobListings) {
        let allJobs = [];
        const jobSearch = document.getElementById("job-search");
        const locationFilter = document.getElementById("location-filter");

        const renderJobs = (jobs) => {
            jobListings.innerHTML = jobs.map(job => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card job-card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${job.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${job.company} - ${job.location}</h6>
                            <p class="card-text">${job.description}</p>
                            <a href="${job.link}" class="btn btn-primary" target="_blank">Candidatar-se</a>
                        </div>
                    </div>
                </div>
            `).join('');
        };

        const filterJobs = () => {
            const searchTerm = jobSearch.value.toLowerCase();
            const locationTerm = locationFilter.value.toLowerCase();
            const filteredJobs = allJobs.filter(job =>
                (job.title.toLowerCase().includes(searchTerm) || job.company.toLowerCase().includes(searchTerm)) &&
                job.location.toLowerCase().includes(locationTerm)
            );
            renderJobs(filteredJobs);
        };

        jobSearch.addEventListener("input", filterJobs);
        locationFilter.addEventListener("input", filterJobs);

        fetchData(`/_dados/empregos.json?t=${new Date().getTime()}`).then(data => {
            if (data && data.jobs) {
                allJobs = data.jobs;
                renderJobs(allJobs);
            }
        });
    }

    // --- LÓGICA GENÉRICA PARA OTRAS PÁGINAS (Vivienda, Donaciones, Servicios) ---
    const setupListingPage = async (containerId, jsonFile, cardGenerator) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = await fetchData(`/_dados/${jsonFile}?t=${new Date().getTime()}`);
        if (data) {
            const items = data[Object.keys(data)[0]]; // Accede a la primera propiedad del JSON
            container.innerHTML = items.map(cardGenerator).join('');
        }
    };

    setupListingPage("housing-listings", "habitacao.json", item => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card housing-card h-100">
                <img src="${item.image}" class="card-img-top" alt="Foto de ${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text"><small class="text-muted">Localização: ${item.location}</small></p>
                    <p class="card-text"><strong>Preço:</strong> ${item.price} €</p>
                    <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                </div>
            </div>
        </div>
    `);

    setupListingPage("donations-listings", "doacoes.json", item => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card donation-card h-100">
                <img src="${item.image}" class="card-img-top" alt="Foto de ${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text"><small class="text-muted">Localização: ${item.location}</small></p>
                    <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                </div>
            </div>
        </div>
    `);

    setupListingPage("services-listings", "servicos.json", item => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card service-card h-100">
                <img src="${item.image}" class="card-img-top" alt="Foto de ${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text"><small class="text-muted">Área de atuação: ${item.area}</small></p>
                    <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                </div>
            </div>
        </div>
    `);


    // =====================================================================
    // --- LÓGICA MEJORADA Y CORREGIDA PARA LA PÁGINA DEL BLOG ---
    // =====================================================================
    const blogContent = document.querySelector(".blog-content");
    if (blogContent) {
        const featuredContainer = document.getElementById('featured-post-section');
        const postsContainer = document.getElementById('posts-section');
        const galleryContainer = document.getElementById('gallery-section');
        const filterLinks = document.querySelectorAll('.filter-link');
        const allPostsTitle = document.querySelector('h2.section-title:last-of-type');


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
                    <a href="#" class="btn btn-outline-primary read-more-btn">Ler Artigo Completo</a>
                </div>
            `;
        };

        const renderBlog = (posts) => {
            // Renderiza el artículo destacado
            if (posts.length > 0) {
                const featuredPost = posts[0];
                featuredContainer.innerHTML = `
                    <div class="blog-post-card" data-category="${featuredPost.category.toLowerCase()}">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="${featuredPost.image}" alt="${featuredPost.title}">
                        </div>
                        ${createPostCardHTML(featuredPost)}
                    </div>`;
            } else {
                 featuredContainer.style.display = 'none';
            }

            // Renderiza el resto de artículos
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
        
        const handleFilterClick = (e) => {
            e.preventDefault();
            const activeFilter = e.currentTarget;
            const targetCategory = activeFilter.dataset.target.toLowerCase();

            // Actualiza el estado activo del filtro
            filterLinks.forEach(link => link.classList.remove('active'));
            activeFilter.classList.add('active');

            // Muestra u oculta las secciones principales
            const isGallery = targetCategory === 'galeria';
            featuredContainer.style.display = isGallery ? 'none' : 'block';
            postsContainer.style.display = isGallery ? 'none' : 'flex';
            galleryContainer.style.display = isGallery ? 'flex' : 'none';
            allPostsTitle.style.display = isGallery ? 'none' : 'block';

            if (!isGallery) {
                // Filtra el artículo destacado
                 const featuredCard = featuredContainer.querySelector('.blog-post-card');
                 if(featuredCard){
                    const featuredCategory = featuredCard.dataset.category;
                    featuredContainer.style.display = (targetCategory === 'all' || featuredCategory === targetCategory) ? 'block' : 'none';
                 }

                // Filtra la lista de artículos
                document.querySelectorAll('.blog-post-item').forEach(item => {
                    const itemCategory = item.dataset.category;
                    item.style.display = (targetCategory === 'all' || itemCategory === targetCategory) ? 'block' : 'none';
                });
            }
        };

        // Carga inicial de datos
        Promise.all([
            fetchData(`/_dados/blog.json?t=${new Date().getTime()}`),
            fetchData(`/_dados/galeria.json?t=${new Date().getTime()}`)
        ]).then(([blogData, galleryData]) => {
            if (blogData && blogData.posts) {
                const sortedPosts = blogData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                renderBlog(sortedPosts);
            }
            if(galleryData && galleryData.imagens){
                renderGallery(galleryData.imagens);
            }
        });

        // Añade el evento a cada link de filtro
        filterLinks.forEach(link => link.addEventListener('click', handleFilterClick));
    }
});