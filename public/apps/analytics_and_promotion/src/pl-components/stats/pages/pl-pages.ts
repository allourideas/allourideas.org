import { customElement, property } from 'lit/decorators.js';
import { html, nothing } from 'lit';

import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import './../reports/pl-list-report.js';

import './pl-top-pages.js';
import './pl-entry-pages.js';
import './pl-exit-pages.js';

import { PlausibleBaseElement } from '../../pl-base-element.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';

@customElement('pl-pages')
export class PlausablePages extends PlausibleBaseElementWithState {
  @property({ type: String })
  tabKey!: string;

  @property({ type: String })
  storedTab: string | undefined;

  @property({ type: String })
  mode: string | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.tabKey = `pageTab__${this.site.domain}`;
    this.mode = this.storedTab || 'pages';
  }

  setMode(mode: string) {
    storage.setItem(this.tabKey, mode);
    this.mode = mode;
  }

  labelFor = {
    pages: 'Top Pages',
    'entry-pages': 'Entry Pages',
    'exit-pages': 'Exit Pages',
  };

  renderContent() {
    switch (this.mode) {
      case 'entry-pages':
        return html`<pl-entry-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-entry-pages>`;
      case 'exit-pages':
        return html`<pl-exit-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-exit-pages>`;
      case 'pages':
      default:
        return html`<pl-top-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-top-pages>`;
    }
  }

  renderPill(name: string, mode: string) {
    const isActive = this.mode === mode;

    if (isActive) {
      return html`
        <li
          class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading"
        >
          ${this.t(name)}
        </li>
      `;
    } else {
      return html`
        <li
          class="hover:text-indigo-600 cursor-pointer"
          @click=${() => this.setMode(mode)}
        >
          ${this.t(name)}
        </li>
      `;
    }
  }

  render() {
    if (this.site) {
      return html`
        <div
          class="stats-item flex flex-col w-full mt-6 stats-item--has-header"
        >
          <div
            class="stats-item-header flex flex-col flex-grow bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
          >
            <div class="w-full flex justify-between" style="max-height: 40px !important">
              <h3 class="font-bold dark:text-gray-100">
                ${
                  //@ts-ignore
                  this.t(this.labelFor[this.mode]) || this.t('Page Visits')
                }
              </h3>
              <div class="flex"></div>
              <ul
                class="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2"
              >
                ${this.renderPill('Top Pages', 'pages')}
                ${this.renderPill('Entry Pages', 'entry-pages')}
                ${this.renderPill('Exit Pages', 'exit-pages')}
              </ul>
            </div>
            ${this.renderContent()}
          </div>
        </div>
      `;
    } else {
      return nothing;
    }
  }
}
