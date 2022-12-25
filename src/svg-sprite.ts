import fs from "fs";
import fastGlob from "fast-glob";
import SVGSpriter from "svg-sprite";

export interface SVGSpriteOptions {
  dir: string;
  svg?: SVGSpriter.Config;
}

export async function buildSprite(options: SVGSpriteOptions): Promise<string[]> {
  const entries = await fastGlob([options.dir]);
  const spriter = new SVGSpriter({
    mode: {
      defs: true, // Create a «defs» sprite
    },
    ...options.svg,
  });

  for (let entry of entries) {
    spriter.add(entry, null, fs.readFileSync(entry, { encoding: "utf-8" }));
  }

  const { result } = await spriter.compileAsync();

  return result.defs.sprite.contents.toString("utf8");
}
