import { getData } from "../../data";
import { Button } from "../../components/Button/component";

console.log(`
    From Index:
    ${getData()}
`);

console.log(window);

console.log("HOla qué hace");

const btn = Button({}, "Hola xD!!");
document.body.appendChild(btn);
