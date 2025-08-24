document.addEventListener("DOMContentLoaded", (async () => {
    const t = document.getElementById("preloader");
    t && (window.addEventListener("load", (() => t.classList.add("hidden"))), setTimeout((() => t.classList.add("hidden")), 1500));
    const e = document.getElementById("scrollTopBtn");
    e && (window.onscroll = () => {
        document.body.scrollTop > 200 || document.documentElement.scrollTop > 200 ? e.classList.add("visible") : e.classList.remove("visible")
    }, e.addEventListener("click", (t => {
        t.preventDefault(), window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })));
    const a = document.getElementById("theme-toggle");
    if (a) {
        const t = document.body,
            e = e => {
                "dark" === e ? (t.classList.add("dark-theme"), a.checked = !0) : (t.classList.remove("dark-theme"), a.checked = !1)
            },
            n = localStorage.getItem("theme"),
            o = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        n ? e(n) : o && e("dark"), a.addEventListener("change", (() => {
            const t = a.checked ? "dark" : "light";
            localStorage.setItem("theme", t), e(t)
        }))
    }
    async function n(t) {
        try {
            const e = await fetch(`${t}?t=${(new Date).getTime()}`);
            if (!e.ok) return [];
            const a = await e.json(),
                n = Object.keys(a)[0];
            return Array.isArray(a[n]) ? a[n] : []
        } catch (e) {
            return console.error(`Erro ao processar JSON de ${t}:`, e), []
        }
    }
    async function o(t, e, a, o) {
        const s = document.getElementById(e);
        if (!s) return;
        const c = await n(t);
        if (!c || 0 === c.length) return void("gallery-section" !== e && (s.innerHTML = '<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>'));
        c.sort(((t, e) => new Date(e.data_publicacao || e.date || 0) - new Date(t.data_publicacao || t.date || 0)));
        const d = c.map((t => a(t, o, t.id))).join("");
        s.innerHTML = d, "empregos.html" === o && c.forEach((t => {
            const e = {
                "@context": "https://schema.org/",
                "@type": "JobPosting",
                title: t.titulo,
                description: t.descricao,
                datePosted: t.data_publicacao,
                validThrough: t.data_vencimento || "",
                employmentType: "FULL_TIME",
                hiringOrganization: {
                    "@type": "Organization",
                    name: "Empresa (Confidencial)"
                },
                jobLocation: {
                    "@type": "Place",
                    address: {
                        "@type": "PostalAddress",
                        addressLocality: t.localizacao,
                        addressCountry: "PT"
                    }
                }
            },
                a = document.createElement("script");
            a.type = "application/ld+json", a.textContent = JSON.stringify(e), document.head.appendChild(a)
        }))
    }

    function s(t) {
        if (!t || !t.data_publicacao || !t.data_vencimento) return `<div class="date-info">ID: ${t.id||"N/A"}</div>`;
        const e = new Date(t.data_publicacao),
            a = new Date(t.data_vencimento),
            n = new Date;
        n.setHours(0, 0, 0, 0);
        const o = e.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }),
            s = a.toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }),
            c = a < n;
        return `<div class="date-info">Publicado: ${o} <br> <span class="${c?"vencido":""}">Vencimento: ${s} ${c?"(Vencido)":""}</span></div>`
    }

    function c(t, e) {
        const a = `https://portugalapoia.com/${e}#${t.id}`,
            n = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${t.titulo}"`,
            o = encodeURIComponent(a);
        return `<div class="share-buttons"><small class="share-label">Partilhar:</small><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n)}%20${o}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${o}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a></div>`
    }
    o("/_dados/doacoes.json", "announcements-grid", (function(t, e) {
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                ${t.imagem?`<img src="${t.imagem}" class="card-img-top" alt="${t.titulo}" loading="lazy">`:`<div class="image-placeholder">${t.titulo}</div>`}
                <div class="card-body">
                    <h5 class="card-title">${t.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${t.localizacao}</h6>
                    <p class="card-text">${t.descricao}</p>
                </div>
                <div class="card-footer">
                    ${s(t)}
                    ${c(t,e)}
                </div>
            </div>
        </div>
        `
    }), "doações.html"), o("/_dados/empregos.json", "jobs-grid", (function(t, e, a) {
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${t.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${t.localizacao}</h6>
                    <p class="card-text">${t.descricao}</p>
                </div>
                <div class="card-footer">
                    ${s(t)}
                    ${c(t,e)}
                </div>
            </div>
        </div>
        `
    }), "empregos.html"), o("/_dados/servicos.json", "services-grid", (function(t, e) {
        const a = t.logo_empresa ? `<div class="service-card-logo"><img src="${t.logo_empresa}" alt="Logo"></div>` : "";
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                ${t.valor_servico?`<div class="card-price">${t.valor_servico}</div>`:""}
                <div class="card-body">
                    ${a}
                    <h5 class="card-title">${t.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${t.localizacao}</h6>
                    <p class="card-text">${t.descricao}</p>
                </div>
                <div class="card-footer">
                    ${s(t)}
                    ${c(t,e)}
                </div>
            </div>
        </div>
        `
    }), "serviços.html"), o("/_dados/habitacao.json", "housing-grid", (function(t, e) {
        return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                ${t.imagens&&t.imagens.length>0&&t.imagens[0].imagem_url?`<img src="${t.imagens[0].imagem_url}" class="card-img-top" alt="${t.titulo}" loading="lazy">`:`<div class="image-placeholder">${t.titulo}</div>`}
                ${t.valor_anuncio?`<div class="card-price">${t.valor_anuncio}</div>`:""}
                <div class="card-body">
                    <h5 class="card-title">${t.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${t.localizacao}</h6>
                    <p class="card-text">${t.descricao}</p>
                </div>
                <div class="card-footer">
                    ${s(t)}
                    ${c(t,e)}
                </div>
            </div>
        </div>
        `
    }), "habitação.html"), o("/_dados/blog.json", "posts-section", (function(t) {
        const e = new Date(t.date).toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        return `
            <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${t.category}">
                <div class="blog-post-card">
                    <img class="card-img-top" src="${t.image}" alt="${t.title}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${t.title}</h5>
                        <p class="text-muted small">Publicado em: ${e}</p>
                        <div class="summary-content">
                            <p class="card-text">${t.summary}</p>
                            <a href="#" class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</a>
                        </div>
                        <div class="full-content">
                            <p>${t.body.replace(/\n/g,"</p><p>")}</p>
                        </div>
                    </div>
                    <button class="btn btn-light close-btn" aria-label="Fechar">&times;</button>
                </div>
            </div>
        `
    }), "blog.html"), o("/_dados/galeria.json", "gallery-section", (function(t) {
        const e = new Date(t.date).toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        return `
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="gallery-item">
                    <img src="${t.image}" alt="${t.title}" loading="lazy">
                    <div class="caption">
                        <h5>${t.title}</h5>
                        <p>${t.caption}</p>
                        <small class="text-white-50">${e}</small>
                    </div>
                </div>
            </div>
        `
    }), "blog.html");

    // --- LÓGICA UNIFICADA PARA O BLOG E GALERIA ---
    if (document.querySelector('.page-header-blog')) {
        const blogContent = document.getElementById('blog-content');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        const blogNavLinks = document.querySelectorAll('.blog-nav .nav-link');

        // Função para fechar qualquer post expandido
        const closeExpandedPost = () => {
            const currentlyExpanded = document.querySelector('.blog-post-card.expanded');
            if (currentlyExpanded) {
                currentlyExpanded.classList.remove('expanded');
            }
            document.body.classList.remove('modal-open');
        };

        // Lógica para ABRIR e FECHAR posts
        blogContent.addEventListener('click', function(event) {
            const readMoreBtn = event.target.closest('.read-more-btn');
            const closeBtn = event.target.closest('.close-btn');

            if (readMoreBtn) {
                event.preventDefault();
                const card = readMoreBtn.closest('.blog-post-card');
                closeExpandedPost(); // Fecha outros antes de abrir um novo
                card.classList.add('expanded');
                document.body.classList.add('modal-open');
            }

            if (closeBtn) {
                event.preventDefault();
                closeExpandedPost();
            }
        });

        // Lógica para FILTRAR categorias
        blogNavLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                closeExpandedPost(); // Garante que nenhum post esteja aberto ao mudar de categoria

                blogNavLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-target');

                if (category === 'galeria') {
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    postsSection.style.display = 'flex';
                    gallerySection.style.display = 'none';
                    document.querySelectorAll('.blog-post-item').forEach(post => {
                        // Importante: Usamos classes para controlar visibilidade em vez de display direto para evitar conflitos
                        if (category === 'all' || post.dataset.category === category) {
                            post.classList.remove('d-none');
                        } else {
                            post.classList.add('d-none');
                        }
                    });
                }
            });
        });
    }


    async function() {
        const t = await n("/_dados/doacoes.json"),
            e = await n("/_dados/empregos.json"),
            a = await n("/_dados/servicos.json"),
            o = t.length,
            s = e.length,
            c = o + s + a.length;
        document.getElementById("contador-doacoes").textContent = `${o}+`, document.getElementById("contador-empregos").textContent = `${s}+`, document.getElementById("contador-total").textContent = `${c}+`
    }(), document.body.classList.contains("home") && async function() {
        const t = await n("/_dados/homepage.json");
        t && (document.getElementById("hero-title").textContent = t.hero_title || "Bem-vindo ao Portugal Apoia", document.getElementById("hero-subtitle").textContent = t.hero_subtitle || "A sua plataforma de apoio comunitário para encontrar e oferecer ajuda.", document.getElementById("doacoes-text").textContent = t.impact_counters.doacoes_text || "Doações Realizadas", document.getElementById("empregos-text").textContent = t.impact_counters.emprego_text || "Empregos Publicados", document.getElementById("total-text").textContent = t.impact_counters.total_text || "Total de Anúncios")
    }(),
    function() {
        const t = document.getElementById("searchButton"),
            e = document.getElementById("clearButton"),
            a = document.getElementById("searchInput"),
            n = document.getElementById("locationInput"),
            o = document.getElementById("no-results"),
            s = document.querySelector('.row[id$="-grid"]')?.id,
            c = s ? document.getElementById(s) : null;
        if (!c) return;
        function d() {
            const t = a.value.toLowerCase(),
                e = n.value.toLowerCase(),
                s = c.querySelectorAll(".col-md-4");
            let d = !1;
            s.forEach((a => {
                const n = a.querySelector(".card-title").textContent.toLowerCase(),
                    o = a.querySelector(".card-subtitle").textContent.toLowerCase(),
                    s = a.querySelector(".card-text").textContent.toLowerCase(),
                    c = n.includes(t) || s.includes(t),
                    l = o.includes(e);
                c && l ? (a.style.display = "", d = !0) : a.style.display = "none"
            })), o.style.display = d ? "none" : "block"
        }
        t && t.addEventListener("click", d), e && e.addEventListener("click", (function() {
            a.value = "", n.value = "", d()
        }))
    }();
}));