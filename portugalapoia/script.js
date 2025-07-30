/*
  JavaScript para la interactividad de PortugalApoia.com
  ---------------------------------------------------------
  Versión: 2.0 (Revisada y comentada)
  
  Este archivo gestiona:
  1. Menú de navegación móvil (hamburguesa).
  2. Modal de donación.
  3. Botón de "Volver Arriba" (Scroll-to-top).
  4. Lógica del buscador y filtros de tarjetas.
  5. Formulario inteligente para publicar anuncios.
  6. Simulación de envío de formulario.
  7. Previsualización de imagen en el formulario.
  8. Etiqueta "Novo" para anuncios recientes.
  9. Preloader (pantalla de carga).
  10. Banner de consentimiento de cookies.
*/

// Se ejecuta cuando el contenido del DOM ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA PARA EL MENÚ MÓVIL (HAMBURGUER) ---
    // Selecciona los elementos necesarios para el menú móvil.
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav');

    if (mobileNavToggle && mainNav) {
        // Añade un evento de clic al botón de la hamburguesa.
        mobileNavToggle.addEventListener('click', () => {
            // Alterna la clase 'nav-visible' para mostrar u ocultar el menú.
            mainNav.classList.toggle('nav-visible');
            const isVisible = mainNav.classList.contains('nav-visible');
            // Actualiza el atributo ARIA para accesibilidad.
            mobileNavToggle.setAttribute('aria-expanded', isVisible);
            // Cambia el icono del botón (hamburguesa o 'X').
            mobileNavToggle.textContent = isVisible ? '✕' : '☰';
        });
    }

    // --- 2. LÓGICA PARA EL MODAL DE DONATIVO ---
    // Selecciona los elementos del modal.
    const modal = document.getElementById('donativo-modal');
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;

    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        // Abre el modal al hacer clic en cualquier botón de "Apoia".
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        });

        // Cierra el modal al hacer clic en el botón de cerrar.
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Cierra el modal si se hace clic fuera del contenido del modal.
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // --- 3. LÓGICA PARA EL BOTÓN SCROLL-TO-TOP ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        // Muestra u oculta el botón basado en la posición del scroll.
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

        // Realiza el scroll suave hacia arriba al hacer clic.
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
        // Selecciona los elementos del buscador.
        const searchInput = searchContainer.querySelector('#search-input');
        const filters = searchContainer.querySelectorAll('.filter-group select');
        const allCards = document.querySelectorAll('.causas-grid .card-causa');
        const noResultsMessage = document.getElementById('no-results-message');
        const loadMoreBtn = document.getElementById('load-more-btn');

        // Configuración para la carga progresiva de tarjetas.
        let cardsToShowInitially = 6;
        let cardsToLoadPerClick = 6;
        let currentVisibleCards = cardsToShowInitially;

        // Función principal para filtrar y mostrar las tarjetas.
        const filterAndDisplayCards = () => {
            const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
            
            // Obtiene los filtros activos de los menús desplegables.
            const activeFilters = {};
            filters.forEach(filter => {
                if (filter.value) {
                    const filterName = filter.id.replace('-filter', ''); // ej: 'city-filter' -> 'city'
                    activeFilters[filterName] = filter.value.toLowerCase();
                }
            });

            // Filtra las tarjetas basadas en el texto y los filtros de selección.
            const matchingCards = Array.from(allCards).filter(card => {
                // 1. Filtro de texto (título y descripción).
                const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
                const description = (card.querySelector('.card-description')?.textContent || '').toLowerCase();
                const textMatch = title.includes(searchText) || description.includes(searchText);

                if (!textMatch) return false;

                // 2. Filtros de selección (basados en atributos data-*).
                for (const filterName in activeFilters) {
                    const filterValue = activeFilters[filterName];
                    const cardDataValue = (card.dataset[filterName] || '').toLowerCase();
                    
                    if (cardDataValue !== filterValue) return false;
                }
                
                return true;
            });

            // Oculta todas las tarjetas primero.
            allCards.forEach(card => card.style.display = 'none');

            // Muestra solo las tarjetas que coinciden, hasta el límite actual.
            matchingCards.slice(0, currentVisibleCards).forEach(card => {
                card.style.display = 'flex';
            });

            // Muestra u oculta el mensaje de "sin resultados".
            if (noResultsMessage) {
                noResultsMessage.style.display = matchingCards.length === 0 ? 'block' : 'none';
            }

            // Muestra u oculta el botón "Ver Mais".
            if (loadMoreBtn) {
                loadMoreBtn.style.display = currentVisibleCards < matchingCards.length ? 'block' : 'none';
            }
        };

        // Añade listeners para activar el filtro en tiempo real.
        searchInput?.addEventListener('keyup', () => {
            currentVisibleCards = cardsToShowInitially; // Resetea la vista al buscar
            filterAndDisplayCards();
        });

        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                currentVisibleCards = cardsToShowInitially; // Resetea la vista al cambiar filtros
                filterAndDisplayCards();
            });
        });

        // Lógica para el botón "Ver Mais".
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentVisibleCards += cardsToLoadPerClick;
                filterAndDisplayCards();
            });
        }
        
        // Ejecución inicial para mostrar las tarjetas al cargar la página.
        filterAndDisplayCards();
    }


    // --- 5. LÓGICA PARA EL FORMULARIO INTELIGENTE ---
    // Este formulario muestra campos específicos según la opción seleccionada.
    const tipoAnuncioSelector = document.getElementById('tipo-anuncio-selector');
    const camposHabitacao = document.getElementById('campos-habitacao');
    const camposEmprego = document.getElementById('campos-emprego');
    const camposServico = document.getElementById('campos-servico');

    // Campos específicos para cada tipo de anuncio.
    const precoHabitacaoInput = document.getElementById('preco_habitacao');
    const cidadeHabitacaoInput = document.getElementById('cidade_habitacao');
    const tipoContratoInput = document.getElementById('tipo_contrato');
    const experienciaEmpregoInput = document.getElementById('experiencia_emprego');
    const localEmpregoInput = document.getElementById('local_emprego');
    const categoriaServicoInput = document.getElementById('categoria_servico');
    const areaAtuacaoServicoInput = document.getElementById('area_atuacao_servico');

    // Mensajes de éxito y error del formulario.
    const formSuccessMessage = document.getElementById('form-success-message');
    const formErrorMessage = document.getElementById('form-error-message');

    // Función para resetear (ocultar) todos los campos específicos.
    const resetFormFields = () => {
        if (camposHabitacao) {
            camposHabitacao.style.display = 'none';
            if (precoHabitacaoInput) precoHabitacaoInput.required = false;
            if (cidadeHabitacaoInput) cidadeHabitacaoInput.required = false;
        }
        if (camposEmprego) {
            camposEmprego.style.display = 'none';
            if (tipoContratoInput) tipoContratoInput.required = false;
            if (localEmpregoInput) localEmpregoInput.required = false;
        }
        if (camposServico) {
            camposServico.style.display = 'none';
            if (categoriaServicoInput) categoriaServicoInput.required = false;
            if (areaAtuacaoServicoInput) areaAtuacaoServicoInput.required = false;
        }
    };

    // Muestra los campos correctos cuando el usuario cambia el tipo de anuncio.
    if (tipoAnuncioSelector) {
        tipoAnuncioSelector.addEventListener('change', (event) => {
            resetFormFields();

            switch (event.target.value) {
                case 'habitacao':
                    if(camposHabitacao) camposHabitacao.style.display = 'block';
                    if(precoHabitacaoInput) precoHabitacaoInput.required = true;
                    if(cidadeHabitacaoInput) cidadeHabitacaoInput.required = true;
                    break;
                case 'emprego':
                    if(camposEmprego) camposEmprego.style.display = 'block';
                    if(tipoContratoInput) tipoContratoInput.required = true;
                    if(localEmpregoInput) localEmpregoInput.required = true;
                    break;
                case 'servico':
                    if(camposServico) camposServico.style.display = 'block';
                    if(categoriaServicoInput) categoriaServicoInput.required = true;
                    if(areaAtuacaoServicoInput) areaAtuacaoServicoInput.required = true;
                    break;
            }
        });
        // Resetea los campos al cargar la página para asegurar el estado inicial correcto.
        resetFormFields();
    }

    // --- 6. LÓGICA DE ENVÍO DE ANUNCIO (SIMULACIÓN) ---
    const formAnuncio = document.getElementById('form-anuncio');
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', e => {
            e.preventDefault(); // Previene el envío real del formulario.

            // Oculta mensajes anteriores.
            if(formSuccessMessage) formSuccessMessage.style.display = 'none';
            if(formErrorMessage) formErrorMessage.style.display = 'none';

            // Simulación de envío a un backend.
            const formData = new FormData(formAnuncio);
            
            // fetch() simula una petición POST.
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Si la "petición" tiene éxito:
                if(formSuccessMessage) formSuccessMessage.style.display = 'block';
                formAnuncio.reset(); 
                resetFormFields(); // Resetea la visibilidad de los campos dinámicos.
                window.scrollTo({ top: formAnuncio.offsetTop, behavior: 'smooth' });

                // Oculta el mensaje de éxito después de 6 segundos.
                setTimeout(() => {
                    if(formSuccessMessage) formSuccessMessage.style.display = 'none';
                }, 6000);
            })
            .catch(error => {
                // Si la "petición" falla:
                if(formErrorMessage) formErrorMessage.style.display = 'block';
                console.error('Error simulado en el envío del formulario:', error);
                
                // Oculta el mensaje de error después de 6 segundos.
                setTimeout(() => {
                    if(formErrorMessage) formErrorMessage.style.display = 'none';
                }, 6000);
            });
        });
    }

    // --- 7. Lógica para previsualización de imagen (básica) ---
    const imagemAnuncioInput = document.getElementById('imagem_anuncio');
    const imagePreviewMessage = document.getElementById('image-preview-message');

    if (imagemAnuncioInput && imagePreviewMessage) {
        // Muestra el nombre del archivo seleccionado.
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
    // Muestra una etiqueta en las tarjetas publicadas en las últimas 48 horas.
    const checkNewTags = () => {
        const cards = document.querySelectorAll('.card-causa');
        const now = new Date();
        const fortyEightHours = 48 * 60 * 60 * 1000; // 48 horas en milisegundos.

        cards.forEach(card => {
            const pubDateString = card.dataset.publicationDate;
            if (pubDateString) {
                const pubDate = new Date(pubDateString);
                const timeDiff = now.getTime() - pubDate.getTime();

                // Si la diferencia es menor o igual a 48h, muestra la etiqueta.
                if (timeDiff <= fortyEightHours) {
                    const newTag = card.querySelector('.new-tag');
                    if (newTag) {
                        newTag.style.display = 'block';
                    }
                }
            }
        });
    };

    checkNewTags(); // Ejecuta la función al cargar la página.

    // --- 10. LÓGICA PARA EL BANNER DE COOKIES ---
    // Comprueba si el usuario ya ha aceptado las cookies.
    if (!localStorage.getItem('cookieConsent')) {
        // Si no, crea y muestra el banner.
        const consentBanner = document.createElement('div');
        consentBanner.className = 'cookie-banner';
        consentBanner.innerHTML = `
            <span>Este site utiliza cookies para melhorar a sua experiência. Ao continuar a navegar, você concorda com o uso de cookies.</span>
            <button id="accept-cookie-btn">Aceitar</button>
        `;
        document.body.appendChild(consentBanner);

        // Al hacer clic en "Aceitar", guarda la preferencia y oculta el banner.
        document.getElementById('accept-cookie-btn').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            consentBanner.style.display = 'none';
        });
    }
});

// --- 9. LÓGICA PARA EL PRELOADER ---
// Oculta la pantalla de carga cuando la página y todos sus recursos han cargado.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});