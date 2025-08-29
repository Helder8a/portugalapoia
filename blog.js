// ==================================================================
// === CÓDIGO DEFINITIVO Y MEJORADO para blog.js (Galería Inteligente) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    let allPostsData = [];
    let allPostElements = [];

    async function iniciarBlog() {
        const postsSection = document.getElementById('posts-section');
        const galleryWrapper = document.getElementById('gallery-section-wrapper'); // Usamos el nuevo wrapper
        if (!postsSection || !galleryWrapper) return;

        try {
            const [postsData, galeria] = await Promise.all([
                fetch('/_dados/blog.json').then(res => res.json()),
                fetch('/_dados/galeria.json').then(res => res.json())
            ]);
            
            allPostsData = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            postsSection.innerHTML = allPostsData.map(renderBlogPost).join('');
            
            // Inyectamos el HTML de la galería en su sección
            const gallerySection = galleryWrapper.querySelector('#gallery-section');
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            allPostElements = document.querySelectorAll('.blog-post-item');
            
            setupBlogFunctionality();
            setupIntelligentGallery(); // Nueva función para la galería
            if (window.lightbox) window.lightbox.init();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsSection.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações.</p></div>`;
        }
    }

    // --- RENDERIZADO DE LA GALERÍA (MODIFICACIÓN CLAVE) ---
    function renderGalleryItem(item) {
        // ¡IMPORTANTE! Hemos eliminado el wrapper de Bootstrap "col-md-6".
        // Ahora solo generamos el elemento puro que nuestro CSS Grid necesita.
        return `
            <div class="gallery-item">
                <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="caption">${item.title}</div>
                </a>
            </div>`;
    }

    // --- NUEVA FUNCIÓN: GALERÍA INTELIGENTE ---
    function setupIntelligentGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                // Función que se ejecuta cuando la imagen se carga
                const applySizeClass = () => {
                    const ratio = img.naturalHeight / img.naturalWidth;
                    if (ratio > 1.3) { // Si es significativamente alta (retrato)
                        item.classList.add('tall');
                    } else if (ratio < 0.7) { // Si es significativamente ancha (paisaje)
                        item.classList.add('short');
                    }
                };

                if (img.complete) {
                    applySizeClass();
                } else {
                    img.addEventListener('load', applySizeClass);
                }
            }
        });
    }

    // --- FUNCIONALIDAD DEL BLOG (SIN CAMBIOS GRANDES) ---
    // (Pega aquí el resto de tus funciones de blog.js: renderBlogPost, createSocialShareLinks, etc.)
    // La única modificación es cómo mostramos/ocultamos la galería
    function setupBlogFunctionality() {
        // ... (código existente para lazy loading, read-more, etc.)
        document.querySelectorAll('img.lazy').forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
        allPostElements.forEach(calculateReadingTime);
        document.querySelectorAll('.read-more-btn').forEach(button => { /* ... (tu código) ... */ });

        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const galleryWrapper = document.getElementById('gallery-section-wrapper');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                const targetCategory = e.target.getAttribute('data-target');

                if (targetCategory === 'galeria') {
                    postsSection.style.display = 'none';
                    galleryWrapper.style.display = 'block'; // Mostramos el wrapper
                } else {
                    postsSection.style.display = 'flex'; // Bootstrap usa flex para 'row'
                    galleryWrapper.style.display = 'none';
                    filterAndShowPosts();
                }
            });
        });
        
        // ... (resto de tus funciones: filterAndShowPosts, calculateReadingTime, etc.)
    }
    
    // (Asegúrate de tener el resto de tus funciones aquí: renderBlogPost, createSocialShareLinks, renderRelatedPosts, calculateReadingTime, filterAndShowPosts, etc.)
    
    iniciarBlog();
});

// Pega aquí el resto de tus funciones de blog.js que no he incluido para no hacer el código tan largo.
// Las funciones importantes que debes tener son: renderBlogPost, createSocialShareLinks, renderRelatedPosts,
// calculateReadingTime, filterAndShowPosts.