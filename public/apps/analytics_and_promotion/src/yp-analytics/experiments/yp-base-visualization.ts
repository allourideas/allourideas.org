import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpBaseElement } from '../../@yrpri/common/yp-base-element.js';
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from '../../@yrpri/common/YpServerApiAdmin.js';

export class YpBaseVisualization extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: String })
  type!: string;

  @property({ type: Object })
  paramsObject: any = {};

  @property({ type: String })
  paramsString: string | undefined;

  @property({ type: String })
  chartLabel!: string;

  @property({ type: String })
  chartType!: string;

  //TODO: Setup TS for this
  @property({ type: Object })
  serverResponse: any | undefined;

  chart: any;

  constructor() {
    super();
    Chart.register(...registerables);
    this._convertParamsToUrlString();
  }

  static get styles() {
    return [
      super.styles,
      css`
        .chart {
          height: 400px;
          width: 800px;
        }
      `,
    ];
  }

  _convertParamsToUrlString() {
    this.paramsString = Object.keys(this.paramsObject)
      .map(key => key + '=' + this.paramsObject[key])
      .join('&');
  }

  updateParam(key: string, value: string) {
    this.paramsObject[key] = value;
    this.paramsObject = { ...this.paramsObject };
  }

  render() {
    return html`<canvas class="chart" id="chart"></canvas> `;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
    }

    if (changedProperties.has('paramsObject')) {
      this._convertParamsToUrlString();
      this._getResponse();
    }
  }

  async _getResponse() {
    const response = await new YpServerApiAdmin().getAnalyticsData(
      this.collectionId as number,
      this.type,
      this.paramsString!
    );
    this.serverResponse = response.results;
    this.updateStatsChart();
  }

  _collectionIdChanged() {}

  transformChartData(response: any) {
    const chartData = [];
    for (const item of response) {
      chartData.push({ x: item.date, y: item.visitors });
    }

    return chartData;
  }

  get chartData() {
    return {
      datasets: [
        {
          label: `${this.chartLabel}`,
          backgroundColor: '#1c96bd',
          //@ts-ignore
          //fill: false,
          data: this.transformChartData(this.serverResponse),
        },
      ],
    };
  }

  get chartOptions() {
    return {
      scales: {
        //@ts-ignore
        xAxes: [
          {
            type: 'date',
            time: {
              unit: 'hours',
            },
          },
        ],
        //@ts-ignore
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
      },
    };
  }

  updateStatsChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const chartElement = this.shadowRoot!.getElementById('chart') as any;

    this.chart = new Chart(chartElement, {
      type: this.chartType as any,
      data: this.chartData,
      options: this.chartOptions,
    });
  }
}
