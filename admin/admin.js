// --- CÓDIGO FINAL Y CORRECTO para admin/admin.js ---

// 1. Inyectamos nuestros estilos CSS directamente en la página del panel de control.
const styles = `
    [data-testid^="entry-card-container-"] [data-css-zmxd4a] { /* Selector genérico para el contenedor del sumario */
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
    }

    [data-testid^="entry-card-container-"] .expired-entry {
        border-left: 4px solid #e53935 !important;
        background-color: rgba(229, 57, 53, 0.05);
    }
    
    [data-testid^="entry-card-container-"] .expired-entry h2 { /* Selector para el título */
        color: #c62828 !important;
        font-weight: bold;
    }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// 2. Función que busca y marca los anuncios vencidos.
function highlightExpiredEntries() {
    // Buscamos todas las tarjetas de anuncios en la página.
    const entryCards = document.querySelectorAll('[data-testid^="entry-card-container-"]');
    
    entryCards.forEach(card => {
        // Encontramos el elemento del título/sumario
        const summaryElement = card.querySelector('h2');
        if (summaryElement && summaryElement.textContent.includes('Vence em:')) {
            const summaryText = summaryElement.textContent;
            
            // Extraemos la fecha (formato YYYY-MM-DD)
            const dateMatch = summaryText.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                const dateString = dateMatch[0];
                const expirationDate = new Date(dateString);
                const today = new Date();
                
                // Ponemos la hora a cero para comparar solo el día.
                today.setHours(0, 0, 0, 0);

                // La lógica de comparación es sensible a la zona horaria.
                // Para evitar problemas, consideramos la fecha de vencimiento como el final del día.
                expirationDate.setHours(23, 59, 59, 999);

                // Si la fecha de vencimiento ya pasó, añadimos la clase CSS.
                const container = summaryElement.closest('[data-css-zmxd4a]');
                if (container) {
                    if (expirationDate < today) {
                        container.classList.add('expired-entry');
                    } else {
                        container.classList.remove('expired-entry');
                    }
                }
            }
        }
    });
}

// 3. Usamos un MutationObserver para ejecutar nuestra función cada vez que el panel cargue nuevos anuncios.
const observer = new MutationObserver((mutations) => {
    // Un pequeño retraso para asegurar que todos los elementos están en el DOM.
    setTimeout(highlightExpiredEntries, 100);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});