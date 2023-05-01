import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/mwc-icon';

import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';

@customElement('ac-notification-list-point')
export class AcNotificationListPoint extends YpBaseElement {
  @property({ type: Object })
  notification: AcNotificationData | undefined;

  @property({ type: String })
  helpfulsText: string | undefined;

  @property({ type: String })
  unhelpfulsText: string | undefined;

  @property({ type: Boolean })
  newPointMode: boolean | undefined;

  @property({ type: Boolean })
  qualityMode: boolean | undefined;

  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: String })
  pointContent: string | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: String })
  postName: string | undefined;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('notification')) {
      this._notificationChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        .pointerCursor {
          cursor: pointer;
        }

        .endorsers {
        }

        .opposers {
        }

        .chatIcon {
          min-width: 24px;
          min-height: 24px;
          max-width: 24px;
          max-height: 24px;
          margin: 6px;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .thumbsIcon {
          color: #999;
          margin-top: 0;
          padding-top: 0;
          min-width: 20px;
          min-height: 20px;
          max-width: 20px;
          max-height: 20px;
        }

        .smallIcons {
          max-width: 16px;
          max-height: 16px;
          min-width: 16px;
          min-height: 16px;
          padding-top: 2px;
          padding-right: 2px;
        }

        .postName {
          padding-top: 4px;
          padding-bottom: 0;
          font-style: italic;
          color: #777;
        }

        .postName[point-value-up] {
        }

        .pointContent {
          padding-bottom: 4px;
          color: #444;
        }

        .pointContent[point-value-up] {
        }

        .leftContainer {
          margin-right: 8px;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="layout vertical pointerCursor"
        @click="${this.goToPost}"
        ?hidden="${!this.post}">
        <div class="layout horizontal">
          <div class="layout vertical center-center self-start leftContainer">
            ${this.user
              ? html`
                  <yp-user-image small .user="${this.user}"></yp-user-image>
                `
              : nothing}
            <mwc-icon class="chatIcon">chat_bubble_outline</mwc-icon>
            <div ?hidden="${!this.pointValueUp}">
              <mwc-icon class="chatIcon thumbsIcon">thumb_up</mwc-icon>
            </div>
            <div ?hidden="${this.pointValueUp}">
              <mwc-icon class="chatIcon thumbsIcon">thumb_down</mwc-icon>
            </div>
          </div>
          <div class="layout vertical">
            <div
              .pointValueUp="${this.pointValueUp}"
              class="layout horizontal pointContent">
              ${this.pointContent}
            </div>
            <div class="layout horizontal" ?hidden="${!this.helpfulsText}">
              <mwc-icon class="smallIcons endorsers">arrow_upward</mwc-icon>
              <div class="endorsers">${this.helpfulsText}</div>
            </div>
            <div class="layout horizontal" ?hidden="${!this.unhelpfulsText}">
              <mwc-icon class="smallIcons opposers">arrow_downward</mwc-icon>
              <div class="opposers">${this.unhelpfulsText}</div>
            </div>
            <div class="postName">${this.postNameTruncated}</div>
          </div>
        </div>
      </div>
    `;
  }

  get postNameTruncated() {
    if (this.postName) {
      return YpFormattingHelpers.truncate(this.postName, 42);
    } else {
      return '';
    }
  }

  get pointValueUp() {
    return this.point && this.point.value > 0;
  }

  goToPost() {
    if (this.post) {
      let postUrl = '/post/' + this.post.id;
      if (this.point) {
        postUrl += '/' + this.point.id;
      }
      window.appGlobals.activity('open', 'post', postUrl);
      setTimeout(() => {
        YpNavHelpers.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  _notificationChanged() {
    if (this.notification) {
      this.point = this.notification.AcActivities[0].Point;
      this.post = this.notification.AcActivities[0].Post;
      this.user = this.notification.AcActivities[0].User;

      if (this.point) {
        this.pointContent = YpFormattingHelpers.truncate(
          this.point.content,
          72
        );
      }
      if (this.notification.type == 'notification.point.new') {
        this.newPointMode = true;
      } else if (this.notification.type == 'notification.point.quality') {
        this.qualityMode = true;
        this._createQualityStrings();
      }
    } else {
      this.helpfulsText = undefined;
      this.unhelpfulsText = undefined;
      this.newPointMode = undefined;
      this.qualityMode = undefined;
    }
  }

  _createQualityStrings() {
    let helpfuls = '';
    let unhelpfuls = '';

    this.notification!.AcActivities.forEach(activity => {
      if (activity.type == 'activity.point.helpful.new') {
        if (!helpfuls) {
          helpfuls = '';
        }
        helpfuls = this._addWithComma(helpfuls, activity.User.name);
      } else if (activity.type == 'activity.point.unhelpful.new') {
        if (!unhelpfuls) {
          unhelpfuls = '';
        }
        unhelpfuls = this._addWithComma(unhelpfuls, activity.User.name);
      }
    });

    if (helpfuls && helpfuls != '') {
      this.helpfulsText = truncateNameList(helpfuls);
    }

    if (unhelpfuls && unhelpfuls != '') {
      this.unhelpfulsText = truncateNameList(unhelpfuls);
    }
  }

  _addWithComma(text: string, toAdd: string) {
    let returnText = '';
    if (text != '') {
      returnText += text + ',';
    }
    return returnText + toAdd;
  }
}
