// blog-index.js

document.addEventListener('DOMContentLoaded', () => {
    initBlogIndex();
});

async function fetchPosts() {
    try {
        const response = await fetch('/posts.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const posts = await response.json();
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error("Could not fetch posts.json:", error);
        return [];
    }
}

async function initBlogIndex() {
    const posts = await fetchPosts();
    const blogGrid = document.getElementById('blog-grid');
    const featuredContainer = document.getElementById('featured-post-container');
    const filters = document.querySelectorAll('.category-filters .nav-link');

    if (!posts || posts.length === 0) {
        blogGrid.innerHTML = '<p class="col-12 text-center">Nenhum artigo encontrado. Tente publicar um novo artigo no painel de controlo!</p>';
        if(featuredContainer) featuredContainer.style.display = 'none';
        return;
    }

    if (featuredContainer && posts.length > 0) {
        featuredContainer.innerHTML = createFeaturedPostCard(posts[0]);
    }
    
    function renderPosts(filter = 'all') {
        blogGrid.innerHTML = '';
        const filteredPosts = filter === 'all' 
            ? posts 
            : posts.filter(p => p.category && p.category.toLowerCase() === filter.toLowerCase());

        filteredPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'col-lg-4 col-md-6 mb-4';
            postElement.innerHTML = createPostCard(post);
            blogGrid.appendChild(postElement);
        });
    }

    filters.forEach(filter => {
        filter.addEventListener('click', e => {
            e.preventDefault();
            filters.forEach(f => f.classList.remove('active'));
            e.target.classList.add('active');
            renderPosts(e.target.dataset.filter);
        });
    });

    renderPosts();
}

function createFeaturedPostCard(post) {
    return `
        <a href="post.html?post=${post.slug}" class="featured-post-link">
            <div class="card featured-post-card">
                <div class="row no-gutters">
                    <div class="col-lg-6"><img src="${post.thumbnail}" class="card-img" alt="${post.title}"></div>
                    <div class="col-lg-6">
                        <div class="card-body">
                            <span class="badge badge-category">${post.category}</span>
                            <h2 class="card-title">${post.title}</h2>
                            <p class="card-text">${post.excerpt || ''}</p>
                            <div class="post-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${new Date(post.date).toLocaleDateString('pt-PT')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>`;
}

function createPostCard(post) {
     return `
        <a href="post.html?post=${post.slug}" class="blog-card-link" style="text-decoration: none; color: inherit;">
            <div class="card blog-card">
                <img src="${post.thumbnail}" class="card-img-top" alt="${post.title}">
                <div class="card-body">
                    <span class="badge badge-category">${post.category}</span>
                    <h5 class="card-title mt-2">${post.title}</h5>
                    <div class="post-meta">
                         <span><i class="fas fa-calendar-alt"></i> ${new Date(post.date).toLocaleDateString('pt-PT')}</span>
                    </div>
                </div>
            </div>
        </a>`;
}