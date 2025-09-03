document.addEventListener("DOMContentLoaded", async () => {
    // --- FUNÇÕES PARA CARREGAR DADOS ---
    async function fetchData(url) {
        try {
            const response = await fetch(`${url}?v=${new Date().getTime()}`);
            if (!response.ok) {
                console.error(`A resposta da rede para ${url} não foi bem-sucedida.`);
                return null; // Retorna nulo se houver erro de rede
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar dados de ${url}:`, error);
            return null; // Retorna nulo se houver erro na leitura
        }
    }

    // --- FUNÇÕES AUXILIARES ---
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
    const [postsData, authorsData] = await Promise.all([
        fetchData('/_dados/blog.json'),
        fetchData('/_dados/autores.json')
    ]);

    // Verificação de segurança para garantir que os dados existem
    const allPosts = (postsData && postsData.posts) ? postsData.posts : [];
    const authors = authorsData || [];
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const authorsById = authors.reduce((acc, author) => {
        acc[author.id] = author;
        return acc;
    }, {});
    
    // Autor padrão para evitar erros
    const defaultAuthor = { nome: "Equipa PortugalApoia" };

    const mainContent = document.querySelector('.blog-main-content');
    const latestPostContainer = document.getElementById('latest-post');
    const postsGridContainer = document.getElementById('posts-grid');
    const categoryNav = document.getElementById('category-filter-nav');
    const noPostsMessage = document.getElementById('no-posts-message');
    const searchInput = document.getElementById('blog-search-input');

    function renderPosts(posts) {
        if (!postsGridContainer) return;
        postsGridContainer.innerHTML = '';

        if (posts.length === 0) {
            if (noPostsMessage) noPostsMessage.style.display = 'block';
            return;
        }
        
        if (noPostsMessage) noPostsMessage.style.display = 'none';

        postsGridContainer.innerHTML = posts.map((post) => {
            const readingTime = calculateReadingTime(marked.parse(post.body || ''));
            const globalIndex = allPosts.findIndex(p => p.title === post.title);
            const author = authorsById[post.author_id] || defaultAuthor;
            
            return `
            <div class="journal-article">
                <div class="card post-card w-100" data-toggle="modal" data-target="#postModal" data-post-index="${globalIndex}">
                    <img src="${post.image}" class="card-img-top post-card-img" alt="${post.title}" loading="lazy">
                    <div class="card-body post-card-body d-flex flex-column">
                        <div class="post-meta-info mb-2">
                            <span class="category">${post.category}</span> &bull; <span>${readingTime}</span>
                        </div>
                        <h5 class="post-card-title">${post.title}</h5>
                        <p class="post-card-summary flex-grow-1">${post.summary}</p>
                        <div class="author-byline mt-auto">
                           Por <strong>${author.nome}</strong>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }
    
    function setupCategories() {
        if (!categoryNav || allPosts.length === 0) return;
        const categories = ['Todas', ...new Set(allPosts.map(p => p.category))];
        categoryNav.innerHTML = categories.map(cat => `<button class="category-btn" data-category="${cat}">${cat}</button>`).join('');
        
        const buttons = categoryNav.querySelectorAll('.category-btn');
        if (buttons.length > 0) buttons[0].classList.add('active');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const selectedCategory = button.getAttribute('data-category');
                
                if(latestPostContainer) latestPostContainer.style.display = (selectedCategory === 'Todas') ? 'block' : 'none';
                if(searchInput) searchInput.value = '';

                const postsToRender = (selectedCategory === 'Todas') ? allPosts.slice(1) : allPosts.filter(p => p.category === selectedCategory);
                renderPosts(postsToRender);
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredPosts = allPosts.filter(post => 
                (post.title && post.title.toLowerCase().includes(searchTerm)) || 
                (post.summary && post.summary.toLowerCase().includes(searchTerm)) ||
                (post.body && post.body.toLowerCase().includes(searchTerm)) ||
                (post.category && post.category.toLowerCase().includes(searchTerm))
            );
            
            if (latestPostContainer) latestPostContainer.style.display = (searchTerm === '') ? 'block' : 'none';
            const activeButton = document.querySelector('.category-btn.active');
            if (activeButton) activeButton.classList.remove('active');
            
            renderPosts(searchTerm === '' ? allPosts.slice(1) : filteredPosts);
        });
    }

    if (allPosts.length > 0) {
        const latestPost = allPosts[0];
        if (latestPostContainer && latestPost) {
            const readingTime = calculateReadingTime(marked.parse(latestPost.body || ''));
            const author = authorsById[latestPost.author_id] || defaultAuthor;

            latestPostContainer.innerHTML = `
                <div class="latest-post-card" data-toggle="modal" data-target="#postModal" data-post-index="0">
                    <div class="latest-post-image-wrapper">
                        <img src="${latestPost.image}" alt="${latestPost.title}" class="latest-post-img" loading="lazy">
                    </div>
                    <div class="latest-post-content">
                        <div class="post-meta-info">
                            <span class="category">${latestPost.category}</span> &bull; <span>${readingTime}</span>
                        </div>
                        <h2 class="latest-post-title">${latestPost.title}</h2>
                        <p class="latest-post-summary">${latestPost.summary}</p>
                        <p class="text-muted small author-byline">Por <strong>${author.nome}</strong> em ${formatDate(latestPost.date)}</p>
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

    $('#postModal').on('show.bs.modal', function (event) {
        const card = $(event.relatedTarget);
        const postIndex = card.data('post-index');
        const postData = allPosts[postIndex];

        if (postData) {
            const modal = $(this);
            const readingTime = calculateReadingTime(marked.parse(postData.body || ''));
            const author = authorsById[postData.author_id] || defaultAuthor;
            
            modal.find('#modal-image').attr('src', postData.image);
            modal.find('.modal-title').text(postData.title);
            modal.find('#modal-meta').html(`<span class="category">${postData.category}</span> &bull; <span>${readingTime}</span> &bull; <span class="text-muted">Por <strong>${author.nome}</strong> em ${formatDate(postData.date)}</span>`);
            modal.find('#modal-body').html(marked.parse(postData.body || ''));
        }
    });

    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
    }
});