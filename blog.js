document.addEventListener("DOMContentLoaded", async () => {
    const featuredArticleContainer = document.getElementById('featured-article-container');
    const articlesGrid = document.getElementById('articles-grid');
    const galleryGrid = document.getElementById('gallery-grid');
    const navLinks = document.querySelectorAll('#blog-nav-categories .nav-link');
    
    let allPosts = [];
    let galleryImages = [];

    // Función para cargar los datos JSON
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    }

    // Función para renderizar un artículo destacado
    function renderFeaturedArticle(post) {
        if (!post) return '';
        return `
            <article class="featured-article" data-category="${post.category.toLowerCase()}">
                <img src="${post.image}" alt="${post.title}">
                <div class="featured-content">
                    <span class="category-tag">${post.category}</span>
                    <h3>${post.title}</h3>
                    <p class="summary">${post.summary}</p>
                    <a href="#" class="read-more" onclick="alert('Ir a la página del artículo: ${post.title}')">Leer más &rarr;</a>
                </div>
            </article>
        `;
    }

    // Función para renderizar las tarjetas de los artículos
    function renderArticleCard(post) {
        return `
            <article class="article-card" data-category="${post.category.toLowerCase()}">
                <img src="${post.image}" alt="${post.title}" class="article-img">
                <div class="article-content">
                    <span class="category-tag">${post.category}</span>
                    <h3>${post.title}</h3>
                    <p class="summary">${post.summary}</p>
                    <a href="#" class="read-more" onclick="alert('Ir a la página del artículo: ${post.title}')">Leer más &rarr;</a>
                </div>
            </article>
        `;
    }

    // Función para renderizar los elementos de la galería
    function renderGalleryItem(image) {
        return `
            <div class="gallery-item">
                <a href="${image.image}" data-lightbox="gallery" data-title="${image.caption}">
                    <img src="${image.image}" alt="${image.title}">
                </a>
            </div>
        `;
    }

    // Función principal para cargar y mostrar todo el contenido
    async function loadContent() {
        const blogData = await fetchData('/_dados/blog.json');
        const galleryData = await fetchData('/_dados/galeria.json');

        if (blogData && blogData.posts) {
            allPosts = blogData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderPosts('all');
        } else {
            articlesGrid.innerHTML = '<p class="text-center">No se pudieron cargar los artículos del blog.</p>';
        }

        if (galleryData && galleryData.imagens) {
            galleryImages = galleryData.imagens;
            // No renderizamos la galería aquí, la mostramos solo al hacer clic en el filtro
        } else {
            galleryGrid.innerHTML = '<p class="text-center">No se pudo cargar la galería.</p>';
        }
    }

    // Lógica para renderizar los posts según la categoría
    function renderPosts(category) {
        featuredArticleContainer.innerHTML = '';
        articlesGrid.innerHTML = '';
        
        const postsToRender = category === 'all'
            ? allPosts
            : allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
        
        if (postsToRender.length > 0) {
            // Renderizar el artículo destacado (el más reciente)
            const featuredPost = postsToRender[0];
            featuredArticleContainer.innerHTML = renderFeaturedArticle(featuredPost);

            // Renderizar el resto de artículos en la cuadrícula
            const otherPosts = postsToRender.slice(1);
            articlesGrid.innerHTML = otherPosts.map(renderArticleCard).join('');
        } else {
            articlesGrid.innerHTML = `<p class="text-center w-100">No hay artículos en la categoría "${category}".</p>`;
        }
    }

    // Lógica para renderizar la galería
    function renderGallery() {
        articlesGrid.style.display = 'none';
        featuredArticleContainer.style.display = 'none';
        galleryGrid.style.display = 'grid';
        galleryGrid.innerHTML = galleryImages.map(renderGalleryItem).join('');
    }

    // Manejar el clic en los filtros de categoría
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            const targetCategory = link.dataset.category;
            if (targetCategory === 'galeria') {
                renderGallery();
            } else {
                articlesGrid.style.display = 'grid';
                featuredArticleContainer.style.display = 'block';
                galleryGrid.style.display = 'none';
                renderPosts(targetCategory);
            }
        });
    });

    // Iniciar la carga del contenido
    loadContent();
});