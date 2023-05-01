import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import numberFormatter from '../../util/number-formatter';
import { PlausibleSourcesBase, UTM_TAGS } from './pl-sources-base';

import * as url from '../../util/url.js';
import * as api from '../../api.js';

import '../../pl-link.js';
import '../../stats/pl-bar.js';

@customElement('pl-sources-utm')
export class PlausibleSourcesUtm extends PlausibleSourcesBase {
  @property({ type: String })
  to: string | undefined = undefined;

  connectedCallback() {
    super.connectedCallback();
    if (this.timer) this.timer.onTick(this.fetchReferrers.bind(this));
  }

  fetchReferrers() {
    const endpoint = UTM_TAGS[this.tab].endpoint;
    this.loading = true;
    this.referrers = undefined;

    api
      .get(
        this.proxyUrl,
        `/api/stats/${encodeURIComponent(this.site!.domain!)}/${endpoint}`,
        this.query,
        { show_noref: this.showNoRef }
      )
      .then(res => {
        this.loading = false;
        this.referrers = res;
      });
  }

  renderReferrer(referrer: PlausibleReferrerData) {
    const maxWidthDeduction = this.showConversionRate ? '10rem' : '5rem';

    return html`
          <div
        class="flex items-center justify-between my-1 text-sm"
        key=${referrer.name}
      >
        <pl-bar
          .count=${referrer.visitors}
          .all=${this.referrers}
          bg="bg-blue-50 dark:bg-gray-500 dark:bg-opacity-15"
          .maxWidthDeduction=${maxWidthDeduction}
        >

          <span class="flex px-2 py-1.5 dark:text-gray-300 relative z-2 break-all">
            <pl-link
              class="md:truncate block hover:underline"
              .to=${{ search: url.setQuerySearch(this.tab, referrer.name) }}
            >
              ${referrer.name}
           </pl-link>
          </span>
        </pl-bar>
        <span class="font-medium dark:text-gray-200 w-20 text-right" tooltip=${
          referrer.visitors
        }>${numberFormatter(referrer.visitors)}</span>
        ${
          this.showConversionRate
            ? html`<span class="font-medium dark:text-gray-200 w-20 text-right"
                >${referrer.conversion_rate}%</span
              >`
            : nothing
        }
      </div>

    `;
  }

  renderList() {
    if (this.referrers && this.referrers.length > 0) {
      return html`
        <div class="flex flex-col flex-grow">
          <div
            class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
          >
            <span>${UTM_TAGS[this.tab].label}</span>
            <div class="text-right">
              <span class="inline-block w-20">${this.label}</span>
              ${this.showConversionRate
                ? html`<span class="inline-block w-20">CR</span>`
                : nothing}
            </div>
          </div>

          <div class="flex-grow">
            ${this.referrers.map(r => this.renderReferrer(r))}
          </div>
          <pl-more-link
            .site=${this.site}
            .list=${this.referrers}
            .endpoint=${UTM_TAGS[this.tab].endpoint}
          ></pl-more-link>
        </div>
      `;
    } else {
      return html`<div
        class="font-medium text-center text-gray-500 mt-44 dark:text-gray-400"
      >
        No data yet
      </div>`;
    }
  }

  renderContent() {
    return html`
      <div class="flex justify-between w-full">
        <h3 class="font-bold dark:text-gray-100">${this.t('Top Sources')}</h3>
        ${this.renderTabs()}
      </div>
      ${this.loading
        ? html` <div class="mx-auto loading mt-44"><div></div></div>
            }`
        : nothing}

      <pl-fade-in ?show="${!this.loading}" class="flex flex-col flex-grow">
        ${this.renderList()}
       </pl-fade-in>
    `;
  }

  render() {
    return html`
      <div
        class="relative p-4 bg-white rounded shadow-xl stats-item flex flex-col dark:bg-gray-825 mt-6 w-full"
      >
        ${this.renderContent()}
      </div>
    `;
  }
}
