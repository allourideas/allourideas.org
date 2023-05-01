import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from './@yrpri/common/yp-base-element.js';
import { ShadowStyles } from './@yrpri/common/ShadowStyles.js';

import '@material/mwc-dialog';
import { Layouts } from 'lit-flexbox-literals';

import '@material/mwc-snackbar/mwc-snackbar.js';

import { YpAppGlobals } from './@yrpri/yp-app/YpAppGlobals.js';
import { YpAppUser } from './@yrpri/yp-app/YpAppUser.js';
import { YpServerApi } from './@yrpri/common/YpServerApi.js';
import { AnchorableElement } from '@material/mwc-menu/mwc-menu-surface-base';
import { Dialog } from '@material/mwc-dialog';
import { YpServerApiAdmin } from './@yrpri/common/YpServerApiAdmin.js';

import { YpAccessHelpers } from './@yrpri/common/YpAccessHelpers.js';
import { classMap } from 'lit/directives/class-map.js';

import '@material/web/navigationbar/navigation-bar.js';
import '@material/web/navigationtab/navigation-tab.js';
import '@material/web/iconbutton/filled-link-icon-button.js';
import '@material/web/navigationdrawer/navigation-drawer.js';
import '@material/web/list/list-item.js';
import '@material/web/list/list-item-icon.js';
import '@material/web/list/list.js';
import '@material/web/list/list-divider.js';
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
} from '@material/material-color-utilities';

import '@material/web/menu/menu.js';
import './yp-analytics/yp-promotion-dashboard.js';
import { cache } from 'lit/directives/cache.js';

import './yp-promotion/yp-campaign-manager.js';
import { YpCollectionHelpers } from './@yrpri/common/YpCollectionHelpers.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import './yp-promotion-settings.js';
import { Snackbar } from '@material/mwc-snackbar';

import './@yrpri/common/yp-image.js';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    appUser: YpAppUser;
    serverApi: YpServerApi;
    adminServerApi: YpServerApiAdmin;
    PasswordCredential?: any;
    FederatedCredential?: any;
  }
}

const PagesTypes = {
  Analytics: 1,
  Campaign: 2,
  EmailLists: 3,
  AiAnalysis: 4,
  Settings: 5,
};

