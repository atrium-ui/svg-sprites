import { svg } from "svg-sprites/sheet";

let svgSheet: HTMLDivElement;
let supportsAdoptingStyleSheets = true;
let loaded: Promise<void>;

async function loadSvgSheet() {
  svgSheet = document.createElement("div");
  svgSheet.innerHTML = await svg();
}

if (typeof window !== "undefined") {
  loaded = loadSvgSheet();

  supportsAdoptingStyleSheets =
    globalThis.ShadowRoot &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype;
}

export class FraIcon extends HTMLElement {
  static sheet?: CSSStyleSheet;

  static elementProperties = new Map([["name", { type: String, reflect: true }]]);

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
    if (!FraIcon.sheet) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(FraIcon.styles);
      FraIcon.sheet = sheet;
    }
    return FraIcon.sheet;
  }

  static get observedAttributes() {
    return ["name"];
  }

  public get name(): SvgIconName | null {
    return this.getAttribute("name") as SvgIconName;
  }

  public set name(icon: SvgIconName | null) {
    if (icon !== null) this.setAttribute("name", icon);
  }

  async attributeChangedCallback() {
    await loaded;

    const symbol = svgSheet.querySelector(`#${this.name?.replace(/\//g, "\\/")}`);

    if (this.shadowRoot && symbol) {
      this.shadowRoot.innerHTML = /*html*/ `
        <svg viewBox="${symbol.getAttribute("viewBox")}" aria-hidden="true">
          ${symbol.innerHTML}
        </svg>
      `;
    }
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    if (supportsAdoptingStyleSheets) {
      shadow.adoptedStyleSheets = [FraIcon.getStyleSheet()];
    } else {
      const style = document.createElement("style");
      style.textContent = FraIcon.styles;
      shadow.appendChild(style);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": FraIcon;
  }
}

if ("customElements" in globalThis && !customElements.get("svg-icon")) {
  customElements.define("svg-icon", FraIcon);
}
