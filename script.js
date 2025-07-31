// ... (Todo el código anterior de script.js se mantiene igual hasta la función renderSinglePost)

function renderSinglePost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const post = todosOsAnuncios.find(p => p.id === postId);
    const container = document.querySelector('.post-container');

    if (post && container) {
        document.title = post.titulo + " - PortugalApoia";

        let videoHTML = '';
        // Lógica para procesar el video de YouTube
        if (post.videoUrl && post.videoUrl.includes('youtube.com/watch')) {
            const videoId = post.videoUrl.split('v=')[1].split('&')[0];
            videoHTML = `
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            `;
        }
        
        container.innerHTML = `
            <h1>${post.titulo}</h1>
            <p class="post-meta">Publicado em ${new Date(post.dataPublicacao).toLocaleDateString()}</p>
            <img src="${post.imagem}" alt="${post.titulo}" class="post-image-full">
            
            ${videoHTML} 

            <div class="post-body">${post.descricao.replace(/\n/g, '<br>')}</div>
        `;
    } else if (container) {
        container.innerHTML = '<h1>Artigo não encontrado.</h1>';
    }
}