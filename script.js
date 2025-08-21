document.addEventListener("DOMContentLoaded", async () => {
    console.log("PortugalApoia Script: Iniciado e DOM carregado.");

    // --- GESTOR DE PRELOADER, SCROLL Y TEMA OSCURO ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => preloader.classList.add("hidden"));
        setTimeout(() => preloader.classList.add("hidden"), 3000);
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
            body.classList.toggle("dark-theme", theme === "dark");
            themeToggle.checked = theme === "dark";
        };
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(savedTheme || (prefersDark ? "dark" : "light"));
        themeToggle.addEventListener("change", () => {
            const newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        });
    }

    // --- LÓGICA DE DATOS PRINCIPAL ---
    async function fetchJson(url) {
        try {
            console.log(`A procurar dados em: ${url}`);
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) {
                console.error(`Erro ao buscar ${url}: Resposta não OK (${response.status})`);
                return null;
            }
            const data = await response.json();
            console.log("Dados JSON recebidos com sucesso:", data);
            const key = Object.keys(data)[0];
            if (key && Array.isArray(data[key])) {
                console.log(`Encontrados ${data[key].length} itens na chave '${key}'.`);
                return data[key];
            }
            console.warn(`A estrutura do JSON de ${url} não é a esperada.`);
            return null;
        } catch (error) {
            console.error(`Erro fatal ao processar JSON de ${url}:`, error);
            return null;
        }
    }

    async function carregarConteudo(jsonPath, containerId, renderFunction) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`O contêiner com ID #${containerId} não foi encontrado.`);
            return;
        }

        const items = await fetchJson(jsonPath);

        if (!items || items.length === 0) {
            container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            return;
        }
        
        items.sort((a, b) => new Date(