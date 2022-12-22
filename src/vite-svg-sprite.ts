import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";

interface SVGSpriteOptions {
  dir: string;
  dist?: string;
  svg?: SVGSpriter.Config;
}

async function buildSprite(
  sourceDir: string,
  distDir: string,
  options: SVGSpriteOptions
): Promise<string | undefined> {
  const entries = await fastGlob([sourceDir], { dot: true });
  const spriter = new SVGSpriter({
    mode: {
      defs: true, // Create a «defs» sprite
    },
    ...options.svg,
  });

  for (let entry of entries) {
    const file = fs.readFileSync(entry, { encoding: "utf-8" });
    spriter.add(entry, null, file);
  }

  const { result } = await spriter.compileAsync();
  for (const mode in result) {
    for (const resource in result[mode]) {
      fs.writeFileSync(distDir, result[mode][resource].contents);
    }
  }

  return distDir;
}

export default async function svgSprite(options: SVGSpriteOptions) {
  const virtualModuleId = "svg-sprite:sheet";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  if (!options || !options.dir) {
    throw new Error("svg-sprite: option 'dir' needs to be specified.");
  }

  const distPath = options.dist || "dist/svg-sprite.sprite.svg";

  return {
    name: "svg-sprite",

    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default "${distPath}";`;
      }
    },

    async closeBundle() {
      await buildSprite(options.dir, distPath, options);
    },
  };
}
