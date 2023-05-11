import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { SharedStyles } from './SharedStyles.js';

import '@material/web/circularprogress/circular-progress.js';

@customElement('aoi-survey-analysis')
export class AoiSurveyAnalysis extends YpBaseElement {
  @property({ type: Array })
  results!: AoiResultData[];

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  earl!: AoiEarlData;

  analysisTypes = [
    {
      name: 'topThreeAnswersPositiveImpacts',
      label: 'Top 3 Answers - Possible Positive Impacts',
    },
    {
      name: 'topThreeAnswersNegativeImpacts',
      label: 'Top 3 Answers - Possible Negative Impacts',
    },
    {
      name: 'bottomThreeAnswersPositiveImpacts',
      label: 'Bottom 3 Answers - Possible Positive Impacts',
    },
    {
      name: 'bottomThreeAnswersNegativeImpacts',
      label: 'Bottom 3 Answers - Possible Negative Impacts',
    },
  ] as AoiSurveyAnalysisData[];

  async connectedCallback() {
    super.connectedCallback();
  }

  async fetchResults() {
    for (let a = 0; a < this.analysisTypes.length; a++) {
      const analysisData = await window.aoiServerApi.getSurveyAnalysis(
        this.earl.name,
        this.analysisTypes[a].name
      );

      if (!analysisData) {
        this.analysisTypes[a].analysis = 'error';
        this.analysisTypes[a].answerRows = [];
      } else {
        this.analysisTypes[a].analysis = analysisData.analysis;
        this.analysisTypes[a].answerRows = analysisData.answerRows;
      }
      this.requestUpdate();
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('earl') && this.earl) {
      this.fetchResults();
    }
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

        .analysisTitle {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-on-secondary);
          background-color: var(--md-sys-color-secondary);
        }

        .generatingInfo {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
        }

        .analysisResults {
          padding: 16px;
          padding-top: 16px;
          padding-bottom: 16px;
          margin: 16px;
          margin-top: 8px;
          border-radius: 24px;
          margin-bottom: 16px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
        }

        .analysisContainer {
          padding: 8px;
          margin: 8px;
          color: var(--md-sys-color-primary);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          font-family: Roboto;
          vertical-align: center;

          padding-bottom: 16px;
        }

        .analysisRow {
          margin-bottom: 16px;
          width: 100%;
        }

        .analysisRow {
          padding: 0px;
          margin: 0px;
          border-radius: 16px;
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 16px;
        }

        .nickname {
          padding-bottom: 0;
        }

        .nameAndScore {
          width: 100%;
        }

        .analysisRow {
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
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

          .analysisContainer {
            min-width: 100%;
            width: 100%;
            padding-left: 0;
            padding-right: 0;
            margin: 0;
          }

          .analysisResults {
            border-radius: 16px;
          }

          .analysisRow {
            width: 100%;
          }

          .answers {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `,
    ];
  }

  renderAnswerRow(index: number, result: AoiResultData) {
    return html`
      <div class="answers layout horizontal center-center">
        <div class="column index">${index + 1}.</div>
        <div class="column layout vertical center-center">
          <div class="">${result.data}</div>
        </div>
      </div>
    `;
  }

  analysisRow(analysisItem: AoiSurveyAnalysisData) {
    let analysisHtml;

    console.log(analysisItem);

    if (analysisItem.analysis && analysisItem.analysis != 'error') {
      analysisHtml = html`
        ${analysisItem.answerRows.map((result, index) =>
          this.renderAnswerRow(index, result)
        )}
        <div class="analysisResults">
        ${analysisItem.analysis}
        <div class="generatingInfo">
          ${this.t('Written by GPT-4')}
        </div>
      </div>
      </div>`;
    } else if (analysisItem.analysis && analysisItem.analysis == 'error') {
      analysisHtml = html`<div class=" layout horizontal center-center">
        ${this.t('Error fetching analysis')}
      </div>`;
    } else {
      analysisHtml = html`<div class=" layout vertical center-center">
        <md-circular-progress indeterminate></md-circular-progress>
        <div class="generatingInfo">
          ${this.t('Generating analysis with GPT-4')}
        </div>
      </div>`;
    }

    return html`<div class="analysisRow">
      <div class="analysisTitle">${analysisItem.label}</div>
      ${analysisHtml}
    </div>`;
  }

  renderAnalysis() {
    let outHtml = html``;

    for (let a = 0; a < this.analysisTypes.length; a++) {
      outHtml = html`${outHtml}${this.analysisRow(this.analysisTypes[a])}`;
    }

    return outHtml;
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <div class="title">${this.t('Vote Analysis')}</div>
        <div class="questionTitle">${this.question.name}</div>
        <div class="layout vertical center-center analysisContainer">
          ${this.renderAnalysis()}
        </div>
      </div>
    `;
  }
}
