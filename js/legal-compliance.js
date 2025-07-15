// Legal Compliance and Age Verification
document.addEventListener('DOMContentLoaded', function() {
    initializeLegalCompliance();
});

function initializeLegalCompliance() {
    checkAgeVerification();
    setupConsentBanner();
    configureAdSense();
}

function checkAgeVerification() {
    const ageVerified = localStorage.getItem('ageVerified');
    const ageVerificationModal = document.getElementById('age-verification-modal');
    
    if (!ageVerified && ageVerificationModal) {
        ageVerificationModal.style.display = 'flex';
    } else if (ageVerificationModal) {
        ageVerificationModal.style.display = 'none';
    }
}

function handleAgeVerification(isUnder16) {
    const ageVerificationModal = document.getElementById('age-verification-modal');
    const consentBanner = document.getElementById('consent-banner');
    const adContainer = document.getElementById('ad-container');
    
    if (isUnder16) {
        // Show parental consent requirement
        alert('Kinder unter 16 Jahren benötigen die Erlaubnis ihrer Eltern zur Nutzung dieser App. Bitte bitte einen Erwachsenen um Hilfe.');
        
        // Store age verification and parental consent requirement
        localStorage.setItem('ageVerified', 'true');
        localStorage.setItem('isUnder16', 'true');
        localStorage.setItem('requiresParentalConsent', 'true');
        
        // Configure child-directed treatment
        window.isChildDirected = true;
        
        // Show consent banner for parental consent
        showConsentBanner();
        
    } else {
        // User is 16 or older
        localStorage.setItem('ageVerified', 'true');
        localStorage.setItem('isUnder16', 'false');
        localStorage.setItem('requiresParentalConsent', 'false');
        
        window.isChildDirected = false;
        
        // Show regular consent banner
        showConsentBanner();
    }
    
    // Hide age verification modal
    ageVerificationModal.style.display = 'none';
    
    // Show ads if consent is given
    if (localStorage.getItem('dataConsent') === 'true') {
        showAds();
    }
}

function setupConsentBanner() {
    const dataConsent = localStorage.getItem('dataConsent');
    
    if (!dataConsent) {
        // Only show info banner after age verification
        const ageVerified = localStorage.getItem('ageVerified');
        if (ageVerified) {
            showConsentBanner();
        }
    } else {
        showAds();
    }
}

function showConsentBanner() {
    const consentBanner = document.getElementById('consent-banner');
    const isUnder16 = localStorage.getItem('isUnder16') === 'true';
    
    if (consentBanner) {
        if (isUnder16) {
            consentBanner.innerHTML = `
                <p>
                    ⚠️ Diese App ist für Kinder. Spielstände werden nur lokal gespeichert - keine Cookies, keine Server. Ein Erwachsener muss diese Nachricht bestätigen.
                    <a href="privacy.html" target="_blank">Datenschutzerklärung</a>
                </p>
                <button onclick="acceptConsent()">Erwachsener bestätigt</button>
            `;
        } else {
            consentBanner.innerHTML = `
                <p>
                    Diese App speichert Spielstände nur lokal auf deinem Gerät. Keine Cookies, keine Server-Übertragung.
                    <a href="privacy.html" target="_blank">Datenschutzerklärung</a>
                </p>
                <button onclick="acceptConsent()">Verstanden</button>
            `;
        }
        
        consentBanner.classList.remove('hidden');
    }
}

function acceptConsent() {
    const consentBanner = document.getElementById('consent-banner');
    
    // Store consent
    localStorage.setItem('dataConsent', 'true');
    localStorage.setItem('consentDate', new Date().toISOString());
    
    // Hide consent banner
    if (consentBanner) {
        consentBanner.classList.add('hidden');
    }
    
    // Show ads
    showAds();
}

function showAds() {
    const adContainer = document.getElementById('ad-container');
    const ageVerified = localStorage.getItem('ageVerified') === 'true';
    const dataConsent = localStorage.getItem('dataConsent') === 'true';
    
    if (adContainer && ageVerified && dataConsent) {
        adContainer.classList.remove('hidden');
        
        // Configure AdSense for child-directed treatment if needed
        configureAdSense();
    }
}

function configureAdSense() {
    const isUnder16 = localStorage.getItem('isUnder16') === 'true';
    
    if (typeof googletag !== 'undefined' && googletag.pubads) {
        if (isUnder16) {
            // Enable child-directed treatment for users under 16
            googletag.pubads().setTagForChildDirectedTreatment(1);
            console.log('AdSense configured for child-directed treatment');
        } else {
            // Disable child-directed treatment for users 16 and older
            googletag.pubads().setTagForChildDirectedTreatment(0);
            console.log('AdSense configured for non-child-directed treatment');
        }
    }
    
    // For AdSense auto ads, we need to set the tag in the ad request
    if (typeof adsbygoogle !== 'undefined') {
        if (isUnder16) {
            // Configure child-directed treatment for auto ads
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
                googletag.pubads().setTagForChildDirectedTreatment(1);
            });
        }
    }
}

// Reset all compliance data (for testing)
function resetComplianceData() {
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('isUnder16');
    localStorage.removeItem('requiresParentalConsent');
    localStorage.removeItem('dataConsent');
    localStorage.removeItem('consentDate');
    location.reload();
}

// Check if user needs to reverify (e.g., after 30 days)
function checkConsentExpiry() {
    const consentDate = localStorage.getItem('consentDate');
    if (consentDate) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (new Date(consentDate) < thirtyDaysAgo) {
            // Consent expired, reset compliance data
            resetComplianceData();
        }
    }
}

// Export functions for global access
window.handleAgeVerification = handleAgeVerification;
window.acceptConsent = acceptConsent;
window.resetComplianceData = resetComplianceData;

// Check consent expiry on load
checkConsentExpiry();