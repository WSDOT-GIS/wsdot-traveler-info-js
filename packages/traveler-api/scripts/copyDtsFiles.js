import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fsExtra from "fs-extra";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);
const rootDir = dirname(currentDir);

const sourceDir = join(rootDir, "src");
const outDir = join(rootDir, "dist");

async function main() {
  try {
    await fsExtra.ensureDir(outDir);
  } catch (error) {
    console.error(error);
    return 1;
  }

  try {
    const files = await fsExtra.readdir(sourceDir);
    for (const f of files.filter((f) => /\.d.ts$/.test(f))) {
      // Construct source and dest. file paths.
      const [src, dst] = [`${sourceDir}/${f}`, `${outDir}/${f}`];
      fsExtra
        .copy(src, dst, {
          overwrite: true,
        })
        .catch((e) => {
          console.error(e);
        });
    }
  } catch (error) {
    console.error(error);
    return 2;
  }
}

await main();
