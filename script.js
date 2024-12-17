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

// Event-Listener für die Enter-Taste
answerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !isProcessingAnswer) {
        event.preventDefault(); // Prevent default form submission
        checkAnswer();
    }
});

function startGame() {
    const operation = document.getElementById('operation').value;
    maxResult = parseInt(document.getElementById('maxResult').value);
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
    
    // Zufälliges End-GIF auswählen (Annahme: es gibt 5 GIFs von end_1.gif bis end_5.gif)
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    const resultGif = document.getElementById('result-gif');
    resultGif.src = `img/end_${randomNumber}.gif`;
    
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
