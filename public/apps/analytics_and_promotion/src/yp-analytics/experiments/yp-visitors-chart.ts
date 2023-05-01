import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpBaseElement } from '../../@yrpri/common/yp-base-element.js';
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from '../../@yrpri/common/YpServerApiAdmin.js';
import { YpBaseVisualization } from './yp-base-visualization.js';

@customElement('yp-visitors-chart')
export class YpVisitorsChart extends YpBaseVisualization {
  constructor() {
    super();
    this.chartLabel = this.t('Visitors');
    this.chartType = 'bar';
    this.type = 'timeseries';
    this.paramsObject = { period: 'day' };

    setTimeout(() => {
      this.updateParam('period', '7d');
    }, 4000);
  }

  get chartOptions() {
    return {
    } as any
  }
}
