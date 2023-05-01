import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import './../reports/pl-list-report.js';
import { customElement, property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { html } from 'lit';
import { PlausableBasePages } from './pl-base-pages.js';

@customElement('pl-exit-pages')
export class PlausableExitPages extends PlausableBasePages {
  constructor() {
    super();
    this.pagePath = '/exit-pages';
  }

  render() {
    return html`
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{ entry_page: 'name' }}
        .keyLabel="${this.t("Exit page")}"
        .proxyUrl="${this.proxyUrl}"
        .valueLabel=${this.t("Unique Exits")}
        valueKey="unique_exits"
        .pagePath="${this.pagePath}"
        .site="${this.site}"
        .timer="${this.timer}"
        .detailsLink=${url.sitePath(this.site, this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `;
  }
}
