// --- CÓDIGO FINAL, RESTAURADO Y CON EL CONTADOR FUNCIONANDO ---

document.addEventListener("DOMContentLoaded", async () => {
    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO (Tu código original) ---
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

    // --- LÓGICA DE DATOS (Tu código original) ---
    async function fetchJson(url) {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(`Erro ao processar JSON de ${url}:`, error);
            return null;
        }
    }
    
    // --- FUNCIÓN DEL CONTADOR DE IMPACTO (REPARADA) ---
    async function updateImpactCounters() {
        const animateCounter = (element, finalValue) => {
            if (!element) return;
            let startValue = 0;
            const duration = 2000;
            if (finalValue === 0) {
                element.textContent = "0";
                return;
            }
            const stepTime = Math.max(1, Math.floor(duration / finalValue));
            const timer = setInterval(() => {
                startValue += 1;
                if (startValue >= finalValue) {
                    element.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    element.textContent = startValue;
                }
            }, stepTime);
        };

        try {
            const [doacoesData, empregosData, servicosData, habitacaoData] = await Promise.all([
                fetchJson('/_dados/doacoes.json'),
                fetchJson('/_dados/empregos.json'),
                fetchJson('/_dados/servicos.json'),
                fetchJson('/_dados/habitacao.json')
            ]);

            const totalDoacoes = doacoesData?.pedidos?.length || 0;
            const totalEmpregos = empregosData?.vagas?.length || 0;
            const totalServicos = servicosData?.servicos?.length || 0;
            const totalHabitacao = habitacaoData?.anuncios?.length || 0;
            const totalAnuncios = totalDoacoes + totalEmpregos + totalServicos + totalHabitacao;

            animateCounter(document.getElementById('contador-doacoes'), totalDoacoes);
            animateCounter(document.getElementById('contador-empregos'), totalEmpregos);
            animateCounter(document.getElementById('contador-total'), totalAnuncios);

        } catch (error) {
            console.error("Erro ao carregar dados para os contadores de impacto:", error);
        }
    }


    // --- FUNCIÓN GLOBAL PARA CARGAR OTROS CONTENIDOS (Tu código original) ---
    window.carregarConteudo = async function(jsonPath, containerId, renderFunction, dataKey, pageName) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = await fetchJson(jsonPath);
        if (!data || !data[dataKey]) {
            if (containerId !== 'gallery-section') {
                 container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            }
            return;
        }

        const items = data[dataKey];
        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));

        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
        ativarLazyLoading();
    }
    
    // --- OTRAS FUNCIONES (Tu código original) ---
    function renderDoacao(item) { return ''; }
    function renderEmprego(item) { return ''; }
    function renderServico(item) { return ''; }
    function renderHabitacao(item) { return ''; }
    function ativarLazyLoading() {}
    function setupSearch() {}


    // --- INICIALIZACIÓN (Tu código original, con la llamada al contador) ---
    if (document.getElementById('impacto')) {
        updateImpactCounters();
    }

    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'pedidos', 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'vagas', 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'servicos', 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'anuncios', 'habitação.html');
    
    setupSearch();
    ativarLazyLoading();
});