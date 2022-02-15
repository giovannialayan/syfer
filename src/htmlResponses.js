const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const mainScript = fs.readFileSync(`${__dirname}/../client/main.js`);
const tileComponent = fs.readFileSync(`${__dirname}/../client/numberTile.js`);
const numPadComponent = fs.readFileSync(`${__dirname}/../client/numpad.js`);
const keyboardComponent = fs.readFileSync(`${__dirname}/../client/keyboard.js`);
const addWord = fs.readFileSync(`${__dirname}/../client/addWord.html`);
const wordAdder = fs.readFileSync(`${__dirname}/../client/wordAdder.js`);

const serveFile = (request, response, file, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(file);
  response.end();
};

const getIndex = (request, response) => {
  serveFile(request, response, index, 'text/html');
};

const getStyle = (request, response) => {
  serveFile(request, response, style, 'text/css');
};

const getMainScript = (request, response) => {
  serveFile(request, response, mainScript, 'application/javascript');
};

const getTileComponent = (request, response) => {
  serveFile(request, response, tileComponent, 'application/javascript');
};

const getNumPadComponent = (request, response) => {
  serveFile(request, response, numPadComponent, 'application/javascript');
};

const getKeyboardComponent = (request, response) => {
  serveFile(request, response, keyboardComponent, 'application/javascript');
};

const getAddWord = (request, response) => {
  serveFile(request, response, addWord, 'text/html');
};

const getWordAdderScript = (request, response) => {
  serveFile(request, response, wordAdder, 'application/javascript');
};

module.exports = {
  getIndex,
  getStyle,
  getMainScript,
  getTileComponent,
  getNumPadComponent,
  getKeyboardComponent,
  getAddWord,
  getWordAdderScript,
};
