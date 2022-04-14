import {
  __commonJS,
  __toModule
} from "../chunk-BXBWWY2J.js";

// ../naxt/dist/lib/link.js
var require_link = __commonJS({
  "../naxt/dist/lib/link.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _a;
    var _b;
    var _c;
    var _ALink_instances;
    var _ALink_handleClick;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getQueryData = void 0;
    var getQueryData = (search = window.location.search) => {
      const queryString = search.substring(1);
      const result = queryString.split("&").reduce((obj, str) => {
        const [key, value] = str.split("=");
        obj[key] = obj[key] || [];
        obj[key].push(value);
        return obj;
      }, {});
      delete result[""];
      return result;
    };
    exports.getQueryData = getQueryData;
    var ALink = class extends HTMLAnchorElement {
      constructor() {
        super(...arguments);
        _ALink_instances.add(this);
      }
      static get $router() {
        return document.getElementById("router");
      }
      static navigate(pathname) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!(pages[pathname] && ALink.$router)) {
            const page = yield fetch("/__parts__" + pathname).then((res) => res.ok ? res.json() : {
              html: "Resource not found or Page Not Defined 404",
              dependencies: [],
              heads: []
            });
            page.heads = page.heads.map((head) => head.trim());
            page.html = page.html.trim();
            pages[pathname] = page;
          }
          if (this.$router) {
            this.$router.innerHTML = pages[pathname].html;
            getHeads(pages[pathname].heads.join(""));
          }
        });
      }
      get routerData() {
        let state = this.dataset.state ? JSON.parse(this.dataset.state) : {};
        return {
          state,
          title: this.title,
          pathname: this.pathname,
          hash: this.hash.substring(1),
          query: (0, exports.getQueryData)(this.search),
          content: ""
        };
      }
      connectedCallback() {
        if (this.isConnected) {
          this.addEventListener("click", __classPrivateFieldGet(this, _ALink_instances, "m", _ALink_handleClick));
        }
      }
      disconnectedCallback() {
        this.removeEventListener("click", __classPrivateFieldGet(this, _ALink_instances, "m", _ALink_handleClick));
      }
    };
    _ALink_instances = new WeakSet(), _ALink_handleClick = function _ALink_handleClick2(e) {
      e.preventDefault();
      const { state, title, pathname } = this.routerData;
      ALink.navigate(pathname).then(() => {
        history.pushState(state, title, pathname + window.location.search);
      }).catch(console.error);
    };
    var getHeads = (content = "") => {
      var _a2;
      const start = document.head.querySelector('meta[name="heads-start"]');
      const end = document.head.querySelector('meta[name="heads-end"]');
      const startParts = document.head.innerHTML.split(start.outerHTML);
      const prevHeads = startParts[0];
      const endParts = startParts[1].split(end.outerHTML);
      const postHeads = endParts[1];
      if (content) {
        document.head.innerHTML = prevHeads + '<meta name="heads-start">' + content + '<meta name="heads-end">' + postHeads || "";
      } else {
        const heads = (_a2 = startParts[1]) === null || _a2 === void 0 ? void 0 : _a2.split(end.outerHTML)[0];
        return heads.trim();
      }
    };
    var pages = {
      [location.pathname]: {
        html: ((_a = ALink.$router) === null || _a === void 0 ? void 0 : _a.innerHTML) || "",
        dependencies: ((_c = (_b = document.querySelector("meta[content='dependencies']")) === null || _b === void 0 ? void 0 : _b.getAttribute("content")) === null || _c === void 0 ? void 0 : _c.split(",")) || [],
        heads: [getHeads()]
      }
    };
    customElements.define("a-link", ALink, { extends: "a" });
  }
});

// src/components/x-layout/client.ts
var import_link = __toModule(require_link());
console.log("Client from x-layout");
