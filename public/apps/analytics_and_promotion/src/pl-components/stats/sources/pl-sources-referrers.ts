import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import numberFormatter from '../../util/number-formatter';
import { PlausibleSourcesBase } from './pl-sources-base';

import * as url from '../../util/url.js';
import * as api from '../../api.js';

import '../../pl-link.js';
import '../pl-bar.js';
import '../../pl-fade-in.js';
import { PlausibleSourcesAll } from './pl-sources-all';

@customElement('pl-sources-referrers')
export class PlausibleSourcesReferres extends PlausibleSourcesAll {
  fetchReferrers() {
    this.loading = true;
    this.referrers = undefined;

    api
      .get(
        this.proxyUrl,
        `/api/stats/${encodeURIComponent(this.site!.domain!)}/referrers/${encodeURIComponent(this.query.filters["source"] as string)}`,
        this.query,
        { show_noref: this.showNoRef }
      )
      .then((res: PlausibleReferrerData[]) => {
        this.loading = false;
        this.referrers = res;
      });
  }

}
