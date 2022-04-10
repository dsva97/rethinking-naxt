import { Builder } from "../builder";
import { IConfigPaths } from "../types";

const build = async (config: IConfigPaths) => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  const builder = new Builder(config);

  await builder.build();
};

export default build;
