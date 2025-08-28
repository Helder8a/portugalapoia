document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTOS PRINCIPALES ---
    const blogListContainer = document.querySelector('.blog-list-container');
    const postContentDiv = document.getElementById('post-content');

    // Si no estamos en la página del blog, no hacemos nada más.
    if (!blogListContainer && !postContentDiv) {
        return;
    }

    // --- VARIABLES GLOBALES ---
    let allPosts = [];

    // --- LÓGICA PRINCIPAL ---
    fetch('_dados/blog.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            allPosts = data.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));

            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('post');

            if (postId && postContentDiv) {
                const post = allPosts.find(p => p.id === postId);
                if (post) {
                    renderBlogPost(post);
                } else {
                    displayNotFound();
                }
            } else if (blogListContainer) {
                renderBlogList(allPosts);
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del blog:', error);
            if (blogListContainer) {
                 blogListContainer.innerHTML = "<p>Ocurrió un error al cargar los artículos. Por favor, intente más tarde.</p>";
            }
        });

    // --- FUNCIONES DE RENDERIZADO ---

    /**
     * Muestra la lista principal de artículos del blog.
     */
    function renderBlogList(posts) {
        const postsContainer = document.getElementById('posts');
        if (!postsContainer) return;
        
        postsContainer.innerHTML = posts.map(post => {
            // Añadimos el campo image_alt o usamos el título como fallback
            const imageAlt = post.image_alt || post.title; 
            return `
            <div class="post" data-category="${post.category}">
                <img src="${post.image}" alt="${imageAlt}" class="post-image">
                <div class="post-content">
                    <h3 class="post-title" data-title="${post.title}">${post.title}</h3>
                    <p class="post-meta">
                        <i class="fas fa-calendar-alt"></i> ${post.date}
                    </p>
                    <p class="post-excerpt">${post.summary}</p>
                    <a href="blog.html?post=${post.id}" class="read-more">Ler Mais</a>
                </div>
            </div>
        `}).join('');
        
        setupFilters(); // Inicializar filtros después de renderizar
    }
    
    /**
     * Muestra un único artículo del blog y aplica todas las mejoras SEO.
     */
    function renderBlogPost(post) {
        if (blogListContainer) blogListContainer.style.display = 'none';
        postContentDiv.style.display = 'block';

        const fullContent = marked.parse(post.content);
        const imageAlt = post.image_alt || post.title;

        // --- INICIO DE TODAS LAS MEJORAS SEO ---
        
        // 1. Título y Meta Descripción
        document.title = `${post.title} | PortugalApoia Blog`;
        updateMetaTag('name', 'description', post.summary);
        
        // 2. URL Canónica
        const canonicalUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
        updateLinkTag('rel', 'canonical', canonicalUrl);

        // 3. Open Graph (para redes sociales)
        updateMetaTag('property', 'og:title', post.title);
        updateMetaTag('property', 'og:description', post.summary);
        updateMetaTag('property', 'og:type', 'article');
        updateMetaTag('property', 'og:url', canonicalUrl);
        updateMetaTag('property', 'og:image', `${window.location.origin}/${post.image}`);
        updateMetaTag('property', 'og:site_name', 'PortugalApoia');
        
        // 4. Schema Markup (Datos Estructurados para Google)
        updateSchema(post, canonicalUrl);
        
        // --- FIN DE TODAS LAS MEJORAS SEO ---

        postContentDiv.innerHTML = `
            <h1>${post.title}</h1>
            <p class="post-meta">
                <i class="fas fa-user"></i> ${post.author} &nbsp;&nbsp;
                <i class="fas fa-calendar-alt"></i> ${post.date}
            </p>
            <img src="${post.image}" alt="${imageAlt}" class="post-image-full">
            <div class="full-content">${fullContent}</div>
            <div class="social-share">${createSocialShareLinks(post)}</div>
            <h3 class="related-title">Artigos Relacionados</h3>
            <div id="related-posts"></div>
            <a href="blog.html" class="back-to-blog"><i class="fas fa-arrow-left"></i> Voltar ao Blog</a>
        `;
        
        renderRelatedPosts(post.category, post.id);
    }
    
    /**
     * Muestra un mensaje si el post no se encuentra.
     */
    function displayNotFound() {
        if (blogListContainer) blogListContainer.style.display = 'none';
        postContentDiv.innerHTML = '<h2>Artigo não encontrado</h2><p>O artigo que você está procurando não existe ou foi movido.</p><a href="blog.html" class="back-to-blog">Voltar ao Blog</a>';
        postContentDiv.style.display = 'block';
    }


    // --- FUNCIONES DE SOPORTE Y SEO ---

    /**
     * Función genérica para crear o actualizar una metaetiqueta.
     */
    function updateMetaTag(attr, value, content) {
        let element = document.querySelector(`meta[${attr}="${value}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, value);
            document.head.appendChild(element);
        }
        element.content = content;
    }

    /**
     * Función genérica para crear o actualizar una etiqueta link.
     */
    function updateLinkTag(attr, value, href) {
        let element = document.querySelector(`link[${attr}="${value}"]`);
        if (!element) {
            element = document.createElement('link');
            element.setAttribute(attr, value);
            document.head.appendChild(element);
        }
        element.href = href;
    }

    /**
     * Crea o actualiza el script de Schema para el artículo.
     */
    function updateSchema(post, url) {
        const oldSchema = document.getElementById('article-schema');
        if (oldSchema) oldSchema.remove();

        const schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": { "@type": "WebPage", "@id": url },
            "headline": post.title,
            "image": `${window.location.origin}/${post.image}`,
            "author": { "@type": "Person", "name": post.author },
            "publisher": {
                "@type": "Organization",
                "name": "PortugalApoia",
                "logo": { "@type": "ImageObject", "url": `${window.location.origin}/images_pta/logocuadrado.jpg` }
            },
            "datePublished": new Date(post.date.split('/').reverse().join('-')).toISOString(),
            "description": post.summary
        };

        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.id = 'article-schema';
        schemaScript.text = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
    }

    /**
     * Configura los filtros de búsqueda y categoría.
     */
    function setupFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryLinks = document.querySelectorAll('.category-link');

        const filterAction = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const selectedCategory = document.querySelector('.category-link.active').dataset.category;
            
            document.querySelectorAll('#posts .post').forEach(postElement => {
                const title = postElement.querySelector('.post-title').textContent.toLowerCase();
                const category = postElement.dataset.category;

                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

                postElement.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
            });
        };

        searchInput.addEventListener('input', filterAction);
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                filterAction();
            });
        });
    }
    
    function createSocialShareLinks(post) {
        const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
        const text = `Confira este artigo: ${post.title}`;
        return `
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank"><i class="fab fa-twitter"></i></a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.summary)}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}" target="_blank"><i class="fab fa-whatsapp"></i></a>
        `;
    }

    function renderRelatedPosts(category, currentPostId) {
        const relatedPostsDiv = document.getElementById('related-posts');
        if (!relatedPostsDiv) return;
        
        const related = allPosts.filter(p => p.category === category && p.id !== currentPostId).slice(0, 3);
        relatedPostsDiv.innerHTML = related.map(p => `
            <div class="related-post">
                <a href="blog.html?post=${p.id}">
                    <img src="${p.image}" alt="${p.title}">
                    <h4>${p.title}</h4>
                </a>
            </div>
        `).join('');
    }
});