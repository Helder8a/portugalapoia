// PortugalApoia.com/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA O MENU MÓVIL (HAMBURGUER) ---
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

    // --- LÓGICA DO FORMULÁRIO DE ANÚNCIOS ---
    // Eliminada porque Netlify Forms se encarga ahora de la captura.
    // El formulario funcionará como un formulario HTML estándar.

    // --- LÓGICA PARA O MODAL DE DONATIVO ---
    const modal = document.getElementById('donativo-modal');
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;

    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // --- LÓGICA PARA EL FILTRO DE BÚSQUEDA ---
    const filtroInput = document.getElementById('filtro-input');
    if (filtroInput) {
        filtroInput.addEventListener('keyup', () => {
            const filtroTexto = filtroInput.value.toLowerCase();
            const cards = document.querySelectorAll('.causas-grid .card-causa');

            cards.forEach(card => {
                const titulo = card.querySelector('.card-title').textContent.toLowerCase();
                const descripcion = card.querySelector('.card-description').textContent.toLowerCase();
                const tagElement = card.querySelector('.card-tag');
                const tag = tagElement ? tagElement.textContent.toLowerCase() : '';

                if (titulo.includes(filtroTexto) || descripcion.includes(filtroTexto) || tag.includes(filtroTexto)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// --- LÓGICA PARA O PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// --- LÓGICA PARA EL BOTÓN "VOLVER ARRIBA" ---
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }