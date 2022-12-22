import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
// @ts-ignore
import svgSheetUrl from "svg-sprite:sheet";

export class SvgIcon extends LitElement {
  static get styles() {
    return css`
      :host {
        color: inherit;
        display: inline-block;
      }

      .icon {
        color: inherit;
        width: 1em;
        height: 1em;
      }
    `;
  }

  @property({ type: String })
  public name?: string;

  get src() {
    return svgSheetUrl + "#" + this.name;
  }

  render() {
    return html`
      ${unsafeHTML(`
        <svg class="icon">
          <use xlink:href="${this.src}"></use>
        </svg>
      `)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "svg-icon": SvgIcon;
  }
}

customElements.define("svg-icon", SvgIcon);
