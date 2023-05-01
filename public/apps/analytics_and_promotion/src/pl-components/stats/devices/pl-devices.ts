import { customElement, property } from 'lit/decorators.js';
import { html, nothing } from 'lit';

import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import '../reports/pl-list-report.js';

import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';

const EXPLANATION = {
  Mobile: 'up to 576px',
  Tablet: '576px to 992px',
  Laptop: '992px to 1440px',
  Desktop: 'above 1440px',
} as Record<string, string>;

@customElement('pl-devices')
export class PlausableDevices extends PlausibleBaseElementWithState {
  @property({ type: String })
  tabKey!: string;

  @property({ type: String })
  storedTab: string | undefined;

  @property({ type: String })
  mode: string | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.tabKey = `pageTab__${this.site.domain}`;
    this.mode = this.storedTab || 'browser';
  }

  setMode(mode: string) {
    storage.setItem(this.tabKey, mode);
    this.mode = mode;
  }

  renderBrowsers() {
    const fetchData = () => {
      return api.get(
        this.proxyUrl,
        url.apiPath(this.site, '/browsers'),
        this.query
      );
    };

    return html`
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .filter=${{ browser: 'name' }}
        .timer="${this.timer}"
        .keyLabel="${this.t("Browser")}"
        .query=${this.query}
      ></pl-list-report>
    `;
  }

  renderBrowserVersions() {
    const fetchData = () => {
      return api.get(
        this.proxyUrl,
        url.apiPath(this.site, '/browser-versions'),
        this.query
      );
    };

    return html`
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .timer="${this.timer}"
        .filter=${{ browser_version: 'name' }}
        .keyLabel=${this.query.filters.browser + ` ${this.t("version")}`}
        .query=${this.query}
      ></pl-list-report>
    `;
  }

  renderOperatingSystems() {
    const fetchData = () => {
      return api.get(
        this.proxyUrl,
        url.apiPath(this.site, '/operating-systems'),
        this.query
      );
    };

    return html`
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .timer="${this.timer}"
        .filter=${{ os: 'name' }}
        .keyLabel=${this.t("Operating system")}
        .query=${this.query}
      ></pl-list-report>
    `;
  }

  renderOperatingSystemVersions() {
    const fetchData = () => {
      return api.get(
        this.proxyUrl,
        url.apiPath(this.site, '/operating-system-versions'),
        this.query
      );
    };

    return html`
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .timer="${this.timer}"
        .filter=${{ os_version: 'name' }}
        .keyLabel=${this.query.filters.os + ` ${this.t("version")}`}
        .query=${this.query}
      ></pl-list-report>
    `;
  }

  renderScreenSizes() {
    const fetchData = () => {
      return api.get(
        this.proxyUrl,
        url.apiPath(this.site, '/screen-sizes'),
        this.query
      );
    };

    const renderIcon = (screenSize: PlausibleListItemData) => {
      return this.iconFor(screenSize.name);
    };

    const renderTooltipText = (screenSize: PlausibleListItemData) => {
      return EXPLANATION[screenSize.name!];
    };

    return html`
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .filter=${{ screen: 'name' }}
        .keyLabel=${this.t("Screen size")}
        .timer="${this.timer}"
        .query=${this.query}
        .renderIcon=${renderIcon}
        .tooltipText=${renderTooltipText}
      ></pl-list-report>
    `;
  }

  iconFor(screenSize: string) {
    if (screenSize === 'Mobile') {
      return html`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
      `;
    } else if (screenSize === 'Tablet') {
      return html`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            ry="2"
            transform="rotate(180 12 12)"
          />
          <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
      `;
    } else if (screenSize === 'Laptop') {
      return html`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      `;
    } else if (screenSize === 'Desktop') {
      return html`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      `;
    }
  }

  renderContent() {
    switch (this.mode) {
      case 'browser':
        if (this.query.filters.browser) {
          return this.renderBrowserVersions();
        } else {
          return this.renderBrowsers();
        }
      case 'os':
        if (this.query.filters.os) {
          return this.renderOperatingSystemVersions();
        } else {
          return this.renderOperatingSystems();
        }
      case 'size':
      default:
        return this.renderScreenSizes();
    }
  }

  renderPill(name: string, mode: string) {
    const isActive = this.mode === mode;

    if (isActive) {
      return html`
        <li
          class="inline-block h-5 font-bold text-indigo-700 active-prop-heading dark:text-indigo-500"
        >
          ${this.t(name)}
        </li>
      `;
    } else {
      return html`
        <li
          class="cursor-pointer hover:text-indigo-600"
          @click=${() => this.setMode(mode)}
        >
          ${this.t(name)}
        </li>
      `;
    }
  }

  render() {
    return html`
      <div class="stats-item flex flex-col mt-6 stats-item--has-header w-full">
        <div
          class="stats-item-header flex flex-col flex-grow relative p-4 bg-white rounded shadow-xl dark:bg-gray-825"
        >
          <div class="flex justify-between w-full">
            <h3 class="font-bold dark:text-gray-100">${this.t("Devices")}</h3>
            <ul
              class="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2"
            >
              ${this.renderPill('Size', 'size')}
              ${this.renderPill('Browser', 'browser')}
              ${this.renderPill('OS', 'os')}
            </ul>
          </div>
          ${this.renderContent()}
        </div>
      </div>
    `;
  }
}
