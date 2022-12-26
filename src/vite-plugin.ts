import type { PluginOption } from "vite";
import { getSheet, SVGSpriteOptions } from "./sheet";
import { isComponentImport, isSheetImport, createSheetCode, replacePlaceholder } from "./shared";

export default function svgSprite(
  options: SVGSpriteOptions = { dir: "assets/icons/*.svg" }
): PluginOption {
  const svg = getSheet(options);

  let componentImportId: string | null;

  return {
    name: "vite-svg-sprite",
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
        return createSheetCode(await svg);
      }
    },

    async transform(code, id) {
      if (isSheetImport(id)) {
        return {
          code: replacePlaceholder(code, await svg),
        };
      }

      if (id === componentImportId) {
        return {
          code: replacePlaceholder(code, await svg),
        };
      }

      return null;
    },
  };
}
