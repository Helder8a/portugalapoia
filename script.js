document.addEventListener('DOMContentLoaded', () => {
    // --- ¡IMPORTANTE! Pega tus claves de Telegram aquí ---
    const BOT_TOKEN = '8194765669:AAHDUXxUC1PCFQIY1BnPsEGdabyYHhWNCOE';
    const CHAT_ID = '958614887';
    // ----------------------------------------------------

    const form = document.getElementById('form-anuncio');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            formMessage.textContent = 'A enviar o seu pedido para o bot...';
            formMessage.className = 'info';

            const tipoAnuncio = form.querySelector('input[name="tipo_anuncio"]:checked').value;
            const tituloAnuncio = form.titulo_anuncio.value;
            const emailContacto = form.email_contacto.value;
            const descricao = form.descricao.value;
            const imagemFile = form.imagem_anuncio.files[0];

            if (!imagemFile) {
                formMessage.textContent = 'Por favor, selecione uma imagem.';
                formMessage.className = 'error';
                submitButton.disabled = false;
                return;
            }

            const caption = `
<b>Novo Anúncio Submetido</b>
-----------------------------------
<b>Tipo:</b> ${tipoAnuncio}
<b>Título:</b> ${tituloAnuncio}
<b>Email de Contacto:</b> ${emailContacto}
-----------------------------------
<b>Descrição:</b>
${descricao}
            `;

            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', imagemFile);
            formData.append('caption', caption);
            formData.append('parse_mode', 'HTML');

            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (result.ok) {
                    formMessage.textContent = 'Obrigado! O seu anúncio foi enviado e será revisto.';
                    formMessage.className = 'success';
                    form.reset();
                } else {
                    throw new Error(result.description);
                }
            } catch (error) {
                formMessage.textContent = 'Erro ao enviar. Verifique as suas chaves de Telegram.';
                formMessage.className = 'error';
                console.error('Erro no envio para o Telegram:', error);
            } finally {
                submitButton.disabled = false;
                setTimeout(() => {
                    formMessage.className = 'hidden';
                }, 7000);
            }
        });
    }

    const modal = document.getElementById('donativo-modal');
    const openModalBtn = document.getElementById('apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;

    if (modal && openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});