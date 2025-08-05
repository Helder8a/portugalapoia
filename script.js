/*
  JavaScript para la interactividad de PortugalApoia.com
  ---------------------------------------------------------
  Versión: 5.0 (Lógica de banners robusta y simplificada)
*/

// --- BLOQUE 1: CÓDIGO QUE SE EJECUTA INMEDIATAMENTE ---

// Variable para guardar el evento de instalación de la PWA.
// Se declara fuera para que esté disponible globalmente en el script.
let deferredPrompt;

// Escuchar el evento 'beforeinstallprompt' que dispara el navegador
// cuando la PWA es instalable. Lo capturamos en cuanto esté disponible.
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que el mini-infobar aparezca en Chrome/Edge
  e.preventDefault();
  // Guardar el evento para que pueda ser disparado más tarde.
  deferredPrompt = e;
  console.log('`beforeinstallprompt` event was fired and saved.');
});


// --- BLOQUE 2: CÓDIGO QUE ESPERA A QUE EL HTML ESTÉ LISTO ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Menú Móvil, Modal y Scroll (sin cambios) ---
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

    // --- LÓGICA DE BANNERS SECUENCIAL Y CORREGIDA ---

    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
    const pwaBanner = document.getElementById('pwa-install-banner');
    const pwaInstallBtn = document.getElementById('pwa-install-button');
    const pwaCloseBtn = document.getElementById('pwa-close-button');


    // Función que intenta mostrar el banner de la PWA después de un tiempo
    function triggerPwaBanner() {
        if (!pwaBanner) return; // Salir si el banner no existe

        // **TEMPORIZADOR DE 4 SEGUNDOS**
        setTimeout(() => {
            // Después del tiempo, comprobar si la PWA es instalable (deferredPrompt existe)
            // y si el usuario no ha cerrado el banner antes.
            if (deferredPrompt && localStorage.getItem('pwaBannerClosed') !== 'true') {
                pwaBanner.classList.remove('hidden');
                pwaBanner.classList.add('visible');
            }
        }, 4000);
    }

    // Lógica principal de los banners
    if (cookieBanner && acceptCookiesBtn) {
        // Comprobar si las cookies ya fueron aceptadas en una visita anterior
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            // Si ya están aceptadas, no mostrar el banner de cookies
            // e intentar mostrar el banner de la PWA.
            triggerPwaBanner();
        } else {
            // Si no están aceptadas, mostrar el banner de cookies.
            cookieBanner.style.display = 'flex';
        }

        // Añadir el listener al botón de aceptar cookies
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
            // Una vez el usuario acepta, intentar mostrar el banner de la PWA.
            triggerPwaBanner();
        });
    }


    // Lógica para los botones del banner de la PWA
    if (pwaBanner && pwaInstallBtn && pwaCloseBtn) {
        pwaInstallBtn.addEventListener('click', () => {
            if (!deferredPrompt) return; // Si no hay prompt guardado, no hacer nada
            // Mostrar el prompt de instalación del navegador
            deferredPrompt.prompt();
            // El navegador se encarga del resultado.
            deferredPrompt.userChoice.then(() => {
                deferredPrompt = null; // Limpiar la variable
                // Ocultar nuestro banner
                pwaBanner.classList.remove('visible');
                pwaBanner.classList.add('hidden');
            });
        });

        pwaCloseBtn.addEventListener('click', () => {
            pwaBanner.classList.remove('visible');
            pwaBanner.classList.add('hidden');
            localStorage.setItem('pwaBannerClosed', 'true');
        });
    }

}); // Fin de DOMContentLoaded


// Ocultar el preloader cuando toda la página (imágenes, etc.) esté cargada.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});