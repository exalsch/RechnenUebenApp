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
    'multi-divi': { min: 20, max: 100 },
    'division': { min: 10, max: 100 }
};

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
        'multi-divi': 'Multiplikation & Division (Umkehraufgabe)',
        'division': 'Division'
    };
    return operationNames[operation] || operation;
}

// Guard-Flag, um Mehrfachstarts (z.B. Doppelklick) zu verhindern
window.isStartingGame = window.isStartingGame || false;

function startGame() {
    const operation = document.getElementById('operation').value;
    window.maxResult = parseInt(document.getElementById('maxResult').value);
    // Reset answer processing guard at the start of each game
    window.isProcessingAnswer = false;

    // Reset state for multi-divi mode so that a new round starts with multiplication
    if (operation === 'multi-divi') {
        window.multiDiviNextIsDivision = false;
        window.multiDiviLast = null;
    }

    // Verhindere parallele Starts (z.B. schneller Doppelklick auf Start)
    if (window.isGameRunning || window.isStartingGame) {
        return;
    }
    window.isStartingGame = true;

    // Validate selected maxResult against operation limits
    const limits = operationLimits[operation];
    if (window.maxResult < limits.min || window.maxResult > limits.max) {
        alert(`Für ${getOperationName(operation)} muss die maximale Ergebniszahl zwischen ${limits.min} und ${limits.max} liegen.`);
        window.isStartingGame = false;
        return;
    }
    
    window.score = 0;
    window.timeLeft = window.gameTime || 300;

    document.getElementById('game').classList.remove('hidden');
    document.getElementById('settings').classList.add('hidden');
    document.getElementById('settings-button').classList.add('hidden');
    document.getElementById('score-list').classList.add('hidden');
    
    // Add game-active class to body to hide footer and ads
    document.body.classList.add('game-active');
    
    // Activate drawing controls
    const drawingControls = document.getElementById('drawing-controls');
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (drawingControls) drawingControls.classList.add('game-active');
    if (drawingCanvas) {
        drawingCanvas.classList.add('game-active');
        // Force canvas resize after game starts
        setTimeout(() => {
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
        }, 100);
    }
    
    // Markiere Spielzustand als laufend, bevor Timer gestartet wird
    window.isGameRunning = true;
    generateQuestion(operation);
    window.startTimer();
    window.displayScores();
    // Startphase abgeschlossen
    window.isStartingGame = false;
}

