import { cmp, html } from "naxt/lib";

const Layout = cmp(
  ({ content }) => html`
    <div id="container">
      <nav>
        <a href="/" is="a-link">Index</a>
        <a href="/blog" is="a-link">Blog</a>
      </nav>
      <main id="router">${content}</main>
    </div>
  `
);

export default Layout;
