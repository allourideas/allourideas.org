import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { navigateToQuery, generateQueryString } from '../../query.js';
import numberFormatter, {
  durationFormatter,
} from '../../util/number-formatter.js';
import { METRIC_MAPPING, METRIC_LABELS } from './pl-visitors-graph.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PlausibleStyles } from '../../plausibleStyles.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';

@customElement('pl-top-stats')
export class PlausibleTopStats extends PlausibleBaseElement {
  @property({ type: Boolean })
  disabled = false;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  updateMetric!: Function;

  @property({ type: Object })
  history!: any;

  @property({ type: String })
  classsName!: string;

  @property({ type: Object })
  to!: PlausibleQueryData;

  @property({ type: String })
  metric!: string;

  @property({ type: Object })
  topStatData: PlausibleTopStatsData | undefined;

  static get styles() {
    return [
      ...super.styles,
    ];
  }


  renderComparison(name: string, comparison: number) {
    const formattedComparison = numberFormatter(Math.abs(comparison));

    if (comparison > 0) {
      const color = name === 'Bounce rate' ? 'text-red-400' : 'text-green-500';
      return html`<span class="text-xs dark:text-gray-100"
        ><span class="${color + ' font-bold'}">&uarr;</span
        >${formattedComparison}%</span
      >`;
    } else if (comparison < 0) {
      const color = name === 'Bounce rate' ? 'text-green-500' : 'text-red-400';
      return html`<span class="text-xs dark:text-gray-100"
        ><span class="${color + ' font-bold'}">&darr;</span>
        ${formattedComparison}%</span
      >`;
    } else if (comparison === 0) {
      return html`<span class="text-xs text-gray-700 dark:text-gray-300"
        >&#12336; N/A</span
      >`;
    }
  }

  topStatNumberShort(stat: PlausibleStatData) {
    if (['visit duration', 'time on page'].includes(stat.name.toLowerCase())) {
      return durationFormatter(stat.value);
    } else if (
      ['bounce rate', 'conversion rate'].includes(stat.name.toLowerCase())
    ) {
      return stat.value + '%';
    } else {
      return numberFormatter(stat.value);
    }
  }

  topStatTooltip(stat: PlausibleStatData) {
    if (
      [
        'visit duration',
        'time on page',
        'bounce rate',
        'conversion rate',
      ].includes(stat.name.toLowerCase())
    ) {
      return null;
    } else {
      let name = stat.name.toLowerCase();
      name = stat.value === 1 ? name.slice(0, -1) : name;
      return stat.value.toLocaleString() + ' ' + name;
    }
  }

  titleFor(stat: PlausibleStatData) {
    if (this.metric === METRIC_MAPPING[stat.name]) {
      return `Hide ${METRIC_LABELS[
        METRIC_MAPPING[stat.name]
      ].toLowerCase()} from graph`;
    } else {
      return `Show ${METRIC_LABELS[
        METRIC_MAPPING[stat.name]
      ].toLowerCase()} on graph`;
    }
  }

  renderStat(stat: PlausibleStatData) {
    return html` <div
      class="flex items-center justify-between my-1 whitespace-nowrap"
    >
      <b
        class="mr-4 text-xl md:text-2xl dark:text-gray-100"
        tooltip="${ifDefined(
          this.topStatTooltip(stat) === null
            ? undefined
            : this.topStatTooltip(stat)
        )}"
        >${this.topStatNumberShort(stat)}</b
      >
      ${this.renderComparison(stat.name, stat.change!)}
    </div>`;
  }

  render() {
    const stats =
      this.topStatData &&
      this.topStatData.top_stats.map((stat, index) => {
        let border = index > 0 ? 'lg:border-l border-gray-300' : '';
        border = index % 2 === 0 ? border + ' border-r lg:border-r-0' : border;
        const isClickable =
          Object.keys(METRIC_MAPPING).includes(stat.name) &&
          !(this.query.filters!.goal && stat.name === 'Unique visitors');
        const isSelected = this.metric === METRIC_MAPPING[stat.name];
        const [statDisplayName, statExtraName] = stat.name.split(/(\(.+\))/g);
        const translatedName = this.t(statDisplayName);

        return html`
          ${isClickable
            ? html`
                <div
                  class="${`px-4 md:px-6 w-1/2 my-4 lg:w-auto group cursor-pointer select-none ${border}`}"
                  @click="${() => {
                    this.updateMetric(METRIC_MAPPING[stat.name]);
                  }}"
                  tabindex="0"
                  .title="${this.titleFor(stat)}"
                >
                  <div
                    class="${`text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap flex w-content
                  ${
                    isSelected
                      ? `text-indigo-700 dark:text-indigo-500
                        border-indigo-700 dark:border-indigo-500`
                      : `group-hover:text-indigo-700
                        dark:group-hover:text-indigo-500`
                  }`}"
                  >
                    ${translatedName}
                  </div>
                  <span class="hidden sm:inline-block ml-1"
                    >${statExtraName}</span
                  >
                  ${this.renderStat(stat)}
                </div>
              `
            : html`
                <div class=${`px-4 md:px-6 w-1/2 my-4 lg:w-auto ${border}`}>
                  <div
                    class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap flex"
                  >
                    ${stat.name}
                  </div>
                  ${this.renderStat(stat)}
                </div>
              `}
        `;
      });

    if (this.query && this.query.period === 'realtime') {
      stats!.push(
        html`<div
          key="dot"
          class="block pulsating-circle"
          .style=${{ left: '125px', top: '52px' }}
        ></div>`
      );
    }

    return stats;
  }
}
