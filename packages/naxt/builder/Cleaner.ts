import fs from "fs";
import path from "path";
import { IConfigPaths } from "../types";
import { recursiveApply } from "../utils";

export class Cleaner {
  constructor(private config: IConfigPaths) {
    !fs.existsSync(config.dist) &&
      fs.mkdirSync(config.dist, { recursive: true });
  }
  private async clean() {
    const applyToDir = async (absDir: string) => {
      const isAsset = absDir === this.config.assets;
      if (!isAsset && fs.existsSync(absDir)) {
        fs.rmSync(absDir, { recursive: true });
      }
    };

    await recursiveApply(this.config.dist, { applyToDir });

    const files = fs.readdirSync(this.config.dist);

    files.forEach((file) => {
      const absFile = path.join(this.config.dist, file);
      const isFile = fs.statSync(absFile).isFile();
      if (isFile) {
        fs.unlinkSync(absFile);
      }
    });
  }
  private createStructure() {
    !fs.existsSync(this.config.distScripts) &&
      fs.mkdirSync(this.config.distScripts, { recursive: true });
    !fs.existsSync(this.config.distParts) &&
      fs.mkdirSync(this.config.distParts, { recursive: true });
  }
  async reload() {
    await this.clean();
    this.createStructure();
  }
}
