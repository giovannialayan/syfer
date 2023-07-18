import * as utils from './utils.js';

let toggleThemeButton;
let dailyLink;
let playLink;
let challengesLink;
let statsLink;
let title;
let darkThemeOn = true;

window.onload = () => {
    title = document.querySelector('#title')
    dailyLink = document.querySelector('#dailyLink');
    playLink = document.querySelector('#playLink');
    statsLink = document.querySelector('#statsLink');
    toggleThemeButton = document.querySelector('#toggleThemeButton');

    getUserPrefs();
    // challengesLink = document.querySelector('#challengesLink');

    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([dailyLink, playLink, statsLink], title, true);
    });
}

//toggle dark theme and light theme
const toggleTheme = (links, setPref) => {
    if(darkThemeOn) {
        document.body.classList.replace('darkThemeBody', 'lightThemeBody');

        for(const l of links) {
            l.classList.replace('darkThemeLink', 'lightThemeLink');
        }

        title.classList.replace('darkThemeTitle', 'lightThemeTitle');

        toggleThemeButton.src = '/assets/images/lightBulbLightTheme.png';
    }
    else {
        document.body.classList.replace('lightThemeBody', 'darkThemeBody');

        for(const l of links) {
            l.classList.replace('lightThemeLink', 'darkThemeLink');
        }

        title.classList.replace('lightThemeTitle', 'darkThemeTitle');

        toggleThemeButton.src = '/assets/images/lightBulbDarkTheme.png';
    }

    darkThemeOn = !darkThemeOn;

    if(setPref) {
        utils.setUserPrefs(darkThemeOn ? 'dark' : 'light');
    }
};

//get user preferences from the server and change the page to match them
const getUserPrefs = async () => {
    // const response = await fetch('getUser');
    // const json = await response.json();

    const json = utils.getUser();

    if(json.theme === 'light') {
        toggleTheme([dailyLink, playLink, statsLink], title, false);
    }
};