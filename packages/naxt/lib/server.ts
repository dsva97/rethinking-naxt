import path, { dirname } from "path";
import fs from "fs";
import { build as esbuild } from "esbuild";
import CssModulesPlugin from "esbuild-css-modules-plugin";

const fileName = require?.main?.filename;
let srcDir = "";
if (fileName) {
  srcDir = dirname(fileName);
} else {
  throw new Error("require?.main?.filename is not defined");
}

const rootProject = path.resolve(srcDir, "..");
const src = path.resolve(rootProject, "src");
const dist = path.resolve(rootProject, "dist");
const srcComponents = path.resolve(src, "components");
const distComponents = path.resolve(dist, "components");

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
  console.error(err);
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
  };
};

export const buildPage = async (_path: string, content: string) => {
  const finalPath = path.join(dist, _path);
  console.log(finalPath);
  try {
    fs.writeFileSync(finalPath, content, {
      encoding: "utf8",
      flag: "w",
    });
  } catch (err) {}
};
