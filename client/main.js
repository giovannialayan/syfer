let wordDisplay;
let guessOutput
let guessWordDisplay;
let letterGuessOutput;
let keyboard;
let numberPad;
let newWordButton;
let toggleThemeButton;
let addWordPageButton;
let howtoButton;
let howtoDiv;
let howtoCover;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
let targetWordAsNumbers;
let guessWord;

let lastGuess;

let userWonWords;

let darkThemeOn;
let howtoOn;

import './tile.js';
import './keyboard.js';
import './numpad.js';

//set up page and buttons
window.onload = () => {
    wordDisplay = document.querySelector("#targetWord");

    getUser(setUpTargetWord);

    keyboard = document.querySelector('letter-keyboard');
    keyboard.addEventListener('letterSubmitted', (e) => {checkGuess(e.detail.output);})

    guessOutput = document.querySelector('#letterGuessOutput');
    guessWordDisplay = document.querySelector('#guessWord');
    letterGuessOutput = document.querySelector('#letterGuessOutput');

    numberPad = document.querySelector('number-pad');
    numberPad.addEventListener('numberSubmitted', (e) => {guessNumber(e.detail.output);});

    newWordButton = document.querySelector('#newWord');
    newWordButton.addEventListener('click', setUpTargetWord);

    addWordPageButton = document.querySelector('#gotoAddWordInput');

    howtoOn = true;
    howtoDiv = document.querySelector('#howtoDiv');
    howtoCover = document.querySelector('.cover');
    howtoButton = document.querySelector('#howtoButton');
    howtoButton.addEventListener('click', () => {toggleHowToPlay(true)});
    howtoCover.addEventListener('click', () => {toggleHowToPlay(true)});

    darkThemeOn = true;
    toggleThemeButton = document.querySelector('#toggleThemeButton');
    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([howtoDiv], [addWordPageButton, newWordButton], [keyboard, numberPad], [wordDisplay, guessWordDisplay], true);
    });
};

//check if letter guess is in the word
const checkGuess = (guess) => {
    if(guess.length > 1) {
        letterGuessOutput.textContent = `guess was longer than 1 letter`;
    }
    else if(!letters.includes(guess)) {
        letterGuessOutput.textContent = `guess was not a letter`;
    }

    if(targetWord.includes(guess)) {
        letterGuessOutput.textContent = `${guess} is in the word, guess what number it is`;
        lastGuess = guess;
        keyboard.style.display = 'none';
        numberPad.style.display = 'block';
    }
    else {
        letterGuessOutput.textContent = `that letter is not in the word`;
        keyboard.dataset.wrong = guess;
    }
};

//check if number guess correlates correctly to letter guess
const guessNumber = (guess) => {
    //guess was not a number
    if(!Array.from(targetWordNums.values()).includes(guess - 0)) {
        letterGuessOutput.textContent = `${guess} is not a number`;
    }
    //guess was correct
    else if(targetWordNums.get(lastGuess) == guess) {
        for(let i = 0; i < guessWord.length; i++) {
            //if the correct guess is already there as an almost guess, remove it
            if(guessWordDisplay.children[i].dataset.text == lastGuess) {
                guessWordDisplay.children[i].dataset.text = '_';
                guessWordDisplay.children[i].dataset.color = 'default';
            }

            //add letter to guess word and display it
            if(targetWord[i] == lastGuess) {
                guessWord[i] = lastGuess;
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = 'correct';
            }
        }
        letterGuessOutput.textContent = `correct, ${lastGuess} is ${guess}`;
        keyboard.dataset.correct = lastGuess;

        keyboard.style.display = 'block';
        numberPad.style.display = 'none';

        if(targetWord === guessWord.join('')) {
            letterGuessOutput.textContent = `congrats, you win`;
            addUserWinWord(targetWord);
        }
    }
    //guess was not correct
    else {
        letterGuessOutput.textContent = `wrong, ${lastGuess} is not ${guess}`;
        for(let i = 0; i < targetWordAsNumbers.length; i++) {
            if(targetWordAsNumbers[i] == guess) {
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = 'almost';
                keyboard.dataset.almost = lastGuess;
            }
        }

        keyboard.style.display = 'block';
        numberPad.style.display = 'none';
    }
};

