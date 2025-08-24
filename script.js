document.addEventListener('DOMContentLoaded', function () {
    // Preloader
    var preloader = document.getElementById('preloader');
    if (preloader) {
        window.onload = function () {
            preloader.style.display = 'none';
        };
    }

    // Botón de volver arriba
    var scrollTopBtn = document.getElementById("scrollTopBtn");
    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    };
    scrollTopBtn.addEventListener("click", function () {
        document.body.scrollTop = 0; // Para Safari
        document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
    });

    // Menú hamburguesa
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarCollapse = document.querySelector('.navbar-collapse');
    navbarToggler.addEventListener('click', function () {
        navbarCollapse.classList.toggle('show');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (event) {
        if (!navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
            navbarCollapse.classList.remove('show');
        }
    });

    // Cerrar menú al seleccionar una opción
    document.querySelectorAll('.navbar-nav a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // Función para cargar datos JSON
    function carregarDados(url, callback) {
        fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

    // Página de Empregos
    if (document.getElementById('job-listings')) {
        let empregos = [];
        const campoDeBusca = document.getElementById('job-search');
        const filtroDeLocalizacao = document.getElementById('location-filter');
        
        function exibirEmpregos(lista) {
            const container = document.getElementById('job-listings');
            container.innerHTML = '';
            const empregosAExibir = lista.length > 0 ? lista : empregos;
            empregosAExibir.forEach(job => {
                const jobCard = `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card job-card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${job.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${job.company} - ${job.location}</h6>
                                <p class="card-text">${job.description}</p>
                                <a href="${job.link}" class="btn btn-primary" target="_blank">Candidatar-se</a>
                            </div>
                        </div>
                    </div>`;
                container.innerHTML += jobCard;
            });
        }
        
        campoDeBusca.addEventListener('input', () => {
            const termoBuscado = campoDeBusca.value.toLowerCase();
            const localizacaoBuscada = filtroDeLocalizacao.value.toLowerCase();
            const empregosFiltrados = empregos.filter(job => 
                (job.title.toLowerCase().includes(termoBuscado) || job.company.toLowerCase().includes(termoBuscado)) &&
                job.location.toLowerCase().includes(localizacaoBuscada)
            );
            exibirEmpregos(empregosFiltrados);
        });

        filtroDeLocalizacao.addEventListener('input', () => {
             const termoBuscado = campoDeBusca.value.toLowerCase();
            const localizacaoBuscada = filtroDeLocalizacao.value.toLowerCase();
            const empregosFiltrados = empregos.filter(job => 
                (job.title.toLowerCase().includes(termoBuscado) || job.company.toLowerCase().includes(termoBuscado)) &&
                job.location.toLowerCase().includes(localizacaoBuscada)
            );
            exibirEmpregos(empregosFiltrados);
        });

        carregarDados('/_dados/empregos.json?t=' + new Date().getTime(), data => {
            empregos = data.jobs;
            exibirEmpregos(empregos);
        });
    }

    // Página de Habitação
    if (document.getElementById('housing-listings')) {
        carregarDados('/_dados/habitacao.json?t=' + new Date().getTime(), data => {
            const container = document.getElementById('housing-listings');
            const listings = data.habitacao.map(item => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card housing-card h-100">
                        <img src="${item.image}" class="card-img-top" alt="Foto de ${item.title}">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><small class="text-muted">Localização: ${item.location}</small></p>
                            <p class="card-text"><strong>Preço:</strong> ${item.price} €</p>
                            <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                        </div>
                    </div>
                </div>`).join('');
            container.innerHTML = listings;
        });
    }

    // Página de Doações
    if (document.getElementById('donations-listings')) {
        carregarDados('/_dados/doacoes.json?t=' + new Date().getTime(), data => {
            const container = document.getElementById('donations-listings');
            const listings = data.doacoes.map(item => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card donation-card h-100">
                        <img src="${item.image}" class="card-img-top" alt="Foto de ${item.title}">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><small class="text-muted">Localização: ${item.location}</small></p>
                             <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                        </div>
                    </div>
                </div>`).join('');
            container.innerHTML = listings;
        });
    }
    
    // Página de Serviços
    if (document.getElementById('services-listings')) {
        carregarDados('/_dados/servicos.json?t=' + new Date().getTime(), data => {
            const container = document.getElementById('services-listings');
            const listings = data.servicos.map(item => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card service-card h-100">
                        <img src="${item.image}" class="card-img-top" alt="Foto de ${item.title}">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><small class="text-muted">Área de atuação: ${item.area}</small></p>
                             <a href="https://www.facebook.com/messages/t/100088998513364" class="btn btn-primary" target="_blank">Contactar</a>
                        </div>
                    </div>
                </div>`).join('');
            container.innerHTML = listings;
        });
    }

    // Página do Blog
    if (document.getElementById('blog-posts')) {
        carregarDados('/_dados/blog.json?t=' + new Date().getTime(), data => {
            const container = document.getElementById('blog-posts');
            const posts = data.posts.map(post => `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card blog-card h-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                             <p class="card-text"><small class="text-muted">${new Date(post.date).toLocaleDateString()}</small></p>
                            <p class="card-text">${post.summary}</p>
                            <a href="#" class="btn btn-link">Ler mais</a>
                        </div>
                    </div>
                </div>`).join('');
            container.innerHTML = posts;
        });
    }
});