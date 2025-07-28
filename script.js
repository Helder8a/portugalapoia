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

    // --- LÓGICA PARA O BOTÃO SCROLL-TO-TOP ---
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

    // --- NOVA LÓGICA DO BUSCADOR (CORRIGIDA E MELHORADA) ---
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
                    const filterName = filter.id.replace('-filter', ''); // ex: 'city-filter' -> 'city'
                    activeFilters[filterName] = filter.value.toLowerCase();
                }
            });

            const matchingCards = Array.from(allCards).filter(card => {
                // 1. Filtro de texto
                const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
                const description = (card.querySelector('.card-description')?.textContent || '').toLowerCase();
                const textMatch = title.includes(searchText) || description.includes(searchText);

                if (!textMatch) {
                    return false;
                }

                // 2. Filtros de seleção (dropdowns)
                for (const filterName in activeFilters) {
                    const filterValue = activeFilters[filterName];
                    const cardDataValue = (card.dataset[filterName] || '').toLowerCase();
                    
                    if (cardDataValue !== filterValue) {
                        return false;
                    }
                }
                
                return true;
            });

            // Ocultar todos os cartões primeiro
            allCards.forEach(card => card.style.display = 'none');

            // Mostrar apenas os cartões que correspondem e até o limite atual
            matchingCards.slice(0, currentVisibleCards).forEach(card => {
                card.style.display = 'flex';
            });

            // Mostrar ou ocultar a mensagem de "sem resultados"
            if (noResultsMessage) {
                noResultsMessage.style.display = matchingCards.length === 0 ? 'block' : 'none';
            }

            // Mostrar ou ocultar o botão "Ver Mais"
            if (loadMoreBtn) {
                loadMoreBtn.style.display = currentVisibleCards < matchingCards.length ? 'block' : 'none';
            }
        };

        // Adicionar listeners de eventos
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
        
        // Exibição inicial dos cartões
        filterAndDisplayCards();
    }


    // --- LÓGICA PARA O FORMULÁRIO INTELIGENTE ---
    const tipoAnuncioSelector = document.getElementById('tipo-anuncio-selector');
    const camposHabitacao = document.getElementById('campos-habitacao');
    const camposEmprego = document.getElementById('campos-emprego'); // Nuevo
    const camposServico = document.getElementById('campos-servico'); // Nuevo

    // Campos de habitacao
    const precoHabitacaoInput = document.getElementById('preco_habitacao');
    const cidadeHabitacaoInput = document.getElementById('cidade_habitacao');

    // Campos de emprego
    const tipoContratoInput = document.getElementById('tipo_contrato');
    const experienciaEmpregoInput = document.getElementById('experiencia_emprego');
    const localEmpregoInput = document.getElementById('local_emprego');

    // Campos de serviço
    const categoriaServicoInput = document.getElementById('categoria_servico');
    const areaAtuacaoServicoInput = document.getElementById('area_atuacao_servico');

    const formSuccessMessage = document.getElementById('form-success-message'); // Definido globalmente
    const formErrorMessage = document.getElementById('form-error-message'); // Definido globalmente

    const resetFormFields = () => {
        // Ocultar todos los campos específicos y eliminar el atributo 'required'
        if (camposHabitacao) {
            camposHabitacao.style.display = 'none';
            precoHabitacaoInput.required = false;
            cidadeHabitacaoInput.required = false;
        }
        if (camposEmprego) {
            camposEmprego.style.display = 'none';
            tipoContratoInput.required = false;
            experienciaEmpregoInput.required = false;
            localEmpregoInput.required = false;
        }
        if (camposServico) {
            camposServico.style.display = 'none';
            categoriaServicoInput.required = false;
            areaAtuacaoServicoInput.required = false;
        }
    };


    if (tipoAnuncioSelector) {
        tipoAnuncioSelector.addEventListener('change', (event) => {
            resetFormFields(); // Resetear todos antes de mostrar los correctos

            switch (event.target.value) {
                case 'habitacao':
                    camposHabitacao.style.display = 'block';
                    precoHabitacaoInput.required = true;
                    cidadeHabitacaoInput.required = true;
                    break;
                case 'emprego':
                    camposEmprego.style.display = 'block';
                    tipoContratoInput.required = true;
                    localEmpregoInput.required = true;
                    break;
                case 'servico':
                    camposServico.style.display = 'block';
                    categoriaServicoInput.required = true;
                    areaAtuacaoServicoInput.required = true;
                    break;
                // 'artigos' no necesita campos específicos adicionales requeridos
            }
        });
        resetFormFields(); // Ejecutar al cargar la página para asegurar el estado inicial
    }

    // --- LÓGICA DE CONFIRMAÇÃO DE ENVIO DE ANÚNCIO ---
    const formAnuncio = document.getElementById('form-anuncio');
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', e => {
            e.preventDefault();

            // Ocultar mensajes anteriores
            if(formSuccessMessage) formSuccessMessage.style.display = 'none';
            if(formErrorMessage) formErrorMessage.style.display = 'none';

            const formData = new FormData(formAnuncio);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                formSuccessMessage.style.display = 'block';
                formAnuncio.reset(); 
                resetFormFields(); // Resetear también la visibilidad de los campos dinámicos
                window.scrollTo({ top: formAnuncio.offsetTop, behavior: 'smooth' });

                setTimeout(() => {
                    formSuccessMessage.style.display = 'none';
                }, 6000);
            })
            .catch(error => {
                formErrorMessage.style.display = 'block';
                console.error(error);
                setTimeout(() => {
                    formErrorMessage.style.display = 'none';
                }, 6000);
            });
        });
    }

    // --- Lógica para previsualización de imagen (básica) ---
    const imagemAnuncioInput = document.getElementById('imagem_anuncio');
    const imagePreviewMessage = document.getElementById('image-preview-message');

    if (imagemAnuncioInput && imagePreviewMessage) {
        imagemAnuncioInput.addEventListener('change', () => {
            if (imagemAnuncioInput.files && imagemAnuncioInput.files[0]) {
                imagePreviewMessage.textContent = `Arquivo selecionado: ${imagemAnuncioInput.files[0].name}`;
                imagePreviewMessage.style.display = 'block';
            } else {
                imagePreviewMessage.textContent = ''; // Limpiar mensaje si no hay archivo
                imagePreviewMessage.style.display = 'none';
            }
        });
    }


    // --- LÓGICA PARA A ETIQUETA "NOVO" ---
    const checkNewTags = () => {
        const cards = document.querySelectorAll('.card-causa');
        const now = new Date();
        const fortyEightHours = 48 * 60 * 60 * 1000; // 48 horas em milissegundos

        cards.forEach(card => {
            const pubDateString = card.dataset.publicationDate;
            if (pubDateString) {
                const pubDate = new Date(pubDateString);
                const timeDiff = now.getTime() - pubDate.getTime();

                if (timeDiff <= fortyEightHours) {
                    const newTag = card.querySelector('.new-tag');
                    if (newTag) {
                        newTag.style.display = 'block';
                    }
                }
            }
        });
    };

    checkNewTags(); // Executa a função ao carregar a página

});

// --- LÓGICA PARA O PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});