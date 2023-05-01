import { LitElement, css, html, nothing } from 'lit';
import { property, customElement, query, queryAsync } from 'lit/decorators.js';
import 'lit-flatpickr';

import {
  shiftDays,
  shiftMonths,
  formatDay,
  formatDayShort,
  formatMonthYYYY,
  formatYear,
  formatISO,
  isToday,
  lastMonth,
  nowForSite,
  isSameMonth,
  isThisMonth,
  isThisYear,
  parseUTCDate,
  isBefore,
  isAfter,
} from './util/date';
import { navigateToQuery } from './query';
import { PlausibleBaseElement } from './pl-base-element';

import './pl-query-button.js';
import './pl-query-link.js';
import { LitFlatpickr } from 'lit-flatpickr';
import { BrowserHistory } from './util/history';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state';
import { ChevronDownIcon } from './pl-icons';

@customElement('pl-date-picker')
export class PlausibleDatePicker extends PlausibleBaseElementWithState {
  @property({ type: String })
  currentUserRole!: string;

  @property({ type: Object })
  history!: BrowserHistory;

  @query('#dropdownNode')
  dropdownNode!: HTMLDivElement;

  @queryAsync('#calendar')
  calendar!: LitFlatpickr;

  @property({ type: String })
  leadingText: string | undefined;

  @property({ type: String })
  mode = 'menu';

  @property({ type: Boolean })
  open = false;

  dayBeforeCreation: number | undefined;

