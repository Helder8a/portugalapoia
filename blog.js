document.addEventListener("DOMContentLoaded", async () => {
    // --- FUNÇÕES PARA CARREGAR DADOS ---
    async function fetchData(url) {
        try {
            // Adiciona um parâmetro de cache-busting para garantir dados frescos
            const response = await fetch(`${url}?v=${new Date().getTime()}`);
            if (!response.ok) {
                console.error(`Erro na resposta da rede para ${url}: ${response.statusText}`);
                return null; // Retorna nulo se a busca falhar
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro crítico ao carregar dados de ${url}:`, error);
            return null; // Retorna nulo em caso de erro de rede ou parsing
        }
    }

    // --- FUNÇÕES AUXILIARES ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const calculateReadingTime = (text) => {
        if (!text) return '1 min de leitura';
        const wordsPerMinute = 225;
        const wordCount = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min de leitura`;
    };

    // --- CARREGAMENTO INICIAL DE DADOS ---
    const [postsData, authorsData] = await Promise.all([
        fetchData('/_dados/blog.json'),
        fetchData('/_dados/autores.json')
    ]);

    // Verificação de segurança: não prosseguir se os posts não carregarem
    if (!postsData || !postsData.posts) {
        console.error("Não foi possível carregar as publicações do blog. A renderização foi interrompida.");
        document.getElementById('posts-grid').innerHTML = "<p class='text-center text-danger'>Ocorreu um erro ao carregar os artigos do blog. Por favor, tente novamente mais tarde.</p>";
        return; // Interrompe a execução
    }

    const allPosts = postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Cria um mapa de autores apenas se os dados existirem, caso contrário, um mapa vazio.
    const authorsMap = new Map(authorsData ? authorsData.map(author => [author.id, author]) : []);

    // --- LÓGICA PRINCIPAL ---
    const postsGridContainer = document.getElementById('posts-grid');
    const loadMoreButton = document.getElementById('load-more-posts');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const searchInput = document.getElementById('blog-search');
    let displayedPostsCount = 0;
    const postsPerPage = 6;

    const renderPosts = (postsToRender) => {
        if (!postsToRender || postsToRender.length === 0) {
            postsGridContainer.innerHTML = "<p class='col-12 text-center'>Nenhuma publicação encontrada.</p>";
            return;
        }

        const postsHtml = postsToRender.map((post, index) => {
            // Lógica para obter o autor, com um autor padrão robusto
            const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "/images_pta/logocuadrado.jpg" };
            
            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card blog-card h-100" data-post-index="${allPosts.indexOf(post)}" data-toggle="modal" data-target="#postModal">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body d-flex flex-column">
                            <div class="post-meta mb-2">
                                <span class="category">${post.category}</span> &bull;
                                <span class="reading-time">${calculateReadingTime(post.body)}</span>
                            </div>
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text flex-grow-1">${post.summary}</p>
                            <div class="author-info d-flex align-items-center mt-auto">
                                <img src="${author.avatar}" alt="${author.nome}" class="rounded-circle mr-2" style="width: 30px; height: 30px;">
                                <small class="text-muted">${author.nome} &bull; ${formatDate(post.date)}</small>
                            </div>
                        </div>
                    </div>
                </div>`;
        }).join('');
        
        postsGridContainer.innerHTML = postsHtml;
    };

    const displayInitialPosts = () => {
        const initialPosts = allPosts.slice(0, postsPerPage);
        renderPosts(initialPosts);
        displayedPostsCount = initialPosts.length;
        loadMoreButton.style.display = allPosts.length > postsPerPage ? 'block' : 'none';
    };
    
    // ... (O resto das tuas funções: loadMore, setupCategories, pesquisa, etc., devem permanecer aqui)
    // --- LÓGICA PARA ATUALIZAR META TAGS E MODAL (COM MELHORIAS) ---
    $('#postModal').on('show.bs.modal', function (event) {
        const card = $(event.relatedTarget);
        const postIndex = card.data('post-index');
        const post = allPosts[postIndex];
        
        if (post) {
            const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "/images_pta/logocuadrado.jpg", bio: "" };
            const modal = $(this);

            // Atualiza o título da página e as meta tags para SEO
            document.title = `${post.title} | Blog PortugalApoia`;
            document.getElementById('meta-description').setAttribute('content', post.meta_description || post.summary || '');
            document.getElementById('meta-keywords').setAttribute('content', post.tags ? post.tags.join(', ') : '');
            document.getElementById('meta-author').setAttribute('content', author.nome);

            // Preenche o modal
            modal.find('#modal-image').attr('src', post.image);
            modal.find('.modal-title').text(post.title);
            
            const authorInfoHtml = `
                <img src="${author.avatar}" alt="${author.nome}" class="rounded-circle mr-3" style="width:50px; height:50px;">
                <div>
                    <strong class="d-block">${author.nome}</strong>
                    <small class="text-muted">${author.bio || ''}</small>
                </div>`;
            modal.find('#modal-author-info').html(authorInfoHtml);

            modal.find('#modal-meta').html(`<span class="category">${post.category}</span> &bull; <span>${calculateReadingTime(marked.parse(post.body || ''))}</span> &bull; <span class="text-muted">${formatDate(post.date)}</span>`);
            modal.find('#modal-body').html(marked.parse(post.body || ''));
        }
    });

    // --- Redefinir meta tags quando o modal for fechado ---
    $('#postModal').on('hidden.bs.modal', function () {
        document.title = 'Blog PortugalApoia | Notícias, Guias e Histórias da Comunidade';
        document.getElementById('meta-description').setAttribute('content', 'Explore o nosso blog para encontrar as últimas notícias, guias úteis sobre viver em Portugal e histórias inspiradoras da nossa comunidade.');
        document.getElementById('meta-keywords').setAttribute('content', 'blog, portugal, comunidade, notícias, guias, viver em portugal, emprego, habitação');
        document.getElementById('meta-author').setAttribute('content', 'PortugalApoia');
    });

    // Inicia a renderização
    displayInitialPosts();
});