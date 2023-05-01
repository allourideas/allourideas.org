/*
import '../ac-notifications/ac-notification-list.js';
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import '../yp-app-globals/yp-sw-update-toast.js';
*/

import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { cache } from 'lit/directives/cache.js';

//TODO: Fix moment
//import moment from 'moment';

import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-dialog';

import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-snackbar';

import { Drawer } from '@material/mwc-drawer';
import '@material/mwc-drawer';

import '@material/mwc-button';

import '@material/mwc-icon-button';

import { Menu } from '@material/mwc-menu';
import '@material/mwc-menu';

import '@material/mwc-top-app-bar';

import '@material/mwc-list/mwc-list-item';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpAppStyles } from './YpAppStyles.js';
import { YpAppGlobals } from './YpAppGlobals.js';
import { YpAppUser } from './YpAppUser.js';
import { YpServerApi } from '../common/YpServerApi.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpAppDialogs } from '../yp-dialog-container/yp-app-dialogs.js';

import '../yp-dialog-container/yp-app-dialogs.js';

import '../yp-collection/yp-domain.js';
import '../yp-collection/yp-community.js';
import '../yp-collection/yp-group.js';

import './yp-app-nav-drawer.js';

import { YpDomain } from '../yp-collection/yp-domain.js';
import { YpCommunity } from '../yp-collection/yp-community.js';
import { YpGroup } from '../yp-collection/yp-group.js';
import '../yp-post/yp-post.js';
import { YpCollection } from '../yp-collection/yp-collection.js';
import { YpPageDialog } from '../yp-page/yp-page-dialog.js';
import { YpAppNavDrawer } from './yp-app-nav-drawer.js';
import structuredClone from '@ungap/structured-clone';

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    appUser: YpAppUser;
    appDialogs: YpAppDialogs;
    serverApi: YpServerApi;
    app: YpApp;
    locale: string;
    autoTranslate: boolean;
    MSStream: any;
    PasswordCredential?: any;
    FederatedCredential?: any;
  }
}

@customElement('yp-app')
export class YpApp extends YpBaseElement {
  @property({ type: Object })
  homeLink: YpHomeLinkData | undefined;

