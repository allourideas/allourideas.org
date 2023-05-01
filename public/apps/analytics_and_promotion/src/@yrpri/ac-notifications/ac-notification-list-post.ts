import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';


import '@material/mwc-icon';

import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import { truncateNameList } from './TruncateNameList.js';

@customElement('ac-notification-list-post')
export class AcNotificationListPost extends YpBaseElement {
  @property({ type: Object })
  notification: AcNotificationData | undefined;

  @property({ type: String })
  endorsementsText: string | undefined;

  @property({ type: String })
  oppositionsText: string | undefined;

  @property({ type: Boolean })
  newPostMode: boolean | undefined;

  @property({ type: Boolean })
  endorseMode: boolean | undefined;

  @property({ type: String })
  userName: string | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

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

        .bulb-icon {
          min-width: 26px;
          min-height: 26px;
          max-width: 26px;
          max-height: 26px;
          margin: 6px;
        }

        .bulb-icon[new-post] {
          color: var(--accent-color);
          min-width: 30px;
          min-height: 30px;
          max-width: 30px;
          max-height: 30px;
        }

        .smallIcons {
          max-width: 16px;
          max-height: 16px;
          min-width: 16px;
          min-height: 16px;
          padding-top: 2px;
          padding-right: 4px;
          color: var(--primary-love-color-up, rgba(168, 0, 0, 0.65));
        }

        .postName {
          padding-top: 4px;
        }

        .postName {
          padding-top: 4px;
          padding-bottom: 0;
          color: #111;
        }

        .userName {
          font-style: bold;
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
    return this.post
      ? html`
          <div
            class="layout vertical pointerCursor"
            @click="${this._goToPost}"
            ?hidden="${!this.post}">
            <div class="layout horizontal">
              <div
                class="layout vertical center-center self-start leftContainer">
                ${this.user
                  ? html`
                      <yp-user-image small .user="${this.user}"></yp-user-image>
                    `
                  : nothing}
                <mwc-icon .newPost="${this.newPostMode}" class="bulb-icon"
                  >lightbulb_outline</mwc-icon
                >
              </div>
              <div class="layout vertical">
                <div ?hidden="${!this.endorsementsText}">
                  <div class="layout horizontal">
                    <mwc-icon class="smallIcons endorsers">favorite</mwc-icon>
                    <div class="endorsers">${this.endorsementsText}</div>
                  </div>
                </div>
                <div ?hidden="${!this.oppositionsText}">
                  <div class="layout horizontal">
                    <mwc-icon class="smallIcons opposers"
                      >do_not_disturb</mwc-icon
                    >
                    <div class="opposers">${this.oppositionsText}</div>
                  </div>
                </div>
                <div class="postName">
                  <yp-magic-text
                    class="postName"
                    textOnly
                    textType="postName"
                    .contentLanguage="${this.post.language}"
                    .content="${this.post.name}"
                    .contentId="${this.post.id}">
                  </yp-magic-text>
                </div>
                <div ?hidden="${!this.newPostMode}" class="userName">
                  ${this.userName}
                </div>
              </div>
            </div>
          </div>
        `
      : nothing;
  }

  _goToPost() {
    if (this.post) {
      const postUrl = '/post/' + this.post.id;
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
      this.userName = this.notification.AcActivities[0].User.name;
      this.user = this.notification.AcActivities[0].User;
      if (this.notification.type == 'notification.post.new') {
        this.newPostMode = true;
      } else if (this.notification.type == 'notification.post.endorsement') {
        this.endorseMode = true;
        this.newPostMode = false;
        this._createEndorsementStrings();
      }
    } else {
      this.endorsementsText = undefined;
      this.oppositionsText = undefined;
      this.newPostMode = undefined;
      this.endorseMode = undefined;
      this.userName = undefined;
      this.user = undefined;
    }
  }

  _createEndorsementStrings() {
    let endorsements = '';
    let oppositions = '';

    this.notification!.AcActivities.forEach(activity => {
      if (activity.type == 'activity.post.endorsement.new') {
        if (!endorsements) {
          endorsements = '';
        }
        endorsements = this._addWithComma(endorsements, activity.User.name);
      } else if (activity.type == 'activity.post.opposition.new') {
        if (!oppositions) {
          oppositions = '';
        }
        oppositions = this._addWithComma(oppositions, activity.User.name);
      }
    });

    if (endorsements && endorsements != '') {
      this.endorsementsText = truncateNameList(endorsements);
    }

    if (oppositions && oppositions != '') {
      this.oppositionsText = truncateNameList(oppositions);
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
