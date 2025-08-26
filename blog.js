document.addEventListener('DOMContentLoaded', () => {
    const articlesGrid = document.getElementById('articles-grid');
    const galleryGrid = document.getElementById('gallery-grid');
    const navLinks = document.querySelectorAll('#blog-nav-categories .nav-link');
    
    let blogPosts = [];
    let galleryImages = [];

    // Función para renderizar los artículos del blog
    const renderBlogPosts = (category = 'all') => {
        articlesGrid.innerHTML = '';
        const postsToRender = category === 'all'
            ? blogPosts
            : blogPosts.filter(post => post.category.toLowerCase().trim() === category.toLowerCase().trim());

        postsToRender.forEach(post => {
            const articleCard = document.createElement('article');
            articleCard.className = 'article-card';
            articleCard.dataset.category = post.category.toLowerCase().trim();

            const imagePath = post.image ? post.image : 'https://via.placeholder.com/400x250.png?text=Sin+Imagen';

            articleCard.innerHTML = `
                <img src="${imagePath}" alt="${post.title}" class="article-img">
                <div class="article-content">
                    <span class="category-tag">${post.category}</span>
                    <h3>${post.title}</h3>
                    <p class="summary">${post.summary}</p>
                    <a href="blog/${post.slug}.html" class="read-more">Leer más &rarr;</a>
                </div>
            `;
            articlesGrid.appendChild(articleCard);
        });
    };

    // Función para renderizar la galería
    const renderGallery = () => {
        galleryGrid.innerHTML = '';
        galleryImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <a href="${image.image_path}" data-lightbox="gallery" data-title="${image.description}">
                    <img src="${image.image_path}" alt="${image.description}" class="gallery-img">
                </a>
            `;
            galleryGrid.appendChild(galleryItem);
        });
    };

    // Manejar el clic en los enlaces de navegación para filtrar
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const category = link.dataset.category;
            renderBlogPosts(category);
        });
    });

    // Cargar datos al iniciar la página
    async function fetchData() {
        try {
            const [blogResponse, galleryResponse] = await Promise.all([
                fetch('_dados/blog.json'),
                fetch('_dados/galeria.json')
            ]);
            
            blogPosts = await blogResponse.json();
            galleryImages = await galleryResponse.json();

            // Ordenar los posts por fecha, del más reciente al más antiguo
            blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Renderizar el contenido inicial
            renderBlogPosts('all');
            renderGallery();

        } catch (error) {
            console.error('Error al cargar los datos:', error);
            articlesGrid.innerHTML = '<p>Lo sentimos, no se pudieron cargar los artículos del blog. Inténtalo de nuevo más tarde.</p>';
        }
    }

    fetchData();
});