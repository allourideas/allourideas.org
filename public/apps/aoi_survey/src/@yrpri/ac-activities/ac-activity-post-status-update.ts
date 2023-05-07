import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import '../yp-magic-text/yp-magic-text.js';

@customElement('ac-activity-post-status-update')
export class AcActivityPostStatusUpdate extends YpBaseElement {
  @property({ type: Object })
  activity!: AcActivityData;

  static get styles() {
    return [
      super.styles,
      css`
        .statusChange {
          padding-left: 32px;
          padding-right: 32px;
          margin-bottom: 64px;
          font-size: 16px;
          overflow-y: auto;
          max-height: 360px;
        }

        .postName {
          padding-left: 32px;
          padding-right: 32px;
          font-weight: bold;
          font-size: 19px;
          margin-bottom: 8px;
          color: #444;
          cursor: pointer;
        }

        .groupName {
          padding-left: 32px;
          padding: 16px;
          font-size: 14px;
          padding-bottom: 8px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical">
        <div class="groupName">
          ${this.activity.Group!.name}
        </div>
        <yp-magic-text
          @click="${this._goToPost}"
          class="postName"
          textOnly
          textType="postName"
          .contentLanguage="${this.activity.Post!.language}"
          .content="${this.activity.Post!.name}"
          .contentId="${this.activity.Post!.id}">
        </yp-magic-text>
        <yp-magic-text
          id="statusChange"
          class="statusChange"
          .extraId="${this.activity.Post!.id}"
          textType="statusChangeContent"
          .contentLanguage="${this.activity.PostStatusChange!.language}"
          simpleFormat
          .content="${this.statusContent}"
          .contentId="${this.activity.PostStatusChange!.id}">
        </yp-magic-text>
      </div>
    `;
  }

  _goToPost() {
    if (this.activity.Post) {
      YpNavHelpers.goToPost(this.activity.Post.id, undefined, this.activity);
    }
  }

  get statusContent() {
    if (
      this.activity &&
      this.activity.PostStatusChange &&
      this.activity.PostStatusChange.content
    ) {
      return this.activity.PostStatusChange.content;
    }
  }
}
