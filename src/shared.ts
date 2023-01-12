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
