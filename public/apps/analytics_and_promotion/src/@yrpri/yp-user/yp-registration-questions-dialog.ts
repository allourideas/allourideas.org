import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-dialog';
import './yp-registration-questions.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import { Dialog } from '@material/mwc-dialog';
import { TextField } from '@material/mwc-textfield';
import { YpRegistrationQuestions } from './yp-registration-questions.js';

@customElement('yp-registration-questions-dialog')
export class YpRegistrationQuestionsDialog extends YpBaseElement {
  @property({ type: Object })
  registrationQuestionsGroup: YpGroupData | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog {
          background-color: #fff;
          width: 420px;
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

        .heading {
          font-size: 22px;
          font-weight: bold;
          text-align: center;
        }

        yp-registration-questions {
          margin-top: 0;
          min-height: 15px;
          margin-bottom: 16px;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog id="dialog" modal>
        <div class="heading">${this.t('registrationQuestionsInfo')}</div>

        <yp-registration-questions
          id="registrationQuestions"
          @dom-change="${this._questionsUpdated}"
          @question-changed="${this._questionsUpdated}"
          @resize-scroller="${this._questionsUpdated}"
          .group="${this.registrationQuestionsGroup}"
        ></yp-registration-questions>

        <div class="buttons">
          <mwc-button
            slot="primaryAction"
            .label="${this.t('save')}"
          ></mwc-button>
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

  _questionsUpdated() {
    setTimeout(() => {
      //this.$$("#scrollable").fire('iron-resize');
    }, 100);
  }

  async _validateAndSend() {
    const registrationQuestions = this.$$(
      '#registrationQuestions'
    ) as YpRegistrationQuestions;
    if (registrationQuestions.validate()) {
      window.appGlobals.activity('submit', 'registrationAnswers');
      //TODO: Check all serverApi for catch errors and how to handle that
      await window.appGlobals.serverApi.sendRegistrationQuestions(
        registrationQuestions.getAnswers()
      );
      window.appUser.setHasRegistrationAnswers();
      this.close();
    } else {
      this.fire('yp-open-notify-dialog', this.t('user.completeForm'));
      return false;
    }
  }

  open(registrationQuestionsGroup: YpGroupData) {
    this.registrationQuestionsGroup = registrationQuestionsGroup;
    (this.$$('#dialog') as Dialog).open = true;
  }

  close() {
    (this.$$('#dialog') as Dialog).open = false;
  }
}
