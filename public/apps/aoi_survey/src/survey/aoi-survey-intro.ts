import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers.js';

import '../@yrpri/common/yp-image.js';

import '@material/web/fab/fab.js';
import { SharedStyles } from './SharedStyles.js';

@customElement('aoi-survey-intro')
export class AoiSurveyIntro extends YpBaseElement {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity('open', 'surveyIntro');
  }

  static get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        .footerHtml {
          margin: 32px;
          max-width: 600px;
          color: var(--md-sys-color-on-surface-variant);
        }

        .fab {
          margin-top: 0;
          margin-bottom: 8px;
        }

        .description {
          font-size: 16px;
          letter-spacing: 0.04em;
          line-height: 1.6;
          border-radius: 8px;
          max-width: 600px;
          vertical-align: center;
          margin-bottom: 32px;
          margin-top: 8px;
          padding: 16px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
        }

        .image {
          width: 632px;
          height: 356px;
          margin-top: 32px;
        }

        .questionTitle[dark-mode] {
          margin-bottom: 16px;
          margin-top: 24px;
        }

        @media (max-width: 960px) {
          .image {
            width: 332px;
            height: 187px;
          }

          .description {
            max-width: 300px;
            margin-top: 0px;
          }
          .questionTitle[dark-mode] {
            margin-bottom: 16px;
            margin-top: 24px;
          }
        }
      `,
    ];
  }

  get formattedDescription() {
    return (this.earl.welcome_message || '').replace(/(\n)/g, '<br>');
  }

  clickStart() {
    window.appGlobals.activity('click', 'startFromIntro');
    this.fire('startVoting');
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <yp-image
          class="column image"
          sizing="contain"
          src="${this.earl.configuration.temp_logo_url}"
        ></yp-image>
        <div class="questionTitle" ?dark-mode="${this.themeDarkMode}">${
      this.question.name
    }</div>
        <div class="description">${unsafeHTML(this.formattedDescription)}</div>
        <md-fab
          extended
          class="fab"
          @click="${this.clickStart}"
          .label="${this.t('Start Voting')}"
        ><md-icon slot="icon">thumbs_up_down</md-fab>
        <div class="footerHtml">
          ${
            this.earl.configuration && this.earl.configuration.welcome_html
              ? unsafeHTML(this.earl.configuration.welcome_html)
              : nothing
          }
        </div>
      </div>
    `;
  }
}
