import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import * as storage from '../../util/storage.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';

import './pl-sources-all.js';
import './pl-sources-utm.js';
import './pl-sources-referrers.js';

@customElement('pl-sources-list')
export class PlausibleSourcesList extends PlausibleBaseElementWithState {
  @property({ type: String })
  tabKey!: string;

  @property({ type: String })
  tab!: PlausibleSourcesTabOptions;

  @property({ type: Boolean })
  alwaysShowNoRef = false;

  connectedCallback() {
    super.connectedCallback();
    this.tabKey = 'sourceTab__' + this.site.domain!;
    const storedTab = storage.getItem(this.tabKey);
    this.tab = storedTab || 'all';
  }

  tabChanged(e: CustomEvent) {
    this.tab = e.detail;
    if (this.tab) {
      storage.setItem(this.tabKey, this.tab);
    }
  }

  render() {
    if (
      this.query.filters['source'] &&
      this.query.filters['source'] !== 'Direct / None'
    ) {
      return html`
        <pl-sources-referrers
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .alwaysShowNoRef="${this.alwaysShowNoRef}"
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-referrers>
      `;
    } else if (this.tab === 'all') {
      return html`
        <pl-sources-all
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .alwaysShowNoRef="${this.alwaysShowNoRef}"
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-all>
      `;
    } else {
      return html`
        <pl-sources-utm
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-utm>
      `;
    }
  }
}
