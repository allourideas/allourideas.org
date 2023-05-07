import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers.js';

import '../@yrpri/common/yp-image.js';

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
      css`
        .footerHtml {
          margin-top: 32px;
          max-width: 600px;
          color: var(--md-sys-color-on-surface-variant);
        }

        .title {
          padding: 18px;
          font-family: monospace;
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          padding: 16px;
          text-align: center;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .fab {
          margin-top: 24px;
        }

        .description {
          font-family: monospace;
          font-size: 16px;
          letter-spacing: 0.04em;
          line-height: 1.6;
          border-radius: 8px;
          max-width: 600px;
          vertical-align: center;
          margin-bottom: 32px;
          margin-top: 24px;
          padding: 16px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
        }

        .image {
          width: 632px;
          height: 356px;
        }

        @media (max-width: 960px) {
          .image {
            width: 332px;
            height: 187px;
          }

          .description {
            max-width: 300px;
          }

          .title {
            margin-left: 16px;
            margin-right: 16px;
            margin-bottom: 32px;
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
    this.fire('start');
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <div class="title">${this.question.name}</div>
        <yp-image
          class="column image"
          sizing="contain"
          src="${YpMediaHelpers.getImageFormatUrl(this.earl.logo_file_name, 0)}"
        ></yp-image>
        <md-fab-extended
          icon="rocket"
          class="fab"
          @click="${this.clickStart}"
          .label="${this.t('Start')}"
        ></md-fab-extended>
        <div class="description">${unsafeHTML(this.formattedDescription)}</div>
        <div class="footerHtml">
          ${this.earl.configuration && this.earl.configuration.footerHtml
            ? unsafeHTML(this.earl.configuration.footerHtml)
            : nothing}
        </div>
      </div>
    `;
  }
}
