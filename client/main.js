let wordDisplay;
let guessOutput;
let guessWordDisplay;
let letterGuessOutput;
let keyboard;
let numberPad;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
let targetWordAsNumbers;
let guessWord;

let lastGuess;

import './tile.js';

window.onload = () => {
    wordDisplay = document.querySelector("#targetWord");

    setUpTargetWord();

    keyboard = document.querySelector('letter-keyboard');
    keyboard.addEventListener('letterSubmitted', (e) => {checkGuess(e.detail.output);})

    guessOutput = document.querySelector('#letterGuessOutput');
    guessWordDisplay = document.querySelector('#guessWord');
    letterGuessOutput = document.querySelector('#letterGuessOutput');

    numberPad = document.querySelector('number-pad');
    numberPad.addEventListener('numberSubmitted', (e) => {guessNumber(e.detail.output);});

    const newWordButton = document.querySelector('#newWord');
    newWordButton.onclick = setUpTargetWord;
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
                guessWordDisplay.children[i].dataset.color = '#333';
            }

            //add letter to guess word and display it
            if(targetWord[i] == lastGuess) {
                guessWord[i] = lastGuess;
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = '#0a0';
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
                guessWordDisplay.children[i].dataset.color = '#aa0';
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
        guessWordDisplay.appendChild(tile);
    }

    //reset keyboard
    keyboard.dataset.reset = true;
    
    //remove output text
    letterGuessOutput.textContent = '';
};