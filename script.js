// --- CÓDIGO FINAL Y COMPLETO PARA SCRIPT.JS (CON RUTAS CORREGIDAS) ---
document.addEventListener("DOMContentLoaded", async () => {
    // ... (El resto del código se mantiene igual) ...

    // --- CARGA INICIAL DE TODO (CON RUTAS CORREGIDAS A ACENTOS) ---
    carregarConteudo('/_dados/doacoes.json', 'announcements-grid', renderDoacao, 'doações.html');
    carregarConteudo('/_dados/empregos.json', 'jobs-grid', renderEmprego, 'empregos.html');
    carregarConteudo('/_dados/servicos.json', 'services-grid', renderServico, 'serviços.html');
    carregarConteudo('/_dados/habitacao.json', 'housing-grid', renderHabitacao, 'habitação.html');

    // ... (El resto del código se mantiene igual) ...
});