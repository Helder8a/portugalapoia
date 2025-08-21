document.addEventListener("DOMContentLoaded", async () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => preloader.classList.add("hidden"));
        setTimeout(() => preloader.classList.add("hidden"), 1500);
    }

    const scrollTopBtn = document.getElementById("scrollTopBtn");
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
        if (savedTheme) { setTheme(savedTheme); } else if (prefersDark) { setTheme("dark"); }
        themeToggle.addEventListener("change", () => {
            const newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        });
    }

    // --- LÓGICA DE DATOS ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return [];
            const data = await response.json();
            const key = Object.keys(data)[0];
            return Array.isArray(data[key]) ? data[key] : [];
        } catch (error) {
            console.error(`Erro ao processar JSON de ${url}:`, error);
            return [];
        }
    }

    async function carregarConteudo(jsonPath, containerId, renderFunction, pageName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const items = await fetchJson(jsonPath);
        if (!items || items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há anúncios publicados nesta secção.</p>`;
            return;
        }
        items.sort((a, b) => new Date(b.data_publicacao || 0) - new Date(a.data_publicacao || 0));
        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
    }

    // --- FUNCIONES DE RENDERIZADO MEJORADAS ---
    function formatarDatas(item) {
        if (!item || !item.data_publicacao) {
            return `<div class="date-info">ID: ${item.id || 'N/A'}</div>`;
        }
        const dataPublicacao = new Date(item.data_publicacao);
        const pubFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        if (!item.data_vencimento) {
            return `<div class="date-info">Publicado: ${pubFormatada}</div>`;
        }

        const dataVencimento = new Date(item.data_vencimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const isVencido = dataVencimento < hoje;
        const classeVencido = isVencido ? 'vencido' : '';
        const textoVencido = isVencido ? ' (Vencido)' : '';

        return `<div class="date-info ${classeVencido}">Publicado: ${pubFormatada}${textoVencido}</div>`;
    }

    function renderEmprego(item, pageName) {
        const linkAnuncio = `empregos.html#${item.id}`;
        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="announcement-card">
                <div class="card-img-container">
                    <div class="image-placeholder">EMPREGO</div>
                    <span class="card-category-badge">Emprego</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.titulo || 'Sem Título'}</h5>
                    <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao || 'N/A'}</h6>
                    <p class="card-description">${item.descricao || 'Sem Descrição'}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(item)}
                    <a href="${linkAnuncio}" class="btn btn-sm btn-outline-primary">Ver Mais</a>
                </div>
            </div>
        </div>`;
    }

    function renderDoacao(pedido, pageName) {
        const linkAnuncio = `doações.html#${pedido.id}`;
        const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" alt="${pedido.titulo}">` : '<div class="image-placeholder">DOAÇÃO</div>';
        
        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="announcement-card">
                <div class="card-img-container">
                    ${imagemHTML}
                    <span class="card-category-badge">Doação</span>
                    ${pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 12px; left: 12px;">Urgente</span>' : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${pedido.titulo}</h5>
                    <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6>
                    <p class="card-description">${pedido.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(pedido)}
                    <a href="${linkAnuncio}" class="btn btn-sm btn-primary">Ver Mais</a>
                </div>
            </div>
        </div>`;
    }

    function renderServico(item, pageName) {
        const linkAnuncio = `serviços.html#${item.id}`;
        const imagemHTML = item.logo_empresa ? `<img loading="lazy" src="${item.logo_empresa}" alt="Logo">` : '<div class="image-placeholder">SERVIÇO</div>';

        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="announcement-card">
                <div class="card-img-container">
                    ${imagemHTML}
                    <span class="card-category-badge">Serviço</span>
                    ${item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.titulo}</h5>
                    <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                    <p class="card-description">${item.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(item)}
                    <a href="${linkAnuncio}" class="btn btn-sm btn-outline-primary">Ver Mais</a>
                </div>
            </div>
        </div>`;
    }

    function renderHabitacao(anuncio, pageName) {
        const linkAnuncio = `habitação.html#${anuncio.id}`;
        let imagemHTML = '<div class="image-placeholder">HABITAÇÃO</div>';
        if (anuncio.imagens && anuncio.imagens.length > 0) {
            imagemHTML = `<img loading="lazy" src="${anuncio.imagens[0].imagem_url || anuncio.imagens[0]}" alt="${anuncio.titulo}">`;
        }

        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="announcement-card">
                <div class="card-img-container">
                    ${imagemHTML}
                    <span class="card-category-badge">Habitação</span>
                    ${anuncio.valor_anuncio ? `<div class="card-price">${anuncio.valor_anuncio}</div>` : ''}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${anuncio.titulo}</h5>
                    <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${anuncio.localizacao}</h6>
                    <p class="card-description">${anuncio.descricao}</p>
                </div>
                <div class="card-footer">
                    ${formatarDatas(anuncio)}
                    <a href="${linkAnuncio}" class="btn btn-sm btn-outline-primary">Ver Mais</a>
                </div>
            </div>
        </div>`;
    }

    // --- FUNCIONES PARA LA PÁGINA PRINCIPAL ---
    async function loadHomepageContent() {
        try {
            const response = await fetch('/_dados/homepage.json?t=' + new Date().getTime());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) heroTitle.textContent = data.hero_title;
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle;
            const doacoesText = document.getElementById('doacoes-text');
            if (doacoesText) doacoesText.textContent = data.impact_counters.doacoes_text;
            const empregosText = document.getElementById('empregos-text');
            if (empregosText) empregosText.textContent = data.impact_counters.emprego_text;
            const totalText = document.getElementById('total-text');
            if (totalText) totalText.textContent = data.impact_counters.total_text;
        } catch (error) {
            console.error("Erro ao carregar o conteúdo da página principal:", error);
        }
    }
    
    async function updateImpactCounters() {
        const doacoes = await fetchJson('/_dados/doacoes.json');
        const empregos = await fetchJson('/_dados/empregos.json');
        const servicos = await fetchJson('/_dados/servicos.json');
        const habitacao = await fetchJson('/_dados/habitacao.json');
        document.getElementById('contador-doacoes').textContent = `${doacoes.length}+`;
        document.getElementById('contador-empregos').textContent = `${empregos.length}+`;
        document.getElementById('contador-total').textContent = `${doacoes.length + empregos.length + servicos.length + habitacao.length}+`;
    }

    async function loadLatestAnnouncements() {
        const container = document.getElementById('latest-announcements-grid');
        if (!container) return;
        const doacoes = (await fetchJson('/_dados/doacoes.json')).map(item => ({ ...item, type: 'doacao' }));
        const empregos = (await fetchJson('/_dados/empregos.json')).map(item => ({ ...item, type: 'emprego' }));
        const servicos = (await fetchJson('/_dados/servicos.json')).map(item => ({ ...item, type: 'servico' }));
        const habitacao = (await fetchJson('/_dados/habitacao.json')).map(item => ({ ...item, type: 'habitacao' }));
        const allAnnouncements = [...doacoes, ...empregos, ...servicos, ...habitacao];
        allAnnouncements.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
        const latest = allAnnouncements.slice(0, 6);
        if (latest.length === 0) {
            container.innerHTML = '<p class="col-12 text-center lead text-muted">Ainda não há anúncios publicados.</p>';
            return;
        }
        const htmlContent = latest.map(item => {
            switch (item.type) {
                case 'doacao': return renderDoacao(item, 'doações.html');
                case 'emprego': return renderEmprego(item, 'empregos.html');
                case 'servico': return renderServico(item, 'serviços.html');
                case 'habitacao': return renderHabitacao(item, 'habitação.html');
                default: return '';
            }
        }).join('');
        container.innerHTML = htmlContent;
    }

    // --- CARGA INICIAL Y LLAMADAS A FUNCIONES ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');
    
    if (document.body.classList.contains('home')) {
        updateImpactCounters();
        loadHomepageContent();
        loadLatestAnnouncements();
    }

    // --- LÓGICA DO BUSCADOR ---
    // (Tu código del buscador se mantiene aquí)
});

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('contextmenu', (e) => e.preventDefault());
        image.addEventListener('dragstart', (e) => e.preventDefault());
    });
});