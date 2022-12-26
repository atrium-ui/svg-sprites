import type { SvgIcon } from "./src/component/Icon";

globalThis.Blob = globalThis.Blob || class {};

export function blob() {
  return new globalThis.Blob(["_svgSheetString_"], { type: "image/svg+xml" });
}

export function src() {
  return URL.createObjectURL(blob());
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": SvgIcon;
  }
}
