import { cmp, html } from "daxt/lib";
import { Title } from "../../../components/x-title";
import { Card } from "../../../components/x-card";

const PostPage = cmp(
  () => html`
    ${Title({ title: "Post" })}
    ${Card({ title: "Card", text: Title({ title: "Inside" }) })}
  `
);

export default PostPage;
