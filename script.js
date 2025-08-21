document.addEventListener("DOMContentLoaded", async () => {
    // --- GESTORES GENERALES (PRELOADER, SCROLL, TEMA OSCURO) ---
    // (Tu código existente para preloader, scroll y tema oscuro se mantiene aquí)

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

    // --- FUNÇÕES DE RENDERIZAÇÃO (Tus funciones renderEmprego, renderDoacao, etc. se mantienen aquí) ---

    // (renderEmprego, renderDoacao, renderServico, renderHabitacao, etc.)
    // ...

    // --- FUNCIÓN PARA CONTENIDO DE LA PÁGINA PRINCIPAL (ya la teníamos) ---
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

    // --- FUNCIÓN PARA CONTADORES DE IMPACTO (ya la teníamos) ---
    async function updateImpactCounters() {
        const doacoes = await fetchJson('/_dados/doacoes.json');
        const empregos = await fetchJson('/_dados/empregos.json');
        const servicos = await fetchJson('/_dados/servicos.json');
        const habitacao = await fetchJson('/_dados/habitacao.json');
        document.getElementById('contador-doacoes').textContent = `${doacoes.length}+`;
        document.getElementById('contador-empregos').textContent = `${empregos.length}+`;
        document.getElementById('contador-total').textContent = `${doacoes.length + empregos.length + servicos.length + habitacao.length}+`;
    }

    // --- NUEVA FUNCIÓN PARA CARGAR LOS ÚLTIMOS ANÚNCIOS ---
    async function loadLatestAnnouncements() {
        const container = document.getElementById('latest-announcements-grid');
        if (!container) return;

        // 1. Cargar datos de todas las categorías
        const doacoes = (await fetchJson('/_dados/doacoes.json')).map(item => ({ ...item, type: 'doacao' }));
        const empregos = (await fetchJson('/_dados/empregos.json')).map(item => ({ ...item, type: 'emprego' }));
        const servicos = (await fetchJson('/_dados/servicos.json')).map(item => ({ ...item, type: 'servico' }));
        const habitacao = (await fetchJson('/_dados/habitacao.json')).map(item => ({ ...item, type: 'habitacao' }));

        // 2. Juntar todos los anuncios en un solo array
        const allAnnouncements = [...doacoes, ...empregos, ...servicos, ...habitacao];

        // 3. Ordenar por fecha de publicación (los más nuevos primero)
        allAnnouncements.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));

        // 4. Coger solo los 6 más recientes
        const latest = allAnnouncements.slice(0, 6);

        if (latest.length === 0) {
            container.innerHTML = '<p class="col-12 text-center lead text-muted">Ainda não há anúncios publicados.</p>';
            return;
        }

        // 5. Renderizar cada anuncio con su función correspondiente
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

    // Llamadas específicas para la página principal
    if (document.body.classList.contains('home')) {
        updateImpactCounters();
        loadHomepageContent();
        loadLatestAnnouncements(); // <-- Llamamos a la nueva función aquí
    }

    // --- LÓGICA DO BUSCADOR ---
    // (Tu código del buscador se mantiene aquí)
});

// Nota: Asegúrate de tener todas tus funciones de renderizado (renderDoacao, renderEmprego, etc.) en este archivo para que la nueva función `loadLatestAnnouncements` pueda llamarlas.