import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";
import type { PluginOption, ViteDevServer } from "vite";

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

export default function svgSprite(
  options: SVGSpriteOptions = { dir: "assets/icons/*.svg" }
): PluginOption {
  const compId = "dist/Icon.mjs";

  const svg = buildSprite(options.dir, options);

  return {
    name: "svg-sprite",

    enforce: "pre",

    async transform(code: string, id: string) {
      if (id.match(compId)) {
        const inject = `const blob = new Blob(['${await svg}'], { type: "image/svg+xml" });`;

        return {
          code: `
            ${inject}
            ${code}
          `,
        };
      }
    },
  };
}
