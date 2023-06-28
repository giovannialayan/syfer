let toggleThemeButton;
let dailyLink;
let playLink;
let challengesLink;
let title;
let darkThemeOn;

window.onload = () => {
    getUserPrefs();

    title = document.querySelector('#title')
    dailyLink = document.querySelector('#dailyLink');
    playLink = document.querySelector('#playLink');
    // challengesLink = document.querySelector('#challengesLink');

    darkThemeOn = true;
    toggleThemeButton = document.querySelector('#toggleThemeButton');
    toggleThemeButton.addEventListener('click', () => {
        toggleTheme([dailyLink, playLink], title, true);
    });
}

//toggle dark theme and light theme
const toggleTheme = (links, setPref) => {
    if(darkThemeOn) {
        document.body.classList.replace('darkThemeBody', 'lightThemeBody');
  
        // for(const b of buttons) {
        //     b.classList.replace('darkThemeButton', 'lightThemeButton');
        // }
  
        // for(const p of wordListContainer.children) {
        //     p.classList.replace('darkThemeElement', 'lightThemeElement');
        // }
  
        // for(const p of textElements) {
        //   p.classList.replace('darkThemeText', 'lightThemeText');
        // }
  
        // for(const t of textInputs) {
        //   t.classList.replace('darkThemeTextInput', 'lightThemeTextInput');
        // }

        for(const l of links) {
            l.classList.replace('darkThemeLink', 'lightThemeLink');
        }

        title.classList.replace('darkThemeTitle', 'lightThemeTitle');
  
        toggleThemeButton.src = '/assets/images/lightBulbLightTheme.png';
    }
    else {
        document.body.classList.replace('lightThemeBody', 'darkThemeBody');
  
        // for(const b of buttons) {
        //     b.classList.replace('lightThemeButton', 'darkThemeButton');
        // }
  
        // for(const p of wordListContainer.children) {
        //     p.classList.replace('lightThemeElement', 'darkThemeElement');
        // }
  
        // for(const p of textElements) {
        //   p.classList.replace('lightThemeText', 'darkThemeText');
        // }
  
        // for(const t of textInputs) {
        //   t.classList.replace('lightThemeTextInput', 'darkThemeTextInput');
        // }

        for(const l of links) {
            l.classList.replace('lightThemeLink', 'darkThemeLink');
        }

        title.classList.replace('lightThemeTitle', 'darkThemeTitle');
  
        toggleThemeButton.src = '/assets/images/lightBulbDarkTheme.png';
    }
  
    darkThemeOn = !darkThemeOn;
  
    if(setPref) {
        setUserPrefs(darkThemeOn ? 'dark' : 'light');
    }
  };
  
  //get user preferences from the server and change the page to match them
  const getUserPrefs = async () => {
    const response = await fetch('getUser');
    const json = await response.json();
  
    if(json.theme === 'light') {
      toggleTheme([dailyLink, playLink], title, false);
    }
  };
  
  //send user preferences to the server
  const setUserPrefs = async (theme) => {
    const formData = `theme=${theme}`;
  
    const response = await fetch('/setUserPrefs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
    });
  
    handleUserPrefResponse(response);
  };
  
  //handle response from setting user preferences
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
        statusText += parsedJson.message ? `\n${parsedJson.message}` : '';
        statusText += parsedJson.id ? `\n${parsedJson.id}` : '';
    }
    
    console.log(statusText);
  };