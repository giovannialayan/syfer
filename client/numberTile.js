const template = document.createElement("template");
template.innerHTML = `
<style>
div {
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

p {
    font-family: Arial, sans-serif;
    font-size: 2rem;
    margin: 100% 0 0 0;
    text-align: center;
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
</style>
<div class='darkTheme'>
<p>x</p>
</div>
`;

class NumberTile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.text = this.shadowRoot.querySelector("p");
        this.container = this.shadowRoot.querySelector('div');
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);

        if(attributeName === 'data-theme') {
            //change class of this.container
            if(newVal === 'light') {
                this.container.classList.replace('darkTheme', 'lightTheme');
            }
            else {
                this.container.classList.replace('lightTheme', 'darkTheme');
            }
        }
        this.render();
    }

    static get observedAttributes() {
        return ["data-text", 'data-color', 'data-theme'];
    }

    render() {
        this.text.textContent = this.getAttribute("data-text") || 'x';

        switch(this.getAttribute('data-color')) {
            case 'correct':
                this.container.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#0f0' : '#0a0';
                break;

            case 'almost':
                this.container.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#ff0' : '#aa0';
                break;

            default:
                this.container.style.backgroundColor = this.getAttribute('data-theme') === 'light' ? '#ddd' : '#333';
                break;
        }
    }
}

customElements.define("number-tile", NumberTile);