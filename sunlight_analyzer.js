document.addEventListener('DOMContentLoaded', function () {
    const sunlightAnalyzerBtn = document.getElementById('sunlightAnalyzerBtn');
    if (!sunlightAnalyzerBtn) return;

    const canvas = document.getElementById('sunlightCanvas');
    const ctx = canvas.getContext('2d');
    const planUpload = document.getElementById('planUpload');
    const northAngleInput = document.getElementById('northAngle');
    const scaleInput = document.getElementById('scaleInput');
    const setScaleBtn = document.getElementById('setScaleBtn');
    const drawWallBtn = document.getElementById('drawWallBtn');
    const drawWindowBtn = document.getElementById('drawWindowBtn');
    const calculateSunlightBtn = document.getElementById('calculateSunlightBtn');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');

    let drawingMode = null; // 'wall' or 'window'
    let isDrawing = false;
    let startPoint = {};
    let elements = []; // { type, start, end }
    let backgroundImage = null;
    let scale = { pixels: 0, meters: 0 }; // pixels per meter

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (backgroundImage) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }
        elements.forEach(el => {
            ctx.beginPath();
            ctx.moveTo(el.start.x, el.start.y);
            ctx.lineTo(el.end.x, el.end.y);
            ctx.strokeStyle = el.type === 'wall' ? '#343a40' : '#007bff';
            ctx.lineWidth = el.type === 'wall' ? 5 : 7;
            ctx.stroke();
        });
    }

    planUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                backgroundImage = new Image();
                backgroundImage.onload = () => {
                    const aspectRatio = backgroundImage.width / backgroundImage.height;
                    canvas.height = canvas.width / aspectRatio;
                    redrawCanvas();
                };
                backgroundImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    drawWallBtn.addEventListener('click', () => {
        drawingMode = 'wall';
        canvas.style.cursor = 'crosshair';
        drawWallBtn.classList.add('active');
        drawWindowBtn.classList.remove('active');
    });

    drawWindowBtn.addEventListener('click', () => {
        drawingMode = 'window';
        canvas.style.cursor = 'crosshair';
        drawWindowBtn.classList.add('active');
        drawWallBtn.classList.remove('active');
    });

    canvas.addEventListener('mousedown', (e) => {
        if (!drawingMode) return;
        isDrawing = true;
        startPoint = { x: e.offsetX, y: e.offsetY };
    });

    canvas.addEventListener('mouseup', (e) => {
        if (!isDrawing || !drawingMode) return;
        isDrawing = false;
        const endPoint = { x: e.offsetX, y: e.offsetY };
        elements.push({ type: drawingMode, start: startPoint, end: endPoint });
        redrawCanvas();
    });

    clearCanvasBtn.addEventListener('click', () => {
        if (confirm('Tem a certeza que deseja limpar todo o desenho?')) {
            elements = [];
            backgroundImage = null;
            planUpload.value = '';
            redrawCanvas();
        }
    });

    calculateSunlightBtn.addEventListener('click', () => {
        alert('Funcionalidade em desenvolvimento.\nEste seria o ponto em que um algoritmo complexo calcularia a incidência de luz com base na orientação norte, janelas e paredes, gerando um mapa de calor sobre a planta.');
        // Aquí iría el algoritmo de cálculo de luz solar
    });

    sunlightAnalyzerBtn.addEventListener('click', () => {
        $('#sunlightModal').modal('show');
        setTimeout(resizeCanvas, 200); // Dar tiempo al modal para que se muestre
    });

    window.addEventListener('resize', resizeCanvas);
});