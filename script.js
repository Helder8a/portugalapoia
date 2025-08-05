/*
  JavaScript para PortugalApoia.com
  ------------------------------------
  Versión: 9.0 (Lógica final y correcta para cookies)
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');

    // Comprobar si los elementos del banner existen en esta página
    if (cookieBanner && acceptCookiesBtn) {

        // Si las cookies NO han sido aceptadas, mostrar el banner
        if (localStorage.getItem('cookiesAccepted') !== 'true') {
            // Se usa 'display: flex' porque el CSS original así lo define
            cookieBanner.style.display = 'flex';
        }

        // Añadir listener al botón de aceptar
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }


    // --- OTRA INTERACTIVIDAD DE LA PÁGINA (MENÚ, MODAL, ETC.) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-visible');
            mobileNavToggle.setAttribute('aria-expanded', mainNav.classList.contains('nav-visible'));
            mobileNavToggle.textContent = mainNav.classList.contains('nav-visible') ? '✕' : '☰';
        });
    }

    const modal = document.getElementById('donativo-modal');
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;
    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        openModalBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('hidden')));
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.add('hidden'); });
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});