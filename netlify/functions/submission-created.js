// Importa la librería 'node-fetch' para hacer peticiones en el backend
const fetch = require('node-fetch');

// Accede a las variables de entorno de forma segura que configuraste en Netlify
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Esta es la función que Netlify ejecutará cuando se envíe el formulario
exports.handler = async (event) => {
    // Netlify envía los datos del formulario en el 'body' del evento
    const submission = JSON.parse(event.body);
    const data = submission.payload.data;

    // Construye el mensaje que se enviará a Telegram
    const textContent = `
<b>Novo Anúncio Submetido (via Netlify Forms)</b>
-----------------------------------
<b>Tipo:</b> ${data.tipo_anuncio || 'N/A'}
<b>Título:</b> ${data.titulo_anuncio || 'N/A'}
<b>Email de Contacto:</b> ${data.email_contacto || 'N/A'}
-----------------------------------
<b>Descrição:</b>
${data.descricao || 'N/A'}
    `;

    // URL de la API de Telegram para enviar mensajes
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        // Realiza la petición a la API de Telegram
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: textContent,
                parse_mode: 'HTML'
            }),
        });
        
        // Si la petición a Telegram NO fue exitosa, registra el error
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de la API de Telegram:', errorData);
            // Devuelve un error para que puedas verlo en los logs de Netlify
            return {
                statusCode: response.status,
                body: `Error de Telegram: ${errorData.description}`,
            };
        }

        // Si todo fue bien, devuelve un código 200 para indicarle a Netlify que termine
        return {
            statusCode: 200,
            body: 'Mensaje enviado a Telegram.',
        };

    } catch (error) {
        // Si hay un error en la propia función (antes de llamar a Telegram), regístralo
        console.error('Error al ejecutar la función:', error);
        return {
            statusCode: 500,
            body: 'Error interno en la función.',
        };
    }
};