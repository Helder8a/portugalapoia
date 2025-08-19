// Añade esta función de renderizado para los posts del blog
function renderBlogPost(post) {
    const imageUrl = post.image ? post.image : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop';
    return `
        <div class="col-lg-4 col-md-6 mb-4 blog-post-item">
            <div class="card h-100 shadow-sm">
                <img src="${imageUrl}" class="card-img-top" alt="${post.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text text-muted">${post.date} por ${post.author}</p>
                    <p class="card-text flex-grow-1">${post.body.substring(0, 150)}...</p>
                    <a href="#" class="mt-auto btn btn-outline-primary">Ler mais</a>
                </div>
            </div>
        </div>
    `;
}

// Llama a la función `carregarConteudo` para cargar los posts del blog
carregarConteudo('/_dados/posts.json', 'blog-posts-grid', renderBlogPost, 'blog.html');

// Añade esta función de renderizado para los posts del blog
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
});