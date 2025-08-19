document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    
    // Función de ayuda para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d.toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return 'Fecha Desconocida';
    };

    if (slug) {
        try {
            const markedScript = document.createElement('script');
            markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            document.head.appendChild(markedScript);

            markedScript.onload = async () => {
                const response = await fetch(`./_blog/${slug}.md`);
                if (!response.ok) throw new Error('Post not found');
                
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

                const thumbnailHTML = metadata.thumbnail ? `<img src="${metadata.thumbnail}" class="img-fluid rounded mb-4" alt="${metadata.title}">` : '';
                const formattedDate = formatDate(metadata.date);

                const postHTML = `
                    <article class="blog-post-full">
                        ${thumbnailHTML}
                        <h1 class="mb-3">${metadata.title}</h1>
                        <p class="text-muted"><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                        <hr class="blog-separator">
                        <div class="blog-content">
                            ${marked.parse(content)}
                        </div>
                    </article>
                `;

                document.getElementById('post-content').innerHTML = postHTML;
            };
        } catch (error) {
            console.error("Error loading post:", error);
            document.getElementById('post-content').innerHTML = `<p class="text-center">No se pudo cargar la publicación.</p>`;
        }
    } else {
        document.getElementById('post-content').innerHTML = `<p class="text-center">No se especificó ninguna publicación.</p>`;
    }
});