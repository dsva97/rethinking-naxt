export interface IQueryData {
  [key: string]: string[];
}
export interface IRouterData {
  state: object;
  title: string;
  pathname: string;
  hash: string;
  query: IQueryData;
  selected?: boolean;
  content: string;
  script?: string;
  style?: string;
}

export interface IRouterRequired
  extends Partial<Omit<IRouterData, "pathname">> {
  pathname: string;
}
