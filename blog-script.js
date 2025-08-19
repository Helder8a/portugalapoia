// blog-script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para la página principal del blog (blog.html) ---
    if (document.getElementById('blog-grid')) {
        initBlogIndex();
    }
    // --- Lógica para la página de un artículo individual (post.html) ---
    if (document.getElementById('post-container')) {
        initBlogPost();
    }
});

async function fetchPosts() {
    // Asumimos que todos los archivos en _blog/ son posts.
    // En un sitio real, podrías generar un archivo-índice.json con un build step.
    const postFiles = ['2025-08-17-¿por-qué-estudiar-en-portugal-2025-2026.md']; // Usaremos el post que ya tienes como ejemplo
    
    try {
        // En un entorno real, listarías los archivos del directorio _blog.
        // Como no podemos hacer eso desde el navegador, simulamos con el archivo que ya conocemos.
        const posts = await Promise.all(postFiles.map(async file => {
            const response = await fetch(`/_blog/${file}`);
            if (!response.ok) return null;
            const text = await response.text();
            const { attributes, body } = parseFrontMatter(text);
            attributes.slug = file.replace('.md', '');
            attributes.body = body;
            return attributes;
        }));
        return posts.filter(p => p).sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error("Error al cargar los posts:", error);
        return [];
    }
}

function parseFrontMatter(text) {
    const frontMatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = frontMatterRegex.exec(text);
    if (!match) return { attributes: {}, body: text };
    const attributes = jsyaml.load(match[1]);
    const body = text.slice(match[0].length).trim();
    return { attributes, body };
}

async function initBlogIndex() {
    const posts = await fetchPosts();
    const blogGrid = document.getElementById('blog-grid');
    const featuredContainer = document.getElementById('featured-post-container');
    const filters = document.querySelectorAll('.category-filters .nav-link');
    const converter = new showdown.Converter();

    if (!posts || posts.length === 0) {
        blogGrid.innerHTML = '<p class="col-12 text-center">Nenhum artigo encontrado.</p>';
        return;
    }

    if (posts.length > 0) {
        featuredContainer.innerHTML = createFeaturedPostCard(posts[0], converter);
    }
    
    function renderPosts(filter = 'all') {
        blogGrid.innerHTML = '';
        const filteredPosts = filter === 'all' 
            ? posts 
            : posts.filter(p => p.category && p.category.toLowerCase() === filter);

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

async function initBlogPost() {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    const converter = new showdown.Converter();
    const container = document.getElementById('post-container');

    if (!postSlug) {
        container.innerHTML = '<p class="text-center">Artigo não encontrado.</p>';
        return;
    }

    try {
        const response = await fetch(`/_blog/${postSlug}.md`);
        if (!response.ok) throw new Error('Post not found');
        const text = await response.text();
        const { attributes, body } = parseFrontMatter(text);
        const contentHtml = converter.makeHtml(body);

        // Actualizar SEO y Metadatos
        document.title = attributes.seo?.seo_title || attributes.title;
        document.getElementById('seo-description').setAttribute('content', attributes.seo?.meta_description || '');
        document.getElementById('seo-keywords').setAttribute('content', attributes.seo?.keywords || '');
        
        container.innerHTML = `
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <header class="post-full-header">
                        <span class="badge badge-category">${attributes.category}</span>
                        <h1 class="post-full-title mt-3">${attributes.title}</h1>
                        <div class="post-full-meta">
                            <span><i class="fas fa-calendar-alt"></i> ${new Date(attributes.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </header>
                    <img src="${attributes.thumbnail}" alt="${attributes.title}" class="post-full-image">
                    <section class="post-full-content">${contentHtml}</section>
                </div>
            </div>`;
    } catch (error) {
        console.error("Error al cargar el post:", error);
        container.innerHTML = '<p class="text-center">Ocorreu um erro ao carregar o artigo.</p>';
    }
}

function createFeaturedPostCard(post, converter) {
    const excerpt = converter.makeHtml(post.body).replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
    return `
        <a href="post.html?post=${post.slug}" class="featured-post-link">
            <div class="card featured-post-card">
                <div class="row no-gutters">
                    <div class="col-lg-6"><img src="${post.thumbnail}" class="card-img" alt="${post.title}"></div>
                    <div class="col-lg-6">
                        <div class="card-body">
                            <span class="badge badge-category">${post.category}</span>
                            <h2 class="card-title">${post.title}</h2>
                            <p class="card-text">${excerpt}</p>
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