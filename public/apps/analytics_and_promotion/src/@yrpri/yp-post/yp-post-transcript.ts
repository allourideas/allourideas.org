import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

import { YpCollection } from '../yp-collection/yp-collection.js';
import { nothing, html, TemplateResult, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-icon-button';
import '@material/mwc-textarea';
import '@material/mwc-circular-progress-four-color';

import './yp-posts-list.js';
import './yp-post-card-add.js';
import '../common/yp-emoji-selector.js';

import { YpPostsList } from './yp-posts-list.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpPostCard } from './yp-post-card.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
import { YpEmojiSelector } from '../common/yp-emoji-selector.js';

// TODO: Remove
interface AcActivity extends LitElement {
  scrollToItem(item: YpDatabaseItem): () => void;
  loadNewData(): () => void;
}

@customElement('yp-post-transcript')
export class YpPostTranscript extends YpBaseElement {
  @property({ type: Boolean })
  isEditing = false;

  @property({ type: String })
  editText: string | undefined;

  @property({ type: Boolean })
  checkingTranscript = false;

  @property({ type: Boolean })
  checkTranscriptError = false;

  @property({ type: Object })
  post!: YpPostData;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .transcriptContainer {
          width: 420px;
          max-width: 420px;
        }

        @media (max-width: 960px) {
          .transcriptContainer {
            width: 100%;
            max-width: 100%;
          }
        }

        #postTranscriptionEditor {
          padding-left: 8px;
          padding-right: 8px;
        }

        .transcriptError {
          margin-top: 8px;
          margin-bottom: 8px;
          color: #f00;
        }

        .checkTranscript {
          margin-top: 8px;
          padding: 8px;
        }

        .transcriptText {
          margin-top: 0;
          padding: 8px;
          color: #444;
          padding-bottom: 0;
          font-style: italic;
          margin-bottom: 8px;
        }

        .transcriptHeader {
          color: #222;
          margin-bottom: 2px;
          font-style: normal;
        }

        .editIcon {
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="transcriptContainer">
        ${this.checkingTranscript
          ? html`
              <div class="layout vertical center-center checkTranscript">
                <div>${this.t('checkingForTranscript')}</div>
                <mwc-circular-progress-four-color indeterminate></mwc-circular-progress-four-color>
              </div>
            `
          : nothing}

        <div
          class="transcriptError layout horizontal center-center"
          ?hidden="${!this.checkTranscriptError}">
          ${this.t('checkTranscriptError')}
        </div>

        ${this.post.public_data!.transcript!.text
          ? html`
              <div class="transcriptText layout vertical center-center">
                <div
                  class="transcriptHeader"
                  ?hidden="${this.post.public_data!.transcript
                    .noMachineTranslation}">
                  ${this.t('automaticTranscript')}
                  <span
                    ?hidden="${!this.post.public_data!.transcript.userEdited}">
                    (${this.t('edited')})
                  </span>
                </div>
                <div id="postContentTranscript" ?hidden="${this.isEditing}">
                  <yp-magic-text
                    text-type="postTranscriptContent"
                    .contentLanguage="${this.post.public_data!.transcript
                      .language}"
                    .content="${this.post.public_data!.transcript.text}"
                    .contentId="${this.post.id}">
                  </yp-magic-text>
                </div>

                ${this.hasPostAccess
                  ? html`
                      <div
                        class="layout horizontal"
                        ?hidden="${this.isEditing}">
                        <div class="flex"></div>
                        <mwc-icon-button
                          class="editIcon"
                          .title="${this.t('edit')}"
                          icon="create"
                          @click="${this._editPostTranscript}"></mwc-icon-button>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
        ${this.isEditing
          ? html`
              <div class="layout vertical" ?hidden="${!this.hasPostAccess}">
                <mwc-textarea
                  id="postTranscriptionEditor"
                  charCounter
                  maxlength="500"
                  .value="${this.editText ? this.editText : ''}"></mwc-textarea>
                <div class="horizontal end-justified layout">
                  <yp-emoji-selector
                    id="postTranscriptEmojiSelector"></yp-emoji-selector>
                </div>
                <div class="layout horizontal self-end">
                  <mwc-button
                    @click="${this._cancelEdit}"
                    .label="${this.t('cancel')}"></mwc-button>
                  <mwc-button
                    @click="${this._saveEdit}"
                    .label="${this.t('update')}"></mwc-button>
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  _isEditingChanged() {
    this._updateEmojiBindings();
    setTimeout(() => {
      this.fire('iron-resize');
    });
  }

  _updateEmojiBindings() {
    if (this.isEditing) {
      setTimeout(() => {
        const post = this.$$('#postTranscriptionEditor') as HTMLInputElement;
        const emoji = this.$$('#postTranscriptEmojiSelector') as YpEmojiSelector;
        if (post && emoji) {
          emoji.inputTarget = post;
        } else {
          console.error("Wide: Can't bind post edit emojis :(");
        }
      }, 500);
    }
  }

  _cancelEdit() {
    this.isEditing = false;
  }

  async _saveEdit() {
    await window.serverApi.savePostTranscript(this.post.id, {
      content: this.editText,
    });
    this.post.public_data!.transcript.text = this.editText ? this.editText : '';
    this.post.public_data!.transcript.userEdited = true;
    this.isEditing = false;
  }

  _editPostTranscript() {
    if (this.hasPostAccess) {
      this.editText = this.post.public_data!.transcript.text;
      this.isEditing = true;
    }
  }

  async _checkTranscriptStatus() {
    let transcriptType;
    if (this.post.cover_media_type === 'audio') {
      transcriptType = '/audioTranscriptStatus';
    } else if (this.post.cover_media_type === 'video') {
      transcriptType = '/videoTranscriptStatus';
    }

    this.checkingTranscript = true;

    const response = (await window.serverApi.getPostTranscriptStatus(
      this.post.id,
      transcriptType
    )) as YpCheckTranscriptResponse;

    if (response && response.text && this.post) {
      this.post.public_data!.transcript!.text = response.text;
      if (this.hasPostAccess) {
        this.editText = response.text;
        this.isEditing = true;
      }
      this.checkingTranscript = false;
      setTimeout(() => {
        this.fire('iron-resize');
      });
    } else if (response && response.inProgress) {
      setTimeout(() => {
        this._checkTranscriptStatus();
      }, 2000);
    } else if (response && response.error) {
      this.checkingTranscript = false;
      this.checkTranscriptError = true;
    } else {
      this.checkingTranscript = false;
    }
  }

  get hasPostAccess() {
    if (this.post) {
      return YpAccessHelpers.checkPostAccess(this.post);
    } else {
      return false;
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('post')) {
      this._postChanged();
    }

    if (changedProperties.has('isEditing')) {
      this._isEditingChanged();
    }
  }

  _postChanged() {
    this.checkingTranscript = false;
    this.checkTranscriptError = false;
    if (this.post && this.post.description) {
      if (
        this.hasPostAccess &&
        window.appGlobals.hasTranscriptSupport === true
      ) {
        if (
          this.post.public_data &&
          this.post.public_data.transcript &&
          this.post.public_data.transcript.inProgress
        ) {
          this._checkTranscriptStatus();
        }
      }
    }
  }
}
