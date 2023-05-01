import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpPostEdit } from './yp-post-edit.js';
import { YpApiActionDialog } from '../yp-api-action-dialog/yp-api-action-dialog.js';
import { YpPostBaseWithAnswers } from './yp-post-base-with-answers.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpPostHelpers } from './YpPostHelpers.js';

@customElement('yp-post-list-item')
export class YpPostListItem extends YpPostBaseWithAnswers(YpBaseElement) {
  @property({ type: String })
  selectedMenuItem: string | undefined;

  @property({ type: Number })
  elevation = 1;

  @property({ type: Object })
  post!: YpPostData;

  @property({ type: Boolean })
  mini = false;

  @property({ type: Boolean })
  isAudioCover = false;

  //TODO: Get this working
  @property({ type: Boolean })
  isEndorsed = false

  static get styles() {
    return [
      super.styles,
      css`
        .post-name {
          margin: 0;
          padding: 16px;
          padding-top: 20px;
          padding-bottom: 8px;
          cursor: pointer;
          vertical-align: middle !important;
          font-size: 1.25rem;
          background-color: #fff;
          color: #000;
          letter-spacing: 0.0125em;
          font-weight: var(--app-header-font-weight, 500);
          font-family: var(--app-header-font-family, Roboto);
        }

        .postNameContainer {
          width: 100%;
        }

        .postCardCursor {
          cursor: pointer;
        }

        .postCard {
          background-color: #fff;
          @apply --layout-horizontal;
        }

        :host {
          display: block;
          @apply --layout-vertical;
        }

        .postCard {
          height: 100px;
          width: 895px;
          border-radius: 4px;
        }

        .postCard[hide-post-cover] {
          height: 190px;
        }

        .postCard[hide-post-cover][hide-actions] {
          height: 165px;
        }

        .postCard[hide-post-cover][hide-description] {
          height: 140px;
        }

        .postCard[hide-description] {
          height: 372px;
        }

        .postCard[hide-description][hide-actions] {
          height: 331px;
        }

        .postCard[hide-description][hide-post-cover][hide-actions] {
          height: 110px;
        }

        .postCard[hide-actions] {
          height: 402px;
        }

        .postCard[mini] {
          width: 210px;
          height: 100%;
          margin: 0;
          padding-top: 0;
          padding-bottom: 0;
        }

        yp-post-cover-media {
          width: 178px;
          height: 100px;
        }

        yp-post-cover-media[mini] {
          width: 210px;
          height: 118px;
          min-height: 118px;
        }

        .post-name[mini] {
          padding: 16px;
        }

        .description {
          font-size: 17px;
          padding: 16px;
          padding-top: 0;
          cursor: pointer;
          color: #555;
        }

        .postActions {
          position: absolute;
          right: 20px;
          bottom: 0;
          margin: 0;
        }

        .shareIcon {
          position: absolute;
          left: 8px;
          bottom: 2px;
          --paper-share-button-icon-color: #656565;
          --paper-share-button-icon-height: 46px;
          --paper-share-button-icon-width: 46px;
          text-align: right;
          width: 48px;
          height: 48px;
        }

        .customRatings {
          position: absolute;
          bottom: 10px;
          right: 6px;
        }

        @media (max-width: 960px) {
          .customRatings {
            bottom: 12px;
          }

          :host {
            width: 100%;
            max-width: 423px;
          }

          .description[has-custom-ratings] {
            padding-bottom: 28px;
          }

          .postCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .postCard[mini] {
            width: 210px;
            height: 100%;
          }

          .card {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .card[mini] {
            width: 210px;
            height: 100%;
          }

          yp-post-cover-media {
            width: 100%;
            height: 230px;
          }

          yp-post-cover-media[mini] {
            width: 210px;
            height: 118px;
            min-height: 118px;
          }

          .card {
            height: 100%;
            padding-bottom: 48px;
          }

          .postCard {
            height: 100% !important;
          }

          yp-post-cover-media[audio-cover] {
            width: 100%;
            height: 100px;
          }
        }

        @media (max-width: 420px) {
          yp-post-cover-media {
            height: 225px;
          }
          yp-post-cover-media[audio-cover] {
            height: 100px;
          }
        }

        @media (max-width: 375px) {
          yp-post-cover-media {
            height: 207px;
          }
          yp-post-cover-media[audio-cover] {
            height: 100px;
          }
        }

        @media (max-width: 360px) {
          yp-post-cover-media {
            height: 200px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        @media (max-width: 320px) {
          yp-post-cover-media {
            height: 180px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }

        .share[mini] {
          display: none;
        }

        .description {
          max-width: 480px;
          font-size: 14px;
          margin-left: 8px;
        }

        .tagContainer {
          color: var(--app-tags-text-color, #111) !important;
          font-weight: var(--app-tags-font-weight, 500);
        }

        .middleDot {
          padding-left: 2px;
          padding-right: 2px;
          color: var(--app-tags-color, #656565);
        }
      `,
    ];
  }
  render() {
    return html`
      <paper-material
        ?mini="${this.mini}"
        ?hide-post-cover="${this.post.Group.configuration.hidePostCover}"
        ?hide-description="${this.post.Group.configuration.hidePostDescription}"
        ?hide-actions="${this.post.Group.configuration.hidePostActionsInGrid}"
        ?audio-cover="${this.isAudioCover}"
        class="card postCard layout vertical"
        elevation="${this.elevation}"
        animated
      >
        <div class="layout vertical">
          <a
            href="${this._getPostLink(this.post)}"
            id="theMainA"
            @tap="${this._savePostToBackCache}"
          >
            <div class="layout horizontal">
              <yp-post-cover-media
                ?mini="${this.mini}"
                top-radius
                ?audio-cover="${this.isAudioCover}"
                alt-tag="${this.post.name}"
                .post="${this.post}"
                ?hidden="${this.post.Group.configuration.hidePostCover}"
              ></yp-post-cover-media>
              <div class="layout vertical">
                <div class="postNameContainer">
                  <div class="post-name" mini$="${this.mini}" id="postName">
                    <yp-magic-text
                      id="postNameMagicText"
                      text-type="postName"
                      .contentLanguage="${this.post.language}"
                      @click="${this.goToPostIfNotHeader}"
                      textOnly
                      content="${this.post.name}"
                      .contentId="${this.post.id}"
                    >
                    </yp-magic-text>
                  </div>
                </div>
                ${!this.post.Group.configuration.usePostTagsForPostListItems
                  ? html`
                      ${!this.post.public_data?.structuredAnswersJson
                        ? html`
                            <yp-magic-text
                              class="description layout horizontal"
                              ?has-custom-ratings="${this.post.Group
                                .configuration.customRatings}"
                              ?hidden="${this.hideDescription}"
                              textType="postContent"
                              .contentLanguage="${this.post.language}"
                              @tap="${this.goToPostIfNotHeader}"
                              remove-urls
                              textOnly
                              content="${this.post.description}"
                              contentId="${this.post.id}"
                              truncate="200"
                            >
                            </yp-magic-text>
                          `
                        : nothing}
                      ${this.post.public_data?.structuredAnswersJson
                        ? html`
                            <yp-magic-text
                              id="description"
                              text-type="postContent"
                              .contentLanguage="${this.post.language}"
                              ?hidden="${this.hideDescription}"
                              content="${this.structuredAnswersFormatted}"
                              remove-urls
                              disableTranslation
                              skipSanitize
                              .contentId="${this.post.id}"
                              class="description"
                              truncate="120"
                            >
                            </yp-magic-text>
                          `
                        : nothing}
                    `
                  : nothing}
                ${this.post.Group.configuration.usePostTagsForPostListItems
                  ? html`
                      <div class="description tagContainer wrap">
                        ${this.postTags.map(
                          (index, item) => html`
                            <span class="tagItem">${item}</span>
                            <span
                              class="middleDot"
                              ?hidden="${this.computeSpanHidden(
                                this.postTags,
                                index
                              )}"
                              >&#9679;
                            </span>
                          `
                        )}
                      </div>
                    `
                  : nothing}
              </div>
            </div>
          </a>
          <div
            ?hidden="${this.post.Group.configuration.hidePostActionsInGrid}"
            @tap="${this._onBottomClick}"
          >
            ${this.mini
              ? html`
                  <div
                    class="share"
                    ?hidden="${this.post.Group.configuration.hideSharing}"
                  >
                    <paper-share-button
                      @share-tap="${this._shareTap}"
                      class="shareIcon"
                      ?less-margin="${this.post.Group.configuration
                        .hideDownVoteForPost}"
                      ?endorsed="${this.isEndorsed}"
                      horizontal-align="right"
                      id="shareButton"
                      .whatsapp="${this.post.Group.configuration
                        .allowWhatsAppSharing}"
                      title$="${this.t('post.shareInfo')}"
                      facebook=""
                      email=""
                      twitter=""
                      popup=""
                      url="${YpPostHelpers.fullPostUrl(this.post)}"
                    ></paper-share-button>
                  </div>
                  ${this.post.Group.configuration.customRatings
                    ? html`
                        <yp-post-ratings-info
                          class="customRatings"
                          .post="${this.post}"
                        ></yp-post-ratings-info>
                      `
                    : nothing}
                  ${!this.post.Group.configuration.customRatings
                    ? html`
                        <yp-post-actions
                          floating
                          class="postActions"
                          elevation="-1"
                          class="voting"
                          .post="${this.post}"
                          ?hidden="${this.mini}"
                        ></yp-post-actions>
                      `
                    : nothing}
                `
              : nothing}
          </div>
        </div>
      </paper-material>
    `;
  }

  /*
      behaviors: [
        Polymer.ypLanguageBehavior,
        Polymer.YpPostBehavior,
        Polymer.AccessHelpers,
        Polymer.ypLoggedInUserBehavior,
        Polymer.ypMediaFormatsBehavior,
        Polymer.ypTruncateBehavior,
        Polymer.ypGotoBehavior,
        Polymer.YpPostSurveyTranslationBehavior
      ],
*/

  computeSpanHidden(items: Array<string>, index: number | string) {
    return items.length - 1 == index;
  }

  get postTags() {
    if (this.post && this.post.public_data && this.post.public_data.tags) {
      return this.post.public_data.tags.split(',');
    } else {
      return [];
    }
  }

  _onBottomClick(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  clickOnA() {
    if (this.$$('#theMainA')) {
      (this.$$('#theMainA') as HTMLElement).click();
    }
  }

  _savePostToBackCache() {
    if (this.post) {
      window.appGlobals.cache.cachedPostItem = this.post;
    }
  }

  _getPostLink(post: YpPostData) {
    if (post) {
      if (
        post.Group.configuration &&
        post.Group.configuration.disablePostPageLink
      ) {
        return '#';
      } else if (
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

  _shareTap(event: CustomEvent) {
    window.appGlobals.activity(
      'postShareCardOpen',
      event.detail.brand,
      this.post ? this.post.id : -1
    );
  }

  get hideDescription() {
    return (
      this.mini ||
      (this.post &&
        this.post.Group.configuration &&
        this.post.Group.configuration.hidePostDescription)
    );
  }

  get hasPostAccess() {
    if (this.post) {
      return YpAccessHelpers.checkPostAccess(this.post);
    } else {
      return false;
    }
  }

  goToPostIfNotHeader() {
    if (
      this.post.Group.configuration &&
      this.post.Group.configuration.disablePostPageLink
    ) {
      console.log('goToPostDisabled');
    } else if (
      this.post.Group.configuration &&
      this.post.Group.configuration.resourceLibraryLinkMode
    ) {
      // Do nothing
    } else {
      YpNavHelpers.goToPost(this.post.id, undefined, undefined, this.post);
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('post')) {
      this._postChanged();
    }
  }

  _postChanged() {
    if (this.post) {
      if (this.post.cover_media_type === 'audio') {
        this.isAudioCover = true;
      } else {
        this.isAudioCover = false;
      }
    }
  }

  updateDescriptionIfEmpty(description: string) {
    if (!this.post.description || this.post.description == '') {
      this.post.description = description;
    }
  }

  _refresh() {
    window.appDialogs.getDialogAsync(
        'postEdit',
       (dialog: YpPostEdit) => {
          dialog.selected = 0;
          this.fire('refresh');
        }
      );
  }

  _openReport() {
    window.appGlobals.activity('open', 'post.report');
    window.appDialogs
      .getDialogAsync(
        'apiActionDialog',
       (dialog: YpApiActionDialog) => {
          dialog.setup(
            '/api/posts/' + this.post.id + '/report',
            this.t('reportConfirmation'),
            this._onReport.bind(this),
            this.t('post.report'),
            'PUT'
          );
          dialog.open();
        }
      );
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(
      this.t('post.report') + ': ' + this.post.name
    );
  }
}
