import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";

interface SVGSpriteOptions {
  dir: string;
  svg?: SVGSpriter.Config;
}

async function buildSprite(sourceDir: string, options: SVGSpriteOptions): Promise<string[]> {
  const entries = await fastGlob([sourceDir]);
  const spriter = new SVGSpriter({
    mode: {
      defs: true, // Create a «defs» sprite
    },
    ...options.svg,
  });

  for (let entry of entries) {
    spriter.add(entry, null, fs.readFileSync(entry, { encoding: "utf-8" }));
  }

  const { result } = await spriter.compileAsync();

  return result.defs.sprite.contents.toString("utf8");
}

export default async function svgSprite(options: SVGSpriteOptions = { dir: "assets/icons/*.svg" }) {
  const virtualModuleId = "svg-sprite:sheet";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "svg-sprite",

    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const code = await buildSprite(options.dir, options);
        return `
          export const blob = new Blob(['${code}'], { type: "image/svg+xml" });
        `;
      }
    },
  };
}
