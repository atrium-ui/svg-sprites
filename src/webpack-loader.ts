import { getSheet, SVGSpriteOptions } from "./sheet";
import { createSheetCode, replacePlaceholder, isComponentImport, isSheetImport } from "./shared";

export default async function (code: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const options: SVGSpriteOptions = this.getOptions();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const callback = this.async();

  const svg = getSheet(options).catch((err) => {
    console.error(err);
    return undefined;
  });

  if (code) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (isSheetImport(this.resource)) {
      const source = await svg;
      if (source) {
        return callback(null, createSheetCode(source));
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (isComponentImport(this.resource)) {
      const source = await svg;
      if (source) {
        return callback(null, replacePlaceholder(code, source));
      }
    }
  }

  return callback(null, code);
}
