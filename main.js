

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
const saveSettingsBtn = document.getElementById('save-settings');

// Declare isGameRunning globally
let isGameRunning = false;

let securityQuestionAnswer;

// ... (rest of the code remains the same)
skipButton.addEventListener('click', skipQuestion);
endGameButton.addEventListener('click', endGame);
restartButton.addEventListener('click', restartGame);
clearHighscoreButton.addEventListener('click', clearHighscores);
startButton.addEventListener('click', startGame);


// Settings Modal Listeners
settingsButton.addEventListener('click', openSettingsModal);
closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
securitySubmitBtn.addEventListener('click', checkSecurityAnswer);
saveSettingsBtn.addEventListener('click', saveSettings);


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
document.addEventListener('DOMContentLoaded', () => {
    updateMaxResultOptions();
    checkApiKeyWarning();
});

function checkApiKeyWarning() {
    const apiKeyWarning = document.getElementById('api-key-warning');
    if (TENOR_API_KEY === 'LIVDSRZULEJO' || !TENOR_API_KEY) {
        apiKeyWarning.innerHTML = 'Hinweis: Für GIF-Belohnungen bitte einen eigenen Tenor API-Schlüssel in den ⚙️-Einstellungen eintragen.';
        apiKeyWarning.classList.remove('hidden');
    } else {
        apiKeyWarning.classList.add('hidden');
    }
}

function openSettingsModal() {
    generateSecurityQuestion();
    settingsModal.classList.remove('hidden');
}

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
    settingsButton.classList.add('hidden');
    scoreList.classList.add('hidden');
    generateQuestion(operation);
    startTimer();
    displayScores(); // Update scores for the selected operation
    isGameRunning = true;
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
}

// Load settings from localStorage or use defaults
let TENOR_API_KEY = localStorage.getItem('TENOR_API_KEY') || 'LIVDSRZULEJO'; // Default Key
let gifQueries = (localStorage.getItem('gifQueries') || "welpe;niedliche tiere;lustige tiere;Pfohlen").split(';');

