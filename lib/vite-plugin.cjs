var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin/vite-plugin.ts
var vite_plugin_exports = {};
__export(vite_plugin_exports, {
  default: () => svgSprite
});
module.exports = __toCommonJS(vite_plugin_exports);

// src/sheet.ts
var import_fs = __toESM(require("fs"), 1);
var import_fast_glob = __toESM(require("fast-glob"), 1);
var import_svg_sprite = __toESM(require("svg-sprite"), 1);
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
  const entries = await (0, import_fast_glob.default)([options.dir]);
  const spriter = new import_svg_sprite.default({
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
      import_fs.default.readFileSync(entry, { encoding: "utf-8" })
    );
  }
  const { result } = await spriter.compileAsync();
  if (process.env.EXPORT_SVG_SPRITE) {
    import_fs.default.writeFileSync(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
