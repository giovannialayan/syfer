const React = require('react');
const ReactDOM = require('react-dom');

let output = '';
let darkThemeOn = true;
let parentDiv

const Numpad = (props) => {
    const getNumKey = (number, numberWord, darkThemeOnKey) => {
        return(
            <div className='numberDiv'>
                <button className={'number ' + (darkThemeOnKey ? 'darkThemeNum' : 'lightThemeNum')} id={numberWord + 'Button'} onClick={() => {modifyOutput(number)}}>
                    <p>{number}</p>
                </button>
            </div>
        );
    };

    return (
        <section>
            <p id='output' className={props.darkThemeOn ? 'darkThemeText' : 'lightThemeText'}>{output}</p>
            <div className='numpadContainer'>
                {getNumKey(1, 'one', props.darkThemeOn)}
                {getNumKey(2, 'two', props.darkThemeOn)}
                {getNumKey(3, 'three', props.darkThemeOn)}
                {getNumKey(4, 'four', props.darkThemeOn)}
                {getNumKey(5, 'five', props.darkThemeOn)}
                {getNumKey(6, 'six', props.darkThemeOn)}
                {getNumKey(7, 'seven', props.darkThemeOn)}
                {getNumKey(8, 'eight', props.darkThemeOn)}
                {getNumKey(9, 'nine', props.darkThemeOn)}
                {getNumKey('x', 'x', props.darkThemeOn)}
                {getNumKey(0, 'zero', props.darkThemeOn)}
                <div className='numberDiv'>
                    <button className={'number ' + (props.darkThemeOn ? 'darkThemeNum' : 'lightThemeNum')} id='enterButton' onClick={submit}>
                        <p>-{'>'}</p>
                    </button>
                </div>
            </div>
        </section>
    );
};

//change output to input number or remove last number if x was pressed
const modifyOutput = (input) => {
    if(input == 'x') {
        output = output.substring(0, output.length - 1);
    }
    else {
        output += input;
    }

    render(darkThemeOn);
}

//dispatch event for enter pressed with number as output
const submit = () => {
    if(output != '') {
        parentDiv.dispatchEvent(new CustomEvent('numberSubmitted', {
            detail: {
                output: output
            }
        }));

        output = '';
        render(darkThemeOn);
    }
}

const render = (darkThemeOnInput)   => {
    darkThemeOn = darkThemeOnInput;

    ReactDOM.render(
        <Numpad darkThemeOn={darkThemeOnInput}/>,
        parentDiv
    );
};

const init = (parentDivInput, darkThemeOnInput) => {
    parentDiv = parentDivInput;
    render(darkThemeOnInput);
};

module.exports = {
    render,
    init,
    modifyOutput,
    submit,
};