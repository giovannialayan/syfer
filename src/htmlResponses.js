const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const mainScript = fs.readFileSync(`${__dirname}/../client/main.js`);
const tileComponent = fs.readFileSync(`${__dirname}/../client/numberTile.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const getMainScript = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(mainScript);
  response.end();
};

const getTileComponent = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(tileComponent);
  response.end();
};

module.exports = {
  getIndex,
  getStyle,
  getMainScript,
  getTileComponent,
};
