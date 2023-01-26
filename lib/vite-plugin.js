// src/sheet.ts
import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";
function replacePlaceholder(code, svg) {
  return code.replace(/\"_svgSheetString_\"/g, `\`${svg}\``);
}
function createSheetCode(svg) {
  return `
    globalThis.Blob = globalThis.Blob || class {};

    export function blob() {
      return new globalThis.Blob([\`${svg}\`], { type: "image/svg+xml" });
    }

    export function src() {
      return URL.createObjectURL(blob());
    }

    export function svg() {
      return \`${svg}\`;
    }
  `;
}
async function buildSheet(options) {
  const entries = await fastGlob([options.dir]);
  const spriter = new SVGSpriter({
    mode: {
      symbol: true
    },
    shape: {
      id: {
        generator(id) {
          return id.replace(/\.(.+)/g, "");
        }
      },
      transform: ["svgo"]
    },
    ...options.svg
  });
  const rootDir = options.dir.replace(/(\/(\*+))+\.(.+)/g, "");
  for (const entry of entries) {
    const relativePath = entry.replace(rootDir + "/", "");
    spriter.add(
      entry,
      relativePath,
      fs.readFileSync(entry, { encoding: "utf-8" })
    );
  }
  const { result } = await spriter.compileAsync();
  if (process.env.EXPORT_SVG_SPRITE) {
    fs.writeFileSync(
      "./sprite.svg",
      result.defs.sprite.contents.toString("utf8")
    );
  }
  return result.symbol.sprite.contents.toString("utf8");
}
var sheetData;
async function getSheet(options, force = false) {
  if (!sheetData || force)
    sheetData = await buildSheet(options);
  return sheetData;
}

// src/plugin/vite-plugin.ts
function isComponentImport(id) {
  return id.match("svg-sprites_svg-icon") || id.match("svg-sprites/svg-icon");
}
function isSheetImport(id) {
  return id.match("svg-sprites_sheet") || id.match("svg-sprites/sheet");
}
function svgSprite(options = { dir: "assets/icons/**/*.svg" }) {
  let svg;
  let componentImportId;
  return {
    name: "svg-sprites",
    enforce: "pre",
    async buildStart() {
      svg = getSheet(options);
    },
    async resolveId(source, importer, options2) {
      if (isComponentImport(source)) {
        const resolved = await this.resolve(source, importer, {
          skipSelf: true,
          ...options2
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
    }
  };
}
export {
  svgSprite as default
};
