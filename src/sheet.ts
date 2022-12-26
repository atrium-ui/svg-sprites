import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";

export interface SVGSpriteOptions {
  dir: string;
  svg?: SVGSpriter.Config;
}

export async function buildSheet(options: SVGSpriteOptions): Promise<string> {
  const entries = await fastGlob([options.dir]);
  const spriter = new SVGSpriter({
    mode: {
      defs: true, // Create a «defs» sprite
    },
    ...options.svg,
  });

  for (const entry of entries) {
    spriter.add(entry, null, fs.readFileSync(entry, { encoding: "utf-8" }));
  }

  const { result } = await spriter.compileAsync();

  return result.defs.sprite.contents.toString("utf8");
}

let sheetData: string | undefined;

export async function getSheet(options: SVGSpriteOptions) {
  if (!sheetData) sheetData = await buildSheet(options);
  return sheetData;
}
