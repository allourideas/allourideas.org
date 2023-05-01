import { LitElement, css, html, nothing } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import Chart from 'chart.js/auto';
import { navigateToQuery } from '../../query.js';
import numberFormatter, {
  durationFormatter,
} from '../../util/number-formatter.js';
import * as api from '../../api';
import * as storage from '../../util/storage.js';
//import LazyLoader from '../../components/lazy-loader'
import { GraphTooltip, dateFormatter } from './graph-util.js';
import './pl-top-stats.js';
import * as url from '../../util/url.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';

import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
import { PlausibleBaseGraph } from './pl-base-graph.js';
import { themeFromSourceColor } from '@material/material-color-utilities';
import { formatISO } from '../../util/date.js';

@customElement('pl-goal-graph')
export class PlausibleGoalGraph extends PlausibleBaseGraph {
  @property({ type: Array })
  events!: string[];

  static get styles() {
    return [
      ...super.styles,
      css`
        .topContainer {
          margin-top: 24px;
        }
      `,
    ];
  }

  get filterInStatsFormat() {
    let filterString = '';
    let events: string[] =[];
    Object.keys(this.query.filters).map((key) => {
      //@ts-ignore
      if (this.query.filters[key]) {
        //@ts-ignore
        if (this.query.filters[key]=="page") {
          //@ts-ignore
          filterString += `${key}==${this.query.filters[key]};`;
          //@ts-ignore
        } else if (key=="goal") {
          //@ts-ignore
          events.push(this.query.filters[key]);
        } else {
          //@ts-ignore
          filterString += `visit:${key}==${this.query.filters[key]};`;
        }
      }
    });

    if (filterString)  {
      filterString = `;${filterString}`;
      filterString = filterString.slice(0, -1);
    }

    if (events.length>0) {
     return `|${events.join('|')}` + filterString;
    } else {
      return filterString;
    }
  }

  async fetchGraphData() {
    return new Promise((resolve, reject) => {
      if (this.query.period!="realtime") {
        let query = structuredClone(this.query);
        query = this.transformCustomDateForStatsQuery(query);
        api
        .get(this.proxyUrl, `/api/v1/stats/${this.method}`, query, {
          metrics: this.metrics,
          statsBegin: this.site.statsBegin,
          site_id: encodeURIComponent(this.site!.domain!),
          filters: `event:name==${this.events.join('|')}${this.filterInStatsFormat}`,
        })
        .then(res => {
          this.setGraphData(res);
          resolve(res);
        })
        .catch(error => reject(error));
      } else {
        resolve([]);
      }
    });
  }

  setGraphData(data: any) {
    const newData = {
      labels: [],
      plot: [],
      interval: this.query.period == "day" ? 'hour' : 'date',
    } as any;

    for (let r = 0; data.results.length > r; r++) {
      newData.labels.push(data.results[r].date);
      newData.plot.push(data.results[r][this.metrics]);
    }

    this.graphData = newData;
  }

  regenerateChart() {
    let graphEl = this.$$('canvas') as HTMLCanvasElement;
    if (!graphEl) {
      graphEl = this.canvasElement as HTMLCanvasElement;
    }
    this.ctx = graphEl!.getContext('2d');
    const dataSet = this.buildDataSet(
      this.graphData.plot,
      this.graphData.present_index,
      this.ctx!
    );
    // const prev_dataSet = graphData.prev_plot && buildDataSet(graphData.prev_plot, false, this.ctx, METRIC_LABELS[this.metric], true)
    // const combinedDataSets = comparison.enabled && prev_dataSet ? [...dataSet, ...prev_dataSet] : dataSet;

    const graphData = this.graphData;

    return new Chart(this.ctx!, {
      type: 'line',
      data: {
        labels: this.graphData.labels,
        datasets: dataSet,
      },
      options: {
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            mode: 'index',
            intersect: false,
            position: 'average',
            external: this.graphTooltip(
              this.graphData,
              graphEl,
              this.$$('#chartjs-tooltip')
            ),
          },
        },
        responsive: true,
        onResize: this.updateWindowDimensions,
        elements: { line: { tension: 0 }, point: { radius: 0 } },
        //@ts-ignore
        onClick: this.onClick.bind(this),
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: numberFormatter,
              maxTicksLimit: 8,
              color: this.darkTheme ? 'rgb(243, 244, 246)' : undefined,
            },
            grid: {
              //@ts-ignore
              zeroLineColor: 'transparent',
              drawBorder: false,
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 8,
              callback: function (val, _index, _ticks) {
                return dateFormatter(graphData.interval)(
                  this.getLabelForValue(val as number)
                );
              },

              color: this.darkTheme ? 'rgb(243, 244, 246)' : undefined,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
      },
    });
  }

  renderHeader() {
    return html` <h1>${this.t(this.chartTitle)}</h1>`;
  }
}
