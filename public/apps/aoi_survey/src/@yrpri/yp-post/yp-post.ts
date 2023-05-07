import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

import { YpCollection } from '../yp-collection/yp-collection.js';
import { nothing, html, TemplateResult, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/web/navigationbar/navigation-bar.js';
import { MdNavigationBar } from '@material/web/navigationbar/navigation-bar.js';

import '@material/web/navigationtab/navigation-tab.js';
import { MdNavigationTab } from '@material/web/navigationtab/navigation-tab.js';

import '@material/web/fab/fab.js';

//import '../yp-post/yp-posts-list.js';
//import '../yp-post/yp-post-card-add.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpPostCard } from './yp-post-card.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import './yp-post-header.js';
import './yp-post-points.js';
import './yp-post-user-images.js';

// TODO: Remove
interface AcActivity extends LitElement {
  scrollToItem(item: YpDatabaseItem): () => void;
  loadNewData(): () => void;
}

export const PostTabTypes: Record<string, number> = {
  Debate: 0,
  News: 1,
  Location: 2,
  Photos: 3,
};

@customElement('yp-post')
export class YpPost extends YpCollection {
  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  disableNewPosts = false;

  @property({ type: String })
  currentPage: string | undefined;

  @property({ type: Object })
  post: YpPostData | undefined = undefined;

  @property({ type: Number })
  scrollToPointId: number | undefined = undefined;

  @property({ type: String })
  debateCount: string | undefined = undefined;

  @property({ type: String })
  photosCount: string | undefined = undefined;

  constructor() {
    super('post', null, 'lightbulb_outline', 'post.create');
  }

  scrollToCollectionItemSubClass() {
    //TODO: Do we need this
  }

  static get styles() {
    return [
//      super.styles,
      ShadowStyles,
      css`
        .postHeader {
          padding: 16px;
          background-color: #fefefe;
          width: 940px;
        }

        ac-activities {
          padding-top: 8px;
        }

        yp-post-user-images {
          padding-top: 32px;
        }

        @media (max-width: 961px) {
          .postHeader {
            width: 600px;
          }
        }

        @media (max-width: 600px) {
          .postHeader {
            width: 400px;
          }
        }

        @media (max-width: 360px) {
          .postHeader {
            height: 100%;
            width: 360px;
            padding: 0;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  renderPostHeader() {
    return html`<yp-post-header
      id="postCard"
      class="largeCard"
      .post="${this.post!}"
      @refresh="${this._getPost}"
      headermode></yp-post-header>`;
  }

  renderPostTabs() {
    return nothing;
  }

  renderPostTabsTODO() {
    if (this.post && !this.post.Group.configuration.hideAllTabs) {
      return html`
        <div class="layout vertical center-center">
          <md-navigationbar @MDCTabBar:activated="${this._selectTab}">
            <md-navigation-tab
              .label="${this.tabDebateCount}"
              icon="lightbulb_outline"></md-navigation-tab>

            ${this.renderNewsAndMapTabs()}

            <md-navigation-tab
              .label="${this.tabPhotosCount}"
              icon="lightbulb_outline"></md-navigation-tab>
          </md-navigationbar>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderCurrentPostTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    if (this.post) {
      switch (this.selectedTab) {
        case PostTabTypes.Debate:
          page = html` <yp-post-points
            id="pointsSection"
            role="main"
            aria-label="${this.t('debate')}"
            ?isPostPage="${this.isPostPage}"
            ?isAdmin="${this.isAdmin}"
            .post="${this.post}"
            .scrollToId="${this.scrollToPointId}"></yp-post-points>`;
          break;
        case PostTabTypes.News:
          page = html`<ac-activities
            id="postNews"
            .selectedTab="${this.selectedTab}"
            .disableNewPosts="${this.disableNewPosts}"
            .postGroupId="${this.post!.group_id}"
            .postId="${this.post!.id}"></ac-activities>`;
          break;
        case PostTabTypes.Location:
          page = this.post.location
            ? html`<div
                class="mapContainer shadow-elevation-4dp shadow-transition">
                <google-map
                  additionalMapOptions="{'keyboardShortcuts':false}"
                  apiKey="XXXX"
                  id="map"
                  libraries="places"
                  class="map"
                  .mapType="${this.post.location.mapType}"
                  .zoom="${this.post.location.map_zoom}"
                  fitToMarkers="">
                  <google-map-marker
                    slot="markers"
                    latitude="${this.post.location.latitude}"
                    longitude="${this.post.location.longitude}"
                    id="marker"></google-map-marker>
                </google-map>
              </div>`
            : html` <h1 style="padding-top: 16px">
                ${this.t('post.noLocation')}
              </h1>`;
          break;
        case PostTabTypes.Photos:
          page = html` <div class="layout horizontal center-center">
            <yp-post-user-images .post="${this.post}"></yp-post-user-images>
          </div>`;
          break;
      }
    }

    return page;
  }

  render() {
    return this.post
      ? html`
          ${this.renderPostHeader()} ${this.renderPostTabs()}
          ${this.renderCurrentPostTabPage()}
          ${!this.disableNewPosts &&
          this.post &&
          !this.post.Group.configuration.hideNewPost &&
          !this.post.Group.configuration.hideNewPostOnPostPage
            ? html` <md-fab
                hidden
                .label="${this.t('post.new')}"
                icon="lightbulb"
                @click="${this._newPost}"></md-fab>`
            : nothing}
        `
      : html``;
  }

  get tabDebateCount(): string {
    const labelTranslation = this.t('post.tabs.debate');

    return `${labelTranslation} (${
      this.debateCount != undefined ? this.debateCount : '...'
    })`;
  }

  get tabPhotosCount(): string {
    const labelTranslation = this.t('post.tabs.photos');

    return `${labelTranslation} (${
      this.photosCount != undefined ? this.photosCount : '...'
    })`;
  }

  _selectedTabChanged() {
    //TODO: Make sure to polyfill Object.keys IE11
    const tabName = Object.keys(PostTabTypes)[this.selectedTab].toLowerCase();

    if (this.post) {
      //YpNavHelpers.redirectTo('/post/' + this.post.id + '/' + tabName);
    }

    if (tabName) {
      window.appGlobals.activity('open', 'post_tab_' + tabName, '', {
        id: this.collectionId,
        modelType: 'post',
      });
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('selectedTab')) {
      this._selectedTabChanged();
    }
  }

  get isPostPage(): boolean {
    return this.currentPage === "post";
  }

  _newPost() {
    window.appGlobals.activity('open', 'newPost');
    this.fire('yp-new-post', { group: this.post!.Group });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-debate-info', this._updateDebateInfo);
    this.addListener('yp-post-image-count', this._updatePostImageCount);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-debate-info', this._updateDebateInfo);
    this.removeListener('yp-post-image-count', this._updatePostImageCount);
  }

  _updatePostImageCount(event: CustomEvent) {
    const imageCount = event.detail;
    this.photosCount = YpFormattingHelpers.number(imageCount);
  }

  _updateDebateInfo(event: CustomEvent) {
    const detail = event.detail;
    this.debateCount = YpFormattingHelpers.number(detail.count);
  }

  _mainContainerClasses() {
    if (!this.wide) {
      return 'layout horizontal wrap';
    } else {
      return 'layout horizontal center-center';
    }
  }

  _headerClasses() {
    if (!this.wide) {
      return 'layout vertical postHeader wrap';
    } else {
      return 'layout horizontal postHeader';
    }
  }

  get postName() {
    if (this.post && this.post.name) {
      return YpFormattingHelpers.truncate(
        YpFormattingHelpers.trim(this.post.name),
        200
      );
    }
  }

  get postDescription() {
    if (this.post && this.post.description) {
      return YpFormattingHelpers.truncate(
        YpFormattingHelpers.trim(this.post.description),
        10000,
        '...'
      );
    } else {
      return '';
    }
  }

  async _getPost() {
    if (this.collectionId) {
      this.post = undefined;
      this.post = (await window.serverApi.getCollection(
        this.collectionType,
        this.collectionId
      )) as YpPostData | undefined;
      if (this.post) {
        this._processIncomingPost();
        this._getHelpPages('group', this.post.group_id);
      }
    } else {
      console.error('No collection id for _getPost');
    }
  }

  collectionIdChanged() {
    if (this.collectionId) {
      const cachedItem = window.appGlobals.cache.cachedPostItem;
      if (cachedItem && cachedItem.id == this.collectionId) {
        this.post = cachedItem;
        this._processIncomingPost();
        console.debug('Got post from single item cache');
      } else if (window.appGlobals.cache.getPostFromCache(this.collectionId)) {
        this.post = window.appGlobals.cache.getPostFromCache(this.collectionId);
        this._processIncomingPost(true);
        console.debug(
          'Got post from post multi cache possibly from recommendations'
        );
      } else {
        console.debug('Got post from server not cache');
        this.post = undefined;
        this._getPost();
      }
    }
  }

  _processIncomingPost(fromCache = false) {
    if (this.post) {
      this.refresh();

      if (!fromCache) window.appGlobals.cache.addPostsToCacheLater([this.post]);
      window.appGlobals.recommendations.getNextRecommendationForGroup(
        this.post.group_id,
        this.post.id,
        this._processRecommendation.bind(this)
      );

      this.isAdmin = YpAccessHelpers.checkPostAdminOnlyAccess(this.post);
    } else {
      console.error('Trying to refresh without post');
    }
  }

  _processRecommendation(recommendedPost: YpPostData) {
    if (recommendedPost && this.post) {
      let postName = recommendedPost.name;
      if (this.wide) {
        postName = YpFormattingHelpers.truncate(postName, 60);
      } else {
        postName = YpFormattingHelpers.truncate(postName, 30);
      }

      this.fire('yp-set-next-post', {
        currentPostId: this.post.id,
        goForwardToPostId: recommendedPost.id,
        goForwardPostName: postName,
      });
    } else if (this.post) {
      this.fire('yp-set-next-post', {
        currentPostId: this.post.id,
        goForwardToPostId: null,
        goForwardPostName: null,
      });
      console.log('Not recommended post');
    }
  }

  refresh() {
    if (this.post) {
      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.canAddNewPosts != undefined
      ) {
        if (this.post.Group.configuration.canAddNewPosts === true) {
          this.disableNewPosts = false;
        } else {
          this.disableNewPosts = true;
        }
      } else {
        this.disableNewPosts = false;
      }

      if (
        this.post.Group.theme_id != null ||
        (this.post.Group.configuration &&
          this.post.Group.configuration.themeOverrideColorPrimary != null)
      ) {
        window.appGlobals.theme.setTheme(
          this.post.Group.theme_id,
          this.post.Group.configuration
        );
      } else if (
        this.post.Group.Community &&
        (this.post.Group.Community.theme_id != null ||
          (this.post.Group.Community.configuration &&
            this.post.Group.Community.configuration.themeOverrideColorPrimary))
      ) {
        window.appGlobals.theme.setTheme(
          this.post.Group.Community.theme_id,
          this.post.Group.Community.configuration
        );
      } else {
        window.appGlobals.theme.setTheme(1);
      }

      if (this.post.Group.Community) {
        window.appGlobals.analytics.setCommunityAnalyticsTracker(
          this.post.Group.Community.google_analytics_code
        );

        if (this.post.Group.Community.configuration) {
          window.appGlobals.analytics.setCommunityPixelTracker(
            this.post.Group.Community.configuration.facebookPixelId
          );
        }

        if (
          this.post.Group.Community.configuration &&
          this.post.Group.Community.configuration.customSamlLoginMessage
        ) {
          window.appGlobals.currentSamlLoginMessage = this.post.Group.Community.configuration.customSamlLoginMessage;
        } else {
          window.appGlobals.currentSamlLoginMessage = undefined;
        }
      } else {
        console.error('No community!');
      }

      window.appGlobals.setAnonymousGroupStatus(this.post.Group);
      window.appGlobals.setRegistrationQuestionGroup(this.post.Group);

      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.defaultLocale != null
      ) {
        window.appGlobals.changeLocaleIfNeeded(
          this.post.Group.configuration.defaultLocale
        );
      }

      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.locationHidden != undefined
      ) {
        this.locationHidden = this.post.Group.configuration.locationHidden;
      } else {
        this.locationHidden = false;
      }

      this.fire('yp-change-header', {
        headerTitle: YpFormattingHelpers.truncate(this.post.Group.name, 80),
        documentTitle: this.post.name,
        headerDescription: '', //this.truncate(this.post.Group.objectives,45),
        backPath: '/group/' + this.post.group_id,
        backListItem: this.post,
        hideHelpIcon:
          this.post.Group.configuration &&
          this.post.Group.configuration.hideHelpIcon
            ? true
            : null,
      });

      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.disableFacebookLoginForGroup === true
      ) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }

      this.fire('yp-set-home-link', {
        type: 'group',
        id: this.post.Group.id,
        name: this.post.Group.name,
      } as YpHomeLinkData);

      if (
        this.post.Group &&
        this.post.Group.Community &&
        this.post.Group.Community.configuration &&
        this.post.Group.Community.configuration.signupTermsPageId &&
        this.post.Group.Community.configuration.signupTermsPageId != -1
      ) {
        window.appGlobals.signupTermsPageId = this.post.Group.Community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = undefined;
      }

      window.appGlobals.currentGroup = this.post.Group;

      if (
        (this.post.Group.configuration &&
          this.post.Group.configuration.forceSecureSamlLogin &&
          !YpAccessHelpers.checkGroupAccess(this.post.Group)) ||
        (this.post.Group.Community &&
          this.post.Group.Community.configuration &&
          this.post.Group.Community.configuration.forceSecureSamlLogin &&
          !YpAccessHelpers.checkCommunityAccess(this.post.Group.Community))
      ) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }

      if (
        (this.post.Group.configuration &&
          this.post.Group.configuration.forceSecureSamlLogin) ||
        (this.post.Group.Community &&
          this.post.Group.Community.configuration &&
          this.post.Group.Community.configuration.forceSecureSamlLogin)
      ) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }

      if (
        this.post.Group.Community &&
        this.post.Group.Community.configuration &&
        this.post.Group.Community.configuration.customSamlDeniedMessage
      ) {
        window.appGlobals.currentSamlDeniedMessage = this.post.Group.Community.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = undefined;
      }

      if (this.post.Group.configuration && this.post.Group.configuration.maxNumberOfGroupVotes) {
        window.appUser.calculateVotesLeftForGroup(this.post.Group);
      }
    }
  }
}
