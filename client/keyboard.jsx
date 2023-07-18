const React = require('react');
const ReactDom = require('react-dom');

let correctLetters = new Array();
let almostLetters = new Array();
let wrongLetters = new Array();
let output = '';
let darkThemeOn = true;
let parentDiv;

const Keyboard = (props) => {
    const getLetterClass = (letter) => {
        if(props.darkThemeOn) {
            if(correctLetters.includes(letter)) {
                return 'correctLetterDarkTheme';
            } 
            else if(almostLetters.includes(letter)) {
                return 'almostLetterDarkTheme';
            } 
            else if(wrongLetters.includes(letter)) {
                return 'wrongLetterDarkTheme';
            } 
            else {
                return 'notSelectedLetterDarkTheme';
            }
        }
        else {
            if(correctLetters.includes(letter)) {
                return 'correctLetterLightTheme';
            } 
            else if(almostLetters.includes(letter)) {
                return 'almostLetterLightTheme';
            } 
            else if(wrongLetters.includes(letter)) {
                return 'wrongLetterLightTheme';
            } 
            else {
                return 'notSelectedLetterLightTheme';
            }
        }
    };

    const getKey = (keyName, darkThemeOnKey) => {
        return(
            <div className='keyDiv' id={keyName}>
                <button className={'key ' + (darkThemeOnKey ? 'darkThemeKey ' : 'lightThemeKey ') + getLetterClass(keyName)} onClick={() => {modifyOutput(keyName);}}>
                    <p>{keyName}</p>
                </button>
            </div>
        );
    };

    return(
        <section>
            <p id='output' className={props.darkThemeOn ? 'darkThemeText' : 'lightThemeText'}>{output}</p>
            <div className='keyboardContainer desktop'>
                <div id='topRow'>
                    {getKey('q', props.darkThemeOn)}
                    {getKey('w', props.darkThemeOn)}
                    {getKey('e', props.darkThemeOn)}
                    {getKey('r', props.darkThemeOn)}
                    {getKey('t', props.darkThemeOn)}
                    {getKey('y', props.darkThemeOn)}
                    {getKey('u', props.darkThemeOn)}
                    {getKey('i', props.darkThemeOn)}
                    {getKey('o', props.darkThemeOn)}
                    {getKey('p', props.darkThemeOn)}
                </div>
                <div id='midRow'>
                    {getKey('a', props.darkThemeOn)}
                    {getKey('s', props.darkThemeOn)}
                    {getKey('d', props.darkThemeOn)}
                    {getKey('f', props.darkThemeOn)}
                    {getKey('g', props.darkThemeOn)}
                    {getKey('h', props.darkThemeOn)}
                    {getKey('j', props.darkThemeOn)}
                    {getKey('k', props.darkThemeOn)}
                    {getKey('l', props.darkThemeOn)}
                </div>
                <div id='botRow'>
                    {getKey('z', props.darkThemeOn)}
                    {getKey('x', props.darkThemeOn)}
                    {getKey('c', props.darkThemeOn)}
                    {getKey('v', props.darkThemeOn)}
                    {getKey('b', props.darkThemeOn)}
                    {getKey('n', props.darkThemeOn)}
                    {getKey('m', props.darkThemeOn)}
                    <div className='keyDiv'><button className={'key ' + (props.darkThemeOn ? 'darkThemeKey' : 'lightThemeKey')} id='enterButton' onClick={submit}><p>-{'>'}</p></button></div>
                </div>
            </div>
            <div className='keyboardContainer mobile'>
                <div id='topRow'>
                    
                </div>
                <div id='midRow'>

                </div>
                <div id='botRow'>

                </div>
            </div>
        </section>
    );
};

//change output letter if it wasnt correctly or incorrectly guessed already
const modifyOutput = (keyName) => {
    if(!correctLetters.includes(keyName) && !wrongLetters.includes(keyName)) {
        output = keyName;
        render(darkThemeOn);
    }
};

//dispatch event for enter button pressed with chosen letter
const submit = () => {
    if(output != '') {
        parentDiv.dispatchEvent(new CustomEvent('letterSubmitted', {
            detail: {
                output: output
            }
        }));

        output = '';
        render(darkThemeOn);
    }
};

const setLetter = (letter, type) => {
    switch(type) {
        case 'correct':
            correctLetters.push(letter);
            if(almostLetters.includes(letter)) {
                almostLetters = almostLetters.filter(almostLetter => almostLetter !== letter);
            }
            break;

        case 'almost':
            almostLetters.push(letter);
            break;

        case 'wrong':
            wrongLetters.push(letter);
            break;
    };

    render(darkThemeOn);
};

const reset = () => {
    correctLetters = new Array();
    almostLetters = new Array();
    wrongLetters = new Array();
    output = '';
    render(darkThemeOn);
};

const render = (darkThemeOnInput) => {
    darkThemeOn = darkThemeOnInput;
    
    ReactDom.render(
        <Keyboard darkThemeOn={darkThemeOn}/>,
        parentDiv
    );
};


const init = (parentDivInput, darkThemeOnInput) => {
    parentDiv = parentDivInput;
    render(darkThemeOnInput);
};

module.exports = {
    render,
    setLetter,
    reset,
    modifyOutput,
    submit,
    init,
};