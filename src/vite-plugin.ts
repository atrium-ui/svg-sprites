import type { PluginOption } from "vite";
import { getSheet, SVGSpriteOptions } from "./sheet";
import { isComponentImport, isSheetImport } from "./shared";

export default function svgSprite(
  options: SVGSpriteOptions = { dir: "assets/icons/*.svg" }
): PluginOption {
  const svg = getSheet(options);

  let componentImportId: string | null;

  return {
    name: "svg-sprite",
    enforce: "pre",

    async resolveId(source, importer, options) {
      if (isComponentImport(source)) {
        const resolved = await this.resolve(source, importer, { skipSelf: true, ...options });
        if (resolved && !resolved.external) {
          componentImportId = resolved ? resolved.id : null;
          return componentImportId;
        }
      }
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
      if (id === componentImportId) {
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
