let score = 0;
let timeLeft = 300;
let timer;
let correctAnswer;
let maxResult;
let isProcessingAnswer = false; // Prevent multiple simultaneous submissions

const startButton = document.getElementById('start-button');
const gameDiv = document.getElementById('game');
const questionDiv = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit-answer');
const skipButton = document.getElementById('skip-question');
const endGameButton = document.getElementById('end-game');
const scoreDiv = document.getElementById('score');
const timerDiv = document.getElementById('timer');
const resultDiv = document.getElementById('result');
const finalScoreDiv = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const settings = document.getElementById('settings');
const clearHighscoreButton = document.getElementById('clear-highscore');
const galleryButton = document.getElementById('gallery-button');
const saveGifButton = document.getElementById('save-gif');

startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', () => {
    if (!isProcessingAnswer) {
        checkAnswer();
    }
});
skipButton.addEventListener('click', skipQuestion);
endGameButton.addEventListener('click', endGame);
restartButton.addEventListener('click', restartGame);
clearHighscoreButton.addEventListener('click', clearHighscores);
galleryButton.addEventListener('click', showGallery);
saveGifButton.addEventListener('click', saveGif);

// Event-Listener für die Enter-Taste
answerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !isProcessingAnswer) {
        event.preventDefault(); // Prevent default form submission
        checkAnswer();
    }
});

// Operation-specific maxResult configurations
const operationLimits = {
    'addition': { min: 10, max: 100 },
    'addition-carry': { min: 20, max: 100 },
    'addition-tens': { min: 20, max: 100 },
    'addition-simple-carry': { min: 20, max: 100 },
    'subtraktion': { min: 10, max: 100 },
    'subtraktion-carry': { min: 20, max: 100 },
    'multiplikation': { min: 20, max: 100 },
    'division': { min: 10, max: 100 }
};

// Function to update maxResult options based on selected operation
function updateMaxResultOptions() {
    const operation = document.getElementById('operation').value;
    const maxResultSelect = document.getElementById('maxResult');
    const currentValue = parseInt(maxResultSelect.value);
    const limits = operationLimits[operation];

    // Clear existing options
    maxResultSelect.innerHTML = '';

    // Add appropriate options based on operation limits
    const possibleValues = [10, 20, 50, 80, 100];
    possibleValues.forEach(value => {
        if (value >= limits.min && value <= limits.max) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = `bis ${value}`;
            maxResultSelect.appendChild(option);
        }
    });

    // If current value is invalid for new operation, select the first valid option
    if (currentValue < limits.min || currentValue > limits.max) {
        maxResultSelect.value = maxResultSelect.options[0].value;
    } else {
        maxResultSelect.value = currentValue;
    }
}

// Add event listener for operation change
document.getElementById('operation').addEventListener('change', updateMaxResultOptions);

// Initialize maxResult options on page load
document.addEventListener('DOMContentLoaded', updateMaxResultOptions);

