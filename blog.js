document.addEventListener("DOMContentLoaded", async () => {
    // --- FUNCIÓN PARA CARGAR PUBLICACIONES DEL BLOG ---
    async function fetchPosts() {
        try {
            const response = await fetch('/_dados/blog.json?v=' + new Date().getTime());
            if (!response.ok) throw new Error("A resposta da rede não foi bem-sucedida.");
            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            console.error("Erro ao carregar as publicações do blog:", error);
            return [];
        }
    }

    // --- FUNCIONES AUXILIARES ---
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    }
    
    function calculateReadingTime(text) {
        const wordsPerMinute = 225;
        const textContent = text.replace(/<[^>]*>/g, " ");
        const wordCount = textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min de leitura`;
    }

    // --- LÓGICA PRINCIPAL ---
    const allPosts = await fetchPosts();
    const mainContent = document.querySelector('.blog-main-content');
    const latestPostContainer = document.getElementById('latest-post');
    const postsGridContainer = document.getElementById('posts-grid');
    const noMorePostsMessage = document.getElementById('no-more-posts-message');

    if (allPosts.length > 0) {
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // --- Renderiza el Artículo Más Reciente ---
        const latestPost = allPosts[0];
        if (latestPostContainer && latestPost) {
            const readingTime = calculateReadingTime(marked.parse(latestPost.body || ''));
            latestPostContainer.innerHTML = `
                <div class="latest-post-card">
                    <div class="latest-post-image-wrapper">
                        <img src="${latestPost.image}" alt="${latestPost.title}" class="latest-post-img">
                    </div>
                    <div class="latest-post-content">
                        <div class="post-meta-info">
                            <span class="category">${latestPost.category}</span> &bull; <span>${readingTime}</span>
                        </div>
                        <h2 class="latest-post-title">${latestPost.title}</h2>
                        <p class="latest-post-summary">${latestPost.summary}</p>
                        <p class="text-muted small">Por ${latestPost.author || 'PortugalApoia'} em ${formatDate(latestPost.date)}</p>
                    </div>
                </div>`;
        }

        // --- Renderiza el resto de los artículos en la cuadrícula ---
        const otherPosts = allPosts.slice(1);
        if (postsGridContainer) {
            if (otherPosts.length > 0) {
                postsGridContainer.innerHTML = otherPosts.map((post, index) => {
                    const readingTime = calculateReadingTime(marked.parse(post.body || ''));
                    // El índice se ajusta porque hemos quitado el primer post (latestPost)
                    const postIndex = index + 1; 
                    return `
                    <div class="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
                        <div class="card post-card w-100" data-toggle="modal" data-target="#postModal" data-post-index="${postIndex}">
                            <img src="${post.image}" class="card-img-top post-card-img" alt="${post.title}">
                            <div class="card-body post-card-body d-flex flex-column">
                                <h5 class="post-card-title">${post.title}</h5>
                                <div class="post-meta-info mb-2">
                                    <span class="category">${post.category}</span> &bull; <span>${readingTime}</span>
                                </div>
                                <p class="post-card-summary">${post.summary}</p>
                                <div class="post-card-footer mt-auto">
                                    <span class="text-muted small">Por ${post.author || 'PortugalApoia'}</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }).join('');
            } else {
                document.querySelector('#all-posts .section-title').style.display = 'none';
                if(noMorePostsMessage) noMorePostsMessage.style.display = 'block';
            }
        }
    } else {
        if(mainContent) {
            mainContent.innerHTML = `<div class="container text-center py-5"><h1 class="blog-title">O Nosso Blog</h1><p class="lead text-muted mt-4">De momento, não foi possível carregar as publicações.</p></div>`;
        }
    }

    // --- LÓGICA PARA POBLAR Y MOSTRAR EL MODAL ---
    $('#postModal').on('show.bs.modal', function (event) {
        const card = $(event.relatedTarget); // La tarjeta que activó el modal
        const postIndex = card.data('post-index');
        const postData = allPosts[postIndex];

        if (postData) {
            const modal = $(this);
            const readingTime = calculateReadingTime(marked.parse(postData.body || ''));
            
            modal.find('#modal-image').attr('src', postData.image);
            modal.find('.modal-title').text(postData.title);
            modal.find('#modal-meta').html(`<span class="category">${postData.category}</span> &bull; <span>${readingTime}</span> &bull; <span class="text-muted">${formatDate(postData.date)}</span>`);
            modal.find('#modal-body').html(marked.parse(postData.body));
        }
    });

    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
    }
});