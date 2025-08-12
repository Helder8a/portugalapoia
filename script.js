document.addEventListener("DOMContentLoaded", () => {
    // --- Lógica del Preloader ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        // Oculta el preloader cuando todos los recursos de la página (imágenes, etc.) han cargado.
        window.addEventListener("load", () => {
            preloader.classList.add("hidden");
        });
    }

    // --- Lógica del Botón de Volver Arriba (Scroll Top) ---
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
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- Lógica del Selector de Tema (Claro/Oscuro) ---
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            if (themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove("dark-theme");
            if (themeToggle) themeToggle.checked = false;
        }
    };

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Aplica el tema guardado o el preferido por el sistema
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme("dark");
    }

    // Listener para cambiar de tema
    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            let newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            applyTheme(newTheme);
        });
    }
});

// --- Lógica de Registro del Service Worker para PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}