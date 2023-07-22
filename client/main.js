import React from 'react';
import ReactDom from 'react-dom';

let guessWordEl;
let targetWordEl;
let letterGuessOutput;
let keyboardEl;
let numpadEl;
let newWordButton;
let toggleThemeButton;
let howtoButton;
let howtoDiv;
let howtoCover;
let homeLink;
let longShareTab;
let shortShareTab;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
let targetWordAsNumbers;
let guessWord;
let guessedNumbers;

let lastGuess;

let userWonWords;

let darkThemeOn = true;
let howtoOn = false;

let longShare = [];
let shortShare = [];

let targetWordTileSet;
let guessWordTileSet;

import {TileSet} from './tileSet.jsx';
import * as keyboard from './keyboard.jsx';
import * as numpad from './numpad.jsx';
import * as utils from './utils.js';

//set up page and buttons
window.onload = () => {
    guessWordEl = document.querySelector('#guessWord');
    guessWordTileSet = ReactDom.render(<TileSet darkThemeOn={darkThemeOn} />, guessWordEl)

    targetWordEl = document.querySelector('#targetWord');
    targetWordTileSet = ReactDom.render(<TileSet darkThemeOn={darkThemeOn} />, targetWordEl);

    howtoDiv = document.querySelector('#howtoDiv');
    howtoCover = document.querySelector('.cover');

    keyboardEl = document.querySelector('#keyboard');
    keyboard.init(keyboardEl, darkThemeOn);

    numpadEl = document.querySelector('#numpad');
    numpad.init(numpadEl, darkThemeOn);
    
    homeLink = document.querySelector('#homeLink');
    newWordButton = document.querySelector('#newWord');
    
    howtoButton = document.querySelector('#howtoButton');
    toggleThemeButton = document.querySelector('#toggleThemeButton');

    getUser();
    setUpTargetWord();

    keyboardEl.addEventListener('letterSubmitted', (e) => {checkGuess(e.detail.output);});

    letterGuessOutput = document.querySelector('#letterGuessOutput');

    numpadEl.addEventListener('numberSubmitted', (e) => {guessNumber(e.detail.output);});

    newWordButton.addEventListener('click', setUpTargetWord);

    longShareTab = document.querySelector('#longShareTab');
    longShareTab.addEventListener('click', () => {displayShareText('long')});

    shortShareTab = document.querySelector('#shortShareTab');
    shortShareTab.addEventListener('click', () => {displayShareText('short')});

    howtoButton.addEventListener('click', () => {toggleHowToPlay(true)});
    howtoCover.addEventListener('click', () => {toggleHowToPlay(true)});

    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([howtoDiv], [keyboard, numpad], [targetWordTileSet, guessWordTileSet], [homeLink, newWordButton], [keyboardEl, numpadEl], shareDiv, true);
    });

    //keypresses for keyboards
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        //add if keyboard is displayed or numpad is displayed do that one
        if(keyboardEl.style.display !== 'none' && targetWord !== guessWord.join('')) {
            if(letters.includes(key)) {
                keyboard.modifyOutput(key);
            }
            else if(key === 'enter') {
                keyboard.submit();
            }
        }
        else if(numpadEl.style.display !== 'none') {
            if(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
                numpad.modifyOutput(key);
            }
            else if(key === 'enter') {
                numpad.submit();
            }
            else if(key === 'backspace') {
                numpad.modifyOutput('x');
            }
        }

        if(key === 'control') {
            setUpTargetWord();
        }
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
        keyboardEl.style.display = 'none';
        numpadEl.style.display = 'block';
    }
    else {
        letterGuessOutput.textContent = `that letter is not in the word`;
        keyboard.setLetter(guess, 'wrong');

        if(longShare.length > 0 && longShare[longShare.length - 1] == 'r') {
            longShare[longShare.length - 1] = `r x2`;
            shortShare[shortShare.length - 1] = ['r', ' x2'];
        }
        else if(longShare.length > 0 && longShare[longShare.length - 1].includes('x')) {
            let numWrong = longShare[longShare.length - 1].substr(longShare[longShare.length - 1].indexOf('x') + 1, 1);
            numWrong++;
            longShare[longShare.length - 1] = `r x${numWrong}`;
            shortShare[shortShare.length - 1] = ['r', ` x${numWrong}`];
        }
        else {
            longShare.push('r');
            shortShare.push(['r']);
        }
    }
};

