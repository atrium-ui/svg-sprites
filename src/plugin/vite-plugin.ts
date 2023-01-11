import type { PluginOption } from "vite";
import { getSheet, SVGSpriteOptions } from "../sheet";
import { isComponentImport, isSheetImport, replacePlaceholder, createSheetCode } from "../shared";

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
      if (source === "~svg-sprite") {
        return source;
      }
    },

    async load(id) {
      if (id === "~svg-sprite") {
        return createSheetCode(await svg);
      }
    },

    async transform(code, id) {
      if (id === componentImportId) {
        code = replacePlaceholder(code, await svg);
        return { code };
      }

      if (isSheetImport(id)) {
        code = replacePlaceholder(code, await svg);
        return { code };
      }

      return null;
    },
  };
}
