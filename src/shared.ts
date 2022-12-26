import { main } from "../package.json";

export function isComponentImport(source: string) {
  return source.match("vite-svg-sprite/component");
}

export function isSheetImport(source: string) {
  return source === "~svg-sprite" || source.match("vite-svg-sprite" + main);
}

export function replacePlaceholder(code: string, svg: string) {
  return code.replace(/"_svgSheetBlob_"/g, `new Blob([\`${svg}\`], { type: "image/svg+xml" });`);
}

export function createSheetCode(svg: string) {
  return `
    export function blob() {
      return new Blob([\`${svg}\`], { type: "image/svg+xml" });
    }
    
    export function src() {
      return URL.createObjectURL(new Blob([\`${svg}\`], { type: "image/svg+xml" }));
    }
  `;
}
