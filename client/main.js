let wordDisplay;
let guessOutput;
let numberGuessSubmit;
let guessWordDisplay;
let letterGuessOutput;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
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

    const numberSubmitButton = document.querySelector('#numberSubmit');
    const numberGuessInput = document.querySelector('#numberGuess');

    numberSubmitButton.onclick = () => {guessNumber(numberGuessInput.value);};

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
    if(!Array.from(targetWordNums.values()).includes(guess - 0)) {
        letterGuessOutput.textContent = `${guess} is not a number`;
    }
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
    else {
        letterGuessOutput.textContent = `wrong, ${lastGuess} is not ${guess}`;
    }
};

const setUpTargetWord = async () => {
    const response = await fetch('words');
    const json = await response.json();
    const words = json.words;
    
    targetWord = words[Math.floor(Math.random() * words.length)];

    targetWordNums = new Map();
    let sortedLetters = targetWord.split('');

    sortedLetters.sort((a, b) => {
        return letters.indexOf(a) - letters.indexOf(b);
    });

    let letterNum = 0;
    for(let i = 0; i < sortedLetters.length; i++) {
        const addTimes = Math.floor(Math.random() * 4) + 1;
        for(let j = 0; j < addTimes; j++) {
            letterNum += Math.floor(Math.random() * 3) + 1;
        }

        targetWordNums.set(sortedLetters[i], letterNum);
    }

    while(wordDisplay.lastChild) {
        wordDisplay.removeChild(wordDisplay.lastChild);
    }

    for(let i = 0; i < targetWord.length; i++) {
        const tile = document.createElement('number-tile');
        tile.dataset.text = targetWordNums.get(targetWord[i]);
        wordDisplay.appendChild(tile);
    }

    while(guessWordDisplay.lastChild) {
        guessWordDisplay.removeChild(guessWordDisplay.lastChild);
    }

    guessWord = new Array();

    for(let i = 0; i < targetWord.length; i++) {
        guessWord.push('_');

        const tile = document.createElement('number-tile');
        tile.dataset.text = guessWord[i];
        guessWordDisplay.appendChild(tile);
    }
};