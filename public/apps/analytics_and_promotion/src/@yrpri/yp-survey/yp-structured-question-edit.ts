import { html, css, nothing, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkify-html';

import '@material/mwc-circular-progress-four-color';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-snackbar';

import '@material/mwc-checkbox';
import '@material/mwc-radio';

import '@material/mwc-formfield';
import { Radio } from '@material/mwc-radio';

import { Checkbox } from '@material/mwc-checkbox';

import { TextField } from '@material/mwc-textfield';
import '@material/mwc-textfield';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import './yp-simple-html-editor.js';

import { YpSimpleHtmlEditor } from './yp-simple-html-editor.js';
import { YpBaseElement } from '../common/yp-base-element.js';

@customElement('yp-structured-question-edit')
export class YpStructuredQuestionEdit extends YpBaseElement {
  @property({ type: Object })
  question!: YpStructuredQuestionData;

  @property({ type: Number })
  index: number | undefined;

  @property({ type: Boolean })
  hideQuestionIndex = false;

  @property({ type: String })
  formName: string | undefined

  @property({ type: Boolean })
  dontFocusFirstQuestion = false;

  @property({ type: Boolean })
  useSmallFont = false;

  @property({ type: Boolean })
  longFocus = false;

  @property({ type: Boolean })
  isLastRating = false;

  @property({ type: Boolean })
  isFirstRating = false;

  @property({ type: Boolean })
  isFromNewPost = false;

  @property({ type: Array })
  structuredAnswers: Array<YpStructuredAnswer> | undefined;

  @property({ type: Number })
  debounceTimeMs = 2000

  @property({ type: Boolean })
  disabled = false

  radioKeypress = false;

  debunceChangeEventTimer: ReturnType<typeof setTimeout> | undefined;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('structuredAnswers')) {
      this._structuredAnsweredChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-size: 16px;
        }

        a {
          color: #000;
        }

        .question {
          margin-top: 32px;
          margin-bottom: 8px;
          color: #000;
          font-size: 18px;
          line-height: 1.5;
        }

        .question[use-small-font] {
          font-size: 16px;
        }

        hr {
          border-top: 2px dashed var(--accent-color);
          margin-top: 48px;
          margin-bottom: 32px;
        }

        .general {
          color: #000;
        }

        .noBottomMargin {
          margin-bottom: 0;
        }

        .header[is-not-first] {
          margin-top: 54px;
        }

        mwc-dropdown-menu {
          margin-top: 16px;
        }

        .numberInput {
        }

        mwc-checkbox {
          margin-bottom: 16px;
        }

        mwc-textfield,
        mwc-textarea {
          width: 100%;
          --mwc-textfield-container-label: {
            color: #000;
            font-size: 18px;
          }
        }

        mwc-textfield[use-small-font],
        mwc-textarea[use-small-font] {
          --mwc-textfield-container-label: {
            font-size: 16px;
          }
        }

        mwc-textfield {
          margin-bottom: 32px;
        }

        .radioGroup {
          margin-top: 16px;
          margin-bottom: 16px;
          font-size: 16px;
        }

        mwc-radio {
          --mwc-radio-label-color: #252525;
          font-size: 16px;
        }

        .checkBoxesLabel {
          margin-bottom: 36px;
        }

        .radiosLabel {
          margin-bottom: 16px;
          margin-top: 48px;
        }

        .radiosLabel[is-first-rating] {
          margin-top: 24px;
        }

        mwc-textarea.textAreaLong {
          --mwc-textfield-container: {
            margin: 0;
            padding: 0;
          }
        }

        mwc-textfield.textAreaLong {
          --mwc-textfield-container: {
            margin: 0;
            padding: 0;
          }
        }

        .longQuestion {
          font-size: 18px;
          font-weight: 400;
          color: #000;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .longQuestion[use-small-font] {
          font-size: 16px;
          color: #252525;
        }

        .longQuestion[is-from-new-post] {
          color: #757575;
        }

        .question[is-from-new-post] {
          color: #757575;
        }

        .longQuestion[has-content] {
          font-size: 12px;
        }

        .longQuestion[has-focus] {
          color: var(--accent-color);
        }

        mwc-checkbox {
          --mwc-checkbox-label-color: #252525;
          margin-left: 42px;
          margin-bottom: 24px;
        }

        .general[less-bottom-margin] {
          margin-bottom: -32px;
        }

        .general[extra-top-margin] {
          margin-top: 32px;
        }

        .lessBottomMargin {
          margin-bottom: -32px;
        }

        [hidden] {
          display: none !important;
        }

        .header {
          font-size: 26px;
          font-weight: bold;
          line-height: 1.5;
        }

        .header[is-first] {
          background-color: var(--accent-color);
          color: #fff;
          font-size: 32px;
          padding: 24px;
        }

        @media (min-width: 800px) {
          mwc-textfield[half-width-desktop] {
            width: 50%;
          }

          :host {
            padding: 0;
            margin: 0;
          }
        }

        mwc-radio {
          margin-left: 24px;
        }

        .specifyInput {
          max-width: 220px;
          margin-left: 24px;
          margin-top: -16px;
          margin-bottom: 0;
        }

        .specifyCheckBox {
          margin-left: 42px;
          margin-bottom: 12px;
        }

        @media (max-width: 600px) {
          .header {
            font-size: 22px;
          }

          .header[is-first] {
            font-size: 24px;
          }
        }

      .radioGroup[invalid] mwc-radio {
        --mdc-radio-unchecked-color: red;
      }

      mwc-dropdown-menu {
          background-color: transparent;
      }

      `,
    ];
  }

  get value() {
    const answer = this.getAnswer(true);
    if (answer) {
      return answer.value;
    } else {
      return null;
    }
  }

  set value(value: any) {
    this.setAnswerAfterUpdate(value);
  }

  async setAnswerAfterUpdate(value: any) {
    await this.updateComplete;
    this.setAnswer(value);
  }

  renderTextField(skipLabel = false) {
    return html`
      <mwc-textfield
        id="structuredQuestion_${this.index}"
        .value="${(this.question.value as string) || ''}"
        .label="${!skipLabel ? this.textWithIndex : ''}"
        name="${this.formName || ''}"
        ?use-small-font="${this.useSmallFont}"
        .title="${this.question.text}"
        @keypress="${this._keyPressed}"
        ?charCounter="${this.question.charCounter!=undefined ? this.question.charCounter : false }"
        .pattern="${this.question.pattern || ""}"
        type="text"
        .allowedPattern="${this.isNumberSubType ? '[0-9]' : ''}"
        ?half-width-desktop="${this.question.halfWidthDesktop}"
        @change="${this._debounceChangeEvent}"
        ?required="${this.question.required}"
        .maxlength="${this.question.maxLength || 100000}">
      </mwc-textfield>
    `;
  }

  renderTextFieldLong() {
    return html`
      <div
        class="question general longQuestion"
        ?is-from-new-post="${this.isFromNewPost}"
        ?has-focus="${this.longFocus}"
        id="structuredQuestionIntro_${this.index}">${unsafeHTML(this.textWithIndex)}</div>
      ${this.renderTextField(true)}
    `;
  }

  renderTextArea(skipLabel = false) {
    if (this.question.richTextAllowed) {
      return html`
        <yp-simple-html-editor id="structuredQuestion_${this.index}"
              .question="${this.question}"
              @focus="${this.setLongFocus}"
              @blur="${this.setLongUnFocus}"
        >
        </yp-simple-html-editor>`;
    } else {
      return html`
        <mwc-textarea
          id="structuredQuestion_${this.index}"
          data-type="text"
          .label="${!skipLabel ? this.textWithIndex : ''}"
          .value="${(this.question.value as string) || ''}"
          minlength="2"
          ?charCounter="${this.question.charCounter!=undefined ? this.question.charCounter : true }"
          .pattern="${this.question.pattern || ""}"
          @focus="${this.setLongFocus}"
          @blur="${this.setLongUnFocus}"
          ?use-small-font="${this.useSmallFont}"
          @change="${this._debounceChangeEvent}"
          name="${this.formName || ''}"
          rows="3"
          max-rows="5"
          maxrows="5"
          ?required="${this.question.required}"
          .maxlength="${this.question.maxLength || 5000}">
        </mwc-textarea>
    `;
    }
  }

  renderTextAreaLong() {
    return html`
      <div
        class="question general longQuestion"
        ?is-from-new-post="${this.isFromNewPost}"
        ?has-focus="${this.longFocus}"
        ?is-from-new-post="${this.isFromNewPost}"
        ?has-content="${this.question.value}"
        ?use-small-font="${this.useSmallFont}"
        id="structuredQuestionIntro_${this.index}"
       >${unsafeHTML(this.textWithLinks)}</div>
      ${this.renderTextArea(true)}
    `;
  }

  renderTextHeader() {
    return html`
      <div
        class="header"
        ?is-not-first="${this.index}"
        ?is-first="${!this.index}">
        ${this.question.text}
      </div>
    `;
  }

  renderTextDescription() {
    return html`
      <div
        class="question general"
        id="structuredQuestionQuestion_${this.index}"
        ?is-from-new-post="${this.isFromNewPost}"
        ?use-small-font="${this.useSmallFont}"
        ?extra-top-margin="${this.question.extraTopMargin}"
        ?less-bottom-margin="${this.question.lessBottomMargin}">${unsafeHTML(this.textWithLinks)}</div>
    `;
  }

  renderSeperator() {
    return html` <hr /> `;
  }

  renderRadioButton(radioButton: YpRadioButtonData, buttonIndex: number) {
    return html`
      <mwc-formfield .label="${radioButton.text}">
        <mwc-radio
          ?use-small-font="${this.useSmallFont}"
          @keypress="${this.setRadioEventType}"
          @change="${this._radioChanged}"
          .value="${radioButton.text}"
          id="structuredQuestionRatioGroup_${this.index}_${buttonIndex}"
          .name="radioButtons${this.index}">
        </mwc-radio>
      </mwc-formfield>
    `;
  }

  renderRadios() {
    return this.question.radioButtons
      ? html`
          <div
            class="question general radiosLabel"
            ?use-small-font="${this.useSmallFont}"
            ?is-from-new-post="${this.isFromNewPost}"
            ?is-first-rating="${this.isFirstRating}"
            id="structuredQuestionIntro_${this.index}"
         >${unsafeHTML(this.textWithLinks)}</div>
          <div
            ?required="${this.question.required}"
            id="structuredQuestion_${this.index}"
            .name="structuredQuestionRatioGroup_${this.index}"
            class="${this._getRadioClass()} radioGroup">
            ${this.question.radioButtons.map(
              (radioButton, buttonIndex) => html`
                ${!radioButton.isSpecify
                  ? html` ${this.renderRadioButton(radioButton, buttonIndex)} `
                  : html`
                      ${this.renderRadioButton(radioButton, buttonIndex)}
                      <mwc-textfield
                        class="specifyInput"
                        hidden
                        @change="${this._debounceChangeEvent}"
                        .maxlength="${this.question.maxLength || 5000}"
                        .pattern="${radioButton.subType === 'number'
                          ? '[0-9]'
                          : ''}"
                        type="text"
                        id="structuredQuestion_${this
                          .index}_${buttonIndex}__radioOther"></mwc-textfield>
                    `}
              `
            )}
          </div>
        `
      : nothing;
  }

  renderCheckbox(text: string, buttonIndex: number, useTopLevelId = false) {
    const id = useTopLevelId ? `structuredQuestion_${this.index}` : `structuredQuestionCheckbox_${this.index}_${buttonIndex}`
    return html`
      <mwc-formfield .label="${text}">
        <mwc-checkbox
          id="${id}"
          .name="${this.formName || null}"
          ?disabled="${this.disabled}"
          ?checked="${(this.question.value as boolean) || false}"
          @change="${this._checkboxChanged}">
        </mwc-checkbox>
      </mwc-formfield>
    `;
  }

  renderCheckboxes() {
    return this.question.checkboxes
      ? html`
          <div
            id="structuredQuestionIntro_${this.index}"
            class="question general checkBoxesLabel"
            ?is-from-new-post="${this.isFromNewPost}"
            ?use-small-font="${this.useSmallFont}"
         >${unsafeHTML(this.textWithLinks)}</div>
          <div
            id="structuredQuestion_${this.index}"
            data-type="checkboxes"
            class="layout vertical">
            ${this.question.checkboxes.map(
              (checkbox, buttonIndex) => html`
                ${!checkbox.isSpecify
                  ? html` ${this.renderCheckbox(checkbox.text, buttonIndex)} `
                  : html`
                      ${this.renderCheckbox(checkbox.text, buttonIndex)}
                      <mwc-textfield
                        class="specifyInput specifyCheckBox"
                        hidden
                        @change="${this._debounceChangeEvent}"
                        .type="${checkbox.subType || 'text'}"
                        id="structuredQuestion_${this
                          .index}_${buttonIndex}_checkboxOther"></mwc-textfield>
                    `}
              `
            )}
          </div>
        `
      : nothing;
  }

  //TODO: Get this working
  renderDropdown() {
    return html`
      <mwc-select
        .label="${this.textWithIndex}"
        @change="${this._dropDownChanged}">
        ${this.question.dropdownOptions?.map(
            dropDownOptions => html`
              <mwc-list-item name="${dropDownOptions.text}"
                >${dropDownOptions.text}</mwc-list-item
              >
            `
          )}
      </mwc-select>
    `;
  }

  _dropDownChanged() {

  }

  render(): TemplateResult | undefined | {} {
    let question: TemplateResult | undefined | {};

    let questionType = this.question.type;
    if (!questionType) questionType = 'textarea';

    questionType = questionType.toLowerCase();

    switch (questionType) {
      case 'textarea':
        question = this.renderTextArea();
        break;
      case 'textarealong':
        question = this.renderTextAreaLong();
        break;
      case 'textfield':
        question = this.renderTextField();
        break;
      case 'textfieldlong':
        question = this.renderTextFieldLong();
        break;
      case 'textheader':
        question = this.renderTextHeader();
        break;
      case 'textdescription':
        question = this.renderTextDescription();
        break;
      case 'checkboxes':
        question = this.renderCheckboxes();
        break;
      case 'checkbox':
        question = this.renderCheckbox(this.question.text, 0, true);
      break;
        case 'radios':
        question = this.renderRadios();
        break;
      case 'seperator':
        question = this.renderSeperator();
        break;
      /*case 'dropdown':
        page = this.renderSeperator()
        break*/
    }

    return question;
  }

  setLongUnFocus() {
    this.longFocus = false;
  }

  setLongFocus() {
    this.longFocus = true;
  }

  get isNumberSubType() {
    return this.question && this.question.subType === 'number';
  }

  _keyPressed(event: KeyboardEvent) {
    if (event.which == 13 || event.keyCode == 13) {
      this.fire('yp-goto-next-index', { currentIndex: this.index });
    }
  }

  setRadioEventType() {
    this.radioKeypress = true;
  }

  _sendDebouncedChange(event: CustomEvent) {
    if (!this.debunceChangeEventTimer) {
      this.debunceChangeEventTimer = setTimeout(() => {
        this.fire('yp-answer-content-changed', event.detail);
        this.debunceChangeEventTimer = undefined;
        this._resizeScrollerIfNeeded();
      }, this.debounceTimeMs);
    }
  }

  _debounceChangeEvent(event: CustomEvent) {
    event.stopPropagation();
    this._sendDebouncedChange(event);
  }

  get textWithIndex() {
    return this.question.text;
    //TODO: Think about if we need that
    /*if (question.questionIndex && !this.hideQuestionIndex) {
      return question.questionIndex + ". " + question.text
    } else {
      return question.text
    }*/
  }

  _getRadioClass() {
    if (
      this.question.subType &&
      this.question.subType === 'rating' &&
      !this.isLastRating
    ) {
      return 'layout horizontal wrap lessBottomMargin';
    } else if (this.question.subType && this.question.subType === 'rating') {
      return 'layout horizontal wrap';
    } else {
      return 'layout vertical';
    }
  }

  get textWithLinks() {
    let text = linkifyHtml(this.question.text);
    text = text.replace(/\n/g, '<br>');
    return text;
  }

  _resizeScrollerIfNeeded() {
    this.fire('resize-scroller');
  }

  //TODO: Finish this
  checkValidity() {
    const liveQuestion = this.$$('#structuredQuestion_' + this.index);
    if (liveQuestion) {
      if (liveQuestion.dataset.type === 'dropdown') {
        return true; // DO something if required
      } else if (liveQuestion.dataset.type === 'radios') {
        return true; // DO something if required
      } else if (liveQuestion.dataset.type === 'checkboxes') {
        return true; // DO something if required
      } else {
        if (liveQuestion && typeof (liveQuestion as TextField).checkValidity == 'function' ) {
          return (liveQuestion as TextField).checkValidity();
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  get isInputField() {
    return (
      this.question.type &&
      (this.question.type.toLowerCase() === 'textfield' ||
        this.question.type.toLowerCase() === 'textfieldlong' ||
        this.question.type.toLowerCase() === 'textarea' ||
        this.question.type.toLowerCase() === 'textarealong' ||
        this.question.type.toLowerCase() === 'numberfield')
    );
  }

  focus() {
    if (this.isInputField) {
      const item = this.$$('#structuredQuestion_' + this.index);
      if (item) {
        setTimeout(() => {
          item.focus();
        }, 250);
      }
    }
  }

  cleanValue(value: string) {
    if (value) {
      return value.replace(/,/g, '').replace(/:/g, '');
    } else {
      console.warn('No value for cleanValue');
      return '';
    }
  }

  getAnswer(suppressNotFoundError = false): YpStructuredAnswer | undefined {
    const item = this.$$('#structuredQuestion_' + this.index);

    if (item) {
      let value;

      if (this.isInputField) {
        value = (item as HTMLInputElement).value;
      } else if (this.question.type!.toLowerCase() === 'radios') {
        let selectedRadio;
        this.question.radioButtons?.forEach((button, buttonIndex) => {
          const radioButtonElement = this.$$(
            '#structuredQuestionRatioGroup_' + this.index + '_' + buttonIndex
          ) as Radio
          if (radioButtonElement && button.text === radioButtonElement.value) {
            selectedRadio = radioButtonElement;
            if (button.isSpecify) {
              const radioInput = this.$$(
                '#structuredQuestion_' +
                  this.index +
                  '_' +
                  buttonIndex +
                  '__radioOther'
              ) as TextField;
              if (radioInput) {
                value =
                  selectedRadio.value + ':' + this.cleanValue(radioInput.value);
              } else {
                value = selectedRadio.value;
              }
            } else {
              value = selectedRadio.value;
            }
          }
        });
      } else if (this.question.type!.toLowerCase() === 'checkboxes') {
        let selectedCheckboxes = '';
        for (let i = 0; i < item.children.length; i++) {
          if ((item.children[i] as Checkbox).checked) {
            const checkboxSubId: string = item.children[i].id.split('_')[2];
            const selectedCheckbox = this.question.checkboxes![
              parseInt(checkboxSubId)
            ];
            if (selectedCheckbox.isSpecify) {
              const checkboxInput = this.$$(
                '#structuredQuestion_' +
                  this.index +
                  '_' +
                  checkboxSubId +
                  '_checkboxOther'
              );
              if (checkboxInput && (checkboxInput as TextField).value !== '') {
                selectedCheckboxes +=
                  selectedCheckbox.text +
                  ':' +
                  this.cleanValue((checkboxInput as TextField).value) +
                  ',';
              } else {
                selectedCheckboxes += selectedCheckbox.text + ',';
              }
            } else {
              selectedCheckboxes += selectedCheckbox.text + ',';
            }
          }
        }
        if (selectedCheckboxes !== '') {
          value = selectedCheckboxes.substring(
            0,
            selectedCheckboxes.length - 1
          );
        }
      } else if (this.question.type!.toLowerCase() === 'checkbox') {
        value = (item as Checkbox).checked;
      }

      if (value!=undefined && this.question.uniqueId) {
        return { uniqueId: this.question.uniqueId, value: value };
      } else {
        console.error("Can't find answer for question");
        return undefined
      }
    } else if (!suppressNotFoundError) {
      console.error("Can't find question item for " + this.question.text);
    }
  }

  setAnswer(value: string) {
    if (value!=null) {
      const item = this.$$('#structuredQuestion_' + this.index);

      if (item && this.question.type) {
        if (this.isInputField) {
          if (this.question.richTextAllowed) {
            (item as YpSimpleHtmlEditor).setRichValue(value);
          } else {
            (item as HTMLInputElement).value = value;
          }
        } else if (
          this.question.type &&
          this.question.type.toLowerCase() === 'radios'
        ) {
          let specifyInput: string;
          if (value.indexOf(':') > -1) {
            const splitText = value.split(':');
            value = splitText[0];
            specifyInput = splitText[1];
          }

          this.question.radioButtons?.forEach((button, buttonIndex) => {
            if (button.text === value) {
              const radioButtonElement = this.$$(
                '#structuredQuestionRatioGroup_' + this.index + '_' + buttonIndex
              ) as Radio;
              if (radioButtonElement) {
                radioButtonElement.checked = true
                if (specifyInput) {
                  const input = this.$$(
                    '#structuredQuestion_' +
                      this.index +
                      '_' +
                      buttonIndex +
                      '__radioOther'
                  );
                  if (input) {
                    input.hidden = false;
                    (input as HTMLInputElement).value = specifyInput;
                  } else {
                    console.error("Can't find checkbox specify value");
                  }
                }
              }
            }
          });
        } else if (this.question.type.toLowerCase() === 'checkboxes' && this.question.checkboxes) {
          const checkboxValues = value.split(',');
          const specifyInputs: Record<string,string> = {};
          let hasSpecifyInputs = false;
          for (let i = 0; i < checkboxValues.length; i++) {
            if (checkboxValues[i].indexOf(':') > -1) {
              const splitText = checkboxValues[i].split(':');
              checkboxValues[i] = splitText[0];
              specifyInputs[splitText[0]] = splitText[1];
              hasSpecifyInputs = true;
            }
          }
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i]) {
              const checkboxSubId = item.children[i].id.split('_')[2];
              const selectedCheckbox = this.question.checkboxes[
                parseInt(checkboxSubId)
              ];
              if (selectedCheckbox) {
                if (checkboxValues.indexOf(selectedCheckbox.text) > -1) {
                  (item.children[i] as Checkbox).checked = true;
                  if (hasSpecifyInputs) {
                    const input = this.$$(
                      '#structuredQuestion_' +
                        this.index +
                        '_' +
                        checkboxSubId +
                        '_checkboxOther'
                    ) as TextField
                    if (input && specifyInputs[selectedCheckbox.text]) {
                      input.hidden = false;
                      input.value = specifyInputs[selectedCheckbox.text];
                    } else {
                      console.error("Can't find checkbox specify value");
                    }
                  }
                }
              } else {
                console.debug('No selectedCheckbox');
              }
            }
          }
        } else if (this.question.type.toLowerCase() === 'checkbox') {
          if (value) {
            (item as Checkbox).checked = true;
          }
        }
      } else {
        console.error('cant find answer for item index ' + this.index);
      }
    }
  }

  hide() {
    const item = this.$$('#structuredQuestion_' + this.index);
    if (item) {
      item.hidden = true;

      const introItem = this.$$('#structuredQuestionIntro_' + this.index);
      if (introItem) {
        introItem.hidden = true;
      }
    } else {
      console.error("Can't find question index: " + this.index);
    }
  }

  show() {
    const item = this.$$('#structuredQuestion_' + this.index);
    if (item) {
      item.hidden = false;
      const introItem = this.$$('#structuredQuestionIntro_' + this.index);
      if (introItem) {
        introItem.hidden = false;
      }
    } else {
      console.error("Can't find question index: " + this.index);
    }
  }

  _checkboxChanged(event: CustomEvent) {
    if (this.question.checkboxes && (event.target as Checkbox).checked) {
      const checkboxSubId: string = (event.target as Checkbox).id.split('_')[2];

      const selectedCheckbox = this.question.checkboxes[
        parseInt(checkboxSubId)
      ];
      if (selectedCheckbox.isSpecify) {
        const checkboxInput = this.$$(
          '#structuredQuestion_' +
            this.index +
            '_' +
            checkboxSubId +
            '_checkboxOther'
        ) as HTMLInputElement;
        if (checkboxInput) {
          checkboxInput.hidden = false;
          if (!checkboxInput.value) {
            checkboxInput.value = '';
          }
          checkboxInput.focus();
        } else {
          console.error("Can't find checkbox input");
        }
      }
    }

    if (this.question.maxLength) {
      let checkedCount = 0;
      const item = this.$$(
        '#structuredQuestion_' + this.index
      ) as HTMLInputElement;
      for (let i = 0; i < item.children.length; i++) {
        if (
          item.children[i].tagName.toLowerCase() === 'mwc-checkbox' &&
          (item.children[i] as Checkbox).checked
        ) {
          checkedCount += 1;
        }
      }

      if (checkedCount >= this.question.maxLength) {
        for (let x = 0; x < item.children.length; x++) {
          if (
            item.children[x].tagName.toLowerCase() === 'mwc-checkbox' &&
            !(item.children[x] as Checkbox).checked
          ) {
            (item.children[x] as HTMLInputElement).disabled = true;
          }
        }
      } else {
        for (let n = 0; n < item.children.length; n++) {
          if (
            item.children[n].tagName.toLowerCase() === 'mwc-checkbox' &&
            (item.children[n] as HTMLInputElement).disabled
          ) {
            (item.children[n] as HTMLInputElement).disabled = false;
          }
        }
      }
    }

    event.stopPropagation();
    this._sendDebouncedChange({ detail: { value: 1 } } as CustomEvent);
  }

  _radioChanged(event: CustomEvent) {
    event.stopPropagation();
    if (this.question.radioButtons) {
      this._sendDebouncedChange({ detail: { value: 1 } } as CustomEvent);

      let selectedRadio;

      this.question.radioButtons.forEach((button, buttonIndex) => {
        if (button.text === (event.target as Radio).value) {
          selectedRadio = button;
          if (selectedRadio.skipTo) {
            this.fire('yp-skip-to-unique-id', {
              fromId: this.question.uniqueId,
              toId: selectedRadio.skipTo,
            });
          } else if (selectedRadio.isSpecify) {
            const input = this.$$(
              '#structuredQuestion_' +
                this.index +
                '_' +
                buttonIndex +
                '__radioOther'
            );
            if (input) {
              input.hidden = false;
              input.focus();
            } else {
              console.error("Can't find radio specify value");
            }
          } else {
            setTimeout(() => {
              if (!this.radioKeypress) {
                this.fire('yp-goto-next-index', { currentIndex: this.index });
              }
            });

            let hasSkipToId;

            this.question.radioButtons?.forEach(button => {
              if (button.skipTo) {
                hasSkipToId = button.skipTo;
              }
            });

            if (hasSkipToId) {
              this.fire('yp-open-to-unique-id', {
                fromId: this.question.uniqueId,
                toId: hasSkipToId,
              });
            }
          }
        }
      });
    }
  }

  _structuredAnsweredChanged() {
    if (this.structuredAnswers && this.question.uniqueId) {
      const BreakException = {};
      try {
        this.structuredAnswers.forEach(answer => {
          if (this.question.uniqueId === answer.uniqueId && answer.value) {
            setTimeout(() => {
              this.setAnswer(answer.value as string);
            }, 100);
            throw BreakException;
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.question) {
      if (this.question.type === 'numberField') {
        this.question.type = 'textField';
        this.question.subType = 'number';
      }
    }

    setTimeout(() => {
      if (this.question.questionIndex === 1 && !this.dontFocusFirstQuestion) {
        this.focus();
      }
    }, 500);
  }
}
