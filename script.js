document.addEventListener("DOMContentLoaded", () => {
    // --- CÓDIGO CORREGIDO PARA EL PRELOADER ---
    let preloader = document.getElementById("preloader");
    if (preloader) {
        // Oculta el preloader al cargar la ventana
        window.addEventListener("load", () => {
            preloader.classList.add("hidden");
        });
        // También oculta el preloader después de un tiempo, por si hay fallos en la carga
        setTimeout(() => {
            preloader.classList.add("hidden");
        }, 1500); // Se oculta a los 1.5 segundos
    }

    // --- CÓDIGO PARA SCROLL Y TEMA OSCURO ---
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

    const getCookiePreferences = () => {
        const prefs = localStorage.getItem(COOKIE_PREFS_KEY);
        return prefs ? JSON.parse(prefs) : null;
    };

    const setCookiePreferences = (prefs) => {
        localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(prefs));
    };

    if (!getCookiePreferences() && banner) {
        banner.style.display = 'flex';
    }

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

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('visible');
        });
    }

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