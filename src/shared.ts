import { main } from "../package.json";

const moduleId = "vite-svg-sprite";

export function isComponentImport(source: string) {
  return source.match(moduleId + "/component");
}

export function isSheetImport(source: string) {
  return source.match(moduleId + "/" + main);
}

export function replacePlaceholder(code: string, svg: string) {
  return code.replace(/\"_svgSheetString_\"/g, `\`${svg}\``);
}

export function createSheetCode(svg: string) {
  return `
    globalThis.Blob = globalThis.Blob || class {};

    export function blob() {
      return new globalThis.Blob([\`${svg}\`], { type: "image/svg+xml" });
    }

    export function src() {
      return URL.createObjectURL(blob());
    }
  `;
}
