// --- CÓDIGO ORIGINAL Y FUNCIONAL DE SCRIPT.JS ---
document.addEventListener('DOMContentLoaded', () => {
    const categories = ['empregos', 'doacoes', 'habitacao', 'servicos'];
    const allData = {};

    function fetchData(category) {
        return fetch(`/_dados/${category}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allData[category] = data.items;
            })
            .catch(error => {
                console.error(`Could not fetch ${category}:`, error);
            });
    }

    function renderCard(item, category) {
        const imageUrl = item.imagem || item.logo_empresa || (item.imagens && item.imagens.length > 0 ? item.imagens[0].imagem_url : 'path/to/default/image.jpg');
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm announcement-card">
                    <img src="${imageUrl}" class="card-img-top lazy" data-src="${imageUrl}" alt="${item.titulo}">
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                        <h5 class="card-title text-white">${item.titulo}</h5>
                        <p class="card-text text-white">${item.descricao}</p>
                        <p class="card-text text-white"><small><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</small></p>
                    </div>
                </div>
            </div>
        `;
    }

    function displayData(filter = 'all') {
        const container = document.getElementById('announcements-container');
        if (container) {
            container.innerHTML = '';
            let itemsToShow = [];

            if (filter === 'all') {
                categories.forEach(category => {
                    if (allData[category]) {
                        itemsToShow = itemsToShow.concat(allData[category]);
                    }
                });
            } else {
                if (allData[filter]) {
                    itemsToShow = allData[filter];
                }
            }

            // Shuffle the items to display them in a random order
            itemsToShow.sort(() => 0.5 - Math.random());

            itemsToShow.forEach(item => {
                const category = 'servicos'; // Default category for now
                container.innerHTML += renderCard(item, category);
            });
        }
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to the clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            displayData(filter);
        });
    });

    // Initial data load
    Promise.all(categories.map(fetchData)).then(() => displayData('all'));
});