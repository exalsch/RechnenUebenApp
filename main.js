

window.score = 0;
let correctAnswer;
let maxResult;
window.isProcessingAnswer = false; // Prevent multiple simultaneous submissions (global flag)

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
    if (event.key === 'Enter' && !window.isProcessingAnswer) {
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
    if (!isNaN(userAnswer) && userAnswer === window.correctAnswer && !window.isProcessingAnswer) {
        window.checkAnswer();
    }
});


// Add event listener for operation change
document.getElementById('operation').addEventListener('change', () => {
    window.updateMaxResultOptions();
    // Update and show highscores for the selected operation
    if (typeof window.displayScores === 'function') {
        window.displayScores();
    }
    if (scoreList) {
        scoreList.classList.remove('hidden');
    }
});

// Initialize maxResult options on page load
document.addEventListener('DOMContentLoaded', () => {
    window.updateMaxResultOptions();
    window.checkApiKeyWarning();
    // Show highscores initially for the default operation
    if (typeof window.displayScores === 'function') {
        window.displayScores();
    }
    if (scoreList) {
        scoreList.classList.remove('hidden');
    }
    // Apply skip visibility based on setting
    if (typeof window.disableSkip !== 'undefined') {
        if (window.disableSkip) {
            skipButton.classList.add('hidden');
        } else {
            skipButton.classList.remove('hidden');
        }
    }
    // Setup modal guardrails
    setupModalGuardrails();
});

// Load settings from localStorage or use defaults
window.playerName = localStorage.getItem('playerName') || ''; // Player name
window.TENOR_API_KEY = localStorage.getItem('TENOR_API_KEY') || 'DUMMY'; // Default Key
window.gifQueries = (localStorage.getItem('gifQueries') || "welpe;niedliche tiere;lustige tiere;Fohlen").split(';');
window.gameTime = parseInt(localStorage.getItem('gameTime')) || 300; // Default 5 minutes
window.gifCacheCount = parseInt(localStorage.getItem('gifCacheCount')) || 20; // Default 20 GIFs
window.disableSkip = (localStorage.getItem('disableSkip') === '1');
window.excludeOneMultiplication = (localStorage.getItem('excludeOneMultiplication') === '1');
// Confetti settings (default to enabled if not set)
window.confettiCorrectAnswer = localStorage.getItem('confettiCorrectAnswer') !== '0';
window.confettiEndRound = localStorage.getItem('confettiEndRound') !== '0';

// Reflect skip setting immediately on load
if (window.disableSkip) {
    skipButton.classList.add('hidden');
} else {
    skipButton.classList.remove('hidden');
}

