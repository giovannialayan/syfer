let wordDisplay;
let guessOutput;
let guessWordDisplay;
let letterGuessOutput;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
let targetWordAsNumbers;
let guessWord;

let lastGuess;

import './tile.js';

window.onload = () => {
    wordDisplay = document.querySelector("#targetWord");
    const submitButton = document.querySelector("#submit");
    const guessInput = document.querySelector('#guess');

    submitButton.onclick = () => {checkGuess(guessInput.value);};

    setUpTargetWord();

    guessOutput = document.querySelector('#letterGuessOutput');
    guessWordDisplay = document.querySelector('#guessWord');
    letterGuessOutput = document.querySelector('#letterGuessOutput');

    const numberPad = document.querySelector('number-pad');
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
        letterGuessOutput.textContent = `${guess} is in the word, guess what number it is below`;
        lastGuess = guess;
    }
    else {
        letterGuessOutput.textContent = `that letter is not in the word`;
    }
};

const guessNumber = (guess) => {
    console.log(guess);
    //guess was not a number
    if(!Array.from(targetWordNums.values()).includes(guess - 0)) {
        letterGuessOutput.textContent = `${guess} is not a number`;
    }
    //guess was correct
    else if(targetWordNums.get(lastGuess) == guess) {
        for(let i = 0; i < guessWord.length; i++) {
            if(targetWord[i] == lastGuess) {
                guessWord[i] = lastGuess;
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = '#0a0';
            }
        }
        letterGuessOutput.textContent = `correct, ${lastGuess} is ${guess}`;
    }
    //guess was not correct
    else {
        letterGuessOutput.textContent = `wrong, ${lastGuess} is not ${guess}`;
        for(let i = 0; i < targetWordAsNumbers.length; i++) {
            if(targetWordAsNumbers[i] == guess) {
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = '#0aa';
            }
        }
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
};