import { stylesFromModule } from '@polymer/polymer/lib/utils/style-gather';
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';

import '../yp-magic-text/yp-magic-text.js';
import '@material/web/icon/icon.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { YpMagicText } from '../yp-magic-text/yp-magic-text.js';

@customElement('yp-post-tags')
export class YpPostTags extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: String })
  translatedTags: string | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .tagContainer {
          max-width: 480px;
          font-size: 14px;
          margin-left: 8px;
          vertical-align: middle;
          padding-left: 16px;
          color: var(--app-tags-text-color, #111) !important;
          font-weight: var(--app-tags-font-weight, 500);
        }

        .middleDot {
          padding-left: 2px;
          padding-right: 2px;
          vertical-align: middle;
          color: var(--app-tags-color, #656565);
        }

        .tagItem {
          vertical-align: middle;
        }

        @media (max-width: 800px) {
          .middleDot {
            font-size: 14px;
            margin-bottom: 8px;
          }

          .tagContainer {
            font-size: 17px;
            padding-left: 16px;
            padding-right: 16px;
            padding-bottom: 16px;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="tagContainer wrap">
        ${this.postTags.map(
          (item, index) => html`
            <span class="tagItem">${this._trimmedItem(item)}</span
            ><span
              class="middleDot"
              ?hidden="${this.computeSpanHidden(this.postTags, index)}"
              >&#9679;</span
            >
          `
        )}
      </div>

      <yp-magic-text
        id="postTagsTranslations"
        hidden
        content-id="${this.post.id}"
        text-only
        content="${ifDefined(this.post.public_data?.tags)}"
        content-language="${ifDefined(this.post.language)}"
        @new-translation="${this._newTranslation}"
        text-type="postTags"
      >
      </yp-magic-text>
    `;
  }

  _trimmedItem(item: string) {
    if (item) {
      return item.trim();
    } else {
      return '';
    }
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
  }

  computeSpanHidden(items: Array<string>, index: number) {
    return items.length - 1 === index;
  }

  _newTranslation() {
    setTimeout(() => {
      const tagsTranslation = this.$$('#postTagsTranslations') as YpMagicText;
      if (tagsTranslation && tagsTranslation.finalContent) {
        this.translatedTags = tagsTranslation.finalContent;
      }
    });
  }

  get postTags() {
    if (this.translatedTags && this.autoTranslate) {
      return this.translatedTags.split(',');
    } else if (
      this.post &&
      this.post.public_data &&
      this.post.public_data.tags
    ) {
      return this.post.public_data.tags.split(',');
    } else {
      return [];
    }
  }
}