  constructor() {
    super();
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setCustomDate = this.setCustomDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('mousedown', this.handleClick, false);
    const statsBeginDateDate = new Date(this.site.statsBegin!);
    this.dayBeforeCreation = statsBeginDateDate.getTime() - 86400000;
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        .pointer {
          cursor: pointer;
        }
      `,
    ];
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('query')) {
      this.close();
    }
  }

  renderArrow(period: string, prevDate: string, nextDate: string) {
    const insertionDate = parseUTCDate(this.site.statsBegin);
    const disabledLeft = isBefore(
      parseUTCDate(prevDate),
      insertionDate,
      period
    );
    const disabledRight = isAfter(
      parseUTCDate(nextDate),
      nowForSite(this.site),
      period
    );

    const leftClasses = `flex items-center px-1 sm:px-2 border-r border-gray-300 rounded-l
        dark:border-gray-500 dark:text-gray-100 ${
          disabledLeft
            ? 'bg-gray-300 dark:bg-gray-950'
            : 'hover:bg-gray-100 dark:hover:bg-gray-900'
        }`;
    const rightClasses = `flex items-center px-1 sm:px-2 rounded-r dark:text-gray-100 ${
      disabledRight
        ? 'bg-gray-300 dark:bg-gray-950'
        : 'hover:bg-gray-100 dark:hover:bg-gray-900'
    }`;
    return html`
      <div
        class="flex rounded shadow bg-white mr-2 sm:mr-4 cursor-pointer dark:bg-gray-800"
      >
        <pl-query-button
          .to=${{ date: prevDate }}
          .query=${this.query}
          class="${leftClasses}"
          ?disabled=${disabledLeft}
        >
          <svg
            class="feather h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </pl-query-button>
        <pl-query-button
          .to=${{ date: nextDate }}
          .query=${this.query}
          class=${rightClasses}
          ?disabled=${disabledRight}
        >
          <svg
            class="feather h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </pl-query-button>
      </div>
    `;
  }

  datePickerArrows() {
    if (this.query.period === 'year') {
      const prevDate = formatISO(shiftMonths(this.query.date, -12));
      const nextDate = formatISO(shiftMonths(this.query.date, 12));

      return this.renderArrow('year', prevDate, nextDate);
    } else if (this.query.period === 'month') {
      const prevDate = formatISO(shiftMonths(this.query.date, -1));
      const nextDate = formatISO(shiftMonths(this.query.date, 1));

      return this.renderArrow('month', prevDate, nextDate);
    } else if (this.query.period === 'day') {
      const prevDate = formatISO(shiftDays(this.query.date, -1));
      const nextDate = formatISO(shiftDays(this.query.date, 1));

      return this.renderArrow('day', prevDate, nextDate);
    } else {
      return nothing;
    }
  }

  handleKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLInputElement).tagName === 'INPUT') return true;
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.isComposing ||
      e.keyCode === 229
    )
      return true;

    const newSearch = {
      period: '',
      from: '',
      to: '',
      date: '',
    } as PlausibleQueryStringsData;

    const insertionDate = parseUTCDate(this.site.statsBegin);

    if (e.key === 'ArrowLeft') {
      const prevDate = formatISO(shiftDays(this.query.date, -1));
      const prevMonth = formatISO(shiftMonths(this.query.date, -1));
      const prevYear = formatISO(shiftMonths(this.query.date, -12));

      if (
        this.query.period === 'day' &&
        !isBefore(parseUTCDate(prevDate), insertionDate, this.query.period)
      ) {
        newSearch.period = 'day';
        newSearch.date = prevDate;
      } else if (
        this.query.period === 'month' &&
        !isBefore(parseUTCDate(prevMonth), insertionDate, this.query.period)
      ) {
        newSearch.period = 'month';
        newSearch.date = prevMonth;
      } else if (
        this.query.period === 'year' &&
        !isBefore(parseUTCDate(prevYear), insertionDate, this.query.period)
      ) {
        newSearch.period = 'year';
        newSearch.date = prevYear;
      }
    } else if (e.key === 'ArrowRight') {
      const now = nowForSite(this.site);
      const nextDate = formatISO(shiftDays(this.query.date, 1));
      const nextMonth = formatISO(shiftMonths(this.query.date, 1));
      const nextYear = formatISO(shiftMonths(this.query.date, 12));

      if (
        this.query.period === 'day' &&
        !isAfter(parseUTCDate(nextDate), now, this.query.period)
      ) {
        newSearch.period = 'day';
        newSearch.date = nextDate;
      } else if (
        this.query.period === 'month' &&
        !isAfter(parseUTCDate(nextMonth), now, this.query.period)
      ) {
        newSearch.period = 'month';
        newSearch.date = nextMonth;
      } else if (
        this.query.period === 'year' &&
        !isAfter(parseUTCDate(nextYear), now, this.query.period)
      ) {
        newSearch.period = 'year';
        newSearch.date = nextYear;
      }
    }

    this.open = false;

    const keys = ['d', 'e', 'r', 'w', 'm', 'y', 't', 's', 'l', 'a'];
    const redirects = [
      { date: false, period: 'day' },
      {
        date: formatISO(shiftDays(nowForSite(this.site), -1)),
        period: 'day',
      },
      { period: 'realtime' },
      { date: false, period: '7d' },
      { date: false, period: 'month' },
      { date: false, period: 'year' },
      { date: false, period: '30d' },
      { date: false, period: '6mo' },
      { date: false, period: '12mo' },
      { date: false, period: 'all' },
    ];

    if (keys.includes(e.key.toLowerCase())) {
      navigateToQuery(this.history, this.query, {
        ...newSearch,
        ...redirects[keys.indexOf(e.key.toLowerCase())],
      } as PlausibleQueryStringsData);
    } else if (e.key.toLowerCase() === 'c') {
      this.openCalendar();
    } else if (newSearch.date) {
      navigateToQuery(
        this.history,
        this.query,
        newSearch as PlausibleQueryStringsData
      );
    }
  }

  handleClick(e: MouseEvent) {
    if (
      this.dropdownNode &&
      this.dropdownNode.contains(e.target as HTMLDivElement)
    )
      return;

    //this.updateState({ open: false });
  }

  setCustomDate(dates: string[]) {
    if (dates.length === 2) {
      const [from, to] = dates;
      if (formatISO(from) === formatISO(to)) {
        navigateToQuery(this.history, this.query, {
          period: 'day',
          date: formatISO(from),
          from: '',
          to: '',
        });
      } else {
        navigateToQuery(this.history, this.query, {
          period: 'custom',
          date: '',
          from: formatISO(from),
          to: formatISO(to),
        });
      }
      this.close();
    }
  }

  timeFrameText() {
    if (this.query.period === 'day') {
      if (isToday(this.site, this.query.date)) {
        return this.t('Today');
      }
      return formatDay(this.query.date);
    }
    if (this.query.period === '7d') {
      return this.t('Last 7 days');
    }
    if (this.query.period === '30d') {
      return this.t('Last 30 days');
    }
    if (this.query.period === 'month') {
      if (isThisMonth(this.site, this.query.date)) {
        return this.t('Month to Date');
      }
      return formatMonthYYYY(this.query.date);
    }
    if (this.query.period === '6mo') {
      return this.t('Last 6 months');
    }
    if (this.query.period === '12mo') {
      return this.t('Last 12 months');
    }
    if (this.query.period === 'year') {
      if (isThisYear(this.site, this.query.date)) {
        return this.t('Year to Date');
      }
      return formatYear(this.query.date);
    }
    if (this.query.period === 'all') {
      return this.t('All time');
    }
    if (this.query.period === 'custom') {
      return `${formatDayShort(this.query.from)} - ${formatDayShort(
        this.query.to
      )}`;
    }
    return this.t('Realtime');
  }

  toggle() {
    const newMode = this.mode === 'calendar' && !this.open ? 'menu' : this.mode;
    this.mode = newMode;
    this.open = !this.open;
    this.requestUpdate();
  }

  close() {
    this.open = false;
  }

  async openCalendar() {
    this.mode = 'calendar';
    this.open = true;
    const calendar = await this.calendar;
    calendar.open();
  }

  renderLink(period: string, text: string, opts: any = {}) {
    let boldClass;
    if (this.query.period === 'day' && period === 'day') {
      boldClass = isToday(this.site, this.query.date) ? 'font-bold' : '';
    } else if (this.query.period === 'month' && period === 'month') {
      const linkDate = opts.date || nowForSite(this.site);
      boldClass = isSameMonth(linkDate, this.query.date) ? 'font-bold' : '';
    } else {
      boldClass = this.query.period === period ? 'font-bold' : '';
    }

    opts.date = opts.date ? formatISO(opts.date) : false;

    const keybinds = {
      Today: 'D',
      Realtime: 'R',
      'Last 7 days': 'W',
      'Month to Date': 'M',
      'Year to Date': 'Y',
      'Last 12 months': 'L',
      'Last 30 days': 'T',
      'All time': 'A',
    } as any;

    return html`
      <pl-query-link
        .to=${{ from: false, to: false, period, ...opts }}
        .onClick=${this.close}
        .history="${this.history}"
        .query=${this.query}
        class=${`${boldClass} px-4 py-2 text-sm leading-tight hover:bg-gray-100 hover:text-gray-900
          dark:hover:bg-gray-900 dark:hover:text-gray-100 flex items-center justify-between`}
      >
        ${text}
        <span class="font-normal">${keybinds[text]}</span>
      </pl-query-link>
    `;
  }

  renderDropDownContent() {
    if (this.mode === 'menu') {
      return html`
        <div
          id="datemenu"
          class="absolute w-full md:w-56 md:absolute md:top-auto md:left-auto md:right-0 mt-2 origin-top-right z-10"
        >
          <div
            class="rounded-md shadow-lg  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5
            font-medium text-gray-800 dark:text-gray-200 date-options"
          >
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink('day', this.t('Today'))}
              ${this.renderLink('realtime', this.t('Realtime'))}
            </div>
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink('7d', this.t('Last 7 days'))}
              ${this.renderLink('30d', this.t('Last 30 days'))}
            </div>
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink('month', this.t('Month to Date'))}
              ${this.renderLink('month', this.t('Last month'), {
                date: lastMonth(this.site),
              })}
            </div>
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink('year', this.t('Year to Date'))}
              ${this.renderLink('12mo', this.t('Last 12 months'))}
            </div>
            <div class="py-1 date-option-group">
              ${this.renderLink('all', this.t('All time'))}
              <span
                @click="${() => {
                  this.openCalendar();
                }}"
                class="px-4 py-2 text-sm leading-tight hover:bg-gray-100
                  dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100
                  cursor-pointer flex items-center justify-between"
                tabIndex="0"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="calendar"
              >
                ${this.t('Custom range')}
                <span class="font-normal">C</span>
              </span>
            </div>
          </div>
        </div>
      `;
    } else if (this.mode === 'calendar') {
      return html``;
    }
  }

  renderPicker() {
    return html`
      <div id="dropdownNode" class="sm:w-36 md:w-48 md:relative">
        <div
          @click=${this.toggle}
          @keyPress=${this.toggle}
          class="flex items-center justify-between rounded bg-white dark:bg-gray-800 shadow px-2 md:px-3
          py-2 leading-tight cursor-pointer text-xs md:text-sm text-gray-800
          dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-900"
          style="width: 192px"
          tabindex="0"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="datemenu"
        >
          <span class="truncate mr-1 md:mr-2">
            ${this.leadingText}
            <span class="font-medium">${this.timeFrameText()}</span>
          </span>
          <div class=" sm:inline-block h-4 w-4 md:h-5 md:w-5 text-gray-500">
            ${ChevronDownIcon}
          </div>
        </div>

        ${this.open ? this.renderDropDownContent() : nothing}
        <lit-flatpickr
          id="calendar"
          mode="range"
          style="height: 0; width: 0;"
          maxDate="today"
          .minDate=${this.dayBeforeCreation}
          showMonths="1"
          animate="true"
          .onValueUpdate="${this.setCustomDate}"
        >
        </lit-flatpickr>
      </div>
    `;
  }

  render() {
    return html`
      <div class="flex ml-auto pl-2 pointer">
        ${this.datePickerArrows()} ${this.renderPicker()}
      </div>
    `;
  }
}
