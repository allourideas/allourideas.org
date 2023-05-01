/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';

@customElement('yp-simple-html-editor')
export class YpSimpleHtmlEditor extends YpBaseElement {
  @property({ type: Object })
  question!: YpStructuredQuestionData;

  @property({ type: Number })
  index: number | undefined;

  @property({ type: Boolean })
  useSmallFont = false;

  @property({ type: String })
  value = '';

  @property({ type: Number })
  characterCount = 0;

  @property({ type: Boolean })
  hasFocus = false;

  @property({ type: Boolean })
  allowFirefoxFocusHack = true;

  @property({ type: Boolean })
  showErrorLine = false;

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          margin-top: 8px;
          width: 100%;
        }

        #htmlEditor {
          width: 100%;
          height: 300px;
          border-top: 1px solid #cccccc;
          border-bottom: 1px solid #888888;
          outline: none;
          overflow: auto;
          padding-top: 8px;
          padding-bottom: 8px;
          transition: border-bottom-color 0.1s;
        }

        #htmlEditor:focus {
          border-bottom: 2px solid var(--accent-color);
        }

        #htmlEditor[has-error] {
          border-bottom: 2px solid #dd2c00 !important;
        }

        .characterCounter {
          color: #212121;
          font-size: 12px;
          text-align: right;
          width: 100%;
          transition: color 0.1s;
          margin-top: 1px;
        }

        .characterCounter[has-focus] {
          color: var(--accent-color);
          margin-top: 0px;
        }

        .characterCounter[has-error] {
          color: #dd2c00 !important;
        }

        @media (max-width: 800px) {
          #htmlEditor {
            height: 220px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout horizontal wrap">
        <div class="layout horizontal">
          <paper-icon-button
            aria-label="${this.t('formatBold')}"
            icon="format-bold"
            @mousedown="${this._toggleBoldM}"
            @tap="${this._toggleBold}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatItalic')}"
            icon="format-italic"
            @mousedown="${this._toggleItalicM}"
            @tap="${this._toggleItalic}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatUnderline')}"
            icon="format-underlined"
            @mousedown="${this._toggleUnderlineM}"
            @tap="${this._toggleUnderline}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatListBullets')}"
            icon="format-list-bulleted"
            @mousedown="${this._toggleListBulletsM}"
            @tap="${this._toggleListBullets}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatListNumbered')}"
            icon="format-list-numbered"
            @mousedown="${this._toggleListNumbersM}"
            @tap="${this._toggleListNumbers}"
          ></paper-icon-button>
        </div>
        <div class="layout horizontal">
          <paper-icon-button
            aria-label="${this.t('formatLeft')}"
            icon="format-align-left"
            @mousedown="${this._toggleAlignLeftM}"
            @tap="${this._toggleAlignLeft}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatCenter')}"
            icon="format-align-center"
            @mousedown="${this._toggleAlignCenterM}"
            @tap="${this._toggleAlignCenter}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatRight')}"
            icon="format-align-right"
            @mousedown="${this._toggleAlignRightM}"
            @tap="${this._toggleAlignRight}"
          ></paper-icon-button>
        </div>

        <div class="layout horizontal">
          <paper-icon-button
            aria-label="${this.t('formatH1')}"
            icon="format-header-1"
            @mousedown="${this._toggleH1M}"
            @tap="${this._toggleH1}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatH2')}"
            icon="format-header-2"
            @mousedown="${this._toggleH2M}"
            @tap="${this._toggleH2}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatH3')}"
            icon="format-header-3"
            @mousedown="${this._toggleH3M}"
            @tap="${this._toggleH3}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatH4')}"
            icon="format-header-4"
            @mousedown="${this._toggleH4M}"
            @tap="${this._toggleH4}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatH5')}"
            icon="format-header-5"
            @mousedown="${this._toggleH5M}"
            @tap="${this._toggleH5}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatH6')}"
            icon="format-header-6"
            @mousedown="${this._toggleH6M}"
            @tap="${this._toggleH6}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatP')}"
            icon="format-paragraph"
            @mousedown="${this._togglePM}"
            @tap="${this._toggleP}"
          ></paper-icon-button>
          <paper-icon-button
            aria-label="${this.t('formatClear')}"
            icon="format-clear"
            @mousedown="${this._clearFormatM}"
            @tap="${this._clearFormat}"
          ></paper-icon-button>
        </div>
      </div>
      <div
        id="htmlEditor"
        ?has-error="${this.showErrorLine}"
        @focus="${this._setFocus}"
        @blur="${this._setBlur}"
        contenteditable="true"
        spellcheck="false"
        @keydown="${this._keydown}"
        @paste="${this._paste}"
        @click="${this._changed}"
        @keyup="${this._changed}"
        @changed="${this._changed}"
      ></div>
      <div
        ?has-focus="${this.hasFocus}"
        ?has-error="${this.showErrorLine}"
        class="layout end characterCounter"
      >
        ${this.characterCount}<span ?hidden="${!this.question.maxLength}"
          >/${this.question.maxLength}</span
        >
      </div>
    `;
  }
  _setFocus() {
    this.hasFocus = true;

    if (this._isFirefox() && this.allowFirefoxFocusHack) {
      setTimeout( () => {
        this.allowFirefoxFocusHack = false;
        (this.shadowRoot!.querySelector("#htmlEditor") as HTMLInputElement)!.blur();
        (this.shadowRoot!.querySelector("#htmlEditor") as HTMLInputElement)!.focus();
        setTimeout( () => {
          this.allowFirefoxFocusHack = true;
        }, 150);
      });
     }

  }

  _setBlur(event: CustomEvent) {
    //TODO: Fix blinking on using the icon buttons
    this.hasFocus = false;
  }

  setRichValue(value: string) {
    this.value = value;
    this.shadowRoot!.querySelector("#htmlEditor")!.innerHTML = this.value;
  }

  _updateCharacterCounter() {
    const textContent = this.shadowRoot!.querySelector("#htmlEditor")!.textContent;

    if (textContent) {
      this.characterCount = textContent.length;
    } else {
      this.characterCount = 0;
    }
  }

  _keydown(event: KeyboardEvent) {
    this._updateCharacterCounter();
    this.showErrorLine = false;

    if (this.question.maxLength) {
      const allowedKeyCodes = [8, 37, 38, 39, 40];
      const allowedKeyCodesWithCtrlKey = [65, 90, 86, 67, 88, 8];
      const isAllowedKey = allowedKeyCodes.includes(event.keyCode);
      const isShortcut = event.ctrlKey && allowedKeyCodesWithCtrlKey.includes(event.keyCode);
      const isAllowedAction = isAllowedKey || isShortcut;

      if (isAllowedAction) {
        return
      }

      if (this.characterCount>=this.question.maxLength) {
        event.preventDefault();
      }
    }
  }

  _paste(event: ClipboardEvent | CustomEvent ) {
    if (this.question.maxLength) {
      //@ts-ignore
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text/plain');
      //@ts-ignore
      const content = event.target.textContent;
      const contentLength = content.length;
      //@ts-ignore
      const selectedText = window.getSelection().toString();
      const allowedPasteLength = this.question.maxLength - contentLength + selectedText.length;
      const slicedPasteText = pastedText.substring(0, allowedPasteLength);

      event.preventDefault();

      this._masterCommand('insertHTML', false, slicedPasteText);
    }

    setTimeout(() => {
      this._updateCharacterCounter();
    })
  }

  _changed() {
    this.value = this.shadowRoot!.querySelector("#htmlEditor")!.innerHTML;
    this._updateCharacterCounter();
  }

  validate() {
    if (this.question.required) {
      if (this.value && this.value.length>0) {
        this.showErrorLine = false;
        return true;
      } else {
        this.showErrorLine = true;
        return false;
      }
    } else {
      this.showErrorLine = false;
      return true;
    }
  }

  _isSafariOrIe11() {
    return (navigator.userAgent.indexOf("Safari") > -1 &&
      navigator.userAgent.indexOf('Chrome') === -1 &&
      navigator.userAgent.indexOf('iPhone') === -1 &&
      navigator.userAgent.indexOf('iPad') === -1) ||
      /Trident.*rv[ :]*11\./.test(navigator.userAgent)
  }

  _isFirefox() {
    return navigator.userAgent.indexOf("Firefox") > -1;
  }

  _clearFormat() {
    this._masterCommand('removeFormat');
    this._masterCommand('formatBlock', false, 'p');
  }

  _clearFormatM() {
    if (this._isSafariOrIe11()) this._clearFormat();
  }

  _toggleH1() {
    this._masterCommand('formatBlock',false,'h1');
  }

  _toggleH1M() {
    if (this._isSafariOrIe11()) this._toggleH1();
  }

  _toggleH2() {
    this._masterCommand('formatBlock',false,'h2');
  }

  _toggleH2M() {
    if (this._isSafariOrIe11()) this._toggleH2();
  }

  _toggleH3() {
    this._masterCommand('formatBlock',false,'h3');
  }

  _toggleH3M() {
    if (this._isSafariOrIe11()) this._toggleH3();
  }

  _toggleH4() {
    this._masterCommand('formatBlock',false,'h4');
  }

  _toggleH4M() {
    if (this._isSafariOrIe11()) this._toggleH4();
  }

  _toggleH5() {
    this._masterCommand('formatBlock',false,'h5');
  }

  _toggleH5M() {
    if (this._isSafariOrIe11()) this._toggleH5();
  }

  _toggleH6() {
    this._masterCommand('formatBlock',false,'h6');
  }

  _toggleH6M() {
    if (this._isSafariOrIe11()) this._toggleH6();
  }

  _toggleP() {
    this._masterCommand('formatBlock',false,'p');
  }

  _togglePM() {
    if (this._isSafariOrIe11()) this._toggleP();
  }

  _toggleAlignLeft() {
    this._masterCommand("JustifyLeft", false, "");
  }

  _toggleAlignLeftM() {
    if (this._isSafariOrIe11()) this._toggleAlignLeft();
  }

  _toggleAlignRight() {
    this._masterCommand("JustifyRight", false, "");
  }

  _toggleAlignRightM() {
    if (this._isSafariOrIe11()) this._toggleAlignRight();
  }

  _toggleAlignCenter() {
    this._masterCommand("JustifyCenter", false, "");
  }

  _toggleAlignCenterM() {
    if (this._isSafariOrIe11()) this._toggleAlignCenter();
  }

  _toggleAlignJustify() {
    this._masterCommand("JustifyFull", false, "");
  }

  _toggleAlignJustifyM() {
    if (this._isSafariOrIe11()) this._toggleAlignJustify();
  }

  _toggleBold() {
    this._masterCommand('bold');
  }

  _toggleBoldM() {
    if (this._isSafariOrIe11()) this._toggleBold();
  }

  _toggleItalic() {
    this._masterCommand('italic');
  }

  _toggleItalicM() {
    if (this._isSafariOrIe11()) this._toggleItalic();
  }

  _toggleUnderline() {
    this._masterCommand('underline');
  }

  _toggleUnderlineM() {
    if (this._isSafariOrIe11()) this._toggleUnderline();
  }

  _toggleListBullets() {
    this._masterCommand('insertUnorderedList');
  }

  _toggleListBulletsM() {
    if (this._isSafariOrIe11()) this._toggleListBullets();
  }

  _toggleListNumbers() {
    this._masterCommand('insertOrderedList');
  }

  _toggleListNumbersM() {
    if (this._isSafariOrIe11()) this._toggleListNumbers();
  }

  _masterCommand(commandName: string, showDefaultUI = false, value = "") {
    document.execCommand(commandName, showDefaultUI, value);
    this._changed();
  }
/*
  ready() {
    if (window.i18nTranslation) {
      this.language = window.locale;
    }

    super.ready();
  }
  */
}

