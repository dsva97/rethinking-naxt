const App = ({ content }) => /*html*/ `
<div id="app">
    <header>
        <a href="/" is="a-link">
            <h1>My project</h1>
        </a>
        <nav>
            <a href="/" is="a-link">Home</a>
            <a href="/contact" is="a-link">Contact</a>
        </nav>
    </header>
    <main id="naxtRouter">${content}</main>
    <footer>
        Hecho con pasión en Los Olivos
    </footer>
</div>
`;

export const layout = App;
export const scriptPath = "app/script.js";
export const head = () => /*html*/ `
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
`;

export default {
  layout,
  scriptPath,
  head,
};
