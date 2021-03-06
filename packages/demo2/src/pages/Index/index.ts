import { cmp, html } from "daxt/lib";

const IndexPage = cmp(
  ({ setHead }) => html`
    ${setHead(/*html*/ `
    <title>Index</title>
    <meta name="description" content="Inicio de la aplicación" />
  `)}
    <div>Hola</div>
  `
);

export default IndexPage;
