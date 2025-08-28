// Reemplaza esta función en tu fichero blog.js

function renderGalleryItem(item) {
    return `
    <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}" class="gallery-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="caption-overlay">
            <h3 class="gallery-title">${item.title}</h3>
            <p class="gallery-caption">${item.caption}</p>
        </div>
    </a>`;
}