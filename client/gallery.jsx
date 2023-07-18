const React = require('react');
const ReactDom = require('react-dom');
const utils = require('./utils.js');

let homeLink;
let resetButton;
let toggleThemeButton;

let words = [];
let wonPercent = 0;
let darkThemeOn = true;
let shareTypeLong = true;

const Gallery = (props) => {    
    const getGalleryItem = (item) => {
        return(
            <div key={item.word}>
                <div className={'galleryWord ' + (props.darkThemeOn ? 'galleryDarkTheme' : 'galleryLightTheme')}>
                    <p>{item.word}</p>
                </div>
                <div className={(item.hasShare ? '' : 'shareDivOff ') + 'shareDiv ' + (props.darkThemeOn ? 'shareDivDarkTheme' : 'shareDivLightTheme')}>
                    <div className='shareButtonContainer'>
                        <a className={item.shareTypeLong ? 'selectedShareTab' : 'unSelectedShareTab'} onClick={() => {item.shareTypeLong = true; render()}}>long form</a>
                        <a className={item.shareTypeLong ? 'unSelectedShareTab' : 'selectedShareTab'} onClick={() => {item.shareTypeLong = false; render()}}>short form</a>
                    </div>
                    <p id='shareText'>{item.shareTypeLong ? utils.getDisplayShare(item.longShare).join('\n') : utils.getDisplayShare(item.shortShare).join('\n')}</p>
                </div>
            </div>
        );
    };

    return(
        <div className='galleryContainer'>
            <p className={props.darkThemeOn ? 'percentDarkTheme' : 'percentLightTheme'}>{props.wonPercent}%</p>
            <div>
                {props.words.map((item) => {return getGalleryItem(item);})}
            </div>
        </div>
    );
};

const init = () => {
    getUser(render);

    homeLink = document.querySelector('#homeLink');

    resetButton = document.querySelector('#resetButton');
    resetButton.addEventListener('click', resetWonWords);

    toggleThemeButton = document.querySelector('#toggleThemeButton');
    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([homeLink, resetButton], true);
    });
};

window.onload = init;

const render = () => {
    ReactDom.render(
        <Gallery words={words} darkThemeOn={darkThemeOn} shareTypeLong={shareTypeLong} wonPercent={wonPercent} />, 
        document.getElementById('wordList')
    );
};

const getUser = async (callback) => {
    const wordResponse = await fetch('words');
    const wordJson = await wordResponse.json();

    let wordArr = wordJson.words;

    // const response = await fetch('getUser');
    // const json = await response.json();

    const json = utils.getUser();

    if(json.theme === 'light') {
        toggleTheme([homeLink, resetButton], false);
    }

    let userWonWords = json.wonWords;
    userWonWords = userWonWords.filter(word => word !== '');

    //set wonPercent equal to the percent of words won with 2 decimal places
    wonPercent = Math.floor((userWonWords.length / wordArr.length) * 10000) / 100;

    words = userWonWords.map((word) => {
        let share = json.freePlayShares.find(share => share.id === word);
        if(!share) {
            share = {
                id: -1,
                longShare: '',
                shortShare: '',
            }
        };

        return {
            word: word,
            hasShare: share.id !== -1,
            longShare: share.longShare,
            shortShare: share.shortShare,
            shareTypeLong: true,
        };
    });

    callback();
};

const toggleTheme = (buttons, setPref) => {
    if(darkThemeOn) {
        document.body.classList.replace('darkThemeBody', 'lightThemeBody');

        for(const b of buttons) {
            b.classList.replace('darkThemeLink', 'lightThemeLink');
        }

        toggleThemeButton.src = '/assets/images/lightBulbLightTheme.png';
    }
    else {
        document.body.classList.replace('lightThemeBody', 'darkThemeBody');

        for(const b of buttons) {
            b.classList.replace('lightThemeLink', 'darkThemeLink');
        }

        toggleThemeButton.src = '/assets/images/lightBulbDarkTheme.png';
    }

    darkThemeOn = !darkThemeOn;

    render();

    if(setPref) {
        utils.setUserPrefs(darkThemeOn ? 'dark' : 'light');
    }
};

const resetWonWords = async () => {
    // const response = await fetch('/resetUserWinWords', {
    //     method: 'DELETE'
    // });

    // utils.handleResponse(response);

    utils.resetUserWinWords();

    words = [];
    wonPercent = 0;
    render();
};