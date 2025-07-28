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

    // --- LÓGICA DO BUSCADOR COM FILTROS ---
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    const cityFilter = document.getElementById('city-filter');
    const serviceFilter = document.getElementById('service-filter');
    const noResultsMessage = document.getElementById('no-results-message');

    function filterCards() {
        const filterText = searchInput ? searchInput.value.toLowerCase() : '';
        const locationValue = locationFilter ? locationFilter.value : '';
        const typeValue = typeFilter ? typeFilter.value : '';
        const cityValue = cityFilter ? cityFilter.value : '';
        const serviceValue = serviceFilter ? serviceFilter.value : '';

        const cards = document.querySelectorAll('.causas-grid .card-causa');
        let found = false;

        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            const cardLocation = card.dataset.location || '';
            const cardType = card.dataset.type || '';
            const cardCity = card.dataset.city || '';
            const cardService = card.dataset.service || '';

            const textMatch = title.includes(filterText) || description.includes(filterText);
            const locationMatch = locationValue === '' || cardLocation === locationValue;
            const typeMatch = typeValue === '' || cardType === typeValue;
            const cityMatch = cityValue === '' || cardCity === cityValue;
            const serviceMatch = serviceValue === '' || cardService === serviceValue;

            if (textMatch && locationMatch && typeMatch && cityMatch && serviceMatch) {
                card.style.display = 'flex';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResultsMessage) {
            noResultsMessage.style.display = found ? 'none' : 'block';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', filterCards);
    }
    if(locationFilter){
        locationFilter.addEventListener('change', filterCards);
    }
    if(typeFilter){
        typeFilter.addEventListener('change', filterCards);
    }
    if(cityFilter){
        cityFilter.addEventListener('change', filterCards);
    }
    if(serviceFilter){
        serviceFilter.addEventListener('change', filterCards);
    }


    // --- LÓGICA PARA O FORMULÁRIO INTELIGENTE ---
    const tipoAnuncioSelector = document.getElementById('tipo-anuncio-selector');
    const camposHabitacao = document.getElementById('campos-habitacao');
    const precoInput = document.getElementById('preco_habitacao');
    const cidadeInput = document.getElementById('cidade_habitacao');


    if (tipoAnuncioSelector) {
        tipoAnuncioSelector.addEventListener('change', (event) => {
            if (event.target.value === 'habitacao') {
                camposHabitacao.style.display = 'block';
                precoInput.required = true;
                cidadeInput.required = true;
            } else {
                camposHabitacao.style.display = 'none';
                precoInput.required = false;
                cidadeInput.required = false;
            }
        });
    }

    // --- LÓGICA DE CONFIRMAÇÃO DE ENVIO DE ANÚNCIO ---
    const formAnuncio = document.getElementById('form-anuncio');
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', e => {
            e.preventDefault();

            const formData = new FormData(formAnuncio);
            const formSuccessMessage = document.getElementById('form-success-message');

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                if (formSuccessMessage) {
                    formSuccessMessage.style.display = 'block';
                }
                formAnuncio.reset(); 
                window.scrollTo({ top: formAnuncio.offsetTop, behavior: 'smooth' });

                setTimeout(() => {
                    if (formSuccessMessage) {
                        formSuccessMessage.style.display = 'none';
                    }
                }, 6000);
            })
            .catch(error => {
                alert("Ocorreu um erro ao submeter o formulário. Por favor, tente novamente.");
                console.error(error);
            });
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