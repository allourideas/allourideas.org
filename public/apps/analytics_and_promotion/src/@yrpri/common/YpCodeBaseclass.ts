import { Snackbar } from '@material/mwc-snackbar';
import { LitElement } from 'lit';

import { YpApp } from '../yp-app/yp-app.js';
import { YpAppGlobals } from '../yp-app/YpAppGlobals.js';
import { YpAppUser } from '../yp-app/YpAppUser.js';
import { YpAppDialogs } from '../yp-dialog-container/yp-app-dialogs.js';
import { YpServerApi } from './YpServerApi.js';

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    appUser: YpAppUser;
    appDialogs: YpAppDialogs;
    serverApi: YpServerApi;
    app: YpApp;
    locale: string;
    MSStream: any;
    PasswordCredential?: any;
    autoTranslate: boolean;
    FederatedCredential?: any;
  }
}

export class YpCodeBase {
  language: string | undefined;

  constructor() {
    this.addGlobalListener(
      'yp-language-loaded',
      this._languageEvent.bind(this)
    );
    if (
      window.appGlobals &&
      window.appGlobals.i18nTranslation &&
      window.appGlobals.locale
    ) {
      this.language = window.appGlobals.locale;
    } else {
      this.language = 'en';
    }
  }

  _languageEvent(event: CustomEvent) {
    const detail = event.detail;
    this.language = detail.language;
    window.appGlobals.locale = detail.language;
  }

  fire(
    eventName: string,
    data: object | string | boolean | number | null = {},
    target: LitElement | Document
  ) {
    const event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      composed: true,
    });
    target.dispatchEvent(event);
  }

  fireGlobal(
    eventName: string,
    data: object | string | boolean | number | null = {}
  ) {
    this.fire(eventName, data, document);
  }

  addListener(name: string, callback: Function, target: LitElement | Document) {
    target.addEventListener(name, callback as EventListener, false);
  }

  addGlobalListener(name: string, callback: Function) {
    this.addListener(name, callback, document);
  }

  showToast(text: string, timeout = 4000) {
    window.appDialogs.getDialogAsync("masterToast", (toast: Snackbar) => {
      toast.labelText = text;
      toast.timeoutMs = timeout;
      toast.open = true;
    });
  }

  removeListener(
    name: string,
    callback: Function,
    target: LitElement | Document
  ) {
    target.removeEventListener(name, callback as EventListener);
  }

  removeGlobalListener(name: string, callback: Function) {
    this.removeListener(name, callback, document);
  }

  t(...args: Array<string>): string {
    const key = args[0];
    if (window.appGlobals.i18nTranslation) {
      let translation = window.appGlobals.i18nTranslation.t(key);
      if (!translation) translation = '';
      return translation;
    } else {
      return '';
    }
  }
}
