import { tag } from ".";

class XCard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    if(this.isConnected) {
      this.addEventListener('click', e => {
        alert("Hola!")
      })
    }
  }
}

customElements.define(tag, XCard);
