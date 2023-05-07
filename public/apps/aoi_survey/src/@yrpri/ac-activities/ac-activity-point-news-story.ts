import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { AcActivityWithGroupBase } from './ac-activity-with-group-base.js';

import '../yp-magic-text/yp-magic-text.js';
//import '../yp-point/yp-point-news-story.js';


@customElement('ac-activity-point-news-story')
export class AcActivityPointNewsStory extends AcActivityWithGroupBase {
  static get styles() {
    return [
      super.styles,
      css`
        .newsStoryContainer {
          padding-left: 8px;
          padding-right: 8px;
        }

        .postName {
          cursor: pointer;
          margin-top: 16px;
          padding-left: 8px;
          padding-right: 8px;
          color: #555;
        }

        .groupTitle {
          font-size: 15px;
          color: #777;
          padding-bottom: 16px;
          margin: 0;
          padding-top: 0;
        }

        .hasPointer {
          cursor: pointer;
        }

        .mainContainer {
          width: auto;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical mainContainer">
        ${this.activity.Post
          ? html`
              <yp-magic-text
                @click="${this._goToPost}"
                class="postName"
                ?hidden="${!this.activity.Post.name}"
                textOnly
                textType="postName"
                .contentLanguage="${this.activity.Post.language}"
                .content="${this.activity.Post.name}"
                .contentId="${this.activity.Post.id}">
              </yp-magic-text>
            `
          : nothing}
        <div class="layout vertical center-center newsStoryContainer">
          <yp-point-news-story
            withComments
            hideUser
            class="card"
            .point="${this.activity.Point}"></yp-point-news-story>
        </div>

        ${this.hasGroupHeader
          ? html`
              <div class="groupTitle layout horizontal center-center">
                ${this.groupTitle}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  _goToPost() {
    YpNavHelpers.goToPost(this.activity.Post!.id, undefined, this.activity);
  }

  get hidePostName() {
    return this.postId != null;
  }
}
