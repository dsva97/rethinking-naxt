import { IConfigPaths } from "../types";
import { start } from "live-server";
import nodemon from "nodemon";

const build = async (config: IConfigPaths) => {
  nodemon(`--watch ${config.src} -e "js ts css" --exec "naxt dev"`);

  start({
    port: 3060,
    root: config.dist,
    logLevel: 0,
    open: true,
  });
};

export default build;
