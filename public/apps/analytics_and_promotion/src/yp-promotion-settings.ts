import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import 'vanilla-colorful';
@customElement('yp-promotion-settings')
export class YpPromotionSettings extends YpBaseElementWithLogin {
  @property({ type: String })
  color: string | undefined;

  connectedCallback() {
    super.connectedCallback();
    const savedColor = localStorage.getItem('md3-yrpri-promotion-color');
    if (savedColor) {
      this.color = savedColor;
    } else {
      this.color = '#000000';
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        .topContainer {
          margin-top: 32px;
        }

        .header {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 32px;
        }
      `,
    ];
  }

  render() {
    if (this.color) {
      return html`
        <div class="topContainer layout vertical center-center">
          <div class="header">${this.t('setThemeColor')}</div>
          <hex-color-picker
            .color="${this.color}"
            @color-changed="${this.handleColorChanged}"
          ></hex-color-picker>
        </div>
      `;
    }
  }

  handleColorChanged(event: CustomEvent) {
    this.color = event.detail.value;
    this.fire('color-changed', { value: this.color });
    localStorage.setItem('md3-yrpri-promotion-color', this.color!);
  }
}