function generateQuestion(operation) {
    let num1, num2, operator;
    window.maxResult = parseInt(document.getElementById('maxResult').value);
    let forceSymbol = null; // allow custom symbol for mixed flow like multi-divi

    if (operation === 'mixed-simple' || operation === 'mixed-carry') {
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
            case 'multi-divi':
                // Alternating: first a multiplication, then its inverse division
                if (window.multiDiviNextIsDivision && window.multiDiviLast) {
                    // Create division from last multiplication
                    const { a, b, product } = window.multiDiviLast;
                    num1 = product;
                    num2 = a; // product : a = b
                    window.correctAnswer = b;
                    forceSymbol = ':';
                    // Reset for next pair
                    window.multiDiviNextIsDivision = false;
                } else {
                    // Generate a multiplication ensuring product <= maxResult
                    let a, b, product;
                    const maxAttemptsMD = 50;
                    let tries = 0;
                    do {
                        tries++;
                        if (window.excludeOneMultiplication) {
                            a = Math.floor(Math.random() * 9) + 2; // 2..10
                            b = Math.floor(Math.random() * 9) + 2; // 2..10
                        } else {
                            a = Math.floor(Math.random() * 10) + 1; // 1..10
                            b = Math.floor(Math.random() * 10) + 1; // 1..10
                        }
                        product = a * b;
                        if (tries >= maxAttemptsMD) break;
                    } while (product > window.maxResult);
                    num1 = a;
                    num2 = b;
                    window.correctAnswer = product;
                    forceSymbol = '⋅';
                    // Store for next division step
                    window.multiDiviLast = { a, b, product };
                    window.multiDiviNextIsDivision = true;
                }
                break;
            case 'addition':
                num1 = Math.floor(Math.random() * (window.maxResult / 2));
                num2 = Math.floor(Math.random() * (window.maxResult - num1));
                if ((num1 % 10 + num2 % 10) >= 10) continue;
                window.correctAnswer = num1 + num2;
                break;
            case 'addition-tens':
                num1 = Math.floor(Math.random() * (window.maxResult / 10)) * 10;
                if (num1 === 0) num1 = 10;
                const minNum2 = 10;
                const maxNum2 = window.maxResult - num1;
                if (maxNum2 < minNum2) continue;
                num2 = minNum2 + Math.floor(Math.random() * (maxNum2 - minNum2 + 1));
                window.correctAnswer = num1 + num2;
                break;
            case 'addition-simple-carry':
                num2 = Math.floor(Math.random() * 8) + 1;
                let firstDigit;
                do {
                    firstDigit = Math.floor(Math.random() * (9 - num2)) + (num2 + 1);
                    num1 = Math.floor(Math.random() * Math.floor((window.maxResult - num2) / 10)) * 10 + firstDigit;
                } while (num1 === 0 || num1 + num2 > window.maxResult);
                window.correctAnswer = num1 + num2;
                break;
            case 'addition-carry':
                num1 = Math.floor(Math.random() * (window.maxResult / 2));
                num2 = Math.floor(Math.random() * (window.maxResult - num1));
                if ((num1 % 10 + num2 % 10) < 10) continue;
                window.correctAnswer = num1 + num2;
                break;
            case 'subtraktion':
                num1 = Math.floor(Math.random() * window.maxResult);
                num2 = Math.floor(Math.random() * num1);
                if (hasCarry(num1, num2)) continue;
                window.correctAnswer = num1 - num2;
                break;
            case 'subtraktion-simple-carry':
                num2 = Math.floor(Math.random() * 9) + 1;
                let firstDigitSub;
                do {
                    firstDigitSub = Math.floor(Math.random() * 9);
                    num1 = Math.floor(Math.random() * Math.floor(window.maxResult / 10)) * 10 + firstDigitSub;
                } while (num1 <= num2 || num1 === 0 || !hasCarry(num1, num2));
                window.correctAnswer = num1 - num2;
                break;
            case 'subtraktion-carry':
                num1 = Math.floor(Math.random() * window.maxResult);
                num2 = Math.floor(Math.random() * num1);
                if (!hasCarry(num1, num2)) continue;
                window.correctAnswer = num1 - num2;
                break;
            case 'multiplikation':
                if (window.excludeOneMultiplication) {
                    // Exclude 1 as a factor on both sides
                    num1 = Math.floor(Math.random() * 9) + 2; // 2..10
                    num2 = Math.floor(Math.random() * 9) + 2; // 2..10
                } else {
                    num1 = Math.floor(Math.random() * 10) + 1; // 1..10
                    num2 = Math.floor(Math.random() * 10) + 1; // 1..10
                }
                window.correctAnswer = num1 * num2;
                break;
            case 'division':
                // Für Division: Max Ergebnis begrenzt den Quotienten (Antwort), nicht den Dividend
                // Wähle Divisor analog zur Multiplikation (1..10 oder 2..10, falls "1 ausschließen")
                if (window.excludeOneMultiplication) {
                    num2 = Math.floor(Math.random() * 9) + 2; // 2..10
                } else {
                    num2 = Math.floor(Math.random() * 10) + 1; // 1..10
                }
                // Wähle Quotient im Bereich 1..maxResult (0 vermeiden)
                window.correctAnswer = Math.floor(Math.random() * window.maxResult) + 1;
                // Dividend ist Produkt aus Divisor und Quotient (kann > maxResult sein, das ist beabsichtigt)
                num1 = window.correctAnswer * num2;
                break;
        }
        if (window.correctAnswer <= window.maxResult && window.correctAnswer >= 0) break;
        
        if (attempts >= maxAttempts) {
            num1 = Math.floor(Math.random() * (window.maxResult / 2));
            num2 = Math.floor(Math.random() * (window.maxResult - num1));
            window.correctAnswer = num1 + num2;
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
        'division': ':',
        'multi-divi': '⋅'
    }[operation];

    if (forceSymbol) {
        operationSymbol = forceSymbol;
    }

    document.getElementById('question').innerText = `${num1} ${operationSymbol} ${num2}`;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
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
    window.isProcessingAnswer = true;
    const userAnswer = parseInt(document.getElementById('answer').value);
    
    if (userAnswer === window.correctAnswer) {
        window.playSound(window.correctSound);
        window.score++;
        document.getElementById('score').innerText = `Punkte: ${window.score}`;
        document.getElementById('answer').classList.add('correct-answer');
        setTimeout(() => {
            document.getElementById('answer').classList.remove('correct-answer');
            document.getElementById('answer').value = '';
            // Clear the drawing canvas
            if (typeof window.clearCanvas === 'function') {
                window.clearCanvas();
            }
            const operation = document.getElementById('operation').value;
            generateQuestion(operation);
            window.isProcessingAnswer = false;
        }, 1000);
    } else {
        window.playSound(window.wrongSound);
        document.getElementById('answer').classList.add('wrong-answer');
        setTimeout(() => {
            document.getElementById('answer').classList.remove('wrong-answer');
            document.getElementById('answer').value = '';
            window.isProcessingAnswer = false;
        }, 500);
    }
}

function skipQuestion() {
    // Respect setting to disable skipping
    if (window.disableSkip) {
        return;
    }
    window.score = Math.max(0, window.score - 1);
    window.playSound(window.wrongSound);
    document.getElementById('score').innerText = `Punkte: ${window.score}`;
    generateQuestion(document.getElementById('operation').value);
}

// Make correctAnswer globally accessible
window.correctAnswer = window.correctAnswer || null;

window.operationLimits = operationLimits;
window.getOperationName = getOperationName;
window.startGame = startGame;
window.generateQuestion = generateQuestion;
window.hasCarry = hasCarry;
window.checkAnswer = checkAnswer;
window.skipQuestion = skipQuestion;