// src/sheet.ts
import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";
function replacePlaceholder(code, svg) {
  return code.replace(/\"_svgSheetString_\"/g, `\`${svg}\``);
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

// src/loader/webpack-loader.ts
function isSheetImport(id) {
  return id.match("sprite-sheet.js");
}
function isComponentImport(id) {
  return id.match("component/Icon.js");
}
async function webpack_loader_default(code) {
  const options = this.getOptions();
  const callback = this.async();
  const svg = getSheet(options).catch((err) => {
    console.error(err);
    return void 0;
  });
  if (code && this.resource) {
    if (isSheetImport(this.resource)) {
      const source = await svg;
      if (source) {
        return callback(null, replacePlaceholder(code, source));
      }
    }
    if (isComponentImport(this.resource)) {
      const source = await svg;
      if (source) {
        return callback(null, replacePlaceholder(code, source));
      }
    }
  }
  return callback(null, code);
}
export {
  webpack_loader_default as default
};
