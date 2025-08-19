// URLs de tus posts de blog en la carpeta _blog.
// Asegúrate de actualizar esta lista cada vez que publiques un nuevo post.
const blogPosts = [
  '2025-08-17-¿por-qué-estudiar-en-portugal-2025-2026.md',
  // Aquí es donde debes agregar el nombre del archivo de tu nuevo post
  '2025-08-19-nombre-de-tu-nuevo-post.md',
];

// Función para renderizar el contenido del blog
const renderBlogPosts = async () => {
    const postsContainer = document.getElementById('blog-full-content');
    if (!postsContainer) {
        console.error('El elemento "blog-full-content" no fue encontrado.');
        return;
    }
    postsContainer.innerHTML = ''; // Limpiar el contenido existente

    // Cargar la librería Marked.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = async () => {
        const postsPromises = blogPosts.map(async (filename) => {
            try {
                const response = await fetch(`./_blog/${filename}`);
                if (!response.ok) {
                    console.error(`Error al cargar el archivo ${filename}: ${response.statusText}`);
                    return '';
                }
                const text = await response.text();
                const parts = text.split('---');
                const frontmatter = parts[1];
                const content = parts.slice(2).join('---').trim();

                const metadata = {};
                frontmatter.split('\n').filter(line => line.trim() !== '').forEach(line => {
                    const [key, value] = line.split(':');
                    if (key && value) {
                        metadata[key.trim()] = value.trim().replace(/"/g, '');
                    }
                });

                // AÑADIDO: Comprueba si existe una imagen de miniatura y la añade.
                const thumbnailHTML = metadata.thumbnail ? `<img src="${metadata.thumbnail}" class="img-fluid rounded mb-4" alt="${metadata.title}">` : '';

                const postHTML = `
                    <article class="blog-post-full">
                        ${thumbnailHTML}
                        <h2>${metadata.title}</h2>
                        <p class="text-muted">Fecha de publicación: ${new Date(metadata.date).toLocaleDateString()}</p>
                        <hr class="blog-separator">
                        <div class="blog-content">
                            ${marked.parse(content)}
                        </div>
                    </article>
                `;
                return postHTML;
            } catch (error) {
                console.error(`No se pudo renderizar el post ${filename}:`, error);
                return '';
            }
        });

        const renderedPosts = await Promise.all(postsPromises);
        postsContainer.innerHTML = renderedPosts.join('');
    };
    document.head.appendChild(script);
};

// Se asegura de que el DOM esté completamente cargado antes de renderizar
document.addEventListener('DOMContentLoaded', renderBlogPosts);