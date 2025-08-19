document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('hidden');
        });
    }

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

function carregarConteudo(dataPath, targetId, renderFunction, pageFile) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    fetch(dataPath)
        .then(response => response.json())
        .then(data => {
            const items = data[Object.keys(data)[0]]; // Obtém a lista de itens
            let htmlContent = '';
            items.forEach(item => {
                htmlContent += renderFunction(item);
            });
            targetElement.innerHTML = htmlContent;
        })
        .catch(error => console.error(`Erro ao carregar o conteúdo de ${dataPath}:`, error));
}

function renderBlogPost(post) {
    const imageUrl = post.image ? post.image : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop';
    const postDate = post.date ? new Date(post.date).toLocaleDateString('pt-PT') : 'Data Desconhecida';
    const postAuthor = post.author || 'Anónimo';
    
    // Maneja el contenido Markdown del cuerpo para obtener un snippet
    const snippet = post.body.substring(0, 150) + '...';

    return `
        <div class="col-lg-4 col-md-6 mb-4 blog-post-item">
            <div class="card h-100 shadow-sm">
                <img src="${imageUrl}" class="card-img-top" alt="${post.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text text-muted">${postDate} por ${postAuthor}</p>
                    <p class="card-text flex-grow-1">${snippet}</p>
                    <a href="#" class="mt-auto btn btn-outline-primary">Ler mais</a>
                </div>
            </div>
        </div>
    `;
}

// Llama a la función `carregarConteudo` para cargar los posts del blog
carregarConteudo('/_dados/posts.json', 'blog-posts-grid', renderBlogPost, 'blog.html');