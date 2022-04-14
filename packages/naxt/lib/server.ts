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

const rootProject = path.join(srcDir, "..");
const src = path.join(rootProject, "src");
const dist = path.join(rootProject, "dist");
const srcComponents = path.join(src, "components");
const distBuild = path.join(dist, "build");
const distScripts = path.join(distBuild, "__scripts__");

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
  fs.rmSync(distScripts, { recursive: true, force: true });
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
    outdir: "dist/build/__scripts__",
    format: "esm",
  });
  return {
    result,
    dist: distScripts,
  };
};

export const buildPage = async (
  _path: string,
  content: string,
  isPart: boolean = false
) => {
  const finalPath = path.join(
    dist + "/build",
    (isPart ? "/__parts__" : "") + _path
  );
  const directory = finalPath.slice(0, -10);
  fs.mkdirSync(directory, { recursive: true });
  try {
    fs.writeFileSync(finalPath, content, {
      encoding: "utf8",
      flag: "w",
    });
  } catch (err) {}
};
