import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import '../yp-post/yp-post-cover-media.js';
import { ShadowStyles } from '../common/ShadowStyles.js';

@customElement('ac-activity-recommended-posts')
export class AcActivityRecommendedPosts extends YpBaseElement {
  @property({ type: Array })
  recommendedPosts: Array<YpPostData> | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .container {
          width: 220px;
          height: 100% !important;
        }

        .descriptionOuter {
          color: var(--primary-color-more-darker, #424242);
          margin: 0;
          padding-left: 16px;
          padding-right: 16px;
        }

        .description,
        .post-name {
          padding-left: 16px;
          padding-right: 16px;
        }

        .post-name {
          font-size: 15px;
          padding: 16px;
          margin: 0;
          background-color: #fff;
          color: #333;
          text-align: center;
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
          width: 220px;
          height: 124px;
        }

        .postCard {
          width: 200px;
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

        @media (max-width: 420px) {
          .description {
            width: 290px;
          }

          yp-post-cover-media {
            width: 304px !important;
            height: 168px !important;
          }
        }

        .postContainer {
          margin-bottom: 16px;
          margin-left: 16px;
          margin-right: 16px;
          max-width: 220px;
          width: 220px;
        }

        .postItem {
          background-color: #fff !important;
        }

        .headerText {
          font-size: 20px;
          margin: 16px;
          max-width: 220px;
          padding-top: 8px;
          padding-bottom: 8px;
          width: 220px;
          color: #fff;
          background-color: var(--primary-color-700);
        }
      `,
    ];
  }

  render() {
    return this.recommendedPosts
      ? html`
          <div class="headerText layout horizontal center-center">
            ${this.t('recommendedPosts')}
          </div>

          ${this.recommendedPosts!.map(
            post => html`
              <div class="postContainer">
                <div class="shadow-elevation-2dp shadow-transition postItem">
                  <div
                    class="layout vertical postItem"
                    @click="${() => {
                      YpNavHelpers.goToPost(post.id);
                    }}"
                  >
                    <div class="layout horizontal">
                      <yp-post-cover-media
                        tiny
                        .post="${post}"
                      ></yp-post-cover-media>
                    </div>
                    <div class="post-name layout horizontal center-center">
                      ${post.name}
                    </div>
                  </div>
                </div>
              </div>
            `
          )}
        `
      : nothing;
  }
}
