import { Request, Response, Handler, Router } from "express";
import { buildPage } from "./server";

interface IGetLayoutParam {
  lastHead?: string;
  lastBody?: string;
  layout?: (content: string) => string;
  content?: string;
  dependencies?: string[];
}

export const getLayout = ({
  lastHead = "",
  layout = (content: string) => content,
  lastBody = "",
  content = "",
  dependencies = [],
}: IGetLayoutParam) => {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="dependencies" content="${dependencies.join(",")}" />
      <meta name="heads-start" />${lastHead}<meta name="heads-end" />
      <link rel="stylesheet" href="/tailwind.css" />
    </head>
    <body>
      <div id="_app">${layout(content)}</div>
      ${lastBody}
    </body>
    </html>
    `;
};

const getHtml = (page: IRouter, layout?: (content: string) => string) => {
  const dependencies = Array.from(page.dependencies).concat(
    layout ? ["x-layout"] : []
  );
  const lastBody = dependencies
    .map(
      (dependency) =>
        `<script src="/__scripts__/${dependency}/client.js" type="module"></script>`
    )
    .join("");
  const content = page.html;
  const lastHead = Array.from(page.heads).join("");
  const html = getLayout({ lastBody, content, layout, dependencies, lastHead });
  return html;
};

interface IRouter {
  tag: string;
  dependencies: Set<string> | string[];
  html: string;
  heads: Set<string> | string[];
}

interface IRouters {
  [key: string]:
    | IRouter
    | Handler
    | ((req: Request, res: Response) => IRouter | Promise<IRouter>);
}

const routerSetToArray = (router: IRouter) => {
  return {
    ...router,
    heads: Array.from(router.heads),
    dependencies: Array.from(router.dependencies),
  };
};

export type INaxtRouters = IRouters;

export const naxtRouter = (
  routers: IRouters,
  layout?: (content: string) => string
) => {
  const appRouter = Router();

  if (!layout) {
    layout = (content: string) => content;
  }

  for (const route in routers) {
    let page = routers[route];

    let html = "";

    if (typeof page === "object") {
      page = routerSetToArray(page);

      html = getHtml(page, layout);

      appRouter.get("/_" + route, (_req, res) => {
        res.json(page);
      });

      const pathHtml = route + (route === "/" ? "" : "/") + "index.html";
      buildPage(pathHtml, html);
      buildPage(pathHtml, JSON.stringify(page, null, 3), true);
    }

    appRouter.get(route, async (req, res, next) => {
      if (typeof page === "object") {
        res.send(html);
      } else {
        const voidOrRouter = await page(req, res, next);
        if (voidOrRouter) {
          const router = routerSetToArray(voidOrRouter);
          const html = getHtml(router, layout);
          res.send(html);
        }
      }
    });
  }

  return appRouter;
};
