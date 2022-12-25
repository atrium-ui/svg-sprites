import type { PluginOption } from "vite";
import { name } from "../package.json";
import { buildSprite, SVGSpriteOptions } from "./svg-sprite";

export default function svgSprite(
  options: SVGSpriteOptions = { dir: "assets/icons/*.svg" }
): PluginOption {
  const svg = buildSprite(options);

  const virtualId = "~svg-sprite";

  let importId: string | null;

  return {
    name: "svg-sprite",
    enforce: "pre",

    async resolveId(source, importer, options) {
      if (source.match(name + "/component")) {
        const resolved = await this.resolve(source, importer, { skipSelf: true, ...options });
        if (resolved && !resolved.external) {
          importId = resolved ? resolved.id : null;
          return importId;
        }
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
        return {
          code: code.replace(
            /"_svgSheetBlob_"/g,
            `new Blob([\`${await svg}\`], { type: "image/svg+xml" });`
          ),
        };
      }
      return null;
    },
  };
}