@customElement('yp-promotion-app')
export class YpPromotionApp extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType: string;

  @property({ type: Number })
  collectionId: number | string;

  @property({ type: String })
  collectionAction: string = 'config';

  @property({ type: String })
  page: string | undefined;

  @property({ type: Number })
  pageIndex = 1;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: Boolean })
  adminConfirmed = true;

  @property({ type: Boolean })
  haveCheckedAdminRights = true;

  @property({ type: Boolean })
  haveCheckedPromoterRights = false;

  @property({ type: String })
  lastSnackbarText: string | undefined;

  @property({ type: Number })
  useProjectId: string | undefined;

  originalCollectionType: string | undefined;

  collectionURL: string | undefined;


  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .headerContainer {
          width: 100%;
          margin-bottom: 8px;
          vertical-align: middle;
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          margin-left: 16px;
          width: 100%;
        }

        .loadingText {
          margin-top: 48px;
        }

        .collectionName {
          color: var(--md-sys-color-on-surface);
        }

        md-list-item {
          --md-list-list-item-container-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          --md-list-list-item-label-text-color: var(--md-sys-color-on-surface);
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-secondary-container
          );
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .collectionLogoImage {
          width: 120px;
          height: 68px;
          margin-right: 16px;
          margin-left: 16px;
        }

        .mainPageContainer {
          margin-top: 16px;
          max-width: 1100px;
          width: 1100px;
        }

        yp-promotion-dashboard {
          max-width: 1100px;
        }

        @media (max-width: 1100px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
          }

          yp-promotion-dashboard {
            max-width: 100%;
          }
        }
      `,
    ];
  }

  constructor() {
    super();

    window.serverApi = new YpServerApi();
    window.adminServerApi = new YpServerApiAdmin();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    //window.appUser = new YpAppUser(window.serverApi);

    if (window.location.href.indexOf('localhost:9010') > -1) {
      window.appGlobals.setupTranslationSystem();
    } else {
      window.appGlobals.setupTranslationSystem('/apps/analytics_and_promotion/dist');
    }

    let pathname = window.location.pathname;
    if (pathname.endsWith('/'))
      pathname = pathname.substring(0, pathname.length - 1);
    const split = pathname.split('/');
    this.collectionType = "question"//split[split.length - 2];

    this.originalCollectionType = this.collectionType;

    this.collectionId = split[split.length - 1];

  }

  _languageLoaded() {
      //@ts-ignore
      this.collection = {
        created_at: "2023-01-12T00:00:00.000Z",
      }
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();

    const savedColor = localStorage.getItem('md3-yrpri-promotion-color');
    if (savedColor) {
      this.fireGlobal('yp-theme-color', savedColor);
    }

    setTimeout(() => {
      //this.fireGlobal('yp-theme-color', '#FFFFFF');
    }, 5000);

    setTimeout(() => {
      //this.fireGlobal('yp-theme-dark-mode', true);
      //this.setRandomColor();
    }, 1000);
  }

  setRandomColor() {
    let maxVal = 0xffffff; // 16777215
    let randomNumber: number | string = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    //@ts-ignore
    let randColor = randomNumber.padStart(6, 0);
    const randomColor = `#${randColor.toUpperCase()}`;
    console.warn('Random color', randomColor);
    this.fireGlobal('yp-theme-color', randomColor);
    setTimeout(() => {
      this.setRandomColor();
    }, 10000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  themeChanged(target: HTMLElement | undefined = undefined) {
    const theme = themeFromSourceColor(argbFromHex(this.themeColor), [
      {
        name: 'custom-1',
        value: argbFromHex('#ff00FF'),
        blend: true,
      },
    ]);

    // Print out the theme as JSON
    //console.log(JSON.stringify(theme, null, 2));

    // Check if the user has dark mode turned on
    const systemDark =
      this.themeDarkMode === undefined
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : this.themeDarkMode;

    // Apply the theme to the body by updating custom properties for material tokens
    //TODO: Get dark mode working again
    applyTheme(theme, { target: target || this, dark: false });
  }

  async _getCollection() {
    const collection = (await window.serverApi.getCollection(
      this.collectionType,
      this.collectionId as number
    )) as YpCollectionData | YpGroupResults;
    if (this.collectionType == 'group') {
      this.collection = (collection as YpGroupResults).group;
    } else if (this.collectionType == 'community') {
      if ((collection as YpCommunityData).configuration.useProjectIdForAnalytics &&
        (collection as YpCommunityData).configuration.projectId) {
        this.useProjectId = (collection as YpCommunityData).configuration.projectId;
      } else {
        this.useProjectId = undefined;
      }
      this.collection = collection as YpCollectionData;
    } else {
      this.collection = collection as YpCollectionData;
    }
    await this.updateComplete;
    this._setAdminConfirmed();
  }

  renderTopBar() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal topAppBar">
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <img
                  class="collectionLogoImage"
                  src="${ifDefined(
                    YpCollectionHelpers.logoImagePath(
                      this.collectionType,
                      this.collection!
                    )
                  )}"
                />
              </div>
              <div></div>
              ${this.collection ? this.collection.name : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  snackbarclosed() {
    this.lastSnackbarText = undefined;
  }

  render() {
    return html`
      <mwc-dialog id="errorDialog" .heading="${this.t('error')}">
        <div>${this.currentError}</div>
        <mwc-button dialogAction="cancel" slot="secondaryAction">
          ${this.t('ok')}
        </mwc-button>
      </mwc-dialog>
      ${(this.collection)
        ? html`
            <div class="layout horizontal">
              ${this.renderNavigationBar()}
              <div class="rightPanel">
                <main>
                  <div class="mainPageContainer">${this._renderPage()}</div>
                </main>
              </div>
            </div>
          `
        : html`
            <div class="layout horizontal center-center loadingText">
              <div>${this.t('Loading...')}</div>
            </div>
          `}
      ${this.lastSnackbarText
        ? html`
            <mwc-snackbar
              id="snackbar"
              @MDCSnackbar:closed="${this.snackbarclosed}"
              .labelText="${this.lastSnackbarText}"
            ></mwc-snackbar>
          `
        : nothing}
    `;
  }

  renderNavigationBar() {
    if (this.wide) {
      return html`
        <md-navigation-drawer opened>
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <yp-image
                  class="collectionLogoImage"
                  sizing="contain"
                  .src="${YpCollectionHelpers.logoImagePath(
                    this.collectionType,
                    this.collection!
                  )}"
                ></yp-image>
              </div>
              <div class="collectionName">
                ${this.collection ? this.collection.name : ''}
              </div>
            </div>
          </div>

          <md-list>
            <md-list-item
              class="${this.pageIndex == 1 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 1)}"
              headline="${this.t('Analytics')}"
              supportingText="${this.t('Historical and realtime')}"
            >
              <md-list-item-icon slot="start">
                <md-icon>insights</md-icon>
              </md-list-item-icon></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 2 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 2)}"
              headline="${this.t('Promotion')}"
              supportingText="${this.collectionType == 'post'
                ? this.t('Promote your idea')
                : this.t('Promote your project')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>ads_click</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 3 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 3)}"
              ?hidden="${true || this.collectionType == 'post'}"
              headline="${this.t('Email Lists')}"
              supportingText="${this.t('Send promotional emails')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon
                  ><span class="material-symbols-outlined"
                    >schedule_send</span
                  ></md-icon
                ></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 4 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 4)}"
              ?hidden="${true || this.collectionType == 'post'}"
              headline="${this.t('AI Analysis')}"
              supportingText="${this.t('Text analysis with AI')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>document_scanner</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-divider></md-list-divider>
            <md-list-item
              class="${this.pageIndex == 5 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 5)}"
              headline="${this.t('Setting')}"
              supportingText="${this.t('Theme, language, etc.')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>settings</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              headline="${this.t('Exit')}"
              supportingText="${this.collectionType == 'post'
                ? this.t('Exit back to idea')
                : this.t('Exit back to project')}"
              @click="${this.exitToMainApp}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>arrow_back</md-icon></md-list-item-icon
              ></md-list-item
            >
            <div class="layout horizontal center-center">
              <div>
                <img
                  class="ypLogo"
                  height="65"
                  alt="All Our Ideas Logo"
                  src="https://raw.githubusercontent.com/allourideas/allourideas.org/master/public/images/favicon.png"
                />
              </div>
            </div>
          </md-list>
        </md-navigation-drawer>
      `;
    } else {
      return html`
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t('Analytics')}"
              ><md-icon slot="activeIcon">insights</md-icon>
              <md-icon slot="inactiveIcon">insights</md-icon></md-navigation-tab
            >
            <md-navigation-tab .label="${this.t('Promotion')}">
              <md-icon slot="activeIcon">ads_click</md-icon>
              <md-icon slot="inactiveIcon">ads_click</md-icon>
            </md-navigation-tab>
            <md-navigation-tab .label="${this.t('Settings')}">
              <md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon">settings</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
    }
  }

  tabChanged(event: CustomEvent) {
    if (event.detail.activeIndex == 0) {
      this.pageIndex = 1;
    } else if (event.detail.activeIndex == 1) {
      this.pageIndex = 2;
    } else if (event.detail.activeIndex == 2) {
      this.pageIndex = 5;
    }
  }

  exitToMainApp() {
    window.location.href = `/${this.collectionId}/results`;
  }

  async _displaySnackbar(event: CustomEvent) {
    this.lastSnackbarText = event.detail;
    await this.updateComplete;
    (this.$$('#snackbar') as Snackbar).show();
  }

  _setupEventListeners() {
    this.addListener('app-error', this._appError);
    this.addListener('exit-to-app', this.exitToMainApp);
    this.addListener('display-snackbar', this._displaySnackbar);
    this.addGlobalListener('language-loaded', this._languageLoaded.bind(this));
    this.addGlobalListener('yp-network-error', this._appError.bind(this));
    this.addGlobalListener(
      'yp-got-admin-rights',
      this._gotAdminRights.bind(this)
    );
    this.addGlobalListener(
      'yp-got-promoter-rights',
      this._gotPromoterRights.bind(this)
    );
  }

  _removeEventListeners() {
    this.removeGlobalListener('yp-network-error', this._appError.bind(this));
    this.removeListener('exit-to-app', this.exitToMainApp);
    this.removeListener('display-snackbar', this._displaySnackbar);
    this.removeGlobalListener(
      'yp-got-admin-rights',
      this._gotAdminRights.bind(this)
    );
    this.removeGlobalListener(
      'yp-got-promoter-rights',
      this._gotPromoterRights.bind(this)
    );
  }

  _gotAdminRights(event: CustomEvent) {
    this.haveCheckedAdminRights = true;
  }

  _gotPromoterRights(event: CustomEvent) {
    this.haveCheckedPromoterRights = true;
  }

  _setAdminConfirmed() {
    if (this.collection) {
      switch (this.collectionType) {
        case 'domain':
          this.adminConfirmed = YpAccessHelpers.checkDomainAccess(
            this.collection as YpDomainData
          );
          break;
        case 'community':
          this.adminConfirmed = YpAccessHelpers.checkCommunityAccess(
            this.collection as YpCommunityData
          );
          break;
        case 'group':
          this.adminConfirmed = YpAccessHelpers.checkGroupAccess(
            this.collection as YpGroupData
          );
          break;
        case 'post':
          this.adminConfirmed = YpAccessHelpers.checkPostAccess(
            this.collection as unknown as YpPostData
          );
          break;
      }
    }

    if (!this.adminConfirmed) {
      switch (this.collectionType) {
        case 'community':
          this.adminConfirmed = YpAccessHelpers.checkCommunityPromoterAccess(
            this.collection as YpCommunityData
          );
          break;
        case 'group':
          this.adminConfirmed = YpAccessHelpers.checkGroupPromoterAccess(
            this.collection as YpGroupData
          );
          break;
      }
    }

    if (!this.adminConfirmed) {
      this.fire('yp-network-error', { message: this.t('unauthorized') });
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('themeColor') ||
      changedProperties.has('themeDarkMode')
    ) {
      this.themeChanged(document.body);
    }

    if (
      (changedProperties.has('loggedInUser') ||
        changedProperties.has('haveCheckedAdminRights') ||
        changedProperties.has('haveCheckedPromoterRights')) &&
      this.loggedInUser &&
      this.haveCheckedAdminRights === true &&
      this.haveCheckedPromoterRights == true
    ) {
      //this._getCollection();
    }
  }

  _appError(event: CustomEvent) {
    let error = event.detail.message;
    if (event.detail && event.detail.response) {
      error = event.detail.response.statusText;
    }
    console.error(error);
    this.currentError = error;
    (this.$$('#errorDialog') as Dialog).open = true;
  }

  _renderPage() {
    if (this.adminConfirmed) {
      switch (this.pageIndex) {
        case PagesTypes.Analytics:
          switch (this.collectionType) {
            case 'domain':
            case 'community':
            case 'group':
            case 'post':
            case 'question':
              return html`
                ${cache(
                  this.collection
                    ? html`<yp-promotion-dashboard
                        .collectionType="${this.collectionType}"
                        .collection="${this.collection}"
                        .collectionId="${this.collectionId}"
                        .useProjectId="${this.useProjectId}"
                      >
                      </yp-promotion-dashboard>`
                    : nothing
                )}
              `;
          }
        case PagesTypes.Campaign:
          return html`
            ${cache(
              this.collection
                ? html`<yp-campaign-manager
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-campaign-manager>`
                : nothing
            )}
          `;
        case PagesTypes.AiAnalysis:
          return html`
            ${cache(
              this.collection
                ? html`<yp-ai-text-analysis
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-ai-text-analysis>`
                : nothing
            )}
          `;
        case PagesTypes.EmailLists:
          return html`
            ${cache(
              this.collection
                ? html`<yp-email-lists
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-email-lists>`
                : nothing
            )}
          `;
        case PagesTypes.Settings:
          return html`
            ${cache(
              this.collection
                ? html`<yp-promotion-settings
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                    @color-changed="${this._settingsColorChanged}"
                  >
                  </yp-promotion-settings>`
                : nothing
            )}
          `;
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return nothing;
    }
  }

  _settingsColorChanged(event: CustomEvent) {
    this.fireGlobal('yp-theme-color', event.detail.value);
  }
}
