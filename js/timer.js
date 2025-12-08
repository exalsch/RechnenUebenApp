function startTimer() {
    // Stop any previous timer to prevent double speed
    if (window.timer) {
        clearInterval(window.timer);
    }
    const totalTime = window.gameTime || 300;
    window.timeLeft = totalTime;
    const progressBar = document.getElementById('progress');

    // Initialize UI immediately
    const initMinutes = Math.floor(window.timeLeft / 60);
    const initSeconds = window.timeLeft % 60;
    document.getElementById('timer').innerText = `⏲: ${initMinutes}:${initSeconds.toString().padStart(2, '0')}`;
    if (progressBar) {
        progressBar.style.width = '100%';
    }

    window.timer = setInterval(() => {
        window.timeLeft--;
        const minutes = Math.floor(window.timeLeft / 60);
        const seconds = window.timeLeft % 60;
        document.getElementById('timer').innerText = `⏲: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const progressPercent = (window.timeLeft / totalTime) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
        
        if (window.timeLeft <= 0) {
            clearInterval(window.timer);
            window.endGame(true); // true = successful end (timer ran out)
        }
    }, 1000);
}

window.startTimer = startTimer;