function startGame() {
    const operation = document.getElementById('operation').value;
    maxResult = parseInt(document.getElementById('maxResult').value);
    
    // Validate selected maxResult against operation limits
    const limits = operationLimits[operation];
    if (maxResult < limits.min || maxResult > limits.max) {
        alert(`Für ${getOperationName(operation)} muss die maximale Ergebniszahl zwischen ${limits.min} und ${limits.max} liegen.`);
        return;
    }
    
    score = 0;
    timeLeft = 300;
    gameDiv.classList.remove('hidden');
    settings.classList.add('hidden');
    generateQuestion(operation);
    startTimer();
    displayScores(); // Update scores for the selected operation
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDiv.innerText = `Zeit: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function generateQuestion(operation) {
    let num1, num2;
    let attempts = 0;
    const maxAttempts = 50;

    do {
        attempts++;
        switch (operation) {
            case 'addition':
                // Addition ohne Übertrag
                num1 = Math.floor(Math.random() * (maxResult / 2));
                num2 = Math.floor(Math.random() * (maxResult - num1));
                if ((num1 % 10 + num2 % 10) >= 10) continue; // Übertrag gefunden, neue Zahlen generieren
                correctAnswer = num1 + num2;
                break;
            case 'addition-tens':
                // Addition mit Zehnerzahl
                num1 = Math.floor(Math.random() * (maxResult / 10)) * 10; // Generiere Zehnerzahl (10, 20, 30, etc.)
                if (num1 === 0) num1 = 10; // Stelle sicher, dass num1 mindestens 10 ist
                // Generiere zweite Zahl (mindestens 10, maximal bis zur Differenz von maxResult und num1)
                const minNum2 = 10;
                const maxNum2 = maxResult - num1;
                if (maxNum2 < minNum2) continue; // Falls der Bereich ungültig ist, neue Zahlen generieren
                num2 = minNum2 + Math.floor(Math.random() * (maxNum2 - minNum2 + 1));
                correctAnswer = num1 + num2;
                break;
            case 'addition-simple-carry':
                // Addition mit einfachem Übertrag (zweite Zahl einstellig)
                num2 = Math.floor(Math.random() * 8) + 1; // Zweite Zahl (1-8)
                let firstDigit;
                do {
                    firstDigit = Math.floor(Math.random() * (9 - num2)) + (num2 + 1); // Einerstelle größer als num2
                    num1 = Math.floor(Math.random() * Math.floor((maxResult - num2) / 10)) * 10 + firstDigit;
                } while (num1 === 0 || num1 + num2 > maxResult);
                correctAnswer = num1 + num2;
                break;
            case 'addition-carry':
                // Addition mit Übertrag
                num1 = Math.floor(Math.random() * (maxResult / 2));
                num2 = Math.floor(Math.random() * (maxResult - num1));
                if ((num1 % 10 + num2 % 10) < 10) continue; // Kein Übertrag, neue Zahlen generieren
                correctAnswer = num1 + num2;
                break;
            case 'subtraktion':
                // Subtraktion ohne Übertrag
                num1 = Math.floor(Math.random() * maxResult);
                num2 = Math.floor(Math.random() * num1);
                if (hasCarry(num1, num2)) continue; // Übertrag gefunden, neue Zahlen generieren
                correctAnswer = num1 - num2;
                break;
            case 'subtraktion-carry':
                // Subtraktion mit Übertrag
                num1 = Math.floor(Math.random() * maxResult);
                num2 = Math.floor(Math.random() * num1);
                if (!hasCarry(num1, num2)) continue; // Kein Übertrag, neue Zahlen generieren
                correctAnswer = num1 - num2;
                break;
            case 'multiplikation':
                num1 = Math.floor(Math.random() * Math.sqrt(maxResult));
                num2 = Math.floor(Math.random() * (maxResult / (num1 || 1)));
                correctAnswer = num1 * num2;
                break;
            case 'division':
                num2 = Math.floor(Math.random() * Math.sqrt(maxResult)) + 1;
                correctAnswer = Math.floor(Math.random() * (maxResult / num2));
                num1 = correctAnswer * num2;
                break;
        }
        // Wenn wir eine gültige Aufgabe gefunden haben, beenden wir die Schleife
        if (correctAnswer <= maxResult && correctAnswer >= 0) break;
        
        // Wenn zu viele Versuche, generieren wir eine einfache Addition
        if (attempts >= maxAttempts) {
            num1 = Math.floor(Math.random() * (maxResult / 2));
            num2 = Math.floor(Math.random() * (maxResult - num1));
            correctAnswer = num1 + num2;
            break;
        }
    } while (true);

    let operationSymbol = {
        'addition': '+',
        'addition-tens': '+',
        'addition-simple-carry': '+',
        'addition-carry': '+',
        'subtraktion': '-',
        'subtraktion-carry': '-',
        'multiplikation': '*',
        'division': '/'
    }[operation];

    questionDiv.innerText = `${num1} ${operationSymbol} ${num2}`;
    answerInput.value = '';
    answerInput.focus();
}

function hasCarry(num1, num2) {
    let carry = false;
    while (num1 > 0 && num2 > 0) {
        let digit1 = num1 % 10;
        let digit2 = num2 % 10;
        if (digit1 < digit2) {
            carry = true;
            break;
        }
        num1 = Math.floor(num1 / 10);
        num2 = Math.floor(num2 / 10);
    }
    return carry;
}

function checkAnswer() {
    isProcessingAnswer = true;
    const userAnswer = parseInt(answerInput.value);
    
    if (userAnswer === correctAnswer) {
        score++;
        scoreDiv.innerText = `Punkte: ${score}`;
        answerInput.classList.add('correct-answer');
        setTimeout(() => {
            answerInput.classList.remove('correct-answer');
            answerInput.value = '';
            const operation = document.getElementById('operation').value;
            generateQuestion(operation);
            isProcessingAnswer = false;
        }, 1000);
    } else {
        answerInput.classList.add('wrong-answer');
        setTimeout(() => {
            answerInput.classList.remove('wrong-answer');
            answerInput.value = '';
            isProcessingAnswer = false;
        }, 500);
    }
}

function skipQuestion() {
    score = Math.max(0, score - 1); // Verhindere negative Punktzahl
    scoreDiv.innerText = `Punkte: ${score}`;
    generateQuestion(document.getElementById('operation').value);
}

function endGame() {
    clearInterval(timer);
    gameDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    finalScoreDiv.innerText = `Dein Punktestand: ${score}`;
    
    const resultGif = document.getElementById('result-gif');
    const saveGifButton = document.getElementById('save-gif');
    
    // Prüfe ob das Spiel vorzeitig beendet wurde (Timer noch nicht abgelaufen)
    if (timeLeft > 0) {
        // Zeige nur das Emoji bei vorzeitigem Beenden
        resultGif.style.fontSize = '48px';
        resultGif.style.display = 'block';
        resultGif.style.textAlign = 'center';
        resultGif.src = '';
        resultGif.alt = '😕';
        resultGif.innerText = '😕';
        saveGifButton.style.display = 'none'; // Verstecke den Speichern-Button
    } else {
        // Normales Spielende - zeige GIF
        const gifQueries = ["super welpe", "Gut gemacht einhorn", "applaus tiere"];
        const TENOR_API_KEY = 'AIzaSyDXkrNEOQrYyYNVKX4X5QXeu6Cv35NP26M';
        const TENOR_API_URL = 'https://tenor.googleapis.com/v2/search';
        
        function getRandomLocalGif() {
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            return `img/end_${randomNumber}.gif`;
        }

        async function fetchRandomGif() {
            const randomQuery = gifQueries[Math.floor(Math.random() * gifQueries.length)];
            
            try {
                const response = await fetch(
                    `${TENOR_API_URL}?q=${encodeURIComponent(randomQuery)}&key=${TENOR_API_KEY}&client_key=mathe_lern_app&limit=10&contentfilter=high`
                );
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.results.length);
                    return data.results[randomIndex].media_formats.gif.url;
                } else {
                    throw new Error('No GIFs found');
                }
            } catch (error) {
                console.error('Error fetching GIF:', error);
                return getRandomLocalGif();
            }
        }

        resultGif.style.fontSize = ''; // Zurücksetzen der Schriftgröße
        resultGif.style.display = '';
        resultGif.style.textAlign = '';
        resultGif.innerText = '';
        saveGifButton.style.display = ''; // Zeige den Speichern-Button
        
        resultGif.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        fetchRandomGif().then(gifUrl => {
            if (gifUrl) {
                resultGif.src = gifUrl;
            } else {
                resultGif.src = getRandomLocalGif();
            }
        });
    }
    
    // Save and display scores
    saveScore();
    displayScores();
}

function saveScore() {
    const operation = document.getElementById('operation').value;
    let scores = JSON.parse(localStorage.getItem('scores') || '[]');
    scores.push({
        score: score,
        operation: operation,
        maxResult: maxResult,
        date: new Date().toISOString()
    });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function displayScores() {
    const currentOperation = document.getElementById('operation').value;
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    const filteredScores = scores.filter(score => score.operation === currentOperation);
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '<h2>Highscores - ' + getOperationName(currentOperation) + '</h2>';
    
    if (filteredScores.length === 0) {
        scoreList.innerHTML += '<p>Noch keine Highscores für diese Rechenart.</p>';
        return;
    }

    const list = document.createElement('ol');
    filteredScores.slice(0, 10).forEach(score => {
        const li = document.createElement('li');
        const date = new Date(score.date).toLocaleDateString();
        li.textContent = `${score.score} Punkte (Max: ${score.maxResult}) - ${date}`;
        list.appendChild(li);
    });
    scoreList.appendChild(list);
}

function getOperationName(operation) {
    const names = {
        'addition': 'Addition (ohne Übertrag)',
        'addition-tens': 'Addition (Zehner+Zahl)',
        'addition-simple-carry': 'Addition (einfacher Übertrag)',
        'addition-carry': 'Addition (mit Übertrag)',
        'subtraktion': 'Subtraktion (ohne Übertrag)',
        'subtraktion-carry': 'Subtraktion (mit Übertrag)',
        'multiplikation': 'Multiplikation',
        'division': 'Division'
    };
    return names[operation] || operation;
}

function clearHighscores() {
    if (confirm('Möchtest du wirklich alle Highscores löschen?')) {
        localStorage.removeItem('scores');
        displayScores();
    }
}

function restartGame() {
    // Clear game state
    clearInterval(timer);
    score = 0;
    timeLeft = 300;
    
    // Reset UI
    gameDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    settings.classList.remove('hidden');
    
    // Reset input and score display
    answerInput.value = '';
    scoreDiv.innerText = 'Punkte: 0';
    timerDiv.innerText = 'Zeit: 5:00';
    
    // Update scores for the current operation
    displayScores();
}

// Galerie-Funktionalität
let savedGifs = JSON.parse(localStorage.getItem('savedGifs') || '[]');

function saveGif() {
    const currentGif = document.getElementById('result-gif').src;
    if (!savedGifs.includes(currentGif)) {
        savedGifs.push(currentGif);
        localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
        saveGifButton.classList.add('saved');
    }
}

function removeGif(gifUrl) {
    savedGifs = savedGifs.filter(gif => gif !== gifUrl);
    localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
    showGallery(); // Aktualisiere die Galerie-Ansicht
}

function showGallery() {
    settings.classList.add('hidden');
    gameDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    
    // Erstelle oder aktualisiere das Galerie-Element
    let galleryDiv = document.getElementById('gallery');
    if (!galleryDiv) {
        galleryDiv = document.createElement('div');
        galleryDiv.id = 'gallery';
        document.querySelector('.container').appendChild(galleryDiv);
    }
    
    // Lösche bisherigen Inhalt
    galleryDiv.innerHTML = '';
    
    // Füge Zurück-Button hinzu
    const backButton = document.createElement('button');
    backButton.textContent = 'Zurück zum Hauptmenü';
    backButton.onclick = () => {
        galleryDiv.classList.add('hidden');
        settings.classList.remove('hidden');
    };
    galleryDiv.appendChild(backButton);
    
    // Zeige gespeicherte GIFs an
    savedGifs.forEach(gifUrl => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = gifUrl;
        img.alt = 'Gespeichertes GIF';
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.innerHTML = '×';
        removeButton.onclick = () => removeGif(gifUrl);
        
        item.appendChild(img);
        item.appendChild(removeButton);
        galleryDiv.appendChild(item);
    });
    
    galleryDiv.classList.remove('hidden');
}

// Zeichenfunktionalität
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const toggleDrawingBtn = document.getElementById('toggle-drawing');
const clearDrawingBtn = document.getElementById('clear-drawing');
const colorPicker = document.getElementById('color-picker');
const lineWidth = document.getElementById('line-width');
const drawingControls = document.getElementById('drawing-controls');

let isDrawing = false;
let isDrawingEnabled = false;
let lastX = 0;
let lastY = 0;

// Canvas-Größe an Container anpassen
function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 300;
}

// Initial und bei Größenänderung Canvas anpassen
window.addEventListener('load', resizeCanvas);
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
    e.preventDefault();
    if (!isDrawingEnabled) return;
    
    isDrawing = true;
    const pos = e.type === 'mousedown' ? getMousePos(e) : getTouchPos(e);
    lastX = pos.x;
    lastY = pos.y;
}

function draw(e) {
    e.preventDefault();
    if (!isDrawing || !isDrawingEnabled) return;

    const pos = e.type === 'mousemove' ? getMousePos(e) : getTouchPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = 'round';
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
}

function stopDrawing(e) {
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

// Zeichnen aktivieren/deaktivieren
toggleDrawingBtn.addEventListener('click', () => {
    isDrawingEnabled = !isDrawingEnabled;
    
    if (isDrawingEnabled) {
        canvas.classList.remove('hidden');
        drawingControls.classList.remove('hidden');
        toggleDrawingBtn.textContent = 'Zeichnen Aus';
        resizeCanvas();
    } else {
        canvas.classList.add('hidden');
        drawingControls.classList.add('hidden');
        toggleDrawingBtn.textContent = 'Zeichnen Ein';
    }
});

// Zeichnung löschen
clearDrawingBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
