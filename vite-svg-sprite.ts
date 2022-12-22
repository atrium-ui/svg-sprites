import fs from "fs";
import fg from "fast-glob";
import SVGSpriter from "svg-sprite";

interface SVGSpriteOptions {
  dir: string;
}

async function buildSprite(sourceDir: string, distDir: string): Promise<string | undefined> {
  const entries = await fg([sourceDir], { dot: true });
  const spriter = new SVGSpriter({});

  for (let entry of entries) {
    const file = fs.readFileSync(entry, { encoding: "utf-8" });
    console.log(file);
    // spriter.add(entry, null, file);
  }

  // const { result } = await spriter.compileAsync();

  return;
}

export default async function svgSprite({ dir }: SVGSpriteOptions = { dir: "" }) {
  // const virtualModuleId = "svg-sprite:sheet";
  // const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const distPath = "dist/svg-sprite.svg";

  return {
    name: "svg-sprite",

    // resolveId(id: string) {
    //   if (id === virtualModuleId) {
    //     return resolvedVirtualModuleId;
    //   }
    // },

    // load(id: string) {
    //   if (id === resolvedVirtualModuleId) {
    //     return distPath;
    //   }
    // },

    async closeBundle() {
      await buildSprite(dir, distPath);
    },
  };
}
