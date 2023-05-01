import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/mwc-icon-button';
import '../common/yp-image.js';
import '../yp-point/yp-point-comment-list.js';

import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import { YpApiActionDialog } from '../yp-api-action-dialog/yp-api-action-dialog.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpPostUserImageEdit } from './yp-post-user-image-edit.js';

@customElement('yp-post-user-image-card')
export class YpPostUserImageCard extends YpBaseElement {
  @property({ type: Object })
  image!: YpImageData;

  @property({ type: Object })
  post!: YpPostData;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .description {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 16px;
          color: #444;
        }

        .photographer {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 8px;
          color: #aaa;
        }

        .material {
          width: 800px;
          height: 100%;
          background-color: #fff;
          padding: 0;
        }

        yp-image {
          width: 800px;
          height: 600px;
        }

        @media (max-width: 800px) {
          yp-image {
            width: 600px;
            height: 450px;
          }

          .material {
            width: 600px;
          }
        }

        @media (max-width: 620px) {
          yp-image {
            width: 400px;
            height: 300px;
          }
          .material {
            width: 400px;
          }
        }

        @media (max-width: 420px) {
          yp-image {
            width: 320px;
            height: 240px;
          }
          .material {
            width: 320px;
          }

          .commentsList {
            margin-left: 16px;
          }
        }

        .commentsList {
          margin-left: 32px;
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
        class="material layout vertical shadow-elevation-2dp shadow-transition">
        <yp-image
          .alt="${this.image.description}"
          sizing="cover"
          src="${this.imageUrl}"></yp-image>
        <div class="description">
          ${this.image.description}
        </div>
        <div class="layout horizontal" style="width: 100%;">
          <div class="photographer">
            ${this.image.photographer_name}
          </div>
          <div
            class="editMenu layout horizontal flex end-justified"
            ?hidden="${!YpAccessHelpers.hasImageAccess(this.image, this.post)}">
            <mwc-icon-button
              .abel="${this.t('edit')}"
              icon="create"
              @click="${this._openEdit}"></mwc-icon-button>
            <mwc-icon-button
              .label="${this.t('delete')}"
              icon="clear"
              @click="${this._openDelete}"></mwc-icon-button>
          </div>
        </div>
        <yp-point-comment-list
          class="commentsList"
          .image="${this.image}"></yp-point-comment-list>
      </div>
    `;
  }

  _openEdit() {
    window.appGlobals.activity('open', 'userImage.edit');
    window.appDialogs.getDialogAsync("userImageEdit",  (dialog: YpPostUserImageEdit) => {
      dialog.setup(this.post, this.image, false, this._refresh.bind(this));
      dialog.open(false, { postId: this.post.id, userImages: true });
    });
  }

  _openDelete() {
    window.appGlobals.activity('open', 'userImage.delete');
    window.appDialogs.getDialogAsync(
      'apiActionDialog',
      (dialog: YpApiActionDialog) => {
        dialog.setup(
          '/api/images/' + this.post.id + '/' + this.image.id + '/user_images',
          this.t('userImage.deleteConfirmation'),
          this._refresh.bind(this)
        );
        dialog.open();
      }
    );
  }

  _refresh() {
    this.fire('refresh');
  }

  get imageUrl() {
    return YpMediaHelpers.getImageFormatUrl([this.image], 0);
  }
}
