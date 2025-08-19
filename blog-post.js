// blog-post.js

document.addEventListener('DOMContentLoaded', () => {
    initBlogPost();
});

function parseFrontMatter(text) {
    const frontMatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = frontMatterRegex.exec(text);
    if (!match) return { attributes: {}, body: text };
    // jsyaml is loaded from a CDN in post.html
    const attributes = jsyaml.load(match[1]);
    const body = text.slice(match[0].length).trim();
    return { attributes, body };
}

async function initBlogPost() {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    const container = document.getElementById('post-container');

    if (!postSlug) {
        container.innerHTML = '<p class="text-center">Artigo não encontrado.</p>';
        return;
    }

    try {
        const response = await fetch(`/_blog/${postSlug}.md`);
        if (!response.ok) throw new Error('Post not found');
        const text = await response.text();
        const { attributes, body } = parseFrontMatter(text);
        
        // showdown is loaded from a CDN in post.html
        const converter = new showdown.Converter();
        const contentHtml = converter.makeHtml(body);

        // Actualizar SEO y Título
        document.title = attributes.seo?.seo_title || attributes.title;
        document.getElementById('seo-description').setAttribute('content', attributes.seo?.meta_description || '');
        document.getElementById('seo-keywords').setAttribute('content', attributes.seo?.keywords || '');
        
        container.innerHTML = `
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <header class="post-full-header">
                        <span class="badge badge-category">${attributes.category}</span>
                        <h1 class="post-full-title mt-3">${attributes.title}</h1>
                        <div class="post-full-meta">
                            <span><i class="fas fa-calendar-alt"></i> ${new Date(attributes.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </header>
                    <img src="${attributes.thumbnail}" alt="${attributes.title}" class="post-full-image">
                    <section class="post-full-content">${contentHtml}</section>
                </div>
            </div>`;
    } catch (error) {
        console.error("Error al cargar el post:", error);
        container.innerHTML = '<p class="text-center">Ocorreu um erro ao carregar o artigo.</p>';
    }
}