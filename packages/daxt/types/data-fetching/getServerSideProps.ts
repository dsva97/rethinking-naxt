import { IncomingMessage, ServerResponse } from "http";
import { IParams, IRedirect } from "./types";

export interface IParamsGetServerSideProps {
  params: IParams;
  req: IncomingMessage;
  res: ServerResponse;
  query: string;
  preview: boolean;
  previewData: boolean;
  resolvedUrl: string;
  locale: string;
  locales: string[];
  defaultLocale: string;
}

export interface IResultGetServerSideProps {
  props: {
    [key: string]: any;
  };
  notFound: boolean;
  redirect: IRedirect;
}

export type GetServerSideProps = (
  params: IParamsGetServerSideProps
) => Promise<IResultGetServerSideProps>;
