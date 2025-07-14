// Zeichenfunktionalität
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) {
        console.error('Drawing canvas not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    console.log('Drawing canvas initialized:', canvas);
    const clearDrawingBtn = document.getElementById('clear-drawing');
    const colorPicker = document.getElementById('color-picker');
    const lineWidthInput = document.getElementById('line-width');
    const drawingControls = document.getElementById('drawing-controls');
    const minimizeButton = document.getElementById('minimize-button');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Globale Funktion zum Löschen der Notiz, damit sie von main.js aufgerufen werden kann
    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const answerInput = document.getElementById('answer');
        if(answerInput) answerInput.focus(); // Fokus auf das Eingabefeld setzen
    }

    function resizeCanvas() {
        const container = canvas.parentElement;
        if (container) {
            // Ensure we have valid dimensions
            const width = container.offsetWidth || container.clientWidth || 300;
            const height = container.offsetHeight || container.clientHeight || 200;
            
            canvas.width = width;
            canvas.height = height;
            
            console.log('Canvas resized to:', width, 'x', height);
        }
    }

    window.addEventListener('load', () => {
        resizeCanvas();
        setTimeout(resizeCanvas, 100);
    });
    window.addEventListener('resize', resizeCanvas);

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function getTouchPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }

    function startDrawing(e) {
        if (!window.isGameRunning) {
            console.log('Drawing disabled: game not running');
            return;
        }
        e.preventDefault();
        isDrawing = true;
        const pos = e.type === 'mousedown' ? getMousePos(e) : getTouchPos(e);
        lastX = pos.x;
        lastY = pos.y;
        console.log('Start drawing at:', lastX, lastY);
    }

    function draw(e) {
        if (!window.isGameRunning) return;
        e.preventDefault();
        if (!isDrawing) return;

        const pos = e.type === 'mousemove' ? getMousePos(e) : getTouchPos(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = lineWidthInput.value;
        ctx.lineCap = 'round';
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;
    }

    function stopDrawing(e) {
        if (!window.isGameRunning) return;
        e.preventDefault();
        isDrawing = false;
    }

    // Event Listener für Zeichnen
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });

    if (clearDrawingBtn) {
        clearDrawingBtn.addEventListener('click', window.clearCanvas);
    }

    // Minimieren/Maximieren der Zeichen-Steuerung
    if (minimizeButton) {
        minimizeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            drawingControls.classList.add('minimized');
        });
    }

    if (drawingControls) {
        drawingControls.addEventListener('click', () => {
            if (drawingControls.classList.contains('minimized')) {
                drawingControls.classList.remove('minimized');
            }
        });
    }
});
