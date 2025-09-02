document.addEventListener("DOMContentLoaded", async () => {
    async function fetchPosts() {
        try {
            const response = await fetch('/_dados/blog.json?v=' + new Date().getTime());
            if (!response.ok) return [];
            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            console.error("Erro ao carregar as publicações do blog:", error);
            return [];
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    }

    const allPosts = await fetchPosts();

    if (allPosts.length > 0) {
        // Ordena por data, do mais recente para o mais antigo
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const featuredContainer = document.getElementById('featured-post');
        const gridContainer = document.querySelector('#posts-grid .row');

        // Renderiza o Artigo Destacado (o mais recente)
        const featured = allPosts[0];
        featuredContainer.innerHTML = `
            <div class="card">
                <img src="${featured.image}" alt="${featured.title}" class="featured-post-image">
                <div class="featured-post-body">
                    <p class="featured-post-category">${featured.category}</p>
                    <h2 class="featured-post-title">${featured.title}</h2>
                    <p class="featured-post-summary">${featured.summary}</p>
                    <p class="text-muted small">${formatDate(featured.date)}</p>
                </div>
            </div>`;

        // Renderiza o resto dos artigos na cuadrícula
        const otherPosts = allPosts.slice(1);
        if (otherPosts.length > 0) {
            gridContainer.innerHTML = otherPosts.map(post => `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card post-card h-100">
                        <img src="${post.image}" class="card-img-top post-card-img" alt="${post.title}">
                        <div class="card-body post-card-body d-flex flex-column">
                            <h5 class="post-card-title">${post.title}</h5>
                            <p class="post-card-summary flex-grow-1">${post.summary}</p>
                            <div class="post-card-footer">
                                <span>${formatDate(post.date)}</span> | <span>${post.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            gridContainer.innerHTML = '<p class="col-12 text-center">Não há mais artigos disponíveis.</p>';
        }
    } else {
        document.querySelector('.blog-main-content').innerHTML = '<div class="container text-center py-5"><h1>Nenhuma publicação encontrada.</h1></div>';
    }
});