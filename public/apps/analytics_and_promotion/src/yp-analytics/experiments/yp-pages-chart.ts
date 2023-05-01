import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpBaseElement } from '../../@yrpri/common/yp-base-element.js';
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from '../../@yrpri/common/YpServerApiAdmin.js';
import { YpBaseVisualization } from './yp-base-visualization.js';

@customElement('yp-pages-chart')
export class YpPagesChart extends YpBaseVisualization {
  constructor() {
    super();
    this.chartLabel = this.t('topPages');
    this.chartType = 'bar';
    this.type = 'breakdown';
    this.paramsObject = { period: 'day', property: 'event:page' };
  }

  transformChartData(response: any) {
    const chartData = [];
    for (const item of response) {
      chartData.push({ x: item.page, y: item.visitors });
    }

    return chartData;
  }
}
