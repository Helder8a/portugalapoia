// --- LÓGICA MEJORADA PARA COMPATIBILIDAD MÓVIL Y FUNCIONALIDADES EXISTENTES ---

// Función para gestionar la altura real del viewport en móviles
function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Ejecutar la función al cargar y al cambiar el tamaño de la ventana
window.addEventListener('resize', setViewportHeight);
window.addEventListener('load', setViewportHeight);

document.addEventListener("DOMContentLoaded", () => {
  // Ejecutar la función una vez que el DOM esté cargado
  setViewportHeight();

  // --- PRELOADER ---
  let preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 100);
  }

  // --- BANNER DE COOKIES ---
  let cookieBanner = document.getElementById("cookie-consent-banner");
  let acceptCookiesBtn = document.getElementById("accept-cookies-btn");
  if (cookieBanner && acceptCookiesBtn) {
    if (localStorage.getItem("cookiesAccepted") !== "true") {
      cookieBanner.style.display = "flex";
    }
    acceptCookiesBtn.addEventListener("click", () => {
      cookieBanner.style.display = "none";
      localStorage.setItem("cookiesAccepted", "true");
    });
  }

  // --- MENÚ DE NAVEGACIÓN MÓVIL ---
  let mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  let mainNav = document.querySelector("#main-nav");
  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener("click", () => {
      mainNav.classList.toggle("nav-visible");
      mobileNavToggle.classList.toggle("toggled");
      let isVisible = mainNav.classList.contains("nav-visible");
      mobileNavToggle.setAttribute("aria-expanded", isVisible);
    });
  }

  // --- BOTÓN DE SCROLL TO TOP ---
  let scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.onscroll = function () {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    };
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // --- LÓGICA PARA FEEDBACK EN EL FORMULARIO DE PUBLICACIÓN ---
  const adForm = document.getElementById('form-anuncio');
  if (adForm) {
    adForm.addEventListener('submit', function (event) {
      const submitButton = document.getElementById('submit-button');
      const buttonText = submitButton.querySelector('.button-text');

      // Deshabilitar el botón y mostrar estado de carga
      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
      if (buttonText) {
        buttonText.textContent = 'Enviando...';
      }
    });
  }
});