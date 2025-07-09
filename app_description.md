# App Description: Mathe Lern App

## 1. Application Overview

The "Mathe Lern App" is an educational web application designed to help users practice basic arithmetic skills. Users can select different types of calculations (addition, subtraction, multiplication, division) and adjust the difficulty by setting a maximum result value. The app provides immediate feedback, tracks scores, and includes gamification elements like a timer and a highscore list to motivate the user.

A key feature is the integrated drawing canvas, which allows users to write down calculations and notes, simulating a scratchpad.

## 2. Core Functionality

The application flow is structured as follows:

1.  **Settings Screen**: Upon loading, the user is presented with a settings screen where they can configure the exercise session.
    *   **Operation Type**: The user must choose the type of arithmetic problem they want to practice. Multiple variations for addition and subtraction are available, including exercises with and without carrying/borrowing.
    *   **Maximum Result**: The user selects a maximum value for the results of the calculations (e.g., up to 20, up to 100). This dynamically adjusts the difficulty.
    *   **Start**: The "Start" button begins the exercise session.
    *   **Highscore**: A highscore list is displayed, and a button is available to clear it.
    *   **Gallery**: A button to view saved reward GIFs.

2.  **Game Screen**: Once the session starts, the UI changes to the game view.
    *   **Question**: A math problem is displayed based on the selected settings.
    *   **Answer Input**: An input field is provided for the user to type their answer.
    *   **Timer**: A 5-minute (300-second) countdown timer starts. The game ends when the time is up.
    *   **Scoring**: The current score is displayed, starting at 0. A correct answer awards points, while skipping a question deducts a point.
    *   **Drawing Canvas**: A canvas is available for scratch work. It includes controls for color, line width, and clearing the canvas.
    *   **Controls**: Buttons are available to submit an answer, skip a question, or end the game prematurely.

3.  **Answer Evaluation**:
    *   The app checks the answer as soon as the user submits it (or in some cases, as they type).
    *   **Correct Answer**: A success sound is played, the score is incremented, and a new question is immediately generated.
    *   **Incorrect Answer**: A failure sound is played, and the user can try again.

4.  **End Screen**:
    *   The game ends when the timer runs out or the user clicks the "End Game" button.
    *   The final score is displayed.
    *   A random rewarding GIF is shown, which the user can save to a personal gallery.
    *   The user's score is saved to the highscore list if it's high enough.
    *   A "Restart" button takes the user back to the settings screen.

## 3. Exercise Generation Rules

This section details the specific logic for generating questions for each operation type. `maxResult` refers to the user-selected maximum result value.

### General Principles
- The application avoids generating trivial questions (e.g., adding or subtracting zero).
- For division, it ensures that all divisions are exact (no remainders).
- For subtraction, it ensures the result is never negative.

### Addition

*   **Addition (no carry)**: `addition`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 + num2 <= maxResult`.
    *   **Constraint**: The addition must not involve a carry operation. This is checked by ensuring that the sum of the digits in each position is less than 10 (e.g., for `12 + 5`, `2+5=7 < 10` and `1+0=1 < 10`).

*   **Addition (with carry)**: `addition-carry`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 + num2 <= maxResult`.
    *   **Constraint**: The addition **must** involve a carry operation (e.g., `18 + 5`, as `8+5=13 >= 10`).

*   **Addition (Tens + Number)**: `addition-tens`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 + num2 <= maxResult`.
    *   **Constraint**: One of the two numbers must be a multiple of 10 (e.g., `20 + 7`).

*   **Addition (Simple Carry)**: `addition-simple-carry`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 + num2 <= maxResult`.
    *   **Constraint**: The sum of the last digits of `num1` and `num2` must be 10 or greater (i.e., `(num1 % 10) + (num2 % 10) >= 10`). This focuses on the most basic form of carrying.

### Subtraction

*   **Subtraction (no carry/borrowing)**: `subtraktion`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 >= num2` to ensure a non-negative result. `num1` is also `<= maxResult`.
    *   **Constraint**: The subtraction must not involve borrowing. This is checked by ensuring that each digit of `num1` is greater than or equal to the corresponding digit of `num2`.

*   **Subtraction (Simple Carry/Borrowing)**: `subtraktion-simple-carry`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 >= num2`.
    *   **Constraint**: The last digit of `num1` must be smaller than the last digit of `num2` (i.e., `(num1 % 10) < (num2 % 10)`), forcing a borrow from the tens place.

*   **Subtraction (with carry/borrowing)**: `subtraktion-carry`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: `num1 >= num2`.
    *   **Constraint**: The subtraction **must** involve a borrowing operation at any position.

### Mixed Operations

*   **Mixed (Simple Carry)**: `mixed-simple`
    *   Randomly chooses between **Addition (Simple Carry)** and **Subtraction (Simple Carry)** rules.

*   **Mixed (with Carry)**: `mixed-carry`
    *   Randomly chooses between **Addition (with carry)** and **Subtraction (with carry)** rules.

### Multiplication

*   **Multiplication**: `multiplikation`
    *   Generates two numbers, `num1` and `num2`.
    *   **Rule**: The product `num1 * num2` must be less than or equal to `maxResult`.
    *   **Constraint**: `num2` is typically kept small (e.g., between 2 and 10) to create common multiplication table exercises.

### Division

*   **Division**: `division`
    *   Generates a divisor (`num2`) and a quotient (`result`).
    *   **Rule**: The dividend (`num1`) is calculated as `num2 * result`.
    *   **Constraint**: The dividend (`num1`) must be less than or equal to `maxResult`. This ensures the division is exact and within the user's selected difficulty range.

## 4. Additional Features

- **Sound Effects**: Provides audio feedback for correct and incorrect answers. Can be toggled on/off.
- **Highscore Persistence**: Scores are saved in the browser's `localStorage`, making them persistent across sessions.
- **GIF Gallery**: Users can save their favorite end-of-game reward GIFs to a personal gallery, which is also persisted via `localStorage`.
- **Responsive Design**: The UI is designed to be usable on different screen sizes.

## 5. Technology-Agnostic Implementation Notes

To recreate this application, the following components would be necessary regardless of the specific technology stack (e.g., React, Vue, Angular, vanilla JS):

-   **State Management**: A system to manage the application's state, including `score`, `timeLeft`, `currentQuestion`, `correctAnswer`, `isGameActive`, etc.
-   **UI Components**: Separate components for Settings, Game View, and Results Screen.
-   **Event Handling**: Logic to handle user interactions like button clicks and input changes.
-   **DOM Manipulation**: Functions to dynamically update the HTML to display new questions, scores, and timers.
-   **Local Storage Interface**: A module to read from and write to the browser's `localStorage` for highscores and the GIF gallery.
-   **Canvas API**: Implementation of the drawing functionality using the HTML Canvas API.
