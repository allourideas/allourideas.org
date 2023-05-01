import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { PlausibleRealtime } from '../pl-components/pl-realtime.js';
import '../pl-components/stats/graph/pl-goal-graph.js';
import { highlightedGoals } from './ypHighlightedGoals.js';

@customElement('yp-realtime')
export class YpRealtime extends PlausibleRealtime {
  @property({ type: Object })
  collection!: YpCollectionData;

  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number;

  static get styles() {
    return [...super.styles, css``];
  }

  constructor() {
    super();
    this.highlightedGoals = highlightedGoals;
  }

  render() {
    const navClass = this.site.embedded ? 'relative' : 'sticky';
    return html`
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${navClass} top-0 sm:py-3 py-2 z-10 ${
            this.stuck && !this.site.embedded
              ? 'fullwidth-shadow bg-gray-50 dark:bg-gray-850'
              : ''
          }`}
        >
          <div class="items-center w-full flex">
            <div class="flex w-full"></div>
            <div class="flex">
              <pl-filters
                class="flex"
                .site=${this.site}
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-date-picker
              .site="${this.site}"
              .query="${this.query}"
              .history="${this.history}"
            ></pl-date-picker>
          </div>
        </div>
        ${!this.wide
          ? html`
              <md-standard-icon-button
                icon="close"
                @click="${() => this.fire('exit-to-app')}"
              ></md-standard-icon-button>
            `
          : nothing}

        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .timer="${this.timer}"
          useTopStatsForCurrentVisitors
          .proxyUrl="${this.proxyUrl}"
        ></pl-visitors-graph>
        <yp-campaigns-analytics
          .site="${this.site}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .timer="${this.timer}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"
        ></yp-campaigns-analytics>
        <pl-goal-graph
          .events="${[
            'newPost - completed',
            'newPointAgainst - completed',
            'newPointFor - completed',
          ]}"
          .chartTitle="${this.t('Users who added content')}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .timer="${this.timer}"
          .site="${this.site}"
          gradientColorStop1="rgba(205,116,101, 0.2)"
          gradientColorStop2="rgba(205,116,101, 0.2)"
          prevGradientColorStop1="rgba(205,116,101, 0.075)"
          prevGradientColorStop2="rgba(205,116,101, 0)"
          borderColor="rgba(205,116,101)"
          pointBackgroundColor="rgba(205,116,101)"
          pointHoverBackgroundColor="rgba(193, 87, 71)"
          prevPointHoverBackgroundColor="rgba(166,187,210,0.8)"
          prevBorderColor="rgba(210,187,166,0.5)"
          .chartHeigh="${this.wide ? 200 : 300}"
        >
        </pl-goal-graph>
        <pl-goal-graph
          .events="${[
            'endorse_up - completed',
            'endorse_down - completed',
            'pointHelpful - completed',
            'pointNotHelpful - completed',
            'post.ratings - add',
          ]}"
          .chartTitle="${this.t('Users who rated content')}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .timer="${this.timer}"
          .site="${this.site}"
          .chartHeigh="${this.wide ? 200 : 300}"
        >
        </pl-goal-graph>
        <div
          class="items-start justify-between block w-full md:flex flex flex-wrap"
        >
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            ?hidden="${this.collectionType=="post" && !this.wide}"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div
          class="items-start justify-between block w-full md:flex flex flex-wrap"
        >
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `;
  }
}
