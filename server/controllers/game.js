require('dotenv').config();
const wordJson = require('../../hosted/words.json');
const dailyWordJson = require('../../hosted/dailyWords.json');

let dayCounter = -1;
let today;

// const wordJson = {};

// const letterWhitelist = /^[a-z]*$/;

const defaultUser = { theme: 'dark', howto: 'true', wonWords: '', dailyWin: {number: -1, longShare: '', shortShare: '', letters: '', streak: 0} };

const homePage = (req, res) => res.render('home');
const gamePage = (req, res) => res.render('game');
const dailyPage = (req, res) => res.render('daily');
// const addWordPage = (req, res) => res.render('addWord');

// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const {
  getDatabase, ref, set, get, update,
} = require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: 'syfer-48ed9.firebaseapp.com',
    projectId: 'syfer-48ed9',
    storageBucket: 'syfer-48ed9.appspot.com',
    messagingSenderId: '812087050558',
    appId: '1:812087050558:web:e9b63893a26875b90dec6f',
    measurementId: 'G-5KBCRQCQFM',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// save specified user and their values to the database
// const saveUserToDatabase = (userId, themeInput, howtoInput, wonWordsInput) => {
//     set(ref(database, `users/${userId.replace(/\./g, '&')}`), {
//         theme: themeInput,
//         howto: howtoInput,
//         wonWords: wonWordsInput,
//     });
// };

//get daily
const getDaily = async (req, res) => {
    if(dayCounter == -1) {
        const dailyRef = ref(database, '/daily');
        await get(dailyRef).then((snapshot) => {
            dayCounter = snapshot.val().dayNum;
            today = snapshot.val().date;
        });
    }

    let todayDate = dateToString(new Date());

    if(todayDate != today) {
        dayCounter++;
        today = todayDate;

        if(dayCounter >= wordJson.words.length) {
            dayCounter = 0;
        }

        const dailyRef = ref(database, '/daily');
        get(dailyRef).then((snapshot) => {
            update(dailyRef, { dayNum: dayCounter, date: today });
        });
    }

    if(req.method === 'HEAD') {
        return res.status(200);
    }
    else {
        return res.status(200).json({word: dailyWordJson.words[dayCounter], number: dayCounter});
    }
    
};

const dateToString = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

// get word list from database, respond with the word list if a get request
const getWords = (req, res) => {
    if(req.method === 'HEAD') {
        return res.status(200);
    }
    else {
        return res.status(200).json(wordJson);
    }
    // const wordRef = ref(database, '/words');
    // get(wordRef).then((snapshot) => {
    //     if (req.method === 'HEAD') {
    //         return res.status(200);
    //     } else {
    //         wordJson.words = snapshot.val().words.split(',');
    //         return res.status(200).json(wordJson);
    //     }
    // });
};

// read word list from database, add word to list then save word list to database
// const addWordToDatabase = (word) => {
//     const wordsRef = ref(database, '/words');
//     get(wordsRef).then((snapshot) => {
//         const wordList = snapshot.val().words.split(',');
//         if (!wordList.includes(word)) {
//             wordList.push(word);
//             wordList.sort();
//         }
//         update(wordsRef, { words: wordList.join(',') });
//     });
// };

// add a word to the word list and save it
// const addWord = (req, res, body) => {
//     if(!req.body.password || !process.env.MAKEWORD_PASSWORD) {
//         return res.status(400).json({message: 'wrong password'});
//     }

//     if(body.password != process.env.MAKEWORD_PASSWORD) {
//         return res.status(400).json({message: 'wrong password'});
//     }

//     let newWord;

//     // check if there is a word
//     if (!body.word || body.word.trim() === '') {
//         return res.status(400).json({id: 'addWordMissingParam', message: 'no word entered'});
//     }

//     // sanitize word
//     newWord = body.word;
//     newWord = newWord.trim().toLowerCase();

//     // check if character whitelist passes
//     if (!letterWhitelist.test(newWord)) {
//         return res.status(400).json({id: 'addWordNotOnlyLetters', message: 'word must contain only letters'});
//     }

//     // check if character is already in the word list
//     if (wordJson.words.includes(newWord)) {
//         return res.status(400).json({id: 'addWordNotNewWord', message: 'that word is already in the list'});
//     }

//     addWordToDatabase(newWord);

//     responseJson.message = `${newWord} was added to the word list`;
//     responseJson.words = wordJson.words;
//     responseJson.words.push(newWord);
//     responseJson.words.sort();
//     return res.status(201).json(responseJson);
// };

