document.addEventListener("DOMContentLoaded", () => {
    // --- CÓDIGO PARA PRELOADER, SCROLL Y TEMA OSCURO ---
    let preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.classList.add("hidden");
        });
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
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    let themeToggle = document.getElementById("theme-toggle");
    let body = document.body;
    const setTheme = (theme) => {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            if (themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove("dark-theme");
            if (themeToggle) themeToggle.checked = false;
        }
    };

    let savedTheme = localStorage.getItem("theme");
    let prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme("dark");
    }

    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            let newTheme = themeToggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        });
    }

    // --- CÓDIGO CORREGIDO Y COMPLETO PARA LAS COOKIES ---
    const banner = document.getElementById('cpra-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const manageBtn = document.getElementById('manage-prefs');
    const modalOverlay = document.getElementById('cpra-modal-overlay');
    const closeModalBtn = document.getElementById('cpra-close-button');
    const savePrefsBtn = document.getElementById('save-prefs');
    const COOKIE_PREFS_KEY = 'cookie_preferences';

    // Función para obtener las preferencias (si existen)
    const getCookiePreferences = () => {
        const prefs = localStorage.getItem(COOKIE_PREFS_KEY);
        return prefs ? JSON.parse(prefs) : null;
    };

    // Función para guardar las preferencias
    const setCookiePreferences = (prefs) => {
        localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(prefs));
    };

    // Mostrar el banner solo si no hay preferencias guardadas
    if (!getCookiePreferences() && banner) {
        banner.style.display = 'flex';
    }

    // Acción para el botón de Aceptar
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            const prefs = {
                accepted: true,
                timestamp: new Date().toISOString(),
                categories: { essential: true, analytics: true, marketing: true }
            };
            setCookiePreferences(prefs);
            if (banner) banner.style.display = 'none';
        });
    }

    // Acción para abrir el modal de gestión
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.add('visible');
            const currentPrefs = getCookiePreferences();
            if (currentPrefs) {
                const analyticsToggle = document.getElementById('analytics-toggle');
                const marketingToggle = document.getElementById('marketing-toggle');
                if (analyticsToggle) analyticsToggle.checked = currentPrefs.categories.analytics;
                if (marketingToggle) marketingToggle.checked = currentPrefs.categories.marketing;
            }
        });
    }

    // Acción para cerrar el modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('visible');
        });
    }

    // Acción para guardar las preferencias desde el modal
    if (savePrefsBtn) {
        savePrefsBtn.addEventListener('click', () => {
            const analyticsToggle = document.getElementById('analytics-toggle');
            const marketingToggle = document.getElementById('marketing-toggle');
            const prefs = {
                accepted: true,
                timestamp: new Date().toISOString(),
                categories: {
                    essential: true,
                    analytics: analyticsToggle ? analyticsToggle.checked : true,
                    marketing: marketingToggle ? marketingToggle.checked : true
                }
            };
            setCookiePreferences(prefs);
            if (modalOverlay) modalOverlay.classList.remove('visible');
            if (banner) banner.style.display = 'none';
        });
    }
});

// --- CÓDIGO DEL SERVICE WORKER ---
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(reg => {
            console.log("Service Worker registrado con éxito:", reg);
        }).catch(err => {
            console.log("Error al registrar el Service Worker:", err);
        });
    });
}