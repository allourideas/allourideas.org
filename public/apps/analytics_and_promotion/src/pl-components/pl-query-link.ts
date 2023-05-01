import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { navigateToQuery, generateQueryString } from './query.js';
import { PlausibleStyles } from './plausibleStyles.js';
import { PlausibleBaseElement } from './pl-base-element.js';
import { BrowserHistory } from './util/history.js';

import './pl-link.js';

@customElement('pl-query-link')
export class PlausibleQueryLink extends PlausibleBaseElement {
  @property({ type: Object })
  onClickFunction!: any;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  to!: PlausibleQueryData;

  @property({ type: Object })
  history!: BrowserHistory;

  constructor() {
    super();
    this.onClickFunction = this.onClick.bind(this);
  }

  onClick(e: CustomEvent) {
    e.preventDefault();
    navigateToQuery(this.history, this.query, this.to);
    //TODO Look into this
    if (this.onClickFunction) this.onClickFunction(e);
  }


  static get styles() {
    return [...super.styles];
  }

  render() {
    return html`
      <pl-link
        .history=${this.history}
        .query=${this.query}
        .to=${{
          pathname: window.location.pathname,
          search: generateQueryString(this.to),
        }}
        ><slot></slot></pl-link>
    `;
  }
}
