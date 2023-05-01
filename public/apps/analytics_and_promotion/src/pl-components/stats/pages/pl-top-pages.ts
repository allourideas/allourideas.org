import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import './../reports/pl-list-report.js';
import { customElement, property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { html } from 'lit';
import { PlausableBasePages } from './pl-base-pages.js';

@customElement('pl-top-pages')
export class PlausableTopPages extends PlausableBasePages {
  constructor() {
    super();
    this.pagePath = '/pages';
  }

  render() {
    return html`
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{ entry_page: 'name' }}
        .keyLabel=${this.t("Page")}
        .timer="${this.timer}"
        .proxyUrl="${this.proxyUrl}"
        .detailsLink=${url.sitePath(this.site, this.pagePath)}
        .query=${this.query}
        .pagePath="${this.pagePath}"
        .site="${this.site}"
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `;
  }
}
