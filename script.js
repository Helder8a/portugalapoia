// PortugalApoia.pt/script.js

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

    // --- LÓGICA DO FORMULÁRIO DE ANÚNCIOS ---
    const form = document.getElementById('form-anuncio');
    const formMessage = document.getElementById('form-message');

    if (form && formMessage) {
        // --- ATENÇÃO! ---
        // As chaves abaixo são apenas exemplos.
        // Para que o formulário funcione, você DEVE substituí-las pelas suas próprias chaves do bot do Telegram.
        // Manter chaves reais diretamente no código é um risco de segurança. Considere usar variáveis de ambiente ou um serviço de backend para maior segurança.
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

            if (!imagemFile) {
                formMessage.textContent = 'Por favor, selecione uma imagem.';
                formMessage.className = 'error visible';
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
                }, 7000); // A mensagem desaparece após 7 segundos
            }
        });
    }

    // --- LÓGICA PARA O MODAL DE DONATIVO (CORREÇÃO DEFINITIVA) ---
    const modal = document.getElementById('donativo-modal');
    // Usamos uma CLASS (.apoia-projeto-btn) para selecionar os botões, que é a forma correta.
    const openModalBtns = document.querySelectorAll('.apoia-projeto-btn');
    const closeModalBtn = modal ? modal.querySelector('.modal-close-btn') : null;

    if (modal && openModalBtns.length > 0 && closeModalBtn) {
        // Adicionamos o evento a todos os botões encontrados
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        });

        // Evento para fechar o modal com o botão 'X'
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Evento para fechar o modal clicando fora dele
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});