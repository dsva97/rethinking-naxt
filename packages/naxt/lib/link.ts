interface Obj {
  [key: string]: string[];
}
interface IQueryData {
  [key: string]: string[];
}

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
      const page: IPage = await fetch("/_" + pathname).then((res) =>
        res.ok
          ? res.json()
          : {
              html: "Resource not found or Page Not Defined 404",
              dependencies: [],
              heads: [],
            }
      );
      page.heads = page.heads.map((head) => head.trim());
      pages[pathname] = page;
    }
    if (this.$router) {
      this.$router.innerHTML = pages[pathname].html;
      console.log(pages);
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

const getHeads = (content: string = "") => {
  const start = document.head.querySelector('meta[name="heads-start"]');
  const end = document.head.querySelector('meta[name="heads-end"]');
  const startParts = document.head.innerHTML.split(start!.outerHTML);
  const prevHeads = startParts[0];

  const endParts = startParts[1].split(end!.outerHTML);
  const postHeads = endParts[1];

  if (content) {
    document.head.innerHTML =
      prevHeads +
        '<meta name="heads-start">' +
        content +
        '<meta name="heads-end">' +
        postHeads || "";
  } else {
    const heads = startParts[1]?.split(end!.outerHTML)[0];
    return heads.trim();
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
