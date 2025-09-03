document.addEventListener('DOMContentLoaded', () => {
    // --- FUNCIÓN CORREGIDA Y SEGURA PARA CREAR LAS TARJETAS ---
    function renderCard(item, category) {
        // Imagen de respaldo
        const defaultImagePlaceholder = '<div class="image-placeholder"></div>';
        let imageUrl = item.imagem || item.logo_empresa || (item.imagens && item.imagens.length > 0 ? item.imagens[0].imagem_url : null);

        const imageHtml = imageUrl
            ? `<img src="${imageUrl}" class="card-img-top" alt="${item.titulo || 'Anuncio'}">`
            : defaultImagePlaceholder;

        // --- CORRECCIÓN IMPORTANTE ---
        // Se verifica que 'link_contato' exista ANTES de intentar usar '.replace()'
        const emailAddress = item.link_contato ? String(item.link_contato).replace(/^mailto:/, '') : null;

        // HTML para los detalles de contacto
        const contatoHtml = `
            <div class="card-contact-details">
                ${item.contato ? `
                <a href="tel:${item.contato}" class="contact-link" title="Contactar por Teléfono">
                    <i class="fas fa-phone-alt"></i>
                    <span>${item.contato}</span>
                </a>` : ''}
                ${emailAddress ? `
                <a href="mailto:${emailAddress}" class="contact-link" title="Contactar por Email">
                    <i class="fas fa-envelope"></i>
                    <span>Email</span>
                </a>` : ''}
            </div>
        `;

        // Estructura final de la tarjeta
        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 card-anuncio-personalizado">
                ${imageHtml}
                <div class="card-body">
                    <h5 class="card-title">${item.titulo || 'Título no disponible'}</h5>
                    <h6 class="card-subtitle mb-3 text-muted">
                        <i class="fas fa-map-marker-alt"></i> ${item.localizacao || 'Ubicación no disponible'}
                    </h6>
                    ${contatoHtml}
                </div>
            </div>
        </div>`;
    }

    // El resto del script original para cargar y mostrar los datos
    const categories = ['empregos', 'doacoes', 'habitacao', 'servicos'];
    const allData = {};

    function fetchData(category) {
        return fetch(`/_dados/${category}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allData[category] = data.items;
            })
            .catch(error => console.error(`Could not fetch ${category}:`, error));
    }

    function displayData(filter = 'all') {
        const container = document.getElementById('announcements-container');
        if (!container) return;
        
        container.innerHTML = '';
        let itemsToShow = [];

        if (filter === 'all') {
            categories.forEach(category => {
                if (allData[category]) {
                    itemsToShow = itemsToShow.concat(allData[category]);
                }
            });
        } else {
            if (allData[filter]) {
                itemsToShow = allData[filter];
            }
        }
        
        // Ordena aleatoriamente para variar la presentación
        itemsToShow.sort(() => 0.5 - Math.random());

        itemsToShow.forEach(item => {
            const category = 'servicos'; // Asume una categoría por defecto si no está definida
            container.innerHTML += renderCard(item, category);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            displayData(filter);
        });
    });

    // Carga inicial de todos los datos
    Promise.all(categories.map(fetchData)).then(() => displayData('all'));
});