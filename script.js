/*
  JavaScript para la interactividad de PortugalApoia.com
  ---------------------------------------------------------
  Versión: 2.1 (Simplificada para sitio estático)
*/
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
                    if (filterName === 'location') filterName = 'city'; // Ajuste para consistencia
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
        filterCards(); // Llamada inicial
    }

    // --- 5. LÓGICA PARA EL FORMULARIO DE PUBLICAR (página publicar.html) ---
    const formAnuncio = document.getElementById('form-anuncio');
    if (formAnuncio) {
        // La lógica que ya tienes para el formulario de Netlify en publicar.html es correcta
        // para que los *visitantes* envíen anuncios. No necesita cambios.
    }

});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

/* --- 6. LÓGICA PARA EL BANNER DE INSTALACIÓN DE PWA --- */
const pwaBanner = document.getElementById('pwa-install-banner');
const pwaInstallBtn = document.getElementById('pwa-install-button');
const pwaCloseBtn = document.getElementById('pwa-close-button');
const pwaInstructions = document.getElementById('pwa-install-instructions');

if (pwaBanner) {
    // Muestra el banner después de 4 segundos si no ha sido cerrado antes
    setTimeout(() => {
        if (localStorage.getItem('pwaBannerClosed') !== 'true') {
            pwaBanner.classList.remove('hidden');
            pwaBanner.classList.add('visible');
        }
    }, 4000);

    // Lógica para cerrar el banner
    pwaCloseBtn.addEventListener('click', () => {
        pwaBanner.classList.remove('visible');
        // Oculta el banner permanentemente para esta sesión de usuario
        localStorage.setItem('pwaBannerClosed', 'true');
        setTimeout(() => {
            pwaBanner.classList.add('hidden');
        }, 500);
    });

    // Lógica para el botón de instalar/mostrar instrucciones
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir que Chrome 67 y anteriores muestren el prompt automáticamente
        e.preventDefault();
        // Guardar el evento para que pueda ser disparado más tarde
        deferredPrompt = e;
    });

    pwaInstallBtn.addEventListener('click', (e) => {
        if (deferredPrompt) {
            // Mostrar el prompt de instalación guardado
            deferredPrompt.prompt();
            // Esperar a que el usuario responda al prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('El usuario aceptó instalar la PWA');
                } else {
                    console.log('El usuario rechazó instalar la PWA');
                }
                deferredPrompt = null;
                // Ocultar el banner una vez que se interactuó con el prompt
                pwaBanner.classList.add('hidden');
                localStorage.setItem('pwaBannerClosed', 'true');
            });
        } else {
            // Si el navegador no soporta el prompt o ya está instalada, mostrar instrucciones manuales
            pwaInstructions.classList.toggle('hidden');
        }
    });
}

/* --- 7. LÓGICA PARA EL BANNER DE CONSENTIMIENTO DE COOKIES --- */
const cookieBanner = document.getElementById('cookie-consent-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies-btn');

if (cookieBanner && acceptCookiesBtn) {
    // Comprobar si el usuario ya ha aceptado las cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.style.display = 'flex';
    }

    // Evento al hacer clic en "Aceptar"
    acceptCookiesBtn.addEventListener('click', () => {
        cookieBanner.style.display = 'none';
        // Guardar la preferencia del usuario en el almacenamiento local
        localStorage.setItem('cookiesAccepted', 'true');
    });
}