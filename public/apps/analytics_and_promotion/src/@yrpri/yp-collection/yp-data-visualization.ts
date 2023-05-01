/* eslint-disable @typescript-eslint/ban-ts-comment */
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';

import '@material/mwc-icon';

import { Chart } from 'chart.js';

@customElement('yp-data-visualization')
export class YpDataVisualization extends YpBaseElement {
  @property({ type: Object })
  group!: YpGroupData;

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          margin-top: 16px;
        }

        canvas {
        }

        .wrapper {
          position: relative;
          display: inline-block;
          margin-left: 16px;
          margin-right: 16px;
        }

        .wrapper[small] {
          padding: 0;
          margin-left: 14px;
          margin-right: 14px;
        }

        .wrapper[small-screen] {
          padding: 0;
          margin-left: 14px;
          margin-right: 14px;
        }

        .text {
          position: absolute;
          text-align: center;
          width: 100%;
          line-height: 190px;
          font-size: 28px;
          color: #000;
        }

        .text[small] {
          line-height: 135px;
          font-size: 20px;
        }

        .text[small-screen] {
          line-height: 135px;
          font-size: 20px;
        }

        canvas {
          position: relative;
          z-index: 1;
        }

        .header {
          font-size: 28px;
          margin-bottom: 8px;
          margin-top: 16px;
        }

        .groupName {
          font-size: 28px;
          margin: 8px;
          padding: 8px;
          color: #222;
          margin-top: 0;
          padding-top: 0;
        }

        .groupName[small-screen] {
          font-size: 20px;
          margin-bottom: 16px;
        }

        .topHeader {
          font-size: 22px;
          margin: 8px;
          margin-top: 0;
          color: #111;
        }

        .firstTopHeader {
          color: #333;
        }

        .targetText {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 22px;
          text-align: center;
          color: #111;
        }

        .targetText[small] {
          font-size: 18px;
        }

        .targetText[small-screen] {
          font-size: 18px;
        }

        .stage[not-small] {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .stage {
          background-color: #fefefe;
          padding: 16px;
          padding-top: 24px;
          width: 520px;
          margin: 16px;
          margin-bottom: 8px;
        }

        .stage[small] {
          width: 400px;
          margin: 0;
          padding: 8px;
          padding-top: 32px;
          padding-bottom: 16px;
        }

        .stage[small-screen] {
          width: 300px;
          padding: 8px;
          padding-top: 32px;
          padding-bottom: 16px;
        }

        .stageTop {
          background-color: #fefefe;
          padding: 16px;
          width: 520px;
          margin: 16px;
          margin-bottom: 8px;
          padding-top: 8px;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  get canvasSize() {
    return this.wide ? 135 : 190;
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    this._drawCharts();
  }

  formatAmount(amount: number) {
    return `$${amount}m`;
  }

  _drawCharts() {
    const data = this.group.configuration.dataForVisualizationJson!;
    this._drawChart(
      '#overallTarget',
      data.overallTargetPercent,
      this.t('overall'),
      data.overallColor ? data.overallColor : '#5bac51'
    );
    this._drawChart(
      '#overallActual',
      data.overallActualPercent,
      this.t('actual'),
      data.overallColor ? data.overallColor : '#5bac51'
    );
    this._drawChart(
      '#yearTarget',
      data.yearTargetPercent,
      this.t('overall'),
      data.yearColor ? data.yearColor : '#004f77'
    );
    this._drawChart(
      '#yearActual',
      data.yearActualPercent,
      this.t('actual'),
      data.yearColor ? data.yearColor : '#004f77'
    );
  }

  _drawChart(
    chartId: string,
    percentDone: number,
    labelText: string,
    color: string,
    hideGray = false
  ) {
    // @ts-ignore
    new Chart(this.$$(chartId)!.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: [labelText, labelText],
        datasets: [
          {
            data: [percentDone, percentDone - 100],
            borderColor: [
              hideGray ? 'transparent' : '#FFF',
              hideGray ? 'transparent' : '#FFF',
            ],
            backgroundColor: [
              color,
              hideGray ? 'transparent' : 'rgb(220,220,220)',
            ],
          },
        ],
      },
      options: {
        // @ts-ignore
        tooltips: false,
        legend: {
          display: false,
        },
        toolstips: {
          callbacks: {
            label: (tooltipItem: any) => {
              return tooltipItem.yLabel;
            },
          },
        },
      },
    });
  }

  render() {
    const data = this.group.configuration.dataForVisualizationJson!;
    return html`
      <div class="layout vertical center-center">
        <div
          class="layout vertical stage shadow-elevation-2dp center-center"
          ?small-screen="${!this.wide}"
          ?small="${!this.wide}"
          ?not-small="${this.wide}"
        >
          <div class="layout vertical" ?hidden="${!this.wide}">
            <yp-magic-text
              id="groupName"
              class="groupName"
              ?small-screen="${!this.wide}"
              text-type="groupName"
              .contentLanguage="${this.group.language}"
              .disableTanslation="${this.group.configuration
                .disableNameAutoTranslation}"
              textOnly
              .content="${this.group.name}"
              .contentId="${this.group.id}"
            >
            </yp-magic-text>
          </div>
          <div class="topHeader firstTopHeader" ?hidden="${!this.wide}">
            ${this.t('overall')}
          </div>
          <div class="layout horizontal center-center">
            <div>
              <div
                id="breakdownWrap"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${data.overallTargetPercent}%
                </div>
                <canvas
                  id="overallTarget"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t('target')}:
                ${this.formatAmount(data.overallTargetAmount)}
              </div>
            </div>
            <div>
              <div
                id="breakdownWrapTwo"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${data.overallActualPercent}%
                </div>
                <canvas
                  id="overallActual"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t('actual')}:
                ${this.formatAmount(data.overallActualAmount)}
              </div>
            </div>
          </div>
        </div>

        <div
          class="layout vertical stage shadow-elevation-2dp center-center"
          ?small-screen="${!this.wide}"
          ?small="${!this.wide}"
          ?not-small="${this.wide}"
        >
          <div class="layout vertical topHeader">${data.currentYear}</div>
          <div class="layout horizontal center-center">
            <div>
              <div
                id="breakdownWrapA"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${data.yearTargetPercent}%
                </div>
                <canvas
                  id="yearTarget"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t('target')}: ${this.formatAmount(data.yearTargetAmount)}
              </div>
            </div>
            <div>
              <div
                id="breakdownWrapTwoA"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${data.yearActualPercent}%
                </div>
                <canvas
                  id="yearActual"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t('actual')}: ${this.formatAmount(data.yearActualAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
