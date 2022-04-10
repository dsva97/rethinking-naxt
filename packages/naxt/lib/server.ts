import path, { dirname } from "path";
import fs from "fs";
import { build as esbuild } from "esbuild";
import CssModulesPlugin from "esbuild-css-modules-plugin";
import { Request, Response, Handler, Router } from "express";

export const layout = ({ lastHead = "", lastBody = "", content = "" }) => {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      ${lastHead}
    </head>
    <body>
      <div id="_app">${content}</div>
      ${lastBody}
    </body>
    </html>
    `;
};

const fileName = require?.main?.filename;
let srcDir = ''
if(fileName) {
  srcDir = dirname(fileName)
} else {
  throw new Error("require?.main?.filename is not defined")
}

const rootProject = path.resolve(srcDir, "..");
const srcComponents = path.resolve(rootProject, "src", "components");
const distComponents = path.resolve(rootProject, "dist", "components");

let pathClientFiles: string[];

try {
  pathClientFiles = fs
  .readdirSync(srcComponents)
  .map((cmpDirectory) => {
    const pathDirectory = path.resolve(srcComponents, cmpDirectory);
    const clientFile = fs.readdirSync(pathDirectory).find((file) => {
      const parts = file.split(".");
      parts.pop();
      const nameFile = parts.join(".");
      return nameFile === "client";
    });

    if (clientFile) {
      const pathClientFile = path.resolve(pathDirectory, clientFile);

      return pathClientFile;
    }
    return "";
  })
  .filter((file) => file);
} catch (err) {
  console.error(err)
  pathClientFiles = [];
}

export const build = async () => {
  fs.rmSync(distComponents, { recursive: true, force: true });
  const result = await esbuild({
    entryPoints: pathClientFiles,
    external: ["esbuild"],
    plugins: [
      CssModulesPlugin({
        inject: true,
      }),
    ],
    bundle: true,
    splitting: true,
    outdir: "dist/components",
    format: "esm",
  });
  return {
    result,
    dist: distComponents,
  }
};

const getHtml = (page: IRouter) => {
  const dependencies = Array.from(page.dependencies)
  const lastBody = dependencies.map(dependency => 
    `<script src="/components/${dependency}/client.js" type="module"></script>`
  ).join('')
  const content = page.html;
  const html = layout({ lastBody, content })
  return html
}

interface IRouter {
  tag: string;
  dependencies: Set<string>;
  html: string;
}

interface IRouters {
  [key: string]:
    | IRouter
    | Handler
    | ((req: Request, res: Response) => IRouter | Promise<IRouter>);
}

export type INaxtRouters = IRouters;

export const naxtRouter = (routers: IRouters) => {
  const appRouter = Router();
  
  for (const route in routers) {
    const page = routers[route];
    let html = '';

    if (typeof page === "object") {
      html = getHtml(page)
    }

    appRouter.get(route, async (req, res, next) => {
      if (typeof page === "object") {
        res.send(html);
      } else {
        const voidOrRouter = await page(req, res, next);
        if (voidOrRouter) {
          const html = getHtml(voidOrRouter);
          res.send(html)
        }
      }
    });
  }

  return appRouter;
};
