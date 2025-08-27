// --- CÓDIGO FINAL Y CORRECTO para blog.js (Con todas las mejoras) ---

document.addEventListener("DOMContentLoaded", () => {
    // Función de ayuda para esperar a que el script.js principal cargue sus funciones
    function onScriptReady(callback) {
        if (window.carregarConteudo) {
            callback();
        } else {
            setTimeout(() => onScriptReady(callback), 50);
        }
    }

    /**
     * Calcula y muestra el tiempo de lectura para cada post.
     * @param {HTMLElement} postElement - El elemento del post que contiene el contenido.
     */
    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');

        if (content && timePlaceholder) {
            const text = content.textContent || content.innerText; // Usar textContent para obtener solo el texto
            const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const wordsPerMinute = 225;
            const readingTime = Math.ceil(wordCount / wordsPerMinute);
            
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    /**
     * Genera el HTML para una única publicación del blog con las nuevas características.
     * @param {object} post - El objeto del post con título, fecha, imagen, etc.
     * @returns {string} - La cadena de HTML para la tarjeta del post.
     */
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        
        // ======> INICIO DEL CAMBIO CLAVE <======
        // Usamos la librería 'marked' para convertir el cuerpo del post de Markdown a HTML.
        // Se usa `marked.parse()` que está disponible gracias al script que añadimos en blog.html.
        // La opción `gfm: true` permite un markdown más flexible (como el de GitHub).
        const processedBody = marked.parse(post.body || '', { gfm: true });
        // ======> FIN DEL CAMBIO CLAVE <======

        return `
        <div class="col-12 blog-post-item" data-category="${post.category}">
            <div class="blog-post-card">
                <figure class="post-image-container">
                    <img class="lazy" data-src="${post.image}" alt="${post.title}">
                    <figcaption>${imageCaption}</figcaption>
                </figure>
                
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    
                    <div class="post-meta">
                        <span>${formattedDate}</span>
                        <span class="separator">|</span>
                        <span class="reading-time">
                            </span>
                    </div>

                    <p class="card-text summary-content">${post.summary}</p>
                    
                    <div class="full-content" style="display: none;">
                        ${processedBody}
                    </div>

                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                </div>
            </div>
        </div>`;
    }

    // El resto del archivo `blog.js` se mantiene exactamente igual que en la versión anterior.
    // ... (incluir el resto de funciones: renderGalleryItem, setupBlogFunctionality, carregarBlog, etc.)

    function renderGalleryItem(item) {
        return `<div class="col-lg-6 col-md-12 mb-4"><div class="gallery-item"><a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}"><img class="lazy" data-src="${item.image}" alt="${item.title}"></a></div></div>`;
    }

    function setupBlogFunctionality() {
        const postsSection = document.getElementById('posts-section');
        const allPosts = postsSection.querySelectorAll('.blog-post-item');

        allPosts.forEach(post => {
            calculateReadingTime(post);
        });

        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.blog-post-card');
                const summary = card.querySelector('.summary-content');
                const fullContent = card.querySelector('.full-content');
                if (summary && fullContent) {
                    summary.style.display = 'none';
                    fullContent.style.display = 'block';
                    e.target.style.display = 'none';
                }
            });
        });

        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const gallerySection = document.getElementById('gallery-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                const targetCategory = e.target.getAttribute('data-target');

                if (targetCategory === 'galeria') {
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    postsSection.style.display = 'flex';
                    gallerySection.style.display = 'none';
                    allPosts.forEach(post => {
                        post.style.display = (targetCategory === 'all' || post.dataset.category === targetCategory) ? 'block' : 'none';
                    });
                }
            });
        });
    }

    async function carregarBlog() {
        await Promise.all([
            window.carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'posts'),
            window.carregarConteudo('/_dados/galeria.json', 'gallery-section', renderGalleryItem, 'imagens')
        ]);
        
        setupBlogFunctionality();
    }

    onScriptReady(() => {
        carregarBlog();
    });
});