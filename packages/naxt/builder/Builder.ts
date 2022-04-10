import { buildSync } from "esbuild";
import fs from "fs";
import path from "path";
import { IRouterRequired } from "../router/Router";
import {
  EStaticPathFallback,
  IArgGenerateHtml,
  IArgGenerateLayout,
  IConfigPage,
  IConfigPageCore,
  IConfigPaths,
  IContext,
} from "../types";
import { getRelativePath, recursiveApply } from "../utils";
import { AppConfig } from "./App";
import { Cleaner } from "./Cleaner";
import { Importer } from "./Importer";

export class Builder {
  contextDefault: IContext = {
    params: "", // contains the route parameters for pages using dynamic routes. For example, if the page name is [id].js , then params will look like { id: ... }. To learn more, take a look at the Dynamic Routing documentation. You should use this together with getStaticPaths, which we’ll explain later.
    preview: false, // is true if the page is in the preview mode and undefined otherwise. See the Preview Mode documentation.
    previewData: {}, // contains the preview data set by setPreviewData. See the Preview Mode documentation.
    locale: "", // contains the active locale (if enabled).
    locales: [""], // contains all supported locales (if enabled).
    defaultLocale: "", // contains the configured default locale (if enabled).
  };
  app: AppConfig;
  cleaner: Cleaner;

  constructor(public config: IConfigPaths) {
    this.cleaner = new Cleaner(this.config);
    this.app = new AppConfig(this.config);
  }

  public async build() {
    await this.cleaner.reload();

    const me = this;
    const applyToFile = async function (
      absPathPage: string,
      index: number
    ): Promise<[string, IConfigPageCore]> {
      const [configPage] = Importer.execTmpBuild<IConfigPage>(
        absPathPage,
        "_tmp_page" + index + ".js"
      );
      const completeConfigPage: IConfigPageCore =
        me.completeConfigPage(configPage);
      return [absPathPage, completeConfigPage];
    };

    const pageFilesAndConfig = await recursiveApply<[string, IConfigPageCore]>(
      this.config.pages,
      {
        applyToFile,
      }
    );

    const routes: IRouterRequired[] = await Promise.all(
      pageFilesAndConfig.map(async (pageFileAndConfig) => {
        const [absPathPage, completeConfigPage] = pageFileAndConfig;
        const route = getRelativePath(absPathPage, this.config.pages);
        const content = await me.buildPage(completeConfigPage, absPathPage);
        const routeData: IRouterRequired = {
          pathname: route,
          content,
        };
        const script = this.getScriptPath(completeConfigPage);
        if (script) {
          routeData.script = script;
        }
        return routeData;
      })
    );

    const scripts = pageFilesAndConfig
      .map((config) => config[1].scriptPath)
      .filter((s) => s);

    this.buildRoutesJSON(routes);
    this.buildScripts(scripts);
  }

  private completeConfigPage(configPageReceived: IConfigPage): IConfigPageCore {
    const defaultStaticPaths = async (_: IContext) => ({
      paths: [],
      fallback: EStaticPathFallback.BLOCKING,
    });
    const defaultStaticProps = async (_: IContext) => ({
      props: {},
      revalidate: false,
      notFound: false,
    });
    const scriptPath = configPageReceived.scriptPath
      ? path.join(this.config.src, configPageReceived.scriptPath)
      : "";
    const stylePath = configPageReceived.stylePath
      ? path.join(this.config.src, configPageReceived.stylePath)
      : "";
    const head = async (_: IContext) => "";

    const completeConfigPage: IConfigPageCore = {
      ...configPageReceived,
      scriptPath,
      stylePath,
      head: configPageReceived.head || head,
      getStaticPaths: configPageReceived.getStaticPaths || defaultStaticPaths,
      getStaticProps: configPageReceived.getStaticProps || defaultStaticProps,
      html: configPageReceived.html || this.app.html,
      layout: configPageReceived.layout || this.app.layout,
    };

    return completeConfigPage;
  }

  private async buildPage(configPage: IConfigPageCore, absPathPage: string) {
    const [distPart, distPage] = this.getDistPathsFromPage(absPathPage);
    const [content, allHtml] = await this.getHtmlFromPage(configPage);
    fs.writeFileSync(distPage, allHtml);
    fs.writeFileSync(distPart, content);
    return "";
    // return content.length > 200 ? "" : content;
  }

  private getDistPathsFromPage(absPathPage: string): [string, string] {
    let relativePage = getRelativePath(absPathPage, this.config.pages);
    relativePage =
      relativePage === "/" ? "/index.html" : relativePage + "/index.html";
    const distPartPath = path.join(this.config.distParts, relativePage);
    const distPagePath = path.join(this.config.dist, relativePage);

    fs.mkdirSync(path.dirname(distPartPath), { recursive: true });
    fs.mkdirSync(path.dirname(distPagePath), { recursive: true });

    return [distPartPath, distPagePath];
  }

  private getScriptPath(configPage: IConfigPageCore) {
    if (configPage.scriptPath) {
      const relativeScript = getRelativePath(
        configPage.scriptPath,
        this.config.src
      );

      const srcPageScript = "/__scripts__" + relativeScript + ".js";

      return srcPageScript;
    } else {
      return null;
    }
  }

  private getTagScripts(configPage: IConfigPageCore) {
    const relativeAppScript = getRelativePath(
      this.app.scriptPath,
      this.config.src
    );
    const srcApp = "/__scripts__" + relativeAppScript + ".js";

    let script = `<script src="${srcApp}" type="module"></script>`;

    if (configPage.scriptPath) {
      const srcPage = this.getScriptPath(configPage);

      script += `<script src="${srcPage}" type="module"></script>`;
    }
    return script;
  }

  private async getHtmlFromPage(
    configPage: IConfigPageCore
  ): Promise<[string, string]> {
    /**
     * TODO: Esta funcion también debe recibir:
     *  - "scriptPath" para generar "scripts"
     *  - "stylePath" para generar "head"
     * argumentos necesarios para configPage.html({...scripts, head})
     *  */
    const content = await configPage.content(this.contextDefault);
    const argLayout: IArgGenerateLayout = Object.assign(
      { content },
      this.contextDefault
    );
    const contentWithLayout = await configPage.layout(argLayout);
    const head = await configPage.head(this.contextDefault);
    const scripts = this.getTagScripts(configPage);
    const argHtml: IArgGenerateHtml = Object.assign(
      { content: contentWithLayout, head, scripts },
      this.contextDefault
    );
    const contentWithHtml = await configPage.html(argHtml);
    const allHtml = contentWithHtml;
    return [content, allHtml];
  }

  private buildScripts(scripts: string[]) {
    try {
      const entryPoints = scripts;
      this.app.scriptPath && entryPoints.push(this.app.scriptPath);

      buildSync({
        entryPoints,
        bundle: true,
        minify: process.env.NODE_ENV !== "development",
        sourcemap: false,
        outdir: this.config.distScripts,
        format: "esm",
        splitting: true,
      });
    } catch (error) {
      console.error("Error al ejecutar Builder.buildScripts");
      console.error(error);
    }
  }

  private buildRoutesJSON(routes: IRouterRequired[]) {
    const routesPath = path.resolve(this.config.dist, "routes.json");
    const routesJSON = JSON.stringify(routes);
    fs.writeFileSync(routesPath, routesJSON);
  }
}
