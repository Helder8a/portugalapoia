document.addEventListener('DOMContentLoaded', () => {
    fetch('/_dados/blog.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const blogPostsContainer = document.getElementById('blog-posts-container');
            const blogPosts = data.posts;
            
            const renderBlogPost = (post) => {
                const postDate = new Date(post.date);
                const formattedDate = postDate.toLocaleDateString('pt-PT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                const imageUrl = post.image;

                return `
                    <div class="col-lg-4 col-md-6 mb-4 blog-post-item" data-category="${post.category}">
                        <div class="blog-post-card">
                            <img class="card-img-top" src="${imageUrl}" alt="${post.title}" loading="lazy">
                            <div class="card-body">
                                <h5 class="card-title">${post.title}</h5>
                                <p class="text-muted small">Publicado em: ${formattedDate}</p>
                                <p class="card-text summary-content">${post.summary}</p>
                                <div class="full-content" style="display: none;">
                                    <p>${post.body.replace(/\n/g, '</p><p>')}</p>
                                </div>
                                <button class="btn btn-outline-primary read-more-btn mt-auto">Ler Mais</button>
                            </div>
                        </div>
                    </div>
                `;
            };

            blogPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = renderBlogPost(post);
                blogPostsContainer.appendChild(postElement.firstChild);
            });

            // Código para mostrar contenido completo y manejar filtros
            const blogItems = document.querySelectorAll('.blog-post-item');
            const categoryButtons = document.querySelectorAll('.category-btn');

            categoryButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.getAttribute('data-category');
                    blogItems.forEach(item => {
                        if (category === 'all' || item.getAttribute('data-category') === category) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });

            // Manejar clics para mostrar/ocultar el contenido completo
            blogPostsContainer.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('read-more-btn')) {
                    const cardBody = target.closest('.card-body');
                    const summary = cardBody.querySelector('.summary-content');
                    const fullContent = cardBody.querySelector('.full-content');

                    if (summary.style.display !== 'none') {
                        summary.style.display = 'none';
                        fullContent.style.display = 'block';
                        target.textContent = 'Ler Menos';
                    } else {
                        summary.style.display = 'block';
                        fullContent.style.display = 'none';
                        target.textContent = 'Ler Mais';
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching blog posts:', error));

    // Código para mostrar la fecha y hora actual en el pie de página
    const currentYear = new Date().getFullYear();
    const currentDateTimeElement = document.getElementById('currentDateTime');
    if (currentDateTimeElement) {
        currentDateTimeElement.textContent = `© ${currentYear} Portugal Apoia. Todos os direitos reservados.`;
    }
});