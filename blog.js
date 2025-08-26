// --- CÓDIGO FINAL Y CORRECTO para blog.js (Versión de Columna Única) ---

document.addEventListener("DOMContentLoaded", () => {
    function onScriptReady(callback) {
        if (window.carregarConteudo) {
            callback();
        } else {
            setTimeout(() => onScriptReady(callback), 50);
        }
    }
    
    function calcularTempoLeitura(texto) {
        const palavrasPorMinuto = 200;
        const numeroDePalavras = texto.split(/\s+/).length;
        const tempo = Math.ceil(numeroDePalavras / palavrasPorMinuto);
        return tempo > 1 ? `${tempo} min de leitura` : `${tempo} min de leitura`;
    }

    function renderBlogPost(post) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
        const tempoLeitura = calcularTempoLeitura(post.body);
        
        return `
        <div class="col-12 blog-post-item" data-category="${post.category}" data-search-terms="${post.title.toLowerCase()} ${post.category.toLowerCase()} ${post.summary.toLowerCase()}">
            <div class="blog-post-card">
                <img class="card-img-top lazy" data-src="${post.image}" alt="${post.title}">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="text-muted small">Publicado em: ${formattedDate} &bull; Tempo de Leitura: ${tempoLeitura}</p>
                    <p class="card-text summary-content">${post.summary}</p>
                    <div class="full-content" style="display: none;">
                        <p>${post.body.replace(/\\n/g, '</p><p>')}</p>
                    </div>
                    <button class="btn btn-outline-primary read-more-btn">Ler Mais</button>
                </div>
            </div>
        </div>`;
    }

    function renderGalleryItem(item) {
        return `<div class="col-lg-6 col-md-12 mb-4"><div class="gallery-item"><a href="${item.image}" data-lightbox="gallery" data-title="${item.title} - ${item.caption}"><img class="lazy" data-src="${item.image}" alt="${item.title}"></a></div></div>`;
    }

    function setupBlogFunctionality(allPostsData) {
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.blog-post-card');
                const summary = card.querySelector('.summary-content');
                const fullContent = card.querySelector('.full-content');
                if (summary && fullContent) {
                    summary.style.display = 'none';
                    fullContent.style.display = 'block';
                    e.target.style.display = 'none';
                }
            });
        });

        const blogCategories = document.getElementById('blog-categories');
        const uniqueCategories = ['all', 'galeria', ...new Set(allPostsData.map(post => post.category))].sort();
        blogCategories.innerHTML = uniqueCategories.map(cat => `<a class="nav-link" data-target="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</a>`).join('');
        blogCategories.querySelector('[data-target="all"]').classList.add('active');

        const navLinks = document.querySelectorAll('.blog-nav .nav-link');
        const postsSection = document.getElementById('posts-section');
        const gallerySection = document.getElementById('gallery-section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                e.target.classList.add('active');
                const targetCategory = e.target.getAttribute('data-target');

                const allPosts = document.querySelectorAll('.blog-post-item');
                if (targetCategory === 'galeria') {
                    postsSection.style.display = 'none';
                    gallerySection.style.display = 'flex';
                } else {
                    postsSection.style.display = 'flex';
                    gallerySection.style.display = 'none';
                    allPosts.forEach(post => {
                        post.style.display = (targetCategory === 'all' || post.dataset.category === targetCategory) ? 'block' : 'none';
                    });
                }
            });
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        document.querySelectorAll('.blog-post-item').forEach(item => {
            observer.observe(item);
        });

        const searchInput = document.getElementById('blog-search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const allPosts = document.querySelectorAll('.blog-post-item');
            
            allPosts.forEach(post => {
                const searchTerms = post.dataset.searchTerms;
                if (searchTerms.includes(searchTerm)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }

    async function carregarBlog() {
        const postsData = await window.carregarConteudo('/_dados/blog.json');

        await Promise.all([
            window.carregarConteudo('/_dados/blog.json', 'posts-section', renderBlogPost, 'posts'),
            window.carregarConteudo('/_dados/galeria.json', 'gallery-section', renderGalleryItem, 'imagens')
        ]);
        
        setupBlogFunctionality(postsData.posts);
    }

    onScriptReady(() => {
        carregarBlog();
    });
});