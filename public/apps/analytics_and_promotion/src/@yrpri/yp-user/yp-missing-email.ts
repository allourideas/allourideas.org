import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-dialog';

import { YpBaseElement } from '../common/yp-base-element.js';

import { Dialog } from '@material/mwc-dialog';
import { TextField } from '@material/mwc-textfield';


@customElement('yp-missing-email')
export class YpMissingEmail extends YpBaseElement {
  @property({ type: String })
  emailErrorMessage: string | undefined;

  @property({ type: String })
  passwordErrorMessage: string | undefined;

  @property({ type: Boolean })
  needPassword = false;

  @property({ type: Boolean })
  linkAccountText = false;

  @property({ type: Boolean })
  onlyConfirmingEmail = false;

  @property({ type: String })
  originalConfirmationEmail: string | undefined;

  @property({ type: String })
  email: string | undefined;

  @property({ type: String })
  password: string | undefined;

  @property({ type: String })
  heading: string | undefined;

  @property({ type: Object })
  target: HTMLElement | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog {
          background-color: #fff;
          width: 420px;
        }

        .linkAccounts {
          padding-top: 16px;
        }

        @media (max-width: 480px) {
          mwc-dialog {
            padding: 0;
            margin: 0;
            width: 100%;
          }
        }

        [hidden] {
          display: none !important;
        }

        .buttons {
          margin-bottom: 8px;
          margin-right: 4px;
          text-align: center;
        }

        .setEmailInfo {
          font-size: 16px;
          font-weight: bold;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="outer">
        <mwc-dialog id="dialog">
          <h2>${this.heading}</h2>
          <div class="setEmailInfo">
            <span ?hidden="${!this.onlyConfirmingEmail}"
              >${this.t('user.setEmailConfirmationInfo')}</span
            >
            <span ?hidden="${this.onlyConfirmingEmail}"
              >${this.t('user.setEmailInfo')}</span
            >
          </div>
          <mwc-textfield
            id="email"
            @keydown="${this._onEnter}"
            type="email"
            .label="${this.t('user.email')}"
            .value="${this.email || ''}"
            .validationMessage="${this.emailErrorMessage || ''}">
          </mwc-textfield>

          ${this.needPassword
            ? html`
                <div class="linkAccounts">
                  ${this.t('user.existsLinkAccountInfo')}
                </div>
                <mwc-textfield
                  id="password"
                  type="password"
                  .label="${this.t('user.password')}"
                  .value="${this.password || ''}"
                  autocomplete="off"
                  .validationMessage="${this.passwordErrorMessage || ''}">
                </mwc-textfield>
              `
            : nothing}
          <div class="buttons">
            <mwc-button
              slot="secondaryAction"
              @click="${this._logout}"
              .label="${this.t('user.logout')}"
              ?hidden="${this.onlyConfirmingEmail}"></mwc-button>
            <mwc-button
              slot="secondaryAction"
              @click="${this._forgotPassword}"
              ?hidden="${!this.needPassword}"
              .label="${this.t('user.newPassword')}"></mwc-button>
            <mwc-button
              raised
              slot="secondaryAction"
              @click="${this._notNow}"
              .label="${this.t('later')}"
              ?hidden="${this.onlyConfirmingEmail}"></mwc-button>
            <mwc-button
              raised
              slot="primaryAction"
              id="sendButton"
              autofocus
              .label="${this.submitButtonLabel}"
              @click="${this._validateAndSend}">
            </mwc-button>
          </div>
        </mwc-dialog>
      </div>
    `;
  }

  get submitButtonLabel() {
    if (!this.linkAccountText) {
      if (this.onlyConfirmingEmail) {
        return this.t('confirm');
      } else {
        return this.t('user.setEmail');
      }
    } else {
      return this.t('user.linkAccount');
    }
  }

  _onEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this._validateAndSend();
    }
  }

  _notNow() {
    window.appGlobals.activity('cancel', 'setEmail');
    (this.$$('#dialog') as Dialog).open = false;
  }

  _logout() {
    window.appGlobals.activity('logout', 'setEmail');
    window.appUser.logout();
  }

  _forgotPassword() {
    window.appGlobals.activity('open', 'forgotPasswordFromSetEmail');
    this.fireGlobal('yp-forgot-password', { email: this.email });
  }

  connectedCallback() {
    super.connectedCallback();
    this.heading = this.t('user.setEmail');
  }

  get credentials() {
    const email = this.$$('#email') as TextField;
    const password = this.$$('#password') as TextField;

    return {
      email: email.value,
      password: password ? password.value : undefined,
    };
  }

  async _validateAndSend() {
    const email = this.$$('#email') as TextField;
    const password = this.$$('#password') as TextField;

    if (email && email.checkValidity()) {
      if (
        this.needPassword &&
        password &&
        password.checkValidity() &&
        password.value
      ) {
        window.appGlobals.activity('confirm', 'linkAccountsAjax');

        const response = (await window.serverApi.linkAccounts(
          this.credentials
        )) as YpLinkAccountResponse;

        if (response.accountLinked) {
          window.appGlobals.notifyUserViaToast(
            this.t('userHaveLinkedAccounts') + ' ' + response.email
          );
          window.appUser.checkLogin();
          this.close();
        } else {
          this.fire('yp-error', this.t('user.loginNotAuthorized'));
        }

        //TODO: Do we need this?
        //this.$$('#dialog').fire('iron-resize');
      } else {
        window.appGlobals.activity('confirm', 'setEmail');
        if (
          !this.originalConfirmationEmail ||
          this.originalConfirmationEmail != email.value
        ) {
          const response = (await window.serverApi.setEmail({
            email: email.value,
          })) as YpSetEmailResponse;
          if (response && response.alreadyRegistered) {
            this.needPassword = true;
            this.heading = this.t('user.linkAccount');
            this.linkAccountText = true;
          } else {
            window.appGlobals.notifyUserViaToast(
              this.t('userHaveSetEmail') + ' ' + response.email
            );
            this.close();
          }
          //TODO: If we need this
          //this.$$('#dialog').fire('iron-resize');
        } else {
          window.appGlobals.notifyUserViaToast(
            this.t('userHaveSetEmail') + ' ' + email.value
          );
          this.close();
        }
      }
    } else {
      this.fire('yp-error', this.t('user.completeForm'));
      return false;
    }
  }

  open(onlyConfirming: boolean, email: string) {
    this.onlyConfirmingEmail = onlyConfirming;
    if (email) {
      this.email = email;
      this.originalConfirmationEmail = email;
    }
    (this.$$('#dialog') as Dialog).open = false;
    if (this.onlyConfirmingEmail) {
      window.serverApi.confirmEmailShown();
    }
  }

  close() {
    (this.$$('#dialog') as Dialog).open = false;
  }
}
