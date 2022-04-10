import { RouterMatcher } from "./Matcher";
import { IRouterData } from "./types";
import { getQueryData, getQueryString } from "./query";

export class Router extends RouterMatcher {
  observers = new Set<Function>();

  constructor(public routes: IRouterData[]) {
    super();
  }

  subscribe(fn: Function) {
    this.observers.add(fn);
    return () => this.unsubscribe(fn);
  }
  unsubscribe(fn: Function) {
    this.observers.delete(fn);
  }
  publicate(...args: any[]) {
    for (const fn of this.observers) {
      fn(...args);
    }
  }

  push(data: Partial<IRouterData>): IRouterData | null {
    const {
      state = history.state,
      title = document.title,
      pathname = window.location.pathname,
      hash = window.location.hash.substr(1),
      query = getQueryData(),
    } = data;

    const completeRouterData = {
      state,
      title,
      pathname,
      hash,
      query,
      content: "",
    };

    return this.execPush(completeRouterData);
  }

  private execPush(routerData: IRouterData): IRouterData | null {
    const [newMatch, oldMatch] = this.matchRouter(routerData, this.routes);

    if (newMatch) {
      if (newMatch !== oldMatch) {
        oldMatch.selected = false;
        newMatch.selected = true;

        const { pathname, hash, query, state, title } = newMatch;

        const search = getQueryString(query);

        let url = pathname + search;
        if (hash) {
          url += "#" + hash;
        }
        const routerElement = document.getElementById("naxtRouter");
        if (routerElement) routerElement.innerHTML = newMatch.content;
        history.pushState(state, title, url);
        this.publicate(routerData);
      }
      return newMatch;
    }

    // push to 404 Not Found
    return null;
  }
}
