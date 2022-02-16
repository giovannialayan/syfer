const fs = require('fs');

const wordListFileName = `${__dirname}/../data/words.json`;
let wordJson = fs.readFileSync(`${__dirname}/../data/words.json`);
wordJson = JSON.parse(wordJson);

const letterWhitelist = new RegExp('^[a-z]*$');

const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'content-type': type });
  response.write(content);
  response.end();
};

const getWords = (request, response) => {
  respond(request, response, JSON.stringify(wordJson), 200, 'application/json');
};

const addWord = (request, response, body) => {
  const responseJson = {
    message: 'no word entered'
  };

  let newWord;

  //check if there is a word
  if(!body.word || body.word.trim() === '') {
    responseJson.id = 'addWordMissingParam';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }
  else {
    //sanitize word
    newWord = body.word;
    newWord = newWord.trim().toLowerCase();
  }

  //check if character whitelist passes
  if(!letterWhitelist.test(newWord)) {
    responseJson.message = 'word must contain only letters';
    responseJson.id = 'addWordNotOnlyLetters';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }
  //check if character is already in the word
  else if(wordJson.words.includes(newWord)) {
    responseJson.message = 'that word is already in the list';
    responseJson.id = 'addWordNotNewWord';
    return respond(request, response, JSON.stringify(responseJson), 400, 'application/json');
  }

  let responseCode = 201;

  wordJson.words.push(newWord);
  wordJson.words.sort();
  saveToFile(wordListFileName, wordJson);

  responseJson.message = `${newWord} was added to the word list`;
  responseJson.words = wordJson.words;
  return respond(request, response, JSON.stringify(responseJson), responseCode, 'application/json');
};

const notFound = (request, response) => {
  const object = {
    message: 'the page you were looking for was not found',
    id: 'notFound',
  };

  const jsonString = JSON.stringify(object);

  return respond(request, response, jsonString, 404, 'application/json');
};

//code i stole from https://stackoverflow.com/questions/10685998/how-to-update-a-value-in-a-json-file-and-save-it-through-node-js
//before i use firebase to do this instead
const saveToFile = (fileName, content) => {      
  fs.writeFile(fileName, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      return console.log(err);
    }
  });
}

module.exports = {
  getWords,
  addWord,
  notFound,
};
