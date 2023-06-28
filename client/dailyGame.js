let wordDisplay;
let guessOutput
let guessWordDisplay;
let letterGuessOutput;
let keyboard;
let numberPad;
let toggleThemeButton;
let howtoButton;
let howtoDiv;
let howtoCover;
let shareDiv;
let longShareTab;
let shortShareTab;
let homeLink;
let copyShareButton;

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let targetWord;
let targetWordNums;
let targetWordAsNumbers;
let guessWord;

let lastGuess;

let darkThemeOn;
let howtoOn;

let longShare = [];
let shortShare = [];

let dailyNumber;
let streak;

let usedLetters = [];

import './numberTile.js';
import './keyboard.js';
import './numpad.js';

//set up page and buttons
window.onload = () => {
    wordDisplay = document.querySelector("#targetWord");

    keyboard = document.querySelector('letter-keyboard');
    keyboard.addEventListener('letterSubmitted', (e) => {checkGuess(e.detail.output);})

    guessOutput = document.querySelector('#letterGuessOutput');
    guessWordDisplay = document.querySelector('#guessWord');
    letterGuessOutput = document.querySelector('#letterGuessOutput');

    numberPad = document.querySelector('number-pad');
    numberPad.addEventListener('numberSubmitted', (e) => {guessNumber(e.detail.output);});

    shareDiv = document.querySelector('#shareDiv');

    longShareTab = document.querySelector('#longShareTab');
    longShareTab.addEventListener('click', () => {displayShareText('long')});

    shortShareTab = document.querySelector('#shortShareTab');
    shortShareTab.addEventListener('click', () => {displayShareText('short')});

    homeLink = document.querySelector('#homeLink');

    copyShareButton = document.querySelector('#copyShare');
    copyShareButton.addEventListener('click', copyShareText);

    getUser(setUpTargetWord);

    howtoOn = false;
    howtoDiv = document.querySelector('#howtoDiv');
    howtoCover = document.querySelector('.cover');
    howtoButton = document.querySelector('#howtoButton');
    howtoButton.addEventListener('click', () => {toggleHowToPlay(true)});
    howtoCover.addEventListener('click', () => {toggleHowToPlay(true)});

    darkThemeOn = true;
    toggleThemeButton = document.querySelector('#toggleThemeButton');
    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([howtoDiv], [copyShareButton], [keyboard, numberPad], [wordDisplay, guessWordDisplay], [homeLink], shareDiv, true);
    });

    //keypresses for keyboards
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        //add if keyboard is displayed or numpad is displayed do that one
        if(keyboard.style.display !== 'none' && guessWord.includes('_')) {
            if(letters.includes(key)) {
                keyboard.modifyOutput(key);
            }
            else if(key === 'enter') {
                keyboard.submit();
            }
        }
        else if(numberPad.style.display !== 'none') {
            if(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
                numberPad.modifyOutput(key);
            }
            else if(key === 'enter') {
                numberPad.submit();
            }
            else if(key === 'backspace') {
                numberPad.modifyOutput('x');
            }
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
        keyboard.style.display = 'none';
        numberPad.style.display = 'block';
    }
    else {
        letterGuessOutput.textContent = `that letter is not in the word`;
        keyboard.dataset.wrong = guess;
        usedLetters.push(guess);

        if(longShare.length > 0 && longShare[longShare.length - 1] == '🟥') {
            longShare[longShare.length - 1] = `🟥 x2`;
            shortShare[shortShare.length - 1] = ['🟥', ' x2'];
        }
        else if(longShare.length > 0 && longShare[longShare.length - 1].includes('x')) {
            let numWrong = longShare[longShare.length - 1].substr(longShare[longShare.length - 1].indexOf('x') + 1, 1);
            numWrong++;
            longShare[longShare.length - 1] = `🟥 x${numWrong}`;
            shortShare[shortShare.length - 1] = ['🟥', ` x${numWrong}`];
        }
        else {
            longShare.push('🟥');
            shortShare.push(['🟥']);
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
    //guess was correct
    else if(targetWordNums.get(lastGuess) == guess) {

        for(let i = 0; i < guessWord.length; i++) {
            //if the correct guess is already there as an almost guess, remove it
            if(guessWordDisplay.children[i].dataset.text == lastGuess) {
                guessWord[i] = '_';
                guessWordDisplay.children[i].dataset.text = '_';
                guessWordDisplay.children[i].dataset.color = 'default';
            }

            //add letter to guess word and display it
            if(targetWord[i] == lastGuess) {
                guessWord[i] = lastGuess;
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = 'correct';
                longShareString += '🟩';
                shortShareArr.push('🟩');
            }
            else if(targetWord[i] == guessWord[i]) {
                longShareString += '🟩';
                shortShareArr.push('🟩');
            }
            else {
                longShareString += guessWord[i] == '_' ? '⬜' : '🟨';
                shortShareArr.push(guessWord[i] == '_' ? '⬜' : '🟨');
            }
        }
        letterGuessOutput.textContent = `correct, ${lastGuess} is ${guess}`;
        keyboard.dataset.correct = lastGuess;
        usedLetters.push(lastGuess);

        keyboard.style.display = 'block';
        numberPad.style.display = 'none';

        if(targetWord === guessWord.join('')) {
            letterGuessOutput.textContent = `congrats, you win`;
            shareDiv.style.display = 'flex';
            longShare.push(longShareString);
            longShareString = '';
            shortShare.push(shortShareArr);
            if(shortShare.length > 1 && shortShare[shortShare.length - 1][0] != '🟥' && shortShare[shortShare.length - 2][0] != '🟥') {
                let shouldDelete = true;
    
                for(let i = 0; i < shortShare[shortShare.length - 1].length; i++) {
                    if((shortShare[shortShare.length - 1][i] == '⬜' && shortShare[shortShare.length - 2][i] == '🟨') || shortShare[shortShare.length - 1][i] == '🟩' && shortShare[shortShare.length - 2][i] == '🟨') {
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

            streak++;
            displayShareText('long');
            
            updateUserDailyWin();
        }
    }
    //guess was not correct
    else {
        letterGuessOutput.textContent = `wrong, ${lastGuess} is not ${guess}`;
        for(let i = 0; i < targetWordAsNumbers.length; i++) {
            if(targetWordAsNumbers[i] == guess) {
                guessWord[i] = lastGuess;
                guessWordDisplay.children[i].dataset.text = lastGuess;
                guessWordDisplay.children[i].dataset.color = 'almost';
                keyboard.dataset.almost = lastGuess;
                longShareString += '🟨';
                shortShareArr.push('🟨');
            }
            else if(targetWord[i] == guessWord[i]) {
                longShareString += '🟩';
                shortShareArr.push('🟩');
            }
            else {
                longShareString += guessWord[i] == '_' ? '⬜' : '🟨';
                shortShareArr.push(guessWord[i] == '_' ? '⬜' : '🟨');                
            }
        }

        keyboard.style.display = 'block';
        numberPad.style.display = 'none';
    }

    if(longShareString != '') {
        longShare.push(longShareString);
    }

    if(shortShareArr.length > 0) {
        shortShare.push(shortShareArr);

        if(shortShare.length > 1 && shortShare[shortShare.length - 1][0] != '🟥' && shortShare[shortShare.length - 2][0] != '🟥') {
            let shouldDelete = true;

            for(let i = 0; i < shortShare[shortShare.length - 1].length; i++) {
                if((shortShare[shortShare.length - 1][i] == '⬜' && shortShare[shortShare.length - 2][i] == '🟨') || (shortShare[shortShare.length - 1][i] == '🟩' && shortShare[shortShare.length - 2][i] == '🟨')) {
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
const toggleTheme = (elements, buttons, keyboards, tileContainers, links, share, setPref) => {
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

        for(const l of links) {
            l.classList.replace('darkThemeLink', 'lightThemeLink');
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

        for(const l of links) {
            l.classList.replace('lightThemeLink', 'darkThemeLink');
        }

        share.classList.replace('shareDivLightTheme', 'shareDivDarkTheme');

        toggleThemeButton.src = '/assets/images/lightBulbDarkTheme.png';
        howtoButton.src = '/assets/images/questionDarkTheme.png';
    }

    darkThemeOn = !darkThemeOn;

    if(setPref) {
        setUserPrefs(darkThemeOn ? 'dark' : 'light', howtoOn);
    }
};

//get user preferences from the server and change the page to match them
const getUser = async (callback) => {
    const wordResponse = await fetch('dailyWord');
    const wordJson = await wordResponse.json();

    targetWord = wordJson.word;
    dailyNumber = wordJson.number;
    document.title = `syfer daily #${dailyNumber}`;

    const response = await fetch('getUser');
    const json = await response.json();

    if(json.theme === 'light') {
        toggleTheme([howtoDiv], [copyShareButton], [keyboard, numberPad], [wordDisplay, guessWordDisplay], [homeLink], shareDiv, false);
    }

    if(json.howto === 'true') {
        toggleHowToPlay(true);
    }

    callback();

    if(dailyNumber - json.dailyWin.number > 1) {
        streak = 0;
    }
    else {
        streak = json.dailyWin.streak;
    }

    if(json.dailyWin.number == dailyNumber) {
        longShare = json.dailyWin.longShare.split(',');
        shortShare = json.dailyWin.shortShare.split(',');
        let usedLetters = json.dailyWin.letters.split(',');

        shareDiv.style.display = 'flex';
        displayShareText('long');
        guessWord = targetWord;

        for(let i = 0; i < usedLetters.length; i++) {
            if(targetWord.includes(usedLetters[i])) {
                keyboard.dataset.correct = usedLetters[i];
                if(targetWord.indexOf(usedLetters[i]) != targetWord.lastIndexOf(usedLetters[i])) {
                    for(let j = 0; j < targetWord.length; j++) {
                        if(targetWord[j] == usedLetters[i]) {
                            guessWordDisplay.children[j].dataset.text = usedLetters[i];
                            guessWordDisplay.children[j].dataset.color = 'correct';
                        }
                    }
                }
                else {
                    guessWordDisplay.children[targetWord.indexOf(usedLetters[i])].dataset.text = usedLetters[i];
                    guessWordDisplay.children[targetWord.indexOf(usedLetters[i])].dataset.color = 'correct';
                }
            }
            else {
                keyboard.dataset.wrong = usedLetters[i];
            }
        }
    }
};

//send user preferences to the server
const setUserPrefs = async (theme, howto) => {
    const formData = `theme=${theme}&howto=${howto}`;

    const response = await fetch('/setUserPrefs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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

const updateUserDailyWin = async () => {
    const formData = `number=${dailyNumber}&longShare=${longShare}&shortShare=${shortShare}&letters=${usedLetters}&streak=${streak}`;

    const response = await fetch('/updateUserDailyWin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
    });
  
    handleResponse(response);
};

const displayShareText = (type) => {
    shareDiv.children[3].textContent = `syfer #${dailyNumber} 🔥${streak}`;
    if(type == 'long') {
        shareDiv.children[4].textContent = longShare.join('\n');
        longShareTab.classList.replace('unSelectedShareTab', 'selectedShareTab');
        shortShareTab.classList.replace('selectedShareTab', 'unSelectedShareTab');
    }
    else {
        shareDiv.children[4].textContent = shortShare.join('\n');
        shortShareTab.classList.replace('unSelectedShareTab', 'selectedShareTab');
        longShareTab.classList.replace('selectedShareTab', 'unSelectedShareTab');
    }
};

const copyShareText = () => {
    navigator.clipboard.writeText(`${shareDiv.children[3].textContent}\n${shareDiv.children[4].textContent}`);
};