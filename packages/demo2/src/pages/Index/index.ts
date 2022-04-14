import { cmp, html } from "naxt/lib";
import { Title } from "../../components/x-title";
import { Card } from "../../components/x-card";

const IndexPage = cmp(
  ({ setHead }) => html`
  ${setHead(/*html*/ `
    <title>Index</title>
  `)}
  ${Title({ title: "Index" })}
  <div>Hola</div
  ${Card({ title: "Card", text: Title({ title: "Inside" }) })}
`
);

export default IndexPage;
