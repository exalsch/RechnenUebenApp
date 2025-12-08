let securityQuestionAnswer;

const securityQuestions = [
    { question: "Was ist 12 * 4?", answer: 48 },
    { question: "Was ist 125 / 5?", answer: 25 },
    { question: "Was ist 3 hoch 2?", answer: 9 },
    { question: "Was ist 7 * 7 + 4?", answer: 53 },
    { question: "Was ist 100 - 3 * 3?", answer: 91 }
];

function updateMaxResultOptions() {
    const operation = document.getElementById('operation').value;
    const maxResultSelect = document.getElementById('maxResult');
    const currentValue = parseInt(maxResultSelect.value);
    const limits = window.operationLimits[operation];

    maxResultSelect.innerHTML = '';

    const possibleValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    possibleValues.forEach(value => {
        if (value >= limits.min && value <= limits.max) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = `bis ${value}`;
            maxResultSelect.appendChild(option);
        }
    });

    if (currentValue < limits.min || currentValue > limits.max) {
        maxResultSelect.value = maxResultSelect.options[0].value;
    } else {
        maxResultSelect.value = currentValue;
    }
}

function checkApiKeyWarning() {
    const apiKeyWarning = document.getElementById('api-key-warning');
    if (window.TENOR_API_KEY === 'LIVDSRZULEJO' || !window.TENOR_API_KEY) {
        apiKeyWarning.innerHTML = 'Hinweis: Für GIF-Belohnungen bitte einen eigenen Tenor API-Schlüssel in den ⚙️-Einstellungen eintragen.';
        apiKeyWarning.classList.remove('hidden');
    } else {
        apiKeyWarning.classList.add('hidden');
    }
}

function openSettingsModal() {
    generateSecurityQuestion();
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
    document.getElementById('security-check').classList.remove('hidden');
    document.getElementById('settings-content').classList.add('hidden');
    document.getElementById('security-answer').value = '';
}

function generateSecurityQuestion() {
    const randomIndex = Math.floor(Math.random() * securityQuestions.length);
    const selectedQuestion = securityQuestions[randomIndex];
    securityQuestionAnswer = selectedQuestion.answer;
    document.getElementById('security-question').textContent = selectedQuestion.question;
}

function checkSecurityAnswer() {
    const userAnswer = parseInt(document.getElementById('security-answer').value);
    if (userAnswer === securityQuestionAnswer) {
        document.getElementById('security-check').classList.add('hidden');
        document.getElementById('settings-content').classList.remove('hidden');
        document.getElementById('player-name').value = window.playerName || 'Schlaubi';
        document.getElementById('tenor-api-key').value = window.TENOR_API_KEY;
        document.getElementById('gif-queries').value = window.gifQueries.join(';');
        document.getElementById('game-time').value = window.gameTime || 300;
        document.getElementById('gif-cache-count').value = window.gifCacheCount || 20;
        const disableSkipEl = document.getElementById('disable-skip');
        if (disableSkipEl) {
            disableSkipEl.checked = !!window.disableSkip;
        }
        const excludeOneEl = document.getElementById('exclude-one-multiplication');
        if (excludeOneEl) {
            excludeOneEl.checked = !!window.excludeOneMultiplication;
        }
        const confettiCorrectEl = document.getElementById('confetti-correct-answer');
        if (confettiCorrectEl) {
            confettiCorrectEl.checked = window.confettiCorrectAnswer !== false;
        }
        const confettiEndEl = document.getElementById('confetti-end-round');
        if (confettiEndEl) {
            confettiEndEl.checked = window.confettiEndRound !== false;
        }
    } else {
        alert('Falsche Antwort. Bitte versuche es erneut.');
        generateSecurityQuestion();
        document.getElementById('security-answer').value = '';
    }
}

function saveSettings() {
    const playerName = document.getElementById('player-name').value.trim();
    window.TENOR_API_KEY = document.getElementById('tenor-api-key').value.trim();
    const queries = document.getElementById('gif-queries').value.trim();
    const gameTime = parseInt(document.getElementById('game-time').value);
    const gifCacheCount = parseInt(document.getElementById('gif-cache-count').value);
    const disableSkip = !!document.getElementById('disable-skip')?.checked;
    const excludeOneMultiplication = !!document.getElementById('exclude-one-multiplication')?.checked;
    const confettiCorrectAnswer = document.getElementById('confetti-correct-answer')?.checked !== false;
    const confettiEndRound = document.getElementById('confetti-end-round')?.checked !== false;

    if (!window.TENOR_API_KEY) {
        alert('Der API Key darf nicht leer sein.');
        return;
    }
    if (!queries) {
        alert('Die Suchbegriffe dürfen nicht leer sein.');
        return;
    }
    if (!gameTime || gameTime < 60 || gameTime > 1800) {
        alert('Die Spielzeit muss zwischen 60 und 1800 Sekunden liegen.');
        return;
    }
    if (!gifCacheCount || gifCacheCount < 10 || gifCacheCount > 50) {
        alert('Die Anzahl der vorzuladenden GIFs muss zwischen 10 und 50 liegen.');
        return;
    }

    window.playerName = playerName;
    window.gifQueries = queries.split(';').map(q => q.trim()).filter(q => q);
    window.gameTime = gameTime;
    window.gifCacheCount = gifCacheCount;
    window.disableSkip = disableSkip;
    window.excludeOneMultiplication = excludeOneMultiplication;
    window.confettiCorrectAnswer = confettiCorrectAnswer;
    window.confettiEndRound = confettiEndRound;
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('TENOR_API_KEY', window.TENOR_API_KEY);
    localStorage.setItem('gifQueries', window.gifQueries.join(';'));
    localStorage.setItem('gameTime', gameTime.toString());
    localStorage.setItem('gifCacheCount', gifCacheCount.toString());
    localStorage.setItem('disableSkip', disableSkip ? '1' : '0');
    localStorage.setItem('excludeOneMultiplication', excludeOneMultiplication ? '1' : '0');
    localStorage.setItem('confettiCorrectAnswer', confettiCorrectAnswer ? '1' : '0');
    localStorage.setItem('confettiEndRound', confettiEndRound ? '1' : '0');

    // Reflect immediately in UI
    const skipBtn = document.getElementById('skip-question');
    if (skipBtn) {
        if (disableSkip) {
            skipBtn.classList.add('hidden');
        } else {
            skipBtn.classList.remove('hidden');
        }
    }

    alert('Einstellungen gespeichert!');
    closeSettingsModal();
}

window.updateMaxResultOptions = updateMaxResultOptions;
window.checkApiKeyWarning = checkApiKeyWarning;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.generateSecurityQuestion = generateSecurityQuestion;
window.checkSecurityAnswer = checkSecurityAnswer;
window.saveSettings = saveSettings;

// Tenor API Help Modal Functions
function showTenorHelp() {
    document.getElementById('tenor-help-modal').classList.remove('hidden');
}

function closeTenorHelp() {
    document.getElementById('tenor-help-modal').classList.add('hidden');
}

window.showTenorHelp = showTenorHelp;
window.closeTenorHelp = closeTenorHelp;