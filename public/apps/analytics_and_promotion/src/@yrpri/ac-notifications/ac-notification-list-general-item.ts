import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';


import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';

@customElement('ac-notification-list-general-item')
export class AcNotificationListGenaralItem extends YpBaseElement {
  @property({ type: Object })
  notification: AcNotificationData | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: String })
  icon: string | undefined;

  @property({ type: String })
  shortText: string | undefined;

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

        .icon {
          min-width: 24px;
          min-height: 24px;
          max-width: 24px;
          max-height: 24px;
          margin: 6px;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .name {
          padding-top: 4px;
          padding-bottom: 0;
          font-style: italic;
          color: #777;
        }

        .shortText {
          padding-right: 8px;
          color: #444;
          padding-bottom: 4px;
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
      <div class="layout vertical pointerCursor" @click="${this._goTo}">
        <div class="layout horizontal">
          <div class="layout vertical center-center self-start leftContainer">
            <yp-user-image small .user="${this.user!}"></yp-user-image>
            <mwc-icon class="icon">${this.icon}</mwc-icon>
          </div>
          <div class="layout vertical">
            <div class="name">${this.nameTruncated}</div>
            <div ?hidden="${!this.shortText}" class="shortText">
              ${this.shortTextTruncated}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _goTo() {
    let gotoLocation;
    if (this.post) {
      this.goToPost();
    } else if (this.notification) {
      if (
        this.notification.AcActivities[0].Group &&
        this.notification.AcActivities[0].Group.name !=
          'hidden_public_group_for_domain_level_points'
      ) {
        gotoLocation =
          '/group/' +
          this.notification.AcActivities[0].Group.id +
          '/news/' +
          this.notification.AcActivities[0].id;
      } else if (this.notification.AcActivities[0].Community) {
        gotoLocation =
          '/community/' +
          this.notification.AcActivities[0].Community.id +
          '/news/' +
          this.notification.AcActivities[0].id;
      } else if (this.notification.AcActivities[0].Domain) {
        gotoLocation =
          '/domain/' +
          this.notification.AcActivities[0].Domain.id +
          '/news/' +
          this.notification.AcActivities[0].id;
      }
      if (gotoLocation) {
        YpNavHelpers.redirectTo(gotoLocation);
      }
    }
  }

  get nameTruncated() {
    const notification = this.notification!;
    if (notification.AcActivities[0].Post) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Post.name,
        42
      );
    } else if (
      notification.AcActivities[0].Group &&
      notification.AcActivities[0].Group.name !=
        'hidden_public_group_for_domain_level_points'
    ) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Group.name,
        42
      );
    } else if (notification.AcActivities[0].Community) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Community.name,
        42
      );
    } else if (notification.AcActivities[0].Domain) {
      return YpFormattingHelpers.truncate(
        notification.AcActivities[0].Domain.name,
        42
      );
    }
  }

  get shortTextTruncated() {
    if (this.shortText) {
      return YpFormattingHelpers.truncate(this.shortText, 60);
    } else {
      return '';
    }
  }

  goToPost() {
    if (this.post) {
      const postUrl = '/post/' + this.post.id + '/news';
      window.appGlobals.activity('open', 'post', postUrl);
      setTimeout(() => {
        YpNavHelpers.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  _notificationChanged() {
    if (this.notification) {
      this.post = this.notification.AcActivities[0].Post;
      this.user = this.notification.AcActivities[0].User;
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
