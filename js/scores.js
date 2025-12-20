function saveScore(scoreOverride) {
    const operation = document.getElementById('operation').value;
    let scores = JSON.parse(localStorage.getItem(`scores_${operation}`) || '[]');
    const scoreValue = (typeof scoreOverride === 'number' && !isNaN(scoreOverride)) ? scoreOverride : window.score;
    scores.push({
        score: scoreValue,
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

    const last10RoundsLabel = window.i18n ? window.i18n.t('last10Rounds') : 'Letzte 10 Runden';
    scoreList.innerHTML = `<h3>${last10RoundsLabel} – ${opTitle}</h3>`;

    const locale = window.i18n ? window.i18n.getLocale() : 'de-DE';
    const pointsLabel = window.i18n ? window.i18n.t('points') : 'Punkte';
    const upToLabel = window.i18n ? window.i18n.t('upTo') : 'bis';

    scores.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString(locale);
        const formattedTime = date.toLocaleTimeString(locale);
        const scoreItem = document.createElement('div');
        scoreItem.textContent = `${formattedDate} ${formattedTime} - ${pointsLabel}: ${entry.score} (${upToLabel} ${entry.maxResult})`;
        scoreList.appendChild(scoreItem);
    });
}

function clearHighscores() {
    const confirmMsg = window.i18n ? window.i18n.t('confirmClearHighscores') : 'Möchtest du wirklich alle Highscores löschen?';
    if (confirm(confirmMsg)) {
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