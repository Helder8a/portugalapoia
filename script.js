document.addEventListener("DOMContentLoaded", (async () => {
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
            document.body.scrollTop > 200 || document.documentElement.scrollTop > 200 ?
                scrollTopBtn.classList.add("visible") :
                scrollTopBtn.classList.remove("visible");
        };
        scrollTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // --- LÓGICA DEL TEMA OSCURO/CLARO ---
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        const body = document.body;
        const setTheme = (theme) => {
            if (theme === "dark") {
                body.classList.add("dark-theme");
                themeToggle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                themeToggle.checked = false;
            }
        };
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme("dark");
        }
        themeToggle.addEventListener("change", () => {
            const newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
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
        container.innerHTML = data.map(item => templateFunction(item, pageName, item.id)).join("");

        if (pageName === "blog.html" && elementId === "posts-section") {
            initializeBlogLogic();
        }
    }

    // --- FUNCIONES DE PLANTILLAS Y AYUDA ---
    function getDateInfo(item) {
        if (!item || !item.data_publicacao || !item.data_vencimento) return `<div class="date-info">ID: ${item.id || "N/A"}</div>`;
        const pubDate = new Date(item.data_publicacao);
        const expDate = new Date(item.data_vencimento);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const pubDateStr = pubDate.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
        const expDateStr = expDate.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
        const isExpired = expDate < today;
        return `<div class="date-info">Publicado: ${pubDateStr} <br> <span class="${isExpired ? "vencido" : ""}">Vencimento: ${expDateStr} ${isExpired ? "(Vencido)" : ""}</span></div>`;
    }

    function getShareButtons(item, page) {
        const url = `https://portugalapoia.com/${page}#${item.id}`;
        const text = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${item.titulo}"`;
        const encodedUrl = encodeURIComponent(url);
        return `<div class="share-buttons"><small class="share-label">Partilhar:</small><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a></div>`;
    }
    
    // --- RENDERIZADO DE CONTENIDO POR PÁGINA ---
    renderContent("/_dados/doacoes.json", "announcements-grid", (item, page) => `
        <div class="col-md-4 mb-4"><div class="card h-100">${item.imagem?`<img src="${item.imagem}" class="card-img-top" alt="${item.titulo}" loading="lazy">`:`<div class="image-placeholder">${item.titulo}</div>`}<div class="card-body"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted">${item.localizacao}</h6><p class="card-text">${item.descricao}</p></div><div class="card-footer">${getDateInfo(item)}${getShareButtons(item,page)}</div></div></div>`, "doações.html");
    renderContent("/_dados/empregos.json", "jobs-grid", (item, page) => `
        <div class="col-md-4 mb-4"><div class="card h-100"><div class="card-body"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted">${item.localizacao}</h6><p class="card-text">${item.descricao}</p></div><div class="card-footer">${getDateInfo(item)}${getShareButtons(item,page)}</div></div></div>`, "empregos.html");
    renderContent("/_dados/servicos.json", "services-grid", (item, page) => `
        <div class="col-md-4 mb-4"><div class="card h-100">${item.valor_servico?`<div class="card-price">${item.valor_servico}</div>`:""}${item.logo_empresa?`<div class="service-card-logo"><img src="${item.logo_empresa}" alt="Logo"></div>`:""}<div class="card-body"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted">${item.localizacao}</h6><p class="card-text">${item.descricao}</p></div><div class="card-footer">${getDateInfo(item)}${getShareButtons(item,page)}</div></div></div>`, "serviços.html");
    renderContent("/_dados/habitacao.json", "housing-grid", (item, page) => `
        <div class="col-md-4 mb-4"><div class="card h-100">${item.imagens&&item.imagens.length>0&&item.imagens[0].imagem_url?`<img src="${item.imagens[0].imagem_url}" class="card-img-top" alt="${item.titulo}" loading="lazy">`:`<div class="image-placeholder">${item.titulo}</div>`}${item.valor_anuncio?`<div class="card-price">${item.valor_anuncio}</div>`:""}<div class="card-body"><h5 class="card-title">${item.titulo}</h5><h6 class="card-subtitle mb-2 text-muted">${item.localizacao}</h6><p class="card-text">${item.descricao}</p></div><div class="card-footer">${getDateInfo(item)}${getShareButtons(item,page)}</div></div></div>`, "habitação.html");
    renderContent("/_dados/blog.json", "posts-section", (item) => {
        const postDate = new Date(item.date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
        return `<div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${item.category}"><div class="blog-post-card"><img class="card-img-top" src="${item.image}" alt="${item.title}" loading="lazy"><div class="card-body"><h5 class="card-title">${item.title}</h5><p class="text-muted small">Publicado em: ${postDate}</p><div class="summary-content"><p class="card-text">${item.summary}</p><a href="#" class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</a></div><div class="full-content"><p>${item.body.replace(/\n/g,"</p><p>")}</p></div></div><button class="btn btn-light close-btn" aria-label="Fechar">&times;</button></div></div>`;
    }, "blog.html");
    renderContent("/_dados/galeria.json", "gallery-section", (item) => {
        const galleryDate = new Date(item.date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
        return `<div class="col-lg-6 col-md-12 mb-4"><div class="gallery-item"><img src="${item.image}" alt="${item.title}" loading="lazy"><div class="caption"><h5>${item.title}</h5><p>${item.caption}</p><small class="text-white-50">${galleryDate}</small></div></div></div>`;
    }, "blog.html");
    
    // --- LÓGICA ESPECÍFICA DEL BLOG ---
    function initializeBlogLogic() {
        const blogContent = document.getElementById('blog-content');
        if (!blogContent) return;

        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const blogNav = document.querySelector('.blog-nav');

        const closeExpandedPost = () => {
            const currentlyExpanded = document.querySelector('.blog-post-card.expanded');
            if (currentlyExpanded) {
                currentlyExpanded.classList.remove('expanded');
            }
            document.body.classList.remove('modal-open');
        };

        blogContent.addEventListener('click', (event) => {
            const readMoreBtn = event.target.closest('.read-more-btn');
            const closeBtn = event.target.closest('.close-btn');
            if (readMoreBtn) {
                event.preventDefault();
                const card = readMoreBtn.closest('.blog-post-card');
                closeExpandedPost();
                card.classList.add('expanded');
                document.body.classList.add('modal-open');
            }
            if (closeBtn) {
                event.preventDefault();
                closeExpandedPost();
            }
        });

        if(blogNav) {
            blogNav.addEventListener('click', (event) => {
                const navLink = event.target.closest('.nav-link');
                if (!navLink) return;

                event.preventDefault();
                closeExpandedPost();
                blogNav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
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

    // --- SCRIPTS ADICIONALES (Contadores, Búsqueda, etc.) ---
    (async function updateCounters() {
        const donations = await fetchJsonData("/_dados/doacoes.json");
        const jobs = await fetchJsonData("/_dados/empregos.json");
        const services = await fetchJsonData("/_dados/servicos.json");
        const totalDonations = donations.length;
        const totalJobs = jobs.length;
        const total = totalDonations + totalJobs + services.length;
        
        const elDonations = document.getElementById("contador-doacoes");
        const elJobs = document.getElementById("contador-empregos");
        const elTotal = document.getElementById("contador-total");

        if(elDonations) elDonations.textContent = `${totalDonations}+`;
        if(elJobs) elJobs.textContent = `${totalJobs}+`;
        if(elTotal) elTotal.textContent = `${total}+`;
    })();

    (function initializeSearch() {
        const searchInput = document.getElementById("searchInput");
        if (!searchInput) return;

        const searchButton = document.getElementById("searchButton");
        const clearButton = document.getElementById("clearButton");
        const locationInput = document.getElementById("locationInput");
        const noResults = document.getElementById("no-results");
        const gridId = document.querySelector('.row[id$="-grid"]')?.id;
        const grid = gridId ? document.getElementById(gridId) : null;
        if (!grid) return;

        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            const locationTerm = locationInput.value.toLowerCase();
            const items = grid.querySelectorAll(".col-md-4");
            let hasResults = false;

            items.forEach(item => {
                const title = item.querySelector(".card-title").textContent.toLowerCase();
                const subtitle = item.querySelector(".card-subtitle").textContent.toLowerCase();
                const text = item.querySelector(".card-text").textContent.toLowerCase();
                const matchesSearch = title.includes(searchTerm) || text.includes(searchTerm);
                const matchesLocation = subtitle.includes(locationTerm);

                if (matchesSearch && matchesLocation) {
                    item.style.display = "";
                    hasResults = true;
                } else {
                    item.style.display = "none";
                }
            });
            noResults.style.display = hasResults ? "none" : "block";
        }
        if(searchButton) searchButton.addEventListener("click", performSearch);
        if(clearButton) clearButton.addEventListener("click", () => {
            searchInput.value = "";
            locationInput.value = "";
            performSearch();
        });
    })();
}));