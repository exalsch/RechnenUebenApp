// Sound-Effekte
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
let isSoundEnabled = true;

// Sound-Toggle Funktionalität
const soundToggleBtn = document.getElementById('sound-toggle');
soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggleBtn.textContent = isSoundEnabled ? '🔔' : '🔕';
});

function playSound(sound) {
    if (isSoundEnabled) {
        sound.play();
    }
}

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
const scoreList = document.getElementById('score-list');

// Settings Modal Elements
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModalBtn = document.getElementById('close-settings-modal');
const securityCheckDiv = document.getElementById('security-check');
const securityQuestionP = document.getElementById('security-question');
const securityAnswerInput = document.getElementById('security-answer');
const securitySubmitBtn = document.getElementById('security-submit');
const settingsContentDiv = document.getElementById('settings-content');
const tenorApiKeyInput = document.getElementById('tenor-api-key');
const gifQueriesInput = document.getElementById('gif-queries');
const saveSettingsBtn = document.getElementById('save-settings');
const importGalleryBtn = document.getElementById('import-gallery');
const importGalleryInput = document.getElementById('import-gallery-input');
const exportGalleryBtn = document.getElementById('export-gallery');

let securityQuestionAnswer;

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

// Settings Modal Listeners
settingsButton.addEventListener('click', openSettingsModal);
closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
securitySubmitBtn.addEventListener('click', checkSecurityAnswer);
saveSettingsBtn.addEventListener('click', saveSettings);
exportGalleryBtn.addEventListener('click', exportGallery);
importGalleryBtn.addEventListener('click', () => importGalleryInput.click());
importGalleryInput.addEventListener('change', importGallery);

// Event-Listener für die Enter-Taste
answerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !isProcessingAnswer) {
        event.preventDefault(); // Prevent default form submission
        checkAnswer();
    }
});

// Event-Listener für sofortige Überprüfung
answerInput.addEventListener('input', function(event) {
    const userAnswer = parseInt(this.value);
    if (!isNaN(userAnswer) && userAnswer === correctAnswer && !isProcessingAnswer) {
        checkAnswer();
    }
});

// Operation-specific maxResult configurations
const operationLimits = {
    'addition': { min: 10, max: 100 },
    'addition-carry': { min: 20, max: 100 },
    'addition-tens': { min: 20, max: 100 },
    'addition-simple-carry': { min: 20, max: 100 },
    'mixed-simple': { min: 20, max: 100 },
    'mixed-carry': { min: 20, max: 100 },
    'subtraktion': { min: 10, max: 100 },
    'subtraktion-simple-carry': { min: 20, max: 100 },
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
    const possibleValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
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
    scoreList.classList.add('hidden');
    generateQuestion(operation);
    startTimer();
    displayScores(); // Update scores for the selected operation
    isGameRunning = true;
    canvas.classList.add('game-active');
    drawingControls.classList.add('game-active');
}

