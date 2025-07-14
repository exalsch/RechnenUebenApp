// Custom Numpad Functionality with Toggle
document.addEventListener('DOMContentLoaded', () => {
    const numpad = document.getElementById('custom-numpad');
    const answerInput = document.getElementById('answer');
    const toggleBtn = document.getElementById('numpad-toggle');
    let numpadVisible = false;
    
    if (!numpad || !answerInput || !toggleBtn) return;
    
    // Toggle numpad visibility
    toggleBtn.addEventListener('click', () => {
        numpadVisible = !numpadVisible;
        
        if (numpadVisible) {
            numpad.classList.add('show');
            toggleBtn.classList.add('active');
            answerInput.setAttribute('readonly', 'true');
            answerInput.setAttribute('inputmode', 'none');
        } else {
            numpad.classList.remove('show');
            toggleBtn.classList.remove('active');
            answerInput.removeAttribute('readonly');
            answerInput.removeAttribute('inputmode');
            answerInput.focus();
        }
    });
    
    // Handle numpad button clicks
    numpad.addEventListener('click', (event) => {
        if (!event.target.classList.contains('numpad-btn')) return;
        
        const value = event.target.dataset.value;
        const action = event.target.dataset.action;
        
        if (value) {
            // Add number to input
            const currentValue = answerInput.value;
            // Limit to reasonable number length
            if (currentValue.length < 10) {
                answerInput.value = currentValue + value;
                // Trigger input event for auto-submit functionality
                answerInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (action === 'clear') {
            // Clear last character or entire input
            const currentValue = answerInput.value;
            if (currentValue.length > 0) {
                answerInput.value = currentValue.slice(0, -1);
                // Trigger input event
                answerInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (action === 'submit') {
            // Submit answer
            if (answerInput.value && !window.isProcessingAnswer) {
                window.checkAnswer();
            }
        }
    });
    
    // Add haptic feedback for mobile devices
    function addHapticFeedback(button) {
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // 50ms vibration
        }
        
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    // Add haptic feedback to all numpad buttons
    const numpadButtons = numpad.querySelectorAll('.numpad-btn');
    numpadButtons.forEach(button => {
        button.addEventListener('touchstart', () => {
            addHapticFeedback(button);
        }, { passive: true });
        
        button.addEventListener('click', () => {
            addHapticFeedback(button);
        });
    });
});

// Auto-hide numpad when answer is correct to prevent interference
function hideNumpadOnCorrectAnswer() {
    const numpad = document.getElementById('custom-numpad');
    const toggleBtn = document.getElementById('numpad-toggle');
    
    if (numpad && toggleBtn) {
        numpad.classList.remove('show');
        toggleBtn.classList.remove('active');
    }
}

// Export functions for use in other modules
window.hideNumpadOnCorrectAnswer = hideNumpadOnCorrectAnswer;