const template = document.createElement("template");
template.innerHTML = `
<style>
.container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
}

#topRow, #midRow, #botRow {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}

#topRow {
    width: 50rem;
}

#midRow {
    width: 45rem;
}

#botRow {
    width: 40rem;
}

.key {
    position: relative;
    width: 100%;
    min-width: 50px;
    height: 0;
    padding: .1rem;
    padding-bottom: 100%;
    background-color: #333;

    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 100%;
    justify-content: center;
    align-items: center;
}

.keyDiv {
    width: 6rem;
    margin: 5px 5px 5px 5px;
}

.keyDiv > button > p {
    color: #eee;
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
</style>
<p id='output'></p>
<div class='container'>
<div id='topRow'>
    <div class='keyDiv' id='q'><button class='key'><p>q</p></button></div>
    <div class='keyDiv' id='w'><button class='key'><p>w</p></button></div>
    <div class='keyDiv' id='e'><button class='key'><p>e</p></button></div>
    <div class='keyDiv' id='r'><button class='key'><p>r</p></button></div>
    <div class='keyDiv' id='t'><button class='key'><p>t</p></button></div>
    <div class='keyDiv' id='y'><button class='key'><p>y</p></button></div>
    <div class='keyDiv' id='u'><button class='key'><p>u</p></button></div>
    <div class='keyDiv' id='i'><button class='key'><p>i</p></button></div>
    <div class='keyDiv' id='o'><button class='key'><p>o</p></button></div>
    <div class='keyDiv' id='p'><button class='key'><p>p</p></button></div>
</div>
<div id='midRow'>
    <div class='keyDiv' id='a'><button class='key'><p>a</p></button></div>
    <div class='keyDiv' id='s'><button class='key'><p>s</p></button></div>
    <div class='keyDiv' id='d'><button class='key'><p>d</p></button></div>
    <div class='keyDiv' id='f'><button class='key'><p>f</p></button></div>
    <div class='keyDiv' id='g'><button class='key'><p>g</p></button></div>
    <div class='keyDiv' id='h'><button class='key'><p>h</p></button></div>
    <div class='keyDiv' id='j'><button class='key'><p>j</p></button></div>
    <div class='keyDiv' id='k'><button class='key'><p>k</p></button></div>
    <div class='keyDiv' id='l'><button class='key'><p>l</p></button></div>
</div>
<div id='botRow'>
    <div class='keyDiv' id='z'><button class='key'><p>z</p></button></div>
    <div class='keyDiv' id='x'><button class='key'><p>x</p></button></div>
    <div class='keyDiv' id='c'><button class='key'><p>c</p></button></div>
    <div class='keyDiv' id='v'><button class='key'><p>v</p></button></div>
    <div class='keyDiv' id='b'><button class='key'><p>b</p></button></div>
    <div class='keyDiv' id='n'><button class='key'><p>n</p></button></div>
    <div class='keyDiv' id='m'><button class='key'><p>m</p></button></div>
    <div class='keyDiv'><button class='key' id='enterButton'><p>-></p></button></div>
</div>
</div>
`;

class Keyboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.enterButton = this.shadowRoot.querySelector('#enterButton');

        this.outputDisplay = this.shadowRoot.querySelector('#output');
        this.output = '';

        this.correctLetters = new Array();
        this.almostLetters = new Array();
        this.wrongLetters = new Array();
    }

    connectedCallback() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = () => {
                this.modifyOutput(buttons[i].lastChild.textContent);
            };
        }

        this.enterButton.onclick = () => {this.submit()};
        this.render();
    }

    disconnectedCallback() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = null;
        }
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);
        switch(attributeName) {
            case 'data-correct':
                this.correctLetters.push(newVal);
                if(this.almostLetters.includes(newVal)) {
                    this.almostLetters = this.almostLetters.filter(letter => letter !== newVal);
                }
                break;
            
            case 'data-almost':
                this.almostLetters.push(newVal);
                break;
            
            case 'data-wrong':
                this.wrongLetters.push(newVal);
                break;

            case 'data-reset':
                this.correctLetters = new Array();
                this.almostLetters = new Array();
                this.wrongLetters = new Array();

                const keys = this.shadowRoot.querySelectorAll('.keyDiv');
                for(let i = 0; i < keys.length; i++) {
                    keys[i].style.backgroundColor = '#333';
                    keys[i].lastChild.style.backgroundColor = '#333';
                }
                break;
        }
        this.render();
    }

    static get observedAttributes() {
        return ['data-correct', 'data-almost', 'data-wrong', 'data-reset'];
    }

    render() {
        this.outputDisplay.textContent = this.output;

        for(const letter of this.correctLetters) {
            this.shadowRoot.querySelector(`#${letter}`).style.backgroundColor = '#0a0';
            this.shadowRoot.querySelector(`#${letter}`).lastChild.style.backgroundColor = '#0a0';
        }

        for(const letter of this.almostLetters) {
            this.shadowRoot.querySelector(`#${letter}`).style.backgroundColor = '#aa0';
            this.shadowRoot.querySelector(`#${letter}`).lastChild.style.backgroundColor = '#aa0';
        }

        for(const letter of this.wrongLetters) {
            this.shadowRoot.querySelector(`#${letter}`).style.backgroundColor = '#a00';
            this.shadowRoot.querySelector(`#${letter}`).lastChild.style.backgroundColor = '#a00';
        }
    }

    modifyOutput(input) {
        if(!this.correctLetters.includes(input) && !this.wrongLetters.includes(input)) {
            this.output = input;

            this.render();
        }
    }

    submit() {
        if(this.output != '') {
            this.dispatchEvent(new CustomEvent('letterSubmitted', {
                detail: {
                    output: this.output
                }
            }));

            this.output = '';
            this.render();
        }
    }
}

customElements.define("letter-keyboard", Keyboard);