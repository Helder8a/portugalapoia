/*
  JavaScript para la interactividad de PortugalApoia.com
  ---------------------------------------------------------
  Versión: 4.0 (Final y Validada)
  
  Este archivo gestiona:
  1. Menú de navegación móvil (hamburguesa).
  2. Modal de donación.
  3. Botón de "Volver Arriba" (Scroll-to-top).
  4. Lógica del buscador y filtros de tarjetas.
  5. Formulario inteligente para publicar anuncios.
  6. Lógica de envío de formulario para Netlify.
  7. Previsualización de imagen en el formulario.
  8. Etiqueta "Novo" para anuncios recientes.
  9. Preloader (pantalla de carga).
  10. Banner de consentimiento de cookies.
*/

// Se ejecuta cuando el contenido del DOM ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA PARA EL MENÚ MÓVIL (HAMBURGUER) ---
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

    // --- 3. LÓGICA PARA EL BOTÓN SCROLL-TO-TOP ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                if (!scrollTopBtn.classList.contains('visible')) {
                    scrollTopBtn.classList.add('visible');
                }
            } else {
                if (scrollTopBtn.classList.contains('visible')) {
                    scrollTopBtn.classList.remove('visible');
                }
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 4. LÓGICA DEL BUSCADOR Y FILTROS ---
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const searchInput = searchContainer.querySelector('#search-input');
        const filters = searchContainer.querySelectorAll('.filter-group select');
        const allCards = document.querySelectorAll('.causas-grid .card-causa');
        const noResultsMessage = document.getElementById('no-results-message');
        const loadMoreBtn = document.getElementById('load-more-btn');

        let cardsToShowInitially = 6;
        let cardsToLoadPerClick = 6;
        let currentVisibleCards = cardsToShowInitially;

        const filterAndDisplayCards = () => {
            const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const activeFilters = {};
            filters.forEach(filter => {
                if (filter.value) {
                    const filterName = filter.dataset.filter || filter.id.replace('-filter', '');
                    activeFilters[filterName] = filter.value.toLowerCase();
                }
            });

            const matchingCards = Array.from(allCards).filter(card => {
                const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
                const description = (card.querySelector('.card-description')?.textContent || '').toLowerCase();
                const textMatch = title.includes(searchText) || description.includes(searchText);

                if (!textMatch) return false;

                for (const filterName in activeFilters) {
                    const filterValue = activeFilters[filterName];
                    const cardDataValue = (card.dataset[filterName] || '').toLowerCase();
                    if (cardDataValue !== filterValue) return false;
                }
                return true;
            });

            allCards.forEach(card => card.style.display = 'none');
            matchingCards.slice(0, currentVisibleCards).forEach(card => {
                card.style.display = 'flex';
            });

            if (noResultsMessage) {
                noResultsMessage.style.display = matchingCards.length === 0 ? 'block' : 'none';
            }

            if (loadMoreBtn) {
                loadMoreBtn.style.display = currentVisibleCards < matchingCards.length ? 'block' : 'none';
            }
        };

        searchInput?.addEventListener('keyup', () => {
            currentVisibleCards = cardsToShowInitially;
            filterAndDisplayCards();
        });

        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                currentVisibleCards = cardsToShowInitially;
                filterAndDisplayCards();
            });
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentVisibleCards += cardsToLoadPerClick;
                filterAndDisplayCards();
            });
        }
        
        filterAndDisplayCards();
    }

    // --- 5. LÓGICA PARA EL FORMULARIO INTELIGENTE ---
    const tipoAnuncioSelector = document.getElementById('tipo-anuncio-selector');
    const camposHabitacao = document.getElementById('campos-habitacao');
    const camposEmprego = document.getElementById('campos-emprego');
    const camposServico = document.getElementById('campos-servico');

    const resetFormFields = () => {
        if (camposHabitacao) camposHabitacao.style.display = 'none';
        if (camposEmprego) camposEmprego.style.display = 'none';
        if (camposServico) camposServico.style.display = 'none';

        document.querySelectorAll('#campos-habitacao input, #campos-emprego input, #campos-servico input, #campos-emprego select, #campos-servico select').forEach(input => {
            input.required = false;
        });
    };

    if (tipoAnuncioSelector) {
        tipoAnuncioSelector.addEventListener('change', (event) => {
            resetFormFields();
            const selectedValue = event.target.value;

            if (selectedValue === 'habitacao' && camposHabitacao) {
                camposHabitacao.style.display = 'block';
                document.getElementById('preco_habitacao').required = true;
                document.getElementById('cidade_habitacao').required = true;
            } else if (selectedValue === 'emprego' && camposEmprego) {
                camposEmprego.style.display = 'block';
                document.getElementById('tipo_contrato').required = true;
                document.getElementById('local_emprego').required = true;
            } else if (selectedValue === 'servico' && camposServico) {
                camposServico.style.display = 'block';
                document.getElementById('categoria_servico').required = true;
                document.getElementById('area_atuacao_servico').required = true;
            }
        });
        resetFormFields();
    }

    // --- 6. LÓGICA DE ENVÍO DE ANUNCIO (PARA NETLIFY) ---
    const formAnuncio = document.getElementById('form-anuncio');
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', () => {
            const formSuccessMessage = document.getElementById('form-success-message');
            setTimeout(() => {
                formAnuncio.reset();
                if(tipoAnuncioSelector) {
                    tipoAnuncioSelector.dispatchEvent(new Event('change'));
                }
                if(formSuccessMessage) {
                    formSuccessMessage.style.display = 'block';
                    window.scrollTo({ top: formAnuncio.offsetTop, behavior: 'smooth' });
                }
            }, 1000);
        });
    }

    // --- 7. Lógica para previsualización de imagen ---
    const imagemAnuncioInput = document.getElementById('imagem_anuncio');
    const imagePreviewMessage = document.getElementById('image-preview-message');

    if (imagemAnuncioInput && imagePreviewMessage) {
        imagemAnuncioInput.addEventListener('change', () => {
            if (imagemAnuncioInput.files && imagemAnuncioInput.files[0]) {
                imagePreviewMessage.textContent = `Arquivo selecionado: ${imagemAnuncioInput.files[0].name}`;
                imagePreviewMessage.style.display = 'block';
            } else {
                imagePreviewMessage.textContent = '';
                imagePreviewMessage.style.display = 'none';
            }
        });
    }

    // --- 8. LÓGICA PARA LA ETIQUETA "NOVO" ---
    const checkNewTags = () => {
        const cards = document.querySelectorAll('.card-causa');
        const now = new Date();
        const fortyEightHours = 48 * 60 * 60 * 1000;

        cards.forEach(card => {
            const pubDateString = card.dataset.publicationDate;
            if (pubDateString) {
                const pubDate = new Date(pubDateString);
                if (!isNaN(pubDate.getTime())) {
                    const timeDiff = now.getTime() - pubDate.getTime();
                    if (timeDiff >= 0 && timeDiff <= fortyEightHours) {
                        const newTag = card.querySelector('.new-tag');
                        if (newTag) {
                            newTag.style.display = 'block';
                        }
                    }
                }
            }
        });
    };
    checkNewTags();

    // --- 10. LÓGICA PARA EL BANNER DE COOKIES ---
    if (!localStorage.getItem('cookieConsent')) {
        const consentBanner = document.createElement('div');
        consentBanner.className = 'cookie-banner';
        consentBanner.innerHTML = `
            <span>Este site utiliza cookies para melhorar a sua experiência. Ao continuar a navegar, você concorda com o uso de cookies.</span>
            <button id="accept-cookie-btn">Aceitar</button>
        `;
        document.body.appendChild(consentBanner);

        document.getElementById('accept-cookie-btn').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            consentBanner.style.display = 'none';
        });
    }
});

// --- 9. LÓGICA PARA EL PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});