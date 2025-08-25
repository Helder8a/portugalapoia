// Este código se ejecutará solo cuando todo el contenido HTML de la página del blog esté cargado.
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Buscamos en el HTML los lugares donde pondremos el contenido.
    const blogPostsContainer = document.getElementById('blog-posts');
    const categoryFilterContainer = document.getElementById('category-filter');

    // 2. Si no estamos en la página del blog, detenemos el script.
    if (!blogPostsContainer) {
        return;
    }

    // 3. Esta variable guardará todos los artículos.
    let allPosts = [];

    // 4. Esta función descarga la lista de artículos desde tu fichero JSON.
    async function fetchBlogPosts() {
        try {
            // Se conecta al fichero JSON correcto
            const response = await fetch('/_dados/blog.json');
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            const data = await response.json();
            
            // ***** LA CORRECCIÓN CLAVE ESTÁ AQUÍ *****
            // Accedemos a la lista "posts" que está DENTRO del objeto JSON
            allPosts = data.posts; 
            
            // Ordenamos los artículos para que los más nuevos aparezcan primero.
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Mostramos los artículos en pantalla.
            displayPosts(allPosts);
            // Creamos los botones para filtrar.
            createCategoryFilters(allPosts);
            
        } catch (error) {
            console.error("No se pudieron cargar los artículos del blog:", error);
            blogPostsContainer.innerHTML = "<p class='col-12 text-center'>Hubo un error al cargar las publicaciones.</p>";
        }
    }

    // 5. Esta función dibuja los artículos en la pantalla (esta parte ya estaba bien).
    function displayPosts(postsToDisplay) {
        let htmlContent = '';
        if (postsToDisplay.length === 0) {
            htmlContent = '<p class="col-12 text-center">No se encontraron artículos.</p>';
        } else {
            postsToDisplay.forEach(post => {
                // Generamos el HTML de la tarjeta del artículo
                htmlContent += `
                    <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
                        <div class="card h-100 shadow-sm blog-post-card">
                            
                            <img class="card-img-top" src="${post.image}" alt="${post.title}" loading="lazy" decoding="async">
                            
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text text-muted">${post.summary}</p>
                                <a href="${post.link || '#'}" class="btn btn-primary mt-auto">Ler mais</a>
                            </div>
                            <div class="card-footer bg-transparent border-top-0">
                                <small class="text-muted">Publicado em ${new Date(post.date).toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        blogPostsContainer.innerHTML = htmlContent;
    }

    // 6. Esta función crea los botones de filtro automáticamente.
    function createCategoryFilters(posts) {
        if (!categoryFilterContainer) return;
        const categories = ['Todas', ...new Set(posts.map(post => post.category))];
        categoryFilterContainer.innerHTML = categories.map(category => 
            `<button class="btn btn-outline-secondary m-1" data-category="${category}">${category}</button>`
        ).join('');
        const firstButton = categoryFilterContainer.querySelector('button');
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }

    // 7. Esta función se encarga de filtrar los posts.
    if (categoryFilterContainer) {
        categoryFilterContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const selectedCategory = event.target.dataset.category;
                
                categoryFilterContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                if (selectedCategory === 'Todas') {
                    displayPosts(allPosts);
                } else {
                    const filteredPosts = allPosts.filter(post => post.category === selectedCategory);
                    displayPosts(filteredPosts);
                }
            }
        });
    }

    // 8. Llamamos a la función inicial para que todo comience.
    fetchBlogPosts();
});