const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const mainScript = fs.readFileSync(`${__dirname}/../client/main.js`);
const tileComponent = fs.readFileSync(`${__dirname}/../client/numberTile.js`);
const numPadComponent = fs.readFileSync(`${__dirname}/../client/numpad.js`);
const keyboardComponent = fs.readFileSync(`${__dirname}/../client/keyboard.js`);
const addWord = fs.readFileSync(`${__dirname}/../client/addWord.html`);
const wordAdder = fs.readFileSync(`${__dirname}/../client/wordAdder.js`);
const wordAdderStyle = fs.readFileSync(`${__dirname}/../client/addWordStyle.css`);
const lightBlulbDark = fs.readFileSync(`${__dirname}/../client/images/light_bulb_dark_theme.png`);
const lightBlulbLight = fs.readFileSync(`${__dirname}/../client/images/light_bulb_light_theme.png`);
const favicon = fs.readFileSync(`${__dirname}/../client/images/favicon.ico`);
const questionDark = fs.readFileSync(`${__dirname}/../client/images/question_dark_theme.png`);
const questionLight = fs.readFileSync(`${__dirname}/../client/images/question_light_theme.png`);

// respond with a file
const serveFile = (request, response, file, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(file);
  response.end();
};

// get index page
const getIndex = (request, response) => {
  serveFile(request, response, index, 'text/html');
};

// get style for index
const getStyle = (request, response) => {
  serveFile(request, response, style, 'text/css');
};

// get script for index
const getMainScript = (request, response) => {
  serveFile(request, response, mainScript, 'application/javascript');
};

// get tile web component
const getTileComponent = (request, response) => {
  serveFile(request, response, tileComponent, 'application/javascript');
};

// get number pad web component
const getNumPadComponent = (request, response) => {
  serveFile(request, response, numPadComponent, 'application/javascript');
};

// get keyboard web component
const getKeyboardComponent = (request, response) => {
  serveFile(request, response, keyboardComponent, 'application/javascript');
};

// get add word page
const getAddWord = (request, response) => {
  serveFile(request, response, addWord, 'text/html');
};

// get script for add word page
const getWordAdderScript = (request, response) => {
  serveFile(request, response, wordAdder, 'application/javascript');
};

// get style for add word page
const getWordAdderStyle = (request, response) => {
  serveFile(request, response, wordAdderStyle, 'text/css');
};

// get light bulb image for dark theme
const getLightBulbDark = (request, response) => {
  serveFile(request, response, lightBlulbDark, 'image/jpg');
};

// get light bulb image for light theme
const getLightBulbLight = (request, response) => {
  serveFile(request, response, lightBlulbLight, 'image/jpg');
};

// get favicon
const getFavicon = (request, response) => {
  serveFile(request, response, favicon, 'image/x-icon');
};

// get question mark image for dark theme
const getQuestionDark = (request, response) => {
  serveFile(request, response, questionDark, 'image/jpg');
};

// get question mark image for light theme
const getQuestionLight = (request, response) => {
  serveFile(request, response, questionLight, 'image/jpg');
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
  getWordAdderStyle,
  getLightBulbDark,
  getLightBulbLight,
  getFavicon,
  getQuestionDark,
  getQuestionLight,
};
