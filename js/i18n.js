// Internationalization (i18n) module for the Math Trainer App
// Supports: de (German), cs (Czech), en (English)

(function() {
    // Default language
    const DEFAULT_LANGUAGE = 'de';
    const SUPPORTED_LANGUAGES = ['de', 'cs', 'en'];

    // Current language (loaded from localStorage or default)
    let currentLanguage = localStorage.getItem('appLanguage') || DEFAULT_LANGUAGE;

    // Ensure the language is valid
    if (!SUPPORTED_LANGUAGES.includes(currentLanguage)) {
        currentLanguage = DEFAULT_LANGUAGE;
    }

    /**
     * Get a translation for a given key
     * @param {string} key - The translation key (e.g., 'appTitle', 'operations.addition')
     * @param {object} params - Optional parameters for string interpolation
     * @returns {string} - The translated string
     */
    function t(key, params = {}) {
        const translations = window.translations;
        if (!translations) {
            console.warn('Translations not loaded');
            return key;
        }

        // Handle nested keys (e.g., 'operations.addition')
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        // Get the translation for current language
        if (typeof value === 'object' && currentLanguage in value) {
            let result = value[currentLanguage];

            // Replace parameters like {name}, {min}, {max}, etc.
            for (const [param, paramValue] of Object.entries(params)) {
                result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), paramValue);
            }

            return result;
        }

        console.warn(`Translation not found for key: ${key} in language: ${currentLanguage}`);
        return key;
    }

    /**
     * Get an operation name translation
     * @param {string} operation - The operation key (e.g., 'addition', 'multiplikation')
     * @returns {string} - The translated operation name
     */
    function getOperationName(operation) {
        return t(`operationNames.${operation}`);
    }

    /**
     * Get a random encouraging message based on score
     * @param {string} playerName - The player's name
     * @param {number} score - The player's score
     * @returns {string} - A random encouraging message
     */
    function getEncouragingMessage(playerName, score) {
        const translations = window.translations;
        if (!translations || !translations.encouragingMessages) {
            return `Score: ${score}`;
        }

        let category;
        if (score >= 15) {
            category = 'excellent';
        } else if (score >= 10) {
            category = 'great';
        } else if (score >= 5) {
            category = 'good';
        } else {
            category = 'encouraging';
        }

        const messages = translations.encouragingMessages[category];
        const randomIndex = Math.floor(Math.random() * messages.length);
        const messageObj = messages[randomIndex];

        let message = messageObj[currentLanguage] || messageObj['de'];
        return message.replace(/{name}/g, playerName);
    }

    /**
     * Get a security question
     * @returns {object} - { question: string, answer: number }
     */
    function getRandomSecurityQuestion() {
        const translations = window.translations;
        if (!translations || !translations.securityQuestions) {
            return { question: '12 * 4 = ?', answer: 48 };
        }

        const questions = translations.securityQuestions;
        const randomIndex = Math.floor(Math.random() * questions.length);
        const q = questions[randomIndex];

        return {
            question: q.question[currentLanguage] || q.question['de'],
            answer: q.answer
        };
    }

    /**
     * Set the current language
     * @param {string} lang - The language code ('de', 'cs', 'en')
     */
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        currentLanguage = lang;
        localStorage.setItem('appLanguage', lang);

        // Update the HTML lang attribute
        document.documentElement.lang = lang;

        // Update all translatable elements
        updatePageTranslations();

        // Update dynamic content
        updateDynamicContent();

        // Dispatch a custom event for other modules to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    /**
     * Get the current language
     * @returns {string} - The current language code
     */
    function getLanguage() {
        return currentLanguage;
    }

    /**
     * Get the locale string for date/time formatting
     * @returns {string} - The locale string (e.g., 'de-DE', 'cs-CZ', 'en-US')
     */
    function getLocale() {
        const localeMap = {
            'de': 'de-DE',
            'cs': 'cs-CZ',
            'en': 'en-US'
        };
        return localeMap[currentLanguage] || 'de-DE';
    }

    /**
     * Update all elements with data-i18n attributes
     */
    function updatePageTranslations() {
        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);
            if (translation !== key) {
                el.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = t(key);
            if (translation !== key) {
                el.placeholder = translation;
            }
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = t(key);
            if (translation !== key) {
                el.title = translation;
            }
        });

        // Update alt text
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            const translation = t(key);
            if (translation !== key) {
                el.alt = translation;
            }
        });

        // Update operation select options
        updateOperationOptions();

        // Update max result options
        updateMaxResultLabels();

        // Update game time options
        updateGameTimeLabels();
    }

    /**
     * Update operation dropdown options
     */
    function updateOperationOptions() {
        const operationSelect = document.getElementById('operation');
        if (!operationSelect) return;

        const operations = [
            'addition', 'addition-carry', 'addition-tens', 'addition-simple-carry',
            'addition-hundreds', 'mixed-simple', 'mixed-carry', 'subtraktion',
            'subtraktion-simple-carry', 'subtraktion-carry', 'subtraktion-hundreds',
            'multiplikation', 'multi-divi', 'division'
        ];

        operationSelect.querySelectorAll('option').forEach(option => {
            const value = option.value;
            if (operations.includes(value)) {
                option.textContent = t(`operations.${value}`);
            }
        });
    }

    /**
     * Update max result dropdown labels
     */
    function updateMaxResultLabels() {
        const maxResultSelect = document.getElementById('maxResult');
        if (!maxResultSelect) return;

        maxResultSelect.querySelectorAll('option').forEach(option => {
            const value = option.value;
            option.textContent = `${t('upTo')} ${value}`;
        });
    }

    /**
     * Update game time dropdown labels
     */
    function updateGameTimeLabels() {
        const gameTimeSelect = document.getElementById('game-time');
        if (!gameTimeSelect) return;

        const timeLabels = {
            '60': { minutes: 1 },
            '300': { minutes: 5 },
            '600': { minutes: 10 },
            '900': { minutes: 15 }
        };

        gameTimeSelect.querySelectorAll('option').forEach(option => {
            const value = option.value;
            if (timeLabels[value]) {
                const mins = timeLabels[value].minutes;
                const minuteWord = mins === 1 ? t('minute') : t('minutes');
                option.textContent = `${mins} ${minuteWord} (${value}s)`;
            }
        });
    }

    /**
     * Update dynamic content (score display, timer, etc.)
     */
    function updateDynamicContent() {
        // Update score display
        const scoreDiv = document.getElementById('score');
        if (scoreDiv && window.score !== undefined) {
            scoreDiv.innerText = `${t('points')}: ${window.score}`;
        }

        // Update scores list if visible
        if (typeof window.displayScores === 'function') {
            window.displayScores();
        }

        // Update language selector display
        const langDisplay = document.getElementById('current-lang-display');
        if (langDisplay) {
            langDisplay.textContent = currentLanguage.toUpperCase();
        }
    }

    /**
     * Format a date according to current locale
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date string
     */
    function formatDate(date) {
        return date.toLocaleDateString(getLocale());
    }

    /**
     * Format a time according to current locale
     * @param {Date} date - The date/time to format
     * @returns {string} - Formatted time string
     */
    function formatTime(date) {
        return date.toLocaleTimeString(getLocale());
    }

    /**
     * Initialize i18n on page load
     */
    function init() {
        // Set the HTML lang attribute
        document.documentElement.lang = currentLanguage;

        // Update all translations on initial load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                updatePageTranslations();
                setupLanguageSelector();
            });
        } else {
            updatePageTranslations();
            setupLanguageSelector();
        }
    }

    /**
     * Setup language selector functionality
     */
    function setupLanguageSelector() {
        const langSelector = document.getElementById('language-selector');
        const langDropdown = document.getElementById('language-dropdown');
        const langDisplay = document.getElementById('current-lang-display');

        if (!langSelector || !langDropdown) return;

        // Update display
        if (langDisplay) {
            langDisplay.textContent = currentLanguage.toUpperCase();
        }

        // Toggle dropdown
        langSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });

        // Handle language selection
        langDropdown.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
                langDropdown.classList.add('hidden');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            langDropdown.classList.add('hidden');
        });
    }

    // Export functions globally
    window.i18n = {
        t,
        setLanguage,
        getLanguage,
        getLocale,
        getOperationName,
        getEncouragingMessage,
        getRandomSecurityQuestion,
        formatDate,
        formatTime,
        updatePageTranslations,
        init
    };

    // Initialize
    init();
})();
