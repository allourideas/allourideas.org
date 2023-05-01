import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpBaseElement } from '../../@yrpri/common/yp-base-element.js';
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from '../../@yrpri/common/YpServerApiAdmin.js';
import { YpBaseVisualization } from './yp-base-visualization.js';

@customElement('yp-bounce-rate-chart')
export class YpBounceRateChart extends YpBaseVisualization {
  constructor() {
    super();
    this.chartLabel = this.t('bounceRate');
    this.chartType = 'bar';
    this.type = 'timeseries';
    this.paramsObject = { period: 'month', property: 'bounce_rate' };
  }
}
