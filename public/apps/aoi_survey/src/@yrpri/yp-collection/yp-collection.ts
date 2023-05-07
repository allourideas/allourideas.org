import { html, css, nothing, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

//import { ifDefined } from 'lit/directives/if-defined.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

import '@material/web/navigationbar/navigation-bar.js';
import '@material/web/navigationtab/navigation-tab.js';

import '@material/web/fab/fab.js';
import './yp-collection-header.js';
import './yp-collection-items-grid.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { YpServerApi } from '../common/YpServerApi.js';

import '../ac-activities/ac-activities.js';
import '../yp-post/yp-post-map.js';
//import { AcActivities } from '../ac-activities/ac-activities.js';

export const CollectionTabTypes: Record<string, number> = {
  Collection: 0,
  Newsfeed: 1,
  Map: 2,
};

export abstract class YpCollection extends YpBaseElement {
  @property({ type: Boolean })
  noHeader = false;

  @property({ type: Boolean })
  tabsHidden = false;

  @property({ type: Number })
  collectionId: number | undefined;

  @property({ type: String })
  collectionName: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  selectedTab = CollectionTabTypes.Collection;

  @property({ type: Array })
  collectionItems: Array<YpCommunityData | YpGroupData> | undefined;

  @property({ type: Boolean })
  hideNewsfeed = false;

  @property({ type: Boolean })
  locationHidden = false;

  @property({ type: Boolean })
  hideCollection = false;

  @property({ type: String })
  createFabIcon: string | undefined;

  @property({ type: String })
  createFabLabel: string | undefined;

  collectionType: string;
  collectionItemType: string | null;
  collectionCreateFabIcon: string;
  collectionCreateFabLabel: string;

  constructor(
    collectionType: string,
    collectionItemType: string | null,
    collectionCreateFabIcon: string,
    collectionCreateFabLabel: string
  ) {
    super();
    this.collectionType = collectionType;
    this.collectionItemType = collectionItemType;
    this.collectionCreateFabIcon = collectionCreateFabIcon;
    this.collectionCreateFabLabel = collectionCreateFabLabel;

    //TODO: Fix this as it causes loadMoreData to be called twice on post lists at least
    this.addGlobalListener('yp-logged-in', this._getCollection.bind(this));
    this.addGlobalListener('yp-got-admin-rights', this.refresh.bind(this));
  }

  abstract scrollToCollectionItemSubClass(): void;

  // DATA PROCESSING

  connectedCallback() {
    super.connectedCallback();
    if (this.collection) this.refresh();
  }

  refresh(): void {
    console.info('REFRESH');
    if (this.collection) {
      if (this.collection.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.collection.default_locale);
      }

      if (this.collection.theme_id !== undefined) {
        window.appGlobals.theme.setTheme(this.collection.theme_id);
      }

      this.fire('yp-set-home-link', {
        type: this.collectionType,
        id: this.collection.id,
        name: this.collection.name,
      } as YpHomeLinkData);

      this.fire('yp-change-header', {
        headerTitle: null,
        documentTitle: this.collection.name,
        headerDescription:
          this.collection.description || this.collection.objectives,
      });

      if (
        this.collection.configuration?.hideAllTabs ||
        (this.collection.configuration as YpGroupConfiguration)
          ?.hideGroupLevelTabs
      ) {
        this.tabsHidden = true;
      } else {
        this.tabsHidden = false;
      }

      if (this.$$('#collectionItems')) {
        (this.$$('#collectionItems') as YpCollectionItemsGrid).refresh();
      }
    }
  }

  async _getCollection() {
    if (this.collectionId) {
      this.collection = undefined;
      this.collectionItems = undefined;
      this.collection = (await window.serverApi.getCollection(
        this.collectionType,
        this.collectionId
      )) as YpCollectionData | undefined;
      this.refresh();
    } else {
      console.error('No collection id for _getCollection');
    }
  }

  async _getHelpPages(
    collectionTypeOverride: string | undefined = undefined,
    collectionIdOverride: number | undefined = undefined
  ) {
    if (this.collectionId) {
      const helpPages = (await window.serverApi.getHelpPages(
        collectionTypeOverride ? collectionTypeOverride : this.collectionType,
        collectionIdOverride ? collectionIdOverride : this.collectionId
      )) as Array<YpHelpPageData> | undefined;
      if (helpPages) {
        this.fire('yp-set-pages', helpPages);
      }
    } else {
      console.error('Collection id setup for get help pages');
    }
  }

  get collectionTabLabel(): string {
    const translatedCollectionItems = this.t(
      YpServerApi.transformCollectionTypeToApi(this.collectionItemType!)
    );
    return `${translatedCollectionItems} (${
      this.collectionItems ? this.collectionItems.length : 0
    })`;
  }

  // UI

  static get styles() {
    return [
      super.styles,
      css`
        mwc-fab {
          position: fixed;
          bottom: 16px;
          right: 16px;
        }

        md-navigation-tab {
          font-family: var(--app-header-font-family, Roboto);
        }

        md-navigation-tab-bar {
          width: 960px;
        }

        .header {
          background-color: var(--primary-background-color);
          background-image: var(--top-area-background-image, none);
          height: 300px;
        }

        .createFab[is-map] {
          right: inherit;
          left: 28px;
        }
      `,
    ];
  }

  renderHeader() {
    return this.collection && !this.noHeader
      ? html`
          <div class="layout vertical center-center header">
            <yp-collection-header
              .collection="${this.collection}"
              .collectionType="${this.collectionType}"
              aria-label="${this.collectionType}"
              role="banner"
            ></yp-collection-header>
          </div>
        `
      : nothing;
  }

  renderNewsAndMapTabs() {
    return html`
      <md-navigation-tab
        ?hidden="${this.hideNewsfeed}"
        .label="${this.t('post.tabs.news')}"
        icon="rss_feed"
      ></md-navigation-tab>
      <md-navigation-tab
        ?hidden="${this.locationHidden || this.collectionType == 'domain'}"
        .label="${this.t('post.tabs.location')}"
        icon="location_on"
      ></md-navigation-tab>
    `;
  }

  renderTabs() {
    if (this.collection && !this.tabsHidden) {
      return html`
        <div class="layout vertical center-center">
          <md-navigation-bar @MDCTabBar:activated="${this._selectTab}">
            <md-navigation-tab
              ?hidden="${this.hideCollection}"
              .label="${this.collectionTabLabel}"
              icon="groups"
            ></md-navigation-tab>
            ${this.renderNewsAndMapTabs()}
          </md-navigation-bar>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case CollectionTabTypes.Collection:
        page =
          this.collectionItems && this.collectionItemType
            ? html` <yp-collection-items-grid
                id="collectionItems"
                .collectionItems="${this.collectionItems}"
                .collection="${this.collection}"
                .collectionType="${this.collectionType}"
                .collectionItemType="${this.collectionItemType}"
                .collectionId="${this.collectionId!}"
              ></yp-collection-items-grid>`
            : html``;
        break;
      case CollectionTabTypes.Newsfeed:
        page = html`<ac-activities
          id="collectionActivities"
          .selectedTab="${this.selectedTab}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId!}"
        ></ac-activities>`;
        break;
      case CollectionTabTypes.Map:
        page = html`<yp-post-map
          id="postsMap"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId!}"
        ></yp-post-map>`;
        break;
    }

    return page;
  }

  render() {
    return html`
      ${this.renderHeader()} ${this.renderTabs()} ${this.renderCurrentTabPage()}
      ${this.createFabIcon && this.createFabLabel
        ? html`<md-fab
            ?extended="${this.wide}"
            class="createFab"
            ?is-map="${this.selectedTab === CollectionTabTypes.Map}"
            .label="${this.t(this.createFabLabel)}"
            .icon="${this.createFabIcon}"
          ></md-fab>`
        : nothing}
    `;
  }

  // EVENTS

  collectionIdChanged() {
    this._getCollection();
    this._getHelpPages();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('subRoute') && this.subRoute) {
      const splitSubRoute = this.subRoute.split('/');
      this.collectionId = parseInt(splitSubRoute[1]);
      if (splitSubRoute.length > 2) {
        this._setSelectedTabFromRoute(splitSubRoute[1]);
      } else {
        this._setSelectedTabFromRoute('default');
      }
    }

    if (changedProperties.has('collectionId') && this.collectionId) {
      this.collectionIdChanged();
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  _setSelectedTabFromRoute(routeTabName: string): void {
    let tabNumber;

    switch (routeTabName) {
      case 'collection':
        tabNumber = CollectionTabTypes.Collection;
        break;
      case 'news':
        tabNumber = CollectionTabTypes.Newsfeed;
        break;
      case 'map':
        tabNumber = CollectionTabTypes.Map;
        break;
      default:
        tabNumber = CollectionTabTypes.Collection;
        break;
    }

    if (tabNumber) {
      this.selectedTab = tabNumber;
      window.appGlobals.activity(
        'open',
        this.collectionType + '_tab_' + routeTabName
      );
    }
  }

  scrollToCachedItem() {
    if (
      this.selectedTab === CollectionTabTypes.Newsfeed &&
      window.appGlobals.cache.cachedActivityItem
    ) {
      const activities = this.$$('#collectionActivities') as any /*AcActivities*/;
      if (activities) {
        activities.scrollToItem(window.appGlobals.cache.cachedActivityItem);
        window.appGlobals.cache.cachedActivityItem = undefined;
      } else {
        console.error('No activities for scroll to item');
      }
    } else if (this.selectedTab === CollectionTabTypes.Collection) {
      this.scrollToCollectionItemSubClass();
    }
  }

  scrollToCollectionItemSubClassDomain() {
    if (
      this.collection &&
      window.appGlobals.cache.backToDomainCommunityItems &&
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
    ) {
      (this.$$('#collectionItems') as YpCollectionItemsGrid).scrollToItem(
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      );
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
        undefined;
    }
  }

  setFabIconIfAccess(
    onlyAdminCanCreate: boolean,
    hasCollectionAccess: boolean
  ) {
    if (onlyAdminCanCreate || hasCollectionAccess) {
      this.createFabIcon = this.collectionCreateFabIcon;
      this.createFabLabel = this.collectionCreateFabLabel;
    } else {
      this.createFabIcon = undefined;
      this.createFabLabel = undefined;
    }
  }

  //TODO: Review this when we remove the group community links
  _useHardBack(configuration: YpCollectionConfiguration) {
    if (configuration && configuration.customBackURL) {
      const backUrl = configuration.customBackURL;
      if (
        backUrl.startsWith('/community/') ||
        backUrl.startsWith('/group/') ||
        backUrl.startsWith('/domain/') ||
        backUrl.startsWith('/post/')
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
