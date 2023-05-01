import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import linkifyStr from 'linkifyjs/string.js';

import '@material/mwc-circular-progress-four-color';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-snackbar';

import '@material/mwc-checkbox';
import '@material/mwc-radio';

import '@material/mwc-formfield';

import { YpStructuredQuestionEdit } from '../yp-survey/yp-structured-question-edit.js';
import { YpSurveyHelpers } from '../yp-survey/YpSurveyHelpers.js';

@customElement('yp-registration-questions')
export class YpRegistrationQuestions extends YpBaseElement {
  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Array })
  structuredAnswers: Array<Record<string, string>> | undefined;

  @property({ type: Array })
  translatedQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: String })
  selectedSegment: string | undefined;

  @property({ type: Array })
  segments: Array<YpStructuredQuestionData> | undefined;

  liveQuestionIds: Array<number> = [];

  uniqueIdsToElementIndexes: Record<string, number> = {};

  liveUniqueIds: Array<string> = [];

  liveUniqueIdsAll: Array<{ uniqueId: string; atIndex: number }> = [];

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
    this._getTranslationsIfNeeded();
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
          width: 100%;
        }

        @media (max-width: 800px) {
          yp-structured-question-edit {
            padding-left: 0;
            padding-right: 0;
          }
        }

        [hidden] {
          display: none !important;
        }

        yp-structured-question-edit {
        }

        .segmentQuestionIntro {
          margin-top: 16px;
        }
      `,
    ];
  }

  render() {
    return this.group
      ? html` ${this.segments
          ? html`
              <div class="segmentQuestionIntro">${this.t('choose')}</div>

              ${this.segments.map((radioButton, buttonIndex) => {
                return html`
                  <mwc-formfield .label="${radioButton.text}">
                    <mwc-radio
                      @change="${this._radioChanged}"
                      .value="${radioButton.text}"
                      id="segmentRadio_${buttonIndex}"
                      .name="${radioButton.segmentName!}"
                    >
                    </mwc-radio>
                  </mwc-formfield>
                `;
              })}
            `
          : nothing}
        ${this.filteredQuestions
          ? html` ${this.filteredQuestions.map((question, index) => {
              return html`
                <yp-structured-question-edit
                  .index="${index}"
                  use-small-font
                  is-from-new-post
                  id="structuredQuestionContainer_${index}"
                  .structured-answers="${this.structuredAnswers}"
                  .question="${question}"
                >
                </yp-structured-question-edit>
              `;
            })}
            : nothing}`
          : nothing}`
      : nothing;
  }

  get structuredQuestions(): Array<YpStructuredQuestionData> | undefined {
    if (this.group && this.group.configuration.registrationQuestionsJson) {
      if (this.translatedQuestions) {
        return this.translatedQuestions;
      } else {
        return this.group.configuration.registrationQuestionsJson;
      }
    } else {
      return undefined;
    }
  }

  get filteredQuestions() {
    if (this.structuredQuestions) {
      const filteredQuestions: Array<YpStructuredQuestionData> = [];
      this.structuredQuestions.forEach(question => {
        if (
          !this.segments ||
          (this.selectedSegment &&
            question.type !== 'segment' &&
            question.segmentName === this.selectedSegment)
        ) {
          filteredQuestions.push(question);
        }
      });
      return filteredQuestions;
    } else {
      return null;
    }
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
    this._getTranslationsIfNeeded();
  }

  _getTranslationsIfNeeded() {
    this.translatedQuestions = undefined;
    if (
      this.autoTranslate &&
      this.language &&
      this.group &&
      this.language !== this.group.language
    ) {
      const translatedTexts =
        window.serverApi.getTranslatedRegistrationQuestions(
          this.group.id,
          this.language
        );
      if (this.autoTranslate && this.language !== this.group.language) {
        const currentQuestions = JSON.parse(
          JSON.stringify(this.group.configuration.registrationQuestionsJson)
        ) as Array<YpStructuredQuestionData>;

        if (
          translatedTexts.length ===
          YpSurveyHelpers.getQuestionLengthWithSubOptions(currentQuestions)
        ) {
          let translatedItemCount = 0;
          for (
            let questionCount = 0;
            questionCount < currentQuestions.length;
            questionCount++
          ) {
            const question = currentQuestions[questionCount];
            question.originalText = question.text;
            question.text = translatedTexts[translatedItemCount++];

            if (
              question.type === 'radios' &&
              question.radioButtons &&
              question.radioButtons.length > 0
            ) {
              for (
                let subOptionCount = 0;
                subOptionCount < question.radioButtons.length;
                subOptionCount++
              ) {
                question.radioButtons[subOptionCount].originalText =
                  question.radioButtons[subOptionCount].text;
                question.radioButtons[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            } else if (
              question.type === 'checkboxes' &&
              question.checkboxes &&
              question.checkboxes.length > 0
            ) {
              for (
                let subOptionCount = 0;
                subOptionCount < question.checkboxes.length;
                subOptionCount++
              ) {
                question.checkboxes[subOptionCount].originalText =
                  question.checkboxes[subOptionCount].text;
                question.checkboxes[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            } else if (
              question.type === 'dropdown' &&
              question.dropdownOptions &&
              question.dropdownOptions.length > 0
            ) {
              for (
                let subOptionCount = 0;
                subOptionCount < question.dropdownOptions.length;
                subOptionCount++
              ) {
                question.dropdownOptions[subOptionCount].originalText =
                  question.dropdownOptions[subOptionCount].text;
                question.dropdownOptions[subOptionCount].text =
                  translatedTexts[translatedItemCount++];
              }
            }
          }

          this.translatedQuestions = currentQuestions;
        } else {
          console.error('Questions and Translated texts length does not match');
        }
      } else {
        this.translatedQuestions = undefined;
      }
    }
  }

  _setupQuestions() {
    if (this.filteredQuestions) {
      if (window.autoTranslate) {
        this.autoTranslate = window.autoTranslate;
      }
      const liveQuestionIds: Array<number> = [];
      const liveUniqueIds: Array<string> = [];
      const liveUniqueIdsAll: Array<any> = [];
      const uniqueIdsToElementIndexes: Record<string, number> = {};
      this.filteredQuestions.forEach((question, index) => {
        if (
          (question && question.type!.toLowerCase() === 'textfield') ||
          question.type!.toLowerCase() === 'textfieldlong' ||
          question.type!.toLowerCase() === 'textarea' ||
          question.type!.toLowerCase() === 'textarealong' ||
          question.type!.toLowerCase() === 'numberfield' ||
          question.type!.toLowerCase() === 'checkboxes' ||
          question.type!.toLowerCase() === 'radios' ||
          question.type!.toLowerCase() === 'dropdown'
        ) {
          if (
            !this.segments ||
            (this.selectedSegment &&
              question.segmentName === this.selectedSegment)
          ) {
            liveQuestionIds.push(index);
            uniqueIdsToElementIndexes[question.uniqueId!] = index;
            liveUniqueIds.push(question.uniqueId!);
            liveUniqueIdsAll.push({
              uniqueId: question.uniqueId,
              atIndex: index,
            });
          }
        }
      });
      this.liveQuestionIds = liveQuestionIds;
      this.liveUniqueIds = liveUniqueIds;
      this.liveUniqueIdsAll = liveUniqueIdsAll;
      this.uniqueIdsToElementIndexes = uniqueIdsToElementIndexes;
    }
  }

  _checkForSegments() {
    if (this.structuredQuestions) {
      const segments: Array<YpStructuredQuestionData> = [];
      this.structuredQuestions.forEach((question, index) => {
        if (question.type!.toLowerCase() === 'segment') {
          segments.push(question);
        }
      });

      if (segments.length > 0) {
        this.segments = segments;
      }
    } else {
      this.segments = undefined;
    }
  }

  getAnswers() {
    const answers: Array<Record<string, string>> = [];
    this.liveQuestionIds.forEach(liveIndex => {
      const questionElement = this.$$(
        '#structuredQuestionContainer_' + liveIndex
      ) as YpStructuredQuestionEdit;
      if (questionElement) {
        const returnAnswer: Record<string, string> = {};
        const text = questionElement.question.originalText
          ? questionElement.question.originalText
          : questionElement.question.text;

        returnAnswer[text] = questionElement.getAnswer()!.value as string;
        answers.push(returnAnswer);
      }
    });
    this.structuredAnswers = answers;
    return answers;
  }

  validate() {
    let valid = true;
    this.liveQuestionIds.forEach(liveIndex => {
      const questionElement = this.$$(
        '#structuredQuestionContainer_' + liveIndex
      ) as YpStructuredQuestionEdit;
      if (questionElement && !questionElement.checkValidity()) {
        valid = false;
      }
    });

    if (this.segments && !this.selectedSegment) {
      valid = false;
    }
    return valid;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has('group') ||
      changedProperties.has('translatedQuestions')
    ) {
      this._checkForSegments();
      this._setupQuestions();
    }
  }

  _radioChanged(event: CustomEvent) {
    this.selectedSegment = event.detail.value;
    this._setupQuestions();
    setTimeout(() => {
      this.fire('questions-changed');
    });
  }
}
