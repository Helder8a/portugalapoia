// --- CÓDIGO FINAL Y CORREGIDO para blog.js ---
document.addEventListener("DOMContentLoaded", () => {
    // Función para esperar que carregarConteudo esté disponible
    function onScriptReady(callback) {
        if (window.carregarConteudo) {
            callback();
        } else {
            setTimeout(() => onScriptReady(callback), 50);
        }
    }

    // Calcula el tiempo de lectura
    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');
        if (content && timePlaceholder) {
            const text = content.textContent || content.innerText;
            const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const wordsPerMinute = 225;
            const readingTime = Math.ceil(wordCount / wordsPerMinute);
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    // Renderiza cada post del blog
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        const processedBody = marked.parse(post.body || '', { gfm: true });

        // Clase para una sola columna centrada: col-lg-8 offset-lg-2
        return `
        <div class="col-lg-8 offset-lg-2 col-md-12 blog-post-item" data-category="${post.category}">
            <div class="blog-post-card">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <div class="post-meta">
                        <span>${formattedDate}</span>
                        <span class="separator">|</span>
                        <span class="reading-time"></span>
                    </div>
                    <figure class="post-image-container">
                        <img class="lazy" data-src="${post.image}" alt="${post.title}">
                        <figcaption>${imageCaption}</figcaption>
                    </figure>
                    <p class="card-text summary-content">${post.summary}</p>
                    <div class="full-content">${processedBody}</div>
                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                </div>
            </div>
        </div>`;
    }

    // Funciones para la galería y la interactividad (sin cambios)
    function renderGalleryItem(item) { /* ... */ }
    function setupBlogFunctionality() { /* ... */ }
    async function carregarBlog() { /* ... */ }
    
    // (Pega aquí el resto de las funciones renderGalleryItem, setupBlogFunctionality y carregarBlog de la versión anterior, ya que no necesitan cambios)

    onScriptReady(() => {
        carregarBlog();
    });
});