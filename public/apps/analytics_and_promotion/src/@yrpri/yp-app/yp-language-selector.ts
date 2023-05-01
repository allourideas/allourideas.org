import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { Dialog } from '@material/mwc-dialog';

import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

@customElement('yp-language-selector')
export class YpLanguageSelector extends YpBaseElement {
  @property({ type: Boolean })
  refreshLanguages = false;

  @property({ type: Boolean })
  noUserEvents = false;

  @property({ type: String })
  selectedLocale: string | undefined;

  @property({ type: String })
  value = '';

  @property({ type: String })
  name = '';

  @property({ type: Boolean })
  autoTranslateOptionDisabled = false;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: Boolean })
  dropdownVisible = true;

  @property({ type: Boolean })
  hasServerAutoTranslation = false;

  @property({ type: Boolean })
  isOutsideChangeEvent = false;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('selectedLocale')) {
      this._selectedLocaleChanged(changedProperties.get('selectedLocale') as string);
      this.fire('yp-selected-locale-changed', this.selectedLocale);
    }
  }

  static supportedLanguages: Record<string, string> = {
    en: 'English (US)',
    en_GB: 'English (GB)',
    fr: 'Français',
    is: 'Íslenska',
    es: 'Español',
    cs: 'čeština',
    it: 'Italiano',
    ar: 'اَلْعَرَبِيَّةُ',
    ar_EG: 'اَلْعَرَبِيَّةُ (EG)',
    ca: 'Català',
    ro_MD: 'Moldovenească',
    ro: 'Românește',
    de: 'Deutsch',
    da: 'Dansk',
    sv: 'Svenska',
    en_CA: 'English (CA)',
    nl: 'Nederlands',
    no: 'Norsk',
    uk: 'українська',
    sq: 'Shqip',
    ky: 'Кыргызча',
    uz: 'Ўзбек',
    tr: 'Türkçe',
    fa: 'فارسی',
    pl: 'Polski',
    pt: 'Português',
    pt_BR: 'Português (Brazil)',
    ru: 'Русский',
    hu: 'Magyar',
    zh_TW: '国语 (TW)',
    sk: 'Slovenčina',
    sl: 'Slovenščina',
    sr: 'Srpski',
    sr_latin: 'Srpski (latin)',
    hr: 'Hrvatski',
    kl: 'Kalaallisut',
    bg: 'български'
  };

  noGoogleTranslateLanguages = ['kl'];

  _refreshLanguage() {
    this.dropdownVisible = false;
    this.refreshLanguages = !this.refreshLanguages;
    setTimeout(() => {
      this.dropdownVisible = true;
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        mwc-select {
          max-width: 250px;
        }

        .translateButton {
          padding: 8px;
          color: var(--accent-color);
          margin-top: 8px;
        }

        .stopTranslateButton {
          padding: 8px;
          color: white;
          background: var(--accent-color);
          margin-top: 8px;
        }

        .translateText {
          margin-left: 8px;
        }

        .stopIcon {
          margin-left: 8px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical">
        ${this.dropdownVisible
          ? html`
              <mwc-select .value="${this.value}" label="Select language">
                ${this.languages.map(
                  item => html`
                    <mwc-list-item
                      @click="${this._selectLanguage}"
                      .value="${item.language}"
                      >${item.name}</mwc-list-item
                    >
                  `
                )}
              </mwc-select>
            `
          : nothing}
        <div ?hidden="${!this.canUseAutoTranslate}">
          <mwc-button
            ?hidden="${this.autoTranslate}"
            raised
            class="layout horizontal translateButton"
            @click="${this.startTranslation}"
            icon="translate"
            .label="${this.t('autoTranslate')}">
          </mwc-button>
          <mwc-button
            ?hidden="${!this.autoTranslate}"
            icon="translate"
            raised
            class="layout horizontal stopTranslateButton"
            @click="${this._stopTranslation}"
            .title="${this.t('stopAutoTranslate')}">
            <mwc-icon class="stopIcon">do_not_disturb</mwc-icon>
          </mwc-button>
        </div>
      </div>
    `;
  }

  _selectLanguage(event: CustomEvent) {
    this.selectedLocale = (event.target as HTMLInputElement).value;
  }

  /*
  behaviors: [
    IronFormElementBehavior
  ],
*/

  async connectedCallback() {
    super.connectedCallback();
    if (!this.noUserEvents) {
      const response = (await window.serverApi.hasAutoTranslation()) as YpHasAutoTranslationResponse;
      if (response && response.hasAutoTranslation === true) {
        this.hasServerAutoTranslation = true;
      } else {
        this.hasServerAutoTranslation = false;
      }
      //TODO: Check this below!
      //(Update dropdown language after it has been loaded from defaults)
      setTimeout(() => {
        this.selectedLocale = this.language;
      }, 1500);
    }

    this.addGlobalListener(
      'yp-refresh-language-selection',
      this._refreshLanguage.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'yp-refresh-language-selection',
      this._refreshLanguage.bind(this)
    );
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
  }

  _stopTranslation() {
    this.fireGlobal('yp-auto-translate', false);
    window.appGlobals.autoTranslate = false;
    this.fire('yp-language-name', YpLanguageSelector.supportedLanguages[this.language]);
    /*window.appDialogs
      .getDialogAsync(
        'masterToast',
         (toast) => {
          toast.text = this.t('autoTranslationStopped');
          toast.open = true
        }
      );*/
    window.appGlobals.activity('click', 'stopTranslation', this.language);
    sessionStorage.setItem('dontPromptForAutoTranslation', 'true');
  }

  startTranslation() {
    if (this.canUseAutoTranslate) {
      this.fireGlobal('yp-auto-translate', true);
      window.appGlobals.autoTranslate = true;
      this.fire('yp-language-name', YpLanguageSelector.supportedLanguages[this.language]);
      /*window.appDialogs.getDialogAsync("masterToast",  (toast) => {
        toast.text = this.t('autoTranslationStarted');
        toast.show();
      });*/
    }
    window.appGlobals.activity('click', 'startTranslation', this.language);
  }

  get canUseAutoTranslate() {
    if (
      !this.autoTranslateOptionDisabled &&
      this.language &&
      this.hasServerAutoTranslation &&
      !this.noUserEvents
    ) {
      const found = this.noGoogleTranslateLanguages.indexOf(this.language) > -1;
      return !found;
    } else {
      return false;
    }
  }

  get languages() {
    if (YpLanguageSelector.supportedLanguages) {
      let arr = [];
      const highlighted = [];
      let highlightedLocales = ['en', 'en_GB', 'is', 'fr', 'de', 'es', 'ar'];
      if (window.appGlobals.highlightedLanguages) {
        highlightedLocales = window.appGlobals.highlightedLanguages.split(',');
      }
      for (const key in YpLanguageSelector.supportedLanguages) {
        // eslint-disable-next-line no-prototype-builtins
        if (YpLanguageSelector.supportedLanguages.hasOwnProperty(key)) {
          if (highlightedLocales.indexOf(key) > -1) {
            highlighted.push({
              language: key,
              name: YpLanguageSelector.supportedLanguages[key],
            });
          } else {
            arr.push({ language: key, name: YpLanguageSelector.supportedLanguages[key] });
          }
        }
      }

      arr = arr.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return highlighted.concat(arr);
    } else {
      return [];
    }
  }

  _selectedLocaleChanged(oldLocale: string) {
    if (this.selectedLocale) {
      this.value = this.selectedLocale;
      if (oldLocale) {
        this.fire('changed', this.value);
      }
      if (!this.noUserEvents && oldLocale) {
        if (!this.canUseAutoTranslate && this.autoTranslate) {
          this._stopTranslation();
        }
        this.fire(
          'yp-language-name',
          YpLanguageSelector.supportedLanguages[this.selectedLocale]
        );
        window.appGlobals.changeLocaleIfNeeded(this.selectedLocale, true);
        localStorage.setItem('yp-user-locale', this.selectedLocale);
        console.info('Saving locale');
        if (window.appUser && window.appUser.user) {
          window.appUser.setLocale(this.selectedLocale);
        }
        window.appGlobals.activity(
          'click',
          'changeLanguage',
          this.selectedLocale
        );
      }
    }
    this.isOutsideChangeEvent = false;
  }
}
