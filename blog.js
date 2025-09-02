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
        if (!text) return '1 min de leitura';
        const wordsPerMinute = 225;
        const textContent = text.replace(/<[^>]*>/g, " ");
        const wordCount = textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min de leitura`;
    }

    // --- LÓGICA PRINCIPAL ---
    const allPosts = await fetchPosts();
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena una sola vez

    const mainContent = document.querySelector('.blog-main-content');
    const latestPostContainer = document.getElementById('latest-post');
    const postsGridContainer = document.getElementById('posts-grid');
    const categoryNav = document.getElementById('category-filter-nav');
    const noPostsMessage = document.getElementById('no-posts-message');

    // --- RENDERIZAR ARTÍCULOS EN LA CUADRÍCULA ---
    function renderPosts(posts) {
        if (posts.length === 0) {
            postsGridContainer.innerHTML = '';
            if (noPostsMessage) noPostsMessage.style.display = 'block';
            return;
        }
        
        if (noPostsMessage) noPostsMessage.style.display = 'none';
        postsGridContainer.innerHTML = posts.map((post, index) => {
            const readingTime = calculateReadingTime(marked.parse(post.body || ''));
            const globalIndex = allPosts.findIndex(p => p.title === post.title);
            return `
            <div class="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
                <div class="card post-card w-100" data-toggle="modal" data-target="#postModal" data-post-index="${globalIndex}">
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
    }
    
    // --- LÓGICA DE CATEGORÍAS ---
    function setupCategories() {
        if (!categoryNav) return;
        const categories = ['Todas', ...new Set(allPosts.map(p => p.category))];
        categoryNav.innerHTML = categories.map(cat => `<button class="category-btn" data-category="${cat}">${cat}</button>`).join('');
        
        const buttons = categoryNav.querySelectorAll('.category-btn');
        buttons[0].classList.add('active'); // Activa el botón "Todas" por defecto

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const selectedCategory = button.getAttribute('data-category');
                
                // Muestra el titular solo si se selecciona "Todas"
                latestPostContainer.style.display = (selectedCategory === 'Todas') ? 'block' : 'none';
                
                const postsToRender = (selectedCategory === 'Todas') ? allPosts.slice(1) : allPosts.filter(p => p.category === selectedCategory);
                renderPosts(postsToRender);
            });
        });
    }

    if (allPosts.length > 0) {
        // --- Renderiza el Artículo Más Reciente ---
        const latestPost = allPosts[0];
        if (latestPostContainer && latestPost) {
            const readingTime = calculateReadingTime(marked.parse(latestPost.body || ''));
            latestPostContainer.innerHTML = `
                <div class="latest-post-card" data-toggle="modal" data-target="#postModal" data-post-index="0">
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

        renderPosts(allPosts.slice(1));
        setupCategories();

    } else {
        if(mainContent) {
            mainContent.innerHTML = `<div class="container text-center py-5"><h1 class="blog-title">O Nosso Blog</h1><p class="lead text-muted mt-4">De momento, não foi possível carregar as publicações.</p></div>`;
        }
    }

    // --- LÓGICA PARA POBLAR Y MOSTRAR EL MODAL ---
    $('#postModal').on('show.bs.modal', function (event) {
        const card = $(event.relatedTarget);
        const postIndex = card.data('post-index');
        const postData = allPosts[postIndex];

        if (postData) {
            const modal = $(this);
            const readingTime = calculateReadingTime(marked.parse(postData.body || ''));
            
            modal.find('#modal-image').attr('src', postData.image);
            modal.find('.modal-title').text(postData.title);
            modal.find('#modal-meta').html(`<span class="category">${postData.category}</span> &bull; <span>${readingTime}</span> &bull; <span class="text-muted">${formatDate(postData.date)}</span>`);
            modal.find('#modal-body').html(marked.parse(postData.body || ''));
        }
    });

    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
    }
});