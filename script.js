// Contenido para blog_script.js

document.addEventListener('DOMContentLoaded', () => {
    const blogPage = document.querySelector('.blog-content');
    if (!blogPage) return; // Si no es la página del blog, no hace nada

    const featuredContainer = document.getElementById('featured-post-section');
    const postsContainer = document.getElementById('posts-section');
    const galleryContainer = document.getElementById('gallery-section');
    const filterLinks = document.querySelectorAll('.filter-link');
    const allPostsTitle = Array.from(document.querySelectorAll('h2.section-title span')).find(el => el.textContent.includes('Todas as Publicações'));

    if (!featuredContainer || !postsContainer || !galleryContainer || !filterLinks.length) {
        console.error('Falta uno o más elementos clave en el HTML del blog.');
        return;
    }

    let allPosts = [];

    const fetchData = async (url) => {
        try {
            const response = await fetch(`${url}?t=${new Date().getTime()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Falha ao carregar ${url}:`, error);
            return null;
        }
    };

    const createPostCardHTML = (post) => {
        const postDate = new Date(post.date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
        return `
            <div class="card-body">
                <p class="post-category">${post.category}</p>
                <h5 class="card-title">${post.title}</h5>
                <p class="card-meta">Publicado em: ${postDate}</p>
                <p class="card-text">${post.summary}</p>
                <a href="#" class="btn btn-outline-primary read-more-btn mt-auto">Ler Artigo Completo</a>
            </div>`;
    };

    const updateView = (filter = 'all') => {
        const isGallery = filter === 'galeria';

        galleryContainer.style.display = isGallery ? 'flex' : 'none';
        postsContainer.style.display = isGallery ? 'none' : 'flex';
        if (allPostsTitle) allPostsTitle.parentElement.style.display = isGallery ? 'none' : 'block';

        const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
        if (featuredPost) {
            const showFeatured = !isGallery && (filter === 'all' || featuredPost.category.toLowerCase() === filter);
            featuredContainer.style.display = showFeatured ? 'block' : 'none';
        }

        document.querySelectorAll('.blog-post-item').forEach(item => {
            item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
        });
    };

    const initializeBlog = async () => {
        const blogData = await fetchData('/_dados/blog.json');
        const galleryData = await fetchData('/_dados/galeria.json');

        if (blogData && blogData.posts) {
            allPosts = blogData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (allPosts.length > 0) {
                const featured = allPosts[0];
                featuredContainer.innerHTML = `
                    <div class="blog-post-card" data-category="${featured.category.toLowerCase()}">
                        <div class="card-img-wrapper"><img class="card-img-top" src="${featured.image}" alt="${featured.title}"></div>
                        ${createPostCardHTML(featured)}
                    </div>`;
            }

            postsContainer.innerHTML = allPosts.slice(1).map(post => `
                <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category.toLowerCase()}">
                    <div class="blog-post-card">
                        <img class="card-img-top" src="${post.image}" alt="${post.title}">
                        ${createPostCardHTML(post)}
                    </div>
                </div>`).join('');
        }

        if (galleryData && galleryData.imagens) {
            galleryContainer.innerHTML = galleryData.imagens.map(item => `
                <div class="col-lg-6 mb-4">
                    <div class="gallery-item">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="caption"><h5>${item.title}</h5><p>${new Date(item.date).toLocaleDateString("pt-PT")}</p></div>
                    </div>
                </div>`).join('');
        }

        updateView('all');
    };

    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            updateView(e.currentTarget.dataset.target.toLowerCase());
        });
    });

    initializeBlog();
});