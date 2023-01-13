let svgSheetUrl = "";
let svgSheetBlob: Blob;
let supportsAdoptingStyleSheets = true;

if (typeof window !== "undefined") {
  svgSheetBlob = new Blob(["_svgSheetString_"], { type: "image/svg+xml" });
  svgSheetUrl = URL.createObjectURL(svgSheetBlob);

  supportsAdoptingStyleSheets =
    globalThis.ShadowRoot &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!("HTMLElement" in globalThis)) globalThis.HTMLElement = class {};

export class SvgIcon extends HTMLElement {
  static sheet?: CSSStyleSheet;

  private svg?: SVGElement | null;
  private use?: SVGUseElement | null;

  static get styles() {
    return /*css*/ `
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

  static getStyleSheet(): CSSStyleSheet {
    if (!SvgIcon.sheet) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(SvgIcon.styles);
      SvgIcon.sheet = sheet;
    }
    return SvgIcon.sheet;
  }

  static get observedAttributes() {
    return ["icon"];
  }

  public get icon(): string | null {
    return this.getAttribute("icon");
  }

  public set icon(icon: string | null) {
    if (icon !== null) this.setAttribute("icon", icon);
  }

  private update() {
    this.use && this.use.setAttribute("href", svgSheetUrl + "#" + this.icon);
  }

  attributeChangedCallback(): void {
    this.update();
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    this.svg.append(this.use);
    shadow.append(this.svg);

    if (supportsAdoptingStyleSheets) {
      shadow.adoptedStyleSheets = [SvgIcon.getStyleSheet()];
    } else {
      const style = document.createElement("style");
      style.textContent = SvgIcon.styles;
      shadow.appendChild(style);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": SvgIcon;
  }
}

if ("customElements" in globalThis) customElements.define("svg-icon", SvgIcon);
