// (Todo el código inicial de preloader, scroll, tema oscuro y fetchJson se mantiene igual)
// ...

// --- NUEVAS Y MEJORADAS FUNCIONES DE RENDERIZADO ---

function formatarDatas(item) {
    if (!item || !item.data_publicacao) {
        return `<div class="date-info">ID: ${item.id || 'N/A'}</div>`;
    }
    const dataPublicacao = new Date(item.data_publicacao);
    const pubFormatada = dataPublicacao.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    if (!item.data_vencimento) {
        return `<div class="date-info">Publicado: ${pubFormatada}</div>`;
    }

    const dataVencimento = new Date(item.data_vencimento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const isVencido = dataVencimento < hoje;
    const classeVencido = isVencido ? 'vencido' : '';
    const textoVencido = isVencido ? ' (Vencido)' : '';

    return `<div class="date-info ${classeVencido}">Publicado: ${pubFormatada}${textoVencido}</div>`;
}

function renderEmprego(item, pageName) {
    const linkAnuncio = `empregos.html#${item.id}`;
    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="announcement-card">
            <div class="card-img-container">
                <div class="image-placeholder">EMPREGO</div>
                <span class="card-category-badge">Emprego</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${item.titulo || 'Sem Título'}</h5>
                <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao || 'N/A'}</h6>
                <p class="card-description">${item.descricao || 'Sem Descrição'}</p>
            </div>
            <div class="card-footer">
                ${formatarDatas(item)}
                <a href="${linkAnuncio}" class="btn btn-sm btn-outline-primary">Ver Mais</a>
            </div>
        </div>
    </div>`;
}

function renderDoacao(pedido, pageName) {
    const linkAnuncio = `doações.html#${pedido.id}`;
    const imagemHTML = pedido.imagem ? `<img loading="lazy" src="${pedido.imagem}" alt="${pedido.titulo}">` : '<div class="image-placeholder">DOAÇÃO</div>';
    
    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="announcement-card">
            <div class="card-img-container">
                ${imagemHTML}
                <span class="card-category-badge">Doação</span>
                ${pedido.urgente ? '<span class="badge badge-danger position-absolute" style="top: 12px; left: 12px;">Urgente</span>' : ''}
            </div>
            <div class="card-body">
                <h5 class="card-title">${pedido.titulo}</h5>
                <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${pedido.localizacao}</h6>
                <p class="card-description">${pedido.descricao}</p>
            </div>
            <div class="card-footer">
                ${formatarDatas(pedido)}
                <a href="${linkAnuncio}" class="btn btn-sm btn-primary">Ver Mais</a>
            </div>
        </div>
    </div>`;
}

function renderServico(item, pageName) {
    const linkAnuncio = `serviços.html#${item.id}`;
    const imagemHTML = item.logo_empresa ? `<img loading="lazy" src="${item.logo_empresa}" alt="Logo">` : '<div class="image-placeholder">SERVIÇO</div>';

    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="announcement-card">
            <div class="card-img-container">
                ${imagemHTML}
                <span class="card-category-badge">Serviço</span>
                ${item.valor_servico ? `<div class="card-price">${item.valor_servico}</div>` : ''}
            </div>
            <div class="card-body">
                <h5 class="card-title">${item.titulo}</h5>
                <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${item.localizacao}</h6>
                <p class="card-description">${item.descricao}</p>
            </div>
            <div class="card-footer">
                ${formatarDatas(item)}
                <a href="${linkAnuncio}" class="btn btn-sm btn-outline-primary">Ver Mais</a>
            </div>
        </div>
    </div>`;
}

function renderHabitacao(anuncio, pageName) {
    const linkAnuncio = `habitação.html#${anuncio.id}`;
    let imagemHTML = '<div class="image-placeholder">HABITAÇÃO</div>';
    if (anuncio.imagens && anuncio.imagens.length > 0) {
        imagemHTML = `<img loading="lazy" src="${anuncio.imagens[0].imagem_url || anuncio.imagens[0]}" alt="${anuncio.titulo}">`;
    }

    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="announcement-card">
            <div class="card-img-container">
                ${imagemHTML}
                <span class="card-category-badge">Habitação</span>
                ${anuncio.valor_anuncio ? `<div class="card-price">${anuncio.valor_anuncio}</div>` : ''}
            </div>
            <div class="card-body">
                <h5 class="card-title">${anuncio.titulo}</h5>
                <h6 class="card-location"><i class="fas fa-map-marker-alt mr-2"></i>${anuncio.localizacao}</h6>
                <p class="card-description">${anuncio.descricao}</p>
            </div>
            <div class="card-footer">
                ${formatarDatas(anuncio)}
                <a href="${linkAnuncio}" class="btn btn-sm btn-outline-primary">Ver Mais</a>
            </div>
        </div>
    </div>`;
}


// (El resto de tu script.js con las funciones `loadHomepageContent`, `updateImpactCounters`, `loadLatestAnnouncements` y las llamadas finales se mantiene igual)
// ...