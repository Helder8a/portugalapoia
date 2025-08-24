document.addEventListener("DOMContentLoaded", () => {
    // --- PRELOADER ---
    const e = document.getElementById("preloader");
    e && (window.onload = () => {
        e.style.display = "none"
    });

    // --- BOTÓN SCROLL TOP ---
    const t = document.getElementById("scrollTopBtn");
    window.onscroll = () => {
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? t.style.display = "block" : t.style.display = "none"
    };
    t.addEventListener("click", () => {
        document.body.scrollTop = 0, document.documentElement.scrollTop = 0
    });

    // --- MENÚ HAMBURGUESA ---
    const n = document.querySelector(".navbar-toggler"),
        o = document.querySelector(".navbar-collapse");
    n.addEventListener("click", () => {
        o.classList.toggle("show")
    });

    // --- CERRAR MENÚ AL HACER CLIC FUERA ---
    document.addEventListener("click", e => {
        !o.contains(e.target) && !n.contains(e.target) && o.classList.remove("show")
    });

    // --- CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN ---
    document.querySelectorAll(".navbar-nav a").forEach(e => {
        e.addEventListener("click", () => {
            o.classList.contains("show") && o.classList.remove("show")
        })
    });

    const a = (e, t) => {
        fetch(e).then(e => e.json()).then(e => t(e)).catch(e => console.error("Erro ao carregar dados:", e))
    };

    // --- LÓGICA PARA LA PÁGINA DE EMPLEO ---
    const d = document.getElementById("job-listings");
    if (d) {
        let e = [];
        const t = document.getElementById("job-search"),
            n = document.getElementById("location-filter");

        function o(o) {
            d.innerHTML = "", (o.length > 0 ? o : e).forEach(e => {
                const t = document.createElement("div");
                t.className = "col-lg-4 col-md-6 mb-4", t.innerHTML = `
                    <div class="card job-card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${e.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${e.company} - ${e.location}</h6>
                            <p class="card-text">${e.description}</p>
                            <a href="${e.link}" class="btn btn-primary" target="_blank">Candidatar-se</a>
                        </div>
                    </div>`, d.appendChild(t)
            })
        }
        t.addEventListener("input", () => {
            const a = t.value.toLowerCase(),
                d = n.value.toLowerCase(),
                i = e.filter(e => (e.title.toLowerCase().includes(a) || e.company.toLowerCase().includes(a)) && e.location.toLowerCase().includes(d));
            o(i)
        }), n.addEventListener("input", () => {
            const a = t.value.toLowerCase(),
                d = n.value.toLowerCase(),
                i = e.filter(e => (e.title.toLowerCase().includes(a) || e.company.toLowerCase().includes(a)) && e.location.toLowerCase().includes(d));
            o(i)
        }), a("/_dados/empregos.json?t=" + (new Date).getTime(), t => {
            e = t.jobs, o(e)
        })
    }

    // --- LÓGICA PARA LA PÁGINA DE VIVIENDA ---
    if (document.getElementById("housing-listings")) {
        a("/_dados/habitacao.json?t=" + (new Date).getTime(), e => {
            const t = document.getElementById("housing-listings"),
                n = e.habitacao.map(e => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card housing-card h-100">
                        <img src="${e.image}" class="card-img-top" alt="Foto de ${e.title}">
                        <div class="card-body">
                            <h5 class="card-title">${e.title}</h5>
                            <p class="card-text">${e.description}</p>
                            <p class="card-text"><small class="text-muted">Localização: ${e.location}</small></p>
                            <p class="card-text"><strong>Preço:</strong> ${e.price} €</p>
                            <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                        </div>
                    </div>
                </div>`).join("");
            t.innerHTML = n
        })
    }

    // --- LÓGICA PARA LA PÁGINA DE DONACIONES ---
    if (document.getElementById("donations-listings")) {
        a("/_dados/doacoes.json?t=" + (new Date).getTime(), e => {
            const t = document.getElementById("donations-listings"),
                n = e.doacoes.map(e => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card donation-card h-100">
                        <img src="${e.image}" class="card-img-top" alt="Foto de ${e.title}">
                        <div class="card-body">
                            <h5 class="card-title">${e.title}</h5>
                            <p class="card-text">${e.description}</p>
                            <p class="card-text"><small class="text-muted">Localização: ${e.location}</small></p>
                             <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                        </div>
                    </div>
                </div>`).join("");
            t.innerHTML = n
        })
    }
    
    // --- LÓGICA PARA LA PÁGINA DE SERVICIOS ---
    if (document.getElementById("services-listings")) {
        a("/_dados/servicos.json?t=" + (new Date).getTime(), e => {
            const t = document.getElementById("services-listings"),
                n = e.servicos.map(e => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card service-card h-100">
                        <img src="${e.image}" class="card-img-top" alt="Foto de ${e.title}">
                        <div class="card-body">
                            <h5 class="card-title">${e.title}</h5>
                            <p class="card-text">${e.description}</p>
                            <p class="card-text"><small class="text-muted">Área de atuação: ${e.area}</small></p>
                             <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                        </div>
                    </div>
                </div>`).join("");
            t.innerHTML = n
        })
    }

    // =====================================================================
    // --- NUEVA LÓGICA PROFESIONAL PARA LA PÁGINA DEL BLOG ---
    // =====================================================================
    if (document.getElementById('posts-section')) {
        const postsContainer = document.getElementById('posts-section');
        const featuredContainer = document.getElementById('featured-post-section');
        const galleryContainer = document.getElementById('gallery-section');
        const filterLinks = document.querySelectorAll('.filter-link');
        const featuredTitle = document.querySelector('#featured-post-section .section-title span');
        const allPostsTitle = document.querySelector('#posts-section + .section-title span');


        // Función para crear el contenido HTML de una tarjeta de post (sin la imagen)
        function createPostCardContent(post) {
            const postDate = new Date(post.date).toLocaleString("pt-PT", {
                day: "numeric",
                month: "long",
                year: "numeric"
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
        }

        // Cargar posts del blog
        a("/_dados/blog.json?t=" + new Date().getTime(), data => {
            const posts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // 1. Mostrar el post destacado si existe
            if (posts.length > 0) {
                const featuredPost = posts[0];
                featuredContainer.innerHTML = `
                    <h2 class="section-title"><span>Última Publicação</span></h2>
                    <div class="blog-post-card" data-category="${featuredPost.category}">
                        <div class="card-img-wrapper">
                             <img class="card-img-top" src="${featuredPost.image}" alt="${featuredPost.title}">
                        </div>
                        ${createPostCardContent(featuredPost)}
                    </div>
                `;
                featuredContainer.style.display = 'block';
            } else {
                 featuredContainer.style.display = 'none';
            }

            // 2. Mostrar el resto de los posts
            const otherPosts = posts.slice(1);
            if(otherPosts.length > 0){
                 postsContainer.innerHTML = otherPosts.map(post => `
                    <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
                        <div class="blog-post-card">
                             <img class="card-img-top" src="${post.image}" alt="${post.title}">
                             ${createPostCardContent(post)}
                        </div>
                    </div>
                `).join('');
            } else {
                // Si no hay otros posts, ocultar el contenedor y su título
                postsContainer.style.display = 'none';
                if(document.querySelector('h2.section-title span:contains("Todas as Publicações")')) {
                    document.querySelector('h2.section-title span:contains("Todas as Publicações")').parentElement.style.display = 'none';
                }
            }
        });
        
         // Cargar galería
        a("/_dados/galeria.json?t=" + new Date().getTime(), data => {
            galleryContainer.innerHTML = data.imagens.map(item => `
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
        });

        // Lógica de los filtros
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const target = link.getAttribute('data-target');
                const allPostsSectionTitle = document.querySelector('.section-title:not(:first-of-type)');

                // Controlar visibilidad de las secciones
                featuredContainer.style.display = (target === 'all' || target === 'galeria') ? 'block' : 'none';
                postsContainer.style.display = (target !== 'galeria') ? 'flex' : 'none';
                galleryContainer.style.display = (target === 'galeria') ? 'flex' : 'none';
                if(allPostsSectionTitle) allPostsSectionTitle.style.display = (target !== 'galeria') ? 'block' : 'none';
                

                if (target !== 'galeria') {
                     document.querySelectorAll('.blog-post-item').forEach(item => {
                        item.style.display = (target === 'all' || item.dataset.category === target) ? 'block' : 'none';
                    });
                     // Ocultar el destacado si no pertenece a la categoría filtrada (y no es 'todos')
                     const featuredCard = featuredContainer.querySelector('.blog-post-card');
                     if(featuredCard) {
                         featuredContainer.style.display = (target === 'all' || featuredCard.dataset.category === target) ? 'block' : 'none';
                     }
                }
            });
        });
    }
});