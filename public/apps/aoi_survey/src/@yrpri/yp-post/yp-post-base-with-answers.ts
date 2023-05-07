/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpSurveyHelpers } from '../yp-survey/YpSurveyHelpers.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class YpPostBaseWithAnswersInterface {
  autoTranslate: boolean;
  translatedQuestions: string[] | undefined;
  post: YpPostData | undefined;
  translatedAnswers: string[] | undefined;
  addGlobalListener?: Function;
  structuredAnswersFormatted: string;
  getIndexTranslationKey: Function;
}

export const YpPostBaseWithAnswers = <T extends Constructor<YpBaseElement>>(
  superClass: T
) => {
  class YpPostBaseWithAnswersElement extends superClass {
    @property({ type: Array })
    translatedQuestions: string[] | undefined;

    @property({ type: Array })
    translatedAnswers: string[] | undefined;

    @property({ type: Boolean })
    autoTranslate = false;

    @property({ type: Object })
    post: YpPostData | undefined;

    connectedCallback() {
      super.connectedCallback();
      if (window.autoTranslate) {
        this.autoTranslate = true;
      }
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

    _autoTranslateEvent(event: CustomEvent) {
      this.autoTranslate = event.detail;
      this._getSurveyTranslationsIfNeeded();
    }

    _languageEvent(event: CustomEvent) {
      super._languageEvent(event);
      this._getSurveyTranslationsIfNeeded();
    }

    async _getSurveyTranslationsIfNeeded() {
      this.translatedQuestions = undefined;
      this.translatedAnswers = undefined;
      if (
        this.post &&
        this.post.public_data &&
        this.post.public_data.structuredAnswersJson &&
        this.autoTranslate &&
        this.language !== this.post.language
      ) {
        const questionsIndexKey =
          this.getIndexTranslationKey('GroupQuestions');
        const answersIndexKey = this.getIndexTranslationKey('PostAnswers');
        if (
          window.appGlobals.cache.autoTranslateCache[questionsIndexKey] &&
          window.appGlobals.cache.autoTranslateCache[answersIndexKey]
        ) {
          this.translatedQuestions = window.appGlobals.cache.autoTranslateCache[
            questionsIndexKey
          ] as string[];
          this.translatedAnswers = window.appGlobals.cache.autoTranslateCache[
            answersIndexKey
          ] as string[];
        } else {
          const translatedResponse =
            (await window.serverApi.getSurveyTranslations(
              this.post,
              this.language!
            )) as string[][];

          if (
            this.post &&
            this.autoTranslate &&
            (this.language !== this.post.language || this.post.language == '??')
          ) {
            const translatedQuestionTexts = translatedResponse[0];
            const translatedAnswerTexts = translatedResponse[1];
            const currentQuestions = JSON.parse(
              JSON.stringify(
                this.post.Group.configuration.structuredQuestionsJson
              )
            );
            const currentAnswers = JSON.parse(
              JSON.stringify(this.post.public_data.structuredAnswersJson)
            );

            if (
              translatedQuestionTexts.length ===
              YpSurveyHelpers.getQuestionLengthWithSubOptions(currentQuestions)
            ) {
              let translationCounter = 0;
              for (let i = 0; i < currentQuestions.length; i++) {
                const question = currentQuestions[i];
                question.text = translatedQuestionTexts[translationCounter++];

                if (
                  question.type === 'radios' &&
                  question.radioButtons &&
                  question.radioButtons.length > 0
                ) {
                  translationCounter += question.radioButtons.length;
                } else if (
                  question.type === 'checkboxes' &&
                  question.checkboxes &&
                  question.checkboxes.length > 0
                ) {
                  translationCounter += question.checkboxes.length;
                } else if (
                  question.type === 'dropdown' &&
                  question.dropdownOptions &&
                  question.dropdownOptions.length > 0
                ) {
                  translationCounter += question.dropdownOptions.length;
                }
              }

              for (let i = 0; i < currentAnswers.length; i++) {
                if (currentAnswers[i].value) {
                  currentAnswers[i].value = translatedAnswerTexts[i];
                }
              }

              this.translatedQuestions = currentQuestions;
              this.translatedAnswers = currentAnswers;

              const questionsIndexKey =
                this.getIndexTranslationKey('GroupQuestions');
              const answersIndexKey =
                this.getIndexTranslationKey('PostAnswers');

              window.appGlobals.cache.autoTranslateCache[questionsIndexKey] =
                currentQuestions;
              window.appGlobals.cache.autoTranslateCache[answersIndexKey] =
                currentAnswers;
            } else {
              console.error(
                'Questions and Translated texts length does not match'
              );
            }
          } else {
            this.translatedQuestions = undefined;
            this.translatedAnswers = undefined;
          }
        }
      }
    }

    getIndexTranslationKey(textType: string) {
      return `${textType}-${this.post!.id}-${this.language}`;
    }

    get structuredAnswersFormatted() {
      if (
        this.post &&
        this.post.public_data &&
        this.post.public_data.structuredAnswersJson &&
        this.post.Group.configuration &&
        this.post.Group.configuration.structuredQuestionsJson
      ) {
        const questionHash: Record<string, YpStructuredQuestionData> = {};
        const showDescriptionBeforeIdHash: Record<
          string,
          YpStructuredQuestionData
        > = {};
        const showDescriptionAfterIdHash: Record<
          string,
          YpStructuredQuestionData
        > = {};
        let outText = '';
        this.post.Group.configuration.structuredQuestionsJson.forEach(
          question => {
            if (question.uniqueId) {
              questionHash[question.uniqueId] = question;
            } else {
              if (question.showBeforeAnswerId) {
                showDescriptionBeforeIdHash[question.showBeforeAnswerId] =
                  question;
              }

              if (question.showAfterAnswerId) {
                showDescriptionAfterIdHash[question.showAfterAnswerId] =
                  question;
              }
            }
          }
        );

        this.post.public_data.structuredAnswersJson.forEach(answer => {
          if (answer && answer.value) {
            const question = questionHash[answer.uniqueId];
            if (question) {
              if (showDescriptionBeforeIdHash[answer.uniqueId]) {
                outText +=
                  showDescriptionBeforeIdHash[answer.uniqueId].text + '\n\n';
              }
              outText += '<b>' + question.text + '</b>\n';

              if (answer.value) {
                outText += answer.value + '\n\n';
              } else {
                outText += '\n\n';
              }

              if (showDescriptionAfterIdHash[answer.uniqueId]) {
                outText +=
                  showDescriptionAfterIdHash[answer.uniqueId].text + '\n\n';
              }
            }
          }
        });

        return outText;
      } else {
        return '';
      }
    }
  }
  return YpPostBaseWithAnswersElement as Constructor<YpPostBaseWithAnswersInterface> &
    T;
};
