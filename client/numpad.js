const template = document.createElement("template");
template.innerHTML = `
<style>
#container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    width: 26rem;
}

.number {
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

.numberDiv {
    width: 6rem;
    margin: 5px 5px 5px 5px;
}

p {
    color: #eee;
    font-family: Arial, sans-serif;
    font-size: 2rem;
    margin: 100% 0 0 0;
    text-align: center;
}
</style>
<div id='container'>
<div class='numberDiv'><button class='number'><p>1</p></button></div>
<div class='numberDiv'><button class='number'><p>2</p></button></div>
<div class='numberDiv'><button class='number'><p>3</p></button></div>
<div class='numberDiv'><button class='number'><p>4</p></button></div>
<div class='numberDiv'><button class='number'><p>5</p></button></div>
<div class='numberDiv'><button class='number'><p>6</p></button></div>
<div class='numberDiv'><button class='number'><p>7</p></button></div>
<div class='numberDiv'><button class='number'><p>8</p></button></div>
<div class='numberDiv'><button class='number'><p>9</p></button></div>
<div class='numberDiv'><button class='number'><p>0</p></button></div>
</div>
`;

class NumberPad extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        
    }

    connectedCallback() {
        
        this.render();
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes() {
        return [];
    }

    render() {
        
    }
}

customElements.define("number-pad", NumberPad);