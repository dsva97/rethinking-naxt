import {
  __commonJS,
  __toModule
} from "./chunk-BXBWWY2J.js";

// ../naxt/dist/lib/index.js
var require_lib = __commonJS({
  "../naxt/dist/lib/index.js"(exports) {
    "use strict";
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.html = exports.cmp = void 0;
    var isStrOrNumber = (value, key) => (typeof value === "string" || typeof value === "number") && (key ? typeof key === "string" || typeof key === "number" : true);
    var cmp2 = (execHtml) => {
      return function(tag2 = "") {
        return function(props) {
          let heads = new Set();
          const setHead = (string = "") => {
            heads.add(string);
            return "";
          };
          let _a = execHtml(Object.assign(Object.assign({}, props), { setHead })), { html: html3, dependencies } = _a, res = __rest(_a, ["html", "dependencies"]);
          heads = new Set(Array.from([...heads, ...res.heads]));
          if (!globalThis.fetch && tag2) {
            const attr = Object.entries(props).map(([key, value]) => isStrOrNumber(value) ? ` ${key}="${value}"` : "").join("");
            html3 = `<${tag2}${attr}>${html3}</${tag2}>`;
          }
          return { tag: tag2, dependencies, html: html3, heads };
        };
      };
    };
    exports.cmp = cmp2;
    var html2 = (...fragments) => {
      const parts = [...fragments.shift()];
      let html3 = parts === null || parts === void 0 ? void 0 : parts.shift();
      let dependencies = new Set();
      let heads = new Set();
      for (let i = 0; i < parts.length; i++) {
        let fragment = fragments[i] || "";
        const part = parts[i];
        if (fragment === null || fragment === void 0 ? void 0 : fragment.tag) {
          dependencies.add(fragment.tag);
          dependencies = new Set([
            ...dependencies,
            ...fragment.dependencies
          ]);
          fragment = fragment.html;
        }
        if (fragment.heads) {
          heads = new Set([...heads, ...fragment.heads]);
        }
        html3 += fragment + part;
      }
      return {
        dependencies,
        html: html3,
        heads
      };
    };
    exports.html = html2;
  }
});

// src/components/x-title/index.ts
var import_lib = __toModule(require_lib());

// esbuild-css-modules-plugin-namespace:/tmp/tmp-68043-6Sb1qgv4u3C6/demo2/src/components/x-title/style.module.css.js
var digest = "6bf6be122b527654e107dbd0519b44d7511336a84a631eb975ee521b0cfe8226";
var css = `._title_gygqx_1 {
    color: blue;
}`;
(function() {
  if (!document.getElementById(digest)) {
    var el = document.createElement("style");
    el.id = digest;
    el.textContent = css;
    document.head.appendChild(el);
  }
})();
var style_module_css_default = { "title": "_title_gygqx_1" };

// src/components/x-title/index.ts
var tag = "x-title";
var Title = (0, import_lib.cmp)(({ title }) => import_lib.html`
  <h1 class="${style_module_css_default.title}">${title}</h1>
`)(tag);

export {
  require_lib,
  tag,
  Title
};
