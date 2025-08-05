/*
  JavaScript para PortugalApoia.com
  ------------------------------------
  Versión: 7.0 (Solo banner de cookies activado)
*/

// --- 1. LÓGICA QUE SE EJECUTA CUANDO EL HTML ESTÁ LISTO ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidad básica de la página (menú, modal, etc.) ---
    setupBasicInteractivity();

    // --- Lógica del banner de cookies ---
    handleCookieBanner();

});


// --- 2. CÓDIGO QUE SE EJECUTA CUANDO LA PÁGINA HA CARGADO COMPLETAMENTE ---

window.addEventListener('load', () => {
    // Ocultar el preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});


// --- 3. DEFINICIÓN DE FUNCIONES ---

/**
 * Configura la interactividad básica del sitio:
 * - Menú móvil
 * - Modal de donativo
 * - Botón de scroll-to-top
 */
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

/**
 * Maneja la lógica para mostrar y ocultar el banner de cookies.
 */
function handleCookieBanner() {
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');

    if (!cookieBanner || !acceptCookiesBtn) return;

    // Si las cookies no han sido aceptadas previamente, mostrar el banner.
    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        cookieBanner.style.display = 'flex';
    }

    // Cuando el usuario hace clic en "Aceptar", ocultar el banner y guardar la preferencia.
    acceptCookiesBtn.addEventListener('click', () => {
        cookieBanner.style.display = 'none';
        localStorage.setItem('cookiesAccepted', 'true');
    });
}