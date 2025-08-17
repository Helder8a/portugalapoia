// --- CÓDIGO FINAL Y CORRECTO para admin/admin.js ---

// 1. Inyectamos nuestros estilos CSS directamente en la página del panel de control.
const styles = `
    /* Estilo para la tarjeta de un anuncio vencido en la lista. */
    a.expired-entry {
        border-left: 4px solid #e53935 !important;
        background-color: rgba(229, 57, 53, 0.05) !important;
    }
    
    /* Estilo para el título del anuncio vencido. */
    .expired-entry h2 {
        color: #c62828 !important;
        font-weight: bold;
    }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// 2. Función que busca y marca los anuncios vencidos.
function highlightExpiredEntries() {
    const entryCards = document.querySelectorAll('[data-testid^="entry-card-container-"]');
    
    entryCards.forEach(card => {
        const summaryElement = card.querySelector('h2');
        const linkElement = card.querySelector('a'); // Seleccionamos el enlace que envuelve la tarjeta

        if (summaryElement && linkElement && summaryElement.textContent.includes('Vence em:')) {
            const summaryText = summaryElement.textContent;
            
            // Extraemos la fecha (formato YYYY-MM-DD)
            const dateMatch = summaryText.match(/(\d{4}-\d{2}-\d{2})/);
            
            if (dateMatch) {
                const dateString = dateMatch[0];
                const expirationDate = new Date(dateString);
                const today = new Date();
                
                today.setHours(0, 0, 0, 0);
                expirationDate.setHours(23, 59, 59, 999); // Consideramos el día completo

                if (expirationDate < today) {
                    linkElement.classList.add('expired-entry');
                } else {
                    linkElement.classList.remove('expired-entry');
                }
            } else {
                // Si no hay fecha, nos aseguramos de que no tenga el estilo de vencido
                linkElement.classList.remove('expired-entry');
            }
        }
    });
}

// 3. Usamos un MutationObserver para ejecutar nuestra función cada vez que el panel cargue nuevos anuncios.
const observer = new MutationObserver((mutations) => {
    // Un pequeño retraso para asegurar que todos los elementos están en el DOM.
    setTimeout(highlightExpiredEntries, 200);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});