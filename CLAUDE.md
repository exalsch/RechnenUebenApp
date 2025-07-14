# Rechnen �ben App - Project Memory

## App Description
A German math learning web application (Progressive Web App) designed for practicing arithmetic operations. The app provides timed math exercises with various difficulty levels, visual feedback, drawing capabilities for scratch work, and gamification elements including GIF rewards and a gallery system.

## Key Features
- **Math Operations**: Addition, subtraction, multiplication, division with various carry/borrowing options
- **Timed Rounds**: Configurable game duration (1, 5, 10, or 15 minutes)
- **Drawing Canvas**: Integrated scratch pad for working out problems
- **Sound Effects**: Audio feedback for correct/incorrect answers
- **GIF Rewards**: Random GIFs at game end with save functionality
- **Gallery System**: Save and manage favorite GIFs
- **Score Tracking**: Local storage of game results with history
- **Offline Support**: Service worker for offline functionality
- **Settings**: Secured settings menu with API key management

## Code Structure (Post-Refactoring)

### Main Files
- `index.html` - Main application HTML structure
- `main.js` - Core application initialization and coordination (150 lines, reduced from 679)
- `style.css` - Application styling
- `manifest.json` - PWA manifest
- `service-worker.js` - Offline caching and PWA functionality

### JavaScript Modules (js/ directory)
- `game.js` - Game logic, question generation, answer checking
- `settings.js` - Settings modal, security questions, configuration management
- `scores.js` - Score saving, display, and localStorage management
- `timer.js` - Timer functionality and progress bar updates
- `gif.js` - GIF fetching, caching, and display logic
- `gallery.js` - Gallery modal, GIF saving/management, import/export
- `sound.js` - Audio effects and sound toggle functionality
- `drawing.js` - Canvas drawing functionality for scratch work

### Assets
- `sounds/` - Audio files (correct.mp3, wrong.mp3)
- `img/` - Local GIF files (end_1.gif through end_6.gif) and app icons

## Technical Implementation

### Architecture
- **Modular Design**: Refactored from monolithic 679-line file to modular structure
- **Global Communication**: Uses `window` object for inter-module communication
- **Event-Driven**: DOM event listeners for user interactions
- **Local Storage**: Persistent settings, scores, and saved GIFs

### Key Global Variables
- `window.score` - Current game score
- `window.timeLeft` - Remaining time in seconds
- `window.correctAnswer` - Current question's correct answer
- `window.isGameRunning` - Game state flag
- `window.gameTime` - Configurable round duration
- `window.TENOR_API_KEY` - API key for GIF fetching
- `window.gifQueries` - Search terms for GIF API

### Operation Types
- `addition` - Basic addition without carry
- `addition-carry` - Addition with carry operations
- `addition-tens` - Addition with multiples of 10
- `addition-simple-carry` - Simple carry addition
- `subtraktion` - Basic subtraction without borrowing
- `subtraktion-carry` - Subtraction with borrowing
- `subtraktion-simple-carry` - Simple borrowing subtraction
- `multiplikation` - Basic multiplication (1-10 � 1-10)
- `division` - Basic division with whole number results
- `mixed-simple` - Mixed addition/subtraction (simple carry)
- `mixed-carry` - Mixed addition/subtraction (with carry/borrowing)

### Security Features
- **Settings Protection**: Math-based security questions before accessing settings
- **Input Validation**: Validation for API keys, time settings, and game parameters

### Offline Capabilities
- **Service Worker**: Caches static assets and JavaScript modules
- **GIF Caching**: Pre-caches GIFs for offline gameplay
- **Local Fallbacks**: Local GIF files when network unavailable

## Development Notes
- Uses vanilla JavaScript (no frameworks)
- Progressive Web App with offline support
- Responsive design for mobile and desktop
- German language interface
- Integrates with Tenor API for GIF content
- Local storage for persistence without backend dependency