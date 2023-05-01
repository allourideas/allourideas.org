import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleStyles } from './plausibleStyles';
import { PlausibleBaseElement } from './pl-base-element';

@customElement('pl-link')
export class PlausibleLink extends PlausibleBaseElement {
  @property({ type: String })
  to: string | undefined = undefined;

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
      `,
    ];
  }

  get currentUri() {
    return `${location.pathname}?${this.to!.search}`;
  }

  onClick(e: Event) {
    e.preventDefault();
    window.history.pushState({}, '', this.currentUri);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('popstate'));
    });
    //window.history.forward();
  }

  render() {
    return html`<a href="${this.currentUri}" @click="${this.onClick}"
      ><slot></slot
    ></a> `;
  }
}
