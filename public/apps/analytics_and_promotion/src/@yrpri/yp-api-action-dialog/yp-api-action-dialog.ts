import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/mwc-button';
import '@material/mwc-dialog';

import { YpBaseElement } from '../common/yp-base-element.js';
import { Dialog } from '@material/mwc-dialog';

@customElement('yp-api-action-dialog')
export class YpApiActionDialog extends YpBaseElement {
  @property({ type: String })
  action: string | undefined;

  @property({ type: String })
  method: string | undefined;

  @property({ type: String })
  confirmationText: string | undefined;

  @property({ type: String })
  confirmButtonText: string | undefined;

  @property({ type: Object })
  onFinishedFunction: Function | undefined;

  @property({ type: Boolean })
  finalDeleteWarning = false;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog {
          background-color: #fff;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog id="confirmationDialog" @close="${this._onClose}">
        <div>${this.confirmationText}</div>
         <mwc-button
            slot="secondaryAction"
            dialogAction="cancel"
            .label="${this.t('cancel')}"></mwc-button>
          <mwc-button
            slot="primaryAction"
            dialogAction="accept"
            @click="${this._delete}"
            .label="${this.confirmButtonText || ''}"></mwc-button>
      </mwc-dialog>
    `;
  }

  _onClose() {
    this.fire('close');
  }

  setup(
    action: string,
    confirmationText: string,
    onFinishedFunction: Function | undefined = undefined,
    confirmButtonText: string | undefined = undefined,
    method: string | undefined = undefined
  ) {
    this.action = action;
    this.confirmationText = confirmationText;
    this.onFinishedFunction = onFinishedFunction;
    if (confirmButtonText) {
      this.confirmButtonText = confirmButtonText;
    } else {
      this.confirmButtonText = this.t('delete');
    }
    if (method) {
      this.method = method;
    } else {
      this.method = 'DELETE';
    }
  }

  open(options: { finalDeleteWarning: boolean } | undefined = undefined) {
    if (options && options.finalDeleteWarning) {
      this.finalDeleteWarning = true;
    }
    (this.$$('#confirmationDialog') as Dialog).open = true;
  }

  async _delete() {
    if (!this.finalDeleteWarning && this.action && this.method) {
      const response = await window.serverApi.apiAction(this.action, this.method, { deleteConfirmed: true })
      this.fire('api-action-finished');
      if (this.onFinishedFunction) {
        this.onFinishedFunction(response);
      }
    } else {
      this.finalDeleteWarning = false;
      this.confirmationText = this.t('finalDeleteWarning');
      (this.$$('#confirmationDialog') as Dialog).open = true;
    }
  }
}
