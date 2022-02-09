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
    background-color: #333;

    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 100%;
    justify-content: center;
    align-items: center;
}

p {
    color: #eee;
    font-family: Arial, sans-serif;
    font-size: 2rem;
    margin: 100% 0 0 0;
    text-align: center;
}
</style>
<div>
<p>x</p>
</div>
`;

class NumberTile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.text = this.shadowRoot.querySelector("p");
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
        return ["data-text"];
    }

    render() {
        this.text.textContent = this.getAttribute("data-text") || "x";
    }
}

customElements.define("number-tile", NumberTile);