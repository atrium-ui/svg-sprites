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

  static get styles() {
    return /*css*/ `
      :host {
        margin: 0 2px;
        display: inline-block;
        color: inherit;
        vertical-align: sub;
      }
      svg {
        display: block;
        width: 1em;
        height: 1em;
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

  attributeChangedCallback(): void {
    this.update();
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: "open" });

      shadow.innerHTML = `<svg>${this.render()}</svg>`;

      if (supportsAdoptingStyleSheets) {
        shadow.adoptedStyleSheets = [SvgIcon.getStyleSheet()];
      } else {
        const style = document.createElement("style");
        style.textContent = SvgIcon.styles;
        shadow.appendChild(style);
      }
    }
  }

  public get icon(): string | null {
    return this.getAttribute("icon");
  }

  public set icon(icon: string | null) {
    if (icon !== null) this.setAttribute("icon", icon);
  }

  private update() {
    if (!this.svg) this.svg = this.shadowRoot?.querySelector("svg");
    this.svg && (this.svg.innerHTML = this.render());
  }

  private render() {
    return `<use xlink:href="${svgSheetUrl}${"#" + this.icon}"></use>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": SvgIcon;
  }
}

if ("customElements" in globalThis) customElements.define("svg-icon", SvgIcon);
