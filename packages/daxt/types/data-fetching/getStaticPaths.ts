import { IParams } from "./types";

export interface IResultGetStaticPaths {
  paths: { params: IParams }[];
  fallback: boolean | "blocking";
}

export type GetStaticPaths = () => Promise<IResultGetStaticPaths>;
