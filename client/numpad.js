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

}
</style>
<p id='output'></p>
<div id='container'>
<div class='numberDiv'><button class='number darkTheme' id='oneButton'><p>1</p></button></div>
<div class='numberDiv'><button class='number' id='twoButton'><p>2</p></button></div>
<div class='numberDiv'><button class='number' id='threeButton'><p>3</p></button></div>
<div class='numberDiv'><button class='number' id='fourButton'><p>4</p></button></div>
<div class='numberDiv'><button class='number' id='fiveButton'><p>5</p></button></div>
<div class='numberDiv'><button class='number' id='sixButton'><p>6</p></button></div>
<div class='numberDiv'><button class='number' id='sevenButton'><p>7</p></button></div>
<div class='numberDiv'><button class='number' id='eightButton'><p>8</p></button></div>
<div class='numberDiv'><button class='number' id='nineButton'><p>9</p></button></div>
<div class='numberDiv'><button class='number' id='xbutton'><p>x</p></button></div>
<div class='numberDiv'><button class='number' id='zeroButton'><p>0</p></button></div>
<div class='numberDiv'><button class='number' id='enterButton'><p>-></p></button></div>
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
        this.oneButton.onclick = null;
        this.twoButton.onclick = null;
        this.threeButton.onclick = null;
        this.fourButton.onclick = null;
        this.fiveButton.onclick = null;
        this.sixButton.onclick = null;
        this.sevenButton.onclick = null;
        this.eightButton.onclick = null;
        this.nineButton.onclick = null;
        this.zeroButton.onclick = null;
        this.backButton.onclick = null;

        this.enterButton.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes() {
        return [];
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