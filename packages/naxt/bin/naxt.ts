#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { IConfigPaths } from "../types";

const argument = process.argv[2];

const defaultCommand = "build";

export type cliCommand = (config: IConfigPaths) => void;
const commands: { [command: string]: () => Promise<cliCommand> } = {
  dev: () => import("../cli/naxt-dev").then((i) => i.default),
  start: () => import("../cli/naxt-start").then((i) => i.default),
  build: () => import("../cli/naxt-build").then((i) => i.default),
};

const command = commands.hasOwnProperty(argument) ? argument : defaultCommand;

const PATH_ORIGIN = process.cwd();
const PATH_SRC = path.resolve(PATH_ORIGIN, "src");
const PATH_DIST = path.join(PATH_ORIGIN, "dist");

const config: IConfigPaths = {
  root: PATH_ORIGIN,

  src: PATH_SRC,
  app: path.resolve(PATH_SRC, "app"),
  pages: path.resolve(PATH_SRC, "pages"),
  views: path.resolve(PATH_SRC, "views"),

  dist: PATH_DIST,
  distScripts: path.join(PATH_DIST, "__scripts__"),
  distParts: path.join(PATH_DIST, "__parts__"),

  assets: path.join(PATH_DIST, "assets"),
};

commands[command]().then((run) => run(config));
