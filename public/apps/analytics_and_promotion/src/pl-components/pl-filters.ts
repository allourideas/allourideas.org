import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { appliedFilters, navigateToQuery, formattedFilters } from './query';

import {
  FILTER_GROUPS,
  formatFilterGroup,
  filterGroupForFilter,
  toFilterType,
  valueWithoutPrefix,
} from './util/filter.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state';
import { BrowserHistory } from './util/history';
import { AdjustmentsIcon, PencilIcon, SearchIcon, XIcon } from './pl-icons';

@customElement('pl-filters')
export class PlausibleFilters extends PlausibleBaseElementWithState {
  @property({ type: String })
  url!: string;

  @property({ type: Number })
  viewport = 1080;

  @property({ type: Number })
  wrapped = 1; // 0=unwrapped, 1=waiting to check, 2=wrapped

  @property({ type: Object })
  history!: BrowserHistory;

  @property({ type: Boolean })
  addingFilter = false;

  @property({ type: Boolean })
  menuOpen = false;

  connectedCallback() {
    super.connectedCallback();
    this.renderDropDown = this.renderDropDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);

    document.addEventListener('mousedown', this.handleClick, false);
    window.addEventListener('resize', this.handleResize, false);
    document.addEventListener('keyup', this.handleKeyup);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keyup', this.handleKeyup);
    document.removeEventListener('mousedown', this.handleClick, false);
    window.removeEventListener('resize', this.handleResize, false);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.get('query') || changedProperties.get('viewport')) {
      this.wrapped = 1;
    }

    if (
      changedProperties.get('wrapped') &&
      this.wrapped === 1 &&
      changedProperties.get('wrapped') !== -1
    ) {
      this.rewrapFilters();
    }

    this.rewrapFilters();
  }

  firstUpdated() {
    this.handleResize();
    this.rewrapFilters();
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        .filterMain {
          margin-right: 0px;
          font-size: 14px;
          color: #444;
        }

        .filterKeys {
          padding-top: 8px;
        }

        .filterContainer {
          padding-top: 0px;
          padding-bottom: 0px;
          height: 32px;
          font-size: 12px;
        }
      `,
    ];
  }

  handleClick(e: MouseEvent) {
    if (this.menuOpen && !this.contains(e.target as Node)) {
      this.menuOpen = false;
    }
    this.menuOpen = false;
  }

  removeFilter(key: string) {
    const newOpts = {
      [key]: false,
    };
    if (key === 'country') {
      newOpts.country_name = false;
    }
    if (key === 'region') {
      newOpts.region_name = false;
    }
    if (key === 'city') {
      newOpts.city_name = false;
    }

    this.menuOpen = false;

    navigateToQuery(this.history, this.query, newOpts as any);
  }

  clearAllFilters() {
    const newOpts = Object.keys(this.query.filters).reduce(
      (acc, red) => ({ ...acc, [red]: false }),
      {}
    );
    navigateToQuery(this.history, this.query, newOpts as any);
    this.menuOpen = false;
  }

  filterText(key: string, rawValue: string) {
    const type = toFilterType(rawValue);
    const translatedType = this.t(type);
    const value = valueWithoutPrefix(rawValue);

    if (key === 'goal') {
      return html`${this.t('Completed goal')}: <b>${this.t(value)}</b>`;
    }
    if (key === 'props') {
      const [metaKey, metaValue] = Object.entries(value)[0];
      const eventName = this.query.filters.goal
        ? this.query.filters.goal
        : 'event';
      return html`${eventName}.${metaKey} ${toFilterType(metaValue)}
        <b>${valueWithoutPrefix(metaValue)}</b>`;
    }
    if (key === 'browser_version') {
      const browserName = this.query.filters.browser
        ? this.query.filters.browser
        : this.t('Browser');
      return html`${browserName}.Version ${translatedType} <b>${value}</b>`;
    }
    if (key === 'os_version') {
      const osName = this.query.filters.os ? this.query.filters.os : 'OS';
      return html`${osName}.Version ${translatedType} <b>${value}</b>`;
    }
    if (key === 'country') {
      const q = new URLSearchParams(window.location.search);
      const countryName = q.get('country_name');
      return html`${this.t('Country')} ${translatedType} <b>${countryName}</b>`;
    }

    if (key === 'region') {
      const q = new URLSearchParams(window.location.search);
      const regionName = q.get('region_name');
      return html`${this.t('Region')} ${translatedType} <b>${regionName}</b>`;
    }

    if (key === 'city') {
      const q = new URLSearchParams(window.location.search);
      const cityName = q.get('city_name');
      return html`${this.t('City')} ${translatedType} <b>${cityName}</b>`;
    }

    //@ts-ignore
    const formattedFilter = formattedFilters[key];

    if (formattedFilter) {
      return html`${this.t(formattedFilter)} ${translatedType} <b>${value}</b>`;
    }

    throw new Error(`Unknown filter: ${key}`);
  }

  renderDropdownFilter(filter: string[]) {
    const key = filter[0];
    const value = filter[1];
    return html`
      <div key=${key}>
        <div
          class="px-3 md:px-4 sm:py-2 py-3 text-sm leading-tight flex items-center justify-between"
          key="{key"
          +
          value}
        >
          <pl-link
            title=${`Edit filter: ${formattedFilters[key]}`}
            .to=${{
              pathname: `/${encodeURIComponent(
                this.site.domain
              )}/filter/${filterGroupForFilter(key)}`,
              search: window.location.search,
            }}
            class="group flex w-full justify-between items-center"
            .style=${{ width: 'calc(100% - 1.5rem)' }}
          >
            <span class="inline-block w-full truncate"
              >${this.filterText(key, value)}</span
            >
            <div hidden
              class="w-4 h-4 ml-1 cursor-pointer group-hover:text-indigo-700 dark:group-hover:text-indigo-500"
            >
              ${PencilIcon}
            </div>
          </pl-link>
          <b
            title=${`Remove filter: ${formattedFilters[key]}`}
            class="ml-2 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-500"
            @click=${() => this.removeFilter(key)}
          >
            <div class="w-4 h-4">${XIcon}</div>
          </b>
        </div>
      </div>
    `;
  }

  filterDropdownOption(option: string) {
    //TODO: Fix this and find what item is active
    const active = true;
    return html`
      <div key=${option}>
        <pl-link
          .to=${{
            pathname: `/${encodeURIComponent(
              this.site.domain
            )}/filter/${option}`,
            search: window.location.search,
          }}
          class="${active
            ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
            : 'text-gray-800 dark:text-gray-300'} block px-4 py-2 text-sm font-medium"
        >
          ${formatFilterGroup(option)}
        </pl-link>
      </div>
    `;
  }

  renderDropdownContentOriginal() {
    if (this.wrapped === 0 || this.addingFilter) {
      return Object.keys(FILTER_GROUPS)
        .filter(option =>
          option === 'props' ? this.site.flags!.custom_dimension_filter : true
        )
        .map(option => this.filterDropdownOption(option));
    } else {
      return html`
        <div
          class="border-b border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
          @click=${() => (this.addingFilter = true)}
        >
          + Add filter
        </div>
        ${appliedFilters(this.query).map(filter =>
          this.renderDropdownFilter(filter)
        )}
        <div key="clear">
          <div
            class="border-t border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
            @click=${() => this.clearAllFilters()}
          >
           ${this.t("Clear All Filters")}
          </div>
        </div>
      `;
    }
  }

  renderDropdownContent() {
    if (this.wrapped === 0 || this.addingFilter) {
      return nothing;
    } else {
      return html`
        ${appliedFilters(this.query).map(filter =>
          this.renderDropdownFilter(filter)
        )}
        <div key="clear">
          <div
            class="pointer border-t border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
            @click=${() => this.clearAllFilters()}
          >
            ${this.t("Clear All Filters")}
          </div>
        </div>
      `;
    }
  }

  handleKeyup(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Escape') {
      this.clearAllFilters();
    }
  }

  handleResize() {
    this.viewport = window.innerWidth || 639;
  }

  // Checks if the filter container is wrapping items
  rewrapFilters() {
    const items = this.$$('#filters');

    // Always wrap on mobile
    if (appliedFilters(this.query).length > 0 && this.viewport <= 768) {
      this.wrapped = 2;
      return;
    }

    //this.wrapped = 0;

    // Don't rewrap if we're already properly wrapped, there are no DOM children, or there is only filter
    if (
      this.wrapped !== 1 ||
      !items ||
      appliedFilters(this.query).length === 1
    ) {
      return;
    }

    let prevItem: { top: number };

    // For every filter DOM Node, check if its y value is higher than the previous (this indicates a wrap)
    [...items.childNodes].forEach(item => {
      // @ts-ignore
      if (typeof item.getBoundingClientRect === 'function') {
        // @ts-ignore
        const currItem = item.getBoundingClientRect();
        if (prevItem && prevItem.top < currItem.top) {
          this.wrapped = 2;
        }
        prevItem = currItem;
      }
    });
  }

  renderListFilter(filter: string[]) {
    const key = filter[0];
    const value = filter[1];

    return html`
      <div
        .key=${key}
        .title=${value}
        class="flex bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow text-sm rounded mr-2 items-center filterContainer"
      >
        <pl-link
          .title=${`Edit filter: ${formattedFilters[key]}`}
          class="flex w-full h-full items-center py-2 pl-3"
          .to=${{
            pathname: `/${encodeURIComponent(
              this.site.domain
            )}/filter/${filterGroupForFilter(key)}`,
            search: window.location.search,
          }}
        >
          <span class="filterKeys inline-block max-w-2xs md:max-w-xs truncate"
            >${this.filterText(key, value)}</span
          >
        </pl-link>
        <span
          .title=${`Remove filter: ${formattedFilters[key]}`}
          class="flex h-full w-full px-2 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-500 items-center"
          @click=${() => this.removeFilter(key)}
        >
          <div class="w-4 h-4">${XIcon}</div>
        </span>
      </div>
    `;
  }

  renderDropdownButton() {
    if (this.wrapped === 2) {
      const filterCount = appliedFilters(this.query).length;
      return html`
        <div class="flex">
          <div class="-ml-1 mr-1 h-4 w-4 layout horizontal" aria-hidden="true">
            ${AdjustmentsIcon}
          </div>
          <div>${filterCount} Filter${filterCount === 1 ? '' : 's'}</div>
        </div>
      `;
    } else if (this.wrapped === 1) {
      return nothing;
    } else {
      return html`
        <div class="flex">
          <div class="ml-1 mr-1 h-4 w-4 h-4 w-4" aria-hidden="true">
            ${SearchIcon}
          </div>
          <!-- This would have been a good use-case for JSX! But in the interest of keeping the breakpoint width logic with TailwindCSS, this is a better long-term way to deal with it. -->
          <span class="">Filter</span>
        </div>
      `;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  renderDropDown() {
    return html`
      <div class="flex">
        <div class="flex"></div>
        <button @click="${this.toggleMenu}">
          ${this.renderDropdownButton()}
        </button>
      </div>

      ${this.menuOpen
        ? html`
            <div class="md:relative ml-auto">
              <div
                static
                class="absolute w-full left-0 right-0 md:w-72 md:absolute md:top-auto md:left-auto md:right-0 mt-2 origin-top-right z-10"
              >
                <div
                  class="rounded-md shadow-lg  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5
              font-medium text-gray-800 dark:text-gray-200"
                >
                  ${this.renderDropdownContent()}
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
  }

  renderFilterList() {
    if (this.wrapped !== 2) {
      return html`
        <div id="filters" class="flex flex-wrap">
          ${appliedFilters(this.query).map(filter =>
            this.renderListFilter(filter)
          )}
        </div>
      `;
    } else {
      return nothing;
    }
  }

  render() {
    return html`
      <div class="flex ml-auto pl-2 filterMain">
        ${this.renderFilterList()} ${this.renderDropDown()}
      </div>
    `;
  }
}
