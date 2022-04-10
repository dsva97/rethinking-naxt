import {
  getData
} from "../../chunk-G4HVRFL3.js";
import "../../chunk-BXBWWY2J.js";

// src/components/Button/template.js
var Button = (_props = {}, children = "") => `
<button>${children}</button>
`;

// src/components/Button/component.js
var Button2 = (props, children) => {
  const fragment = document.createDocumentFragment();
  const template = document.createElement("template");
  template.innerHTML = Button(props, children);
  fragment.appendChild(template.content.cloneNode(true));
  template.remove();
  return fragment;
};

// src/views/Index/script.js
console.log(`
    From Index:
    ${getData()}
`);
console.log(window);
console.log("HOla qu\xE9 hace");
var btn = Button2({}, "Hola xD!!");
document.body.appendChild(btn);
