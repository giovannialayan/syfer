const template = document.createElement("template");
template.innerHTML = `
<style>
#container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    width: 15rem;
}

.number {
    position: relative;
    width: 100%;
    min-width: 50px;
    height: 0;
    padding: .1rem;
    padding-bottom: 100%;
    /*background-color: #333;*/

    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 100%;
    justify-content: center;
    align-items: center;
}

.numberDiv {
    width: 4rem;
    margin: 5px 5px 5px 5px;
}

.numberDiv > button > p {
    /*color: #eee;*/
    font-family: Arial, sans-serif;
    font-size: 2rem;
    margin: 100% 0 0 0;
    text-align: center;
}

#output {
    font-family: Arial, sans-serif;
    text-align: center;
    font-size: 1rem;
    min-height: 1.2em;
}

.darkTheme {
    background-color: #333;
    color: #eee;
}

.lightTheme {
    background-color: #ddd;
    color: #222;
}

.darkThemeText {
    background-color: #000;
    color: #eee;
}

.lightThemeText {
    background-color: #fff;
    color: #222;
}
</style>
<p id='output' class='darkThemeText'></p>
<div id='container'>
<div class='numberDiv'><button class='number darkTheme' id='oneButton'><p>1</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='twoButton'><p>2</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='threeButton'><p>3</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='fourButton'><p>4</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='fiveButton'><p>5</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='sixButton'><p>6</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='sevenButton'><p>7</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='eightButton'><p>8</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='nineButton'><p>9</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='xbutton'><p>x</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='zeroButton'><p>0</p></button></div>
<div class='numberDiv'><button class='number darkTheme' id='enterButton'><p>-></p></button></div>
</div>
`;

class NumberPad extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.oneButton = this.shadowRoot.querySelector('#oneButton');
        this.twoButton = this.shadowRoot.querySelector('#twoButton');
        this.threeButton = this.shadowRoot.querySelector('#threeButton');
        this.fourButton = this.shadowRoot.querySelector('#fourButton');
        this.fiveButton = this.shadowRoot.querySelector('#fiveButton');
        this.sixButton = this.shadowRoot.querySelector('#sixButton');
        this.sevenButton = this.shadowRoot.querySelector('#sevenButton');
        this.eightButton = this.shadowRoot.querySelector('#eightButton');
        this.nineButton = this.shadowRoot.querySelector('#nineButton');
        this.zeroButton = this.shadowRoot.querySelector('#zeroButton');
        this.backButton = this.shadowRoot.querySelector('#xbutton');
        this.enterButton = this.shadowRoot.querySelector('#enterButton');

        this.outputDisplay = this.shadowRoot.querySelector('#output');
        this.output = '';

        this.buttons = this.shadowRoot.querySelectorAll('.number');
    }

    connectedCallback() {
        this.oneButton.onclick = () => {this.modifyOutput('1')};
        this.twoButton.onclick = () => {this.modifyOutput('2')};
        this.threeButton.onclick = () => {this.modifyOutput('3')};
        this.fourButton.onclick = () => {this.modifyOutput('4')};
        this.fiveButton.onclick = () => {this.modifyOutput('5')};
        this.sixButton.onclick = () => {this.modifyOutput('6')};
        this.sevenButton.onclick = () => {this.modifyOutput('7')};
        this.eightButton.onclick = () => {this.modifyOutput('8')};
        this.nineButton.onclick = () => {this.modifyOutput('9')};
        this.zeroButton.onclick = () => {this.modifyOutput('0')};
        this.backButton.onclick = () => {this.modifyOutput('x')};

        this.enterButton.onclick = () => {this.submit()};
        this.render();
    }

    disconnectedCallback() {
        for(const button of this.buttons) {
            button.onclick = null;
        }
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);
        if(attributeName === 'data-theme') {
            if(newVal === 'light') {
                for(const button of this.buttons) {
                    button.classList.replace('darkTheme', 'lightTheme');
                }

                this.outputDisplay.classList.replace('darkThemeText', 'lightThemeText');
            }
            else {
                for(const button of this.buttons) {
                    button.classList.replace('lightTheme', 'darkTheme');
                }

                this.outputDisplay.classList.replace('lightThemeText', 'darkThemeText');
            }
        }
        this.render();
    }

    static get observedAttributes() {
        return ['data-theme'];
    }

    render() {
        this.outputDisplay.textContent = this.output;
    }

    modifyOutput(input) {
        if(input == 'x') {
            this.output = this.output.substring(0, this.output.length - 1);
        }
        else {
            this.output += input;
        }

        this.render();
    }

    submit() {
        if(this.output != '') {
            this.dispatchEvent(new CustomEvent('numberSubmitted', {
                detail: {
                    output: this.output
                }
            }));

            this.output = '';
            this.render();
        }
    }
}

customElements.define("number-pad", NumberPad);