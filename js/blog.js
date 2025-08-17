document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('blog-posts-container');
    if (postsContainer) {
        fetch('/_posts/')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'));
                const postFiles = links.map(a => a.getAttribute('href')).filter(href => href.endsWith('.md'));

                if (postFiles.length === 0) {
                    postsContainer.innerHTML = '<p class="col-12 text-center lead text-muted">Ainda não há publicações no blog.</p>';
                    return;
                }

                postFiles.sort().reverse(); // Ordena por data (mais recente primeiro)

                postFiles.forEach(file => {
                    fetch(`/_posts/${file}`)
                        .then(response => response.text())
                        .then(markdown => {
                            const postData = parseFrontMatter(markdown);
                            // --- LÍNEA CORREGIDA ---
                            const postUrl = `/_layouts/post.html?post=${file.replace('.md', '')}`;
                            
                            const postElement = document.createElement('div');
                            postElement.className = 'col-md-6 col-lg-4 mb-4';
                            postElement.innerHTML = `
                                <div class="card h-100 shadow-sm blog-post">
                                    <img src="${postData.thumbnail}" class="card-img-top" alt="${postData.title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${postData.title}</h5>
                                        <p class="card-text">${truncateText(postData.body, 100)}</p>
                                        <a href="${postUrl}" class="btn btn-primary">Ler Mais</a>
                                    </div>
                                    <div class="card-footer">
                                        <small class="text-muted">Publicado em: ${new Date(postData.date).toLocaleDateString('pt-PT')}</small>
                                    </div>
                                </div>
                            `;
                            postsContainer.appendChild(postElement);
                        });
                });
            });
    }

    // Lógica para a página de publicação individual
    const postContentContainer = document.querySelector('.post-content');
    if (postContentContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const postName = urlParams.get('post');

        if (postName) {
            fetch(`/_posts/${postName}.md`)
                .then(response => response.text())
                .then(markdown => {
                    const postData = parseFrontMatter(markdown);
                    const converter = new showdown.Converter();
                    const htmlContent = converter.makeHtml(postData.body);

                    document.title = `${postData.title} | PortugalApoia Blog`;
                    document.querySelector('h1').textContent = postData.title;
                    document.querySelector('.text-muted').textContent = `Publicado em: ${new Date(postData.date).toLocaleDateString('pt-PT')}`;
                    if (postData.thumbnail) {
                        document.querySelector('.img-fluid').src = postData.thumbnail;
                        document.querySelector('.img-fluid').alt = postData.title;
                    } else {
                        document.querySelector('.img-fluid').style.display = 'none';
                    }
                    postContentContainer.innerHTML = htmlContent;
                });
        }
    }
});

function parseFrontMatter(markdown) {
    const match = /---\s*([\s\S]*?)\s*---/.exec(markdown);
    if (!match) {
        return { body: markdown };
    }
    const frontMatter = match[1];
    const body = markdown.slice(match[0].length);

    const data = {};
    frontMatter.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length > 1) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            data[key] = value.replace(/"/g, '');
        }
    });
    return { ...data, body };
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
}