// PortugalApoia.com/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA O MENU MÓVIL (HAMBURGUER) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('#main-nav');
netlify/functions/enviar-telegram'netlify/functions/enviar-telegram'
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

        // Dentro de tu form.addEventListener('submit', async (event) => { ... })

        try {
            const formData = new FormData(form);

            // Llama a tu función de Netlify. La ruta es /.netlify/functions/NOMBRE_DEL_ARCHIVO
            const response = await fetch('/.netlify/functions/enviar-telegram', {
                method: 'POST',
                // Convierte el FormData a un formato que el backend pueda leer fácilmente
                body: new URLSearchParams(formData).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const result = await response.json();

            if (result.ok) {
                formMessage.textContent = 'Obrigado! O seu anúncio foi enviado e será revisto em breve.';
                formMessage.className = 'success visible';
                form.reset();
            } else {
                // Usa el mensaje de error que te devuelve tu propia función
                throw new Error(result.description || 'Ocorreu um erro desconhecido.');
            }
        } catch (error) {
            formMessage.textContent = `Erro ao enviar: ${error.message}. Por favor, tente novamente.`;
            formMessage.className = 'error visible';
            console.error('Erro no envio:', error);
        } finally {
            submitButton.disabled = false;
            setTimeout(() => {
                formMessage.className = 'hidden';
            }, 7000);
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

// --- LÓGICA PARA O PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});