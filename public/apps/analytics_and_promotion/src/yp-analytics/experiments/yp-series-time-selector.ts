import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpBaseElement } from '../../@yrpri/common/yp-base-element.js';
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from '../../@yrpri/common/YpServerApiAdmin.js';
import { YpBaseVisualization } from './yp-base-visualization.js';

@customElement('yp-series-time-selector')
export class YpSeriesTimeSelector extends YpBaseElement {
  constructor() {
    super();
  }

  get chartOptions() {
    return {
    } as any
  }
}
