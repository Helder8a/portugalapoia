// ==================================================================
// === CÓDIGO FINAL E MELHORADO para blog.js (com todas as melhorias) ===
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Variáveis globais para armazenar os dados e os elementos dos posts
    let allPostsData = [];
    let postsContainer;

    // --- FUNÇÃO PRINCIPAL PARA INICIAR O BLOG ---
    async function iniciarBlog() {
        postsContainer = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        if (!postsContainer || !gallerySection) return;

        try {
            // Carrega os dados dos posts e da galeria em paralelo para maior rapidez
            const [postsResponse, galeriaResponse] = await Promise.all([
                fetch('/_dados/blog.json?v=' + new Date().getTime()),
                fetch('/_dados/galeria.json?v=' + new Date().getTime())
            ]);
            
            if (!postsResponse.ok || !galeriaResponse.ok) {
                throw new Error('Falha ao carregar os ficheiros de dados.');
            }

            const postsData = await postsResponse.json();
            const galeria = await galeriaResponse.json();
            
            // Ordena os posts por data, do mais recente para o mais antigo
            allPostsData = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            renderPosts(allPostsData); // Renderiza todos os posts inicialmente
            gallerySection.innerHTML = galeria.imagens.map(renderGalleryItem).join('');

            setupBlogFunctionality();
            if (window.lightbox) window.lightbox.init();

        } catch (error) {
            console.error("Falha ao carregar o conteúdo do blog:", error);
            postsContainer.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.</p></div>`;
        }
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO (GERAÇÃO DE HTML) ---
    
    // Função para renderizar uma lista de posts no contentor
    function renderPosts(postsToRender) {
        if (!postsContainer) return;
        if (postsToRender.length === 0) {
            postsContainer.innerHTML = `<div class="col-12 text-center" id="no-results-message"><p class="lead text-muted mt-5">Nenhum artigo encontrado com os critérios de pesquisa.</p></div>`;
        } else {
            postsContainer.innerHTML = postsToRender.map(renderBlogPost).join('');
            // Após renderizar, calcula o tempo de leitura para cada post
            document.querySelectorAll('.blog-post-item').forEach(calculateReadingTime);
        }
    }

    // Função para gerar o HTML de um único post
    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const imageCaption = post.caption || `Ilustração para o artigo: ${post.title}`;
        // Usa a biblioteca 'marked' para converter Markdown em HTML de forma segura
        const processedBody = marked.parse(post.body || '', { gfm: true, breaks: true });

        return `
        <div class="col-lg-8 offset-lg-2 col-md-12 blog-post-item" data-category="${post.category}" data-title="${post.title.toLowerCase()}">
            <article class="blog-post-card">
                <div class="card-body">
                    <header class="post-header">
                        <h1 class="card-title">${post.title}</h1>
                        <div class="post-meta">
                            <span>${formattedDate}</span>
                            <span class="separator">|</span>
                            <span class="reading-time"></span>
                        </div>
                    </header>
                    
                    <figure class="post-image-container">
                        <img class="lazy" src="${post.image}" alt="${post.title}">
                        <figcaption>${imageCaption}</figcaption>
                    </figure>

                    <div class="summary-content card-text">${post.summary}</div>
                    
                    <div class="full-content" style="display: none;">
                        ${processedBody}
                        ${createSocialShareLinks(post.title)}
                        ${renderRelatedPosts(post)}
                    </div>
                    
                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                </div>
            </article>
        </div>`;
    }

    // Funções auxiliares para gerar HTML (links de partilha, posts relacionados, galeria)
    function createSocialShareLinks(postTitle) {
        const postUrl = encodeURIComponent(window.location.href);
        const encodedTitle = encodeURIComponent(postTitle);
        return `
            <div class="social-share">
                <strong>Partilhar:</strong>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${postUrl}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com/intent/tweet?url=${postUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no Twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="https://wa.me/?text=${encodedTitle}%20${postUrl}" target="_blank" rel="noopener noreferrer" aria-label="Partilhar no WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
        `;
    }

    function renderRelatedPosts(currentPost) {
        const related = allPostsData
            .filter(post => post.category === currentPost.category && post.title !== currentPost.title)
            .slice(0, 3);

        if (related.length === 0) return '';

        let relatedHTML = related.map(post => `
            <div class="related-post-item">
                <a href="#" class="related-post-link" data-title="${post.title.toLowerCase()}">
                    <img src="${post.image}" alt="${post.title}" class="related-post-img">
                    <h4 class="related-post-title">${post.title}</h4>
                </a>
            </div>
        `).join('');

        return `
            <div class="related-posts">
                <h3>Artigos Relacionados</h3>
                <div class="related-posts-grid">${relatedHTML}</div>
            </div>
        `;
    }

    function renderGalleryItem(item) {
        return `
        <div class="col-md-6 mb-4 gallery-item-wrapper">
            <div class="gallery-item">
                <a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="caption">${item.title}</div>
                </a>
            </div>
        </div>`;
    }

    // --- FUNÇÕES DE UTILIDADE E CONFIGURAÇÃO DE EVENTOS ---
    function calculateReadingTime(postElement) {
        const content = postElement.querySelector('.full-content');
        const timePlaceholder = postElement.querySelector('.reading-time');
        if (content && timePlaceholder) {
            const text = content.textContent || content.innerText;
            const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
            const readingTime = Math.ceil(wordCount / 225) || 1;
            timePlaceholder.innerHTML = `<i class="fa-regular fa-clock"></i> ${readingTime} min de leitura`;
        }
    }

    // Função central para filtrar e re-renderizar os posts
    function filterAndShowPosts() {
        const searchTerm = document.getElementById('blog-search-input').value.toLowerCase().trim();
        const activeCategory = document.querySelector('.blog-nav .nav-link.active').getAttribute('data-target');

        let filteredPosts = allPostsData;

        // Filtra por categoria
        if (activeCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === activeCategory);
        }

        // Filtra pelo termo de pesquisa
        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.summary.toLowerCase().includes(searchTerm) ||
                post.body.toLowerCase().includes(searchTerm)
            );
        }

        renderPosts(filteredPosts);
    }
    
    // Configura todos os eventos da página
    function setupBlogFunctionality() {
        const searchInput = document.getElementById('blog-search-input');
        const clearButton = document.getElementById('blog-search-clear');
        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');

        // Evento para "Ler Mais" / "Ler Menos"
        postsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more-btn')) {
                const cardBody = e.target.closest('.card-body');
                const summary = cardBody.querySelector('.summary-content');
                const fullContent = cardBody.querySelector('.full-content');
                const isExpanded = fullContent.style.display === 'block';

                summary.style.display = isExpanded ? 'block' : 'none';
                fullContent.style.display = isExpanded ? 'none' : 'block';
                e.target.textContent = isExpanded ? 'Ler Mais' : 'Ler Menos';
            }
            // Evento para os links de artigos relacionados
            if (e.target.closest('.related-post-link')) {
                e.preventDefault();
                const targetTitle = e.target.closest('.related-post-link').dataset.title;
                const targetPostElement = document.querySelector(`.blog-post-item[data-title="${targetTitle}"]`);
                if (targetPostElement) {
                    targetPostElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        // Eventos para a navegação por categorias
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                const targetCategory = e.target.getAttribute('data-target');

                if (targetCategory === 'galeria') {
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    postsSection.style.display = 'flex';
                    gallerySection.style.display = 'none';
                    filterAndShowPosts();
                }
            });
        });

        // Eventos para a barra de pesquisa
        searchInput.addEventListener('input', filterAndShowPosts);
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            filterAndShowPosts();
        });
    }

    // --- INICIAR TUDO ---
    iniciarBlog();
});