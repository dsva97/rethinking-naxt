import {
  Title,
  require_lib
} from "../chunk-PDFRZCUN.js";
import {
  __toModule
} from "../chunk-BXBWWY2J.js";

// src/components/x-card/index.ts
var import_lib = __toModule(require_lib());
var tag = "x-card";
var Card = (0, import_lib.cmp)(({ title, text }) => import_lib.html`
  <div>
    ${Title({ title })}
    <span>${text}</span>
  </div>
`)(tag);

// src/components/x-card/client.ts
var XCard = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    if (this.isConnected) {
      this.addEventListener("click", (e) => {
        alert("Hola!");
      });
    }
  }
};
customElements.define(tag, XCard);
