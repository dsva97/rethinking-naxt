var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// ../naxt/dist/lib/index.js
var require_lib = __commonJS({
  "../naxt/dist/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.html = exports.cmp = void 0;
    var isStrOrNumber = (value, key) => (typeof value === "string" || typeof value === "number") && (key ? typeof key === "string" || typeof key === "number" : true);
    var cmp2 = (execHtml) => {
      return function(tag2 = "") {
        return function(props) {
          let { html: html3, dependencies } = execHtml(props);
          if (!globalThis.fetch && tag2) {
            const attr = Object.entries(props).map(([key, value]) => isStrOrNumber(value) ? ` ${key}="${value}"` : "").join("");
            html3 = `<${tag2}${attr}>${html3}</${tag2}>`;
          }
          return { tag: tag2, dependencies, html: html3 };
        };
      };
    };
    exports.cmp = cmp2;
    var html2 = (...fragments) => {
      const parts = [...fragments.shift()];
      let html3 = parts === null || parts === void 0 ? void 0 : parts.shift();
      let dependencies = new Set();
      for (let i = 0; i < parts.length; i++) {
        let fragment = fragments[i] || "";
        const part = parts[i];
        if (fragment === null || fragment === void 0 ? void 0 : fragment.tag) {
          dependencies.add(fragment.tag);
          dependencies = new Set([...dependencies, ...fragment.dependencies]);
          fragment = fragment.html;
        }
        html3 += fragment + part;
      }
      return {
        dependencies,
        html: html3
      };
    };
    exports.html = html2;
  }
});

// src/components/x-title/index.ts
var import_lib = __toModule(require_lib());

// esbuild-css-modules-plugin-namespace:/tmp/tmp-92392-espLaG7afdrZ/demo2/src/components/x-title/style.module.css.js
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
  __toModule,
  require_lib,
  tag,
  Title
};
