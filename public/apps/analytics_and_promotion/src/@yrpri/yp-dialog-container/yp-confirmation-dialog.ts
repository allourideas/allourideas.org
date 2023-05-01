import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { Dialog } from '@material/mwc-dialog';

import '@material/mwc-dialog';
import '@material/mwc-button';

@customElement('yp-confirmation-dialog')
export class YpConfirmationDialog extends YpBaseElement {
  @property({ type: String })
  confirmationText: string | undefined;

  @property({ type: Object })
  onConfirmedFunction: Function | undefined;

  @property({ type: Boolean })
  useFinalWarning = false;

  @property({ type: Boolean })
  haveIssuedFinalWarning = false;

  @property({ type: Boolean })
  hideCancel = false;

  static get styles() {
    return [
      css`
        mwc-dialog {
          background-color: #fff;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog id="confirmationDialog">
        <div>${this.confirmationText}</div>
        <mwc-button
          ?hidden="${this.hideCancel}"
          @click="${this._reset}"
          slot="secondaryAction"
          .label="${this.t('cancel')}"></mwc-button>
        <mwc-button
          @click="${this._confirm}"
          slot="primaryAction"
          .label="${this.t('confirm')}"></mwc-button>
      </mwc-dialog>
    `;
  }

  _reset() {
    this.confirmationText = undefined;
    this.onConfirmedFunction = undefined;
    this.haveIssuedFinalWarning = false;
    this.useFinalWarning = false;
    this.hideCancel = false;
  }

  open(
    confirmationText: string,
    onConfirmedFunction: Function | undefined,
    useModal = false,
    useFinalWarning = false,
    hideCancel = false
  ) {
    this.confirmationText = confirmationText;
    this.onConfirmedFunction = onConfirmedFunction;
    if (useModal) {
      //TODO: Implrement when ready
      //(this.$$('#confirmationDialog') as Dialog).modal = true;
    } else {
      //TODO: Implrement when ready
      //(this.$$('#confirmationDialog') as Dialog).modal = false;
    }
    (this.$$('#confirmationDialog') as Dialog).open = true;
    if (useFinalWarning) {
      this.useFinalWarning = true;
    } else {
      this.useFinalWarning = false;
    }
    this.haveIssuedFinalWarning = false;
    if (hideCancel) {
      this.hideCancel = true;
    } else {
      this.hideCancel = false;
    }
  }

  _confirm() {
    if (this.useFinalWarning && !this.haveIssuedFinalWarning) {
      this.haveIssuedFinalWarning = true;
      (this.$$('#confirmationDialog') as Dialog).open = false;
      this.confirmationText = this.t('finalDeleteWarning');
      setTimeout(() => {
        (this.$$('#confirmationDialog') as Dialog).open = true;
      });
    } else {
      if (this.onConfirmedFunction) {
        this.onConfirmedFunction();
        this._reset();
      }
    }
  }
}
