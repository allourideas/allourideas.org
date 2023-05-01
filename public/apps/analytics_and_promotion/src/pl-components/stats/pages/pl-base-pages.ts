import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import './../reports/pl-list-report.js';
import { property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';

export class PlausableBasePages extends PlausibleBaseElementWithState {
  @property({ type: String })
  pagePath: string | undefined;

  connectedCallback() {
    super.connectedCallback();
  }

  fetchData() {
    return api.get(
      this.proxyUrl,
      url.apiPath(this.site, this.pagePath),
      this.query,
      { limit: 9 }
    );
  }

  externalLinkDest(page: PlausiblePageData) {
    return url.externalLinkForPage(this.site.domain, page.name);
  }
}
