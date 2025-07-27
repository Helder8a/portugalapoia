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

    // --- LÓGICA DO FORMULÁRIO DE ANÚNCIOS (MELHORADA) ---
    const form = document.getElementById('form-anuncio');
    const formMessage = document.getElementById('form-message');

    if (form && formMessage) {
        const BOT_TOKEN = '8194765669:AAHDUXxUC1PCFQIY1BnPsEGdabyYHhWNCOE';
        const CHAT_ID = '958614887';

        const buildTelegramMessage = (formData) => {
            return `
<b>Novo Anúncio Submetido</b>
-----------------------------------
<b>Tipo:</b> ${formData.get('tipo_anuncio')}
<b>Título:</b> ${formData.get('titulo_anuncio')}
<b>Email de Contacto:</b> ${formData.get('email_contacto')}
-----------------------------------
<b>Descrição:</b>
${formData.get('descricao')}
            `;
        };

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            formMessage.textContent = 'A enviar o seu pedido...';
            formMessage.className = 'info visible';

            const formData = new FormData(form);
            const textContent = buildTelegramMessage(formData);
            const imagemFile = formData.get('imagem_anuncio');

            try {
                let response;
                if (imagemFile && imagemFile.size > 0) {
                    // Se houver imagem, usa sendPhoto
                    const photoFormData = new FormData();
                    photoFormData.append('chat_id', CHAT_ID);
                    photoFormData.append('photo', imagemFile);
                    photoFormData.append('caption', textContent);
                    photoFormData.append('parse_mode', 'HTML');
                    response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                        method: 'POST',
                        body: photoFormData,
                    });
                } else {
                    // Se não houver imagem, usa sendMessage
                    response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: textContent,
                            parse_mode: 'HTML'
                        }),
                    });
                }

                const result = await response.json();
                if (result.ok) {
                    formMessage.textContent = 'Obrigado! O seu anúncio foi enviado e será revisto em breve.';
                    formMessage.className = 'success visible';
                    form.reset();
                } else {
                    throw new Error(result.description || 'Ocorreu um erro desconhecido ao comunicar com o Telegram.');
                }
            } catch (error) {
                formMessage.textContent = `Erro ao enviar: ${error.message}. Por favor, tente novamente.`;
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