import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('pl-fade-in')
export class PlausibleFadeIn extends LitElement {
  @property({ type: Boolean })
  show = false;

  @property({ type: String })
  myClassName: string | undefined;

  render() {
    return html`
      <div
        class="${`${this.myClassName || ''} ${
          this.show ? 'fade-enter-active' : 'fade-enter'
        }`}"
      >
        <slot></slot>
      </div>
    `;
  }
}
