import { css, html } from 'lit';
import { property, customElement, query, queryAll } from 'lit/decorators.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { Layouts } from '../flexbox-literals/classes.js';

import '@material/web/dialog/dialog.js';
import { MdDialog } from '@material/web/dialog/dialog.js';

import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';

import '@material/mwc-textarea/mwc-textarea.js';
import { SharedStyles } from './SharedStyles';

@customElement('aoi-new-idea-dialog')
export class AoiNewIdeaDialog extends YpBaseElement {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Boolean })
  submitting = false;

  async connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  submit() {
    this.submitting = true;
  }

  @query('#dialog')
  dialog!: MdDialog;

  scrollUp() {
    //await this.updateComplete;
    setTimeout(() => {
      //@ts-ignore
      (this.$$('#dialog') as MdDialog).contentElement.scrollTop = 0;
    }, 100);
  }

  open() {
    this.dialog.show();
  }

  textAreaKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      return false;
    }
  }

  static get styles() {
    return [
      Layouts,
      SharedStyles,
      css`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        .indexNumber {
          margin-top: 12px;
          font-size: 20px;
          margin-left: 8px;
          margin-right: 8px;
          color: var(--md-sys-color-on-surface);
        }

        .cancelButton {
        }

        .header {
          text-align: center;
        }

        #dialog {
          width: 100%;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }

        .questionTitle {
          margin-top: 0;
          margin-bottom: 16px;
        }

        mwc-textarea {
          --mdc-theme-primary: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-primary-container);
          --mdc-text-field-label-ink-color: var(
            --md-sys-color-on-primary-container
          );
          --mdc-text-field-fill-color: var(--md-sys-color-primary-container);
          --mdc-text-field-ink-color: var(--md-sys-color-on-primary-container);
          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-on-primary-container
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-on-primary-container
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-on-primary-container
          );
          padding: 8px;
          margin-bottom: 8px;
          border-radius: 12px;
        }

        mwc-textarea.rounded {
          --mdc-shape-small: 4px;
        }

        .submitButton {
          margin-left: 8px;
        }


        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          .footer {
            margin-bottom: 8px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 12dkqwpo dkqwpo kqwpx;
          }

          .cancelButton {
            margin-right: 32px;
          }

          .header {
            padding: 8px;
            font-size: 22px;
          }

          #ideaText {
            width: 95%;
          }
        }
      `,
    ];
  }

  renderContent() {
    return html`
      <div class="questionTitle">${this.question.name}</div>
      <div class="layout horizontal center-center">
        <mwc-textarea
          id="ideaText"
          type="text"
          charCounter
          @keydown="${this.textAreaKeyDown}"
          maxLength="250"
          .rows="${this.wide ? 5 : 8}"
          label="${this.t('Your idea')}"
        >
        </mwc-textarea>
      </div>
    `;
  }

  renderFooter() {
    return html` <div class="layout horizontal footer">
      <md-text-button
        class="cancelButton"
        @click="${() => this.dialog.close()}"
        ?disabled="${this.submitting}"
      >
        ${this.t('Cancel')}
      </md-text-button>
      <md-outlined-button class="submitButton" @click="${this.submit}">
        ${this.t('Submit Idea')}
      </md-outlined-button>
    </div>`;
  }

  render() {
    return html`<md-dialog
      ?fullscreen="${!this.wide}"
      id="dialog"
      scrimClickAction=""
    >
      <div id="content">${this.renderContent()}</div>
      <div slot="footer">${this.renderFooter()}</div>
    </md-dialog> `;
  }
}
