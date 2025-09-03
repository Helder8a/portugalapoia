// ==========================================================================
// SCRIPT DEFINITIVO Y SEGURO PARA PORTUGALAPOIA
// Versión a prueba de errores que no bloquea la carga de la página.
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Función segura para crear la tarjeta HTML de un anuncio.
     * Comprueba si los datos existen antes de intentar mostrarlos.
     */
    function renderCard(item) {
        // Si el 'item' no es válido, no se crea la tarjeta.
        if (!item) {
            return '';
        }

        // --- IMAGEN (con respaldo) ---
        const imageUrl = item.imagem || item.logo_empresa || null;
        const imageHtml = imageUrl
            ? `<img src="${imageUrl}" class="card-img-top" alt="${item.titulo || 'Anuncio'}">`
            : '<div class="image-placeholder"></div>'; // Espacio reservado si no hay imagen

        // --- TÍTULO (con respaldo) ---
        const titulo = item.titulo || 'Título no disponible';

        // --- LOCALIZACIÓN (con respaldo) ---
        const localizacao = item.localizacao || 'Ubicación no disponible';

        // --- CONTACTOS (con comprobaciones de seguridad) ---
        let contatoHtml = '';
        const hasTelefone = item.contato;
        // Comprueba que 'link_contato' sea una cadena de texto antes de usarlo
        const hasEmail = item.link_contato && typeof item.link_contato === 'string';

        if (hasTelefone || hasEmail) {
            contatoHtml = '<div class="card-contact-details">';
            if (hasTelefone) {
                contatoHtml += `
                    <a href="tel:${item.contato}" class="contact-link" title="Contactar por Teléfono">
                        <i class="fas fa-phone-alt"></i>
                        <span>${item.contato}</span>
                    </a>`;
            }
            if (hasEmail) {
                const emailAddress = item.link_contato.replace(/^mailto:/, '');
                contatoHtml += `
                    <a href="mailto:${emailAddress}" class="contact-link" title="Contactar por Email">
                        <i class="fas fa-envelope"></i>
                        <span>Email</span>
                    </a>`;
            }
            contatoHtml += '</div>';
        }

        // --- ESTRUCTURA FINAL DE LA TARJETA ---
        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 card-anuncio-personalizado">
                ${imageHtml}
                <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <h6 class="card-subtitle mb-3 text-muted">
                        <i class="fas fa-map-marker-alt"></i> ${localizacao}
                    </h6>
                    ${contatoHtml}
                </div>
            </div>
        </div>`;
    }

    // --- LÓGICA PARA CARGAR Y MOSTRAR LOS DATOS (sin cambios) ---
    const categories = ['empregos', 'doacoes', 'habitacao', 'servicos'];
    const allData = {};

    function fetchData(category) {
        return fetch(`/_dados/${category}.json`)
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar ${category}.json`);
                return response.json();
            })
            .then(data => {
                allData[category] = data.items || []; // Asegura que sea un array
            })
            .catch(error => {
                console.error(`No se pudo obtener la categoría ${category}:`, error);
                allData[category] = []; // En caso de error, define un array vacío
            });
    }

    function displayData(filter = 'all') {
        const container = document.getElementById('announcements-container');
        if (!container) return;

        container.innerHTML = '';
        let itemsToShow = [];

        if (filter === 'all') {
            categories.forEach(category => {
                itemsToShow = itemsToShow.concat(allData[category] || []);
            });
        } else {
            itemsToShow = allData[filter] || [];
        }
        
        // Bucle seguro: si una tarjeta da error, no detiene las demás
        itemsToShow.forEach(item => {
            try {
                container.innerHTML += renderCard(item);
            } catch (e) {
                console.error("Error al renderizar una tarjeta:", item, e);
            }
        });
    }

    // --- FILTROS (sin cambios) ---
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