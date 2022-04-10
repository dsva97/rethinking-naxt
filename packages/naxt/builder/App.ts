import path from "path";
import {
  generateHtml,
  generateLayout,
  IArgGenerateHtml,
  IArgGenerateLayout,
  IConfigPaths,
  IGeneratorsHtmls,
} from "../types";
import { Importer } from "./Importer";

export class AppConfig implements IGeneratorsHtmls {
  layout: generateLayout;
  html: generateHtml;
  scriptPath: string;
  constructor(public config: IConfigPaths) {
    try {
      const indexApp = path.resolve(this.config.app, "index.js");
      // const modules = Importer.execTmpBuild(indexApp, "_tmp_scripter_.js", [
      //   "layout",
      //   "html",
      //   "scriptPath",
      // ]);
      const [moduleDefault] = Importer.execTmpBuild(
        indexApp,
        "_tmp_scripter_.js"
      );
      const { layout, html, scriptPath } = moduleDefault as {
        layout: generateLayout;
        html: generateHtml;
        scriptPath: string;
      };
      this.layout = (layout as generateLayout) || this.defaultLayout;
      this.html = (html as generateHtml) || this.defaultHtml;
      this.scriptPath = scriptPath
        ? path.join(this.config.src, scriptPath as string)
        : "";
    } catch (error) {
      console.error("Error al inicializar AppConfig");
      this.layout = this.defaultLayout;
      this.html = this.defaultHtml;
      this.scriptPath = "";
      console.error(error);
    }
  }
  private defaultLayout: generateLayout = async ({
    content,
  }: IArgGenerateLayout): Promise<string> => {
    return /*html*/ `<div id="naxtRouter">${content}</div>`;
  };

  private defaultHtml: generateHtml = async ({
    content,
    scripts,
    head,
  }: IArgGenerateHtml): Promise<string> => {
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${this.getScriptRoutesJson()}
      <!-- HEAD -->
      ${head}
      <!-- HEAD -->
    </head>
    <body>
      <div id="naxtApp">${content}</div>
      ${scripts}
    </body>
    </html>
    `;
  };

  getScriptRoutesJson() {
    return /*html*/ `
    <script>fetch('/routes.json').then(res=>res.json()).then(routes=>{
      window.ROUTES=routes
    })</script>
    `;
  }
}
