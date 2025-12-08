/**
 * Confetti effects using canvas-confetti library
 * https://github.com/catdad/canvas-confetti
 */

// Kid-friendly emojis for end of round celebration
const kidFriendlyEmojis = ['🎉', '🌟', '⭐', '🎈', '🎊', '🦄', '🌈', '🎁', '🏆', '🥳', '😊', '🐶', '🐱', '🦋', '🌸', '🍀', '🎯', '💫', '✨', '🎵'];

// Sad emojis for manual end (quit early)
const sadEmojis = ['😢', '😿', '💔', '😞', '😔', '🥺'];

/**
 * Fire a random confetti cannon from a random position
 * Used on successful answer
 */
function fireRandomConfetti() {
    if (typeof confetti !== 'function') {
        console.warn('Confetti library not loaded');
        return;
    }

    // Random angle and origin for variety
    const randomAngle = randomInRange(55, 125);
    const randomOriginX = Math.random();
    const randomOriginY = Math.random() * 0.5; // Upper half of screen

    confetti({
        angle: randomAngle,
        spread: randomInRange(50, 70),
        particleCount: randomInRange(30, 60),
        origin: { x: randomOriginX, y: randomOriginY },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: randomInRange(25, 45),
        scalar: randomInRange(0.8, 1.2)
    });
}

/**
 * Fire emoji confetti for end of round celebration
 * Uses random kid-friendly emojis
 */
async function fireEmojiConfetti() {
    if (typeof confetti !== 'function') {
        console.warn('Confetti library not loaded');
        return;
    }

    // Select random emojis for this celebration
    const selectedEmojis = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * kidFriendlyEmojis.length);
        selectedEmojis.push(kidFriendlyEmojis[randomIndex]);
    }

    // Create confetti shapes from emojis (shapeFromText returns a Promise)
    const emojiShapes = await Promise.all(
        selectedEmojis.map(emoji => confetti.shapeFromText({ text: emoji, scalar: 3 }))
    );

    const defaults = {
        spread: 360,
        ticks: 200,
        gravity: 0.6,
        decay: 0.94,
        startVelocity: 25,
        shapes: emojiShapes,
        scalar: 3
    };

    // Fire multiple bursts for a grand celebration
    function shoot() {
        confetti({
            ...defaults,
            particleCount: 15,
            origin: { x: 0.1, y: 0.6 }
        });

        confetti({
            ...defaults,
            particleCount: 15,
            origin: { x: 0.9, y: 0.6 }
        });

        confetti({
            ...defaults,
            particleCount: 20,
            origin: { x: 0.5, y: 0.3 }
        });
    }

    // Fire in sequence for dramatic effect
    shoot();
    setTimeout(shoot, 150);
    setTimeout(shoot, 300);
}

/**
 * Fire sad emoji confetti for manual game end (quit early)
 * Uses sad emojis falling gently
 */
async function fireSadConfetti() {
    if (typeof confetti !== 'function') {
        console.warn('Confetti library not loaded');
        return;
    }

    // Create confetti shapes from sad emojis (shapeFromText returns a Promise)
    const emojiShapes = await Promise.all(
        sadEmojis.map(emoji => confetti.shapeFromText({ text: emoji, scalar: 3 }))
    );

    confetti({
        spread: 180,
        ticks: 200,
        gravity: 0.8,
        decay: 0.95,
        startVelocity: 20,
        shapes: emojiShapes,
        scalar: 3,
        particleCount: 25,
        origin: { x: 0.5, y: 0.2 }
    });
}

/**
 * Helper function to get random value in range
 */
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Expose functions globally
window.fireRandomConfetti = fireRandomConfetti;
window.fireEmojiConfetti = fireEmojiConfetti;
window.fireSadConfetti = fireSadConfetti;
