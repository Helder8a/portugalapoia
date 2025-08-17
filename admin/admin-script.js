// Fichero: admin/admin-script.js

// Usamos un MutationObserver para esperar a que Netlify CMS cargue los anuncios en la página.
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // Buscamos todas las tarjetas de anuncios que se han cargado.
            const entryCards = document.querySelectorAll('[data-testid^="entry-card-container-"]');
            entryCards.forEach(card => {
                // Buscamos el elemento que contiene el texto del resumen que configuramos antes.
                const summaryElement = card.querySelector('h2');
                if (summaryElement && summaryElement.textContent.includes('Vence em:')) {
                    // Extraemos la fecha del texto.
                    const dateString = summaryElement.textContent.split('Vence em:')[1].trim();
                    const expirationDate = new Date(dateString);
                    const today = new Date();

                    // Ajustamos la fecha de hoy para comparar solo el día, sin la hora.
                    today.setHours(0, 0, 0, 0);

                    // Si la fecha de vencimiento es anterior a hoy, añadimos nuestra marca.
                    if (expirationDate < today) {
                        summaryElement.parentElement.classList.add('expired-entry');
                    } else {
                        summaryElement.parentElement.classList.remove('expired-entry');
                    }
                }
            });
        }
    });
});

// Le decimos al observer que empiece a "vigilar" los cambios en la página.
observer.observe(document.body, {
    childList: true,
    subtree: true
});