import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/mwc-circular-progress-four-color';
import '@material/mwc-button';

import '@material/mwc-textfield';
import '@material/mwc-dialog';

import { Dialog } from '@material/mwc-dialog';
import { TextField } from '@material/mwc-textfield';

@customElement('yp-reset-password')
export class YpResetPassword extends YpBaseElement {
  @property({ type: String })
  password = '';

  @property({ type: String })
  token = '';

  @property({ type: String })
  passwordErrorMessage = '';

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
      <mwc-dialog id="dialog" modal>
        <h3>${this.t('user.resetPassword')}</h3>

        <p>${this.t('user.resetPasswordInstructions')}</p>

        <mwc-textfield
          id="password"
          @keydown="${this.onEnter}"
          type="password"
          .label="${this.t('password')}"
          .value="${this.password}"
          autocomplete="off"
          .validationMessage="${this.passwordErrorMessage}">
        </mwc-textfield>

        <div class="buttons">
          <mwc-button @click="${this._cancel}" slot="secondaryAction"
            >${this.t('cancel')}</mwc-button
          >
          <mwc-button
            autofocus
            @click="${this._validateAndSend}"
            slot="primaryAction"
            >${this.t('user.resetPassword')}</mwc-button
          >
        </div>
      </mwc-dialog>
    `;
  }

  onEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      event.stopPropagation();
      this._validateAndSend();
    }
  }

  async _validateAndSend() {
    const passwordField = this.$$('#password') as TextField;
    if (passwordField && passwordField.checkValidity() && passwordField.value) {
      const response = await window.serverApi.resetPassword(this.token, {
        password: passwordField.value,
      });

      //TODO Figure out the error here and test if it works
      if (response.error && response.error == 'not_found') {
        this.fire('yp-error', this.t('errorResetTokenNotFoundOrUsed'));
      } else {
        this.close();
        window.appGlobals.notifyUserViaToast(
          this.t('notification.passwordResetAndLoggedIn')
        );
        this._loginCompleted(response);
        window.location.href = '/';
      }
    }
  }

  _cancel() {
    window.location.href = '/';
  }

  _loginCompleted(user: YpUserData) {
    window.appUser.setLoggedInUser(user);
  }

  open(token: string) {
    if (token) this.token = token;
    (this.$$('#dialog') as Dialog).open = true;
  }

  close() {
    (this.$$('#dialog') as Dialog).open = false;
  }
}
