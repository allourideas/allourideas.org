import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { AcActivityWithGroupBase } from './ac-activity-with-group-base.js';

import '../yp-magic-text/yp-magic-text.js';
import { YpPostBaseWithAnswers } from '../yp-post/yp-post-base-with-answers.js';
import { YpBaseElement } from '../common/yp-base-element.js';

@customElement('ac-activity-post')
export class AcActivityPost extends YpPostBaseWithAnswers(
  AcActivityWithGroupBase
) {
  static get styles() {
    return [
      super.styles,
      css`
        .descriptionOuter {
          color: var(--primary-color-more-darker, #424242);
          line-height: var(--description-line-height, 1.3);
          margin: 0;
          padding-bottom: 8px;
          padding-top: 8px;
          margin-bottom: 48px;
          width: 100% !important;
        }

        .mainContainerItem[is-ie11] {
          max-width: 480px !important;
        }

        @media (max-width: 600px) {
          .mainContainerItem[is-ie11] {
            max-width: 290px !important;
          }
        }

        .description,
        .post-name {
          padding-left: 16px;
          padding-right: 16px;
        }

        .post-name {
          font-size: 24px;
          padding-bottom: 4px;
          margin: 0;
          padding-top: 0;
          margin-top: 16px;
        }

        .voting {
          position: absolute;
          bottom: 0;
          right: 16px;
        }

        .card-actions {
          position: absolute;
          bottom: 36px;
          right: 0;
        }

        .category-icon {
          width: 64px;
          height: 64px;
        }

        .category-image-container {
          text-align: right;
          margin-top: -52px;
        }

        .postCardCursor {
          cursor: pointer;
        }

        yp-post-cover-media {
          width: 432px;
          height: 258px;
          padding-bottom: 4px;
          margin-top: 8px;
        }

        .postCard {
          width: 960px;
          background-color: #fff;
        }

        @media (max-width: 960px) {
          :host {
            width: 420px;
          }

          .postCard {
            height: 100%;
            width: 420px;
          }

          yp-post-cover-media {
            width: 300px;
            height: 166px;
          }

          .voting {
            padding-left: 0;
            padding-right: 0;
          }

          .card-actions {
            width: 320px;
          }

          .card-content {
            width: 420px !important;
            padding-bottom: 74px;
          }

          .description {
            width: 300px;
          }
        }

        :host {
          width: 304px;
        }

        .postCard {
          height: 100% !important;
          width: 304px !important;
        }

        .actionInfo {
          font-size: 22px;
          margin-top: 16px;
          padding-left: 16px;
          padding-right: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 420px) {
          .description {
            width: 290px;
          }

          yp-post-cover-media {
            width: 304px !important;
            height: 168px !important;
          }
        }

        .groupTitle {
          font-size: 15px;
          padding-top: 8px;
          color: #777;
        }

        .hasPointer {
          cursor: pointer;
        }
      `,
    ];
  }

  //TODO: Check jucy-html below
  render() {
    return html`
      ${this.activity && this.activity.Post
        ? html`
            <div class="layout vertical hasPointer" @click="${this._goToPost}">
              <div class="actionInfo">${this.t('addedAnIdea')}</div>
              <div class="layout horizontal center-center">
                <yp-post-cover-media
                  .post="${this.activity.Post!}"
                ></yp-post-cover-media>
              </div>
              <div class="layout vertical center-center">
                <yp-magic-text
                  class="post-name mainContainerItem"
                  is-ie11="${this.isIE11}"
                  textOnly
                  textType="postName"
                  .contentLanguage="${this.activity.Post.language}"
                  .content="${this.activity.Post!.name}"
                  .contentId="${this.activity.Post!.id}"
                >
                </yp-magic-text>
              </div>
              <div class="layout vertical center-center descriptionOuter">
                <div
                  id="description"
                  class="description mainContainerItem"
                  is-ie11="${this.isIE11}"
                >
                  <yp-magic-text
                    id="description"
                    text-type="postContent"
                    .contentLanguage="${this.activity.Post.language}"
                    .content="${this.structuredAnswersFormatted}"
                    ?noUserInfo="${!this.activity.Post.Group.configuration
                      .showWhoPostedPosts}"
                    simpleFormat
                    skipSanitize
                    .contentId="${this.activity.Post.id}"
                    class="description"
                    .truncate="${this.activity.Post.Group.configuration
                      .descriptionTruncateAmount}"
                    .moreText="${this.t('readMore')}"
                    .closeDialogText="${this.t('close')}"
                  >
                  </yp-magic-text>
                </div>

                ${this.hasGroupHeader
                  ? html`
                      <div class="groupTitle layout horizontal center-center">
                        ${this.groupTitle}
                      </div>
                    `
                  : html``}
              </div>
            </div>
          `
        : html``}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.post = this.activity.Post;
  }

  _goToPost() {
    if (this.activity.Post && !this.postId) {
      YpNavHelpers.goToPost(this.activity.Post.id, undefined, this.activity);
    }
  }

  get isIE11() {
    return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
  }
}
