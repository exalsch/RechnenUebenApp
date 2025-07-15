

window.score = 0;
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

// ... (rest of the code remains the same)
skipButton.addEventListener('click', window.skipQuestion);
endGameButton.addEventListener('click', endGame);
restartButton.addEventListener('click', restartGame);
clearHighscoreButton.addEventListener('click', window.clearHighscores);
startButton.addEventListener('click', window.startGame);


// Settings Modal Listeners
settingsButton.addEventListener('click', window.openSettingsModal);
closeSettingsModalBtn.addEventListener('click', window.closeSettingsModal);
securitySubmitBtn.addEventListener('click', window.checkSecurityAnswer);
saveSettingsBtn.addEventListener('click', window.saveSettings);


// Keyboard event listeners
// Event-Listener für die Enter-Taste
answerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !isProcessingAnswer) {
        event.preventDefault(); // Prevent default form submission
        window.checkAnswer();
    }
});

// Prevent arrow keys from incrementing/decrementing (anti-cheat)
answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
});

// Event-Listener für sofortige Überprüfung
answerInput.addEventListener('input', function(event) {
    // Only allow numbers in the input
    let value = this.value.replace(/[^0-9]/g, '');
    if (value !== this.value) {
        this.value = value;
    }
    
    const userAnswer = parseInt(this.value);
    if (!isNaN(userAnswer) && userAnswer === window.correctAnswer && !isProcessingAnswer) {
        window.checkAnswer();
    }
});


// Add event listener for operation change
document.getElementById('operation').addEventListener('change', window.updateMaxResultOptions);

// Initialize maxResult options on page load
document.addEventListener('DOMContentLoaded', () => {
    window.updateMaxResultOptions();
    window.checkApiKeyWarning();
});

// Load settings from localStorage or use defaults
window.playerName = localStorage.getItem('playerName') || ''; // Player name
window.TENOR_API_KEY = localStorage.getItem('TENOR_API_KEY') || 'LIVDSRZULEJO'; // Default Key
window.gifQueries = (localStorage.getItem('gifQueries') || "welpe;niedliche tiere;lustige tiere;Fohlen").split(';');
window.gameTime = parseInt(localStorage.getItem('gameTime')) || 300; // Default 5 minutes
window.gifCacheCount = parseInt(localStorage.getItem('gifCacheCount')) || 20; // Default 20 GIFs

function endGame() {
    clearInterval(timer);
    gameDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    
    // Remove game-active class to show footer and ads again
    document.body.classList.remove('game-active');
    
    // Generate encouraging message with player name
    const playerName = window.playerName || 'Spieler';
    const encouragingMessage = getEncouragingMessage(playerName, window.score);
    finalScoreDiv.innerHTML = `<strong>${encouragingMessage}</strong><br>Dein Punktestand: ${window.score}`;
    
    // Deactivate drawing controls
    const drawingControls = document.getElementById('drawing-controls');
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (drawingControls) drawingControls.classList.remove('game-active');
    if (drawingCanvas) drawingCanvas.classList.remove('game-active');
    
    window.handleGameEndGif();
    
    window.saveScore();
    window.displayScores();
    window.isGameRunning = false;
}

function getEncouragingMessage(playerName, score) {
    const messages = {
        excellent: [
            `Fantastisch, ${playerName}! Du bist ein Mathe-Meister! 🌟`,
            `Wow, ${playerName}! Das war eine hervorragende Leistung! 🎯`,
            `Unglaublich, ${playerName}! Du hast es drauf! 🚀`,
            `Perfekt, ${playerName}! Du warst heute spitze! ⭐`,
            `Phänomenal, ${playerName}! Einstein wäre stolz! 🧠`,
            `Brillant, ${playerName}! Du bist ein Genie! 💡`
        ],
        great: [
            `Sehr gut gemacht, ${playerName}! Du verbesserst dich stetig! 👍`,
            `Super, ${playerName}! Das war eine tolle Runde! 🎉`,
            `Klasse, ${playerName}! Weiter so! 💪`,
            `Toll, ${playerName}! Du bist auf einem guten Weg! 🌈`,
            `Starke Leistung, ${playerName}! Du rockst das! 🎸`,
            `Beeindruckend, ${playerName}! Du näherst dich der Spitze! 🏔️`
        ],
        good: [
            `Gut gemacht, ${playerName}! Übung macht den Meister! 📚`,
            `Schön, ${playerName}! Du machst Fortschritte! 🎯`,
            `Prima, ${playerName}! Bleib dran! 💫`,
            `Weiter so, ${playerName}! Du schaffst das! 🌟`,
            `Solide Arbeit, ${playerName}! Jeder Schritt zählt! 👣`,
            `Nicht schlecht, ${playerName}! Du wirst immer besser! 🥳`
        ],
        encouraging: [
            `Nicht aufgeben, ${playerName}! Jeder fängt mal klein an! 🌱`,
            `Dranbleiben, ${playerName}! Übung macht den Meister! 💪`,
            `Kopf hoch, ${playerName}! Beim nächsten Mal wird's besser! 🌞`,
            `Mut gefasst, ${playerName}! Du wirst immer besser! 🚀`,
            `Gib nicht auf, ${playerName}! Fehler sind nur getarnte Lektionen! 🎓`,
            `Du bist stärker als du denkst, ${playerName}! Zeig's allen! 💥`
        ]
    };

    
    let messageArray;
    if (score >= 15) {
        messageArray = messages.excellent;
    } else if (score >= 10) {
        messageArray = messages.great;
    } else if (score >= 5) {
        messageArray = messages.good;
    } else {
        messageArray = messages.encouraging;
    }
    
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
}





function restartGame() {
    // Clear game state
    clearInterval(timer);
    window.score = 0;
    
    // Remove game-active class to show footer and ads again
    document.body.classList.remove('game-active');
    
    // Reset GIF state
    if (typeof window.resetGifState === 'function') {
        window.resetGifState();
    }
    
    // Reset UI
    gameDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    scoreList.classList.add('hidden');
    settings.classList.remove('hidden');
    settingsButton.classList.remove('hidden');
    
    // Deactivate drawing controls
    const drawingControls = document.getElementById('drawing-controls');
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (drawingControls) drawingControls.classList.remove('game-active');
    if (drawingCanvas) drawingCanvas.classList.remove('game-active');
    
    // Clear canvas
    if (typeof window.clearCanvas === 'function') {
        window.clearCanvas();
    }
    
    // Reset input and score display
    answerInput.value = '';
    scoreDiv.innerText = 'Punkte: 0';
    const defaultTime = window.gameTime || 300;
    const minutes = Math.floor(defaultTime / 60);
    const seconds = defaultTime % 60;
    timerDiv.innerText = `⏲: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update scores for the current operation
    window.displayScores();
}






// Service Worker Registrierung
// ===== GIF Caching for Offline Use =====


// Service Worker Registrierung
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });

    setTimeout(window.precacheGifs, 3000);
  });
}
