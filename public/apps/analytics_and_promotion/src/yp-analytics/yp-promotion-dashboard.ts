import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../pl-components/pl-dashboard.js';

import './yp-realtime.js';
import './yp-historical.js';

import { PlausibleDashboard } from '../pl-components/pl-dashboard.js';
import { YpServerApi } from '../@yrpri/common/YpServerApi.js';

@customElement('yp-promotion-dashboard')
export class YpPromotionDashboard extends PlausibleDashboard {
  @property({ type: String })
  plausibleSiteName: string | undefined;

  @property({ type: Object })
  collection!: YpCollectionData;

  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Number })
  useProjectId: number | undefined;

  connectedCallback(): void {

    this.plausibleSiteName = "aoi-localhost";
    this.site = {
      domain: this.plausibleSiteName!,
      hasGoals: true,
      embedded: false,
      offset: 1,
      statsBegin: this.collection!.created_at!,
      isDbip: false,
      flags: {
        custom_dimension_filter: false,
      },
    };

    if (!this.plausibleSiteName) {
      try {
        fetch('/api/users/has/PlausibleSiteName', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            this.plausibleSiteName = data.plausibleSiteName;
            this.site = {
              domain: this.plausibleSiteName!,
              hasGoals: true,
              embedded: false,
              offset: 1,
              statsBegin: this.collection!.created_at!,
              isDbip: false,
              flags: {
                custom_dimension_filter: false,
              },
            };
            super.connectedCallback();
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      super.connectedCallback();
    }
  }

  static get styles() {
    return [css`
      :host {
        max-width: 1280px;
        width: 1280px;
      }
    `];
  }

  render() {
    if (this.site && this.query) {
      if (this.query!.period === 'realtime') {
        return html`
          <yp-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"
            .history="${this.history}"
            .proxyUrl="${`/api/${YpServerApi.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useProjectId ? `?projectId=${this.useProjectId}` : ''}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-realtime>
        `;
      } else {
        return html`
          <yp-historical
            .timer="${this.timer}"
            .site="${this.site}"
            .history="${this.history}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"
            .proxyUrl="${`/api/${YpServerApi.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useProjectId ? `?projectId=${this.useProjectId}` : ''}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-historical>
        `;
      }
    } else {
      return nothing;
    }
  }
}
