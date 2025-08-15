document.addEventListener("DOMContentLoaded", () => {
    // ... (todo el código de preloader, scroll, tema oscuro se mantiene igual) ...
    let preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => { preloader.classList.add("hidden"); });
        setTimeout(() => { preloader.classList.add("hidden"); }, 1500);
    }
    let scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        };
        scrollTopBtn.addEventListener("click", e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
    let themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        let body = document.body;
        const setTheme = (theme) => {
            if (theme === "dark") {
                body.classList.add("dark-theme");
                themeToggle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                themeToggle.checked = false;
            }
        };
        let savedTheme = localStorage.getItem("theme");
        let prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (savedTheme) { setTheme(savedTheme); } else if (prefersDark) { setTheme("dark"); }
        themeToggle.addEventListener("change", () => {
            let newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        });
    }

    // --- CÓDIGO PARA CARGAR CONTENIDO DESDE EL CMS ---
    async function carregarConteudo(jsonPath, containerId, renderFunction, dataKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`Erro ao carregar o ficheiro: ${response.statusText}`);
            const data = await response.json();
            const items = data[dataKey] || [];
            if (items.length === 0) {
                container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há anúncios publicados nesta secção.</p>`;
                return;
            }
            container.innerHTML = '';
            items.forEach(item => {
                container.innerHTML += renderFunction(item);
            });
        } catch (error) {
            console.error(`Erro ao carregar conteúdo de ${jsonPath}:`, error);
            container.innerHTML = `<p class="col-12 text-center">Não foi possível carregar o conteúdo neste momento. Tente mais tarde.</p>`;
        }
    }

    // --- Funciones de renderizado ---
    function renderEmprego(item) {
        let contatoHTML = '';
        if (item.contato) { contatoHTML += `<strong>Tel:</strong> ${item.contato}<br>`; }
        if (item.link_contato) {
            const emailText = item.link_contato.replace('mailto:', '');
            contatoHTML += `<strong>Email:</strong> <a href="${item.link_contato}">${emailText}</a>`;
        }
        return `
        <div class="col-lg-4 col-md-6 mb-4 job-item">
            <div class="card h-100 shadow-sm" id="${item.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                    <p class="card-text flex-grow-1">${item.descricao}</p>
                    <p class="card-text small mt-auto">${contatoHTML}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <small class="text-muted">ID: ${item.id}</small>
                </div>
            </div>
        </div>`;
    }

    function renderDoacao(pedido) {
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '';
        let contatoHTML = '';
        if (pedido.contato) { contatoHTML = `<p class="card-text small"><strong>Tel:</strong> ${pedido.contato}</p>`; }
        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-item">
            <div class="card h-100 shadow-sm" id="${pedido.id}">
                ${badgeUrgente}
                ${imagemHTML}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${pedido.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6>
                    <p class="card-text flex-grow-1">${pedido.descricao}</p>
                    <div class="mt-auto">
                        ${contatoHTML}
                        <a href="${pedido.link_contato}" class="btn btn-primary btn-block">Contactar por Email</a>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <small class="text-muted">ID: ${pedido.id}</small>
                </div>
            </div>
        </div>`;
    }

    // --- FUNCIÓN CORREGIDA PARA SERVICIOS CON LOGO Y CONTACTO DE ICONOS ---
    function renderServico(item) {
        const logoHTML = item.logo_empresa ? `
        <div class="service-card-logo">
            <img src="${item.logo_empresa}" alt="Logo de ${item.titulo}">
        </div>` : '';

        const priceHTML = item.valor_servico ? `
        <div class="card-price">${item.valor_servico}</div>` : '';

        let contactHTML = '';
        if (item.contato) {
            contactHTML += `<p class="card-text small mb-1"><strong>Tel:</strong> ${item.contato}</p>`;
        }
        if (item.link_contato) {
            const emailText = item.link_contato.replace('mailto:', '');
            contactHTML += `<p class="card-text small mb-1"><strong>Email:</strong> <a href="${item.link_contato}">${emailText}</a></p>`;
        }

        let contactIconsHTML = '';
        if (item.contato) {
            const cleanedPhone = item.contato.replace(/[\s+()-]/g, '');
            contactIconsHTML += `<a href="https://wa.me/${cleanedPhone}" class="contact-icon whatsapp-icon" target="_blank" aria-label="Contactar por WhatsApp"><i class="fab fa-whatsapp"></i></a>`;
        }
        if (item.link_contato) {
            contactIconsHTML += `<a href="${item.link_contato}" class="contact-icon email-icon" aria-label="Contactar por Email"><i class="fas fa-envelope"></i></a>`;
        }

        return `
    <div class="col-lg-4 col-md-6 mb-4 service-item">
        <div class="card h-100 shadow-sm" id="${item.id}">
            ${logoHTML}
            ${priceHTML}
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.titulo}</h5>
                <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                <p class="card-text flex-grow-1">${item.descricao}</p>
                <div class="mt-auto">
                    ${contactHTML}
                    <div class="card-contact-icons">
                        ${contactIconsHTML}
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <small class="text-muted">ID: ${item.id}</small>
            </div>
        </div>
    </div>`;
    }

    // --- Llamadas para cargar el contenido en cada página ---
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas');
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderEmprego, 'anuncios');
});