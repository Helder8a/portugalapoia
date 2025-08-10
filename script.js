document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.onload = () => { preloader.classList.add("hidden"); };
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
        scrollTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // --- LÓGICA DEL MODO OSCURO ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Función para aplicar el tema
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            if(themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            if(themeToggle) themeToggle.checked = false;
        }
    };

    // 1. Revisa si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme');
    // 2. Revisa la preferencia del sistema operativo del usuario
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme); // Aplica el tema guardado
    } else if (prefersDark) {
        applyTheme('dark'); // Aplica el tema del sistema si no hay nada guardado
    }

    // 3. Añade el listener para el interruptor
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme); // Guarda la nueva preferencia
            applyTheme(newTheme);
        });
    }
});