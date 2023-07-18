const defaultUser = { theme: 'dark', howto: true, wonWords: [], currentWonWords: [], dailyWin: {number: -1, longShare: [], shortShare: [], letters: [], streak: 0}, freePlayShares: [], dailyWinHistory: [] };

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

//send user preferences to the server
const setUserPrefs = (theme, howto) => {
    if(theme === 'light' || theme === 'dark') {
        localStorage.setItem('theme', JSON.stringify(theme));
    }

    if(howto !== undefined) {
        localStorage.setItem('howto', JSON.stringify(howto));
    }
};

const getUser = () => {
    let user = {
        theme: defaultUser.theme,
        howto: defaultUser.howto,
        wonWords: defaultUser.wonWords,
        currentWonWords: defaultUser.currentWonWords,
        dailyWin: defaultUser.dailyWin,
        freePlayShares: defaultUser.freePlayShares,
        dailyWinHistory: defaultUser.dailyWinHistory,
    };

    let theme = localStorage.getItem('theme');
    if(!theme) {
        localStorage.setItem('theme', JSON.stringify(defaultUser.theme));
    }
    else {
        user.theme = JSON.parse(theme);
    }

    let howto = localStorage.getItem('howto');
    if(!howto) {
        localStorage.setItem('howto', JSON.stringify(defaultUser.howto));
    }
    else {
        user.howto = JSON.parse(howto);
    }

    let wonWords = localStorage.getItem('wonWords');
    if(!wonWords) {
        localStorage.setItem('wonWords', JSON.stringify(defaultUser.wonWords));
    }
    else {
        user.wonWords = JSON.parse(wonWords);
    }

    let currentWonWords = localStorage.getItem('currentWonWords');
    if(!currentWonWords) {
        localStorage.setItem('currentWonWords', JSON.stringify(defaultUser.currentWonWords));
    }
    else {
        user.currentWonWords = JSON.parse(currentWonWords);
    }

    let dailyWin = localStorage.getItem('dailyWin');
    if(!dailyWin) {
        localStorage.setItem('dailyWin', JSON.stringify(defaultUser.dailyWin));
    }
    else {
        user.dailyWin = JSON.parse(dailyWin);
    }

    let freePlayShares = localStorage.getItem('freePlayShares');
    if(!freePlayShares) {
        localStorage.setItem('freePlayShares', JSON.stringify(defaultUser.freePlayShares));
    }
    else {
        user.freePlayShares = JSON.parse(freePlayShares);
    }

    let dailyWinHistory = localStorage.getItem('dailyWinHistory');
    if(!dailyWinHistory) {
        localStorage.setItem('dailyWinHistory', JSON.stringify(defaultUser.dailyWinHistory));
    }
    else {
        user.dailyWinHistory = JSON.parse(dailyWinHistory);
    }

    return user;
};

const addUserWin = async (word, longShare, shortShare) => {
    const wordNumResponse = await fetch('wordListSize');
    const wordNumJson = await wordNumResponse.json();

    let userWords = localStorage.getItem('wonWords');
    let currentWonWords = localStorage.getItem('currentWonWords');

    if(!userWords) {
        userWords = [];
    }
    else {
        userWords = JSON.parse(userWords);
    }

    if(!currentWonWords) {
        currentWonWords = [];
    }
    else {
        currentWonWords = JSON.parse(currentWonWords);
    }

    if(!userWords.includes(word)) {
        userWords.push(word);

        userWords = userWords.filter(word => word !== '');

        localStorage.setItem('wonWords', JSON.stringify(userWords));

        let userShares = localStorage.getItem('freePlayShares');
        if(!userShares) {
            userShares = [];
        }
        else {
            userShares = JSON.parse(userShares);
        }

        userShares.push({id: word, longShare, shortShare});

        localStorage.setItem('freePlayShares', JSON.stringify(userShares));
    }

    currentWonWords.push(word);

    currentWonWords = currentWonWords.filter(word => word !== '');

    if (currentWonWords.length === wordNumJson.size) {
        currentWonWords = [];
    }

    localStorage.setItem('currentWonWords', JSON.stringify(currentWonWords));
};

const updateUserDailyWin = (number, longShare, shortShare, letters, streak) => {
    let dailyWinObj = {number, longShare, shortShare, letters, streak};

    localStorage.setItem('dailyWin', JSON.stringify(dailyWinObj));

    let dailyWinHistory = localStorage.getItem('dailyWinHistory');
    if(!dailyWinHistory) {
        dailyWinHistory = [];
    }
    else {
        dailyWinHistory = JSON.parse(dailyWinHistory);
    }

    dailyWinHistory.push({number, longShare, shortShare});

    localStorage.setItem('dailyWinHistory', JSON.stringify(dailyWinHistory));
};

const resetUserWinWords = () => {
    localStorage.setItem('wonWords', '');
};

//transform share arrays from numbers to emojis
const getDisplayShare = (shareNums) => {
    const displayShare = [];

    for(let i = 0; i < shareNums.length; i++) {
        let shareStr = '';
        for(const num of shareNums[i]) {
            if(['w', 'r', 'y', 'g'].includes(num)) {
                shareStr += getShareEmoji(num);
            }
            else {
                shareStr += num;
            }
        }

        displayShare.push(shareStr);
    }

    return displayShare;
};

const getShareEmoji = (num) => {
    switch(num) {
        case 'w':
            return '⬜';

        case 'r':
            return '🟥';

        case 'y':
            return '🟨';

        case 'g':
            return '🟩';

        default:
            return '';
    }
};

module.exports = {
    handleResponse,
    setUserPrefs,
    getDisplayShare,
    getUser,
    addUserWin,
    updateUserDailyWin,
    resetUserWinWords,
};