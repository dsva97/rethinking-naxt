import { Router, getQueryData, IRouterData } from "./Router";

const _window = window as unknown as Window & {
  ROUTES: IRouterData[];
  ALink: any;
};
const routes: IRouterData[] = _window.ROUTES || [];

routes.find((route) => {
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
    route.content =
      document.getElementById("naxtRouter")?.innerHTML ||
      document.getElementById("naxtApp")?.innerHTML ||
      "";
  }
  return isCurrentPath;
});

class ALink extends HTMLAnchorElement {
  static router = new Router(routes);
  #handleClick(e: Event) {
    e.preventDefault();
    ALink.router.push(this.routerData);
  }
  get routerData(): IRouterData {
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

customElements.define("a-link", ALink, { extends: "a" });

_window.ALink = ALink;
