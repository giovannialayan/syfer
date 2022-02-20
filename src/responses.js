const fs = require('fs');

const wordListFileName = `${__dirname}/../data/words.json`;
let wordJson = fs.readFileSync(`${__dirname}/../data/words.json`);
wordJson = JSON.parse(wordJson);

const letterWhitelist = /^[a-z]*$/;

const users = {};

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

const getWords = (request, response) => {
  respond(request, response, JSON.stringify(wordJson), 200, 'application/json');
};

// code i stole from https://stackoverflow.com/questions/10685998/how-to-update-a-value-in-a-json-file-and-save-it-through-node-js
// before i use firebase to do this instead
// save data to file
const saveToFile = (fileName, content) => {
  fs.writeFile(fileName, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      return console.log(err);
    }
    return console.log(`saved to ${fileName}`);
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
  // check if character is already in the word
  if (wordJson.words.includes(newWord)) {
    responseJson.message = 'that word is already in the list';
    responseJson.id = 'addWordNotNewWord';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }

  const responseCode = 201;

  wordJson.words.push(newWord);
  wordJson.words.sort();
  saveToFile(wordListFileName, wordJson);

  responseJson.message = `${newWord} was added to the word list`;
  responseJson.words = wordJson.words;
  return respond(request, response, JSON.stringify(responseJson), responseCode, 'application/json');
};

// set user preferences in the server
const setUserPrefs = (request, response, body) => {
  const responseJson = {
    message: 'theme required',
  };

  if (!body.theme) {
    responseJson.id = 'setUserPrefsMissingParams';
    return respond(request, response, responseJson, 400, 'application/json');
  }

  let responseCode = 204;

  if (!users[request.headers['x-forwarded-for']]) {
    responseCode = 201;
    users[request.headers['x-forwarded-for']] = {};
  }

  users[request.headers['x-forwarded-for']].theme = body.theme;

  if (responseCode === 201) {
    responseJson.message = 'user added successfully';
    return respond(request, response, JSON.stringify(responseJson), responseCode, 'application/json');
  }

  return respondMeta(request, response, responseCode, 'application/json');
};

// respond with user's preferences
const getUserPrefs = (request, response) => {
  if (!users[request.headers['x-forwarded-for']]) {
    users[request.headers['x-forwarded-for']] = {};
  }
  respond(request, response, JSON.stringify(users[request.headers['x-forwarded-for']]), 200, 'application/json');
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
  getUserPrefs,
  notFound,
};
