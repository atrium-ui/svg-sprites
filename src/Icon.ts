import { LitElement, css } from "lit";

let svgSheetUrl = "";

export class SvgIcon extends LitElement {
  static get styles() {
    return css`
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

  static get properties() {
    return {
      icon: {
        type: String,
      },
    };
  }

  static src() {
    if (!svgSheetUrl) svgSheetUrl = URL.createObjectURL(svgSheetBlob);
    return svgSheetUrl;
  }

  public icon?: string;

  protected render() {
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

customElements.define("svg-icon", SvgIcon);
