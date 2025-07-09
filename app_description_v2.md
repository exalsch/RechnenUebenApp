# App Description: Mathe Lern App (Mobile)

## 1. Application Overview

The "Mathe Lern App" is an educational **mobile application** designed to help users practice basic arithmetic skills. It is designed to be **fully functional offline**, making it a reliable learning tool anywhere, anytime.

Users can select different types of calculations, adjust difficulty, and receive immediate feedback. The app includes gamification elements like a timer, scoring, and a highscore list. A key feature is the integrated drawing canvas, which allows users to work through problems on-screen.

## 2. Core Functionality

The application flow is structured into several screens:

1.  **Settings Screen**: The main screen where users configure their exercise session.
    *   **Operation Type**: Choose from various arithmetic problems (e.g., addition with/without carry, subtraction, multiplication).
    *   **Maximum Result**: Select a maximum value for the results to adjust difficulty.
    *   **Start**: Begins the exercise session.
    *   **Highscore**: A button to view the locally stored highscore list.
    *   **Gallery**: A button to view the user's collection of saved reward GIFs.

2.  **Game Screen**: The main interactive screen for solving problems.
    *   **Question**: Displays a math problem based on the selected settings.
    *   **Answer Input**: A numeric input field for the answer.
    *   **Timer & Score**: A countdown timer and the current score are always visible.
    *   **Drawing Canvas**: An integrated canvas for scratch work.
    *   **Controls**: Buttons to submit, skip a question, or end the game.

3.  **End Screen**: Shown when the game ends.
    *   Displays the final score.
    *   Shows a random, locally stored reward GIF.
    *   A button allows the user to save the GIF to their personal gallery.
    *   A "Restart" button navigates back to the Settings Screen.

## 3. Offline Capabilities & Data Management

The app is designed as an offline-first experience. All user data and essential assets are stored directly on the device.

*   **Local Data Storage**: Highscores, user settings (like language preference), and the gallery database are stored using on-device storage (e.g., a local database like SQLite or a file-based system).

*   **Offline GIF Management**:
    *   **Pre-packaged & Downloaded GIFs**: The app comes with a pre-packaged set of reward GIFs. To ensure a variety of rewards, the app will also download and cache a pool of **40 random GIFs**. These are retrieved from the **TENOR API** using a **high content filter** (`contentfilter=high`) to ensure all content is appropriate for children. The download occurs during the first run or when an internet connection is available, and the GIFs are then stored locally for full offline access.
    *   **Reward Mechanism**: At the end of a game, a random GIF is chosen from the locally stored pool (ensuring it's one the user hasn't saved yet).
    *   **User Gallery**: When a user saves a GIF, its file reference is added to the user's gallery database. The gallery displays these locally saved image files.

## 4. Exercise Generation Rules

(This section remains the same as the previous version, detailing the logic for `addition`, `subtraction`, `multiplication`, and `division` based on the selected `maxResult`.)

## 5. Mobile Implementation Notes

To recreate this application for a mobile platform (e.g., using native Android/iOS, React Native, Flutter, etc.), the following components are key:

-   **State Management**: A robust system to manage the application's state across different screens.
-   **Native UI Components**: Use of native UI elements for buttons, selectors, and views to ensure a platform-consistent look and feel.
-   **Navigation**: A screen-based navigation system (e.g., a navigation stack) to move between the Settings, Game, and Result screens.
-   **On-device Storage**: An interface for a local database (e.g., SQLite) or the device's file system to store scores, settings, and the gallery index.
-   **File System API**: To save, read, and manage the downloaded GIF files on the device.
-   **Native Drawing Library**: A native canvas or drawing library for the scratchpad feature.
-   **Network Management**: A module to detect network connectivity and handle the one-time download of the GIF pool in the background.

## 6. Additional Features

### 6.1 Gallery Import/Export

To allow users to back up or migrate their gallery:

*   **Export**: An "Export" button will generate a `gallery_backup.json` file. This file contains the original source URLs of the user's saved GIFs. The user can then share or save this file.
*   **Import**: An "Import" button allows the user to select a `gallery_backup.json` file. The app will then read the URLs and attempt to re-download the GIFs to the local gallery if a network connection is present.

### 6.2 Multilingual Support (German/English)

*   **Language Switcher**: A UI control to switch between German and English.
*   **Translation Management**: All UI strings are managed in language-specific resource files (e.g., `strings.xml` on Android, or JSON files for cross-platform frameworks).
*   **Language Persistence**: The selected language is saved in the app's local settings on the device.