function endGame(isSuccessfulEnd = false) {
    // Ensure any running timer is stopped
    clearInterval(window.timer);
    // Snapshot the score immediately to avoid any late resets/races
    const finalScore = window.score;
    gameDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    
    // Remove game-active class to show footer and ads again
    document.body.classList.remove('game-active');
    
    // Generate encouraging message with player name
    const defaultPlayerName = window.i18n ? window.i18n.t('defaultPlayerName') : 'Spieler';
    const playerName = window.playerName || defaultPlayerName;
    const encouragingMessage = window.i18n ? window.i18n.getEncouragingMessage(playerName, finalScore) : getEncouragingMessage(playerName, finalScore);
    const yourScoreLabel = window.i18n ? window.i18n.t('yourScore') : 'Dein Punktestand';
    finalScoreDiv.innerHTML = `<strong>${encouragingMessage}</strong><br>${yourScoreLabel}: ${finalScore}`;
    
    // Deactivate drawing controls
    const drawingControls = document.getElementById('drawing-controls');
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (drawingControls) drawingControls.classList.remove('game-active');
    if (drawingCanvas) drawingCanvas.classList.remove('game-active');
    
    window.handleGameEndGif();
    
    // Fire confetti based on how the game ended (if enabled in settings)
    if (window.confettiEndRound) {
        if (isSuccessfulEnd) {
            // Timer ran out - celebrate with happy emoji confetti
            if (typeof window.fireEmojiConfetti === 'function') {
                window.fireEmojiConfetti();
            }
        } else {
            // Manual end (quit button) - sad emoji confetti
            if (typeof window.fireSadConfetti === 'function') {
                window.fireSadConfetti();
            }
        }
    }
    
    window.saveScore(finalScore);
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
    clearInterval(window.timer);
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
    // Show highscores again in settings view
    scoreList.classList.remove('hidden');
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
    const pointsLabel = window.i18n ? window.i18n.t('points') : 'Punkte';
    scoreDiv.innerText = `${pointsLabel}: 0`;
    const defaultTime = window.gameTime || 300;
    const minutes = Math.floor(defaultTime / 60);
    const seconds = defaultTime % 60;
    timerDiv.innerText = `⏲: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update scores for the current operation
    window.displayScores();
}






// ===== Modal Guardrails =====
function updateBodyScrollLock() {
    try {
        const anyModalOpen = Array.from(document.querySelectorAll('.modal')).some(m => !m.classList.contains('hidden'));
        const ageModal = document.getElementById('age-verification-modal');
        const ageOpen = ageModal ? getComputedStyle(ageModal).display !== 'none' : false;
        if (anyModalOpen || ageOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    } catch (_) {}
}

// Expose for other scripts (e.g., legal-compliance)
window.updateBodyScrollLock = updateBodyScrollLock;

function getVisibleModals() {
    return Array.from(document.querySelectorAll('.modal')).filter(m => !m.classList.contains('hidden'));
}

function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    updateBodyScrollLock();
}

function closeAllModalsExcept(keepEl) {
    getVisibleModals().forEach(m => { if (m !== keepEl) m.classList.add('hidden'); });
    updateBodyScrollLock();
}

function setupOverlayClose() {
    document.querySelectorAll('.modal').forEach(modal => {
        if (modal.__overlayBound) return; // guard against double-binding
        modal.__overlayBound = true;
        modal.addEventListener('click', (e) => {
            const content = modal.querySelector('.modal-content');
            if (e.target === modal && content && !content.contains(e.target)) {
                // Clicked on overlay – close this modal
                closeModal(modal);
            }
        });
    });
}

function setupEscClose() {
    if (document.__escBound) return;
    document.__escBound = true;
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const visible = getVisibleModals();
        if (visible.length > 0) {
            // Close the last opened (assume last in DOM order among visible)
            closeModal(visible[visible.length - 1]);
        }
        // Age verification modal intentionally not closed via ESC
    });
}

function wrapOpenFunction(name, getModalEl) {
    const original = window[name];
    if (typeof original !== 'function') return;
    if (original.__wrapped) return;
    const wrapped = function(...args) {
        const modalEl = getModalEl();
        if (modalEl) closeAllModalsExcept(modalEl);
        const result = original.apply(this, args);
        updateBodyScrollLock();
        setupOverlayClose();
        return result;
    };
    wrapped.__wrapped = true;
    window[name] = wrapped;
}

function wrapCloseFunction(name) {
    const original = window[name];
    if (typeof original !== 'function') return;
    if (original.__wrapped) return;
    const wrapped = function(...args) {
        const result = original.apply(this, args);
        updateBodyScrollLock();
        return result;
    };
    wrapped.__wrapped = true;
    window[name] = wrapped;
}

function setupModalGuardrails() {
    // Wrap known modal openers
    wrapOpenFunction('openSettingsModal', () => document.getElementById('settings-modal'));
    wrapOpenFunction('showGallery', () => document.getElementById('gallery-modal'));
    wrapOpenFunction('showTenorHelp', () => document.getElementById('tenor-help-modal'));
    wrapCloseFunction('closeSettingsModal');
    wrapCloseFunction('closeTenorHelp');

    // Ensure close buttons also update scroll lock
    document.querySelectorAll('.close-button').forEach(btn => {
        if (btn.__closeBound) return;
        btn.__closeBound = true;
        btn.addEventListener('click', () => {
            setTimeout(updateBodyScrollLock, 0);
        });
    });

    setupOverlayClose();
    setupEscClose();

    // Observe modal visibility changes (e.g., gallery modal opened from its own module)
    if (!document.__modalObserver) {
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    const el = m.target;
                    if (el.classList && el.classList.contains('modal')) {
                        const isVisible = !el.classList.contains('hidden');
                        if (isVisible) {
                            closeAllModalsExcept(el);
                        }
                        updateBodyScrollLock();
                    }
                }
            }
        });
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
        document.__modalObserver = observer;
    }

    // Initial lock check (in case something opened earlier)
    updateBodyScrollLock();
}

// Service Worker Registrierung
// ===== GIF Caching for Offline Use =====


// Service Worker Registrierung
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/RechnenUebenApp/service-worker.js', {scope: '/RechnenUebenApp/'}).then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });

    setTimeout(window.precacheGifs, 3000);
  });
}
