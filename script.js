document.addEventListener('DOMContentLoaded', () => {

    const API_URL = '/_dados/';

    // --- FUNÇÃO SEGURA PARA CARREGAR DADOS ---
    const fetchData = async (fileName) => {
        try {
            const response = await fetch(`${API_URL}${fileName}?v=${new Date().getTime()}`);
            if (!response.ok) {
                console.error(`Não foi possível carregar o ficheiro: ${fileName}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao processar o ficheiro ${fileName}:`, error);
            return null;
        }
    };

    // --- FUNÇÃO PARA RENDERIZAR OS NOVOS CARDS MODERNOS ---
    const renderModernCards = (items, container, dataType) => {
        if (!items || items.length === 0) {
            container.innerHTML = `<p class="text-center col-12">De momento, não há itens para mostrar.</p>`;
            return;
        }

        let cardsHtml = items.map(item => {
            let iconClass = 'fas fa-info-circle'; // Ícone padrão
            if (dataType === 'servicos') iconClass = item.icon || 'fas fa-hands-helping';
            else if (dataType === 'empregos') iconClass = 'fas fa-briefcase';
            else if (dataType === 'doacoes') iconClass = 'fas fa-heart';

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
    };
    
    // --- FUNÇÃO PARA RENDERIZAR OS POSTS DO BLOG NA PÁGINA PRINCIPAL ---
    const renderLatestBlogPosts = (posts, container) => {
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="text-center col-12">De momento, não há notícias para mostrar.</p>';
            return;
        }
        
        const latestThree = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

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
    };

    // --- LÓGICA PRINCIPAL DE EXECUÇÃO ---
    // O script verifica qual contentor existe na página atual e só depois carrega os dados
    
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        fetchData('servicos.json').then(data => renderModernCards(data, servicesContainer, 'servicos'));
    }

    const jobsContainer = document.getElementById('jobs-container');
    if (jobsContainer) {
        fetchData('empregos.json').then(data => renderModernCards(data, jobsContainer, 'empregos'));
    }

    const donationsContainer = document.getElementById('donations-container');
    if (donationsContainer) {
        fetchData('doacoes.json').then(data => renderModernCards(data, donationsContainer, 'doacoes'));
    }

    const latestPostsContainer = document.getElementById('latest-posts-container');
    if (latestPostsContainer) {
        fetchData('blog.json').then(data => {
            if (data && data.posts) {
                renderLatestBlogPosts(data.posts, latestPostsContainer);
            }
        });
    }

    // --- LÓGICA DO PRELOADER (PARA GARANTIR QUE FUNCIONA SEMPRE) ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        // Adiciona um pequeno atraso para garantir que o conteúdo tenha tempo de renderizar
        setTimeout(() => {
            preloader.classList.add("hidden");
        }, 200);
    }
});