var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/component/Icon.ts
var svgSheetUrl = "";
var svgSheetBlob;
var supportsAdoptingStyleSheets = true;
if (typeof window !== "undefined") {
  svgSheetBlob = new Blob(["_svgSheetString_"], { type: "image/svg+xml" });
  svgSheetUrl = URL.createObjectURL(svgSheetBlob);
  supportsAdoptingStyleSheets = globalThis.ShadowRoot && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
}
if (!("HTMLElement" in globalThis))
  globalThis.HTMLElement = class {
  };
var _SvgIcon = class extends HTMLElement {
  svg;
  use;
  static get styles() {
    return `
      :host {
        margin: 0 2px 0.1em 2px;
        color: inherit;
        display: inline-block;
        vertical-align: middle;
        aspect-ratio: 1 / 1;
        width: 1em;
        height: 1em;
      }

      svg {
        display: block;
        width: inherit;
        height: inherit;
      }
    `;
  }
  static getStyleSheet() {
    if (!_SvgIcon.sheet) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(_SvgIcon.styles);
      _SvgIcon.sheet = sheet;
    }
    return _SvgIcon.sheet;
  }
  static get observedAttributes() {
    return ["icon"];
  }
  get icon() {
    return this.getAttribute("icon");
  }
  set icon(icon) {
    if (icon !== null)
      this.setAttribute("icon", icon);
  }
  get width() {
    return this.getAttribute("width");
  }
  set width(width) {
    if (width !== null)
      this.setAttribute("width", width);
  }
  get height() {
    return this.getAttribute("height");
  }
  set height(height) {
    if (height !== null)
      this.setAttribute("height", height);
  }
  get size() {
    return this.getAttribute("size");
  }
  set size(size) {
    if (size !== null)
      this.setAttribute("size", size);
  }
  update() {
    const size = this.size;
    if (size) {
      this.svg?.setAttribute("width", size);
      this.svg?.setAttribute("height", size);
    } else {
      this.svg?.setAttribute("width", this.width || "");
      this.svg?.setAttribute("height", this.height || "");
    }
    this.use && this.use.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      svgSheetUrl + "#" + this.icon
    );
  }
  attributeChangedCallback() {
    this.update();
  }
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.svg.setAttributeNS(
      "http://www.w3.org/2000/svg",
      "xmlns:xlink",
      "http://www.w3.org/1999/xlink"
    );
    this.svg.append(this.use);
    shadow.append(this.svg);
    if (supportsAdoptingStyleSheets) {
      shadow.adoptedStyleSheets = [_SvgIcon.getStyleSheet()];
    } else {
      const style = document.createElement("style");
      style.textContent = _SvgIcon.styles;
      shadow.appendChild(style);
    }
  }
};
var SvgIcon = _SvgIcon;
__publicField(SvgIcon, "sheet");
if ("customElements" in globalThis)
  customElements.define("svg-icon", SvgIcon);
export {
  SvgIcon
};
