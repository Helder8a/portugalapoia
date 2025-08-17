// --- CÓDIGO COMPLETO Y CORREGIDO PARA script.js ---
document.addEventListener("DOMContentLoaded", () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO ---
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

    // --- FUNCIÓN GENÉRICA PARA CARGAR DATOS JSON ---
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
            // Ordenar por fecha de publicación, del más reciente al más antiguo
            items.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));

            items.forEach(item => {
                const itemHTML = renderFunction(item);
                if (itemHTML) {
                    container.innerHTML += itemHTML;
                }
            });
        } catch (error) {
            console.error(`Erro ao carregar conteúdo de ${jsonPath}:`, error);
            container.innerHTML = `<p class="col-12 text-center">Não foi possível carregar o conteúdo neste momento. Tente mais tarde.</p>`;
        }
    }

    // --- FUNCIÓN PARA FORMATEAR FECHAS ---
    function formatarDatas(item) {
        let dataHTML = '';
        if (item.data_publicacao) {
            const dataPublicacao = new Date(item.data_publicacao);
            const dataVencimento = new Date(item.data_vencimento);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Para comparar solo fechas

            const dataFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

            let classeVencido = '';
            let textoVencido = '';

            if (dataVencimento < hoje) {
                classeVencido = 'vencido';
                textoVencido = `(Vencido)`;
            }

            dataHTML = `<small class="text-muted">Publicado em: ${dataFormatada}</small>
                        <small class="text-muted ml-2 ${classeVencido}">${textoVencido}</small>`;
        }
        return dataHTML;
    }

    // --- FUNCIONES PARA RENDERIZAR CADA TIPO DE ANUNCIO (ACTUALIZADAS) ---

    function renderEmprego(item) {
        let contatoHTML = '';
        if (item.contato) {
            const numeroLimpo = item.contato.replace(/[\s+()-]/g, '');
            contatoHTML += `<p class="card-text small mb-1"><strong>Tel:</strong> <a href="tel:${numeroLimpo}">${item.contato}</a></p>`;
        }
        if (item.link_contato && item.link_contato.includes('@')) {
            const emailLink = item.link_contato.startsWith('mailto:') ? item.link_contato : `mailto:${item.link_contato}`;
            contatoHTML += `<p class="card-text small"><strong>Email:</strong> <a href="${emailLink}">${item.link_contato.replace('mailto:', '')}</a></p>`;
        }

        const dataHTML = formatarDatas(item);

        return `
        <div class="col-lg-4 col-md-6 mb-4 job-item">
            <div class="card h-100 shadow-sm" id="${item.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                    <p class="card-text flex-grow-1">${item.descricao}</p>
                    <div class="mt-auto">${contatoHTML}</div>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div>${dataHTML}</div>
                    <small class="text-muted">ID: ${item.id}</small>
                </div>
            </div>
        </div>`;
    }

    function renderDoacao(pedido) {
        const badgeUrgente = pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 10px; right: 10px; z-index: 2;">Urgente</span>' : '';
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" class="d-block w-100" alt="${pedido.titulo}" style="height: 200px; object-fit: cover;">` : '';
        let contatoHTML = '';