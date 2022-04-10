import { buildSync, Format } from "esbuild";
import path from "path";
import fs from "fs";

export class Importer {
  static execTmpBuild<T>(
    absFilePath: string,
    tmpNameFile: string,
    properties: string[] = ["default"]
  ): T[] {
    const tmp = path.resolve(__dirname, tmpNameFile);

    buildSync({
      entryPoints: [absFilePath],
      bundle: true,
      // minify: true,
      sourcemap: false,
      outfile: tmp,
      // format: "iife",
      platform: "node",
    });

    const modules = properties
      .map((property) => {
        return require(tmp)[property];
      })
      .filter((x) => x);

    // fs.unlinkSync(tmp);

    return modules;
  }
}
