import fs from "fs";
import path from "path";
import { buildSync } from "esbuild";

const getBuildTmp = (absFilePath: string, tmpNameFile: string) => {
  const tmp = path.resolve(__dirname, tmpNameFile);

  buildSync({
    entryPoints: [absFilePath],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: tmp,
    platform: "node",
  });

  const execDefault = require(tmp).default;
  fs.unlinkSync(tmp);
  return execDefault;
};
