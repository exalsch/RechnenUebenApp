function saveScore() {
    const operation = document.getElementById('operation').value;
    let scores = JSON.parse(localStorage.getItem(`scores_${operation}`) || '[]');
    scores.push({
        score: window.score,
        maxResult: window.maxResult,
        date: new Date().toISOString()
    });
    localStorage.setItem(`scores_${operation}`, JSON.stringify(scores));
}

function displayScores() {
    const operation = document.getElementById('operation').value;
    let scores = JSON.parse(localStorage.getItem(`scores_${operation}`) || '[]');
    
    // Neueste zuerst sortieren und Top 10 anzeigen
    scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    scores = scores.slice(0, 10);
    
    const scoreList = document.getElementById('score-list');
    const opTitle = (typeof window.getOperationName === 'function')
        ? window.getOperationName(operation)
        : operation;
    scoreList.innerHTML = `<h3>Letzte 10 Runden – ${opTitle}</h3>`;
    
    scores.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('de-DE');
        const formattedTime = date.toLocaleTimeString('de-DE');
        const scoreItem = document.createElement('div');
        scoreItem.textContent = `${formattedDate} ${formattedTime} - Punkte: ${entry.score} (bis ${entry.maxResult})`;
        scoreList.appendChild(scoreItem);
    });
}

function clearHighscores() {
    if (confirm('Möchtest du wirklich alle Highscores löschen?')) {
        // Remove all keys that match scores_*
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('scores_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        displayScores();
    }
}

window.saveScore = saveScore;
window.displayScores = displayScores;
window.clearHighscores = clearHighscores;