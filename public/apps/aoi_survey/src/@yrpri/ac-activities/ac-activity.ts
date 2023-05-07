import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { DateTime } from 'luxon';

import './ac-activity-point.js';
import './ac-activity-post.js';
import './ac-activity-point-news-story.js';
import './ac-activity-post-status-update.js';
import '../yp-user/yp-user-with-organization.js';
import '@material/web/button/outlined-button.js';

import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';

import { YpAccessHelpers } from '../common/YpAccessHelpers.js';

import { ShadowStyles } from '../common/ShadowStyles.js';

@customElement('ac-activity')
export class AcActivity extends YpBaseElementWithLogin {
  @property({ type: Object })
  activity: AcActivityData | undefined;

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  postId: number | undefined;

  @property({ type: Number })
  postGroupId: number | undefined;

  @property({ type: Number })
  userId: number | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .activity {
          margin: 16px;
          background-color: #fff;
          height: 100%;
          padding-left: 16px;
          padding-right: 16px;
          margin-bottom: 0;
        }

        @media (max-width: 600px) {
          .activity {
            width: 100%;
            height: 100%;

            margin: 0;
            padding-left: 16px;
            padding-right: 16px;
            margin-bottom: 8px;
            margin-top: 8px;
            width: -webkit-calc(100% - 8px);
            width: -moz-calc(100% - 8px);
            width: calc(100% - 8px);
          }

          .activity[logged-in-user] {
            margin-left: 0;
            width: -webkit-calc(100% - 16px);
            width: -moz-calc(100% - 16px);
            width: calc(100% - 16px);
          }
        }

        .aaaactivity[is-old-safari-or-ie] {
          height: 550px;
          overflow: auto;
        }

        .mainActivityContent {
          height: 100% !important;
        }

        ac-activity-header {
        }

        ac-activity-post {
          width: 100%;
        }

        .headerUserImage {
          padding-top: 16px;
        }

        h1 {
          font-size: 24px;
        }

        md-outlined-button {
          color: var(--accent-color);
        }

        md-icon {
          width: 48px;
          height: 48px;
          padding-top: 14px;
        }

        .createdAt {
          color: #777;
          margin-top: 16px;
          font-size: 14px;
        }

        yp-ajax {
          background-color: var(--primary-background-color);
        }

        .deleteIcon {
          position: absolute;
          right: 8px;
          bottom: 8px;
          color: #ddd;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  renderActivity() {
    switch (this.activity!.type) {
      case 'activity.post.new':
        return html`
          <ac-activity-post
            .activity="${this.activity}"
            .postId="${this.postId}"
            .communityId="${this.communityId}"
            .groupId="${this.groupId}"></ac-activity-post>
        `;
      case 'activity.point.new':
        return html`
          <ac-activity-point
            .postId="${this.postId}"
            .activity="${this.activity}"></ac-activity-point>
        `;
      case 'activity.point.newsStory.new':
        return html`
          <ac-activity-point-news-story
            .activity="${this.activity}"
            .postId="${this.postId}"
            .communityId="${this.communityId}"
            .groupId="${this.groupId}"></ac-activity-point-news-story>
        `;
      case 'activity.post.status.change':
        return html`
          <ac-activity-post-status-update
            .postId="${this.postId}"
            .activity="${this.activity}"></ac-activity-post-status-update>
        `;
      default:
        return nothing;
    }
  }

  render() {
    return this.activity
      ? html`
          <div
            .loggedInUser="${this.isLoggedIn}"
            class="layout vertical activity"
            tabindex="${this.tabIndex}">
            <md-outlined-icon-button
              .label="${this.t('deleteActivity')}"
              ?hidden="${!this.hasActivityAccess}"
              icon="delete"
              data-args="${this.activity.id}"
              class="deleteIcon"
              @click="${this._deleteActivity}"></md-outlined-icon-button>
            <div class="mainActivityContent">
              <div class="layout horizontal">
                <yp-user-with-organization
                  .user="${this.activity.User}"
                  inverted></yp-user-with-organization>
                <div class="flex"></div>
                <div
                  ?hidden="${!this.wide}"
                  class="createdAt"
                  .title="${this.fromLongTime(this.activity.created_at)}">
                  ${this.fromTime(this.activity.created_at)}
                </div>
              </div>

              ${this.renderActivity()}
            </div>
          </div>
        `
      : nothing;
  }

  fromTime(timeValue: string) {
    return DateTime.fromISO(timeValue).toRelative();
  }

  fromLongTime(timeValue: string) {
    return DateTime.fromISO(timeValue).toLocaleString(DateTime.DATETIME_FULL);
  }

  get hasActivityAccess() {
    if (this.activity) {
      if (this.domainId && this.activity.Domain) {
        return YpAccessHelpers.checkDomainAccess(this.activity.Domain);
      } else if (this.communityId && this.activity.Community) {
        return YpAccessHelpers.checkCommunityAccess(this.activity.Community);
      } else if (this.groupId && this.activity.Group) {
        return YpAccessHelpers.checkGroupAccess(this.activity.Group);
      } else if (this.postId && this.activity.Post) {
        return YpAccessHelpers.checkPostAccess(this.activity.Post);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  _deleteActivity() {
    this.fire('ak-delete-activity', { id: this.activity!.id });
  }

  _isNotActivityType(activity: AcActivityData, type: string) {
    return activity.type != type;
  }

  _isActivityType(activity: AcActivityData, type: string) {
    return activity.type == type;
  }
}
