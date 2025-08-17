document.addEventListener('DOMContentLoaded', () => {
    const listSection = document.getElementById('blog-list-section');
    const postSection = document.getElementById('blog-post-section');
    
    // --- FUNCIÓN PRINCIPAL QUE GESTIONA LAS VISTAS ---
    const handleRouting = () => {
        const params = new URLSearchParams(window.location.search);
        const postName = params.get('post');

        if (postName) {
            // Si hay un `?post=...` en la URL, muestra el artículo
            showPostView(postName);
        } else {
            // Si no, muestra la lista de artículos
            showListView();
        }
    };

    // --- MUESTRA LA VISTA DE LA LISTA DE ARTÍCULOS ---
    const showListView = () => {
        listSection.style.display = 'block';
        postSection.style.display = 'none';
        const postsContainer = document.getElementById('blog-posts-container');
        if (!postsContainer || postsContainer.dataset.loaded) return;

        fetch('/_posts/')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const postFiles = Array.from(doc.querySelectorAll('a'))
                                       .map(a => a.getAttribute('href'))
                                       .filter(href => href.endsWith('.md'));

                if (postFiles.length === 0) {
                    postsContainer.innerHTML = '<p class="col-12 text-center lead text-muted">Ainda não há publicações no blog.</p>';
                    return;
                }

                postsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevos posts
                postFiles.sort().reverse().forEach(file => {
                    fetch(`/_posts/${file}`)
                        .then(res => res.text())
                        .then(markdown => {
                            const postData = parseFrontMatter(markdown);
                            const postSlug = file.replace('.md', '');
                            const postUrl = `/blog.html?post=${postSlug}`; // URL para el modo SPA

                            const postElement = document.createElement('div');
                            postElement.className = 'col-md-6 col-lg-4 mb-4';
                            postElement.innerHTML = `
                                <div class="card h-100 shadow-sm blog-post">
                                    <img src="${postData.thumbnail}" class="card-img-top" alt="${postData.title}" style="height: 200px; object-fit: cover;">
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title">${postData.title}</h5>
                                        <p class="card-text">${truncateText(stripMarkdown(postData.body), 100)}</p>
                                        <a href="${postUrl}" class="btn btn-primary mt-auto post-link">Ler Mais</a>
                                    </div>
                                    <div class="card-footer">
                                        <small class="text-muted">Publicado em: ${new Date(postData.date).toLocaleDateString('pt-PT')}</small>
                                    </div>
                                </div>`;
                            postsContainer.appendChild(postElement);
                        });
                });
                postsContainer.dataset.loaded = 'true';
            });
    };

    // --- MUESTRA LA VISTA DE UN ARTÍCULO INDIVIDUAL ---
    const showPostView = (postName) => {
        listSection.style.display = 'none';
        postSection.style.display = 'block';
        window.scrollTo(0, 0);

        fetch(`/_posts/${postName}.md`)
            .then(response => response.text())
            .then(markdown => {
                const postData = parseFrontMatter(markdown);
                const converter = new showdown.Converter();
                const htmlContent = converter.makeHtml(postData.body);

                document.title = `${postData.title} | PortugalApoia Blog`;
                document.getElementById('post-title').textContent = postData.title;
                document.getElementById('post-date').textContent = `Publicado em: ${new Date(postData.date).toLocaleDateString('pt-PT')}`;
                
                const imgElement = document.getElementById('post-thumbnail');
                if (postData.thumbnail) {
                    imgElement.src = postData.thumbnail;
                    imgElement.alt = postData.title;
                    imgElement.style.display = 'block';
                } else {
                    imgElement.style.display = 'none';
                }
                document.querySelector('.post-content').innerHTML = htmlContent;
            });
    };

    // --- GESTIÓN DE CLICS Y NAVEGACIÓN ---
    document.body.addEventListener('click', e => {
        if (e.target.matches('.post-link')) {
            e.preventDefault();
            const url = new URL(e.target.href);
            history.pushState({}, '', url.search);
            handleRouting();
        }
    });

    window.addEventListener('popstate', handleRouting);
    handleRouting();
});

// --- FUNCIONES AUXILIARES ---
function parseFrontMatter(markdown) {
    const match = /---\s*([\s-S]*?)\s*---/.exec(markdown);
    if (!match) return { body: markdown };
    const frontMatter = match[1];
    const body = markdown.slice(match[0].length);
    const data = {};
    frontMatter.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length > 1) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim().replace(/"/g, '');
            data[key] = value;
        }
    });
    return { ...data, body };
}

function stripMarkdown(markdown) {
    return markdown.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]\(.*?\)/g, '').replace(/#{1,6}\s/g, '').replace(/[*_`~]/g, '').replace(/\n\s*>/g, '\n').replace(/\n\s*[-*+]\s/g, '\n').replace(/\s+/g, ' ').trim();
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
}