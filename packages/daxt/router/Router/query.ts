import { IQueryData } from "./types";

interface Obj {
  [key: string]: string[];
}

export const getQueryData = (
  search: string = window.location.search
): IQueryData => {
  const queryString = search.substring(1);
  return queryString.split("&").reduce((obj: Obj, str) => {
    const [key, value] = str.split("=");
    obj[key] = obj[key] || [];
    obj[key].push(value);
    return obj;
  }, {});
};

export const getQueryString = (queryData: IQueryData = {}): string => {
  const keys = Object.keys(queryData);
  let query = "";

  if (keys.length > 0) {
    query = "?";
    keys.forEach((key, i) => {
      const values = queryData[key];

      values.forEach((value, z) => {
        query += key + "=" + value;
        const isLast = i === keys.length - 1 && z === values.length - 1;
        if (!isLast) {
          query += "&";
        }
      });
    });
  } else {
    query = window.location.search;
  }

  return query;
};
