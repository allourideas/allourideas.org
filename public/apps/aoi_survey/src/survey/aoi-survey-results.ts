import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { SharedStyles } from './SharedStyles.js';

import '@material/web/checkbox/checkbox.js';
import { Checkbox } from '@material/web/checkbox/lib/checkbox.js';
import '@material/web/button/outlined-button.js';
import '@material/web/circularprogress/circular-progress.js';

@customElement('aoi-survey-results')
export class AoiSurveyResuls extends YpBaseElement {
  @property({ type: Array })
  results!: AoiResultData[];

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Boolean })
  showScores = false;

  async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity(`Results - open`);
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

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.appGlobals.activity(`Results - close`);
  }

  toggleScores() {
    const checkbox = this.$$('#showScores') as Checkbox;
    this.showScores = checkbox.checked;
    window.appGlobals.activity(`Results - toggle scores`);
  }

  exportToCSV(): void {
    const replacer = (key: string, value: any) => (value === null ? '' : value); // specify types for key and value
    const header = Object.keys(this.results[0]);
    let csv = this.results.map(row =>
      header
        .map(fieldName => JSON.stringify((row as any)[fieldName], replacer))
        .join(',')
    ); // specify type for row
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');

    // Create a downloadable link
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'survey_results.csv';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    setTimeout(() => link.remove(), 0);
    window.appGlobals.activity(`Results - export to csv`);
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

        .subTitle {

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
          font-size: 16px;
        }

        .ideaName {
          padding-bottom: 0;
          width: 100%;
        }

        .nameAndScore {
          width: 100%;
        }

        .scores {
          margin-top: 16px;
          padding: 16px;
          padding-top: 12px;
          padding-bottom: 12px;
          margin-bottom: 0px;
          text-align: center;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
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

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
        }

        .scores[hidden] {
          display: none;
        }

        .winLosses {
          margin-top: 4px;
        }

        .scoreAndNameContainer {
          width: 100%;
        }

        .exportButton {
          margin-bottom: 128px;
          margin-top: 32px;
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
          .loading {
            width: 100vw;
            height: 100vh;
          }

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
        <div class="layout horizontal nameAndScore">
          <div class="layout vertical scoreAndNameContainer">
            <div class="column ideaName ">${result.data}</div>
            <div
              class="column layout vertical center-center scores"
              ?hidden="${!this.showScores}"
            >
              <div>
                <b
                  >${this.t('How likely to win')}:
                  ${Math.round(result.score)}%</b
                >
              </div>
              <div class="winLosses">
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
            <div class="title subTitle">${YpFormattingHelpers.number(this.question.votes_count)} ${this.t('total votes')}</div>
            <md-outlined-button @click=${this.exportToCSV} class="exportButton">
              ${this.t('Download Results as CSV')}
            </md-outlined-button>
          </div>
        `
      : html`<div class="loading">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>`;
  }
}
