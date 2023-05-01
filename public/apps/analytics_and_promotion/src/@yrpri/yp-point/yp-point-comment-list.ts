import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import '../common/yp-image.js';

import '@material/mwc-icon-button';

import './yp-point-comment.js';
import './yp-point-comment-edit.js';
import { RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';
import { LitVirtualizer } from '@lit-labs/virtualizer';
import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow';


@customElement('yp-point-comment-list')
export class YpPointCommentList extends YpBaseElement {
  @property({ type: Array })
  comments: Array<YpPointData> | undefined;

  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: Object })
  image: YpImageData | undefined;

  @property({ type: Boolean })
  open = false;

  @property({ type: Boolean })
  loadingList = false;

  @property({ type: Boolean })
  disableOpenClose = false;

  @property({ type: Number })
  commentsCount: number | undefined;

  @property({ type: String })
  commentType: 'points' | 'images' | undefined;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('point')) {
      this._pointChanged();
    }

    if (changedProperties.has('image')) {
      this._imageChanged();
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
        }

        yp-point-comment-edit {
        }

        .lit-virtualizer {
          max-height: 500px;
          width: 550px;
          --lit-virtualizer-items-container: {
          }
        }

        .listContainer {
          padding-top: 24px;
          height: 100%;
          width: 100%;
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

        @media (max-width: 520px) {
          lit-virtualizer {
            width: 420px;
          }
        }

        @media (max-width: 450px) {
          lit-virtualizer {
            width: 318px;
          }
        }

        @media (max-width: 359px) {
          lit-virtualizer {
            width: 307px;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  renderComment(comment: YpPointData, index: number) {
    return html` <yp-point-comment
      .point="${comment}"
      .tabindex="${index}"></yp-point-comment>`;
  }

  render() {
    return html`
      <div class="container layout vertical">
        <div
          class="layout horizontal start-justified"
          ?hidden="${this.disableOpenClose}">
          <div
            class="layout horizontal center-center"
            ?hidden="${!this.commentsCount}">
            <div class="commentText">${this.t('point.comments')}</div>
            <div id="commentCount">${this.commentsCount}</div>
          </div>
          <div
            class="layout horizontal center-center"
            ?hidden="${this.noComments}">
            <div class="commentText">${this.t('noComments')}</div>
          </div>
          <div class="layout horizontal">
            <mwc-icon-button
              .label="${this.t('openComments')}"
              class="openCloseButton"
              icon="keyboard_arrow_right"
              @click="${this.setOpen}"
              ?hidden="${this.open}"></mwc-icon-button>
            <mwc-icon-button
              .label="${this.t('closeComments')}"
              class="openCloseButton"
              icon="keyboard_arrow_down"
              @click="${this.setClosed}"
              ?hidden="${!this.open}"></mwc-icon-button>
          </div>
        </div>

        ${
          this.open && this.comments
            ? html`
              <div class="layout vertical listContainer">
                <lit-virtualizer
                  .items=${this.comments}
                  .scrollTarget="${window}"
                  .renderItem=${this.renderComment}
                  @rangeChanged=${this.scrollEvent}></lit-virtualizer>

                <yp-point-comment-edit
                  @refresh="${this.refresh}"
                  .point="${this.point}"
                  .image="${this.image}"></yp-point-comment-edit>
              </div>
            `
          : html``
        }
        </div>
      </div>
    `;
  }

  scrollEvent(event: RangeChangedEvent) {
    if (
      this.comments &&
      //      !this.moreFromScrollTriggerActive &&
      event.last != -1 &&
      event.last < this.comments.length &&
      event.last + 5 >= this.comments.length
    ) {
      //      this.moreFromScrollTriggerActive = true;
      //      this._loadMoreData();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-point-deleted', this.refresh);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-point-deleted', this.refresh);
  }

  _openChanged() {
    if (this.open && (this.point || this.image)) {
      this.refresh();
    }
  }

  get noComments() {
    return !(this.commentsCount == 0);
  }

  setOpen() {
    this.open = true;
    setTimeout(() => {
      this.fire('iron-resize');
    }, 20);
  }

  setClosed() {
    this.open = false;
    setTimeout(() => {
      this.fire('iron-resize');
    }, 20);
  }

  _pointChanged() {
    this.comments = [];
    this.commentsCount = undefined;
    if (this.point) {
      this.commentType = 'points';
      this.refresh();
    }
  }

  refresh() {
    this._getComments();
    this._getCommentsCount();
  }

  _imageChanged() {
    if (this.image) {
      this.commentType = 'images';
      this.refresh();
    }
  }

  get hasContent() {
    return this.point || this.image
  }

  async _getComments() {
    if (this.hasContent && this.commentType) {
      const comment = await window.serverApi.getComments(
        this.commentType,
        this.point ? this.point.id : this.image!.id
      );
      this.comments = comment;
      if (comment && comment.length > 0) {
        //TODO: Fix this
        //this.$$('#list').scrollToIndex(comment.length - 1);
      }
      setTimeout(() => {
        //TODO: Do we need this
        //this.$$('#list').fire('iron-resize');
      });
    }
  }

  async _getCommentsCount() {
    if (this.hasContent && this.commentType) {
      const response = await window.serverApi.getCommentsCount(
        this.commentType,
        this.point ? this.point.id : this.image!.id
      ) as YpCommentCountsResponse

      this.commentsCount = response.count
      this.fire('yp-set-comments-count', { count: this.commentsCount });
    } else {
      console.error('No point for comment count');
    }
  }
}
