const statusOutput;
const wordListDiv;

window.onload = () => {
    statusOutput = document.querySelector('#statusOutput');
    wordListDiv = document.querySelector('#wordList');
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
        statusOutput.innerHTML = `your word was added`;
        break;

      case 400:
        statusOutput.innerHTML = `bad request`;
        break;

      case 404:
        statusOutput.innerHTML = `not found`;
        break;

      default:
        statusOutput.innerHTML = `<b>response code not implemented by client</b>`;
        break;
    }

    if(parseResponse) {
      const resText = await response.text();
      const parsedJson = JSON.parse(resText);

      console.log(parsedJson);

      if(parsedJson.message) {
        statusOutput.textContent += `${parsedJson.message}`;
      }

      if(parsedJson.words) {
        for(const word of parsedJson.words) {
            wordListDiv.appendChild(document.createElement('p'));
            wordListDiv.lastChild.textContent = word;
        }
      }
    }
  };