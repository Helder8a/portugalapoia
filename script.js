document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('hidden');
        });
    }

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Funciones de renderizado para cada sección
    function renderJobPost(job) {
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${job.titulo}</h5>
                        <p class="card-text text-muted"><i class="fas fa-map-marker-alt"></i> ${job.localizacao}</p>
                        <p class="card-text">${job.descricao.substring(0, 150)}...</p>
                        <a href="mailto:${job.link_contato}" class="mt-auto btn btn-primary">Candidatar</a>
                    </div>
                </div>
            </div>
        `;
    }

    function renderDonationPost(donation) {
        const imageUrl = donation.imagem ? donation.imagem : 'https://images.unsplash.com/photo-1593113646045-ce45e1a12a81?ixlib=rb-1.2.1&auto=format&fit=crop';
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${imageUrl}" class="card-img-top" alt="${donation.titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${donation.titulo}</h5>
                        <p class="card-text text-muted"><i class="fas fa-map-marker-alt"></i> ${donation.localizacao}</p>
                        <p class="card-text">${donation.descricao.substring(0, 150)}...</p>
                        <a href="mailto:${donation.link_contato}" class="mt-auto btn btn-primary">Apoiar Causa</a>
                    </div>
                </div>
            </div>
        `;
    }

    function renderServicePost(service) {
        const logoUrl = service.logo_empresa ? service.logo_empresa : 'https://images.unsplash.com/photo-1520607162513-774f9d45e52a?ixlib=rb-1.2.1&auto=format&fit=crop';
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${logoUrl}" class="card-img-top" alt="${service.titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${service.titulo}</h5>
                        <p class="card-text text-muted"><i class="fas fa-map-marker-alt"></i> ${service.localizacao}</p>
                        <p class="card-text flex-grow-1">${service.descricao.substring(0, 150)}...</p>
                        <a href="mailto:${service.link_contato}" class="mt-auto btn btn-primary">Contactar</a>
                    </div>
                </div>
            </div>
        `;
    }

    function renderHousingPost(housing) {
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${housing.titulo}</h5>
                        <p class="card-text text-muted"><i class="fas fa-map-marker-alt"></i> ${housing.localizacao}</p>
                        <p class="card-text flex-grow-1">${housing.descricao.substring(0, 150)}...</p>
                        <a href="mailto:${housing.link_contato}" class="mt-auto btn btn-primary">Contactar</a>
                    </div>
                </div>
            </div>
        `;
    }

    function renderBlogPost(post) {
        const imageUrl = post.image ? post.image : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop';
        const postDate = post.date ? new Date(post.date).toLocaleDateString('pt-PT') : 'Data Desconhecida';
        const postAuthor = post.author || 'Anónimo';
        
        const snippet = post.body.substring(0, 150) + '...';

        return `
            <div class="col-lg-4 col-md-6 mb-4 blog-post-item">
                <div class="card h-100 shadow-sm">
                    <img src="${imageUrl}" class="card-img-top" alt="${post.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text text-muted">${postDate} por ${postAuthor}</p>
                        <p class="card-text flex-grow-1">${snippet}</p>
                        <a href="#" class="mt-auto btn btn-outline-primary">Ler mais</a>
                    </div>
                </div>
            </div>
        `;
    }

    function carregarConteudo(dataPath, targetId, renderFunction) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        fetch(dataPath)
            .then(response => response.json())
            .then(data => {
                const items = data[Object.keys(data)[0]];
                let htmlContent = '';
                items.forEach(item => {
                    htmlContent += renderFunction(item);
                });
                targetElement.innerHTML = htmlContent;
            })
            .catch(error => console.error(`Erro ao carregar o conteúdo de ${dataPath}:`, error));
    }

    // Llama a la función `carregarConteudo` para cada página
    if (document.getElementById('jobs-grid')) {
        carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderJobPost);
    }
    if (document.getElementById('announcements-grid')) {
        carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDonationPost);
    }
    if (document.getElementById('services-grid')) {
        carregarConteudo('/_dados/servicos.json', 'services-grid', renderServicePost);
    }
    if (document.getElementById('housing-grid')) {
        carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHousingPost);
    }
    if (document.getElementById('blog-posts-grid')) {
        carregarConteudo('/_dados/posts.json', 'blog-posts-grid', renderBlogPost);
    }
});