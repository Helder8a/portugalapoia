// URLs de tus posts de blog en la carpeta _blog.
const blogPosts = [
  '2025-08-17-¿por-qué-estudiar-en-portugal-2025-2026.md',
  // Asegúrate de agregar el nombre de cada archivo de post que crees aquí.
];

let allPostsData = [];

const renderPosts = (postsToRender) => {
    const postsContainer = document.getElementById('blog-full-content');
    postsContainer.innerHTML = '';

    if (postsToRender.length === 0) {
        postsContainer.innerHTML = '<p class="text-center w-100">Nenhuma publicação encontrada para esta categoria.</p>';
        return;
    }

    const htmlContent = postsToRender.map(post => {
        const metadata = post.metadata;
        const thumbnailHTML = metadata.thumbnail ? `<img src="${metadata.thumbnail}" class="card-img-top blog-post-image" alt="${metadata.title}">` : '';

        return `
            <div class="col-lg-4 col-md-6 mb-4 d-flex">
                <div class="card blog-card flex-grow-1">
                    ${thumbnailHTML}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${metadata.title}</h5>
                        <p class="card-text text-muted small"><i class="fas fa-calendar-alt"></i> ${new Date(metadata.date).toLocaleDateString()}</p>
                        <p class="card-text">${post.content.substring(0, 150)}...</p>
                        <a href="post.html?slug=${post.slug}" class="btn btn-primary mt-auto">Ler mais</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    postsContainer.innerHTML = htmlContent;
};

const filterPostsByCategory = (category) => {
    let filteredPosts = allPostsData;
    if (category !== 'all') {
        filteredPosts = allPostsData.filter(post => post.metadata.category === category);
    }
    renderPosts(filteredPosts);
};

const fetchAllPosts = async () => {
    const promises = blogPosts.map(async (filename) => {
        try {
            const response = await fetch(`./_blog/${filename}`);
            const text = await response.text();
            const parts = text.split('---');
            const frontmatter = parts[1];
            const content = parts.slice(2).join('---').trim();

            const metadata = {};
            frontmatter.split('\n').filter(line => line.trim() !== '').forEach(line => {
                const [key, value] = line.split(':');
                if (key && value) {
                    metadata[key.trim()] = value.trim().replace(/"/g, '');
                }
            });

            return {
                slug: filename.replace('.md', ''),
                metadata,
                content
            };
        } catch (error) {
            console.error(`Error al cargar el post ${filename}:`, error);
            return null;
        }
    });

    const posts = await Promise.all(promises);
    allPostsData = posts.filter(post => post !== null).sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

    renderPosts(allPostsData);
};

document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = () => {
        fetchAllPosts();
    };
    document.head.appendChild(script);

    const categoryButtons = document.querySelectorAll('.btn-category');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            filterPostsByCategory(category);
        });
    });
});