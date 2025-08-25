// Este código se ejecutará solo cuando todo el contenido HTML de la página del blog esté cargado.
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Buscamos en el HTML los lugares donde pondremos el contenido.
    const blogPostsContainer = document.getElementById('blog-posts');
    const categoryFilterContainer = document.getElementById('category-filter');

    // 2. Si no encontramos el contenedor de posts, significa que no estamos en la página del blog,
    //    así que detenemos el script para no causar errores.
    if (!blogPostsContainer) {
        return;
    }

    // 3. Esta variable guardará todos los artículos del blog una vez que los descarguemos.
    let allPosts = [];

    // 4. Esta función se conecta a tu fichero _dados/blog.json y descarga la lista de artículos.
    async function fetchBlogPosts() {
        try {
            const response = await fetch('/_dados/blog.json');
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            allPosts = await response.json();
            
            // Ordenamos los artículos para que los más nuevos aparezcan primero.
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Una vez descargados y ordenados, los mostramos en pantalla.
            displayPosts(allPosts);
            // Y creamos los botones para filtrar por categoría.
            createCategoryFilters(allPosts);
            
        } catch (error) {
            console.error("No se pudieron cargar los artículos del blog:", error);
            blogPostsContainer.innerHTML = "<p class='col-12 text-center'>Hubo un error al cargar las publicaciones.</p>";
        }
    }

    // 5. Esta función toma una lista de artículos y los dibuja en la pantalla.
    function displayPosts(postsToDisplay) {
        let htmlContent = '';
        if (postsToDisplay.length === 0) {
            htmlContent = '<p class="col-12 text-center">No se encontraron artículos.</p>';
        } else {
            postsToDisplay.forEach(post => {
                htmlContent += `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100 shadow-sm blog-post-card">
                            
                            <img class="card-img-top" src="${post.image}" alt="${post.title}" loading="lazy" decoding="async">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text text-muted">${post.summary}</p>
                                <a href="${post.link}" class="btn btn-primary mt-auto">Ler mais</a>
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

    // 6. Esta función crea los botones de filtro de forma automática.
    function createCategoryFilters(posts) {
        // Obtenemos una lista de categorías únicas, sin repetir.
        const categories = ['Todas', ...new Set(posts.map(post => post.category))];
        
        // Creamos un botón por cada categoría.
        categoryFilterContainer.innerHTML = categories.map(category => 
            `<button class="btn btn-outline-secondary m-1" data-category="${category}">${category}</button>`
        ).join('');

        // Hacemos que el botón "Todas" aparezca activo por defecto.
        categoryFilterContainer.querySelector('button').classList.add('active');
    }

    // 7. Esta función se encarga de filtrar los posts cuando haces clic en un botón.
    categoryFilterContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const selectedCategory = event.target.dataset.category;

            // Quitamos la clase "active" de todos los botones y se la ponemos solo al que fue clickeado.
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

    // 8. Finalmente, llamamos a la función inicial para que todo comience.
    fetchBlogPosts();
});