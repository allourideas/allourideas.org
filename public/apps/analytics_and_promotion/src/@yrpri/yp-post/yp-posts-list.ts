import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpIronListHelpers } from '../common/YpIronListHelpers.js';
import { RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';
import { LitVirtualizer } from '@lit-labs/virtualizer';
import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow.js';
import { GridLayout } from '@lit-labs/virtualizer/layouts/grid.js';

import '@material/mwc-icon-button';
import '@material/mwc-textfield';

import './yp-posts-filter.js';
import './yp-post-card.js';

import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpPostCard } from './yp-post-card.js';
import { YpPostsFilter } from './yp-posts-filter.js';
import { nothing, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { TextField } from '@material/mwc-textfield';

@customElement('yp-posts-list')
export class YpPostsList extends YpBaseElement {
  @property({ type: String })
  searchingFor: string | undefined;

  @property({ type: String })
  subTitle: string | undefined;

  @property({ type: String })
  filter = 'newest';

  @property({ type: String })
  statusFilter = 'open';

  @property({ type: Array })
  posts: Array<YpPostData> | undefined;

  //TODO: Check if we still want to use this like that
  @property({ type: Number })
  userId: number | undefined;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Number })
  categoryId: number | undefined;

  @property({ type: Number })
  postsCount: number | undefined;

  @property({ type: String })
  selectedCategoryName: string | undefined;

  @property({ type: Number })
  selectedGroupTab: number | undefined;

  @property({ type: Boolean })
  noPosts = false;

  @property({ type: Boolean })
  showSearchIcon = false;

  @property({ type: Boolean, reflect: true })
  grid = true;

  @state() randomSeed: number | undefined;

  moreToLoad = false;

  moreFromScrollTriggerActive = false;

  // For YpIronListHelper
  resetListSize: Function | undefined;
  skipIronListWidth = false;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .cardContainer {
          width: 100%;
          margin: 8px;
        }

        .postsFilter {
          padding-left: 16px;
          height: 36px;
        }

        .objectives {
          padding-bottom: 40px;
          max-width: 432px;
        }

        .description {
          padding: 12px;
        }

        yp-post-card {
          padding-bottom: 52px;
        }

        #outerRegion {
          position: relative;
        }

        #scrollableRegion {
        }

        lit-virtualizer {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        yp-posts-filter {
          margin-bottom: 8px;
          margin-left: 8px;
          margin-top: 16px;
        }

        #ironList {
        }

        .searchButton {
          padding: 8px;
          margin: 8px;
        }

        .searchContainer {
          margin-top: 8px;
        }

        yp-posts-filter {
          padding-right: 16px;
        }

        .half {
          width: 50%;
        }

        .searchBox {
          margin-bottom: 22px;
          margin-right: 8px;
        }

        .card {
          margin-left: 0;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          height: 435px !important;
          width: 416px !important;
          border-radius: 4px;
        }

        yp-post-card {
          height: 435px !important;
          width: 416px !important;
        }

        .card[mini] {
          width: 210px;
          height: 100%;
        }

        .card[wide-padding] {
          padding: 16px !important;
        }

        .card[desktop-list] {
          padding: 0 !important;
          padding-top: 16px !important;
        }

        .card[is-last-item] {
          padding-bottom: 128px;
        }



        @media (max-width: 800px) {
          .searchBox {
            margin-bottom: 8px;
          }

          .searchBox {
            margin-top: 8px;
          }

          .half {
            width: 100%;
          }

          .searchContainer {
            margin-top: 0;
          }

          .postsFilter {
            padding-left: 16px;
            width: 215px !important;
          }
        }

        .noIdeas {
          background-color: #fff;
          max-width: 200px;
          padding: 16px;
          margin: 16px;
          margin-top: 32px;
        }

        .noIdeasText {
          font-weight: bold;
        }

        .card {
          padding: 0;
          padding-top: 8px;
        }

        yp-post-cover-media {
          width: 100%;
          height: 230px;
        }

        #searchInput {
          margin-left: 8px;
        }

        [hidden] {
          display: none !important;
        }

        :focus {
        }

        .largeAjax {
          position: absolute;
          bottom: 32px;
        }

        a {
          text-decoration: none;
        }
      `,
    ];
  }

  _searchKey(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this._search();
    }

    this.showSearchIcon = true;
  }

  render() {
    return html`
      <div class="layout vertical center-center topMost">
        ${this.noPosts
          ? html`
              <div class="layout horiztonal center-center">
                <div
                  class="noIdeas layout horizontal center-center shadow-elevation-6dp shadow-transition"
                  ?hidden="${this.group.configuration.allPostsBlockedByDefault}"
                >
                  <div class="noIdeasText">${this.t('noIdeasHere')}</div>
                </div>
              </div>
            `
          : nothing}
        <div
          class="searchContainer layout horizontal center-center wrap"
          ?hidden="${this.group.configuration.hidePostFilterAndSearch ||
          this.noPosts}"
        >
          <div class="layout horizontal center-center">
            <yp-posts-filter
              @click="${this._tapOnFilter}"
              .subTitle="${this.subTitle ? this.subTitle : ''}"
              class="filter"
              id="postsFilter"
              .tabName="${this.statusFilter}"
              @refresh-group="${this.refreshGroupFromFilter}"
              .group="${this.group}"
              .filter="${this.filter}"
              .statusFilter="${this.statusFilter}"
              .searchingFor="${this.searchingFor}"
              .categoryId="${this.categoryId}"
              .postsCount="${this.postsCount}"
            >
            </yp-posts-filter>
          </div>
          <div class="layout horizontal center-center">
            ${this.searchingFor
              ? html`
                  <mwc-icon-button
                    aria-label="${this.t('clearSearchInput')}"
                    icon="clear"
                    @click="${this._clearSearch}"
                    class="clear-search-trigger"
                  ></mwc-icon-button>
                `
              : nothing}
            <mwc-textfield
              id="searchInput"
              @keydown="${this._searchKey}"
              .label="${this.t('searchFor')}"
              .value="${this.searchingFor ? this.searchingFor : ''}"
              class="searchBox"
            >
            </mwc-textfield>
            <mwc-icon-button
              .label="${this.t('startSearch')}"
              icon="search"
              @click="${this._search}"
              ?hidden="${!this.showSearchIcon}"
            ></mwc-icon-button>
          </div>
        </div>
        ${this.posts
          ? html`
              <lit-virtualizer
                id="list"
                .items=${this.posts}
                .layout="${this.grid ? {
                    type: GridLayout,
                    itemSize: { width: '424px', height: '435px' },
                    flex: { preserve: 'aspect-ratio' },
                    justify: 'space-around',
                    padding: '0',
                } : FlowLayout}"
                .scrollTarget="${window}"
                .renderItem=${this.renderPostItem.bind(this)}
                @rangeChanged=${this.scrollEvent}
              ></lit-virtualizer>
            `
          : nothing}
      </div>
    `;
  }

  renderPostItem(post: YpPostData, index?: number | undefined): TemplateResult {
    const tabindex = index !== undefined ? index + 1 : 0;
    if (false && this.desktopListFormat) {
      return html`
        <yp-post-list-item
          aria-label="${post.name}"
          @keypress="${this._keypress.bind(this)}"
          @click="${this._selectedItemChanged.bind(this)}"
          tabindex="${tabindex}"
          id="postCard${post.id}"
          class="card"
          .post="${post}"
        >
        </yp-post-list-item>
      `;
    } else {
      return html`
        <yp-post-card
          aria-label="${post.name}"
          ?is-last-item="${this._isLastItem(index!)}"
          @keypress="${this._keypress.bind(this)}"
          @click="${this._selectedItemChanged.bind(this)}"
          tabindex="${tabindex}"
          id="postCard${post.id}"
          class="csard"
          .post="${post}"
        >
        </yp-post-card>
      `;
    }
  }

  get desktopListFormat() {
    return this.wide && this.group!=undefined && this.posts!=undefined
  }

  get wideNotListFormat() {
    return this.wide && !this.desktopListFormat && this.group!=undefined && this.posts!=undefined
  }

  _isLastItem(index:number) {
    return (this.posts && index>=this.posts.length-1);
  }

  _keypress(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this._selectedItemChanged(event as unknown as CustomEvent);
    }
  }

  _categoryChanged(event: CustomEvent) {
    if (event.detail) {
      this.categoryId = event.detail;
    } else {
      this.categoryId = undefined;
    }
  }

  _filterChanged(event: CustomEvent) {
    this.filter = event.detail;
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
  }

  _clearSearch() {
    this.searchingFor = undefined;
    this.filter = 'newest';
    (this.$$('#postsFilter') as YpPostsFilter)._updateAfterFiltering();
  }

  scrollEvent(event: RangeChangedEvent) {
    //TODO: Check this logic
    if (
      this.posts &&
      !this.moreFromScrollTriggerActive &&
      event.last != -1 &&
      event.last < this.posts.length &&
      event.last + 5 >= this.posts.length
    ) {
      this.moreFromScrollTriggerActive = true;
      this._loadMoreData();
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-filter-category-change', this._categoryChanged);
    this.addListener('yp-filter-changed', this._filterChanged);
    this.addListener('refresh', this._refreshPost);

    if (this.posts) {
      if (window.appGlobals.cache.cachedPostItem !== undefined) {
        this.scrollToPost(window.appGlobals.cache.cachedPostItem);
        window.appGlobals.cache.cachedPostItem = undefined;
      }

      if (window.appGlobals.groupLoadNewPost) {
        window.appGlobals.groupLoadNewPost = false;
        this.refreshGroupFromFilter();
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-filter-category-change', this._categoryChanged);
    this.removeListener('yp-filter-changed', this._filterChanged);
    this.removeListener('refresh', this._refreshPost);
  }

  _selectedItemChanged(event: CustomEvent) {
    const postCard = event.target as YpPostCard;

    postCard.clickOnA();
  }

  async _refreshPost(event: CustomEvent) {
    const postId: number = event.detail.id as number;
    if (postId) {
      const post = (await window.serverApi.getPost(
        postId
      )) as YpPostData | void;
      if (post && this.posts) {
        for (let i = 0; i < this.posts.length; i++) {
          if (this.posts[i].id == post.id) {
            this.posts[i] = post;
            window.appGlobals.cache.updatePostInCache(post);
            this.requestUpdate;
            await this.updateComplete;
            setTimeout(() => {
              //TODO: See if we still need to do something like this
              //(this.$$('#ironList') as IronListInterface).fire('iron-resize');
            });
            break;
          }
        }
      }
    }
  }

  _getPostLink(post: YpPostData) {
    if (post) {
      if (
        post.Group &&
        post.Group.configuration &&
        post.Group.configuration.disablePostPageLink
      ) {
        return '#';
      } else if (
        post.Group &&
        post.Group.configuration &&
        post.Group.configuration.resourceLibraryLinkMode
      ) {
        return post.description.trim();
      } else {
        return '/post/' + post.id;
      }
    } else {
      console.warn('Trying to get empty post link');
    }
  }

  get scrollOffset() {
    const list = this.$$('ironList');
    if (list) {
      let offset = list.offsetTop;
      offset -= 75;
      if (list.offsetTop > 0 && offset > 0) {
        console.info('Post list scroll offset: ' + offset);
        return offset;
      } else {
        if (this.wide) offset = 550;
        else offset = 700;

        if (this.group && this.group.configuration) {
          if (this.group.configuration.hideAllTabs) offset -= 60;
          if (this.group.configuration.hideNewPost) offset -= 100;
          if (this.group.configuration.hidePostFilterAndSearch) offset -= 100;
        }

        console.info('Post list (manual) scroll offset: ' + offset);
        return offset;
      }
    } else {
      console.warn('No list for scroll offset');
      return null;
    }
  }

  _tapOnFilter() {
    window.appGlobals.activity('click', 'filter');
  }

  _search() {
    window.appGlobals.activity('click', 'search');
    this.searchingFor = (this.$$('#searchInput') as TextField).value;
    if (this.searchingFor && this.searchingFor != '') {
      this.refreshGroupFromFilter();
    }
  }

  buildPostsUrlPath() {
    return (this.$$('#postsFilter') as YpPostsFilter).buildPostsUrlPath();
  }

  async scrollToPost(post: YpPostData) {
    if (post && this.posts) {
      console.info('Scrolling to post: ' + post.id);
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i] == post) {
          (this.$$('#list') as LitVirtualizer).scrollToIndex(i);
          break;
        }
      }
      this.fireGlobal('yp-refresh-activities-scroll-threshold');
    } else {
      console.error('No post id on goToPostId');
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('statusFilter') &&
      this.group &&
      this.statusFilter
    ) {
      const allowedForceByValues = [
        'oldest',
        'newest',
        'top',
        'most_debated',
        'random',
        'alphabetical',
      ];

      this.randomSeed = Math.random();

      this.posts = undefined;
      this.noPosts = false;
      if (this.group) {
        this.moreToLoad = true;

        if (window.appGlobals.originalQueryParameters &&
          window.appGlobals.originalQueryParameters['categoryId']) {
          this.categoryId = window.appGlobals.originalQueryParameters['categoryId'] as number;
          window.appGlobals.originalQueryParameters['categoryId'] = undefined;
        } else {
          this.categoryId = undefined;
        }

        if (
          this.group.configuration &&
          this.group.configuration.forcePostSortMethodAs &&
          allowedForceByValues.indexOf(
            this.group.configuration.forcePostSortMethodAs
          ) > -1
        ) {
          this.filter = this.group.configuration.forcePostSortMethodAs;
        } else {
          if (
            this.group.configuration &&
            this.group.configuration.canAddNewPosts != undefined
          ) {
            if (this.group.configuration.canAddNewPosts === true) {
              this.filter = 'newest';
            } else if (
              this.group.configuration.canAddNewPosts === false &&
              this.group.configuration.canVote === false
            ) {
              this.filter = 'top';
            } else {
              this.filter = 'random';
            }
          } else if (!this.filter) {
            this.filter = 'newest';
          }
        }
        console.info('LOADMORE FOR CONTAINER');
        this._loadMoreData();
      }
    } else if (this.group && changedProperties.has('filter') && this.filter) {
      //this._loadMoreData();
    } else if (
      this.group &&
      changedProperties.has('categoryId') &&
      this.categoryId
    ) {
      this._loadMoreData();
    }

    if (changedProperties.has('searchingFor')) {
      if (this.searchingFor && this.searchingFor != '') {
        this.moreToLoad = true;
        this.showSearchIcon = true;
      } else {
        this.showSearchIcon = false;
      }
    }
  }

  refreshGroupFromFilter() {
    this.posts = undefined;
    this.moreToLoad = true;
    this._loadMoreData();
  }

  async _loadMoreData() {
    if (this.moreToLoad && this.group) {
      this.moreToLoad = false;
      this.noPosts = false;
      let objectIdString: string;
      let objectType: string;
      let url: string;

      if (this.userId) {
        objectIdString = this.userId + '/posts';
        objectType = 'users';
      } else {
        objectIdString = `${this.group.id}`;
        objectType = 'groups';
      }

      if (this.searchingFor) {
        url =
          '/api/' +
          objectType +
          '/' +
          objectIdString +
          '/search/' +
          this.searchingFor;
      } else {
        url =
          '/api/' + objectType + '/' + objectIdString + '/posts/' + this.filter;
        if (this.categoryId) {
          url += '/' + this.categoryId;
        } else {
          url += '/null';
        }
        url += '/' + this.statusFilter;
      }

      const offset = this.posts ? this.posts.length : 0;
      url += '?offset=' + offset;

      if (this.filter=="random" && this.randomSeed) {
        url += "&randomSeed="+this.randomSeed;
      }

      const postsInfo = (await window.serverApi.getGroupPosts(
        url
      )) as YpPostsInfoInterface | void;

      if (postsInfo) {
        this.postsCount = postsInfo.totalPostsCount;

        this.fire('yp-post-count', {
          type: this.statusFilter,
          count: this.postsCount,
        });

        if (!this.posts) {
          this.posts = postsInfo.posts;
        } else {
          for (let i = 0; i < postsInfo.posts.length; i++) {
            this.posts.push(postsInfo.posts[i]);
          }
        }

        if (postsInfo.posts.length == 0 && this.posts.length == 0) {
          this.noPosts = true;
        }

        if (postsInfo.posts.length > 0) {
          this.noPosts = false;
        } else {
          if (this.searchingFor && this.searchingFor != '') {
            this.noPosts = false;
          }
        }

        setTimeout(() => {
          const postFilter = this.$$('#postsFilter') as YpPostsFilter;
          if (postFilter) {
            postFilter._updateTitle();
          }
        }, 20);

        if (
          postsInfo.posts.length > 0 &&
          postsInfo.posts.length != this.postsCount
        ) {
          this.moreToLoad = true;
        }

        this.fireGlobal('yp-refresh-activities-scroll-threshold');

        this._processCategories();
        this._checkForMultipleLanguages(postsInfo.posts);
        window.appGlobals.cache.addPostsToCacheLater(postsInfo.posts);
        this.requestUpdate();
      }
    }

    this.moreFromScrollTriggerActive = false;
  }

  _checkForMultipleLanguages(posts: Array<YpPostData>) {
    if (
      !localStorage.getItem('dontPromptForAutoTranslation') &&
      !sessionStorage.getItem('dontPromptForAutoTranslation')
    ) {
      let firstLanguage: string;
      let firstContent: string;
      let multipleLanguages = false;
      posts.forEach(function (post) {
        if (post.language && !multipleLanguages) {
          if (!firstLanguage && post.language !== '??') {
            firstLanguage = post.language;
            firstContent = post.description;
          } else if (
            firstLanguage &&
            firstLanguage !== post.language &&
            post.language !== '??'
          ) {
            multipleLanguages = true;
            console.info(
              'Multiple post languages: ' +
                firstLanguage +
                ' and ' +
                post.language
            );
            //console.info("A: "+firstContent+" B: "+post.description);
          }
        }
      });

      if (multipleLanguages) {
        /* TODO: Fix explicit typedef
        window.appDialogs.getDialogAsync('autoTranslateDialog', (dialog: { openLaterIfAutoTranslationEnabled: () => void }) => {
          dialog.openLaterIfAutoTranslationEnabled();
        }); */
      }
    }
  }

  _processCategories() {
    if (this.categoryId && this.group.Categories) {
      for (let i = 0; i < this.group.Categories.length; i++) {
        if (this.group.Categories[i].id == this.categoryId) {
          this.selectedCategoryName = this.group.Categories[i].name;
          //this.$.layout.updateFilter();
        }
      }
    } else {
      this.selectedCategoryName = 'categories.all';
      //this.$.layout.updateFilter();
    }
  }
}
