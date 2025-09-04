document.addEventListener("DOMContentLoaded", async () => {
    // --- FUNÇÃO PARA CARREGAR PUBLICAÇÕES DO BLOG ---
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
    const allPosts = await fetchPosts();
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const mainContent = document.querySelector('.blog-main-content');
    const latestPostContainer = document.getElementById('latest-post');
    const postsGridContainer = document.getElementById('posts-grid');
    const categoryNav = document.getElementById('category-filter-nav');
    const noPostsMessage = document.getElementById('no-posts-message');
    const searchInput = document.getElementById('blog-search-input');

    function renderPosts(posts) {
        if (!postsGridContainer) return;
        if (posts.length === 0) {
            postsGridContainer.innerHTML = '';
            if (noPostsMessage) noPostsMessage.style.display = 'block';
            return;
        }
        
        if (noPostsMessage) noPostsMessage.style.display = 'none';
        postsGridContainer.innerHTML = posts.map((post) => {
            const readingTime = calculateReadingTime(marked.parse(post.body || ''));
            const globalIndex = allPosts.findIndex(p => p.title === post.title);
            
            let tagsHTML = '';
            if (post.tags && post.tags.length > 0) {
              const tagsArray = post.tags.split(',').map(tag => tag.trim());
              tagsHTML = `
                <div class="tags-container mb-2">
                  ${tagsArray.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              `;
            }

            return `
            <div class="journal-article">
                <div class="card post-card w-100" data-toggle="modal" data-target="#postModal" data-post-index="${globalIndex}">
                    <img src="${post.image}" class="card-img-top post-card-img" alt="${post.title}" loading="lazy">
                    <div class="card-body post-card-body d-flex flex-column">
                        <div class="post-meta-info mb-2">
                            <span class="category">${post.category}</span> &bull; <span>${readingTime}</span>
                        </div>
                        <h5 class="post-card-title">${post.title}</h5>
                        ${tagsHTML} {/* ETIQUETAS INSERTADAS AQUÍ */}
                        <p class="post-card-summary flex-grow-1">${post.summary}</p>
                    </div>
                </div>
            </div>`;
        }).join('');
    }
    
    // --- LÓGICA DE CATEGORIAS ---
    function setupCategories() {
        if (!categoryNav) return;
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

    // --- LÓGICA DE PESQUISA ---
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredPosts = allPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.summary.toLowerCase().includes(searchTerm) ||
                (post.body && post.body.toLowerCase().includes(searchTerm)) ||
                post.category.toLowerCase().includes(searchTerm)
            );
            
            if (latestPostContainer) latestPostContainer.style.display = (searchTerm === '') ? 'block' : 'none';
            document.querySelector('.category-btn.active')?.classList.remove('active');
            
            renderPosts(searchTerm === '' ? allPosts.slice(1) : filteredPosts);
        });
    }

    if (allPosts.length > 0) {
        const latestPost = allPosts[0];
        if (latestPostContainer && latestPost) {
            const readingTime = calculateReadingTime(marked.parse(latestPost.body || ''));

            // --- INICIO: CÓDIGO CORREGIDO PARA AÑADIR ETIQUETAS AL POST PRINCIPAL ---
            let tagsHTML = '';
            if (latestPost.tags && latestPost.tags.length > 0) {
              const tagsArray = latestPost.tags.split(',').map(tag => tag.trim());
              tagsHTML = `
                <div class="tags-container mt-3">
                  ${tagsArray.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              `;
            }
            // --- FIN: CÓDIGO CORREGIDO ---

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
                        ${tagsHTML} 
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

    // --- LÓGICA PARA POBLAR O MODAL (INCLUINDO PARTILHA) ---
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

            // Lógica de Partilha
            const postUrl = window.location.href; 
            modal.find('.share-link').off('click').on('click', function(e) {
                e.preventDefault();
                const platform = $(this).data('platform');
                const shareUrl = getShareUrl(platform, postUrl, postData.title);
                window.open(shareUrl, '_blank', 'width=600,height=400');
            });

            // Lógica para Disqus (opcional)
            const disqus_config = function () {
                this.page.url = postUrl;
                this.page.identifier = postData.title.replace(/\s/g, '-');
            };
            (function() {
                if (window.DISQUS) {
                    window.DISQUS.reset({ reload: true, config: disqus_config });
                } else {
                    // Adicione aqui o seu script do Disqus se não estiver carregado
                }
            })();
        }
    });

    function getShareUrl(platform, url, text) {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        switch(platform) {
            case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case 'twitter': return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            case 'linkedin': return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`;
            case 'whatsapp': return `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        }
    }

    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
    }
});