// ==================================================================
// === FUNCIÓN CORREGIDA Y DEFINITIVA para blog.js ===
// ==================================================================

function renderGalleryItem(item) {
    // Se genera una estructura de columna de Bootstrap limpia (col-lg-4 col-md-6)
    // El enlace <a> (con la clase .gallery-item) contiene todo el diseño.
    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}" class="gallery-item">
            <img class="gallery-item-img" src="${item.image}" alt="${item.title}">
            <div class="gallery-item-overlay">
                <div class="gallery-item-text">
                    <h3 class="gallery-item-title">${item.title}</h3>
                    <p class="gallery-item-caption">${item.caption}</p>
                </div>
            </div>
        </a>
    </div>`;
}