// netlify/functions/submission-notification.js (Versión con SendGrid)

const sgMail = require('@sendgrid/mail');

// --- CONFIGURACIÓN ---
// Email desde el que se enviarán las notificaciones (debe estar verificado en SendGrid)
const SENDER_EMAIL = "helderb8a@gmail.com"; // <-- O el email que hayas verificado en SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body);
    const data = payload.data;

    const recipientEmail = data['contact-email'];
    const announcementTitle = data.title;

    if (!recipientEmail) {
      console.log("No se proporcionó un email, no se enviará notificación.");
      return { statusCode: 200, body: "No hay email para notificar." };
    }

    const msg = {
      to: recipientEmail,
      from: SENDER_EMAIL,
      subject: `Recebemos o seu anúncio: "${announcementTitle}"`,
      html: `
        <html>
          <body>
            <h2>Olá!</h2>
            <p>Recebemos o seu anúncio "<strong>${announcementTitle}</strong>" com sucesso!</p>
            <p>A nossa equipa de voluntários irá revê-lo nas próximas 24-48 horas. Se for aprovado, será publicado na secção correspondente do nosso site.</p>
            <p>Obrigado por fazer parte e ajudar a nossa comunidade a crescer.</p>
            <p>Com os melhores cumprimentos,<br><strong>Equipa PortugalApoia</strong></p>
            <hr>
            <p><a href="https://portugalapoia.com">Visite o nosso site</a></p>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);

    console.log(`Email de confirmação enviado para: ${recipientEmail} via SendGrid.`);
    return { statusCode: 200, body: "Email enviado com sucesso." };

  } catch (error) {
    console.error("Erro ao enviar o email com SendGrid:", error);
    if (error.response) {
      console.error(error.response.body)
    }
    return { statusCode: 500, body: `Erro: ${error.message}` };
  }
};