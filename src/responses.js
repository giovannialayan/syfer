const fs = require('fs');

const wordJson = fs.readFileSync(`${__dirname}/../data/words.json`);

const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'content-type': type });
  response.write(content);
  response.end();
};

const getWords = (request, response) => {
  respond(request, response, wordJson, 200, 'application/json');
}

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
  notFound,
};