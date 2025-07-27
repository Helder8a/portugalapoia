// PortugalApoya.pt/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL MENÚ MÓVIL (HAMBURGUESA) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    // SELECCIÓN POR ID PARA MAYOR PRECISIÓN
    const mainNav = document.querySelector('#main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            // Alterna la clase para mostrar/ocultar el menú
            mainNav.classList.toggle('nav-visible');

            // Actualiza el atributo ARIA para accesibilidad
            const isVisible = mainNav.classList.contains('nav-visible');
            mobileNavToggle.setAttribute('aria-expanded', isVisible);
            
            // Cambia el ícono de hamburguesa a una 'X' al abrir
            mobileNavToggle.textContent = isVisible ? '✕' : '☰';
        });
    }

    // --- LÓGICA DEL FORMULARIO DE ANUNCIOS ---
    const form = document.getElementById('form-anuncio');
    const formMessage = document.getElementById('form-message');

    if (form && formMessage) {
        // --- ¡IMPORTANTE! Pega tus claves de Telegram aquí ---
        const BOT_TOKEN = '8194765669:AAHDUXxUC1PCFQIY1BnPsEGdabyYHhWNCOE'; //
        const CHAT_ID = '958614887'; //
        // ----------------------------------------------------

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            formMessage.textContent = 'A enviar o seu pedido para o bot...'; //
            formMessage.className = 'info visible';

            // Recopilar datos del formulario
            const tipoAnuncio = form.querySelector('input[name="tipo_anuncio"]:checked').value; //
            const tituloAnuncio = form.titulo_anuncio.value; //
            const emailContacto = form.email_contacto.value; //
            const descricao = form.descricao.value; //
            const imagemFile = form.imagem_anuncio.files[0]; //

            if (!imagemFile) {
                formMessage.textContent = 'Por favor, selecione uma imagem.'; //
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
            `; //

            const formData = new FormData();
            formData.append('chat_id', CHAT_ID); //
            formData.append('photo', imagemFile); //
            formData.append('caption', caption); //
            formData.append('parse_mode', 'HTML'); //

            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { //
                    method: 'POST', //
                    body: formData, //
                });
                const result = await response.json(); //
                if (result.ok) {
                    formMessage.textContent = 'Obrigado! O seu anúncio foi enviado e será revisto.'; //
                    formMessage.className = 'success visible';
                    form.reset();
                } else {
                    throw new Error(result.description);
                }
            } catch (error) {
                formMessage.textContent = 'Erro ao enviar. Verifique as suas chaves de Telegram.'; //
                formMessage.className = 'error visible';
                console.error('Erro no envio para o Telegram:', error);
            } finally {
                submitButton.disabled = false;
                setTimeout(() => {
                    formMessage.className = ''; // Oculta el mensaje
                }, 7000);
            }
        });
    }

    // --- LÓGICA PARA EL MODAL DE DONATIVO ---
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
        // Cerrar al hacer clic fuera del contenido del modal
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});