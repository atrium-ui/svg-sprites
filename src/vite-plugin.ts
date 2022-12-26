import type { PluginOption } from "vite";
import { getSheet, SVGSpriteOptions } from "./sheet";
import { isComponentImport, isSheetImport } from "./shared";

export default function svgSprite(
  options: SVGSpriteOptions = { dir: "assets/icons/*.svg" }
): PluginOption {
  const svg = getSheet(options);

  return {
    name: "svg-sprite",

    async resolveId(source, importer, options) {
      if (isSheetImport(source)) {
        return source;
      }
    },

    async load(id) {
      if (isSheetImport(id)) {
        return `export default new Blob([\`${await svg}\`], { type: "image/svg+xml" });`;
      }
    },

    async transform(code, id) {
      if (isComponentImport(id)) {
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
