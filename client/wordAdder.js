let statusOutput;
let wordListDiv;
let wordInput;
let submitWordButton;
let homeButton;
let toggleThemeButton;

let darkThemeOn;

window.onload = () => {
  getWordList();
  getUserPrefs();

  statusOutput = document.querySelector('#statusOutput');
  wordListDiv = document.querySelector('#wordList');

  wordInput = document.querySelector('#wordInput');
  submitWordButton = document.querySelector('#submitWord');
  submitWordButton.addEventListener('click', () => {sendPost(wordInput.value)});

  homeButton = document.querySelector('#gotoHomeInput');

  darkThemeOn = true;
  toggleThemeButton = document.querySelector('#toggleThemeButton');
  toggleThemeButton.addEventListener('click', () => {
      toggleTheme([homeButton, submitWordButton], wordListDiv, wordInput, [statusOutput], true);
  });

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
    wordListDiv.lastChild.classList.add(darkThemeOn ? 'darkThemeElement' : 'lightThemeElement');
  }
};

//get word list from server
const getWordList = async () => {
  const response = await fetch('words');
  const json = await response.json();
  const words = json.words;
  displayWordList(words);
}

//toggle dark theme and light theme
const toggleTheme = (buttons, wordListContainer, textInput, textElements, setPref) => {
  if(darkThemeOn) {
      document.body.classList.replace('darkThemeBody', 'lightThemeBody');

      for(const b of buttons) {
          b.classList.replace('darkThemeButton', 'lightThemeButton');
      }

      for(const p of wordListContainer.children) {
          p.classList.replace('darkThemeElement', 'lightThemeElement');
      }

      for(const p of textElements) {
        p.classList.replace('darkThemeText', 'lightThemeText');
      }

      textInput.classList.replace('darkThemeTextInput', 'lightThemeTextInput');

      toggleThemeButton.classList.replace('darkThemeIconButton', 'lightThemeIconButton');
      toggleThemeButton.src = 'images/lightBulbLightTheme.png';
  }
  else {
      document.body.classList.replace('lightThemeBody', 'darkThemeBody');

      for(const b of buttons) {
          b.classList.replace('lightThemeButton', 'darkThemeButton');
      }

      for(const p of wordListContainer.children) {
          p.classList.replace('lightThemeElement', 'darkThemeElement');
      }

      for(const p of textElements) {
        p.classList.replace('lightThemeText', 'darkThemeText');
      }

      textInput.classList.replace('lightThemeTextInput', 'darkThemeTextInput');

      toggleThemeButton.classList.replace('lightThemeIconButton', 'darkThemeIconButton');
      toggleThemeButton.src = 'images/lightBulbDarkTheme.png';
  }

  darkThemeOn = !darkThemeOn;

  if(setPref) {
      setUserPrefs(darkThemeOn ? 'dark' : 'light');
  }
};

const getUserPrefs = async () => {
  const response = await fetch('getUserPrefs');
  const json = await response.json();

  if(json.theme === 'light') {
    toggleTheme([homeButton, submitWordButton], wordListDiv, wordInput, [statusOutput], false);
  }
};

const setUserPrefs = async (theme) => {
  const formData = `theme=${theme}`;

  const response = await fetch('/setUserPrefs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ww-form-urlencoded',
      'Accept': 'application/json',
    },
    body: formData,
  });

  handleUserPrefResponse(response);
};

const handleUserPrefResponse = async (response) => {
  let statusText = '';
  switch(response.status){
      case 200:
          statusText += 'success';
          break;
      
      case 201:
          statusText += 'user added';
          break;
      
      case 204:
          statusText += 'user updated';
          break;
      
      case 400:
          statusText += 'bad request';
          break;
      
      case 404:
          statusText += 'not found';
          break;
      
      default:
          statusText += 'response cot not implemented by the server';
          break;
  }

  const resText = await response.text();

  if(resText) {
      const parsedJson = JSON.parse(resText);
      statusText += parsedJson.message ? `/n${parsedJson.message}` : '';
      statusText += parsedJson.id ? `/n${parsedJson.id}` : '';
  }
  
  console.log(statusText);
};