/*
  JavaScript para la interactividad de PortugalApoia.com
  ---------------------------------------------------------
  Versión: 3.0 (Lógica de banners corregida y secuencial)
*/

// Espera a que todo el contenido del HTML esté cargado antes de ejecutar cualquier script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA PARA EL MENÚ MÓVIL ---
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

    // --- 2. LÓGICA PARA EL MODAL DE DONATIVO ---
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

    // --- 3. LÓGICA PARA EL BOTÓN SCROLL-TO-TOP ---
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

    // --- 4. LÓGICA DEL BUSCADOR Y FILTROS ---
    // (Sin cambios)
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const searchInput = searchContainer.querySelector('#search-input');
        const filters = searchContainer.querySelectorAll('.filter-group select');
        const allCards = document.querySelectorAll('.causas-grid .card-causa');
        const noResultsMessage = document.getElementById('no-results-message');

        const filterCards = () => {
            let visibleCardsCount = 0;
            const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const activeFilters = {};
            filters.forEach(filter => {
                if (filter.value) {
                    let filterName = filter.id.replace('-filter', '');
                    if (filterName === 'location') filterName = 'city';
                    activeFilters[filterName] = filter.value.toLowerCase();
                }
            });

            allCards.forEach(card => {
                const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
                const description = (card.querySelector('.card-description')?.textContent || '').toLowerCase();
                const textMatch = title.includes(searchText) || description.includes(searchText);

                let filtersMatch = true;
                for (const filterName in activeFilters) {
                    const filterValue = activeFilters[filterName];
                    const cardDataValue = (card.dataset[filterName] || '').toLowerCase();
                    if (cardDataValue !== filterValue) {
                        filtersMatch = false;
                        break;
                    }
                }

                if (textMatch && filtersMatch) {
                    card.style.display = 'flex';
                    visibleCardsCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCardsCount === 0 ? 'block' : 'none';
            }
        };

        searchInput?.addEventListener('keyup', filterCards);
        filters.forEach(filter => filter.addEventListener('change', filterCards));
        filterCards();
    }


    // --- LÓGICA SECUENCIAL DE BANNERS ---

    // 1. Primero, manejar el banner de cookies.
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');

    if (cookieBanner && acceptCookiesBtn) {
        if (localStorage.getItem('cookiesAccepted') !== 'true') {
            cookieBanner.style.display = 'flex';
        }

        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
            // Una vez que las cookies son aceptadas, podemos intentar mostrar el banner de PWA.
            initializePwaBanner();
        });
    }

    // 2. Después, si las cookies ya fueron aceptadas, intentar mostrar el banner de PWA.
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        initializePwaBanner();
    }


    function initializePwaBanner() {
        const pwaBanner = document.getElementById('pwa-install-banner');
        const pwaInstallBtn = document.getElementById('pwa-install-button');
        const pwaCloseBtn = document.getElementById('pwa-close-button');
        const pwaInstructions = document.getElementById('pwa-install-instructions');

        if (!pwaBanner || !pwaInstallBtn || !pwaCloseBtn) return;

        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // Solo mostrar el banner si el evento se dispara y no ha sido cerrado antes.
            if (localStorage.getItem('pwaBannerClosed') !== 'true') {
                 setTimeout(() => {
                    pwaBanner.classList.remove('hidden');
                    pwaBanner.classList.add('visible');
                }, 3000); // Espera 3 segundos después de que las cookies se resuelvan.
            }
        });

        pwaInstallBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('El usuario aceptó instalar la PWA');
                    } else {
                        console.log('El usuario rechazó instalar la PWA');
                    }
                    deferredPrompt = null;
                    pwaBanner.classList.remove('visible');
                    pwaBanner.classList.add('hidden');
                    localStorage.setItem('pwaBannerClosed', 'true');
                });
            } else if (pwaInstructions) {
                 pwaInstructions.classList.toggle('hidden');
            }
        });

        pwaCloseBtn.addEventListener('click', () => {
            pwaBanner.classList.remove('visible');
            pwaBanner.classList.add('hidden');
            localStorage.setItem('pwaBannerClosed', 'true');
        });
    }
});


// Lógica que se ejecuta cuando la ventana completa (incluyendo imágenes) ha cargado
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});