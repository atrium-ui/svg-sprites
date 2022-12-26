import { name, main } from "../package.json";

export function isComponentImport(source: string) {
  return source.match("vite-svg-sprite/component");
}

export function isSheetImport(source: string) {
  return source === "~svg-sprite" || source.match("vite-svg-sprite" + main);
}
