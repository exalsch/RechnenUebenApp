// Sound-Effekte
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
let isSoundEnabled = true;

// Make sound objects globally available
window.correctSound = correctSound;
window.wrongSound = wrongSound;

// Sound-Toggle Funktionalität
document.addEventListener('DOMContentLoaded', () => {
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            soundToggleBtn.textContent = isSoundEnabled ? '🔔' : '🔕';
        });
    }
});

function playSound(sound) {
    if (isSoundEnabled) {
        sound.play();
    }
}

// Make playSound function globally available
window.playSound = playSound;
