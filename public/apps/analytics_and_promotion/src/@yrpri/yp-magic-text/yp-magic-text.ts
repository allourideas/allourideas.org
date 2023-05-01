import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkify-html';

import { YpBaseElement } from '../common/yp-base-element.js';

import { twemoji } from '@kano/twemoji/index.es.js';

@customElement('yp-magic-text')
export class YpMagicText extends YpBaseElement {
  @property({ type: String })
  content: string | undefined;

  @property({ type: String })
  truncatedContent: string | undefined;

  @property({ type: Number })
  contentId: number | undefined;

  @property({ type: Number })
  extraId: number | undefined;

  @property({ type: String })
  textType: string | undefined;

  @property({ type: String })
  contentLanguage: string | undefined;

  @property({ type: String })
  processedContent: string | undefined;

  @property({ type: String })
  finalContent: string | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: Number })
  truncate: number | undefined;

  @property({ type: String })
  moreText: string | undefined;

  @property({ type: String })
  closeDialogText: string | undefined;

  @property({ type: Boolean })
  textOnly = false;

  @property({ type: Boolean })
  isDialog = false;

  @property({ type: Boolean })
  disableTranslation = false;

  @property({ type: Boolean })
  simpleFormat = false;

  @property({ type: Boolean })
  skipSanitize = false;

  @property({ type: Boolean })
  removeUrls = false;

  @property({ type: String })
  structuredQuestionsConfig: string | undefined;

  @property({ type: Number })
  linkifyCutoff = 25;

  @property({ type: Boolean, reflect: true })
  widetext = false;

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .container[rtl] {
          direction: rtl;
        }

        .container[more-text] {
        }

        .moreText {
          color: var(--accent-color);
          background-color: #fff;
          margin-top: 8px;
        }

        @media (max-width: 600px) {
          .moreText {
            margin-bottom: 2px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="container layout-center-center layout-vertical"
        ?rlt="${this.rtl}"
        ?more-text="${this.showMoreText}"
      >
        <!-- add max-width for IE11 -->

        ${this.finalContent
          ? html` <div>${unsafeHTML(this.finalContent)}</div> `
          : html` <div>${this.truncatedContent}</div> `}
        ${this.showMoreText && this.moreText
          ? html`
              <mwc-button
                class="moreText"
                @click="${this._openFullScreen}"
                .label="${this.moreText}"
              ></mwc-button>
            `
          : nothing}
      </div>
    `;
  }

  static get doubleWidthLanguages() {
    return ['zh_TW', 'hy'];
  }

  static get cyrillicLanguages() {
    return ['ru', 'ky'];
  }

  static get widerLanguages() {
    return ['uk', 'ky', 'uz', 'ru', 'sr', 'zh_TW', 'hy', 'bg'];
  }

  get showMoreText(): boolean {
    //TODO: Find a more appropiate place for this logic below
    if (!this.isDialog && !this.truncate) {
      this.truncate = 500;
    } else if (this.isDialog) {
      this.truncate = undefined;
    }

    return (
      this.moreText !== undefined &&
      this.content !== undefined &&
      this.truncate !== undefined &&
      this.content.length > this.truncate
    );
  }

  _openFullScreen() {
    //TODO: Fix ts type
    window.appDialogs.getDialogAsync(
      'magicTextDialog',
      (dialog: {
        open: (
          arg0: string | undefined,
          arg1: number | undefined,
          arg2: number | undefined,
          arg3: string | undefined,
          arg4: string | undefined,
          arg5: string | undefined,
          arg6: string | undefined,
          arg7: boolean,
          arg8: boolean
        ) => void;
      }) => {
        dialog.open(
          this.content,
          this.contentId,
          this.extraId,
          this.textType,
          this.contentLanguage,
          this.closeDialogText,
          this.structuredQuestionsConfig,
          this.skipSanitize,
          this.disableTranslation
        );
      }
    );
  }

  subClassProcessing() {
    // For sub classes
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('content')) {
      if (this.content && this.content !== '') {
        this.finalContent = undefined;
        if (window.appGlobals.autoTranslate) {
          this.autoTranslate = window.appGlobals.autoTranslate;
        }
        if (this.autoTranslate && this.truncate) {
          this.truncatedContent = YpMagicText.truncateText(
            YpMagicText.trim(this.content),
            this.truncate
          );
        } else {
          this.truncatedContent = this.content;
        }

        if (
          (this.contentLanguage && this.largeFont) ||
          YpMagicText.widerLanguages.indexOf(this.contentLanguage!) > -1
        ) {
          this.widetext = true;
        } else {
          this.widetext = false;
        }

        this._update();
      } else {
        this.truncatedContent = undefined;
        this.finalContent = undefined;
      }
    }
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
    this._update();
  }

  _languageEvent(event: CustomEvent) {
    super._languageEvent(event);
    this._update();
  }

  get indexKey(): string {
    return `${this.textType}-${this.contentId}-${this.language}`;
  }

  async _startTranslationAndFinalize() {
    if (window.appGlobals.cache.autoTranslateCache[this.indexKey]) {
      this.processedContent = window.appGlobals.cache.autoTranslateCache[
        this.indexKey
      ] as string;
      this._finalize();
    } else {
      if (this.contentId) {
        let url;

        switch (this.textType) {
          case 'postName':
          case 'postContent':
          case 'postTags':
          case 'postTranscriptContent':
            url = '/api/posts/' + this.contentId + '/translatedText';
            break;
          case 'pointContent':
          case 'pointAdminCommentContent':
            url = '/api/points/' + this.contentId + '/translatedText';
            break;
          case 'domainName':
          case 'domainContent':
            url = '/api/domains/' + this.contentId + '/translatedText';
            break;
          case 'customRatingName':
            url =
              '/api/ratings/' +
              this.contentId +
              '/' +
              this.extraId +
              '/translatedText';
            break;
          case 'communityName':
          case 'communityContent':
            url = '/api/communities/' + this.contentId + '/translatedText';
            break;
          case 'alternativeTextForNewIdeaButton':
          case 'alternativeTextForNewIdeaButtonClosed':
          case 'alternativeTextForNewIdeaButtonHeader':
          case 'alternativeTextForNewIdeaSaveButton':
          case 'customThankYouTextNewPosts':
          case 'customTitleQuestionText':
          case 'alternativePointForHeader':
          case 'customAdminCommentsTitle':
          case 'alternativePointAgainstHeader':
          case 'urlToReviewActionText':
          case 'alternativePointForLabel':
          case 'alternativePointAgainstLabel':
          case 'groupName':
          case 'groupContent':
            url = '/api/groups/' + this.contentId + '/translatedText';
            break;
          case 'categoryName':
            url = '/api/categories/' + this.contentId + '/translatedText';
            break;
          case 'statusChangeContent':
            url =
              '/api/posts/' +
              this.extraId +
              '/' +
              this.contentId +
              '/translatedStatusText';
            break;
          default:
            console.error(
              'No valid textType for magic text to translate: ' + this.textType
            );
            return;
        }

        url = `${url}?textType=${this.textType}&contentId=${this.contentId}&targetLanguage=${this.language}`;

        const translation = (await window.serverApi.getTranslation(url)) as
          | YpTranslationTextData
          | undefined;

        this.processedContent = translation?.content;

        if (this.processedContent) {
          window.appGlobals.cache.autoTranslateCache[this.indexKey] =
            this.processedContent;
          this.fire('new-translation');
        } else {
          console.error('No content from translation');
        }
        this._finalize();
      } else {
        console.error('No content id for: ' + this.textType);
        this._finalize();
      }
    }
  }

  _update() {
    this.processedContent = this.content;
    if (this.processedContent) {
      if (
        this.autoTranslate &&
        this.language !== this.contentLanguage &&
        !this.disableTranslation &&
        this.contentLanguage !== '??'
      ) {
        this._startTranslationAndFinalize();
      } else {
        this._finalize();
      }
    }
  }

  _setupStructuredQuestions() {
    if (this.structuredQuestionsConfig) {
      let structuredQuestionsJson;
      try {
        structuredQuestionsJson = JSON.parse(this.structuredQuestionsConfig);
      } catch (error) {
        structuredQuestionsJson = null;
      }

      if (structuredQuestionsJson) {
        // TODO: setup json display
      } else {
        const structuredQuestions = [];
        const questionComponents = this.structuredQuestionsConfig.split(',');
        if (questionComponents && questionComponents.length > 1) {
          for (let i = 0; i < questionComponents.length; i += 2) {
            structuredQuestions.push(questionComponents[i]);
          }
          const regEx = new RegExp(
            '(' + structuredQuestions.join('|') + ')',
            'ig'
          );
          this.processedContent = this.processedContent?.replace(
            regEx,
            '<b>$1</b>'
          );
        } else {
          console.warn('Not questions for structuredQuestionsConfig');
        }
      }
    }
  }

  _finalize() {
    if (!this.textOnly) {
      this._linksAndEmojis();
    }

    if (
      this.truncate &&
      this.content &&
      (this.content.length > this.truncate || this.autoTranslate)
    ) {
      let truncateBy = this.truncate;
      if (
        this.autoTranslate &&
        YpMagicText.doubleWidthLanguages.indexOf(this.language) > -1
      ) {
        truncateBy = truncateBy / 2;
      }
      if (this.processedContent)
        this.processedContent = YpMagicText.truncateText(
          YpMagicText.trim(this.processedContent),
          truncateBy,
          '...'
        );
    }

    if (this.simpleFormat && this.processedContent) {
      this.processedContent = this.processedContent
        .trim()
        .replace(/(\n)/g, '<br>');
    }

    if (this.removeUrls && this.processedContent) {
      this.processedContent = this.processedContent.replace(
        /(?:https?|ftp):\/\/[\n\S]+/g,
        ''
      );
    }

    this._setupStructuredQuestions();

    this.subClassProcessing();

    if (this.processedContent !== this.finalContent) {
      if (!window.appGlobals.magicTextIronResizeDebouncer) {
        window.appGlobals.magicTextIronResizeDebouncer = window.setTimeout(
          () => {
            window.appGlobals.magicTextIronResizeDebouncer = undefined;
            //TODO: See if we need to do something like that still
            //this.fire('iron-resize');
          },
          100
        );
      }
    }

    if (
      this.processedContent &&
      this.processedContent !== 'undefined' &&
      this.content !== this.processedContent
    ) {
      this.finalContent = this.processedContent;
    } else {
      this.finalContent = undefined;
    }
  }

  _linksAndEmojis() {
    if (!this.skipSanitize && this.processedContent) {
      //this.processedContent = sanitizeHtml(this.processedContent, {allowedTags: ['b', 'i', 'em', 'strong']});
      this.processedContent = this.processedContent.replace(/&amp;/g, '&');
      this.processedContent = linkifyHtml(this.processedContent, {
        format: (value: string, type: string) => {
          if (type === 'url' && value.length > this.linkifyCutoff - 1) {
            value = value.slice(0, this.linkifyCutoff) + '…';
          }
          return value;
        },
      }) as string;
      this.processedContent = this.processedContent.replace(/&amp;/g, '&');
      this.processedContent = twemoji
        .parse(this.processedContent)
        .replace(/&amp;quot;/g, '"')
        .replace(
          /class="emoji" /g,
          'style="height: 1em;width: 1em;margin: 0 .3em 0 .3em;vertical-align: -0.1em;" '
        );
    } else if (this.processedContent) {
      this.processedContent = linkifyHtml(this.processedContent, {
        format: (value: string, type: string) => {
          if (type === 'url' && value.length > this.linkifyCutoff - 1) {
            value = value.slice(0, this.linkifyCutoff) + '…';
          }
          return value;
        },
      }) as string;
      this.processedContent = this.processedContent.replace(/&amp;/g, '&');
    }
  }

  static truncateText(
    input: string,
    length: number,
    killwords: string | undefined = undefined,
    end: number | undefined = undefined
  ) {
    length = length || 255;

    if (input.length <= length) return input;

    if (killwords) {
      input = input.substring(0, length);
    } else {
      let idx = input.lastIndexOf(' ', length);
      if (idx === -1) {
        idx = length;
      }

      input = input.substring(0, idx);
    }

    input += end !== undefined && end !== null ? end : '...';
    return input;
  }

  static trim(input: string): string {
    return input.replace(/^\s*|\s*$/g, '').trim();
  }
}