function endGame() {
    clearInterval(timer);
    gameDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    finalScoreDiv.innerText = `Dein Punktestand: ${score}`;
    
    const resultGif = document.getElementById('result-gif');
    
    
    // Prüfe ob das Spiel vorzeitig beendet wurde (Timer noch nicht abgelaufen)
    if (timeLeft > 0) {
        // Zeige nur das Emoji bei vorzeitigem Beenden
        resultGif.style.fontSize = '48px';
        resultGif.style.display = 'block';
        resultGif.style.textAlign = 'center';
        resultGif.src = '';
        resultGif.alt = 'Schade';
        resultGif.innerText = '😕';
        if (typeof window.hideSaveGifButton === 'function') {
            window.hideSaveGifButton(); // Verstecke den Speichern-Button über die globale Funktion
        }
    } else {
        // Normales Spielende - zeige GIF
        const gifQueries = ["welpe", "niedliche tiere", "lustige tiere", "Pfohlen"];
        const TENOR_API_KEY = 'AIzaSyDXkrNEOQrYyYNVKX4X5QXeu6Cv35NP26M';
        const TENOR_API_URL = 'https://tenor.googleapis.com/v2/search';
        
        function getRandomLocalGif() {
            const localGifs = [
                'img/end_1.gif',
                'img/end_2.gif',
                'img/end_3.gif',
                'img/end_4.gif',
                'img/end_5.gif',
                'img/end_6.gif'
            ];
            const randomIndex = Math.floor(Math.random() * localGifs.length);
            return localGifs[randomIndex];
        }

        function getRandomOfflineGif() {
            const cachedUrls = JSON.parse(localStorage.getItem('cachedGifUrls') || '[]');
            if (cachedUrls.length > 0) {
                const randomIndex = Math.floor(Math.random() * cachedUrls.length);
                console.log('Found cached GIF:', cachedUrls[randomIndex]);
                return cachedUrls[randomIndex];
            } else {
                // Ultimate fallback to local GIFs if cache is empty
                console.log('No cached GIFs found, falling back to local GIF.');
                return getRandomLocalGif();
            }
        }

        async function fetchRandomGif() {
            // If online, fetch a new GIF
            if (navigator.onLine) {
                console.log('Online: Fetching a new GIF from Tenor.');
                const randomQuery = gifQueries[Math.floor(Math.random() * gifQueries.length)];
                try {
                    const response = await fetch(
                        `${TENOR_API_URL}?q=${encodeURIComponent(randomQuery)}&key=${TENOR_API_KEY}&client_key=mathe_lern_app&limit=30&contentfilter=high`
                    );
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const randomIndex = Math.floor(Math.random() * data.results.length);
                        return data.results[randomIndex].media_formats.gif.url;
                    } else {
                        throw new Error('No GIFs found for query: ' + randomQuery);
                    }
                } catch (error) {
                    console.error('Error fetching new GIF, falling back to offline/local:', error);
                    return getRandomOfflineGif(); // Fallback to offline logic
                }
            } else {
                // If offline, use a cached GIF
                console.log('Offline: Using a pre-cached GIF.');
                return getRandomOfflineGif();
            }
        }

        resultGif.style.fontSize = ''; // Zurücksetzen der Schriftgröße
        resultGif.style.display = '';
        resultGif.style.textAlign = '';
        resultGif.innerText = '';
        if (typeof window.showSaveGifButton === 'function') {
            window.showSaveGifButton(); // Zeige den Speichern-Button über die globale Funktion
        }
        
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
    window.isGameRunning = false;
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
    
    // Reset UI
    gameDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    scoreList.classList.add('hidden');
    settings.classList.remove('hidden');
    settingsButton.classList.remove('hidden');
    
    // Reset input and score display
    answerInput.value = '';
    scoreDiv.innerText = 'Punkte: 0';
    timerDiv.innerText = '⏲: 5:00';
    
    // Update scores for the current operation
    displayScores();
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
    { question: "Was ist 12 * 4?", answer: 48 },
    { question: "Was ist 125 / 5?", answer: 25 },
    { question: "Was ist 3 hoch 2?", answer: 9 },
    { question: "Was ist 7 * 7 + 4?", answer: 53 },
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





// Service Worker Registrierung
// ===== GIF Caching for Offline Use =====

// Function to pre-cache GIFs for offline use
async function precacheGifs() {
    // Only run if online
    if (!navigator.onLine) {
        console.log('Offline, skipping GIF pre-caching.');
        return;
    }

    console.log('Online, starting GIF pre-caching...');
    const PRECACHE_COUNT = 20; // Number of GIFs to pre-cache
    let cachedGifUrls = [];

    try {
        const randomQuery = gifQueries[Math.floor(Math.random() * gifQueries.length)];
        const response = await fetch(
            `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(randomQuery)}&key=${TENOR_API_KEY}&client_key=mathe_lern_app&limit=${PRECACHE_COUNT}&contentfilter=high`
        );

        if (!response.ok) throw new Error('Failed to fetch GIF list for precaching');

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const gifUrls = data.results.map(result => result.media_formats.gif.url);

            // Open the dynamic cache (defined in service-worker.js)
            const cache = await caches.open('rechnen-ueben-app-dynamic-cache-v1');

            // Fetch and cache each GIF
            for (const url of gifUrls) {
                try {
                    // Use 'no-cors' to fetch opaque responses from third-party servers like Tenor
                    const gifResponse = await fetch(url, { mode: 'no-cors' });
                    await cache.put(url, gifResponse);
                    cachedGifUrls.push(url);
                    console.log('Pre-cached GIF:', url);
                } catch (error) {
                    console.error('Failed to cache a single GIF:', url, error);
                }
            }
            
            // Store the list of successfully cached URLs in localStorage
            if (cachedGifUrls.length > 0) {
                localStorage.setItem('cachedGifUrls', JSON.stringify(cachedGifUrls));
                console.log(`${cachedGifUrls.length} GIFs successfully pre-cached and URLs stored.`);
            }
        }
    } catch (error) {
        console.error('Error during GIF pre-caching process:', error);
    }
}

// Service Worker Registrierung
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });

    // Start pre-caching GIFs after a short delay to not block initial load
    setTimeout(precacheGifs, 3000);
  });
}
