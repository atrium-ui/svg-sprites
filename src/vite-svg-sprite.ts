import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";

interface SVGSpriteOptions {
  dir: string;
  dist?: string;
  svg?: SVGSpriter.Config;
  component?: boolean;
}

async function buildSprite(
  sourceDir: string,
  dist: string,
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
      const distDir = dist.split("/").reverse().slice(1).reverse().join("/");
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
      }
      fs.writeFileSync(dist, result[mode][resource].contents);
    }
  }

  return dist;
}

export default async function svgSprite(options: SVGSpriteOptions) {
  const virtualModuleId = "svg-sprite:sheet";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  if (!options || !options.dir) {
    throw new Error("svg-sprite: option 'dir' needs to be specified.");
  } else if (options.component) {
    console.log("build");
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
