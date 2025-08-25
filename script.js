// Este código se ejecutará cuando el contenido de la página esté listo.
document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // LÓGICA PARA LA PÁGINA DE INICIO (HOME)
    // ========================================================================
    const homeSectionsContainer = document.getElementById('home-sections');
    if (homeSectionsContainer) {
        fetch('/_dados/homepage.json')
            .then(response => response.json())
            .then(data => {
                let html = '';
                data.sections.forEach(section => {
                    html += `
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${section.title}</h5>
                                    <p class="card-text">${section.description}</p>
                                    <a href="${section.link}" class="btn btn-primary">Ver mais</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
                homeSectionsContainer.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar las secciones de la home:', error));
    }

    // ========================================================================
    // LÓGICA PARA LA PÁGINA DE SERVICIOS
    // ========================================================================
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        fetch('/_dados/servicos.json')
            .then(response => response.json())
            .then(data => {
                let html = '';
                data.servicos.forEach(service => {
                    html += `
                        <div class="col-md-4">
                            <div class="card mb-4 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${service.nome}</h5>
                                    <p class="card-text">${service.descricao}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                servicesContainer.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar los servicios:', error));
    }

    // ========================================================================
    // LÓGICA PARA LA PÁGINA DE EMPLEOS
    // ========================================================================
    const jobsContainer = document.getElementById('jobs-container');
    if (jobsContainer) {
        fetch('/_dados/empregos.json')
            .then(response => response.json())
            .then(data => {
                let html = '';
                data.empregos.forEach(job => {
                    html += `
                        <div class="col-md-4">
                            <div class="card mb-4 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${job.titulo}</h5>
                                    <p class="card-text"><strong>Empresa:</strong> ${job.empresa}</p>
                                    <p class="card-text"><strong>Localização:</strong> ${job.localizacao}</p>
                                    <a href="${job.link}" class="btn btn-primary">Ver vaga</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
                jobsContainer.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar los empleos:', error));
    }

    // ========================================================================
    // LÓGICA PARA LA PÁGINA DE DONACIONES
    // ========================================================================
    const donationsContainer = document.getElementById('donations-container');
    if (donationsContainer) {
        fetch('/_dados/doacoes.json')
            .then(response => response.json())
            .then(data => {
                // Aquí puedes agregar la lógica para mostrar las donaciones si es necesario
            })
            .catch(error => console.error('Error al cargar las donaciones:', error));
    }
    
    // NOTA: La lógica del blog ha sido eliminada de este fichero para evitar conflictos.
    // El blog es ahora 100% controlado por blog-script.js
});