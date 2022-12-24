import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";
import type { PluginOption } from "vite";

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
  const svg = buildSprite(options.dir, options);

  const virtualId = "svg:sheet";

  let importId: string | null;

  return {
    name: "svg-sprite",
    enforce: "pre",

    async resolveId(source, importer, options) {
      if (source === "@atrium-ui/vite-svg-sprite/component/Icon") {
        const resolved = await this.resolve(source, importer, { skipSelf: true, ...options });
        importId = resolved ? resolved.id : null;
        return importId;
      }
      if (source === virtualId) {
        return source;
      }
    },

    async load(id) {
      if (id === virtualId) {
        return `
          export default new Blob([\`${await svg}\`], { type: "image/svg+xml" });
        `;
      }
    },

    async transform(code, id) {
      if (id === importId) {
        const injection = `const svgSheetBlob = new Blob([\`${await svg}\`], { type: "image/svg+xml" });`;

        return {
          code: `
            ${code}
            ${injection}
          `,
        };
      }
      return null;
    },
  };
}
