import path from "path";

export const getRelativePath = (
  absFilePath: string,
  absPathDirectory: string
) => {
  const name = path.parse(absFilePath).name;
  const rest = absFilePath.split(absPathDirectory)[1];
  const parts = rest.split(path.sep);
  parts.pop();
  const result = parts.join("/");
  let relativePath = result + "/" + name;

  if (relativePath === "/index") {
    relativePath = "/";
  } else if (relativePath.slice(-6) === "/index") {
    relativePath = relativePath.slice(0, -6);
  }
  return relativePath;
};
