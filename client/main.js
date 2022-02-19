let wordDisplay;
let guessOutput
let guessWordDisplay;
let letterGuessOutput;
let keyboard;
let numberPad;
let newWordButton;
let toggleThemeButton;
let addWordPageButton;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
let targetWordAsNumbers;
let guessWord;

let lastGuess;

let darkThemeOn;

import './tile.js';
import './keyboard.js';
import './numpad.js';

window.onload = () => {
    wordDisplay = document.querySelector("#targetWord");

    setUpTargetWord();

    getUserPrefs();

    keyboard = document.querySelector('letter-keyboard');
    keyboard.addEventListener('letterSubmitted', (e) => {checkGuess(e.detail.output);})

    guessOutput = document.querySelector('#letterGuessOutput');
    guessWordDisplay = document.querySelector('#guessWord');
    letterGuessOutput = document.querySelector('#letterGuessOutput');

    numberPad = document.querySelector('number-pad');
    numberPad.addEventListener('numberSubmitted', (e) => {guessNumber(e.detail.output);});

    newWordButton = document.querySelector('#newWord');
    newWordButton.onclick = setUpTargetWord;

    addWordPageButton = document.querySelector('#gotoAddWordInput');

    darkThemeOn = true;
    toggleThemeButton = document.querySelector('#toggleThemeButton');
    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([addWordPageButton, newWordButton], [keyboard, numberPad], [wordDisplay, guessWordDisplay], true);
    });
};

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

const setUpTargetWord = async () => {
    //get word list from server
    const response = await fetch('words');
    const json = await response.json();
    const words = json.words;
    
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
};

//toggle dark theme and light theme
const toggleTheme = (buttons, keyboards, tileContainers, setPref) => {
    if(darkThemeOn) {
        document.body.classList.replace('darkThemeBody', 'lightThemeBody');

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

        //toggleThemeButton.textContent = 'light theme';
        toggleThemeButton.classList.replace('darkThemeIconButton', 'lightThemeIconButton');
        toggleThemeButton.src = 'images/lightBulbLightTheme.png';
    }
    else {
        document.body.classList.replace('lightThemeBody', 'darkThemeBody');

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

        //toggleThemeButton.textContent = 'dark theme';
        toggleThemeButton.classList.replace('lightThemeIconButton', 'darkThemeIconButton');
        toggleThemeButton.src = 'images/lightBulbDarkTheme.png';
    }

    darkThemeOn = !darkThemeOn;

    if(setPref) {
        setUserPrefs(darkThemeOn ? 'dark' : 'light');
    }
};

const getUserPrefs = async () => {
    const response = await fetch('getUserPrefs');
    const json = await response.json();

    if(json.theme === 'light') {
        toggleTheme([toggleThemeButton, addWordPageButton, newWordButton], [keyboard, numberPad], [wordDisplay, guessWordDisplay], false);
    }
};

const setUserPrefs = async (theme) => {
    const formData = `theme=${theme}`;

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
            statusText += 'response cot not implemented by the server';
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