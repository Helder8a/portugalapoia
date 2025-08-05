/*
  JavaScript para PortugalApoia.com
  ------------------------------------
  Versión: 6.0 (Lógica de banners simplificada y corregida)
*/

// --- 1. LÓGICA GENERAL DE LA PÁGINA ---

// Variable global para guardar el evento de instalación de la PWA.
// Se declara aquí para estar disponible en todo momento.
let deferredPrompt;

// Capturamos el evento en cuanto el navegador lo dispare.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('Evento "beforeinstallprompt" capturado y listo para usar.');
});

// Ocultar el preloader cuando toda la página (imágenes, etc.) ha cargado.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// --- 2. LÓGICA INTERACTIVA (cuando el HTML está listo) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad básica de la página (menú, modal, etc.) ---
    setupBasicInteractivity();

    // --- Lógica secuencial para los banners ---
    handleBanners();

});


// --- DEFINICIÓN DE FUNCIONES ---

function setupBasicInteractivity() {
    // Menú móvil
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-visible');
            mobileNavToggle.setAttribute('aria-expanded', mainNav.classList.contains('nav-visible'));
            mobileNavToggle.textContent = mainNav.classList.contains('nav-visible') ? '✕' : '☰';
        });
    }

    // Modal de donativo
    const modal = document.getElementById('donativo-modal');
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;
    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        openModalBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('hidden')));
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.add('hidden'); });
    }

    // Botón de scroll-to-top
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}


function handleBanners() {
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');

    // Función para mostrar el banner de la PWA
    const triggerPwaBanner = () => {
        // El temporizador se activa aquí
        setTimeout(() => {
            // Después de 4 segundos, si la PWA es instalable y el banner no ha sido cerrado...
            if (deferredPrompt && localStorage.getItem('pwaBannerClosed') !== 'true') {
                const pwaBanner = document.getElementById('pwa-install-banner');
                if (pwaBanner) {
                    pwaBanner.classList.remove('hidden');
                    pwaBanner.classList.add('visible');
                }
            }
        }, 4000); // 4 segundos de espera
    };

    // 1. Manejar el banner de cookies
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        // Si ya están aceptadas, intentar mostrar el banner de la PWA directamente.
        triggerPwaBanner();
    } else {
        // Si no, mostrar el banner de cookies.
        if (cookieBanner) cookieBanner.style.display = 'flex';
    }

    // 2. Listener para el botón de aceptar cookies
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            if (cookieBanner) cookieBanner.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
            // Una vez aceptadas, intentar mostrar el banner de la PWA.
            triggerPwaBanner();
        });
    }

    // 3. Listeners para los botones del banner de la PWA
    const pwaInstallBtn = document.getElementById('pwa-install-button');
    const pwaCloseBtn = document.getElementById('pwa-close-button');

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
            }
        });
    }

    if (pwaCloseBtn) {
        pwaCloseBtn.addEventListener('click', () => {
            const pwaBanner = document.getElementById('pwa-install-banner');
            if(pwaBanner) pwaBanner.style.display = 'none';
            localStorage.setItem('pwaBannerClosed', 'true');
        });
    }
}