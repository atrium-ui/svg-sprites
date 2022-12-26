import type { SvgIcon } from "./src/component/Icon";

// data placeholder
export function blob() {
  return new Blob([], { type: "image/svg+xml" });
}

export function src() {
  return URL.createObjectURL(new Blob([], { type: "image/svg+xml" }));
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": SvgIcon;
  }
}
