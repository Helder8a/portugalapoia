// PortugalApoia.com/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA O MENU MÓVIL (HAMBURGUER) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-visible');
            const isVisible = mainNav.classList.contains('nav-visible');
            mobileNavToggle.setAttribute('aria-expanded', isVisible);
            mobileNavToggle.textContent = isVisible ? '✕' : '☰';
        });
    }

    // --- LÓGICA DO FORMULÁRIO DE ANÚNCIOS (MODIFICADA) ---
    const form = document.getElementById('form-anuncio');
    const formMessage = document.getElementById('form-message');

    if (form && formMessage) {
        const BOT_TOKEN = '8194765669:AAHDUXxUC1PCFQIY1BnPsEGdabyYHhWNCOE';
        const CHAT_ID = '958614887';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            formMessage.textContent = 'A enviar o seu pedido para o bot...';
            formMessage.className = 'info visible';

            const tipoAnuncio = form.querySelector('input[name="tipo_anuncio"]:checked').value;
            const tituloAnuncio = form.titulo_anuncio.value;
            const emailContacto = form.email_contacto.value;
            const descricao = form.descricao.value;
            const imagemFile = form.imagem_anuncio.files[0];

            const textContent = `
<b>Novo Anúncio Submetido</b>
-----------------------------------
<b>Tipo:</b> ${tipoAnuncio}
<b>Título:</b> ${tituloAnuncio}
<b>Email de Contacto:</b> ${emailContacto}
-----------------------------------
<b>Descrição:</b>
${descricao}
            `;

            try {
                let response;
                if (imagemFile) {
                    // Se houver imagem, usa sendPhoto
                    const formData = new FormData();
                    formData.append('chat_id', CHAT_ID);
                    formData.append('photo', imagemFile);
                    formData.append('caption', textContent);
                    formData.append('parse_mode', 'HTML');
                    response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                        method: 'POST',
                        body: formData,
                    });
                } else {
                    // Se não houver imagem, usa sendMessage
                    response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: textContent,
                            parse_mode: 'HTML'
                        }),
                    });
                }

                const result = await response.json();
                if (result.ok) {
                    formMessage.textContent = 'Obrigado! O seu anúncio foi enviado e será revisto.';
                    formMessage.className = 'success visible';
                    form.reset();
                } else {
                    throw new Error(result.description || 'Ocorreu um erro desconhecido.');
                }
            } catch (error) {
                formMessage.textContent = `Erro ao enviar: ${error.message}. Verifique as suas chaves de Telegram e a conexão.`;
                formMessage.className = 'error visible';
                console.error('Erro no envio para o Telegram:', error);
            } finally {
                submitButton.disabled = false;
                setTimeout(() => {
                    formMessage.className = 'hidden';
                }, 7000);
            }
        });
    }

    // --- LÓGICA PARA O MODAL DE DONATIVO ---
    const modal = document.getElementById('donativo-modal');
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;

    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
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