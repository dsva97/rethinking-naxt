import fs from "fs";
import path from "path";

interface OjbCallback<Type> {
  applyToFile?: (pathFile: string, index: number) => Promise<Type>;
  applyToDir?: (pathDir: string, index: number) => Promise<Type>;
}
type Callback<Type> = Function | OjbCallback<Type>;

export const recursiveApply = async <Type>(
  initDirectory: string,
  callback: Callback<Type>
): Promise<Array<Type>> => {
  let counter = 0;
  const applyToFile: Function =
    typeof callback === "function"
      ? callback
      : callback.applyToFile || (() => {});
  const applyToDir: Function =
    typeof callback === "function"
      ? callback
      : callback.applyToDir || (() => {});

  const results: Type[] = [];

  const recursive = async (directory: string) => {
    if (fs.existsSync(directory)) {
      const files = fs.readdirSync(directory);
      for (const file of files) {
        const abs_file = path.resolve(directory, file);
        if (fs.existsSync(abs_file)) {
          const isDirectory = fs.statSync(abs_file).isDirectory();

          if (isDirectory) {
            const result = await applyToDir(abs_file, counter);
            result && results.push(result);
            counter++;
            await recursive(abs_file);
          } else {
            const result = await applyToFile(abs_file, counter);
            result && results.push(result);
            counter++;
          }
        }
      }
    }
  };

  await recursive(initDirectory);

  return results;
};
