/*
  JavaScript para PortugalApoia.com
  Versión 5.1 - Completa y Funcional
*/
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupDonationModal();
    setupScrollTopButton();
    const bodyId = document.body.id;
    if (bodyId === 'pagina-blog') renderBlogList();
    else if (bodyId === 'pagina-post') renderSinglePost();
    else if (document.getElementById('listing-container')) renderAnuncios();
});

function renderAnuncios() {
    const container = document.getElementById('listing-container');
    if (!container || typeof todosOsAnuncios === 'undefined') return;
    let tipoDePagina = '', paginaActual = '';
    const bodyId = document.body.id;
    if (bodyId === 'pagina-empregos') { tipoDePagina = 'emprego'; paginaActual = 'empregos.html'; }
    else if (bodyId === 'pagina-servicos') { tipoDePagina = 'servico'; paginaActual = 'servicos.html'; }
    else if (bodyId === 'pagina-habitacao') { tipoDePagina = 'habitacao'; paginaActual = 'habitacao.html'; }
    else if (bodyId === 'pagina-doacoes') { tipoDePagina = 'doacao'; paginaActual = 'doacoes.html'; }
    if (!tipoDePagina) return;
    const anuncios = todosOsAnuncios.filter(item => item.tipo === tipoDePagina);
    container.innerHTML = '';
    if (anuncios.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%;">De momento não há anúncios nesta categoria.</p>';
        return;
    }
    anuncios.forEach(anuncio => {
        let contactoHTML = '';
        if (anuncio.tipo === 'doacao') {
             contactoHTML = `<a href="${anuncio.contacto}" class="button button-primary button-fullwidth">Quero Ajudar! (Contactar)</a>`;
        } else {
            if (anuncio.contacto) contactoHTML += `<p class="card-description"><strong>Contacto:</strong> <a href="${anuncio.contacto}">${anuncio.contacto.replace(/mailto:|tel:/, '').split('?')[0]}</a></p>`;
            if (anuncio.contacto2) contactoHTML += `<p class="card-description"><strong>Tel:</strong> <a href="${anuncio.contacto2}">${anuncio.contacto2.replace('tel:', '')}</a></p>`;
        }
        const shareURL = `https://www.portugalapoia.com/${paginaActual}#${anuncio.id}`;
        const shareText = encodeURIComponent(`Vi este anúncio em PortugalApoia: "${anuncio.titulo}". Ajude a partilhar!`);
        const shareButtonsHTML = `<div class="share-buttons"><a href="https://api.whatsapp.com/send?text=${shareText}%20${shareURL}" target="_blank" class="share-btn whatsapp">Partilhar</a></div>`;
        const imagemSrc = anuncio.imagem || 'images/favicon.ico.png';
        const tagClass = anuncio.tipo === 'doacao' ? 'artigos' : anuncio.tipo;
        const cardHTML = `<div class="card-causa" id="${anuncio.id}"><div class="card-image-container"><img src="${imagemSrc}" alt="${anuncio.titulo}" class="card-image" loading="lazy"></div><div class="card-header"><span class="card-tag card-tag-${tagClass}">${anuncio.tipo.charAt(0).toUpperCase() + anuncio.tipo.slice(1)}</span><span class="card-id">#${anuncio.id}</span></div><div class="card-content"><h3 class="card-title">${anuncio.titulo}</h3><p class="card-description">${anuncio.descricao}</p>${contactoHTML}${shareButtonsHTML}</div></div>`;
        container.innerHTML += cardHTML;
    });
}
function renderBlogList() {
    const container = document.getElementById('listing-container');
    if (!container || typeof todosOsAnuncios === 'undefined') return;
    const blogPosts = todosOsAnuncios.filter(item => item.tipo === 'blog').sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
    container.innerHTML = '';
    blogPosts.forEach(post => {
        const postLink = `post.html?id=${post.id}`;
        const excerpt = post.descricao.substring(0, 150) + '...';
        container.innerHTML += `<a href="${postLink}" class="blog-card"><div class="blog-card-image-container"><img src="${post.imagem || 'images/favicon.ico.png'}" alt="${post.titulo}" class="blog-card-image"></div><div class="blog-card-content"><h3 class="blog-card-title">${post.titulo}</h3><p class="blog-card-excerpt">${excerpt}</p><span class="blog-card-readmore">Ler Mais →</span></div></a>`;
    });
}
function renderSinglePost() {
    const container = document.querySelector('.post-container');
    if (!container || typeof todosOsAnuncios === 'undefined') return;
    const postId = new URLSearchParams(window.location.search).get('id');
    const post = todosOsAnuncios.find(p => p.id === postId && p.tipo === 'blog');
    if (post) {
        document.title = post.titulo + " - PortugalApoia";
        let mediaHTML = '';
        if (post.videoUrl && post.videoUrl.includes('youtu')) {
            const videoId = post.videoUrl.includes('youtu.be') ? post.videoUrl.split('/').pop() : post.videoUrl.split('v=')[1].split('&')[0];
            mediaHTML = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
        } else if (post.imagem) {
            mediaHTML = `<img src="${post.imagem}" alt="${post.titulo}" class="post-image-full">`;
        }
        container.innerHTML = `<h1>${post.titulo}</h1><p class="post-meta">Publicado em ${new Date(post.dataPublicacao).toLocaleDateString()}</p>${mediaHTML}<div class="post-body">${post.descricao.replace(/\n/g, '<br>')}</div>`;
    } else {
        container.innerHTML = '<h1>Artigo não encontrado.</h1>';
    }
}
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('#main-nav');
    if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('nav-visible'));
}
function setupDonationModal() {
    const modal = document.getElementById('donativo-modal');
    const openBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;
    if (modal && openBtns.length && closeBtn) {
        openBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('hidden')));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
    }
}
function setupScrollTopButton() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300));
        btn.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
}