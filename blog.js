document.addEventListener("DOMContentLoaded", async () => {
    // --- FUNCIÓN PARA CARGAR PUBLICACIONES DEL BLOG ---
    async function fetchPosts() {
        try {
            const response = await fetch('/_dados/blog.json?v=' + new Date().getTime());
            if (!response.ok) {
                console.error("A resposta da rede não foi bem-sucedida.");
                return []; // Devuelve un array vacío en caso de error de red
            }
            const data = await response.json();
            return data.posts || []; // Devuelve los posts o un array vacío si no existen
        } catch (error) {
            console.error("Erro ao carregar as publicações do blog:", error);
            return []; // Devuelve un array vacío en caso de cualquier otro error
        }
    }

    // --- FUNCIÓN PARA FORMATEAR LA FECHA ---
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    }

    // --- LÓGICA PRINCIPAL PARA RENDERIZAR EL BLOG ---
    const allPosts = await fetchPosts();
    const mainContent = document.querySelector('.blog-main-content');
    const featuredContainer = document.getElementById('featured-post');
    const gridContainer = document.querySelector('#posts-grid .row');
    const olderPostsTitle = document.querySelector('#posts-grid h2');

    if (allPosts.length > 0) {
        // Ordena los posts por fecha, del más reciente al más antiguo
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // --- Renderiza el Artículo Destacado (el más reciente) ---
        const featured = allPosts[0];
        if (featuredContainer && featured) {
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
        }

        // --- Renderiza el resto de los artículos en la cuadrícula ---
        const otherPosts = allPosts.slice(1);
        if (gridContainer) {
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
                // Si solo hay un post, se oculta la sección de "anteriores"
                if(olderPostsTitle) olderPostsTitle.style.display = 'none';
                gridContainer.innerHTML = '<p class="col-12 text-center text-muted mt-4">Não há edições anteriores.</p>';
            }
        }
    } else {
        // Si no se carga ningún post, muestra un mensaje de error claro
        if(mainContent) {
            mainContent.innerHTML = `
                <div class="container text-center py-5">
                    <h1 class="blog-title">O Nosso Jornal</h1>
                    <p class="lead text-muted mt-4">De momento, não foi possível carregar as publicações. Por favor, tente novamente mais tarde.</p>
                </div>`;
        }
    }
});