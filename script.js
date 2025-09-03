// --- CÓDIGO FINAL, ESTABLE Y CON ANUNCIOS FUNCIONANDO ---

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/_dados/';

    // Função genérica para carregar e renderizar os cards
    async function loadAndRenderCards(dataType, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const response = await fetch(`${API_URL}${dataType}.json?v=${new Date().getTime()}`);
            if (!response.ok) {
                container.innerHTML = `<p class="text-center col-12">Não foi possível carregar o conteúdo.</p>`;
                return;
            }
            const items = await response.json();

            if (!items || items.length === 0) {
                container.innerHTML = `<p class="text-center col-12">De momento, não há itens para mostrar.</p>`;
                return;
            }

            let cardsHtml = items.map(item => {
                // Lógica para determinar o ícone com base no tipo de dado
                let iconClass = 'fas fa-info-circle'; // Ícone padrão
                if (dataType === 'servicos') {
                    iconClass = item.icon || 'fas fa-hands-helping';
                } else if (dataType === 'empregos') {
                    iconClass = 'fas fa-briefcase';
                } else if (dataType === 'doacoes') {
                    iconClass = 'fas fa-heart';
                }

                return `
                <div class="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
                    <div class="modern-card w-100">
                        <div class="icon-circle">
                            <i class="${iconClass}"></i>
                        </div>
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        ${item.link ? `<a href="${item.link}" class="btn btn-primary mt-auto" target="_blank" rel="noopener noreferrer">${item.link_text || 'Saber Mais'}</a>` : ''}
                    </div>
                </div>`;
            }).join('');

            container.innerHTML = cardsHtml;

        } catch (error) {
            console.error(`Erro ao carregar ${dataType}:`, error);
            container.innerHTML = `<p class="text-center col-12">Ocorreu um erro ao carregar o conteúdo.</p>`;
        }
    }

    // Carregar os diferentes tipos de conteúdo nas respetivas páginas
    loadAndRenderCards('servicos', 'services-container');
    loadAndRenderCards('empregos', 'jobs-container');
    loadAndRenderCards('doacoes', 'donations-container');
    
    // (O código para carregar os posts do blog na página principal permanece o mesmo)
    async function loadLatestBlogPosts() {
        const container = document.getElementById('latest-posts-container');
        if (!container) return; 

        try {
            const response = await fetch('/_dados/blog.json?v=' + new Date().getTime());
            if (!response.ok) return;

            const data = await response.json();
            const posts = (data.posts || []).sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestThree = posts.slice(0, 3);

            if (latestThree.length === 0) {
                container.innerHTML = '<p class="text-center col-12">De momento, não há notícias para mostrar.</p>';
                return;
            }

            let postsHtml = latestThree.map(post => `
                <div class="col-md-4 mb-4 d-flex align-items-stretch">
                    <div class="card w-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}" style="height: 200px; object-fit: cover;" loading="lazy">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text flex-grow-1">${post.summary}</p>
                            <a href="blog.html" class="btn btn-outline-primary mt-auto">Ler Mais</a>
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = postsHtml;
        } catch (error) {
            console.error("Erro ao carregar os posts do blog para a página principal:", error);
        }
    }
    loadLatestBlogPosts();
});