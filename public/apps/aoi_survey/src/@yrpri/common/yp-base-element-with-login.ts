import { property } from 'lit/decorators.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElement } from './yp-base-element.js';

export class YpBaseElementWithLogin extends YpBaseElement {
  @property({ type: Object })
  loggedInUser: YpUserData|undefined;

  constructor() {
    super();

    if (window.appUser && window.appUser.user) {
      this.loggedInUser = window.appUser.user;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      'yp-logged-in',
      this._loggedIn.bind(this)
    );
    this.addGlobalListener('yp-got-admin-rights', this.requestUpdate.bind(this));
  }

  disconnectedCallback() {
    super.connectedCallback();
    this.removeGlobalListener(
      'yp-logged-in',
      this._loggedIn.bind(this)
    );
    this.removeGlobalListener('yp-got-admin-rights', this.requestUpdate.bind(this));
  }

  get isLoggedIn() {
    return this.loggedInUser != undefined;
  }

  _loggedIn(event: CustomEvent) {
    this.loggedInUser = event.detail;
    this.requestUpdate();
  }
}
