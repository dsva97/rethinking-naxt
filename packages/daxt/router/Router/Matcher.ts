import { IRouterData } from "./types";

type INewOldMatches = [IRouterData, IRouterData];

export class RouterMatcher {
  matchRouter(route: IRouterData, routes: IRouterData[]): INewOldMatches {
    // 1) pathname
    // 2) hash
    // 3) query
    let oldMatchRoute = routes.find((route) => route.selected);

    let newMatchRoute: IRouterData | undefined =
      this.matchByPath(route, routes) ||
      this.matchByHash(route, routes) ||
      this.matchByQuery(route, routes) ||
      oldMatchRoute;

    if (!newMatchRoute) {
      newMatchRoute = routes[0];
      oldMatchRoute = routes[0];
    } else if (!oldMatchRoute) {
      oldMatchRoute = newMatchRoute;
    }

    return [newMatchRoute, oldMatchRoute];
  }

  matchByPath(route: IRouterData, routes: IRouterData[]) {
    const matchByPath = routes.find(
      (_route) => _route.pathname === route.pathname
    );
    return matchByPath;
  }
  matchByHash(route: IRouterData, routes: IRouterData[]) {
    const matchByHash = routes.find((_route) => _route.hash === route.hash);
    return matchByHash;
  }
  matchByQuery(route: IRouterData, routes: IRouterData[]) {
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
}
