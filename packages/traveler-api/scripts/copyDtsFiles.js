const fsExtra = require("fs-extra");

const sourceDir = "src";
const outDir = "dist";

async function main() {
    try {
        await fsExtra.ensureDir(outDir);
    } catch (error) {
        console.error(error);
        return 1;
    }

    try {
        const files = await fsExtra.readdir(sourceDir);
        for (const f of files.filter(f => /\.d.ts$/.test(f))) {
            // Construct source and dest. file paths.
            const [src, dst] = [`${sourceDir}/${f}`, `${outDir}/${f}`];
            fsExtra.copy(src, dst, {
                overwrite: true
            }).catch(e => {
                console.error(e);
            })
        }
    } catch (error) {
        console.error(error);
        return 2;
    }
}

main();

