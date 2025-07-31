/*
  JavaScript Principal para PortugalApoia.com (Versión Dinámica)
  -----------------------------------------------------------------
  Este script ahora carga el contenido desde el archivo 'contenido.js'
  y lo renderiza en la página correspondiente.
*/

// Se ejecuta cuando el contenido del DOM ha sido cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE CARGA DE CONTENIDO DINÁMICO ---
    const pathname = window.location.pathname.split('/').pop();

    if (document.getElementById('listing-container')) {
        let tipo, dataKey;
        switch (pathname) {
            case 'doacoes.html': tipo = 'doacoes'; dataKey = 'anuncios.doacoes'; break;
            case 'empregos.html': tipo = 'emprego'; dataKey = 'anuncios.emprego'; break;
            case 'servicos.html': tipo = 'servico'; dataKey = 'anuncios.servicios'; break;
            case 'habitacao.html': tipo = 'habitacao'; dataKey = 'anuncios.habitacao'; break;
        }
        if(tipo) renderizarAnuncios(tipo, dataKey);
    }

    function renderizarAnuncios(tipo, dataKey) {
        const container = document.getElementById('listing-container');
        if (!container) return;

        const items = dataKey.split('.').reduce((o, i) => o[i], TODO_EL_CONTENIDO);
        container.innerHTML = ''; // Limpiar contenedor

        if (!items || items.length === 0) {
            container.innerHTML = '<p style="text-align: center; width: 100%;">De momento, não há anúncios nesta categoria.</p>';
            return;
        }

        items.forEach(item => {
            let cardHTML = '';
            switch (tipo) {
                case 'doacoes':
                    cardHTML = `
                        <div class="card-causa text-only" data-item-type="${item.tipo_item}" data-location="${item.ciudad}">
                            <div class="card-header">
                                <span class="card-tag card-tag-artigos">Pedido de Artigos</span>
                                <span class="card-id">#DOA-${String(item.id).padStart(3, '0')}</span>
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">${item.titulo}</h3>
                                <p class="card-description">${item.descripcion}</p>
                                <a href="mailto:${item.contacto_email}?subject=Resposta ao anúncio: ${item.titulo}" class="button button-primary button-fullwidth">Quero Ajudar! (Contactar)</a>
                            </div>
                        </div>`;
                    break;
                case 'emprego':
                     cardHTML = `
                        <div class="card-causa" data-city="${item.ciudad}">
                            <div class="card-image-container"><img src="${item.imagen_url}" alt="${item.titulo}" class="card-image" loading="lazy"></div>
                            <div class="card-header">
                                <span class="card-tag card-tag-emprego">Vaga de Emprego</span>
                                <span class="card-id">#EMP-${String(item.id).padStart(3, '0')}</span>
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">${item.titulo}</h3>
                                <p class="card-description">${item.descripcion}</p>
                                <p class="card-description">${item.contacto}</p>
                            </div>
                        </div>`;
                    break;
                case 'servico':
                    cardHTML = `
                        <div class="card-causa" data-service="${item.categoria}" data-city="${item.ciudad}">
                            <div class="card-image-container"><img src="${item.imagen_url}" alt="${item.titulo}" class="card-image"></div>
                            <div class="card-header"><span class="card-tag card-tag-servico">${item.categoria}</span><span class="card-id">#SER-${String(item.id).padStart(3, '0')}</span></div>
                            <div class="card-content">
                                <h3 class="card-title">${item.titulo}</h3>
                                <p class="card-description">${item.descripcion}</p>
                                <p class="card-description">${item.contacto}</p>
                            </div>
                        </div>`;
                    break;
                case 'habitacao':
                     cardHTML = `
                        <div class="card-causa" data-type="${item.tipo}" data-city="${item.ciudad}">
                            <div class="card-image-container"><img src="${item.imagen_url}" alt="${item.titulo}" class="card-image" loading="lazy"></div>
                            <div class="card-header">
                                <span class="card-tag card-tag-servico">${item.tipo}</span>
                                <span class="card-id">#HAB-${String(item.id).padStart(3, '0')}</span>
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">${item.titulo}</h3>
                                <p class="card-description">${item.descripcion}</p>
                                <p class="card-description"><strong>Valor:</strong> ${item.precio}</p>
                                <p class="card-description">${item.contacto}</p>
                            </div>
                        </div>`;
                    break;
            }
            container.innerHTML += cardHTML;
        });
    }

    // --- MANTENEMOS LA FUNCIONALIDAD ORIGINAL DEL SITIO ---
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
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const noResultsMessage = document.getElementById('no-results-message');
        searchInput.addEventListener('keyup', () => {
            const searchText = searchInput.value.toLowerCase().trim();
            const allCards = document.querySelectorAll('.causas-grid .card-causa');
            let visibleCount = 0;
            allCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                const isMatch = cardText.includes(searchText);
                card.style.display = isMatch ? 'flex' : 'none';
                if(isMatch) visibleCount++;
            });
            if (noResultsMessage) noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    }

    if (!localStorage.getItem('cookieConsent')) {
        const consentBanner = document.createElement('div');
        consentBanner.className = 'cookie-banner';
        consentBanner.innerHTML = `<span>Este site utiliza cookies para melhorar a sua experiência.</span><button id="accept-cookie-btn">Aceitar</button>`;
        document.body.appendChild(consentBanner);
        document.getElementById('accept-cookie-btn').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            consentBanner.style.display = 'none';
        });
    }
    
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    });
});