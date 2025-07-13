// Sound-Effekte
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
let isSoundEnabled = true;

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
