// Translations for the Math Trainer App
// Supported languages: de (German), cs (Czech), en (English)

const translations = {
    // ===== MAIN UI =====
    appTitle: {
        de: 'Mathe trainer',
        cs: 'Matematický trenažér',
        en: 'Math Trainer'
    },
    settingsButtonTitle: {
        de: 'Einstellungen',
        cs: 'Nastavení',
        en: 'Settings'
    },

    // ===== AGE VERIFICATION =====
    ageVerificationTitle: {
        de: '📚 Altersverifikation',
        cs: '📚 Ověření věku',
        en: '📚 Age Verification'
    },
    ageVerificationText: {
        de: 'Diese App wurde für Kinder entwickelt und folgt den deutschen Datenschutzbestimmungen.',
        cs: 'Tato aplikace byla vyvinuta pro děti a dodržuje německé předpisy o ochraně osobních údajů.',
        en: 'This app was developed for children and follows German data protection regulations.'
    },
    ageVerificationQuestion: {
        de: 'Bist du unter 16 Jahre alt?',
        cs: 'Je ti méně než 16 let?',
        en: 'Are you under 16 years old?'
    },
    ageUnder16: {
        de: 'Ja, ich bin unter 16',
        cs: 'Ano, je mi méně než 16',
        en: 'Yes, I am under 16'
    },
    ageOver16: {
        de: 'Nein, ich bin 16 oder älter',
        cs: 'Ne, je mi 16 nebo více',
        en: 'No, I am 16 or older'
    },
    ageVerificationNote: {
        de: 'Kinder unter 16 Jahren benötigen die Erlaubnis ihrer Eltern zur Nutzung.',
        cs: 'Děti mladší 16 let potřebují k používání svolení rodičů.',
        en: 'Children under 16 need parental permission to use this app.'
    },

    // ===== CONSENT BANNER =====
    consentText: {
        de: 'Diese App speichert Spielstände nur lokal auf deinem Gerät. Keine Cookies, keine Server-Übertragung.',
        cs: 'Tato aplikace ukládá výsledky her pouze lokálně na tvém zařízení. Žádné cookies, žádný přenos na server.',
        en: 'This app stores game data only locally on your device. No cookies, no server transmission.'
    },
    consentTextChild: {
        de: '⚠️ Diese App ist für Kinder. Spielstände werden nur lokal gespeichert - keine Cookies, keine Server. Ein Erwachsener muss diese Nachricht bestätigen.',
        cs: '⚠️ Tato aplikace je pro děti. Výsledky her se ukládají pouze lokálně - žádné cookies, žádný server. Dospělý musí potvrdit tuto zprávu.',
        en: '⚠️ This app is for children. Game data is stored locally only - no cookies, no server. An adult must confirm this message.'
    },
    privacyPolicy: {
        de: 'Datenschutzerklärung',
        cs: 'Ochrana osobních údajů',
        en: 'Privacy Policy'
    },
    understood: {
        de: 'Verstanden',
        cs: 'Rozumím',
        en: 'Understood'
    },
    adultConfirms: {
        de: 'Erwachsener bestätigt',
        cs: 'Dospělý potvrzuje',
        en: 'Adult confirms'
    },

    // ===== OPERATION SELECTION =====
    selectOperationType: {
        de: 'Wähle die Art der Aufgaben:',
        cs: 'Vyber typ úloh:',
        en: 'Select exercise type:'
    },
    maxResult: {
        de: 'Max Ergebnis:',
        cs: 'Max. výsledek:',
        en: 'Max result:'
    },
    upTo: {
        de: 'bis',
        cs: 'do',
        en: 'up to'
    },

    // ===== OPERATIONS =====
    operations: {
        addition: {
            de: 'Addition (ohne Übertrag)',
            cs: 'Sčítání (bez přenosu)',
            en: 'Addition (no carry)'
        },
        'addition-carry': {
            de: 'Addition (mit Übertrag)',
            cs: 'Sčítání (s přenosem)',
            en: 'Addition (with carry)'
        },
        'addition-tens': {
            de: 'Addition (Zehner+Zahl)',
            cs: 'Sčítání (desítky+číslo)',
            en: 'Addition (tens+number)'
        },
        'addition-simple-carry': {
            de: 'Addition (Übertrag einfach)',
            cs: 'Sčítání (jednoduchý přenos)',
            en: 'Addition (simple carry)'
        },
        'addition-hundreds': {
            de: 'Addition (Hunderter-Anfänger)',
            cs: 'Sčítání (stovky pro začátečníky)',
            en: 'Addition (hundreds beginner)'
        },
        'mixed-simple': {
            de: '+ & - (Übertrag einfach)',
            cs: '+ & - (jednoduchý přenos)',
            en: '+ & - (simple carry)'
        },
        'mixed-carry': {
            de: '+ & - (mit Übertrag)',
            cs: '+ & - (s přenosem)',
            en: '+ & - (with carry)'
        },
        subtraktion: {
            de: 'Subtraktion (ohne Übertrag)',
            cs: 'Odčítání (bez přenosu)',
            en: 'Subtraction (no borrow)'
        },
        'subtraktion-simple-carry': {
            de: 'Subtraktion (Übertrag einfach)',
            cs: 'Odčítání (jednoduchý přenos)',
            en: 'Subtraction (simple borrow)'
        },
        'subtraktion-carry': {
            de: 'Subtraktion (mit Übertrag)',
            cs: 'Odčítání (s přenosem)',
            en: 'Subtraction (with borrow)'
        },
        'subtraktion-hundreds': {
            de: 'Subtraktion (Hunderter-Anfänger)',
            cs: 'Odčítání (stovky pro začátečníky)',
            en: 'Subtraction (hundreds beginner)'
        },
        multiplikation: {
            de: 'Multiplikation',
            cs: 'Násobení',
            en: 'Multiplication'
        },
        'multi-divi': {
            de: 'Multi & Divi (Multiplikation, dann Umkehrdivision)',
            cs: 'Násobení & Dělení (násobení, pak obrácené dělení)',
            en: 'Multi & Divi (multiplication, then inverse division)'
        },
        division: {
            de: 'Division',
            cs: 'Dělení',
            en: 'Division'
        }
    },

    // Full operation names for scores display
    operationNames: {
        addition: {
            de: 'Addition (ohne Übertrag)',
            cs: 'Sčítání (bez přenosu)',
            en: 'Addition (no carry)'
        },
        'addition-carry': {
            de: 'Addition (mit Übertrag)',
            cs: 'Sčítání (s přenosem)',
            en: 'Addition (with carry)'
        },
        'addition-tens': {
            de: 'Addition (Zehner+Zahl)',
            cs: 'Sčítání (desítky+číslo)',
            en: 'Addition (tens+number)'
        },
        'addition-simple-carry': {
            de: 'Addition (Übertrag einfach)',
            cs: 'Sčítání (jednoduchý přenos)',
            en: 'Addition (simple carry)'
        },
        'addition-hundreds': {
            de: 'Addition (Hunderter-Anfänger)',
            cs: 'Sčítání (stovky pro začátečníky)',
            en: 'Addition (hundreds beginner)'
        },
        'mixed-simple': {
            de: 'Addition & Subtraktion (Übertrag einfach)',
            cs: 'Sčítání & Odčítání (jednoduchý přenos)',
            en: 'Addition & Subtraction (simple carry)'
        },
        'mixed-carry': {
            de: 'Addition & Subtraktion (mit Übertrag)',
            cs: 'Sčítání & Odčítání (s přenosem)',
            en: 'Addition & Subtraction (with carry)'
        },
        subtraktion: {
            de: 'Subtraktion (ohne Übertrag)',
            cs: 'Odčítání (bez přenosu)',
            en: 'Subtraction (no borrow)'
        },
        'subtraktion-simple-carry': {
            de: 'Subtraktion (Übertrag einfach)',
            cs: 'Odčítání (jednoduchý přenos)',
            en: 'Subtraction (simple borrow)'
        },
        'subtraktion-carry': {
            de: 'Subtraktion (mit Übertrag)',
            cs: 'Odčítání (s přenosem)',
            en: 'Subtraction (with borrow)'
        },
        'subtraktion-hundreds': {
            de: 'Subtraktion (Hunderter-Anfänger)',
            cs: 'Odčítání (stovky pro začátečníky)',
            en: 'Subtraction (hundreds beginner)'
        },
        multiplikation: {
            de: 'Multiplikation',
            cs: 'Násobení',
            en: 'Multiplication'
        },
        'multi-divi': {
            de: 'Multiplikation & Division (Umkehraufgabe)',
            cs: 'Násobení & Dělení (obrácený příklad)',
            en: 'Multiplication & Division (inverse)'
        },
        division: {
            de: 'Division',
            cs: 'Dělení',
            en: 'Division'
        }
    },

    // ===== BUTTONS =====
    start: {
        de: 'Start',
        cs: 'Start',
        en: 'Start'
    },
    clearHighscores: {
        de: 'Highscore Liste löschen',
        cs: 'Smazat seznam nejlepších výsledků',
        en: 'Clear Highscore List'
    },
    gallery: {
        de: 'Galerie',
        cs: 'Galerie',
        en: 'Gallery'
    },
    restart: {
        de: 'Neu starten',
        cs: 'Začít znovu',
        en: 'Restart'
    },

    // ===== GAME UI =====
    points: {
        de: 'Punkte',
        cs: 'Body',
        en: 'Points'
    },
    yourAnswer: {
        de: 'Deine Antwort',
        cs: 'Tvá odpověď',
        en: 'Your answer'
    },
    numpadToggleTitle: {
        de: 'Zahlenfeld ein/aus',
        cs: 'Zobrazit/skrýt číselník',
        en: 'Toggle numpad'
    },
    skipTitle: {
        de: 'Überspringen (-1 Punkt)',
        cs: 'Přeskočit (-1 bod)',
        en: 'Skip (-1 point)'
    },
    endGameTitle: {
        de: 'Beenden',
        cs: 'Ukončit',
        en: 'End Game'
    },
    result: {
        de: 'Ergebnis',
        cs: 'Výsledek',
        en: 'Result'
    },
    resultGifAlt: {
        de: 'Zufälliges Ende GIF',
        cs: 'Náhodný GIF na konci',
        en: 'Random end GIF'
    },
    yourScore: {
        de: 'Dein Punktestand',
        cs: 'Tvé skóre',
        en: 'Your score'
    },
    sadPlaceholder: {
        de: '😕 Schade',
        cs: '😕 Škoda',
        en: '😕 Too bad'
    },

    // ===== DRAWING CONTROLS =====
    minimizeTitle: {
        de: 'Minimieren',
        cs: 'Minimalizovat',
        en: 'Minimize'
    },
    clearDrawingTitle: {
        de: 'Notiz löschen',
        cs: 'Smazat poznámku',
        en: 'Clear note'
    },
    colorPickerTitle: {
        de: 'Farbe wählen',
        cs: 'Vybrat barvu',
        en: 'Choose color'
    },
    lineWidthTitle: {
        de: 'Strichstärke anpassen',
        cs: 'Upravit tloušťku čáry',
        en: 'Adjust line width'
    },

    // ===== SETTINGS MODAL =====
    settings: {
        de: 'Einstellungen',
        cs: 'Nastavení',
        en: 'Settings'
    },
    securityCheckText: {
        de: 'Bitte löse die folgende Aufgabe, um die Einstellungen zu öffnen:',
        cs: 'Prosím vyřeš následující úlohu pro otevření nastavení:',
        en: 'Please solve the following problem to open settings:'
    },
    securityAnswerPlaceholder: {
        de: 'Antwort',
        cs: 'Odpověď',
        en: 'Answer'
    },
    confirm: {
        de: 'Bestätigen',
        cs: 'Potvrdit',
        en: 'Confirm'
    },
    playerName: {
        de: 'Spielername:',
        cs: 'Jméno hráče:',
        en: 'Player name:'
    },
    playerNamePlaceholder: {
        de: 'Dein Name',
        cs: 'Tvé jméno',
        en: 'Your name'
    },
    tenorApiKey: {
        de: 'Tenor API Key:',
        cs: 'Tenor API klíč:',
        en: 'Tenor API Key:'
    },
    tenorApiKeyPlaceholder: {
        de: 'Dein TENOR API Key',
        cs: 'Tvůj TENOR API klíč',
        en: 'Your TENOR API Key'
    },
    activateTenorApi: {
        de: '🔗 Tenor API aktivieren',
        cs: '🔗 Aktivovat Tenor API',
        en: '🔗 Activate Tenor API'
    },
    gifSearchTerms: {
        de: 'GIF Suchbegriffe (getrennt durch ;):',
        cs: 'Vyhledávací pojmy pro GIF (oddělené ;):',
        en: 'GIF search terms (separated by ;):'
    },
    gifSearchTermsPlaceholder: {
        de: 'z.B. welpe;lustige tiere',
        cs: 'např. štěně;vtipná zvířata',
        en: 'e.g. puppy;funny animals'
    },
    gameTimeSection: {
        de: 'Spielzeit',
        cs: 'Herní čas',
        en: 'Game Time'
    },
    roundDuration: {
        de: 'Rundendauer (Sekunden):',
        cs: 'Délka kola (sekundy):',
        en: 'Round duration (seconds):'
    },
    minute: {
        de: 'Minute',
        cs: 'minuta',
        en: 'minute'
    },
    minutes: {
        de: 'Minuten',
        cs: 'minut',
        en: 'minutes'
    },
    gifCacheSection: {
        de: 'GIF Cache',
        cs: 'GIF Cache',
        en: 'GIF Cache'
    },
    preloadGifsCount: {
        de: 'Anzahl vorzuladender GIFs:',
        cs: 'Počet předem načtených GIFů:',
        en: 'Number of GIFs to preload:'
    },
    controlsSection: {
        de: 'Steuerung',
        cs: 'Ovládání',
        en: 'Controls'
    },
    disableSkipButton: {
        de: 'Skip-Button deaktivieren',
        cs: 'Deaktivovat tlačítko přeskočení',
        en: 'Disable skip button'
    },
    taskOptionsSection: {
        de: 'Aufgabenoptionen',
        cs: 'Možnosti úloh',
        en: 'Task Options'
    },
    excludeOneMultiplication: {
        de: 'In Multiplikation: Aufgaben mit 1 weglassen (z. B. 1⋅x oder x⋅1)',
        cs: 'V násobení: vynechat úlohy s 1 (např. 1⋅x nebo x⋅1)',
        en: 'In multiplication: exclude tasks with 1 (e.g. 1⋅x or x⋅1)'
    },
    confettiSection: {
        de: 'Konfetti-Effekte 🎉',
        cs: 'Konfetové efekty 🎉',
        en: 'Confetti Effects 🎉'
    },
    confettiCorrectAnswer: {
        de: 'Konfetti bei richtiger Antwort',
        cs: 'Konfety při správné odpovědi',
        en: 'Confetti on correct answer'
    },
    confettiEndRound: {
        de: 'Konfetti am Ende der Runde',
        cs: 'Konfety na konci kola',
        en: 'Confetti at end of round'
    },
    gallerySection: {
        de: 'Galerie',
        cs: 'Galerie',
        en: 'Gallery'
    },
    importGallery: {
        de: 'Galerie importieren',
        cs: 'Importovat galerii',
        en: 'Import Gallery'
    },
    exportGallery: {
        de: 'Galerie exportieren',
        cs: 'Exportovat galerii',
        en: 'Export Gallery'
    },
    saveSettings: {
        de: 'Einstellungen speichern',
        cs: 'Uložit nastavení',
        en: 'Save Settings'
    },

    // ===== SECURITY QUESTIONS =====
    securityQuestions: [
        {
            question: {
                de: 'Was ist 12 * 4?',
                cs: 'Kolik je 12 * 4?',
                en: 'What is 12 * 4?'
            },
            answer: 48
        },
        {
            question: {
                de: 'Was ist 125 / 5?',
                cs: 'Kolik je 125 / 5?',
                en: 'What is 125 / 5?'
            },
            answer: 25
        },
        {
            question: {
                de: 'Was ist 3 hoch 2?',
                cs: 'Kolik je 3 na druhou?',
                en: 'What is 3 squared?'
            },
            answer: 9
        },
        {
            question: {
                de: 'Was ist 7 * 7 + 4?',
                cs: 'Kolik je 7 * 7 + 4?',
                en: 'What is 7 * 7 + 4?'
            },
            answer: 53
        },
        {
            question: {
                de: 'Was ist 100 - 3 * 3?',
                cs: 'Kolik je 100 - 3 * 3?',
                en: 'What is 100 - 3 * 3?'
            },
            answer: 91
        }
    ],

    // ===== TENOR HELP MODAL =====
    tenorHelpTitle: {
        de: '🎬 Tenor API Key einrichten',
        cs: '🎬 Nastavení Tenor API klíče',
        en: '🎬 Set up Tenor API Key'
    },
    tenorStep1Title: {
        de: 'Schritt 1: Google Cloud Console',
        cs: 'Krok 1: Google Cloud Console',
        en: 'Step 1: Google Cloud Console'
    },
    tenorStep1Text1: {
        de: '1. Gehe zur',
        cs: '1. Přejdi na',
        en: '1. Go to'
    },
    tenorStep1Text2: {
        de: '2. Melde dich mit deinem Google-Konto an',
        cs: '2. Přihlas se svým Google účtem',
        en: '2. Sign in with your Google account'
    },
    tenorStep1Text3: {
        de: '3. Erstelle ein neues Projekt oder wähle ein bestehendes aus',
        cs: '3. Vytvoř nový projekt nebo vyber existující',
        en: '3. Create a new project or select an existing one'
    },
    tenorStep2Title: {
        de: 'Schritt 2: Tenor API aktivieren',
        cs: 'Krok 2: Aktivace Tenor API',
        en: 'Step 2: Activate Tenor API'
    },
    tenorStep2Text1: {
        de: '1. Klicke auf "Aktivieren" für die Tenor API',
        cs: '1. Klikni na "Aktivovat" pro Tenor API',
        en: '1. Click "Enable" for the Tenor API'
    },
    tenorStep2Text2: {
        de: '2. Warte, bis die Aktivierung abgeschlossen ist',
        cs: '2. Počkej, než bude aktivace dokončena',
        en: '2. Wait until activation is complete'
    },
    tenorStep3Title: {
        de: 'Schritt 3: API-Schlüssel erstellen',
        cs: 'Krok 3: Vytvoření API klíče',
        en: 'Step 3: Create API Key'
    },
    tenorStep3Text1: {
        de: '1. Gehe zu "APIs & Services" → "Anmeldedaten"',
        cs: '1. Přejdi na "APIs & Services" → "Credentials"',
        en: '1. Go to "APIs & Services" → "Credentials"'
    },
    tenorStep3Text2: {
        de: '2. Klicke auf "+ Anmeldedaten erstellen"',
        cs: '2. Klikni na "+ Create Credentials"',
        en: '2. Click "+ Create Credentials"'
    },
    tenorStep3Text3: {
        de: '3. Wähle "API-Schlüssel" aus',
        cs: '3. Vyber "API Key"',
        en: '3. Select "API Key"'
    },
    tenorStep3Text4: {
        de: '4. Kopiere den generierten Schlüssel',
        cs: '4. Zkopíruj vygenerovaný klíč',
        en: '4. Copy the generated key'
    },
    tenorStep4Title: {
        de: 'Schritt 4: API-Schlüssel einschränken (empfohlen)',
        cs: 'Krok 4: Omezení API klíče (doporučeno)',
        en: 'Step 4: Restrict API Key (recommended)'
    },
    tenorStep4Text1: {
        de: '1. Klicke auf "Schlüssel einschränken"',
        cs: '1. Klikni na "Restrict Key"',
        en: '1. Click "Restrict Key"'
    },
    tenorStep4Text2: {
        de: '2. Wähle "HTTP-Verweis (Websites)" aus',
        cs: '2. Vyber "HTTP referrers (websites)"',
        en: '2. Select "HTTP referrers (websites)"'
    },
    tenorStep4Text3: {
        de: '3. Füge deine Domain hinzu (z.B. example.com/*)',
        cs: '3. Přidej svou doménu (např. example.com/*)',
        en: '3. Add your domain (e.g. example.com/*)'
    },
    tenorStep4Text4: {
        de: '4. Unter "API-Einschränkungen" wähle "Tenor API" aus',
        cs: '4. V "API restrictions" vyber "Tenor API"',
        en: '4. Under "API restrictions" select "Tenor API"'
    },
    tenorStep5Title: {
        de: 'Schritt 5: Schlüssel einsetzen',
        cs: 'Krok 5: Vložení klíče',
        en: 'Step 5: Use the Key'
    },
    tenorStep5Text1: {
        de: '1. Kopiere den API-Schlüssel in das Feld oben',
        cs: '1. Zkopíruj API klíč do pole výše',
        en: '1. Copy the API key into the field above'
    },
    tenorStep5Text2: {
        de: '2. Klicke auf "Einstellungen speichern"',
        cs: '2. Klikni na "Uložit nastavení"',
        en: '2. Click "Save Settings"'
    },
    tenorWarning: {
        de: '⚠️ Wichtig: Teile deinen API-Schlüssel niemals öffentlich! Schränke ihn auf deine Domain ein.',
        cs: '⚠️ Důležité: Nikdy nesdílej svůj API klíč veřejně! Omez ho na svou doménu.',
        en: '⚠️ Important: Never share your API key publicly! Restrict it to your domain.'
    },
    tenorTip: {
        de: '💡 Tipp: Die Tenor API ist für private Nutzung kostenlos. Für kommerzielle Nutzung können Gebühren anfallen.',
        cs: '💡 Tip: Tenor API je pro soukromé použití zdarma. Pro komerční použití mohou být účtovány poplatky.',
        en: '💡 Tip: The Tenor API is free for private use. Commercial use may incur fees.'
    },

    // ===== GALLERY MODAL =====
    galleryEmpty: {
        de: 'Die Galerie ist leer.',
        cs: 'Galerie je prázdná.',
        en: 'The gallery is empty.'
    },
    galleryEmptyExport: {
        de: 'Die Galerie ist leer. Es gibt nichts zu exportieren.',
        cs: 'Galerie je prázdná. Není co exportovat.',
        en: 'The gallery is empty. Nothing to export.'
    },
    savedGifAlt: {
        de: 'Gespeichertes GIF',
        cs: 'Uložený GIF',
        en: 'Saved GIF'
    },
    gifCopied: {
        de: 'GIF-URL in die Zwischenablage kopiert!',
        cs: 'URL GIFu zkopírována do schránky!',
        en: 'GIF URL copied to clipboard!'
    },
    gifsImported: {
        de: 'neue GIFs wurden zur Galerie hinzugefügt.',
        cs: 'nových GIFů bylo přidáno do galerie.',
        en: 'new GIFs were added to the gallery.'
    },
    importError: {
        de: 'Fehler beim Importieren der Datei:',
        cs: 'Chyba při importu souboru:',
        en: 'Error importing file:'
    },
    invalidFileFormat: {
        de: 'Ungültiges Dateiformat.',
        cs: 'Neplatný formát souboru.',
        en: 'Invalid file format.'
    },
    pageOf: {
        de: 'Seite',
        cs: 'Strana',
        en: 'Page'
    },
    of: {
        de: 'von',
        cs: 'z',
        en: 'of'
    },
    prevPage: {
        de: '< Zurück',
        cs: '< Zpět',
        en: '< Back'
    },
    nextPage: {
        de: 'Weiter >',
        cs: 'Další >',
        en: 'Next >'
    },

    // ===== SCORES =====
    last10Rounds: {
        de: 'Letzte 10 Runden',
        cs: 'Posledních 10 kol',
        en: 'Last 10 rounds'
    },
    confirmClearHighscores: {
        de: 'Möchtest du wirklich alle Highscores löschen?',
        cs: 'Opravdu chceš smazat všechny nejlepší výsledky?',
        en: 'Do you really want to delete all highscores?'
    },

    // ===== ALERTS =====
    wrongAnswer: {
        de: 'Falsche Antwort. Bitte versuche es erneut.',
        cs: 'Špatná odpověď. Zkus to prosím znovu.',
        en: 'Wrong answer. Please try again.'
    },
    apiKeyEmpty: {
        de: 'Der API Key darf nicht leer sein.',
        cs: 'API klíč nesmí být prázdný.',
        en: 'The API key cannot be empty.'
    },
    searchTermsEmpty: {
        de: 'Die Suchbegriffe dürfen nicht leer sein.',
        cs: 'Vyhledávací pojmy nesmí být prázdné.',
        en: 'The search terms cannot be empty.'
    },
    gameTimeInvalid: {
        de: 'Die Spielzeit muss zwischen 60 und 1800 Sekunden liegen.',
        cs: 'Herní čas musí být mezi 60 a 1800 sekundami.',
        en: 'Game time must be between 60 and 1800 seconds.'
    },
    gifCacheInvalid: {
        de: 'Die Anzahl der vorzuladenden GIFs muss zwischen 10 und 50 liegen.',
        cs: 'Počet předem načítaných GIFů musí být mezi 10 a 50.',
        en: 'The number of GIFs to preload must be between 10 and 50.'
    },
    settingsSaved: {
        de: 'Einstellungen gespeichert!',
        cs: 'Nastavení uloženo!',
        en: 'Settings saved!'
    },
    apiKeyWarning: {
        de: 'Hinweis: Für GIF-Belohnungen bitte einen eigenen Tenor API-Schlüssel in den ⚙️-Einstellungen eintragen.',
        cs: 'Poznámka: Pro GIF odměny prosím zadejte vlastní Tenor API klíč v ⚙️ nastavení.',
        en: 'Note: For GIF rewards, please enter your own Tenor API key in the ⚙️ settings.'
    },
    maxResultError: {
        de: 'Für {operation} muss die maximale Ergebniszahl zwischen {min} und {max} liegen.',
        cs: 'Pro {operation} musí být maximální výsledek mezi {min} a {max}.',
        en: 'For {operation}, the maximum result must be between {min} and {max}.'
    },
    parentalPermissionRequired: {
        de: 'Kinder unter 16 Jahren benötigen die Erlaubnis ihrer Eltern zur Nutzung dieser App. Bitte bitte einen Erwachsenen um Hilfe.',
        cs: 'Děti mladší 16 let potřebují k používání této aplikace svolení rodičů. Požádej prosím dospělého o pomoc.',
        en: 'Children under 16 need parental permission to use this app. Please ask an adult for help.'
    },

    // ===== FOOTER =====
    aboutApp: {
        de: 'Über diese App',
        cs: 'O této aplikaci',
        en: 'About this App'
    },
    impressum: {
        de: 'Impressum',
        cs: 'Impresum',
        en: 'Legal Notice'
    },
    footerCopyright: {
        de: '© 2025 Mathe trainer app - Entwickelt mit ❤️ für Kinder',
        cs: '© 2025 Matematický trenažér - Vytvořeno s ❤️ pro děti',
        en: '© 2025 Math trainer app - Developed with ❤️ for children'
    },

    // ===== ENCOURAGING MESSAGES =====
    encouragingMessages: {
        excellent: [
            {
                de: 'Fantastisch, {name}! Du bist ein Mathe-Meister! 🌟',
                cs: 'Fantastické, {name}! Jsi matematický mistr! 🌟',
                en: 'Fantastic, {name}! You are a math master! 🌟'
            },
            {
                de: 'Wow, {name}! Das war eine hervorragende Leistung! 🎯',
                cs: 'Wow, {name}! To byl vynikající výkon! 🎯',
                en: 'Wow, {name}! That was an excellent performance! 🎯'
            },
            {
                de: 'Unglaublich, {name}! Du hast es drauf! 🚀',
                cs: 'Neuvěřitelné, {name}! Máš to v malíčku! 🚀',
                en: 'Incredible, {name}! You\'ve got it! 🚀'
            },
            {
                de: 'Perfekt, {name}! Du warst heute spitze! ⭐',
                cs: 'Perfektní, {name}! Dnes jsi byl/a skvělý/á! ⭐',
                en: 'Perfect, {name}! You were amazing today! ⭐'
            },
            {
                de: 'Phänomenal, {name}! Einstein wäre stolz! 🧠',
                cs: 'Fenomenální, {name}! Einstein by byl hrdý! 🧠',
                en: 'Phenomenal, {name}! Einstein would be proud! 🧠'
            },
            {
                de: 'Brillant, {name}! Du bist ein Genie! 💡',
                cs: 'Brilantní, {name}! Jsi génius! 💡',
                en: 'Brilliant, {name}! You are a genius! 💡'
            }
        ],
        great: [
            {
                de: 'Sehr gut gemacht, {name}! Du verbesserst dich stetig! 👍',
                cs: 'Velmi dobře, {name}! Neustále se zlepšuješ! 👍',
                en: 'Very well done, {name}! You\'re steadily improving! 👍'
            },
            {
                de: 'Super, {name}! Das war eine tolle Runde! 🎉',
                cs: 'Super, {name}! To bylo skvělé kolo! 🎉',
                en: 'Super, {name}! That was a great round! 🎉'
            },
            {
                de: 'Klasse, {name}! Weiter so! 💪',
                cs: 'Třída, {name}! Pokračuj tak dál! 💪',
                en: 'Great job, {name}! Keep it up! 💪'
            },
            {
                de: 'Toll, {name}! Du bist auf einem guten Weg! 🌈',
                cs: 'Skvělé, {name}! Jsi na správné cestě! 🌈',
                en: 'Great, {name}! You\'re on the right track! 🌈'
            },
            {
                de: 'Starke Leistung, {name}! Du rockst das! 🎸',
                cs: 'Silný výkon, {name}! Jsi úžasný/á! 🎸',
                en: 'Strong performance, {name}! You rock! 🎸'
            },
            {
                de: 'Beeindruckend, {name}! Du näherst dich der Spitze! 🏔️',
                cs: 'Působivé, {name}! Blížíš se k vrcholu! 🏔️',
                en: 'Impressive, {name}! You\'re reaching the top! 🏔️'
            }
        ],
        good: [
            {
                de: 'Gut gemacht, {name}! Übung macht den Meister! 📚',
                cs: 'Dobře, {name}! Cvičení dělá mistra! 📚',
                en: 'Well done, {name}! Practice makes perfect! 📚'
            },
            {
                de: 'Schön, {name}! Du machst Fortschritte! 🎯',
                cs: 'Hezké, {name}! Děláš pokroky! 🎯',
                en: 'Nice, {name}! You\'re making progress! 🎯'
            },
            {
                de: 'Prima, {name}! Bleib dran! 💫',
                cs: 'Prima, {name}! Vytrvej! 💫',
                en: 'Great, {name}! Keep going! 💫'
            },
            {
                de: 'Weiter so, {name}! Du schaffst das! 🌟',
                cs: 'Tak dál, {name}! Zvládneš to! 🌟',
                en: 'Keep going, {name}! You can do it! 🌟'
            },
            {
                de: 'Solide Arbeit, {name}! Jeder Schritt zählt! 👣',
                cs: 'Solidní práce, {name}! Každý krok se počítá! 👣',
                en: 'Solid work, {name}! Every step counts! 👣'
            },
            {
                de: 'Nicht schlecht, {name}! Du wirst immer besser! 🥳',
                cs: 'Není špatné, {name}! Stále se zlepšuješ! 🥳',
                en: 'Not bad, {name}! You\'re getting better! 🥳'
            }
        ],
        encouraging: [
            {
                de: 'Nicht aufgeben, {name}! Jeder fängt mal klein an! 🌱',
                cs: 'Nevzdávej se, {name}! Každý jednou začínal! 🌱',
                en: 'Don\'t give up, {name}! Everyone starts small! 🌱'
            },
            {
                de: 'Dranbleiben, {name}! Übung macht den Meister! 💪',
                cs: 'Vytrvej, {name}! Cvičení dělá mistra! 💪',
                en: 'Keep at it, {name}! Practice makes perfect! 💪'
            },
            {
                de: 'Kopf hoch, {name}! Beim nächsten Mal wird\'s besser! 🌞',
                cs: 'Hlavu vzhůru, {name}! Příště to bude lepší! 🌞',
                en: 'Chin up, {name}! Next time will be better! 🌞'
            },
            {
                de: 'Mut gefasst, {name}! Du wirst immer besser! 🚀',
                cs: 'Odvahu, {name}! Stále se zlepšuješ! 🚀',
                en: 'Take courage, {name}! You\'re getting better! 🚀'
            },
            {
                de: 'Gib nicht auf, {name}! Fehler sind nur getarnte Lektionen! 🎓',
                cs: 'Nevzdávej to, {name}! Chyby jsou jen skryté lekce! 🎓',
                en: 'Don\'t give up, {name}! Mistakes are just hidden lessons! 🎓'
            },
            {
                de: 'Du bist stärker als du denkst, {name}! Zeig\'s allen! 💥',
                cs: 'Jsi silnější než si myslíš, {name}! Ukaž jim to! 💥',
                en: 'You\'re stronger than you think, {name}! Show them! 💥'
            }
        ]
    },

    // ===== DEFAULT PLAYER NAME =====
    defaultPlayerName: {
        de: 'Spieler',
        cs: 'Hráč',
        en: 'Player'
    },

    // ===== LANGUAGE SELECTOR =====
    language: {
        de: 'Sprache',
        cs: 'Jazyk',
        en: 'Language'
    },
    languageNames: {
        de: 'Deutsch',
        cs: 'Čeština',
        en: 'English'
    }
};

// Make translations globally available
window.translations = translations;
