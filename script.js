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

    const banner = document.getElementById('cpra-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    // ... (tu otro código de cookies puede ir aquí si lo tienes)


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
                <div class="card-body d-flex flex-