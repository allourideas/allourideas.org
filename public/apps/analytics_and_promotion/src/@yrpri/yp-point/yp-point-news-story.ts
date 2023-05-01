import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/mwc-icon-button';
import './yp-point-comment-list.js';
import './yp-point-news-story-embed.js';
import './yp-point-actions.js';
import { YpPointCommentList } from './yp-point-comment-list.js';

@customElement('yp-point-news-story')
export class YpPointNewsStory extends YpBaseElement {
  @property({ type: Object })
  point!: YpPointData;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean })
  withComments = false;

  @property({ type: Boolean })
  open = false;

  @property({ type: Boolean })
  hideUser = false;

  @property({ type: Number })
  commentsCount = 0;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('point')) {
      this._pointChanged();
    }
    if (changedProperties.has('open')) {
      this._openChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          margin-top: 8px;
        }

        .userName {
          color: #777;
        }

        .userName {
          padding-bottom: 4px;
        }

        .story {
          padding-bottom: 12px;
          margin-bottom: 8px;
          padding-top: 8px;
          border-bottom: solid #ddd;
          border-bottom-width: 1px;
          font-size: 19px;
        }

        yp-point-actions {
          padding-top: 8px;
        }

        .container {
        }

        #commentCount {
          font-size: 14px;
        }

        mwc-icon-button.openCloseButton {
          width: 56px;
          height: 56px;
          padding-left: 0;
          margin-left: 0;
        }

        .commentText {
          font-size: 14px;
          text-transform: lowercase;
          padding-right: 6px;
        }

        .withPointer {
          cursor: pointer;
        }

        .newsContainer {
          width: auto;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical newsContainer">
        <yp-magic-text
          id="content"
          class="story"
          textType="pointContent"
          simpleFormat
          truncate="10000"
          .contentLanguage="${this.point.language}"
          .content="${this.point.latestContent}"
          .contentId="${this.point.id}">
        </yp-magic-text>

        <yp-point-news-story-embed
          .embedData="${this.point.embed_data}"></yp-point-news-story-embed>
        <div class="layout horizontal">
          <yp-point-actions
            .point="${this.point}"
            hideSharing></yp-point-actions>
          <div class="layout horizontal start-justified">
            <div
              class="layout horizontal center-center withPointer"
              ?hidden="${!this.commentsCount}"
              @click="${this._setOpenToValue}">
              <div class="commentText">${this.t('point.comments')}</div>
              <div id="commentCount">${this.commentsCount}</div>
            </div>
            <div
              class="layout horizontal center-center withPointer"
              @click="${this._setOpenToValue}"
              ?hidden="${this.noComments}">
              <div class="commentText">${this.t('noComments')}</div>
            </div>
            <div class="layout horizontal">
              <mwc-icon-button
                .label="${this.t('toggleOpenClose')}"
                class="openCloseButton"
                icon="keyboard_arrow_right"
                @click="${this._setOpen}"
                ?hidden="${this.open}">
              </mwc-icon-button>
              <mwc-icon-button
                .label="${this.t('toggleOpenClose')}"
                class="openCloseButton"
                icon="keyboard_arrow_down"
                @click="${this._setClosed}"
                ?hidden="${!this.open}">
              </mwc-icon-button>
            </div>
          </div>
        </div>
        <yp-point-comment-list
          id="commentsList"
          @yp-set-comments-count="${this._setCommentsCount}"
          disableOpenClose
          .point="${this.point}"
          ?hidden="${!this.withComments}"></yp-point-comment-list>
      </div>
    `;
  }

  _setOpenToValue() {
    if (this.open) {
      this._setClosed();
    } else {
      this._setOpen();
    }
  }

  _openChanged() {
    if (this.open) {
      (this.$$('#commentsList') as YpPointCommentList).refresh();
    }
  }

  get noComments() {
    return !(this.commentsCount == 0);
  }

  _setOpen() {
    this.open = true;
    (this.$$('#commentsList') as YpPointCommentList).setOpen();
  }

  _setClosed() {
    this.open = false;
    (this.$$('#commentsList') as YpPointCommentList).setClosed();
  }

  _setCommentsCount(event: CustomEvent) {
    this.commentsCount = event.detail.count;
  }

  _pointChanged() {
    if (this.point && this.point.PointRevisions) {
      this.user = this.point.PointRevisions[0].User;
    } else {
      this.user = undefined;
    }

    this.open = false;
  }

  loginName() {
    return this.point.PointRevisions![0].User.name;
  }
}
