const wordJson = {};

const letterWhitelist = /^[a-z]*$/;

const defaultUser = { theme: 'dark', howto: 'true', wonWords: '' };

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
  apiKey: 'AIzaSyD3j_RF_jyViDwxRIFaaCl53ukoKOOKhvs',
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

// send response with content
const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'content-type': type });
  response.write(content);
  response.end();
};

// send response without content
const respondMeta = (request, response, status, type) => {
  response.writeHead(status, { 'content-type': type });
  response.end();
};

// save specified user and their values to the database
const saveUserToDatabase = (userId, themeInput, howtoInput, wonWordsInput) => {
  set(ref(database, `users/${userId.replace(/\./g, '&')}`), {
    theme: themeInput,
    howto: howtoInput,
    wonWords: wonWordsInput,
  });
};

// get word list from database, respond with the word list if a get request
const getWords = (request, response) => {
  const wordRef = ref(database, '/words');
  get(wordRef).then((snapshot) => {
    if (request.method === 'HEAD') {
      respondMeta(request, response, 200, 'application/json');
    } else {
      wordJson.words = snapshot.val().words.split(',');
      respond(request, response, JSON.stringify(wordJson), 200, 'application/json');
    }
  });
};

// read word list from database, add word to list then save word list to database
const addWordToDatabase = (word) => {
  const wordsRef = ref(database, '/words');
  get(wordsRef).then((snapshot) => {
    const wordList = snapshot.val().words.split(',');
    if (!wordList.includes(word)) {
      wordList.push(word);
      wordList.sort();
    }
    update(wordsRef, { words: wordList.join(',') });
  });
};

// add a word to the word list and save it
const addWord = (request, response, body) => {
  const responseJson = {
    message: 'no word entered',
  };

  let newWord;

  // check if there is a word
  if (!body.word || body.word.trim() === '') {
    responseJson.id = 'addWordMissingParam';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }

  // sanitize word
  newWord = body.word;
  newWord = newWord.trim().toLowerCase();

  // check if character whitelist passes
  if (!letterWhitelist.test(newWord)) {
    responseJson.message = 'word must contain only letters';
    responseJson.id = 'addWordNotOnlyLetters';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }

  // check if character is already in the word list
  if (wordJson.words.includes(newWord)) {
    responseJson.message = 'that word is already in the list';
    responseJson.id = 'addWordNotNewWord';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }

  const responseCode = 201;

  addWordToDatabase(newWord);

  responseJson.message = `${newWord} was added to the word list`;
  responseJson.words = wordJson.words;
  responseJson.words.push(newWord);
  responseJson.words.sort();
  return respond(request, response, JSON.stringify(responseJson), responseCode, 'application/json');
};

// set user preferences in the server
const setUserPrefs = (request, response, body) => {
  const responseJson = {
    message: 'theme required',
  };

  if (!body.theme || !body.howto) {
    responseJson.id = 'setUserPrefsMissingParams';
    return respond(request, response, responseJson, 400, 'application/json');
  }

  let responseCode = 204;

  let user = `${request.headers['x-forwarded-for']}`;
  user = user.replace(/\./g, '&');
  const userRef = ref(database, `users/${user}`);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      saveUserToDatabase(user, body.theme, body.howto, snapshot.val().wonWords);

      return respondMeta(request, response, responseCode, 'application/json');
    }
    saveUserToDatabase(user, defaultUser.theme, defaultUser.howto, defaultUser.wonWords);

    responseCode = 201;
    responseJson.message = 'user added successfully';
    return respond(request, response, JSON.stringify(responseJson), responseCode, 'application/json');
  });

  return null;
};

// respond with user's preferences
const getUser = (request, response) => {
  let user = `${request.headers['x-forwarded-for']}`;
  user = user.replace(/\./g, '&');
  const userRef = ref(database, `users/${user}`);
  get(userRef).then((snapshot) => {
    if (request.method === 'HEAD') {
      return respondMeta(request, response, 200, 'application/json');
    }

    if (!snapshot.exists()) {
      saveUserToDatabase(user, defaultUser.theme, defaultUser.howto, defaultUser.wonWords);
      return respond(request, response, JSON.stringify(defaultUser), 200, 'application/json');
    }

    return respond(request, response, JSON.stringify(snapshot.val()), 200, 'application/json');
  });

  return null;
};

// add a word a user won with to their user and update their entry in the database
const addUserWin = (request, response, body) => {
  const responseJson = {
    message: 'word required',
  };

  if (!body.word) {
    responseJson.id = 'addUserWinMissingParams';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }

  let responseCode = 204;

  let user = `${request.headers['x-forwarded-for']}`;
  user = user.replace(/\./g, '&');
  const userRef = ref(database, `users/${user}`);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      let userWords = snapshot.val().wonWords.split(',');
      userWords.push(body.word);

      if (userWords.length === wordJson.words.length) {
        userWords = [];
      }

      saveUserToDatabase(user, snapshot.val().theme, snapshot.val().howto, userWords.join(','));

      return respondMeta(request, response, responseCode, 'application/json');
    }
    saveUserToDatabase(user, defaultUser.theme, defaultUser.howto, defaultUser.wonWords);
    responseCode = 201;
    responseJson.message = 'user added successfully';
    return respond(request, response, JSON.stringify(responseJson), responseCode, 'application/json');
  });

  return null;
};

// respond with not found message and status code
const notFound = (request, response) => {
  const object = {
    message: 'the page you were looking for was not found',
    id: 'notFound',
  };

  const jsonString = JSON.stringify(object);

  return respond(request, response, jsonString, 404, 'application/json');
};

module.exports = {
  getWords,
  addWord,
  setUserPrefs,
  getUser,
  addUserWin,
  notFound,
};
