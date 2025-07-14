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
    
    scores.sort((a, b) => new Date(a.date) - new Date(b.date));
    
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

function clearHighscores() {
    if (confirm('Möchtest du wirklich alle Highscores löschen?')) {
        localStorage.removeItem('scores');
        displayScores();
    }
}

window.saveScore = saveScore;
window.displayScores = displayScores;
window.clearHighscores = clearHighscores;