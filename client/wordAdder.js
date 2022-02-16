let statusOutput;
let wordListDiv;

window.onload = () => {
  getWordList();

  statusOutput = document.querySelector('#statusOutput');
  wordListDiv = document.querySelector('#wordList');

  const wordInput = document.querySelector('#wordInput');
  const submitWordButton = document.querySelector('#submitWord');
  submitWordButton.addEventListener('click', () => {sendPost(wordInput.value)});
}

const sendPost = async (word) => {
  const formData = `word=${word}`;

  const response = await fetch('/addWord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ww-form-urlencoded',
      'Accept': 'application/json',
    },
    body: formData,
  });

  handleResponse(response);
};

const handleResponse = async (response) => {    
  switch(response.status){
    case 200:
      statusOutput.textContent = `success`;
      break;

    case 201:
      statusOutput.textContent = `your word was added`;
      break;

    case 400:
      statusOutput.textContent = `bad request`;
      break;

    case 404:
      statusOutput.textContent = `not found`;
      break;

    default:
      statusOutput.textContent = `response code not implemented by client`;
      break;
  }
  const resText = await response.text();
  const parsedJson = JSON.parse(resText);

  console.log(parsedJson);

  if(parsedJson.message) {
    statusOutput.innerHTML += `<p>${parsedJson.message}</p>`;
  }

  if(parsedJson.words) {
    displayWordList(parsedJson.words);
  }
};

const displayWordList = (wordList) => {
  wordListDiv.innerHTML = '';

  for(const word of wordList) {
    wordListDiv.appendChild(document.createElement('p'));
    wordListDiv.lastChild.textContent = word;
  }
};

//get word list from server
const getWordList = async () => {
  const response = await fetch('words');
  const json = await response.json();
  const words = json.words;
  displayWordList(words);
}