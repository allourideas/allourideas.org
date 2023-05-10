import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { SharedStyles } from './SharedStyles.js';

import '@material/web/checkbox/checkbox.js';
import { Checkbox } from '@material/web/checkbox/lib/checkbox.js';

@customElement('aoi-survey-analysis')
export class AoiSurveyAnalysis extends YpBaseElement {
  @property({ type: Array })
  results!: AoiResultData[];

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  earl!: AoiEarlData;

  async connectedCallback() {
    super.connectedCallback();
  }

  async fetchResults() {
    this.results = await window.aoiServerApi.getSurveyResults(this.earl.name);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('earl') && this.earl) {
      this.fetchResults();
    }
  }

  toggleScores() {
    const checkbox = this.$$('#showScores') as Checkbox;
//    this.showScores = checkbox.checked;
  }

  static get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        .title {
          font-family: monospace;
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }

        .profileImage {
          width: 50px;
          height: 50px;
          min-height: 50px;
          min-width: 50px;
          margin-right: 8px;
        }

        .row {
          padding: 8px;
          margin: 8px;
          border-radius: 16px;
          background-color: var(--md-sys-color-on-primary);
          color: var(--md-sys-color-primary);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          font-family: Roboto;
          vertical-align: center;

          padding-bottom: 16px;
        }

        .row[current-user] {
          background-color: var(--md-sys-color-teriary);
          color: var(--md-sys-color-on-primary);
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 22px;
        }

        .nickname {
          padding-bottom: 0;
        }

        .nameAndScore {
          width: 100%;
        }

        .scores {
          margin-top: 16px;
          padding: 16px;
          padding-top: 8px;
          padding-bottom: 8px;

          margin-bottom: 0px;
          background-color: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          border-radius: 24px;
          font-size: 14px;
          line-height: 1.2;
        }

        .checkboxText {
          color: var(--md-sys-color-primary);
          margin-top: 14px;
        }

        md-checkbox {
          padding-bottom: 8px;
        }

        .scores[hidden] {
          display: none;
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 1000px) {
          .title {
            font-size: 18px;
            letter-spacing: 0.15em;
            line-height: 1.5;
            margin-top: 16px;
          }

          .row {
            min-width: 300px;
            width: 300px;
          }
        }
      `,
    ];
  }

  renderRow(index: number, result: AoiResultData) {
    return html`
      <div class="row layout horizontal">
        <div class="column index">${index + 1}.</div>
        <div class="layout horizontal center-center nameAndScore">
          <div class="layout vertical center-center">
            <div class="column nickname">${result.data}</div>
            <div
              class="column layout vertical center-center scores"

            >
              <div>
                <b
                  >${this.t('How likely to win')}:
                  ${Math.round(result.score)}%</b
                >
              </div>
              <div>
                ${this.t('Wins')}: ${YpFormattingHelpers.number(result.wins)}
                ${this.t('Losses')}:
                ${YpFormattingHelpers.number(result.losses)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return this.results
      ? html`
          <div class="topContainer layout vertical wrap center-center">
            <div class="title">${this.t('Voting Results')}</div>
            <div class="questionTitle">${this.question.name}</div>
            <div class="layout horizontal">
              <md-checkbox
                id="showScores"
                @change="${this.toggleScores}"
              ></md-checkbox>
              <div class="checkboxText">${this.t('Show scores')}</div>
            </div>
            ${this.results.map((result, index) =>
              this.renderRow(index, result)
            )}
          </div>
        `
      : nothing;
  }
}
