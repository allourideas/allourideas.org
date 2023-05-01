import { customElement, property } from 'lit/decorators.js';
import { html, nothing } from 'lit';

import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import '../reports/pl-list-report.js';
//@ts-ignore
//import * as d3 from 'd3';
//@ts-ignore
//import Datamap from 'datamaps';

declare var Datamap:any;
declare var d3:any;

import { apiPath, sitePath } from '../../util/url.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
import numberFormatter from '../../util/number-formatter.js';
import { navigateToQuery } from '../../query.js';
import { BrowserHistory } from '../../util/history.js';

@customElement('pl-countries-map')
export class PlausableCountriesMap extends PlausibleBaseElementWithState {
  @property({ type: Array })
  countries: PlausibleCountryData[] | undefined;

  @property({ type: Boolean })
  loading = true;

  @property({ type: Boolean })
  darkTheme = false;

  @property({ type: Object })
  history: BrowserHistory | undefined;

  map: typeof Datamap;

  constructor() {
    super();
    this.resizeMap = this.resizeMap.bind(this);
    this.drawMap = this.drawMap.bind(this);
    this.getDataset = this.getDataset.bind(this);
    this.darkTheme =
      document!.querySelector('html')!.classList.contains('dark') || false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.timer) this.timer.onTick(this.updateCountries.bind(this));
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.get('query')) {
      this.loading = true;
      this.countries = undefined;
      this.fetchCountries();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeMap);
    //TODO: Check this for memory leak this.map.destroy is not working
    this.map = undefined;
  }

  firstUpdated() {
    this.fetchCountries();
    window.addEventListener('resize', this.resizeMap);
  }

  getDataset() {
    const dataset = {};

    if (this.countries) {
      var onlyValues = this.countries.map(function (obj: PlausibleCountryData) {
        return obj.visitors;
      });
      var maxValue = Math.max.apply(null, onlyValues);

      // eslint-disable-next-line no-undef @ts-ignore
      //@ts-ignore
      const paletteScale = d3.scale
        .linear()
        .domain([0, maxValue])
        .range([
          this.darkTheme ? '#2e3954' : '#f3ebff',
          this.darkTheme ? '#6366f1' : '#a779e9',
        ]);

      this.countries.forEach(function (item) {
        //@ts-ignore
        dataset[item.alpha_3] = {
          numberOfThings: item.visitors,
          fillColor: paletteScale(item.visitors),
        };
      });
    }

    return dataset;
  }

  updateCountries() {
    this.fetchCountries().then(() => {
      this.map.updateChoropleth(this.getDataset(), { reset: true });
    });
  }

  fetchCountries() {
    return api.get(
      this.proxyUrl,
        `/api/stats/${encodeURIComponent(this.site.domain)}/countries`,
        this.query,
        { limit: 300 }
      )
      .then(async (res) => {
        this.loading = false;
        this.countries = res;
        await this.updateComplete;
        this.drawMap();
      });
  }

  resizeMap() {
    this.map && this.map.resize();
  }

  drawMap() {
    const dataset = this.getDataset();
    const label =
      this.query.period === 'realtime' ? this.t('Current visitors') : this.t('Visitors');
    const defaultFill = this.darkTheme ? '#2d3747' : '#f8fafc';
    const highlightFill = this.darkTheme ? '#374151' : '#F5F5F5';
    const borderColor = this.darkTheme ? '#1f2937' : '#dae1e7';
    const highlightBorderColor = this.darkTheme ? '#4f46e5' : '#a779e9';

    const container = this.$$('#map-container');
    this.map = new Datamap({
      element: container,
      responsive: true,
      projection: 'mercator',
      fills: { defaultFill },
      data: dataset,
      geographyConfig: {
        borderColor,
        highlightBorderWidth: 2,
        // @ts-ignore
        highlightFillColor: geo => geo.fillColor || highlightFill,
        highlightBorderColor,
        // @ts-ignore
        popupTemplate: (geo, data) => {
          if (!data) {
            return null;
          }
          const pluralizedLabel =
            data.numberOfThings === 1 ? label.slice(0, -1) : label;
          return [
            '<div class="hoverinfo dark:bg-gray-800 dark:shadow-gray-850 dark:border-gray-850 dark:text-gray-200">',
            '<strong>',
            geo.properties.name,
            ' </strong>',
            '<br><strong class="dark:text-indigo-400">',
            numberFormatter(data.numberOfThings),
            '</strong> ',
            pluralizedLabel,
            '</div>',
          ].join('');
        },
      },
      done: (datamap: {
        svg: {
          selectAll: (arg0: string) => {
            (): any;
            new (): any;
            on: {
              (arg0: string, arg1: (geography: any) => void): void;
              new (): any;
            };
          };
        };
      }) => {
        datamap.svg.selectAll('.datamaps-subunit').on('click', geography => {
          const country = this.countries!.find(c => c.alpha_3 === geography.id);

          if (country) {
            this.onClick();

            navigateToQuery(this.history!, this.query, {
              country: country.code,
              country_name: country.name,
            } as any);
          }
        });
      },
    });
  }

  onClick() {

  }

  geolocationDbNotice() {
    if (this.site.isDbip) {
      return html`
        <span class="text-xs text-gray-500 absolute bottom-4 right-3"
          >IP Geolocation by
          <a
            target="_blank"
            href="https://db-ip.com"
            rel="noreferrer"
            class="text-indigo-600"
            >DB-IP</a
          ></span
        >
      `;
    }

    return null;
  }

  renderBody() {
    if (this.countries) {
      return html`
        <div
          class="mx-auto mt-4"
          style="overflow: hidden; width: 100%; max-width: 475px; height: 335px"
          id="map-container"
        ></div>
        <pl-more-link
          .site=${this.site}
          .list=${this.countries}
          endpoint="countries"
        ></pl-more-link>
        ${this.geolocationDbNotice()}
      `;
    }

    return null;
  }

  render() {
    return html`
      ${this.loading
        ? html`<div class="mx-auto my-32 loading"><div></div></div>`
        : nothing}
      <pl-fade-in .show=${!this.loading}> ${this.renderBody()} </pl-fade-in>
    `;
  }
}
