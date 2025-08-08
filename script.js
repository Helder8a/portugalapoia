document.addEventListener("DOMContentLoaded", () => {
  // --- LÓGICA DEL PRECARGADOR (CORREGIDA) ---
  // Se ejecuta en cuanto el documento está listo, sin esperar a imágenes o anuncios.
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Se añade un pequeño retardo para que la transición sea visible y suave.
    setTimeout(() => {
        preloader.classList.add("hidden");
    }, 100);
  }
  
  // --- LÓGICA DEL BANNER DE COOKIES ---
  const cookieBanner = document.getElementById("cookie-consent-banner");
  const acceptCookiesBtn = document.getElementById("accept-cookies-btn");
  if (cookieBanner && acceptCookiesBtn) {
    if (localStorage.getItem("cookiesAccepted") !== "true") {
      cookieBanner.style.display = "flex";
    }
    acceptCookiesBtn.addEventListener("click", () => {
      cookieBanner.style.display = "none";
      localStorage.setItem("cookiesAccepted", "true");
    });
  }

  // --- LÓGICA DEL MENÚ MÓVIL ---
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const mainNav = document.querySelector("#main-nav");
  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener("click", () => {
      mainNav.classList.toggle("nav-visible");
      mobileNavToggle.classList.toggle("toggled");
      const isExpanded = mainNav.classList.contains("nav-visible");
      mobileNavToggle.setAttribute("aria-expanded", isExpanded);
    });
  }

  // --- LÓGICA DEL BOTÓN "VOLVER AL INICIO" ---
  const scrollTopBtn = document.getElementById("scrollTopBtn");
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
        behavior: 'smooth'
      });
    });
  }
});