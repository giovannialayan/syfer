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
    width: 45rem;
}

#midRow {
    width: 40rem;
}

#botRow {
    width: 35rem;
}

.key {
    position: relative;
    width: 100%;
    min-width: 50px;
    height: 0;
    padding: .1rem;
    padding-bottom: 100%;

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

    border-width: 2px;
    border-style: solid;
    border-color: #bbb;
}

.lightTheme {
    background-color: #ddd;
    color: #222;

    border-width: 2px;
    border-style: solid;
    border-color: #555;
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
<div class='container'>
<div id='topRow'>
    <div class='keyDiv' id='q'><button class='key darkTheme'><p>q</p></button></div>
    <div class='keyDiv' id='w'><button class='key darkTheme'><p>w</p></button></div>
    <div class='keyDiv' id='e'><button class='key darkTheme'><p>e</p></button></div>
    <div class='keyDiv' id='r'><button class='key darkTheme'><p>r</p></button></div>
    <div class='keyDiv' id='t'><button class='key darkTheme'><p>t</p></button></div>
    <div class='keyDiv' id='y'><button class='key darkTheme'><p>y</p></button></div>
    <div class='keyDiv' id='u'><button class='key darkTheme'><p>u</p></button></div>
    <div class='keyDiv' id='i'><button class='key darkTheme'><p>i</p></button></div>
    <div class='keyDiv' id='o'><button class='key darkTheme'><p>o</p></button></div>
    <div class='keyDiv' id='p'><button class='key darkTheme'><p>p</p></button></div>
</div>
<div id='midRow'>
    <div class='keyDiv' id='a'><button class='key darkTheme'><p>a</p></button></div>
    <div class='keyDiv' id='s'><button class='key darkTheme'><p>s</p></button></div>
    <div class='keyDiv' id='d'><button class='key darkTheme'><p>d</p></button></div>
    <div class='keyDiv' id='f'><button class='key darkTheme'><p>f</p></button></div>
    <div class='keyDiv' id='g'><button class='key darkTheme'><p>g</p></button></div>
    <div class='keyDiv' id='h'><button class='key darkTheme'><p>h</p></button></div>
    <div class='keyDiv' id='j'><button class='key darkTheme'><p>j</p></button></div>
    <div class='keyDiv' id='k'><button class='key darkTheme'><p>k</p></button></div>
    <div class='keyDiv' id='l'><button class='key darkTheme'><p>l</p></button></div>
</div>
<div id='botRow'>
    <div class='keyDiv' id='z'><button class='key darkTheme'><p>z</p></button></div>
    <div class='keyDiv' id='x'><button class='key darkTheme'><p>x</p></button></div>
    <div class='keyDiv' id='c'><button class='key darkTheme'><p>c</p></button></div>
    <div class='keyDiv' id='v'><button class='key darkTheme'><p>v</p></button></div>
    <div class='keyDiv' id='b'><button class='key darkTheme'><p>b</p></button></div>
    <div class='keyDiv' id='n'><button class='key darkTheme'><p>n</p></button></div>
    <div class='keyDiv' id='m'><button class='key darkTheme'><p>m</p></button></div>
    <div class='keyDiv'><button class='key darkTheme' id='enterButton'><p>-></p></button></div>
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

        this.keys = this.shadowRoot.querySelectorAll('.keyDiv');

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

                for(const key of this.keys) {
                    key.lastChild.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#ddd' : '#333';
                }
                break;

            case 'data-theme':
                if(newVal === 'light') {
                    for(const key of this.keys) {
                        key.lastChild.classList.replace('darkTheme', 'lightTheme');
                        key.lastChild.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#ddd' : '#333';
                    }

                    this.outputDisplay.classList.replace('darkThemeText', 'lightThemeText');
                }
                else {
                    for(const key of this.keys) {
                        key.lastChild.classList.replace('lightTheme', 'darkTheme');
                        key.lastChild.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#ddd' : '#333';
                    }

                    this.outputDisplay.classList.replace('lightThemeText', 'darkThemeText');
                }
                break;
        }
        this.render();
    }

    static get observedAttributes() {
        return ['data-correct', 'data-almost', 'data-wrong', 'data-reset', 'data-theme'];
    }

    render() {
        this.outputDisplay.textContent = this.output;

        for(const letter of this.correctLetters) {
            this.shadowRoot.querySelector(`#${letter}`).lastChild.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#0f0' : '#0a0';
        }

        for(const letter of this.almostLetters) {
            this.shadowRoot.querySelector(`#${letter}`).lastChild.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#ff0' : '#aa0';
        }

        for(const letter of this.wrongLetters) {
            this.shadowRoot.querySelector(`#${letter}`).lastChild.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#f00' : '#a00';
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