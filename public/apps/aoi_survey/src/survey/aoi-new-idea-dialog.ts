import { css, html } from 'lit';
import { property, customElement, query, queryAll } from 'lit/decorators.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { Layouts } from '../flexbox-literals/classes.js';

import '@material/web/dialog/dialog.js';
import { MdDialog } from '@material/web/dialog/dialog.js';

import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/circularprogress/circular-progress.js';

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

  @property({ type: String })
  currentError: string | undefined;

  @query('#ideaText')
  ideaText!: HTMLInputElement;

  async connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  async submit() {
    this.currentError = undefined;
    this.submitting = true;
    let addIdeaResponse;
    try {
      addIdeaResponse = await window.aoiServerApi.submitIdea(
        this.question.id,
        this.ideaText.value
      );
    } catch (error: any) {
      console.error(error);
    }
    this.submitting = false;
    if (!addIdeaResponse || addIdeaResponse.error) {
      this.currentError = this.t('An error occurred. Please try again.');
    } else if (addIdeaResponse.flagged) {
      this.currentError = this.t(
        'Your idea has been flagged as inappropriate. Please try again.'
      );
    } else {
      this.ideaText.value = '';
      if (addIdeaResponse.active) {
        this.fire(
          'display-snackbar',
          this.t('Your idea has been added, you can continue voting.')
        );
      } else {
        this.fire(
          'display-snackbar',
          this.t('Your idea is in a moderation queue.')
        );
      }

      this.dialog.close();
    }
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
    this.currentError = undefined;
  }

  cancel() {
    this.dialog.close();
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

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
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
          line-height: normal;
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

        .error {
          color: var(--md-sys-color-error);
          font-size: 16px;
          margin: 8px;
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
      <div class="layout vertical center-center">
        <mwc-textarea
          id="ideaText"
          type="text"
          charCounter
          @keydown="${this.textAreaKeyDown}"
          maxLength="140"
          .rows="${this.wide ? 3 : 5}"
          label="${this.t('Your idea')}"
        >
        </mwc-textarea>
        <div class="error" ?hidden="${!this.currentError}">
          ${this.currentError}
        </div>
      </div>
    `;
  }

  renderFooter() {
    return html` <div class="layout horizontal footer">
      <md-circular-progress
        ?hidden="${!this.submitting}"
        indeterminate
      ></md-circular-progress>
      <md-text-button
        class="cancelButton"
        @click="${this.cancel}"
        ?disabled="${this.submitting}"
      >
        ${this.t('Cancel')}
      </md-text-button>
      <md-outlined-button
        class="submitButton"
        @click="${this.submit}"
        ?disabled="${this.submitting}"
      >
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
