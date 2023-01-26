var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/sprite-sheet.ts
var sprite_sheet_exports = {};
__export(sprite_sheet_exports, {
  blob: () => blob,
  src: () => src,
  svg: () => svg
});
module.exports = __toCommonJS(sprite_sheet_exports);
globalThis.Blob = globalThis.Blob || class {
};
function blob() {
  return new globalThis.Blob(["_svgSheetString_"], { type: "image/svg+xml" });
}
function src() {
  return URL.createObjectURL(blob());
}
function svg() {
  return "";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blob,
  src,
  svg
});
