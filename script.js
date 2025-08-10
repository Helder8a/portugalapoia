document.addEventListener("DOMContentLoaded", () => {
    // Oculta el preloader tan pronto como el contenido principal está listo
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.onload = () => {
            preloader.classList.add("hidden");
        };
    }

    // Barra de navegación que se vuelve "pegajosa" (sticky) al hacer scroll
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 45) {
                mainHeader.classList.add('nav-sticky');
            } else {
                mainHeader.classList.remove('nav-sticky');
            }
        });
    }

    // Botón para volver al inicio de la página
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.onscroll = function () {
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

    // Registra el Service Worker para la PWA (Progressive Web App)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('Service Worker registrado com sucesso.'))
                .catch(error => console.log('Falha ao registrar Service Worker:', error));
        });
    }

    // Lógica para el interruptor de modo oscuro
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.body.classList.add(currentTheme);
            if (currentTheme === 'dark-theme') {
                themeToggle.checked = true;
            }
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('theme', 'dark-theme');
            } else {
                document.body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('theme', 'light-theme');
            }
        });
    } else {
        document.body.classList.add('light-theme');
    }
});