//set up the target word to guess and display it
const setUpTargetWord = async () => {
    //get word list from server
    const response = await fetch('words');
    const json = await response.json();
    let words = json.words;
    words = words.filter((w) => !userWonWords.includes(w));

    //choose random word
    targetWord = words[Math.floor(Math.random() * words.length)];

    //sort the letters of the word and initialize the map
    targetWordNums = new Map();
    let sortedLetters = targetWord.split('');

    sortedLetters.sort((a, b) => {
        return letters.indexOf(a) - letters.indexOf(b);
    });

    //randomly choose numbers for each letter increasing each time
    let letterNum = 0;
    for(let i = 0; i < sortedLetters.length; i++) {
        const addTimes = Math.floor(Math.random() * 4) + 1;
        for(let j = 0; j < addTimes; j++) {
            letterNum += Math.floor(Math.random() * 3) + 1;
        }
        //letterNum++;

        targetWordNums.set(sortedLetters[i], letterNum);
    }

    //set numbers in order that they appear in the target word in this array
    targetWordAsNumbers = new Array();
    for(let i = 0; i < targetWord.length; i++) {
        targetWordAsNumbers.push(targetWordNums.get(targetWord[i]));
    }

    //remove tiles for target word display if there are any
    while(wordDisplay.lastChild) {
        wordDisplay.removeChild(wordDisplay.lastChild);
    }

    //create tiles for target word display
    for(let i = 0; i < targetWord.length; i++) {
        const tile = document.createElement('number-tile');
        tile.dataset.text = targetWordNums.get(targetWord[i]);
        tile.dataset.theme = darkThemeOn ? 'dark' : 'light';
        wordDisplay.appendChild(tile);
    }

    //remove tiles for guess word display if there are any
    while(guessWordDisplay.lastChild) {
        guessWordDisplay.removeChild(guessWordDisplay.lastChild);
    }

    //create and fill array for guess word with placeholder and create tiles for guess word display
    guessWord = new Array();

    for(let i = 0; i < targetWord.length; i++) {
        guessWord.push('_');

        const tile = document.createElement('number-tile');
        tile.dataset.text = guessWord[i];
        tile.dataset.theme = darkThemeOn ? 'dark' : 'light';
        guessWordDisplay.appendChild(tile);
    }

    //reset keyboard
    keyboard.dataset.reset = true;
    
    //remove output text
    letterGuessOutput.textContent = '';

    //remove last guess
    lastGuess = '';

    //reset keyboard and numpad display
    keyboard.style.display = 'block';
    numberPad.style.display = 'none';
};

//toggle dark theme and light theme
const toggleTheme = (elements, buttons, keyboards, tileContainers, setPref) => {
    if(darkThemeOn) {
        document.body.classList.replace('darkThemeBody', 'lightThemeBody');

        for(const e of elements) {
            e.classList.replace('darkThemeElement', 'lightThemeElement');
        }

        for(const b of buttons) {
            b.classList.replace('darkThemeButton', 'lightThemeButton');
        }

        for(const k of keyboards) {
            k.dataset.theme = 'light';
        }

        for(const div of tileContainers) {
            const tiles = div.children;
            for(const tile of tiles) {
                tile.dataset.theme = 'light';
            }
        }

        toggleThemeButton.src = 'images/lightBulbLightTheme.png';
        howtoButton.src = 'images/questionLightTheme.png';
    }
    else {
        document.body.classList.replace('lightThemeBody', 'darkThemeBody');

        for(const e of elements) {
            e.classList.replace('lightThemeElement', 'darkThemeElement');
        }

        for(const b of buttons) {
            b.classList.replace('lightThemeButton', 'darkThemeButton');
        }

        for(const k of keyboards) {
            k.dataset.theme = 'dark';
        }

        for(const div of tileContainers) {
            const tiles = div.children;
            for(const tile of tiles) {
                tile.dataset.theme = 'dark';
            }
        }

        toggleThemeButton.src = 'images/lightBulbDarkTheme.png';
        howtoButton.src = 'images/questionDarkTheme.png';
    }

    darkThemeOn = !darkThemeOn;

    if(setPref) {
        setUserPrefs(darkThemeOn ? 'dark' : 'light', howtoOn);
    }
};

//get user preferences from the server and change the page to match them
const getUser = async (callback) => {
    const response = await fetch('getUser');
    const json = await response.json();

    if(json.theme === 'light') {
        toggleTheme([howtoDiv], [toggleThemeButton, addWordPageButton, newWordButton], [keyboard, numberPad], [wordDisplay, guessWordDisplay], false);
    }

    if(json.howto === 'false') {
        toggleHowToPlay(false);
    }

    userWonWords = json.wonWords.split(',');
    callback();
};

//send user preferences to the server
const setUserPrefs = async (theme, howto) => {
    const formData = `theme=${theme}&howto=${howto}`;

    const response = await fetch('/setUserPrefs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-ww-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
    });
  
    handleResponse(response);
};

//handle response from set user prefs post request
const handleResponse = async (response) => {
    let statusText = '';
    switch(response.status){
        case 200:
            statusText += 'success';
            break;
        
        case 201:
            statusText += 'user added';
            break;
        
        case 204:
            statusText += 'user updated';
            break;
        
        case 400:
            statusText += 'bad request';
            break;
        
        case 404:
            statusText += 'not found';
            break;
        
        default:
            statusText += 'response code not implemented by the server';
            break;
    }

    const resText = await response.text();

    if(resText) {
        const parsedJson = JSON.parse(resText);
        statusText += parsedJson.message ? `/n${parsedJson.message}` : '';
        statusText += parsedJson.id ? `/n${parsedJson.id}` : '';
    }
    
    console.log(statusText);
};

const toggleHowToPlay = (setPref) => {
    if(howtoOn) {
        howtoDiv.style.display = 'none';
        howtoCover.style.display = 'none';
    }
    else {
        howtoDiv.style.display = 'block';
        howtoCover.style.display = 'block';
    }

    howtoOn = !howtoOn;

    if(setPref) {
        setUserPrefs(darkThemeOn ? 'dark' : 'light', howtoOn);
    }
};

const addUserWinWord = async (word) => {
    userWonWords.push(word);
    const formData = `word=${word}`;

    const response = await fetch('/addUserWin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-ww-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
    });
  
    handleResponse(response);
}