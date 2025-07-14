function startTimer() {
    const totalTime = 300;
    window.timeLeft = totalTime;
    const progressBar = document.getElementById('progress');
    
    window.timer = setInterval(() => {
        window.timeLeft--;
        const minutes = Math.floor(window.timeLeft / 60);
        const seconds = window.timeLeft % 60;
        document.getElementById('timer').innerText = `⏲: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const progressPercent = (window.timeLeft / totalTime) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        if (window.timeLeft <= 0) {
            clearInterval(window.timer);
            window.endGame();
        }
    }, 1000);
}

window.startTimer = startTimer;