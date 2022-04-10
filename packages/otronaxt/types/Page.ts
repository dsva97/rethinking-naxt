export interface IContentHtml {
  head: string;
  content: string;
  scripts: string;
}
interface IContentLayout {
  content: string;
}
export type IArgGenerateHtml = IContext & IContentHtml;
export type generateHtml = (arg: IArgGenerateHtml) => Promise<string>;

export type IArgGenerateLayout = IContext & IContentLayout;
export type generateLayout = (arg: IArgGenerateLayout) => Promise<string>;

export interface IGeneratorsHtmls {
  html: generateHtml;
  layout: generateLayout;
}

export interface IContext {
  params: string; // contains the route parameters for pages using dynamic routes. For example, if the page name is [id].js , then params will look like { id: ... }. To learn more, take a look at the Dynamic Routing documentation. You should use this together with getStaticPaths, which we’ll explain later.
  preview: boolean; // is true if the page is in the preview mode and undefined otherwise. See the Preview Mode documentation.
  previewData: object; // contains the preview data set by setPreviewData. See the Preview Mode documentation.
  locale: string; // contains the active locale (if enabled).
  locales: string[]; // contains all supported locales (if enabled).
  defaultLocale: string; // contains the configured default locale (if enabled).
}
export interface StaticPropsReturn {
  props: object;
  revalidate: boolean;
  notFound: boolean;
}
export enum EStaticPathFallback {
  BLOCKING = "blocking",
}
export interface StaticPathsReturn {
  paths: any[];
  fallback: EStaticPathFallback.BLOCKING;
}

type IConfigPagePropsRequired = {
  content: (ctx: IContext) => Promise<string>;
};
type IConfigPagePropsOptional = IGeneratorsHtmls & {
  scriptPath: string;
  stylePath: string;
  head: (ctx: IContext) => Promise<string>;
  getStaticProps: (ctx: IContext) => Promise<StaticPropsReturn>;
  getStaticPaths: (ctx: IContext) => Promise<StaticPathsReturn>;
};

export type IConfigPageCore = IConfigPagePropsRequired &
  IConfigPagePropsOptional;

export type IConfigPage = IConfigPagePropsRequired &
  Partial<IConfigPagePropsOptional>;
