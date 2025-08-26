// --- CÓDIGO FINAL Y CORRECTO para script.js ---

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

    // --- LÓGICA DE DATOS (FUNCIÓN GLOBAL) ---
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
    
    // Hacemos que carregarConteudo sea accesible globalmente
    window.carregarConteudo = async function(jsonPath, containerId, renderFunction, pageName) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = await fetchJson(jsonPath);

        if (!items || items.length === 0) {
            if (containerId !== 'gallery-section') {
                container.innerHTML = `<p class="col-12 text-center lead text-muted mt-5">De momento, não há publicações nesta secção.</p>`;
            }
            return;
        }

        items.sort((a, b) => new Date(b.data_publicacao || b.date || 0) - new Date(a.data_publicacao || a.date || 0));

        const htmlContent = items.map(item => renderFunction(item, pageName, item.id)).join('');
        container.innerHTML = htmlContent;
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function formatarDatas(item) {
        if (!item || !item.data_publicacao || !item.data_vencimento) {
            return `<div class="date-info">ID: ${item.id || 'N/A'}</div>`;
        }
        const dataPublicacao = new Date(item.data_publicacao);
        const dataVencimento = new Date(item.data_vencimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const pubFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const vencFormatada = dataVencimento.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const isVencido = dataVencimento < hoje;
        const classeVencido = isVencido ? 'vencido' : '';
        const textoVencido = isVencido ? '(Vencido)' : '';
        return `<div class="date-info">Publicado: ${pubFormatada} <br> <span class="${classeVencido}">Vencimento: ${vencFormatada} ${textoVencido}</span></div>`;
    }

    function renderShareButtons(item, page) {
        const url = `https://portugalapoia.com/${page}#${item.id}`;
        const text = `Vi este anúncio em PortugalApoia e lembrei-me de ti: "${item.titulo}"`;
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        return `<div class="share-buttons"><small class="share-label">Partilhar:</small><a href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no WhatsApp" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" title="Partilhar no Facebook" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a></div>`;
    }
    
    function renderEmprego(item, pageName, idAnuncio) { /* ... (código sin cambios) ... */ }
    function renderDoacao(pedido, pageName) { /* ... (código sin cambios) ... */ }
    function renderServico(item, pageName) { /* ... (código sin cambios) ... */ }
    function renderHabitacao(anuncio, pageName) { /* ... (código sin cambios) ... */ }

    // --- FUNCIONALIDADES GENERALES ---
    async function loadHomepageContent() { /* ... (código sin cambios) ... */ }
    async function updateImpactCounters() { /* ... (código sin cambios) ... */ }
    function setupSearch() { /* ... (código sin cambios) ... */ }

    // --- CARGA INICIAL Y LLAMADAS A FUNCIONES (EXCLUYENDO EL BLOG) ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');

    updateImpactCounters();
    if (document.body.classList.contains('home')) {
        loadHomepageContent();
    }
    setupSearch();
});

document.addEventListener("DOMContentLoaded", function() {
  const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback
    let active = false;
    const lazyLoad = function() {
        if (active === false) {
            active = true;
            setTimeout(function() {
                lazyImages.forEach(function(lazyImage) {
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazy");
                        lazyImages = lazyImages.filter(function(image) { return image !== lazyImage; });
                    }
                });
                active = false;
            }, 200);
        }
    };
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
  }
});