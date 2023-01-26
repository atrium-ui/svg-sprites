declare class SvgIcon extends HTMLElement {
    static sheet?: CSSStyleSheet;
    private svg?;
    private use?;
    static get styles(): string;
    static getStyleSheet(): CSSStyleSheet;
    static get observedAttributes(): string[];
    get icon(): string | null;
    set icon(icon: string | null);
    get width(): string | null;
    set width(width: string | null);
    get height(): string | null;
    set height(height: string | null);
    get size(): string | null;
    set size(size: string | null);
    private update;
    attributeChangedCallback(): void;
    constructor();
}
declare global {
    interface HTMLElementTagNameMap {
        "svg-icon": SvgIcon;
    }
}

export { SvgIcon };
