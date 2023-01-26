// src/sprite-sheet.ts
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
export {
  blob,
  src,
  svg
};