  @property({ type: String })
  page: string | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: String })
  backPath: string | undefined;

  @property({ type: Boolean })
  showSearch = false;

  @property({ type: Boolean })
  showBack = false;

  @property({ type: String })
  forwardToPostId: string | undefined;

  @property({ type: String })
  headerTitle: string | undefined;

  @property({ type: String })
  numberOfUnViewedNotifications: string | undefined;

  @property({ type: Boolean })
  hideHelpIcon = false;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: String })
  languageName: string | undefined;

  @property({ type: Number })
  goForwardToPostId: number | undefined;

  @property({ type: Boolean })
  showBackToPost = false;

  @property({ type: String })
  goForwardPostName: string | undefined;

  @property({ type: Array })
  pages: Array<YpHelpPageData> = [];

  @property({ type: String })
  headerDescription: string | undefined;

  @property({ type: String })
  notifyDialogHeading: string | undefined;

  @property({ type: String })
  notifyDialogText: string | undefined;

  @property({ type: String })
  route = '';

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Object })
  routeData: Record<string, string> = {};

  anchor: HTMLElement | null = null;

  previousSearches: Array<string> = [];

  storedBackPath: string | undefined;

  storedLastDocumentTitle: string | undefined;

  keepOpenForPost: string | undefined;

  useHardBack = false;

  _scrollPositionMap = {};

  goBackToPostId: number | undefined;

  currentPostId: number | undefined;

  goForwardCount = 0;

  firstLoad = true;

  communityBackOverride: Record<string, Record<string, string>> | undefined;

  touchXDown: number | undefined;
  touchYDown: number | undefined;
  touchXUp: number | undefined;
  touchYUp: number | undefined;

  userDrawerOpenedDelayed = false;
  navDrawOpenedDelayed = false;
  userDrawerOpened = false;

  constructor() {
    super();
    window.app = this;
    window.serverApi = new YpServerApi();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    window.appGlobals.setupTranslationSystem();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
    this._setupSamlCallback();
    this.updateLocation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  _navDrawOpened(event: CustomEvent) {
    setTimeout(() => {
      this.navDrawOpenedDelayed = event.detail;
    }, 500);
  }

  _netWorkError(event: CustomEvent) {
    const detail = event.detail;
    let errorText = this.t('errorCantConnect')
      ? this.t('errorCantConnect')
      : "Can't connect to server, try again later";
    let statusCode = -1;
    if (detail.response && detail.response.status === 404)
      errorText = this.t('errorNotAuthorized');
    else if (detail.response && detail.response.status === 401)
      errorText = this.t('errorNotAuthorized');
    else if (
      detail.response &&
      detail.response.status === 500 &&
      detail.response.message == 'SequelizeUniqueConstraintError'
    )
      errorText = this.t('user.alreadyRegisterred');

    if (detail.response && detail.response.status)
      statusCode = detail.response.status;

    this.notifyDialogText = errorText;
    (this.$$('#dialog') as Dialog).open = true;

    console.error(`Can't connect to server. ${statusCode} ${detail.jsonError}`);
  }

  _setupEventListeners() {
    this.addGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
    this.addGlobalListener('yp-change-header', this._onChangeHeader.bind(this));
    this.addGlobalListener('yp-logged-in', this._onUserChanged.bind(this));
    this.addGlobalListener('yp-network-error', this._netWorkError.bind(this));

    this.addListener(
      'yp-add-back-community-override',
      this._addBackCommunityOverride,
      this
    );
    this.addListener(
      'yp-reset-keep-open-for-page',
      this._resetKeepOpenForPage,
      this
    );
    this.addListener('yp-open-login', this._login, this);
    this.addListener('yp-open-page', this._openPageFromEvent, this);
    this.addGlobalListener('yp-open-toast', this._openToast.bind(this));
    this.addListener('yp-open-notify-dialog', this._openNotifyDialog, this);
    this.addListener('yp-dialog-closed', this._dialogClosed, this);
    this.addListener('yp-language-name', this._setLanguageName, this);
    this.addListener('yp-refresh-domain', this._refreshDomain, this);
    this.addListener('yp-refresh-community', this._refreshCommunity, this);
    this.addListener('yp-refresh-group', this._refreshGroup, this);
    this.addListener('yp-close-right-drawer', this._closeRightDrawer, this);
    this.addListener(
      'yp-set-number-of-un-viewed-notifications',
      this._setNumberOfUnViewedNotifications,
      this
    );
    this.addListener('yp-redirect-to', this._redirectTo, this);
    this.addListener('yp-set-home-link', this._setHomeLink, this);
    this.addListener('yp-set-next-post', this._setNextPost, this);
    this.addListener('yp-set-pages', this._setPages, this);

    this.addListener('yp-clipboard-copy-notification', this._haveCopiedNotification, this);

    window.addEventListener('locationchange', this.updateLocation.bind(this));
    window.addEventListener('location-changed', this.updateLocation.bind(this));
    window.addEventListener('popstate', this.updateLocation.bind(this));
    this.addListener('yp-app-dialogs-ready', this._appDialogsReady.bind(this));
    this._setupTouchEvents();
  }

  _removeEventListeners() {
    this.removeGlobalListener('yp-auto-translate', this._autoTranslateEvent);
    this.removeGlobalListener('yp-change-header', this._onChangeHeader);
    this.removeGlobalListener('yp-logged-in', this._onUserChanged);
    this.removeGlobalListener('yp-network-error', this._netWorkError);

    this.removeListener(
      'yp-add-back-community-override',
      this._addBackCommunityOverride,
      this
    );
    this.removeListener(
      'yp-reset-keep-open-for-page',
      this._resetKeepOpenForPage,
      this
    );
    this.removeListener('yp-open-login', this._login, this);
    this.removeListener('yp-open-page', this._openPageFromEvent, this);
    this.removeGlobalListener('yp-open-toast', this._openToast.bind(this));
    this.removeListener('yp-open-notify-dialog', this._openNotifyDialog, this);
    this.removeListener('yp-dialog-closed', this._dialogClosed, this);
    this.removeListener('yp-language-name', this._setLanguageName, this);
    this.removeListener('yp-refresh-domain', this._refreshDomain, this);
    this.removeListener('yp-refresh-community', this._refreshCommunity, this);
    this.removeListener('yp-refresh-group', this._refreshGroup, this);
    this.removeListener('yp-close-right-drawer', this._closeRightDrawer, this);
    this.removeListener(
      'yp-set-number-of-un-viewed-notifications',
      this._setNumberOfUnViewedNotifications,
      this
    );
    this.removeListener('yp-redirect-to', this._redirectTo, this);
    this.removeListener('yp-set-home-link', this._setHomeLink, this);
    this.removeListener('yp-set-next-post', this._setNextPost, this);
    this.removeListener('yp-set-pages', this._setPages, this);
    this.removeListener('yp-clipboard-copy-notification', this._haveCopiedNotification, this);

    window.removeEventListener('locationchange', this.updateLocation);
    window.removeEventListener('location-changed', this.updateLocation);
    window.removeEventListener('popstate', this.updateLocation);
    this.removeListener(
      'yp-app-dialogs-ready',
      this._appDialogsReady.bind(this)
    );
    this._removeTouchEvents();
  }

  static get styles() {
    return [super.styles, YpAppStyles];
  }

  _haveCopiedNotification() {
    this.notifyDialogText = this.t('copiedToClipboard');
    (this.$$('#dialog') as Dialog).open = true;
  }

  _appDialogsReady(event: CustomEvent) {
    if (event.detail) {
      window.appDialogs = event.detail;
    }
  }

  updateLocation() {
    const path = window.location.pathname;

    const pattern = '/:page';

    const remainingPieces = path.split('/');
    const patternPieces = pattern.split('/');

    const matched = [];
    const namedMatches: Record<string, string> = {};

    const oldRouteData = structuredClone(this.routeData);


    for (let i = 0; i < patternPieces.length; i++) {
      const patternPiece = patternPieces[i];
      if (!patternPiece && patternPiece !== '') {
        break;
      }
      const pathPiece = remainingPieces.shift();

      // We don't match this path.
      if (!pathPiece && pathPiece !== '') {
        return;
      }
      matched.push(pathPiece);

      if (patternPiece.charAt(0) == ':') {
        namedMatches[patternPiece.slice(1)] = pathPiece;
      } else if (patternPiece !== pathPiece) {
        return;
      }
    }

    let tailPath = remainingPieces.join('/');
    if (remainingPieces.length > 0) {
      tailPath = '/' + tailPath;
    }

    this.subRoute = tailPath;
    this.route = path;

    this.routeData = namedMatches;
    this._routeChanged();
    this._routePageChanged(oldRouteData);
  }

  //TODO: Use https://boguz.github.io/burgton-button-docs/
  renderNavigationIcon() {
    let icons;

    if (this.closePostHeader)
      icons = html`<mwc-icon-button
        title="${this.t('close')}"
        icon="close"
        @click="${this._closePost}"
      ></mwc-icon-button>`;
    else
      icons = html` <mwc-icon-button
        icon="arrow_upward"
        title="${this.t('goBack')}"
        slot="actionItems"
        ?hidden="${!this.backPath}"
        @click="${this.goBack}"
      >
      </mwc-icon-button>`;

    return html`${icons}
    ${this.goForwardToPostId
      ? html`
          <mwc-icon-button
            icon="fast_forward"
            title="${this.t('forwardToPost')}"
            @click="${this._goToNextPost}"
          ></mwc-icon-button>
        `
      : nothing}`;
  }

  _openHelpMenu() {
    (this.$$('#helpMenu') as Menu).open = true;
  }

  renderActionItems() {
    return html`
      <mwc-icon-button
        id="translationButton"
        slot="actionItems"
        ?hidden="${!this.autoTranslate}"
        @click="${window.appGlobals.stopTranslation}"
        icon="translate"
        .label="${this.t('stopAutoTranslate')}"
      >
      </mwc-icon-button>

      <mwc-icon-button
          id="helpIconButton"
          icon="menu"
          slot="actionItems"
          @click="${this._toggleNavDrawer}"
          title="${this.t('menu.help')}"
        ></mwc-icon-button>

      <div
        style="position: relative;"
        ?hidden="${this.hideHelpIcon}"
        slot="actionItems"
      >
        <mwc-icon-button
          id="helpIconButton"
          icon="help_outline"
          @click="${this._openHelpMenu}"
          title="${this.t('menu.help')}"
        >
        </mwc-icon-button>
        <mwc-menu
          id="helpMenu"
          .anchor="${this.$$('#helpIconButton')}"
          menuCorner="START"
          corner="TOP_END"
        >
          ${this.translatedPages(this.pages).map(
            (page: YpHelpPageData, index) => html`
              <mwc-list-item
                data-args="${index}"
                @click="${this._openPageFromMenu}"
              >
                ${this._getLocalizePageTitle(page)}
              </mwc-list-item>
            `
          )}
        </mwc-menu>
      </div>

      ${this.user
        ? html`
            <div
              class="userImageNotificationContainer layout horizontal"
              @click="${this._toggleUserDrawer}"
              slot="actionItems"
            >
              <yp-user-image id="userImage" small .user="${this.user}">
              </yp-user-image>
              <paper-badge
                id="notificationBadge"
                class="activeBadge"
                .label="${this.numberOfUnViewedNotifications}"
                ?hidden="${!this.numberOfUnViewedNotifications}"
              >
              </paper-badge>
            </div>
          `
        : html`
            <mwc-icon-button
              icon="login"
              slot="actionItems"
              @click="${this._login}"
              title="${this.t('user.login')}"
            >
            </mwc-icon-button>
          `}
    `;
  }

  renderAppBar() {
    return html`
      <mwc-top-app-bar dense role="navigation" aria-label="top navigation">
        <div slot="navigationIcon">${this.renderNavigationIcon()}</div>
        <div slot="title">
          ${this.goForwardToPostId ? this.goForwardPostName : this.headerTitle}
        </div>
        ${this.renderActionItems()}
        <div>${this.renderPage()}</div>
      </mwc-top-app-bar>
    `;
  }

  renderPage() {
    let pageHtml;
    if (this.page) {
      switch (this.page) {
        case 'domain':
          pageHtml = cache(html`
            <yp-domain id="domainPage" .subRoute="${this.subRoute}"></yp-domain>
          `);
          break;
        case 'community':
          pageHtml = cache(html`
            <yp-community id="communityPage" .subRoute="${this.subRoute}">
            </yp-community>
          `);
          break;
        case 'community_folder':
          pageHtml = cache(html`
            <yp-community-folder
              id="communityFolderPage"
              .subRoute="${this.subRoute}"
            >
            </yp-community-folder>
          `);
          break;
        case 'group':
          pageHtml = cache(html`
            <yp-group id="groupPage" .subRoute="${this.subRoute}"></yp-group>
          `);
          break;
        case 'group_data_viz':
          pageHtml = cache(html`
            <yp-group-data-viz
              id="dataVizGroupPage"
              name="group_data_viz"
              .subRoute="${this.subRoute}"
            ></yp-group-data-viz>
          `);
          break;
        case 'post':
          pageHtml = cache(html`
            <yp-post
              id="postPage"
              .currentPage="${this.page}"
              .subRoute="${this.subRoute}"
            ></yp-post>
          `);
          break;
        default:
          pageHtml = cache(html` <yp-view-404 name="view-404"></yp-view-404> `);
          break;
      }
    } else {
      pageHtml = nothing;
    }

    return pageHtml;
  }

  render() {
    return html`
      <mwc-drawer type="modal">
        <div>
          <yp-app-nav-drawer
            id="ypNavDrawer"
            .homeLink="${this.homeLink}"
            .opened="${this.navDrawOpenedDelayed}"
            @yp-toggle-nav-drawer="${this._toggleNavDrawer}"
            .user="${this.user}"
            .route="${this.route}"
          ></yp-app-nav-drawer>
        </div>
        <div slot="appContent">${this.renderAppBar()}</div>
      </mwc-drawer>

      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>

      <yp-sw-update-toast
        .buttonLabel="${this.t('reload')}"
        .message="${this.t('newVersionAvailable')}"
      >
      </yp-sw-update-toast>

      <mwc-dialog id="dialog">
        <div>${this.notifyDialogText}</div>
        <mwc-button
          slot="primaryAction"
          @click="${this._resetNotifyDialogText}"
        >
          ${this.t('ok')}
        </mwc-button>
      </mwc-dialog>

      <mwc-snackbar id="toast">
        <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
      </mwc-snackbar>
    `;
  }

  _openNotifyDialog(event: CustomEvent) {
    this.notifyDialogText = event.detail;
    (this.$$('#dialog') as Dialog).open = true;
  }

  _openToast(event: CustomEvent) {
    (this.$$('#toast') as Snackbar).labelText = event.detail.text;
    (this.$$('#toast') as Snackbar).open = true;
  }

  _resetNotifyDialogText() {
    this.notifyDialogText = undefined;
  }

  // Translated Pages
  translatedPages(pages: Array<YpHelpPageData>): Array<YpHelpPageData> {
    if (pages) {
      return JSON.parse(JSON.stringify(pages)) as Array<YpHelpPageData>;
    } else {
      return [] as Array<YpHelpPageData>;
    }
  }

  openPageFromId(pageId: number) {
    if (this.pages) {
      this.pages.forEach(page => {
        if (page.id == pageId) {
          this._openPage(page);
        }
      });
    } else {
      console.warn('Trying to open a page when not loaded');
    }
  }

  _openPageFromMenu(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.getAttribute('data-args');
    if (value) {
      const index = JSON.parse(value);
      const page = this.pages[index];
      this._openPage(page);
      //TODO: Make sure to reset menu here
      //this.$$("paper-listbox")?.select(null);
    }
  }

  _openPage(page: YpHelpPageData) {
    window.appGlobals.activity('open', 'pages', page.id);
    window.appDialogs.getDialogAsync('pageDialog', (dialog: YpPageDialog) => {
      const pageLocale = this._getPageLocale(page);
      dialog.open(page, pageLocale);
    });
  }

  _getPageLocale(page: YpHelpPageData) {
    let pageLocale = 'en';
    if (page.title[window.locale]) {
      pageLocale = window.locale;
    } else if (page.title['en']) {
      pageLocale = 'en';
    } else {
      const key = Object.keys(page.title)[0];
      if (key) {
        pageLocale = key;
      }
    }

    return pageLocale;
  }

  _getLocalizePageTitle(page: YpHelpPageData) {
    const pageLocale = this._getPageLocale(page);
    return page.title[pageLocale];
  }

  _setPages(event: CustomEvent) {
    this.pages = event.detail;
  }

  _addBackCommunityOverride(event: CustomEvent) {
    const detail = event.detail;

    if (!this.communityBackOverride) {
      this.communityBackOverride = {};
    }

    this.communityBackOverride[detail.fromCommunityId] = {
      backPath: detail.backPath,
      backName: detail.backName,
    };
  }

  _goToNextPost() {
    if (this.currentPostId) {
      this.goBackToPostId = this.currentPostId;
    } else {
      console.error('No currentPostId on next');
    }

    if (this.goForwardToPostId) {
      YpNavHelpers.goToPost(
        this.goForwardToPostId,
        undefined,
        undefined,
        undefined,
        true
      );
      window.appGlobals.activity(
        'recommendations',
        'goForward',
        this.goForwardToPostId
      );
      this.goForwardCount += 1;
      this.showBackToPost = true;
    } else {
      console.error('No goForwardToPostId');
    }
  }

  _goToPreviousPost() {
    if (this.goForwardCount > 0) {
      window.history.back();
      window.appGlobals.activity('recommendations', 'goBack');
    } else {
      this.showBackToPost = false;
    }
    this.goForwardCount -= 1;
  }

  _setNextPost(event: CustomEvent) {
    const detail = event.detail;
    if (detail.goForwardToPostId) {
      this.goForwardToPostId = detail.goForwardToPostId;
      this.goForwardPostName = detail.goForwardPostName;
    } else {
      this._clearNextPost();
    }
    this.currentPostId = detail.currentPostId;
  }

  _clearNextPost() {
    this.goForwardToPostId = undefined;
    this.goForwardPostName = undefined;
    this.goForwardCount = 0;
    this.showBackToPost = false;
  }

  _setupSamlCallback() {
    window.addEventListener(
      'message',
      e => {
        if (e.data == 'samlLogin' && window.appUser) {
          window.appUser.loginFromSaml();
        }
      },
      false
    );
  }

  _openPageFromEvent(event: CustomEvent) {
    if (event.detail.pageId) {
      this.openPageFromId(event.detail.pageId);
    }
  }

  openUserInfoPage(pageId: number) {
    if (this.pages && this.pages.length > 0) {
      this._openPage(this.pages[pageId]);
    } else {
      setTimeout(() => {
        if (this.pages && this.pages.length > 0) {
          this._openPage(this.pages[pageId]);
        } else {
          setTimeout(() => {
            if (this.pages && this.pages.length > 0) {
              this._openPage(this.pages[pageId]);
            } else {
              setTimeout(() => {
                if (this.pages && this.pages.length > 0) {
                  this._openPage(this.pages[pageId]);
                }
              }, 1250);
            }
          }, 1250);
        }
      }, 1250);
    }
  }

  _setLanguageName(event: CustomEvent) {
    this.languageName = event.detail;
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
  }

  _refreshGroup() {
    this._refreshByName('#groupPage');
  }

  _refreshCommunity() {
    this._refreshByName('#communityPage');
  }

  _refreshDomain() {
    this._refreshByName('#domainPage');
  }

  _refreshByName(id: string) {
    const el = this.$$(id);
    // TODO: Get refresh to work
    if (el) {
      //el._refreshAjax();
    }
  }

  _closeRightDrawer() {
    setTimeout(() => {
      // TODO: Fix
      // this.$$("#drawer")?.close();
    }, 100);
  }

  _setNumberOfUnViewedNotifications(event: CustomEvent) {
    if (event.detail.count) {
      if (event.detail.count < 10) {
        this.numberOfUnViewedNotifications = event.detail.count;
      } else {
        this.numberOfUnViewedNotifications = '9+';
      }
    } else {
      this.numberOfUnViewedNotifications = '';
    }
  }

  _redirectTo(event: CustomEvent) {
    if (event.detail.path) {
      YpNavHelpers.redirectTo(event.detail.path);
    }
  }

  async _routeChanged() {
    const route = this.route;
    // Support older pre version 6.1 links
    if (window.location.href.indexOf('/#!/') > -1) {
      window.location.href = window.location.href.replace('/#!/', '/');
    }

    /*setTimeout(() => {
      if (route.indexOf('domain') > -1) {
        (this.$$('#domainPage') as YpCollection).refresh();
      } else if (route.indexOf('community_folder') > -1) {
        (this.$$('#communityFolderPage') as YpCollection).refresh();
      } else if (route.indexOf('community') > -1) {
        (this.$$('#communityPage') as YpCollection).refresh();
      } else if (route.indexOf('group') > -1) {
        (this.$$('#groupPage') as YpCollection).refresh();
      } else if (route.indexOf('post') > -1) {
        (this.$$('#postPage') as YpCollection).refresh();
      } else if (route.indexOf('user') > -1) {
        (this.$$('#userPage') as YpCollection).refresh();
      }
    });*/
  }

  _routePageChanged(oldRouteData: Record<string, string>) {
    if (this.routeData) {
      const params = this.route.split('/');

      if (
        this.route.indexOf('/user/reset_password') > -1 ||
        this.route.indexOf('/user/open_notification_settings') > -1 ||
        this.route.indexOf('/user/accept/invite') > -1 ||
        this.route.indexOf('/user/info_page') > -1
      ) {
        if (this.route.indexOf('/user/reset_password') > -1) {
          this.openResetPasswordDialog(params[params.length - 1]);
        } else if (
          this.routeData &&
          this.routeData.page === 'user' &&
          this.route.indexOf('/user/accept/invite') > -1
        ) {
          this.openAcceptInvitationDialog(params[params.length - 1]);
        } else if (
          this.route.indexOf('/user/open_notification_settings') > -1
        ) {
          this.openUserNotificationsDialog();
        } else if (this.route.indexOf('/user/info_page') > -1) {
          this.openUserInfoPage(parseInt(params[params.length - 1]));
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new CustomEvent('location-changed'));
        }
      } else {
        const map: Record<string, number> = this._scrollPositionMap;

        if (oldRouteData && oldRouteData.page != undefined) {
          map[oldRouteData.page] = window.pageYOffset;
        }

        let delayUntilScrollToPost = 0;

        if (this.wide) {
          delayUntilScrollToPost = 2;
        }
        setTimeout(() => {
          let skipMasterScroll = false;

          if (oldRouteData && oldRouteData.page && this.routeData) {
            // Post -> Group

            // Group -> Community
            if (
              (oldRouteData.page === 'group' || oldRouteData.page === 'post') &&
              this.routeData.page === 'community'
            ) {
              if (this.$$('#communityPage')) {
                (this.$$('#communityPage') as YpCommunity).scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn(
                  "Can't find scroll communityPage for goToPostOrNewsItem, trying again"
                );
                setTimeout(() => {
                  if (this.$$('#communityPage')) {
                    (
                      this.$$('#communityPage') as YpCommunity
                    ).scrollToGroupItem();
                  } else {
                    console.error(
                      "Can't find scroll communityPage for goToPostOrNewsItem"
                    );
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder -> Domain
            else if (
              (oldRouteData.page === 'community_folder' ||
                oldRouteData.page === 'community' ||
                oldRouteData.page === 'post') &&
              this.routeData.page === 'domain'
            ) {
              if (this.$$('#domainPage')) {
                (this.$$('#domainPage') as YpDomain).scrollToCommunityItem();
                skipMasterScroll = true;
              } else {
                console.warn(
                  "Can't find scroll domainPage for scrollToCommunityItem, trying again"
                );
                setTimeout(() => {
                  if (this.$$('#domainPage')) {
                    (
                      this.$$('#domainPage') as YpDomain
                    ).scrollToCommunityItem();
                  } else {
                    console.error(
                      "Can't find scroll domainPage for scrollToCommunityItem"
                    );
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder  -> Community
            else if (
              (oldRouteData.page === 'community' ||
                oldRouteData.page === 'community_folder') &&
              this.routeData.page === 'community_folder'
            ) {
              if (this.$$('#communityFolderPage')) {
                (
                  this.$$('#communityFolderPage') as YpCommunity
                ).scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn(
                  "Can't find scroll communityFolderPage for goToPostOrNewsItem, trying again"
                );
                setTimeout(() => {
                  if (this.$$('#communityFolderPage')) {
                    (
                      this.$$('#communityFolderPage') as YpCommunity
                    ).scrollToGroupItem();
                  } else {
                    console.error(
                      "Can't find scroll communityFolderPage for goToPostOrNewsItem"
                    );
                  }
                }, 200);
              }
            }
          }

          if (this.routeData.page !== 'post') {
            this._clearNextPost();
          }

          if (
            oldRouteData &&
            this.subRoute &&
            this.routeData &&
            oldRouteData.page === this.routeData.page
          ) {
            let testRoute = this.subRoute;
            testRoute = testRoute.replace('/', '');
            if (isNaN(parseInt(testRoute))) {
              skipMasterScroll = true;
            }
          }

          if (
            map[this.routeData.page] != null &&
            this.routeData.page !== 'post' &&
            !(
              oldRouteData &&
              oldRouteData.page === 'community' &&
              this.routeData.page === 'group'
            )
          ) {
            if (!skipMasterScroll) {
              window.scrollTo(0, map[this.routeData.page]);
              console.info(
                'Main window scroll ' +
                  this.routeData.page +
                  ' to ' +
                  map[this.routeData.page]
              );
            } else {
              console.info(
                'Skipping master scroller for ' + this.routeData.page
              );
            }
          } else if (!skipMasterScroll) {
            console.info('AppLayout scroll to top');
            setTimeout(() => {
              window.scrollTo(0, 0);
            });
          }
        }, delayUntilScrollToPost);

        if (this.routeData) {
          this.page = this.routeData.page;
          this._pageChanged();
        } else {
          console.error('No page data, current page: ' + this.page);
        }
      }
    }
  }

  loadDataViz() {
    window.appDialogs.loadDataViz();
  }

  _pageChanged() {
    const page = this.page;

    if (page && page === 'group_data_viz') {
      this.loadDataViz();
    }

    //TODO: Get bundling working
    /*if (page) {
      let resolvedPageUrl;
      if (page=="view-404") {
        resolvedPageUrl = this.resolveUrl("yp-view-404.html");
      } else if (page==='community_folder') {
        resolvedPageUrl = this.resolveUrl('../yp-community/yp-community-folder.js?v=@version@');
      } else {
        resolvedPageUrl = this.resolveUrl('/src/yp-' + page + '/' + 'yp-' + page + ".js?v=@version@");
      }
      console.log("Trying to load "+resolvedPageUrl);
      import(resolvedPageUrl).then(null, this._showPage404.bind(this));
    }*/

    if (page) {
      window.appGlobals.analytics.sendToAnalyticsTrackers(
        'send',
        'pageview',
        location.pathname
      );
    }
  }

  openResetPasswordDialog(resetPasswordToken: string) {
    // TODO: Remove any
    this.getDialogAsync('resetPassword', (dialog: any) => {
      dialog.open(resetPasswordToken);
    });
  }

  openUserNotificationsDialog() {
    if (window.appUser && window.appUser.loggedIn() === true) {
      window.appUser.openNotificationSettings();
    } else {
      window.appUser.loginForNotificationSettings();
    }
  }

  openAcceptInvitationDialog(inviteToken: string) {
    // TODO: Remove any
    this.getDialogAsync('acceptInvite', (dialog: any) => {
      dialog.open(inviteToken);
    });
  }

  _showPage404() {
    this.page = 'view-404';
  }

  _setHomeLink(event: CustomEvent) {
    if (!this.homeLink) {
      this.homeLink = event.detail;
    }
  }

  setKeepOpenForPostsOn(goBackToPage: string) {
    this.keepOpenForPost = goBackToPage;
    this.storedBackPath = this.backPath;
    this.storedLastDocumentTitle = document.title;
  }

  _resetKeepOpenForPage() {
    this.keepOpenForPost = undefined;
    this.storedBackPath = undefined;
    this.storedLastDocumentTitle = undefined;
  }

  _closePost() {
    if (this.keepOpenForPost) YpNavHelpers.redirectTo(this.keepOpenForPost);

    if (this.storedBackPath) this.backPath = this.storedBackPath;

    if (this.storedLastDocumentTitle) {
      document.title = this.storedLastDocumentTitle;
      this.storedLastDocumentTitle = undefined;
    }

    this.keepOpenForPost = undefined;
    document.dispatchEvent(
      new CustomEvent('lite-signal', {
        bubbles: true,
        detail: { name: 'yp-pause-media-playback', data: {} },
      })
    );
  }

  // Computed

  get closePostHeader() {
    if (this.page == 'post' && this.keepOpenForPost) return true;
    else return false;
  }

  _isGroupOpen(
    params: { groupId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.groupId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _isCommunityOpen(
    params: { communityId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.communityId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _isDomainOpen(
    params: { domainId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.domainId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _toggleNavDrawer() {
    (this.$$('mwc-drawer') as Drawer).open = true;
    (this.$$('#ypNavDrawer') as YpAppNavDrawer).opened = true;
  }

  getDialogAsync(idName: string, callback: Function) {
    // Todo: Get Working
    //(this.$$("#dialogContainer") as YpAppDialog).getDialogAsync(idName, callback);
  }

  closeDialog(idName: string) {
    (this.$$('#dialogContainer') as YpAppDialogs).closeDialog(idName);
  }

  _dialogClosed(event: CustomEvent) {
    // TODO: Get working
    (this.$$('#dialogContainer') as YpAppDialogs).dialogClosed(event.detail);
  }

  scrollPageToTop() {
    const mainArea = document.getElementById('#mainArea');
    if (mainArea) {
      mainArea.scrollTop = 0;
    }
  }

  _toggleUserDrawer() {
    // TODO: Get working
    //this.$$("#drawer")!.toggle();
  }

  _login() {
    if (window.appUser) {
      window.appUser.openUserlogin();
    }
  }

  _onChangeHeader(event: CustomEvent) {
    const header = event.detail;
    this.headerTitle = document.title = header.headerTitle;

    setTimeout(() => {
      const headerTitle = this.$$('#headerTitle') as HTMLElement | void;
      if (headerTitle) {
        const length = headerTitle.innerHTML.length;
        if (this.wide) {
          headerTitle.style.fontSize = '20px';
        } else {
          if (length < 20) {
            headerTitle.style.fontSize = '17px';
          } else if (length < 25) {
            headerTitle.style.fontSize = '14px';
          } else if (length < 30) {
            headerTitle.style.fontSize = '13px';
          } else {
            headerTitle.style.fontSize = '12px';
          }
        }
      }
    });

    if (header.documentTitle) {
      document.title = header.documentTitle;
    }
    this.headerDescription = header.headerDescription;

    //if (header.headerIcon)
    //app.headerIcon = header.headerIcon;
    if (header.enableSearch) this.showSearch = true;
    else this.showSearch = false;

    if (header.useHardBack === true) {
      this.useHardBack = true;
    } else {
      this.useHardBack = false;
    }

    if (header.backPath) {
      this.showBack = true;
      this.backPath = header.backPath;
    } else {
      this.showBack = false;
      this.backPath = undefined;
    }

    if (header.hideHelpIcon) {
      this.hideHelpIcon = true;
    } else {
      this.hideHelpIcon = false;
    }

    if (
      this.communityBackOverride &&
      this.backPath &&
      window.location.pathname.indexOf('/community/') > -1
    ) {
      const communityId = window.location.pathname.split(
        '/community/'
      )[1] as unknown as number;
      if (communityId && this.communityBackOverride[communityId]) {
        this.backPath = this.communityBackOverride[communityId].backPath;
        this.headerTitle = this.communityBackOverride[communityId].backName;
        this.useHardBack = false;
      }
    }

    if (this.showBack && header.disableDomainUpLink === true) {
      this.showBack = false;
      this.headerTitle = '';
    }
  }

  goBack() {
    if (this.backPath) {
      if (this.useHardBack) {
        this.fireGlobal('yp-pause-media-playback', {});
        window.location.href = this.backPath;
      } else {
        YpNavHelpers.redirectTo(this.backPath);
      }
    }
  }

  _onSearch(e: CustomEvent) {
    this.toggleSearch();
    this.previousSearches.unshift(e.detail.value);
    const postsFilter = document.querySelector('#postsFilter') as LitElement;
    if (postsFilter) {
      //TODO: When we have postFilter live
      //postsFilter.searchFor(e.detail.value);
    }
  }

  _onUserChanged(event: CustomEvent) {
    if (event.detail && event.detail.id) {
      this.user = event.detail;
    } else {
      this.user = undefined;
    }
  }

  toggleSearch() {
    //TODO: When we have postFilter live
    //this.$$("#search")?.toggle();
  }

  _setupTouchEvents() {
    document.addEventListener('touchstart', this._handleTouchStart.bind(this), {
      passive: true,
    });
    document.addEventListener('touchmove', this._handleTouchMove.bind(this), {
      passive: true,
    });
    document.addEventListener('touchend', this._handleTouchEnd.bind(this), {
      passive: true,
    });
  }

  _removeTouchEvents() {
    document.removeEventListener(
      'touchstart',
      this._handleTouchStart.bind(this)
    );
    document.removeEventListener('touchmove', this._handleTouchMove.bind(this));
    document.removeEventListener('touchend', this._handleTouchEnd.bind(this));
  }

  _handleTouchStart(event: any) {
    if (this.page === 'post' && this.goForwardToPostId) {
      const touches = event.touches || event.originalEvent.touches;
      const firstTouch = touches[0];

      if (
        firstTouch.clientX > 32 &&
        firstTouch.clientX < window.innerWidth - 32
      ) {
        this.touchXDown = firstTouch.clientX;
        this.touchYDown = firstTouch.clientY;
        this.touchXUp = undefined;
        this.touchYUp = undefined;
      }
    }
  }

  _handleTouchMove(event: any) {
    if (this.page === 'post' && this.touchXDown && this.goForwardToPostId) {
      const touches = event.touches || event.originalEvent.touches;
      this.touchXUp = touches[0].clientX;
      this.touchYUp = touches[0].clientY;
    }
  }

  _handleTouchEnd() {
    if (
      this.page === 'post' &&
      this.touchXDown &&
      this.touchYDown &&
      this.touchYUp &&
      this.touchXUp &&
      this.goForwardToPostId
    ) {
      const xDiff = this.touchXDown - this.touchXUp;
      const yDiff = this.touchYDown - this.touchYUp;
      //console.error("xDiff: "+xDiff+" yDiff: "+yDiff);

      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(yDiff) < 120) {
        let factor = 3;

        if (window.innerWidth > 500) factor = 4;

        if (window.innerWidth > 1023) factor = 5;

        if (window.innerWidth > 1400) factor = 6;

        const minScrollFactorPx = Math.round(window.innerWidth / factor);

        if (!this.userDrawerOpenedDelayed && !this.navDrawOpenedDelayed) {
          if (xDiff > 0 && xDiff > minScrollFactorPx) {
            window.scrollTo(0, 0);
            window.appGlobals.activity('swipe', 'postForward');
            this.$$('#goPostForward')?.dispatchEvent(new Event('tap'));
          } else if (xDiff < 0 && xDiff < -Math.abs(minScrollFactorPx)) {
            if (this.showBackToPost === true) {
              window.scrollTo(0, 0);
              this._goToPreviousPost();
              window.appGlobals.activity('swipe', 'postBackward');
            }
          }
        } else {
          console.log('Recommendation swipe not active with open drawers');
        }

        this.touchXDown = undefined;
        this.touchXUp = undefined;
        this.touchYDown = undefined;
        this.touchYUp = undefined;
      }
    }
  }
}
