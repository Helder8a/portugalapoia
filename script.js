document.addEventListener("DOMContentLoaded", () => {
    // --- CÓDIGO DEL PRELOADER, SCROLL Y TEMA OSCURO ---
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
    
    // ... tu otro código como el de cookies puede ir aquí ...


    // --- NUEVO CÓDIGO PARA CARGAR CONTENIDO DESDE EL CMS ---
    
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

    // --- Funciones de renderizado para cada sección ---

    function renderEmprego(vaga) {
        return `
        <div class="col-lg-4 col-md-6 mb-4 job-item">
            <div class="card h-100 shadow-sm" id="${vaga.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${vaga.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${vaga.localizacao}</h6>
                    <p class="card-text flex-grow-1">${vaga.descricao}</p>
                    <p class="card-text small mt-auto"><strong>Contacto:</strong> <a href="${vaga.link_contato}">${vaga.contato}</a></p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <small class="text-muted">ID: ${vaga.id}</small>
                </div>
            </div>
        </div>`;
    }

    function renderDoacao(pedido) {
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '';

        return `
        <div class="col-lg-4 col-md-6 mb-4 announcement-item">
            <div class="card h-100 shadow-sm" id="${pedido.id}">
                ${badgeUrgente}
                ${imagemHTML}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${pedido.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6>
                    <p class="card-text flex-grow-1">${pedido.descricao}</p>
                    <a href="${pedido.link_contato}" class="btn btn-primary mt-auto">Contactar</a>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <small class="text-muted">ID: ${pedido.id}</small>
                </div>
            </div>
        </div>`;
    }
    
    function renderServico(servico) {
        return renderEmprego(servico);
    }

    function renderHabitacao(anuncio) {
        return renderEmprego(anuncio);
    }

    // --- Llamadas para cargar el contenido en cada página ---
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas');
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios');
});