const path = require("path");
const babel = require("@babel/core");
const PATH_PAGES = path.resolve(__dirname, "..", "demo", "pages");
const PATH_VIEWS = path.resolve(__dirname, "..", "demo", "views");

const pageFile = path.resolve(PATH_VIEWS, "Contact", "index.js");

const x = babel.transformFileSync(pageFile);
console.log(x);
babel.parse;
// console.log(result);
