$(document).ready(function() {
    // Esconde o preloader quando a página estiver totalmente carregada
    $(window).on('load', function() {
        $('#preloader').fadeOut('slow');
    });

    // Caminho corrigido para o arquivo JSON. 
    // Se esta não for a URL correta no seu servidor, ajuste-a conforme necessário.
    const blogDataUrl = 'blog.json'; 

    // Função para buscar e exibir os posts do blog
    fetch(blogDataUrl)
        .then(response => {
            if (!response.ok) {
                // Se a resposta da rede não for bem-sucedida, lança um erro
                throw new Error(`Erro de rede: ${response.statusText} (status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                 // Se não houver dados ou o array estiver vazio
                 showError("Não foram encontrados artigos para exibir.");
                 return;
            }
            // Ordena os posts por data, do mais recente para o mais antigo
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            displayPosts(data);
            populateCategoryFilter(data);
        })
        .catch(error => {
            // Captura erros no fetch ou no processamento dos dados
            console.error('Erro ao carregar os artigos do blog:', error);
            showError(`Ocorreu um erro ao carregar o conteúdo do blog. Por favor, tente novamente mais tarde. Detalhe: ${error.message}`);
        });

    // Função para exibir uma mensagem de erro na página
    function showError(message) {
        const errorHtml = `<div class="col-12 text-center">
                               <p class="lead text-danger font-weight-bold">${message}</p>
                           </div>`;
        $('#latest-post').hide();
        $('#all-posts .section-title').hide();
        $('#posts-grid').html(errorHtml);
    }


    // Função para exibir os posts na página
    function displayPosts(posts, category = 'Todos') {
        const postsGrid = $('#posts-grid');
        const latestPostSection = $('#latest-post');
        postsGrid.empty();
        latestPostSection.empty();

        let filteredPosts = (category === 'Todos') ? posts : posts.filter(post => post.category === category);
        
        if (filteredPosts.length === 0) {
            $('#no-posts-message').show();
            $('#latest-post').hide();
            return;
        }
        
        $('#no-posts-message').hide();
        
        // Exibir o post mais recente (primeiro do array ordenado)
        const latestPost = filteredPosts.shift(); // Remove e retorna o primeiro item
        
        if (category === 'Todos' && latestPost) {
             const latestPostCard = `
                <div class="latest-post-card">
                    <img src="${latestPost.image}" alt="${latestPost.title}" class="latest-post-image">
                    <div class="latest-post-content">
                        <p class="latest-post-category">${latestPost.category}</p>
                        <h2 class="latest-post-title">${latestPost.title}</h2>
                        <p class="latest-post-summary">${latestPost.summary}</p>
                        <a href="#" class="read-more-btn" data-id="${latestPost.id}">Ler Mais <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>`;
            latestPostSection.html(latestPostCard).show();
        } else if (latestPost) {
            // Se estivermos numa categoria, adicionamos o post mais recente de volta à lista para ser exibido na grelha
            filteredPosts.unshift(latestPost);
            $('#latest-post').hide();
        }

        // Exibir os posts restantes na grelha
        filteredPosts.forEach(post => {
            const postCard = `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="post-card" data-id="${post.id}">
                        <img src="${post.image}" class="post-card-img-top" alt="${post.title}">
                        <div class="post-card-body">
                            <p class="post-card-category">${post.category}</p>
                            <h5 class="post-card-title">${post.title}</h5>
                            <p class="post-card-date">${new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            `;
            postsGrid.append(postCard);
        });

        // Adiciona o listener de clique para abrir o modal
        $('.post-card, .read-more-btn').on('click', function(e) {
            e.preventDefault();
            const postId = $(this).data('id');
            const post = posts.find(p => p.id === postId);
            if (post) {
                showPostModal(post);
            }
        });
    }

    // Função para popular o filtro de categorias
    function populateCategoryFilter(posts) {
        const categories = ['Todos', ...new Set(posts.map(post => post.category))];
        const categoryFilterNav = $('#category-filter-nav');
        categories.forEach(category => {
            const button = `<button class="category-btn ${category === 'Todos' ? 'active' : ''}" data-category="${category}">${category}</button>`;
            categoryFilterNav.append(button);
        });

        $('.category-btn').on('click', function() {
            $('.category-btn').removeClass('active');
            $(this).addClass('active');
            const selectedCategory = $(this).data('category');
            displayPosts(posts, selectedCategory);
        });
    }

    // Função para exibir o conteúdo do post num modal
    function showPostModal(post) {
        $('#modal-image').attr('src', post.image);
        $('#postModalLabel').text(post.title);
        
        const metaInfo = `
            <span><i class="fas fa-user"></i> ${post.author}</span>
            <span><i class="fas fa-calendar-alt"></i> ${new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span><i class="fas fa-tag"></i> ${post.category}</span>
        `;
        $('#modal-meta').html(metaInfo);
        
        // Usa a biblioteca 'marked' para converter Markdown em HTML
        $('#modal-body').html(marked.parse(post.content));
        
        $('#postModal').modal('show');
    }
});