//check if number guess correlates correctly to letter guess
const guessNumber = (guess) => {
    let longShareString = '';
    let shortShareArr = [];

    //guess was not a number
    if(!Array.from(targetWordNums.values()).includes(guess - 0)) {
        letterGuessOutput.textContent = `${guess} is not a number`;
    }
    //check if number was already guessed correctly
    else if(guessedNumbers.includes(guess)) {
        letterGuessOutput.textContent = `${guess} was already guessed correctly`;
    }
    //guess was correct
    else if(targetWordNums.get(lastGuess) == guess) {
        for(let i = 0; i < guessWord.length; i++) {
            //if the correct guess is already there as an almost guess, remove it
            if(guessWord[i] == lastGuess) {
                guessWord[i] = '_';
            }

            //add letter to guess word and display it
            if(targetWord[i] == lastGuess) {
                guessWord[i] = lastGuess;
                longShareString += 'g';
                shortShareArr.push('g');
            }
            else if(targetWord[i] == guessWord[i]) {
                longShareString += 'g';
                shortShareArr.push('g');
            }
            else {
                longShareString += guessWord[i] == '_' ? 'w' : 'y';
                shortShareArr.push(guessWord[i] == '_' ? 'w' : 'y');
            }
        }

        guessWordTileSet.setTiles(guessWord);
        guessWordTileSet.setTileTypes(targetWord);

        letterGuessOutput.textContent = `correct, ${lastGuess} is ${guess}`;
        keyboard.setLetter(lastGuess, 'correct');

        keyboardEl.style.display = 'block';
        numpadEl.style.display = 'none';

        guessedNumbers.push(guess);

        if(targetWord === guessWord.join('')) {
            letterGuessOutput.textContent = `congrats, you win`;
            shareDiv.style.display = 'flex';
            longShare.push(longShareString);
            longShareString = '';
            shortShare.push(shortShareArr);
            if(shortShare.length > 1 && shortShare[shortShare.length - 1][0] != 'r' && shortShare[shortShare.length - 2][0] != 'r') {
                let shouldDelete = true;
    
                for(let i = 0; i < shortShare[shortShare.length - 1].length; i++) {
                    if((shortShare[shortShare.length - 1][i] == 'w' && shortShare[shortShare.length - 2][i] == 'y') || shortShare[shortShare.length - 1][i] == 'g' && shortShare[shortShare.length - 2][i] == 'y') {
                        shouldDelete = false;
                    }
                }
    
                if(shouldDelete) {
                    shortShare.splice(shortShare.length - 2, 1);
                }
            }
            shortShareArr = [];

            for(let i = 0; i < shortShare.length; i++) {
                shortShare[i] = shortShare[i].join('');
            }

            displayShareText('long');

            addUserWinWord(targetWord);
        }
    }
    //guess was not correct
    else {
        letterGuessOutput.textContent = `wrong, ${lastGuess} is not ${guess}`;
        for(let i = 0; i < targetWordAsNumbers.length; i++) {
            if(targetWordAsNumbers[i] == guess) {
                guessWord[i] = lastGuess;
                keyboard.setLetter(lastGuess, 'almost');
                longShareString += 'y';
                shortShareArr.push('y');
            }
            else if(targetWord[i] == guessWord[i]) {
                longShareString += 'g';
                shortShareArr.push('g');
            }
            else {
                longShareString += guessWord[i] == '_' ? 'w' : 'y';
                shortShareArr.push(guessWord[i] == '_' ? 'w' : 'y');                
            }
        }

        guessWordTileSet.setTiles(guessWord);
        guessWordTileSet.setTileTypes(targetWord);

        keyboardEl.style.display = 'block';
        numpadEl.style.display = 'none';        
    }

    if(longShareString != '') {
        longShare.push(longShareString);
    }

    if(shortShareArr.length > 0) {
        shortShare.push(shortShareArr);

        if(shortShare.length > 1 && shortShare[shortShare.length - 1][0] != 'r' && shortShare[shortShare.length - 2][0] != 'r') {
            let shouldDelete = true;

            for(let i = 0; i < shortShare[shortShare.length - 1].length; i++) {
                if((shortShare[shortShare.length - 1][i] == 'w' && shortShare[shortShare.length - 2][i] == 'y') || (shortShare[shortShare.length - 1][i] == 'g' && shortShare[shortShare.length - 2][i] == 'y')) {
                    shouldDelete = false;
                }
            }

            if(shouldDelete) {
                shortShare.splice(shortShare.length - 2, 1);
            }
        }
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
        const addTimes = Math.floor(Math.random() * 3) + 1;
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

    //create tiles for target word display
    targetWordTileSet.setTiles(targetWordAsNumbers);

    //create and fill array for guess word with placeholder and create tiles for guess word display
    guessWord = new Array(targetWord.length).fill('_');

    guessWordTileSet.setTiles(guessWord);

    guessWordTileSet.setTileTypes(targetWord);

    //reset keyboard
    keyboard.reset();
    
    //remove output text
    letterGuessOutput.textContent = '';

    //remove last guess
    lastGuess = '';

    //reset share display
    shareDiv.style.display = 'none';
    shortShare = [];
    longShare = [];

    guessedNumbers = [];

    //reset keyboard and numpad display
    keyboardEl.style.display = 'block';
    numpadEl.style.display = 'none';

    //make it so enter doesnt give you a new word while you are trying to solve the word you just got
    newWordButton.blur();
};

//toggle dark theme and light theme
const toggleTheme = (elements, keyboards, tileSets, links, keyboardBackgrounds, share, setPref) => {
    if(darkThemeOn) {
        document.body.classList.replace('darkThemeBody', 'lightThemeBody');

        for(const e of elements) {
            e.classList.replace('darkThemeElement', 'lightThemeElement');
        }

        for(const k of keyboards) {
            k.render(!darkThemeOn);
        }

        for(const ts of tileSets) {
            ts.setTheme(!darkThemeOn);
        }

        for(const l of links) {
            l.classList.replace('darkThemeLink', 'lightThemeLink');
        }

        for(const kb of keyboardBackgrounds) {
            kb.classList.replace('darkThemeBackground', 'lightThemeBackground');
        }

        share.classList.replace('shareDivDarkTheme', 'shareDivLightTheme');

        toggleThemeButton.src = '/assets/images/lightBulbLightTheme.png';
        howtoButton.src = '/assets/images/questionLightTheme.png';
    }
    else {
        document.body.classList.replace('lightThemeBody', 'darkThemeBody');

        for(const e of elements) {
            e.classList.replace('lightThemeElement', 'darkThemeElement');
        }

        for(const k of keyboards) {
            k.render(!darkThemeOn);
        }

        for(const ts of tileSets) {
            ts.setTheme(!darkThemeOn);
        }

        for(const l of links) {
            l.classList.replace('lightThemeLink', 'darkThemeLink');
        }

        for(const kb of keyboardBackgrounds) {
            kb.classList.replace('lightThemeBackground', 'darkThemeBackground');
        }

        share.classList.replace('shareDivLightTheme', 'shareDivDarkTheme');

        toggleThemeButton.src = '/assets/images/lightBulbDarkTheme.png';
        howtoButton.src = '/assets/images/questionDarkTheme.png';
    }

    darkThemeOn = !darkThemeOn;

    if(setPref) {
        utils.setUserPrefs(darkThemeOn ? 'dark' : 'light', howtoOn);
    }
};

//get user preferences from the server and change the page to match them
const getUser = () => {
    // const response = await fetch('getUser');
    // const json = await response.json();

    const json = utils.getUser();

    if(json.theme === 'light') {
        toggleTheme([howtoDiv], [keyboard, numpad], [targetWordTileSet, guessWordTileSet], [homeLink, newWordButton], [keyboardEl, numpadEl], shareDiv, false);
    }

    if(json.howto) {
        toggleHowToPlay(false);
    }

    userWonWords = json.wonWords;
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
        utils.setUserPrefs(darkThemeOn ? 'dark' : 'light', howtoOn);
    }
};

const addUserWinWord = async (word) => {
    userWonWords.push(word);
    // const formData = `word=${word}&longShare=${longShare.join(',')}&shortShare=${shortShare.join(',')}`;

    // const response = await fetch('/addUserWin', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Accept': 'application/json',
    //     },
    //     body: formData,
    // });

    // utils.handleResponse(response);
    utils.addUserWin(word, longShare, shortShare);
};

const displayShareText = (type) => {
    if(type == 'long') {
        shareDiv.children[2].textContent = utils.getDisplayShare(longShare).join('\n');
        longShareTab.classList.replace('unSelectedShareTab', 'selectedShareTab');
        shortShareTab.classList.replace('selectedShareTab', 'unSelectedShareTab');
    }
    else {
        shareDiv.children[2].textContent = utils.getDisplayShare(shortShare).join('\n');
        shortShareTab.classList.replace('unSelectedShareTab', 'selectedShareTab');
        longShareTab.classList.replace('selectedShareTab', 'unSelectedShareTab');
    }
};