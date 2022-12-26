import { getSheet, SVGSpriteOptions } from "./sheet";

export default async function (code: string) {
  // @ts-ignore
  const options: SVGSpriteOptions = this.getOptions();
  // @ts-ignore
  const callback = this.async();

  const svg = getSheet(options);

  callback(
    null,
    code.replace(/"_svgSheetBlob_"/g, `new Blob([\`${await svg}\`], { type: "image/svg+xml" });`)
  );
}
