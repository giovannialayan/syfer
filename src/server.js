const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/main.js': htmlHandler.getMainScript,
  '/tile.js': htmlHandler.getTileComponent,
  '/numpad.js': htmlHandler.getNumPadComponent,
  '/keyboard.js': htmlHandler.getKeyboardComponent,
  '/addWord.html': htmlHandler.getAddWord,
  '/wordAdder.js': htmlHandler.getWordAdderScript,
  '/addWordStyle.css': htmlHandler.getWordAdderStyle,
  '/images/lightBulbDarkTheme.png': htmlHandler.getLightBulbDark,
  '/images/lightBulbLightTheme.png': htmlHandler.getLightBulbLight,
  '/words': responses.getWords,
  '/addWord': responses.addWord,
  '/getUserPrefs': responses.getUserPrefs,
  '/setUserPrefs': responses.setUserPrefs,
  notFound: responses.notFound,
};

const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    parseBody(request, response, urlStruct[parsedUrl.pathname]);
  } else {
    urlStruct.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if(request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
  else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`listening on 127.0.0.1:${port}`);
});
