globalThis.Blob = globalThis.Blob || class {};

module.exports = {
  blob() {
    return new globalThis.Blob(["_svgSheetString_"], { type: "image/svg+xml" });
  },

  src() {
    return URL.createObjectURL(blob());
  },
};