function startTimer() {
    const totalTime = 300; // Gesamtzeit in Sekunden
    timeLeft = totalTime;
    const progressBar = document.getElementById('progress');
    
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDiv.innerText = `⏲: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Aktualisiere den Fortschrittsbalken
        const progressPercent = (timeLeft / totalTime) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function generateQuestion(operation) {
    let num1, num2, operator;
    maxResult = parseInt(document.getElementById('maxResult').value);

    if (operation === 'mixed-simple' || operation === 'mixed-carry') {
        // Zufällig zwischen Addition und Subtraktion wählen
        const isAddition = Math.random() < 0.5;
        operation = isAddition ? 
            (operation === 'mixed-simple' ? 'addition-simple-carry' : 'addition-carry') :
            (operation === 'mixed-simple' ? 'subtraktion-simple-carry' : 'subtraktion-carry');
    }

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
            case 'subtraktion-simple-carry':
                // Subtraktion mit einfachem Übertrag (zweite Zahl einstellig)
                num2 = Math.floor(Math.random() * 9) + 1; // Zweite Zahl (1-9)
                let firstDigitSub;
                do {
                    firstDigitSub = Math.floor(Math.random() * 9); // Einerstelle der ersten Zahl
                    num1 = Math.floor(Math.random() * Math.floor(maxResult / 10)) * 10 + firstDigitSub;
                } while (num1 <= num2 || num1 === 0 || !hasCarry(num1, num2));
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
                num1 = Math.floor(Math.random() * 10) + 1; // Zahl von 1-10
                num2 = Math.floor(Math.random() * 10) + 1; // Zahl von 1-10
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
        'subtraktion-simple-carry': '-',
        'subtraktion-carry': '-',
        'multiplikation': '⋅',
        'division': '/'
    }[operation];

    questionDiv.innerText = `${num1} ${operationSymbol} ${num2}`;
    answerInput.value = '';
    answerInput.focus();
    clearCanvas(); // Notiz löschen
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
        playSound(correctSound);
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
        playSound(wrongSound);
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
    playSound(wrongSound); // Spiele den falschen Sound ab
    scoreDiv.innerText = `Punkte: ${score}`;
    generateQuestion(document.getElementById('operation').value);
    clearCanvas(); // Notiz löschen
}

// Load settings from localStorage or use defaults
let TENOR_API_KEY = localStorage.getItem('TENOR_API_KEY') || 'LIVDSRZULEJO'; // Default Key
let gifQueries = (localStorage.getItem('gifQueries') || "welpe;niedliche tiere;lustige tiere;Pfohlen").split(';');

function endGame() {
    clearInterval(timer);
    gameDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    scoreList.classList.remove('hidden');
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
        resultGif.alt = 'Schade';
        resultGif.innerText = '😕';
        saveGifButton.style.display = 'none'; // Verstecke den Speichern-Button
    } else {
        // Normales Spielende - zeige GIF
        const gifQueries = ["welpe", "niedliche tiere", "lustige tiere", "Pfohlen"];
        const TENOR_API_KEY = 'AIzaSyDXkrNEOQrYyYNVKX4X5QXeu6Cv35NP26M';
        const TENOR_API_URL = 'https://tenor.googleapis.com/v2/search';
        
        function getRandomLocalGif() {
            const randomNumber = Math.floor(Math.random() * 11) + 1;
            return `img/end_${randomNumber}.gif`;
        }

        async function fetchRandomGif() {
            const randomQuery = gifQueries[Math.floor(Math.random() * gifQueries.length)];
            console.log('GIF Suchanfrage:', randomQuery);
            
            try {
                const response = await fetch(
                    `${TENOR_API_URL}?q=${encodeURIComponent(randomQuery)}&key=${TENOR_API_KEY}&client_key=mathe_lern_app&limit=30&contentfilter=high`
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
    isGameRunning = false;
    canvas.classList.remove('game-active');
    drawingControls.classList.remove('game-active');
    clearCanvas(); // Notiz löschen
}

function saveScore() {
    const operation = document.getElementById('operation').value;
    let scores = JSON.parse(localStorage.getItem(`scores_${operation}`) || '[]');
    scores.push({
        score: score,
        maxResult: maxResult,
        date: new Date().toISOString()
    });
    localStorage.setItem(`scores_${operation}`, JSON.stringify(scores));
}

function displayScores() {
    const operation = document.getElementById('operation').value;
    let scores = JSON.parse(localStorage.getItem(`scores_${operation}`) || '[]');
    
    // Sortiere nach Datum (alt nach neu)
    scores.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Nimm die letzten 10 Einträge
    scores = scores.slice(-10);
    
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '<h3>Letzte 10 Runden:</h3>';
    
    scores.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('de-DE');
        const formattedTime = date.toLocaleTimeString('de-DE');
        const scoreItem = document.createElement('div');
        scoreItem.textContent = `${formattedDate} ${formattedTime} - Punkte: ${entry.score} (bis ${entry.maxResult})`;
        scoreList.appendChild(scoreItem);
    });
}

function getOperationName(operation) {
    const operationNames = {
        'addition': 'Addition (ohne Übertrag)',
        'addition-carry': 'Addition (mit Übertrag)',
        'addition-tens': 'Addition (Zehner+Zahl)',
        'addition-simple-carry': 'Addition (Übertrag einfach)',
        'mixed-simple': 'Addition & Subtraktion (Übertrag einfach)',
        'mixed-carry': 'Addition & Subtraktion (mit Übertrag)',
        'subtraktion': 'Subtraktion (ohne Übertrag)',
        'subtraktion-simple-carry': 'Subtraktion (Übertrag einfach)',
        'subtraktion-carry': 'Subtraktion (mit Übertrag)',
        'multiplikation': 'Multiplikation',
        'division': 'Division'
    };
    return operationNames[operation] || operation;
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
    scoreList.classList.add('hidden');
    settings.classList.remove('hidden');
    
    // Reset input and score display
    answerInput.value = '';
    scoreDiv.innerText = 'Punkte: 0';
    timerDiv.innerText = '⏲: 5:00';
    
    // Update scores for the current operation
    displayScores();
    clearCanvas(); // Notiz löschen
}

// Settings Modal Functions
function openSettingsModal() {
    generateSecurityQuestion();
    settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
    securityCheckDiv.classList.remove('hidden');
    settingsContentDiv.classList.add('hidden');
    securityAnswerInput.value = '';
}

const securityQuestions = [
    { question: "Was ist 12 * 11?", answer: 132 },
    { question: "Was ist 125 / 5?", answer: 25 },
    { question: "Was ist die Wurzel aus 144?", answer: 12 },
    { question: "Was ist 7 * 8 + 4?", answer: 60 },
    { question: "Was ist 100 - 3 * 3?", answer: 91 }
];

function generateSecurityQuestion() {
    const randomIndex = Math.floor(Math.random() * securityQuestions.length);
    const selectedQuestion = securityQuestions[randomIndex];
    securityQuestionAnswer = selectedQuestion.answer;
    securityQuestionP.textContent = selectedQuestion.question;
}

function checkSecurityAnswer() {
    const userAnswer = parseInt(securityAnswerInput.value);
    if (userAnswer === securityQuestionAnswer) {
        securityCheckDiv.classList.add('hidden');
        settingsContentDiv.classList.remove('hidden');
        // Load current settings into fields
        tenorApiKeyInput.value = TENOR_API_KEY;
        gifQueriesInput.value = gifQueries.join(';');
    } else {
        alert('Falsche Antwort. Bitte versuche es erneut.');
        generateSecurityQuestion();
        securityAnswerInput.value = '';
    }
}

function saveSettings() {
    TENOR_API_KEY = tenorApiKeyInput.value.trim();
    const queries = gifQueriesInput.value.trim();

    if (!TENOR_API_KEY) {
        alert('Der API Key darf nicht leer sein.');
        return;
    }
    if (!queries) {
        alert('Die Suchbegriffe dürfen nicht leer sein.');
        return;
    }

    gifQueries = queries.split(';').map(q => q.trim()).filter(q => q);
    localStorage.setItem('TENOR_API_KEY', TENOR_API_KEY);
    localStorage.setItem('gifQueries', gifQueries.join(';'));

    alert('Einstellungen gespeichert!');
    closeSettingsModal();
}

function exportGallery() {
    if (savedGifs.length === 0) {
        alert('Die Galerie ist leer. Es gibt nichts zu exportieren.');
        return;
    }
    const dataStr = JSON.stringify(savedGifs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'galerie-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importGallery(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedGifs = JSON.parse(e.target.result);
            if (!Array.isArray(importedGifs) || !importedGifs.every(item => typeof item === 'string')) {
                throw new Error('Ungültiges Dateiformat.');
            }

            // Merge without duplicates
            const newGifs = importedGifs.filter(gif => !savedGifs.includes(gif));
            savedGifs.push(...newGifs);
            localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
            alert(`${newGifs.length} neue GIFs wurden zur Galerie hinzugefügt.`);
            showGallery(); // Refresh gallery view if open
        } catch (error) {
            alert('Fehler beim Importieren der Datei: ' + error.message);
        }
    };
    reader.readAsText(file);
    // Reset file input
    importGalleryInput.value = '';
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
    scoreList.classList.add('hidden');
    
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
const clearDrawingBtn = document.getElementById('clear-drawing');
const colorPicker = document.getElementById('color-picker');
const lineWidth = document.getElementById('line-width');
const drawingControls = document.getElementById('drawing-controls');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isGameRunning = false;

// Funktion zum Löschen der Notiz
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    answerInput.focus(); // Fokus auf das Eingabefeld setzen
}

// Canvas-Größe an Container anpassen
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

// Initial und bei Größenänderung Canvas anpassen
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
    if (!isGameRunning) return;
    e.preventDefault();
    isDrawing = true;
    const pos = e.type === 'mousedown' ? getMousePos(e) : getTouchPos(e);
    lastX = pos.x;
    lastY = pos.y;
}

function draw(e) {
    if (!isGameRunning) return;
    e.preventDefault();
    if (!isDrawing) return;

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
    if (!isGameRunning) return;
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

// Zeichnung löschen
clearDrawingBtn.addEventListener('click', clearCanvas);

// Minimieren/Maximieren der Zeichen-Steuerung
const minimizeButton = document.getElementById('minimize-button');

minimizeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Verhindert, dass das Klicken an das Elternelement weitergegeben wird
    drawingControls.classList.add('minimized');
});

drawingControls.addEventListener('click', () => {
    if (drawingControls.classList.contains('minimized')) {
        drawingControls.classList.remove('minimized');
    }
});
