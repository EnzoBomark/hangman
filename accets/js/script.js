//#region GLOBAL VARIABLES
// Get individual containers for desplay
const menu = document.getElementById('menu');
const game = document.getElementById('game');
//
// SCORE
let score = 0;
let highScore = 0;
const points = 100;
//
let img = [ // Array of images [`../accets/images/WestGif/${img[guesses]}`]
    "WildWestDefault.png",
    "WildWestFirst.gif",
    "WildWestSecond.gif",
    "WildWestThird.gif",
    "WildWestLast.gif",
    "WildWestDeath.gif"
];
let alphabetArr = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split(''); // Split sting to get an Array of letters [A, B, C, ...]
let selectedWord = ""; // Empty string for the random word picked
let guessed = []; // Array of used letters
let guesses = 0; // Integer of guesses made [Set cap equals to five]
//#endregion GLOBAL VARIABLES

//#region FUNCTIONS
// Generate buttons for every char in alphabetArr. Destination row 64 <ul id="letterButtons"></ul>
function generateButtons() {
    let buttons = alphabetArr.map(letter => ` 
    <li><button name="keyboard" class="eightbit-btn" type="button" 
    id="${letter}" onclick="checkGuess('${letter}')">${letter}</button></li>`).join('');

    document.getElementById('letterButtons').innerHTML = buttons;
}

// Returns a random word from wordList
function randomWord() {
    selectedWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    console.log(`Need help? try ${selectedWord}`); // Console cheat for noobs
}

// Generate input boxes for every char in selectedWord. Destination row 50 <div id="wordLength"></div>
function guessWord() {
    statusWin = selectedWord.split("").map(letter => (guessed.indexOf(letter) >= 0 ? letter : "")).join(""); // If letter exist in guessed, set element to letter, else set empty char;
    status = selectedWord.split("").map(letter => (guessed.indexOf(letter) >= 0 ? // If letter exist in guessed, set element.disabled value to letter, else set value to non-breaking space;
        `<li> <input type = "text" disabled value = ${letter}> </li>` :
        `<li> <input type = "text" disabled value = "&nbsp"/> </li>`)).join("&nbsp");

    document.getElementById('wordLength').innerHTML = status;
}

// Check if letterValue exist in selectedWord
function checkGuess(letterValue) {
    guessed.indexOf(letterValue) === -1 ? guessed.push(letterValue) : null; // If letterValue dosent exist in guessed push letterValue, else do nothing. 
    document.getElementById(letterValue).setAttribute('disabled', true);
    clickSound.play();

    if (selectedWord.indexOf(letterValue) >= 0) {
        document.getElementById(letterValue).classList.add('right');
        guessWord();
        checkIfGameWon();

    } else if (selectedWord.indexOf(letterValue) === -1) {
        guesses++;
        updateMistakes();
        checkIfGameLost();
    }
}

// If statusWin strickt-equals to selectedWord add ponits and give a new word
function checkIfGameWon() {
    if (statusWin === selectedWord) {
        winSound.play();
        score += points;
        document.getElementById('score').innerHTML = `Score: ${score}p`;
        restart();
    }
}

// If guesses strickt-equals to 5
function checkIfGameLost() {
    if (guesses === 5) {
        deathSound.play();
        buttons.forEach(element => document.getElementById(element.id).setAttribute('disabled', true)); // disable buttons
        // Display restart and menu buttons
        document.getElementById('startGameBtn').style.visibility = 'visible';
        document.getElementById('menuBtn').style.visibility = 'visible';
        // Display correct word
        statusLost = selectedWord.split("").map(letter => `<li><input type = "text"disabled value = ${letter}></li>`).join(" ");
        document.getElementById('wordLength').innerHTML = statusLost;

        if (score > highScore) { // Update highScore if score is larger
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerHTML = `High Score: ${localStorage.getItem('highScore')}p`;
        }
    }
}

function updateMistakes() {
    document.getElementById('imageDisplay').src = `../accets/images/WestGif/${img[guesses]}`; // Display image equivilant to quantity of failed guesses
}

// Reset values for a new round
function restart() {
    buttons.forEach(element => document.getElementById(element.id).removeAttribute('disabled', true)); // Activate buttons
    buttons.forEach(element => document.getElementById(element.id).classList.remove('right')); // remove 'right' class from buttons
    // Hide restart and menu buttons
    document.getElementById('startGameBtn').style.visibility = 'hidden';
    document.getElementById('menuBtn').style.visibility = 'hidden';
    // Reset values
    selectedWord = "";
    status = null;
    guessed = [];
    alphabetArr = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

    if (guesses === 5) { // If guesses is strickt-equal to 5 reset score and guesses value
        score = 0;
        guesses = 0;
        document.getElementById('score').innerHTML = `Score: ${score}p`;
    }

    randomWord();
    guessWord();
    updateMistakes();
}

// hide menu and display game content
function startGame() {
    menu.style.display = 'none'
    game.style.display = 'flex'
    clickSound.play();
    restart();
}

// Display menu and hide game content
function backToMenu() {
    menu.style.display = 'flex'
    game.style.display = 'none'
    clickSound.play();

}
//#endregion FUNCTIONS

//#region KEYBOARD INPUT AND SPEECH RECOG
window.onkeydown = function (event) { // Get keyboard input
    if (game.style.display == 'flex') { // Run if game is displayed else do nothing
        if (guesses <= 4) { // Register if game isnt over
            if (alphabetArr.includes(event.key.toUpperCase())) { // If event.key exists in alphabetArr
                alphabetArr.splice(alphabetArr.indexOf(event.key.toUpperCase()), 1); // Remove equivalent char in alphabetArr
                guessed.push(event.key.toUpperCase()); // Push event.key char to guessed array
                checkGuess(event.key.toUpperCase());
            }
        }

        if (document.getElementById('startGameBtn').style.visibility == 'visible' && event.key == 'Enter') {
            restart();
        }
        if (event.key == 'Escape') {
            backToMenu();
        }
    }
};


//Speech RECOG START
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'en'; // Set language to english

recognition.addEventListener('result', e => { // 
    if (game.style.display == 'flex') { // Run if game is displayed else do nothing
        const transcript = Array.from(e.results) // Create a shallow-Array to map through
            .map(result => result[0].transcript); // Returns a string containing the transcript of the recognised words

        let firstWord = transcript.toString().toUpperCase().replace(/ .*/, ''); // Remove everything after first word

        if (firstWord == 'LETTER') {
            guessed.push(transcript.toString().toUpperCase().charAt(transcript.toString().length - 1)); // Push last char
            checkGuess(transcript.toString().toUpperCase().charAt(transcript.toString().length - 1)); // checkGuess last char
        }

        if (document.getElementById('startGameBtn').style.visibility == 'visible' && firstWord == 'RESTART') {
            restart();
        }
        if (firstWord == "MENU") {
            backToMenu();
        }
    }
});

recognition.addEventListener('end', recognition.start); // Restart after break
recognition.start(); // Start recog
//#endregion KEYBOARD AND SPEECH

//#region RUN ON START
document.getElementById('score').innerHTML = `Score: ${score}p`; // Set score to 0
localStorage.getItem('highScore') == null ? document.getElementById('highScore').innerHTML = `High Score: 0p` : // If localStorage equals to null set highScore to 0, else set to localStorage value
    document.getElementById('highScore').innerHTML = `High Score: ${localStorage.getItem('highScore')}p`;

generateButtons();
let buttons = document.querySelectorAll('button[name="keyboard"]'); // Grab all buttons with name="keyboard"
//#endregion