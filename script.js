// Get references to HTML elements
const gameBoard = document.getElementById('gameBoard'); // The 3x3 grid
const statusDisplay = document.getElementById('status'); // Status message
const scoreXDisplay = document.getElementById('scoreX'); // Player X's score element
const scoreODisplay = document.getElementById('scoreO'); // Player O's score element
const resetButton = document.getElementById('resetGame'); // Reset button
const newGameButton = document.getElementById('newGame'); // New Game button
const overlay = document.getElementById('overlay'); // Overlay for name input
const playerForm = document.getElementById('playerForm'); // Form for player names
const playerXInput = document.getElementById('playerX'); // Player X name input
const playerOInput = document.getElementById('playerO'); // Player O name input

// Initialize game state variables
let board = Array(9).fill(null); // Represents the 3x3 grid
let currentPlayer = 'X'; // Current player ('X' starts)
let scores = { X: 0, O: 0 }; // Tracks scores for both players
let gameActive = true; // Flag to check if the game is active
let playerNames = { X: 'Player X', O: 'Player O' }; // Stores player names

/**
 * Function to initialize the game board.
 */
function initializeBoard() {
    gameBoard.innerHTML = ''; // Clear the board
    board = Array(9).fill(null); // Reset the board array

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div'); // Create a cell
        cell.dataset.index = i; // Assign a data-index for identification
        cell.addEventListener('click', handleCellClick); // Add click listener
        gameBoard.appendChild(cell); // Add cell to the board
    }

    updateStatus(`${playerNames[currentPlayer]}'s turn`); // Update status message
}

/**
 * Function to handle cell clicks.
 */
function handleCellClick(event) {
    const cell = event.target; // The clicked cell
    const index = cell.dataset.index; // Get cell index

    if (board[index] || !gameActive) return; // Ignore if cell is filled or game is inactive

    board[index] = currentPlayer; // Update board state
    cell.textContent = currentPlayer; // Display the mark

    if (checkWin()) {
        scores[currentPlayer]++; // Increment the winner's score
        updateScore(); // Update the scoreboard
        updateStatus(`${playerNames[currentPlayer]} wins!`); // Update status
        gameActive = false; // End the game
    } else if (board.every(cell => cell)) {
        updateStatus("It's a draw!"); // Update status for a draw
        gameActive = false; // End the game
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        updateStatus(`${playerNames[currentPlayer]}'s turn`); // Update status
    }
}

/**
 * Function to check if the current player has won.
 */
function checkWin() {
    const winningPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winningPatterns.some(pattern => 
        pattern.every(index => board[index] === currentPlayer)
    );
}

/**
 * Function to update the scoreboard with current scores.
 */
function updateScore() {
    scoreXDisplay.textContent = scores.X; // Update Player X's score
    scoreODisplay.textContent = scores.O; // Update Player O's score
}

/**
 * Function to update the status message.
 */
function updateStatus(message) {
    statusDisplay.textContent = message; // Update the status display
}

/**
 * Function to reset the game board but keep the scores intact.
 */
function resetGame() {
    board = Array(9).fill(null); // Reset the board
    currentPlayer = 'X'; // Reset to Player X
    gameActive = true; // Reactivate the game
    initializeBoard(); // Reinitialize the board
    updateStatus(`${playerNames[currentPlayer]}'s turn`); // Update status
}

/**
 * Function to completely reset the game, including the scores.
 */
function newGame() {
    scores = { X: 0, O: 0 }; // Reset scores
    updateScore(); // Update the scoreboard to show 0 for both players
    resetGame(); // Reset the board and game state
}

/**
 * Function to handle player name submission.
 */
function handlePlayerFormSubmit(event) {
    event.preventDefault();

    const playerXName = playerXInput.value.trim();
    const playerOName = playerOInput.value.trim();

    if (!playerXName || !playerOName) {
        alert('Both player names are required.');
        return;
    }

    playerNames.X = playerXName;
    playerNames.O = playerOName;

    overlay.style.display = 'none'; // Hide the overlay
    initializeBoard(); // Start the game
}
// Save player names to localStorage
function savePlayerNames() {
    localStorage.setItem('playerX', playerNames.X);
    localStorage.setItem('playerO', playerNames.O);
}

// Retrieve player names from localStorage
function loadPlayerNames() {
    const playerXName = localStorage.getItem('playerX');
    const playerOName = localStorage.getItem('playerO');
    
    if (playerXName) playerNames.X = playerXName;
    if (playerOName) playerNames.O = playerOName;
}

// Call loadPlayerNames on page load
loadPlayerNames();

// Add event listeners
playerForm.addEventListener('submit', handlePlayerFormSubmit);
resetButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', newGame); // New Game button event listener

// Initialize the game on page load
initializeBoard();
