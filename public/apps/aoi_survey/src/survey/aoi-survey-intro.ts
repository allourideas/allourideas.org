import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers.js';

import '../@yrpri/common/yp-image.js';

import '@material/web/fab/fab.js'
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

    this.earl.configuration = {
      footerHtml: '<p>Footer HTML</p>',
      targetVotes: 100,
      lockResultsUntilTargetVotes: false,
    };

    this.earl.welcome_message =
//      "Dive into the world of Shakespeare and help us determine his most exceptional work! In this engaging survey, we are posing a single thought-provoking question: Which of Shakespeare's writings is the best, and why? Engage in a unique opportunity to evaluate a variety of his masterpieces and voice your preference through an innovative pairwise voting system. By participating, you're contributing to a broader understanding of Shakespeare's enduring impact on literature and culture.";
"Join our Shakespeare survey and help us identify his greatest work! We ask one compelling question: Which of Shakespeare's writings is the best and why? Participants will vote on their top picks using a pairwise voting system, fostering engaging discussion and shedding light on our collective view of Shakespeare's legacy."
    this.earl.logo_file_name =
      'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2009/3/9/1236638626755/Newly-Identified-portrait-001.jpg?width=465&quality=85&dpr=1&s=none';
  }

  static get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        .footerHtml {
          margin-top: 32px;
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
          margin-top: 16px;
          padding: 16px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
        }

        .image {
          width: 632px;
          height: 356px;
          margin-top: 32px;
        }

        @media (max-width: 960px) {
          .image {
            width: 332px;
            height: 187px;
          }

          .description {
            max-width: 300px;
          }

          .questionTitle {
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
    this.fire('startVoting');
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <yp-image
          class="column image"
          sizing="contain"
          src="${this.earl.logo_file_name}"
        ></yp-image>
        <div class="questionTitle">${this.question.name}</div>
        <div class="description">${unsafeHTML(this.formattedDescription)}</div>
        <md-fab
          extended
          class="fab"
          @click="${this.clickStart}"
          .label="${this.t('Start Voting')}"
        ><md-icon slot="icon">thumbs_up_down</md-fab>
        <div class="footerHtml">
          ${this.earl.configuration && this.earl.configuration.footerHtml
            ? unsafeHTML(this.earl.configuration.footerHtml)
            : nothing}
        </div>
      </div>
    `;
  }
}
