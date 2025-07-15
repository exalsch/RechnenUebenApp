// Contact Information Protection
// This script protects email addresses from crawlers and spam bots

document.addEventListener('DOMContentLoaded', function() {
    initializeContactProtection();
});

function initializeContactProtection() {
    // Replace all protected email placeholders
    const emailPlaceholders = document.querySelectorAll('.protected-email');
    emailPlaceholders.forEach(placeholder => {
        const email = decodeEmail(placeholder.dataset.email);
        if (email) {
            placeholder.innerHTML = `<a href="mailto:${email}">${email}</a>`;
            placeholder.classList.remove('protected-email');
        }
    });
    
    // Replace all protected address placeholders
    const addressPlaceholders = document.querySelectorAll('.protected-address');
    addressPlaceholders.forEach(placeholder => {
        const address = decodeAddress(placeholder.dataset.address);
        if (address) {
            placeholder.innerHTML = address;
            placeholder.classList.remove('protected-address');
        }
    });
}

// Simple email obfuscation - encode email in reverse with offset
function encodeEmail(email) {
    // Reverse the email and add character offset
    const reversed = email.split('').reverse().join('');
    const encoded = reversed.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) + 1)
    ).join('');
    return btoa(encoded); // Base64 encode
}

// Decode the protected email
function decodeEmail(encodedEmail) {
    try {
        const decoded = atob(encodedEmail);
        const original = decoded.split('').map(char => 
            String.fromCharCode(char.charCodeAt(0) - 1)
        ).join('');
        return original.split('').reverse().join('');
    } catch (e) {
        return null;
    }
}

// Decode the protected address (same method as email)
function decodeAddress(encodedAddress) {
    try {
        const decoded = atob(encodedAddress);
        const original = decoded.split('').map(char => 
            String.fromCharCode(char.charCodeAt(0) - 1)
        ).join('');
        return original.split('').reverse().join('');
    } catch (e) {
        return null;
    }
}

// Generate protected email HTML (for development use)
function generateProtectedEmail(email) {
    const encoded = encodeEmail(email);
    return `<span class="protected-email" data-email="${encoded}">E-Mail wird geladen...</span>`;
}

// Export for console use during development
window.generateProtectedEmail = generateProtectedEmail;
window.encodeEmail = encodeEmail;