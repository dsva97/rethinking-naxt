import { cmp, html } from "naxt/lib";
import { Title } from "../../../components/x-title";
import { Card } from "../../../components/x-card";

const BlogPage = cmp(
  ({ setHead }) => html`
    ${setHead(/*html*/ `
    <title>Blog</title>
    `)} ${Title({ title: "Blog" })}
    ${Card({ title: "Card", text: Title({ title: "Inside" }) })}
  `
);

export default BlogPage;
