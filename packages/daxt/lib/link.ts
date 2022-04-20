interface Obj {
  [key: string]: string[];
}
interface IQueryData {
  [key: string]: string[];
}

const getCurrentDependencies = () => {
  const dependencies = document.head
    .querySelector('meta[name="dependencies"]')
    ?.getAttribute("content")
    ?.split(",")
    .map((dep) => dep.trim());
  return dependencies || [];
};

const getNoLoaded = (currents: string[], requireds: string[]) => {
  const noLoaded = requireds.filter((required) => !currents.includes(required));
  return noLoaded;
};

export const getQueryData = (
  search: string = window.location.search
): IQueryData => {
  const queryString = search.substring(1);
  const result = queryString.split("&").reduce((obj: Obj, str) => {
    const [key, value] = str.split("=");
    obj[key] = obj[key] || [];
    obj[key].push(value);
    return obj;
  }, {});
  delete result[""];

  return result;
};

class ALink extends HTMLAnchorElement {
  static get $router() {
    return document.getElementById("router");
  }
  static async navigate(pathname: string) {
    if (!(pages[pathname] && ALink.$router)) {
      const page: IPage = await fetch("/__parts__" + pathname).then((res) =>
        res.ok
          ? res.json()
          : {
              html: "Resource not found or Page Not Defined 404",
              dependencies: [],
              heads: [],
            }
      );
      page.heads = page.heads.map((head) => head.trim());
      page.html = page.html.trim();
      const noLoaded = getNoLoaded(getCurrentDependencies(), page.dependencies);
      page.dependencies.forEach((dependency) => {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "/__scripts__/" + dependency + "/client.js";
        document.body.appendChild(script);
      });
      pages[pathname] = page;
    }
    if (this.$router) {
      this.$router.innerHTML = pages[pathname].html;
      getHeads(pages[pathname].heads.join(""));
    }
  }
  #handleClick(e: Event) {
    e.preventDefault();
    const { state, title, pathname } = this.routerData;
    ALink.navigate(pathname)
      .then(() => {
        history.pushState(state, title, pathname + window.location.search);
      })
      .catch(console.error);
  }
  get routerData() {
    let state = this.dataset.state ? JSON.parse(this.dataset.state) : {};

    return {
      state,
      title: this.title,
      pathname: this.pathname,
      hash: this.hash.substring(1),
      query: getQueryData(this.search),
      content: "",
    };
  }
  connectedCallback() {
    if (this.isConnected) {
      this.addEventListener("click", this.#handleClick);
    }
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.#handleClick);
  }
}

const convertToNodes = (content: string): [Element[], Function] => {
  const tmpContainer = document.createElement("div");
  tmpContainer.innerHTML = content;
  const children = [...tmpContainer.children];
  const cleanTmp = () => tmpContainer.remove();
  return [children, cleanTmp];
};

const clean = (start: Element, end: Element) => {
  const isEnd = (node: Element) => node === end;

  while (start.nextElementSibling && !isEnd(start.nextElementSibling)) {
    start.nextElementSibling.remove();
  }
};

const getHeads = (content: string = "") => {
  const start = document.head.querySelector('meta[name="heads-start"]');
  const end = document.head.querySelector('meta[name="heads-end"]');
  const startParts = document.head.innerHTML.split(start!.outerHTML);

  if (start && end) {
    if (content) {
      clean(start, end!);
      const [children, cleanTmp] = convertToNodes(content);
      children.forEach((child) => {
        start.insertAdjacentElement("afterend", child);
      });
      cleanTmp();
    } else {
      const heads = startParts[1]?.split(end!.outerHTML)[0];
      return heads.trim();
    }
  }
};

interface IPage {
  html: string;
  dependencies: string[];
  heads: string[];
}
const pages: { [route: string]: IPage } = {
  [location.pathname]: {
    html: ALink.$router?.innerHTML || "",
    dependencies:
      document
        .querySelector("meta[content='dependencies']")
        ?.getAttribute("content")
        ?.split(",") || [],
    heads: [getHeads() as string],
  },
};

customElements.define("a-link", ALink, { extends: "a" });
