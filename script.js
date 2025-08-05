/*
  JavaScript para la interactividad de PortugalApoia.com
  ---------------------------------------------------------
  Versión: 4.0 (Lógica de banners y temporizador PWA corregida)
*/

document.addEventListener('DOMContentLoaded', () => {

    // Lógica del menú móvil, modal y botón de scroll (sin cambios)
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-visible');
            const isVisible = mainNav.classList.contains('nav-visible');
            mobileNavToggle.setAttribute('aria-expanded', isVisible);
            mobileNavToggle.textContent = isVisible ? '✕' : '☰';
        });
    }

    const modal = document.getElementById('donativo-modal');
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;
    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        openModalBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('hidden')));
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.classList.add('hidden');
        });
    }

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- LÓGICA DE BANNERS MEJORADA ---

    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
    let pwaDeferredPrompt;

    // 1. Guardar el evento de instalación de la PWA tan pronto como esté disponible.
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        pwaDeferredPrompt = e;
        console.log('Evento beforeinstallprompt guardado.');
    });

    // 2. Función para mostrar el banner de la PWA (ahora con temporizador).
    function showPwaBanner() {
        // Solo continuar si la PWA es instalable y el banner no ha sido cerrado.
        if (pwaDeferredPrompt && localStorage.getItem('pwaBannerClosed') !== 'true') {
            const pwaBanner = document.getElementById('pwa-install-banner');
            if (pwaBanner) {
                 // **AQUÍ ESTÁ EL TEMPORIZADOR**
                setTimeout(() => {
                    pwaBanner.classList.remove('hidden');
                    pwaBanner.classList.add('visible');
                    console.log('Mostrando banner de PWA después del temporizador.');
                }, 4000); // Muestra el banner después de 4 segundos.
            }
        }
    }

    // 3. Manejar el banner de cookies primero.
    if (cookieBanner && acceptCookiesBtn) {
        // Si las cookies no han sido aceptadas, mostrar el banner.
        if (localStorage.getItem('cookiesAccepted') !== 'true') {
            cookieBanner.style.display = 'flex';
        } else {
            // Si ya estaban aceptadas, intentar mostrar el banner de la PWA.
            showPwaBanner();
        }

        // Cuando el usuario acepta las cookies...
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
            // ...ahora intentar mostrar el banner de la PWA.
            showPwaBanner();
        });
    }

    // Lógica de los botones del banner de la PWA.
    const pwaInstallBtn = document.getElementById('pwa-install-button');
    const pwaCloseBtn = document.getElementById('pwa-close-button');

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', () => {
            if (pwaDeferredPrompt) {
                pwaDeferredPrompt.prompt();
            }
        });
    }
    if (pwaCloseBtn) {
        pwaCloseBtn.addEventListener('click', () => {
            const pwaBanner = document.getElementById('pwa-install-banner');
            pwaBanner.style.display = 'none';
            localStorage.setItem('pwaBannerClosed', 'true');
        });
    }
});


// Preloader (sin cambios)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});