import {
  __commonJS,
  __toModule
} from "../chunk-BXBWWY2J.js";

// ../naxt/dist/router/Router/Matcher.js
var require_Matcher = __commonJS({
  "../naxt/dist/router/Router/Matcher.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RouterMatcher = void 0;
    var RouterMatcher = class {
      matchRouter(route, routes) {
        let oldMatchRoute = routes.find((route2) => route2.selected);
        let newMatchRoute = this.matchByPath(route, routes) || this.matchByHash(route, routes) || this.matchByQuery(route, routes) || oldMatchRoute;
        if (!newMatchRoute) {
          newMatchRoute = routes[0];
          oldMatchRoute = routes[0];
        } else if (!oldMatchRoute) {
          oldMatchRoute = newMatchRoute;
        }
        return [newMatchRoute, oldMatchRoute];
      }
      matchByPath(route, routes) {
        const matchByPath = routes.find((_route) => _route.pathname === route.pathname);
        return matchByPath;
      }
      matchByHash(route, routes) {
        const matchByHash = routes.find((_route) => _route.hash === route.hash);
        return matchByHash;
      }
      matchByQuery(route, routes) {
        const matchByQuery = routes.find((_route) => {
          const queryData = _route.query;
          const queryKeys = queryData ? Object.keys(queryData) : [];
          return queryKeys.find((queryKey) => {
            const queryValues = queryData[queryKey];
            return queryValues.find((value) => {
              return route.query[queryKey].find((val) => {
                return val === value;
              });
            });
          });
        });
        return matchByQuery;
      }
    };
    exports.RouterMatcher = RouterMatcher;
  }
});

// ../naxt/dist/router/Router/query.js
var require_query = __commonJS({
  "../naxt/dist/router/Router/query.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getQueryString = exports.getQueryData = void 0;
    var getQueryData = (search = window.location.search) => {
      const queryString = search.substring(1);
      return queryString.split("&").reduce((obj, str) => {
        const [key, value] = str.split("=");
        obj[key] = obj[key] || [];
        obj[key].push(value);
        return obj;
      }, {});
    };
    exports.getQueryData = getQueryData;
    var getQueryString = (queryData = {}) => {
      const keys = Object.keys(queryData);
      let query = "";
      if (keys.length > 0) {
        query = "?";
        keys.forEach((key, i) => {
          const values = queryData[key];
          values.forEach((value, z) => {
            query += key + "=" + value;
            const isLast = i === keys.length - 1 && z === values.length - 1;
            if (!isLast) {
              query += "&";
            }
          });
        });
      } else {
        query = window.location.search;
      }
      return query;
    };
    exports.getQueryString = getQueryString;
  }
});

// ../naxt/dist/router/Router/Router.js
var require_Router = __commonJS({
  "../naxt/dist/router/Router/Router.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Router = void 0;
    var Matcher_1 = require_Matcher();
    var query_1 = require_query();
    var Router = class extends Matcher_1.RouterMatcher {
      constructor(routes) {
        super();
        this.routes = routes;
        this.observers = new Set();
      }
      subscribe(fn) {
        this.observers.add(fn);
        return () => this.unsubscribe(fn);
      }
      unsubscribe(fn) {
        this.observers.delete(fn);
      }
      publicate(...args) {
        for (const fn of this.observers) {
          fn(...args);
        }
      }
      push(data) {
        const { state = history.state, title = document.title, pathname = window.location.pathname, hash = window.location.hash.substr(1), query = (0, query_1.getQueryData)() } = data;
        const completeRouterData = {
          state,
          title,
          pathname,
          hash,
          query,
          content: ""
        };
        return this.execPush(completeRouterData);
      }
      execPush(routerData) {
        const [newMatch, oldMatch] = this.matchRouter(routerData, this.routes);
        if (newMatch) {
          if (newMatch !== oldMatch) {
            oldMatch.selected = false;
            newMatch.selected = true;
            const { pathname, hash, query, state, title } = newMatch;
            const search = (0, query_1.getQueryString)(query);
            let url = pathname + search;
            if (hash) {
              url += "#" + hash;
            }
            const routerElement = document.getElementById("naxtRouter");
            if (routerElement)
              routerElement.innerHTML = newMatch.content;
            history.pushState(state, title, url);
            this.publicate(routerData);
          }
          return newMatch;
        }
        return null;
      }
    };
    exports.Router = Router;
  }
});

// ../naxt/dist/router/Router/types.js
var require_types = __commonJS({
  "../naxt/dist/router/Router/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../naxt/dist/router/Router/index.js
var require_Router2 = __commonJS({
  "../naxt/dist/router/Router/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_Router(), exports);
    __exportStar(require_types(), exports);
    __exportStar(require_query(), exports);
  }
});

// ../naxt/dist/router/ALink.js
var require_ALink = __commonJS({
  "../naxt/dist/router/ALink.js"(exports) {
    "use strict";
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _ALink_instances;
    var _ALink_handleClick;
    Object.defineProperty(exports, "__esModule", { value: true });
    var Router_1 = require_Router2();
    var _window = window;
    var routes = _window.ROUTES || [];
    routes.find((route) => {
      var _a, _b;
      let currentPath = window.location.pathname;
      if (currentPath.length > 1) {
        const length = currentPath.length - 1;
        const slashEnded = currentPath[length] === "/";
        console.log(currentPath);
        if (slashEnded) {
          console.log(currentPath);
          currentPath = currentPath.substring(0, length);
          console.log(currentPath);
        }
      }
      const isCurrentPath = route.pathname === currentPath;
      if (isCurrentPath) {
        route.selected = isCurrentPath;
        route.content = ((_a = document.getElementById("naxtRouter")) === null || _a === void 0 ? void 0 : _a.innerHTML) || ((_b = document.getElementById("naxtApp")) === null || _b === void 0 ? void 0 : _b.innerHTML) || "";
      }
      return isCurrentPath;
    });
    var ALink = class extends HTMLAnchorElement {
      constructor() {
        super(...arguments);
        _ALink_instances.add(this);
      }
      get routerData() {
        let state = this.dataset.state ? JSON.parse(this.dataset.state) : {};
        return {
          state,
          title: this.title,
          pathname: this.pathname,
          hash: this.hash.substring(1),
          query: (0, Router_1.getQueryData)(this.search),
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
      ALink.router.push(this.routerData);
    };
    ALink.router = new Router_1.Router(routes);
    customElements.define("a-link", ALink, { extends: "a" });
    _window.ALink = ALink;
  }
});

// src/app/script.js
var import_ALink = __toModule(require_ALink());
