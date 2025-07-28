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

    // --- LÓGICA DO BUSCADOR COM FILTROS E CARREGAR MAIS ---
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter'); // Para Habitação
    const cityFilter = document.getElementById('city-filter'); // Para Serviços y Empregos (en empregos es location-filter)
    const serviceFilter = document.getElementById('service-filter'); // Para Serviços
    const itemTypeFilter = document.getElementById('item-type-filter'); // Para Doações
    const noResultsMessage = document.getElementById('no-results-message');
    const loadMoreBtn = document.getElementById('load-more-btn');

    let cardsToShowInitially = 3; // **AJUSTE AQUI: Número de tarjetas a mostrar al inicio**
    let cardsToLoadPerClick = 3;  // Número de tarjetas a cargar con cada clic

    let currentVisibleCards = cardsToShowInitially;


    function filterAndDisplayCards() {
        const filterText = searchInput ? searchInput.value.toLowerCase() : '';
        const locationValue = locationFilter ? locationFilter.value.toLowerCase() : ''; // Para Empregos y Doações
        const typeValue = typeFilter ? typeFilter.value.toLowerCase() : ''; // Para Habitação
        const cityValue = cityFilter ? cityFilter.value.toLowerCase() : ''; // Para Serviços y Habitação
        const serviceValue = serviceFilter ? serviceFilter.value.toLowerCase() : ''; // Para Serviços
        const itemTypeValue = itemTypeFilter ? itemTypeFilter.value.toLowerCase() : ''; // Para Doações

        const allCards = document.querySelectorAll('.causas-grid .card-causa');
        let matchingCards = [];

        allCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            const cardLocation = card.dataset.location ? card.dataset.location.toLowerCase() : '';
            const cardType = card.dataset.type ? card.dataset.type.toLowerCase() : '';
            const cardCity = card.dataset.city ? card.dataset.city.toLowerCase() : '';
            const cardService = card.dataset.service ? card.dataset.service.toLowerCase() : '';
            const cardItemType = card.dataset.itemType ? card.dataset.itemType.toLowerCase() : '';

            const textMatch = title.includes(filterText) || description.includes(filterText);

            let filterMatch = true;

            // Lógica de filtrado específica para cada página
            if (window.location.pathname.includes('doacoes.html')) {
                filterMatch = (locationValue === '' || cardLocation === locationValue) &&
                              (itemTypeValue === '' || cardItemType === itemTypeValue);
            } else if (window.location.pathname.includes('empregos.html')) {
                filterMatch = (locationValue === '' || cardLocation === locationValue);
            } else if (window.location.pathname.includes('servicos.html')) {
                filterMatch = (serviceValue === '' || cardService === serviceValue) &&
                              (cityValue === '' || cardCity === cityValue);
            } else if (window.location.pathname.includes('habitacao.html')) {
                filterMatch = (typeValue === '' || cardType === typeValue) &&
                              (cityValue === '' || cardCity === cityValue);
            }

            if (textMatch && filterMatch) {
                matchingCards.push(card);
            }
        });

        // Ocultar todas las tarjetas primero
        allCards.forEach(card => card.style.display = 'none');

        // Mostrar solo las tarjetas que coinciden y hasta el límite actual
        let visibleCount = 0;
        matchingCards.forEach((card, index) => {
            if (index < currentVisibleCards) {
                card.style.display = 'flex';
                visibleCount++;
            }
        });

        // Mostrar u ocultar el mensaje de "no resultados"
        if (noResultsMessage) {
            noResultsMessage.style.display = matchingCards.length === 0 ? 'block' : 'none';
        }

        // Mostrar u ocultar el botón "cargar más"
        if (loadMoreBtn) {
            if (currentVisibleCards < matchingCards.length) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // Inicializar la visualización de tarjetas al cargar la página
    filterAndDisplayCards();

    // Event listeners para filtros
    // Al cambiar un filtro, reiniciar la cuenta de tarjetas visibles
    if (searchInput) searchInput.addEventListener('keyup', () => { currentVisibleCards = cardsToShowInitially; filterAndDisplayCards(); });
    if (locationFilter) locationFilter.addEventListener('change', () => { currentVisibleCards = cardsToShowInitially; filterAndDisplayCards(); });
    if (typeFilter) typeFilter.addEventListener('change', () => { currentVisibleCards = cardsToShowInitially; filterAndDisplayCards(); });
    if (cityFilter) cityFilter.addEventListener('change', () => { currentVisibleCards = cardsToShowInitially; filterAndDisplayCards(); });
    if (serviceFilter) serviceFilter.addEventListener('change', () => { currentVisibleCards = cardsToShowInitially; filterAndDisplayCards(); });
    if (itemTypeFilter) itemTypeFilter.addEventListener('change', () => { currentVisibleCards = cardsToShowInitially; filterAndDisplayCards(); });

    // Event listener para el botón "cargar más"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentVisibleCards += cardsToLoadPerClick;
            filterAndDisplayCards();
        });
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
        camposHabitacao.style.display = 'none';
        precoHabitacaoInput.required = false;
        cidadeHabitacaoInput.required = false;

        camposEmprego.style.display = 'none';
        tipoContratoInput.required = false;
        experienciaEmpregoInput.required = false;
        localEmpregoInput.required = false;

        camposServico.style.display = 'none';
        categoriaServicoInput.required = false;
        areaAtuacaoServicoInput.required = false;
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
            formSuccessMessage.style.display = 'none';
            formErrorMessage.style.display = 'none';

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