// set user preferences in the server
const setUserPrefs = (req, res) => {
    if (!req.body.theme && !req.body.howto) {
        return res.status(400).json({ id: 'setUserPrefsMissingParams', message: 'theme or how to required' });
    }

    if(req.body.theme) {
        res.cookie('theme', req.body.theme);
    }

    if(req.body.howto) {
        res.cookie('howto', req.body.howto);
    }

    return res.status(204).json({message: 'preferences saved'});

    // let user = `${req.headers['x-forwarded-for']}`;
    // if(process.env.NODE_ENV === 'production') {
    //     user = `${req.headers['fly-client-ip']}`;
    // }
    // user = user.replace(/\./g, '&');
    // const userRef = ref(database, `users/${user}`);
    // get(userRef).then((snapshot) => {
    //     if (snapshot.exists()) {
    //         saveUserToDatabase(user, body.theme, body.howto, snapshot.val().wonWords);
    //         return res.status(204);
    //     }
    //     saveUserToDatabase(user, defaultUser.theme, defaultUser.howto, defaultUser.wonWords);
    //     return res.status(201).json({message: 'user added successfully'});
    // });

    // return null;
};

// respond with user's preferences
const getUser = (req, res) => {
    let user = {
        theme: defaultUser.theme,
        howto: defaultUser.howto,
        wonWords: defaultUser.wonWords,
        dailyWin: defaultUser.dailyWin,
    };

    if(!req.cookies.theme) {
        res.cookie('theme', defaultUser.theme);
    }
    else {
        user.theme = req.cookies.theme;
    }

    if(!req.cookies.howto) {
        res.cookie('howto', defaultUser.howto);
    }
    else {
        user.howto = req.cookies.howto;
    }

    if(!req.cookies.wonWords) {
        res.cookie('wonWords', defaultUser.wonWords);
    }
    else {
        user.wonWords = req.cookies.wonWords;
    }

    if(!req.cookies.dailyWin) {
        res.cookie('dailyWin', defaultUser.dailyWin)
    }
    else {
        user.dailyWin = req.cookies.dailyWin;
    }

    return res.status(200).json(user);

    // let user = `${req.headers['x-forwarded-for']}`;
    // if(process.env.NODE_ENV === 'production') {
    //     user = `${req.headers['fly-client-ip']}`;
    // }
    // user = user.replace(/\./g, '&');
    // const userRef = ref(database, `users/${user}`);
    // get(userRef).then((snapshot) => {
    //     if (req.method === 'HEAD') {
    //         return res.status(200);
    //     }

    //     if (!snapshot.exists()) {
    //         saveUserToDatabase(user, defaultUser.theme, defaultUser.howto, defaultUser.wonWords);
    //         return res.status(200).json(defaultUser);
    //     }

    //     return res.status(200).json(snapshot.val());
    // });

    // return null;
};

// add a word a user won with to their user and update their entry in the database
const addUserWin = (req, res) => {
    if (!req.body.word) {
        return res.status(400).json({ error: 'word required' });
    }

    let userWords = req.cookies.wonWords.split(',');
    userWords.push(req.body.word);

    while(userWords.indexOf('') != -1) {
        userWords.splice(userWords.indexOf(''), 1);
    }

    if (userWords.length === wordJson.words.length) {
        userWords = [];
    }

    res.cookie('wonWords', userWords.join(','));
    return res.status(204).json({message: 'word saved'});

    // let user = `${req.headers['x-forwarded-for']}`;
    // if(process.env.NODE_ENV === 'production') {
    //     user = `${req.headers['fly-client-ip']}`;
    // }
    // user = user.replace(/\./g, '&');
    // const userRef = ref(database, `users/${user}`);
    // get(userRef).then((snapshot) => {
    //     if (snapshot.exists()) {
    //         let userWords = snapshot.val().wonWords.split(',');
    //         userWords.push(body.word);

    //         if (userWords.length === wordJson.words.length) {
    //             userWords = [];
    //         }

    //         saveUserToDatabase(user, snapshot.val().theme, snapshot.val().howto, userWords.join(','));

    //         return res.status(204);
    //     }
    //     saveUserToDatabase(user, defaultUser.theme, defaultUser.howto, defaultUser.wonWords);
    //     return res.status(201).json({message: 'user added successfully'});
    // });

    // return null;
};

//update user's daily win to today's number
const updateUserDailyWin = (req, res) => {
    if(!req.body.number || !req.body.longShare || !req.body.shortShare || !req.body.streak || !req.body.letters) {
        return res.status(400).json({ error: 'number, share strings, letters, and streak are required' });
    }

    let dailyWinObj = {
        number: req.body.number,
        longShare: req.body.longShare,
        shortShare: req.body.shortShare,
        letters: req.body.letters,
        streak: req.body.streak,
    };

    res.cookie('dailyWin', dailyWinObj);
    res.status(204).json({message: 'daily win saved'});
};

module.exports = {
    homePage,
    gamePage,
    dailyPage,
    // addWordPage,
    getWords,
    // addWord,
    setUserPrefs,
    getUser,
    addUserWin,
    getDaily,
    updateUserDailyWin,
};
