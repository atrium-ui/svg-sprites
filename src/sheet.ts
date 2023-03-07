import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";

export function replacePlaceholder(code: string, svg: string) {
  return code.replace(/\"_svgSheetString_\"/g, `\`${svg}\``);
}

export function createSheetCode(svg: string) {
  return `
    const Blob = globalThis.Blob || class {};

    export function blob() {
      return new Blob([\`${svg}\`], { type: "image/svg+xml" });
    }

    export function svg() {
      return \`${svg}\`;
    }
  `;
}

export interface SVGSpriteOptions {
  dir: string[];
  svg?: SVGSpriter.Config;
}

export async function buildSheet(options: SVGSpriteOptions): Promise<string> {
  const entries = await fastGlob(options.dir);
  const spriter = new SVGSpriter({
    mode: {
      symbol: true,
    },
    shape: {
      id: {
        generator(id) {
          return id.replace(/\.(.+)/g, "");
        },
      },
      transform: ["svgo"],
    },
    ...options.svg,
  });

  const rootDir = options.dir.replace(/(\/(\*+))+\.(.+)/g, "");

  for (const entry of entries) {
    const relativePath = entry.replace(rootDir + "/", "");

    spriter.add(entry, relativePath, fs.readFileSync(entry, { encoding: "utf-8" }));
  }

  const { result } = await spriter.compileAsync();

  if (process.env.EXPORT_SVG_SPRITE) {
    fs.writeFileSync("./sprite.svg", result.defs.sprite.contents.toString("utf8"));
  }

  return result.symbol.sprite.contents.toString("utf8");
}

let sheetData: string | undefined;

export async function getSheet(options: SVGSpriteOptions, force = false) {
  if (!sheetData || force) sheetData = await buildSheet(options);
  return sheetData;
}
