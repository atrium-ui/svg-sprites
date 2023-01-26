import type { PluginOption } from "vite";
import { getSheet, SVGSpriteOptions, replacePlaceholder, createSheetCode } from "../sheet.js";

function isComponentImport(id: string) {
  return id.match("svg-sprites_svg-icon") || id.match("svg-sprites/svg-icon");
}

function isSheetImport(id: string) {
  return id.match("svg-sprites_sheet") || id.match("svg-sprites/sheet");
}

export default function svgSprite(
  options: SVGSpriteOptions = { dir: "assets/icons/**/*.svg" }
): PluginOption {
  let svg: Promise<string>;

  let componentImportId: string | null;

  return {
    name: "svg-sprites",
    enforce: "pre",

    async buildStart() {
      svg = getSheet(options);
    },

    async resolveId(source, importer, options) {
      if (isComponentImport(source)) {
        const resolved = await this.resolve(source, importer, {
          skipSelf: true,
          ...options,
        });
        if (resolved && !resolved.external) {
          componentImportId = resolved ? resolved.id : null;
          return componentImportId;
        }
      }

      if (isSheetImport(source) || source === "~svg-sprite") {
        return "~svg-sprite";
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
