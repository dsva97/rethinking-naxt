import { IParams, IRedirect } from "./types";

export interface IParamsGetStaticProps {
  params: IParams;
  preview: boolean;
  previewData: boolean;
  locale: string;
  locales: string[];
  defaultLocale: string;
}
export interface IResultGetStaticProps {
  props: { [key: string]: any };
  revalidate: number | false;
  notFound: boolean;
  redirect: IRedirect;
}

export type GetStaticProps = (
  params: IParamsGetStaticProps
) => Promise<IResultGetStaticProps>;
