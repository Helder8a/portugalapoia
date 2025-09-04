document.addEventListener("DOMContentLoaded", async () => {
    // --- FUNÇÕES PARA CARREGAR DADOS ---
    async function fetchData(url) {
        try {
            const response = await fetch(`${url}?v=${new Date().getTime()}`);
            if (!response.ok) throw new Error(`A resposta da rede para ${url} não foi bem-sucedida.`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar dados de ${url}:`, error);
            return null;
        }
    }

    // --- FUNÇÕES AUXILIARES ---
    function formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function calculateReadingTime(text) {
        if (!text) return '1 min de leitura';
        const wordsPerMinute = 225;
        const wordCount = text.replace(/<[^>]*>/g, " ").split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min de leitura`;
    }
    
    // --- CARREGAMENTO INICIAL DE DADOS ---
    const [postsData, authorsData] = await Promise.all([
        fetchData('/_dados/blog.json'),
        fetchData('/_dados/autores.json')
    ]);

    const allPosts = postsData ? postsData.posts.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
    const authors = authorsData ? authorsData : [];
    
    const authorsMap = new Map(authors.map(author => [author.id, author]));

    // --- LÓGICA PRINCIPAL ---
    const mainContent = document.querySelector('.blog-main-content');
    const postsGridContainer = document.getElementById('posts-grid');
    // ... (restante das variáveis globais que você já tem)

    function renderPosts(posts) {
        // ... (sua função renderPosts existente)
    }
    
    // --- LÓGICA PARA ATUALIZAR META TAGS E MODAL ---
    $('#postModal').on('show.bs.modal', function (event) {
        const card = $(event.relatedTarget);
        const postIndex = card.data('post-index');
        const post = allPosts[postIndex];
        
        if (post) {
            const author = authorsMap.get(post.author_id) || { nome: "Equipa PortugalApoia", avatar: "", bio: "" };
            const modal = $(this);

            // Atualiza o título da página e as meta tags para SEO
            document.title = `${post.title} | Blog PortugalApoia`;
            document.getElementById('meta-description').setAttribute('content', post.meta_description || post.summary);
            document.getElementById('meta-keywords').setAttribute('content', post.tags ? post.tags.join(', ') : '');
            document.getElementById('meta-author').setAttribute('content', author.nome);

            // Preenche o modal com as informações do post e do autor
            modal.find('#modal-image').attr('src', post.image);
            modal.find('.modal-title').text(post.title);
            
            // Injeta o bloco do autor
            const authorInfoHtml = `
                <img src="${author.avatar || 'images_pta/logocuadrado.jpg'}" alt="${author.nome}" class="rounded-circle mr-3" style="width:50px; height:50px;">
                <div>
                    <strong class="d-block">${author.nome}</strong>
                    <small class="text-muted">${author.bio || ''}</small>
                </div>`;
            modal.find('#modal-author-info').html(authorInfoHtml);

            modal.find('#modal-meta').html(`<span class="category">${post.category}</span> &bull; <span>${calculateReadingTime(marked.parse(post.body || ''))}</span> &bull; <span class="text-muted">${formatDate(post.date)}</span>`);
            modal.find('#modal-body').html(marked.parse(post.body || ''));
            
            // ... (sua lógica de partilha e Disqus existente)
        }
    });

    // --- Redefinir meta tags quando o modal for fechado ---
    $('#postModal').on('hidden.bs.modal', function () {
        document.title = 'Blog PortugalApoia | Notícias, Guias e Histórias da Comunidade';
        document.getElementById('meta-description').setAttribute('content', 'Explore o nosso blog para encontrar as últimas notícias, guias úteis sobre viver em Portugal e histórias inspiradoras da nossa comunidade.');
        document.getElementById('meta-keywords').setAttribute('content', 'blog, portugal, comunidade, notícias, guias, viver em portugal, emprego, habitação');
        document.getElementById('meta-author').setAttribute('content', 'PortugalApoia');
    });

    // ... (cole aqui o resto do seu código de blog.js: renderPosts, setupCategories, pesquisa, etc.)
});