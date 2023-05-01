import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';


import { YpBaseElement } from '../common/yp-base-element.js';
import { Dialog } from '@material/mwc-dialog';

import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon';

import '../yp-app/yp-language-selector.js';
import { YpLanguageSelector } from '../yp-app/yp-language-selector.js';

@customElement('yp-autotranslate-dialog')
export class YpAutoTranslateDialog extends YpBaseElement {
  @property({ type: String })
  confirmationText: string | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog {
          background-color: #fff;
          max-width: 400px;
        }

        mwc-icon {
          color: var(--accent-color);
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
        }

        .infoText {
          font-size: 18px;
          margin-bottom: 8px;
        }
      `,
    ];
  }

  render() {
    return html`
      <yp-language-selector hidden id="languageSelector"></yp-language-selector>

      <mwc-dialog id="dialog">
        <div class="layout vertical center-center">
          <div><mwc-icon>translate</mwc-icon></div>
          <div class="infoText">${this.t('shouldAutoTranslateInfo')}</div>
        </div>
        <div class="buttons">
          <mwc-button
            @click="${this._dontAskAgain}"
            slot="secondaryAction"
            .label="${this.t('never')}"></mwc-button>
          <mwc-button
            slot="secondaryAction"
            @click="${this._no}"
            .label="${this.t('no')}"></mwc-button>
          <mwc-button
            slot="primaryAction"
            @click="${this._startAutoTranslate}"
            .label="${this.t('yes')}"></mwc-button>
          <mwc-button
            slot="primaryAction"
            @click="${this._startAutoTranslateAndDoSoAlways}"
            .label="${this.t('always')}"></mwc-button>
        </div>
      </mwc-dialog>
    `;
  }

  _no() {
    sessionStorage.setItem('dontPromptForAutoTranslation', 'true');
  }

  _dontAskAgain() {
    localStorage.setItem('dontPromptForAutoTranslation', 'true');
  }

  _startAutoTranslateAndDoSoAlways() {
    this._startAutoTranslate();
    localStorage.setItem('alwaysStartAutoTranslation', 'true');
  }

  _startAutoTranslate() {
    (this.$$('#languageSelector') as YpLanguageSelector).startTranslation();
  }

  openLaterIfAutoTranslationEnabled() {
    setTimeout(() => {
      if ((this.$$('#dialog') as Dialog).open === false) {
        if (
          (this.$$('#languageSelector') as YpLanguageSelector)
            .canUseAutoTranslate === true &&
          window.appGlobals.autoTranslate !== true
        ) {
          if (localStorage.getItem('alwaysStartAutoTranslation') != null) {
            this._startAutoTranslate();
          } else {
            (this.$$('#dialog') as Dialog).open = true;
          }
        }
      }
    }, 750);
  }
}
