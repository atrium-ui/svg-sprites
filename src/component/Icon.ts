let svgSheetUrl = "";
const _svgSheetBlob_: string | Blob = "_svgSheetBlob_";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!globalThis.HTMLElement) globalThis.HTMLElement = class {};

export class SvgIcon extends HTMLElement {
  static sheet?: CSSStyleSheet;

  static getStyleSheet(): CSSStyleSheet {
    if (!SvgIcon.sheet) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(this.styles);
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
      shadow.adoptedStyleSheets = [SvgIcon.getStyleSheet()];
      this.update();
    }
  }

  public get icon(): string | null {
    return this.getAttribute("icon");
  }

  public set icon(icon: string | null) {
    if (icon !== null) this.setAttribute("icon", icon);
  }

  private static src() {
    if (!svgSheetUrl && _svgSheetBlob_ instanceof Blob)
      svgSheetUrl = URL.createObjectURL(_svgSheetBlob_);

    return svgSheetUrl;
  }

  private static get styles(): string {
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

  private update() {
    this.shadowRoot
      ? (this.shadowRoot.innerHTML = `
      <svg><use xlink:href="${SvgIcon.src()}${"#" + this.icon}"></use></svg>
    `)
      : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": SvgIcon;
  }
}

if (globalThis.customElements) customElements.define("svg-icon", SvgIcon);
