import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-dialog';

import { YpBaseElement } from '../common/yp-base-element.js';

import { Dialog } from '@material/mwc-dialog';
import { TextField } from '@material/mwc-textfield';

@customElement('yp-forgot-password')
export class YpForgotPassword extends YpBaseElement {
  @property({ type: String })
  emailErrorMessage: string | undefined;

  @property({ type: String })
  email = '';

  @property({ type: Boolean })
  emailHasBeenSent = false;

  @property({ type: Boolean })
  isSending = false;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog {
          padding-left: 8px;
          padding-right: 8px;
          width: 420px;
          background-color: #fff;
          z-index: 9999;
        }

        @media (max-width: 480px) {
          mwc-dialog {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog id="dialog">
        <h3>${this.t('user.forgotPassword')}</h3>

        <p ?hidden="${this.emailHasBeenSent}">
          ${this.t('user.forgotPasswordInstructions')}
        </p>

        <p ?hidden="${!this.emailHasBeenSent}">
          ${this.t('user.forgotPasswordEmailHasBeenSent')}
        </p>

        <mwc-textfield
          id="email"
          type="email"
          @keydown="${this._onEnter}"
          .label="${this.t('email')}"
          .value="${this.email}"
          ?hidden="${this.emailHasBeenSent}"
          .validationMessage="${this.emailErrorMessage || ''}">
        </mwc-textfield>

        <div
          class="buttons"
          ?hidden="${this.emailHasBeenSent}"
          slot="secondaryAction">
          <mwc-button .label="${this.t('cancel')}"></mwc-button>
          <mwc-button
            autofocus
            @click="${this._validateAndSend}"
            .label="${this.t('user.forgotPassword')}"></mwc-button>
        </div>

        <div class="buttons" ?hidden="${!this.emailHasBeenSent}">
          <mwc-button
            slot="primaryAction"
            .label="${this.t('ok')}"></mwc-button>
        </div>
      </mwc-dialog>
    `;
  }

  _onEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      event.stopPropagation();
      this._validateAndSend();
    }
  }

  async _validateAndSend() {
    const email = this.$$('#email') as TextField;
    if (email && email.checkValidity() && email.value) {
      if (!this.isSending) {
        this.isSending = true;

        await window.serverApi.forgotPassword({
          email: email.value,
        });

        this.isSending = false;
        window.appGlobals.notifyUserViaToast(
          this.t('user.forgotPasswordEmailHasBeenSent')
        );
        this.emailHasBeenSent = true;
      }
    } else {
      return false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      'yp-network-error',
      this._forgotPasswordError.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'yp-network-error',
      this._forgotPasswordError.bind(this)
    );
  }

  _forgotPasswordError(event: CustomEvent) {
    if (event.detail.errorId && event.detail.errorId == 'forgotPassword') {
      this.isSending = false;
    }
  }

  open(detail: { email: string }) {
    if (detail && detail.email) {
      this.email = detail.email;
    }

    (this.$$('#dialog') as Dialog).open = true;
  }

  close() {
    (this.$$('#dialog') as Dialog).open = false;
  }
}
