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
        document.getElementById('tenor-api-key').value = window.TENOR_API_KEY;
        document.getElementById('gif-queries').value = window.gifQueries.join(';');
    } else {
        alert('Falsche Antwort. Bitte versuche es erneut.');
        generateSecurityQuestion();
        document.getElementById('security-answer').value = '';
    }
}

function saveSettings() {
    window.TENOR_API_KEY = document.getElementById('tenor-api-key').value.trim();
    const queries = document.getElementById('gif-queries').value.trim();

    if (!window.TENOR_API_KEY) {
        alert('Der API Key darf nicht leer sein.');
        return;
    }
    if (!queries) {
        alert('Die Suchbegriffe dürfen nicht leer sein.');
        return;
    }

    window.gifQueries = queries.split(';').map(q => q.trim()).filter(q => q);
    localStorage.setItem('TENOR_API_KEY', window.TENOR_API_KEY);
    localStorage.setItem('gifQueries', window.gifQueries.join(';'));

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