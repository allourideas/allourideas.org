import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import numberFormatter from '../../util/number-formatter';
import * as api from '../../api.js';
import * as url from '../../util/url.js';
import { suppressDeprecationWarnings } from 'moment';

import '../../pl-link.js';
import '../pl-bar.js';
import './pl-prop-breakdown.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';

const MOBILE_UPPER_WIDTH = 767;
const DEFAULT_WIDTH = 1080;

@customElement('pl-conversions')
export class PlausibleConversions extends PlausibleBaseElementWithState {
  @property({ type: Object })
  onClickFunction!: any;

  @property({ type: Boolean })
  loading = false;

  @property({ type: Number })
  viewport = DEFAULT_WIDTH;

  @property({ type: Number })
  prevHeight: number | undefined;

  @property({ type: Array })
  goals?: PlausibleGoalData[];

  @property({ type: Array })
  highlightedGoals?: string[];

  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize, false);
    this.handleResize();
    if (this.timer) this.timer.onTick(this.fetchConversions.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize, false);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.get('query')) {
      const height = this.offsetHeight;
      this.loading = true;
      this.prevHeight = height;
      this.fetchConversions();
    }
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        @media (max-width: 767px) {
          .mainContainer {
            max-width: calc(100vw - 32px);
          }

          .w-20 {
            width: 2.6rem;
          }

          pl-bar {
            max-width: 70%;
          }

          .padOnMobile {
            margin-right: 16px;
          }
        }

        pl-bar {
            max-width: 70%;
        }
      `
    ];
  }

  handleResize() {
    this.viewport = window.innerWidth;
  }

  firstUpdated() {
    this.fetchConversions();
  }

  getBarMaxWidth() {
    return this.viewport! > MOBILE_UPPER_WIDTH ? '16rem' : '10rem';
  }

  fetchConversions() {
    api
      .get(
        this.proxyUrl,
        `/api/stats/${encodeURIComponent(this.site.domain!)}/conversions`,
        this.query
      )
      .then(res =>
        { this.loading=false; this.goals= res; this.prevHeight = undefined }
      );
  }

  getPlBackground(goalName: string) {
    if (this.highlightedGoals && this.highlightedGoals.includes(goalName)) {
      return 'bg-red-60';
    } else if (this.highlightedGoals) {
      return 'bg-red-40';
    } else {
      return 'bg-red-50';
    }
  }

  renderGoal(goal: PlausibleGoalData) {
    const renderProps =
      this.query.filters!['goal'] == goal.name && goal.prop_names;

    return html`
      <div class="my-2 text-sm" key=${goal.name}>
        <div class="flex items-center justify-between my-2">
          <pl-bar
            .count="${goal.unique_conversions}"
            .all="${this.goals!}"
            bg="${this.getPlBackground(goal.name)} dark:bg-gray-500 dark:bg-opacity-15"
            .maxWidthDeduction="${this.getBarMaxWidth()}"
            plot="unique_conversions"
          >
            <pl-link
              .to="${{search: url.setQuerySearch('goal', goal.name)}}"
              class="block px-2 py-1.5 hover:underline relative z-2 break-all lg:truncate dark:text-gray-200"
              >${this.t(goal.name)}</pl-link
            >
          </pl-bar>
          <div class="dark:text-gray-200">
            <span class="inline-block w-20 font-medium text-right"
              >${numberFormatter(goal.unique_conversions)}</span
            >
            ${this.viewport && this.viewport > MOBILE_UPPER_WIDTH
              ? html`<span class="inline-block w-20 font-medium text-right"
                  >${numberFormatter(goal.total_conversions)}</span
                >`
              : nothing}
            <span class="inline-block w-20 font-medium text-right"
              >${goal.conversion_rate}%</span
            >
          </div>
        </div>
        ${renderProps
          ? html`<pl-prop-breakdown
              .site=${this.site}
              .query=${this.query}
              .goal=${goal}
              .proxyUrl=${this.proxyUrl}
            ></pl-prop-breakdown>`
          : nothing}
      </div>
    `;
  }

  renderInner() {
    if (!this.goals) {
      return html`<div class="mx-auto my-2 loading"><div></div></div>`;
    } else {
      return html`
        <h3 class="font-bold dark:text-gray-100">
          ${this.title || this.t("Goal Conversions")}
        </h3>
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
        >
          <span>${this.t("Goal")}</span>
          <div class="text-right">
            <span class="inline-block w-20 padOnMobile">${this.t("Uniques")}</span>
            ${this.viewport && this.viewport > MOBILE_UPPER_WIDTH
              ? html`<span class="inline-block w-20">${this.t("Total")}</span>`
              : nothing}
            <span class="inline-block w-20">CR</span>
          </div>
        </div>

        ${this.goals.map(this.renderGoal.bind(this))}
      `;
    }
  }

  render() {
    return html`
      <div
        class="w-full p-4 bg-white rounded shadow-xl dark:bg-gray-825 mainContainer"
        .style="${{
          minHeight: '132px',
          height: this.prevHeight ?? 'auto',
        }}"
        .ref=${this}
      >
        ${this.renderInner()}
      </div>
    `;
  }
}
