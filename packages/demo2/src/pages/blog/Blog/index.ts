import { cmp, html } from "daxt/lib";
import { Title } from "../../../components/x-title";
import { Card } from "../../../components/x-card";

const BlogPage = cmp(
  ({ setHead }) => html`
    ${setHead(/*html*/ `
    <title>Blog</title>
    <meta name="description" content="Blog de la aplicación" />
    `)} ${Title({ title: "Blog" })}
    ${Card({ title: "Card", text: Title({ title: "Inside" }) })}
  `
);

export default BlogPage;
