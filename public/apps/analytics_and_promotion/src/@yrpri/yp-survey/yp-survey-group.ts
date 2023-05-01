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
import { Radio } from '@material/mwc-radio';

import { Checkbox } from '@material/mwc-checkbox';

import { TextField } from '@material/mwc-textfield';
import { YpCollection } from '../yp-collection/yp-collection.js';
import { YpStructuredQuestionEdit } from './yp-structured-question-edit.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';

@customElement('yp-survey-group')
export class YpSurveyGroup extends YpBaseElement {
  @property({ type: Number })
  surveyGroupId: number | undefined;

  @property({ type: String })
  surveySubmitError: string | undefined;

  @property({ type: Boolean })
  surveyCompleted = false;

  @property({ type: Boolean })
  submitHidden = false;

  @property({ type: Object })
  surveyGroup: YpGroupData | undefined;

  @property({ type: Array })
  structuredQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Array })
  structuredAnswers: Array<YpStructuredAnswer> | undefined;

  @property({ type: Array })
  initiallyLoadedAnswers: Array<YpStructuredAnswer> | undefined;

  liveQuestionIds: Array<number> = [];

  uniqueIdsToElementIndexes: Record<string, number> = {};

  liveUniqueIds: Array<string> = [];

  liveUniqueIdsAll: Array<{ uniqueId: string; atIndex: number }> = [];

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('surveyGroupId')) {
      this._surveyGroupIdChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
        }

        #submitButton {
          margin-top: 8px;
          margin-bottom: 128px;
          background-color: var(--accent-color);
          color: #fff;
          font-size: 18px;
          padding: 16px;
        }

        .submitSpinnerContainer {
          height: 90px;
        }

        .surveyContainer {
          margin-left: 32px;
          margin-right: 32px;
          max-width: 800px;
          width: 800px;
        }

        @media (max-width: 800px) {
          yp-structured-question-edit {
            margin-left: 16px;
            padding-left: 0;
            padding-right: 0;
            margin-right: 16px;
          }

          .surveyContainer {
            margin-left: 0;
            margin-right: 0;
            max-width: 100%;
            width: 100%;
          }

          :host {
            width: 100vw;
          }
        }

        .surveyCompleted {
          font-size: 28px;
          margin: 128px;
        }
      `,
    ];
  }

  render() {
    return this.surveyGroup
      ? html`
          ${!this.surveyCompleted
            ? html`
                ${this.structuredQuestions
                  ? html`
                      <div class="layout vertical center-center">
                        <div class="surveyContainer">
                          <div id="surveyContainer">
                            ${this.structuredQuestions.map(
                              (question, index) => html`
                                <yp-structured-question-edit
                                  index="${index}"
                                  id="structuredQuestionContainer_${index}"
                                  .structuredAnswers="${this
                                    .initiallyLoadedAnswers}"
                                  @changed="${this._saveState}"
                                  .question="${question}"
                                  is-last-rating="${this._isLastRating(index)}"
                                  is-first-rating="${this._isFirstRating(
                                    index
                                  )}">
                                </yp-structured-question-edit>
                              `
                            )}
                          </div>
                          <div
                            class="layout horizontal center-center submitSpinnerContainer"></div>
                          <div
                            class="layout horizontal center-center"
                            ?hidden="${this.submitHidden}">
                            <mwc-button
                              id="submitButton"
                              raised
                              .label="${this.t('submitSurvey')}"
                              @click="${this._submit}"></mwc-button>
                          </div>
                        </div>
                      </div>
                    `
                  : html``}
              `
            : html`
                <div class="surveyCompleted layout vertical center-center">
                  ${this.surveyGroup.configuration.customThankYouTextNewPosts
                    ? html`
                        <yp-magic-text
                          id="customThankYouTextNewPostsId"
                          hidden
                          contentId="${this.surveyGroup.id}"
                          textOnly
                          content="${this.surveyGroup.configuration
                            .customThankYouTextNewPosts}"
                          .contentLanguage="${this.surveyGroup.language}"
                          textType="customThankYouTextNewPosts"></yp-magic-text>
                      `
                    : html` ${this.t('thankYouForCompletingTheSurvey')} `}
                </div>
              `}
        `
      : nothing;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-skip-to-unique-id', this._skipToId);
    this.addListener('yp-open-to-unique-id', this._openToId);
    this.addListener('yp-goto-next-index', this._goToNextIndex);
    this.addListener('yp-answer-content-changed', this._saveState);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-skip-to-unique-id', this._skipToId);
    this.removeListener('yp-open-to-unique-id', this._openToId);
    this.removeListener('yp-goto-next-index', this._goToNextIndex);
    this.removeListener('yp-answer-content-changed', this._saveState);
  }

  _isLastRating(index: number) {
    return (
      this.structuredQuestions![index].subType === 'rating' &&
      index + 2 < this.structuredQuestions!.length &&
      this.structuredQuestions![index + 1].subType !== 'rating'
    );
  }

  _isFirstRating(index: number) {
    return (
      this.structuredQuestions![index].subType === 'rating' &&
      this.structuredQuestions![index - 1] &&
      this.structuredQuestions![index - 1].subType !== 'rating'
    );
  }

  _openToId(event: CustomEvent) {
    this._skipToId(event, true);
  }

  _skipToId(event: CustomEvent, showItems: boolean) {
    let foundFirst = false;
    const children = (this.$$('#surveyContainer')!
      .children as unknown) as Array<YpStructuredQuestionEdit>;
    for (let i = 0; i < children.length; i++) {
      const toId = event.detail.toId.replace(/]/g, '');
      const fromId = event.detail.fromId.replace(/]/g, '');
      if (
        children[i + 1] &&
        children[i + 1].question &&
        children[i + 1].question.uniqueId &&
        children[i + 1].question.uniqueId!.substring(
          children[i + 1].question.uniqueId!.length - 1
        ) === 'a'
      ) {
        children[i].question.uniqueId = children[
          i + 1
        ].question.uniqueId!.substring(
          0,
          children[i + 1].question.uniqueId!.length - 1
        );
      }
      if (
        children[i].question &&
        event.detail.fromId &&
        children[i].question.uniqueId === fromId
      ) {
        foundFirst = true;
      } else if (
        children[i].question &&
        event.detail.toId &&
        (children[i].question.uniqueId === toId ||
          children[i].question.uniqueId === toId + 'a')
      ) {
        break;
      } else {
        if (foundFirst) {
          if (showItems) {
            children[i].hidden = false;
          } else {
            children[i].hidden = true;
          }
        }
      }
    }
  }

  _goToNextIndex(event: CustomEvent) {
    const currentPos = this.liveQuestionIds.indexOf(event.detail.currentIndex);
    if (currentPos < this.liveQuestionIds.length - 1) {
      const item = this.$$(
        '#structuredQuestionContainer_' + this.liveQuestionIds[currentPos + 1]
      ) as HTMLInputElement;
      item.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      item.focus();
    }
  }

  _serializeAnswers() {
    const answers: Array<YpStructuredAnswer> = [];
    this.liveQuestionIds.forEach(liveIndex => {
      const questionElement = this.$$(
        '#structuredQuestionContainer_' + liveIndex
      ) as YpStructuredQuestionEdit;
      if (questionElement) {
        const answer = questionElement.getAnswer();
        if (answer) answers.push(answer);
      }
    });
    this.structuredAnswers = answers;
  }

  async _submit() {
    if (this.surveyGroupId) {
      this._serializeAnswers();
      const response = (await window.serverApi.postSurvey(
        this.surveyGroup!.id,
        {
          structuredAnswers: this.structuredAnswers,
        }
      )) as YpSurveyPostResponse;

      if (response) {
        if (response.error) {
          this.surveySubmitError = response.error;
        } else {
          this.surveyCompleted = true;
        }
      }
    } else {
      console.error('No survey id to post to');
    }
  }

  _saveState(event: CustomEvent) {
    const detail = event.detail;
    if (detail && detail.value && (detail.value !== '' || detail.value > 1)) {
      this.submitHidden = false;
      this._serializeAnswers();
      localStorage.setItem(
        'yp-survey-response-for-' + this.surveyGroup!.id,
        JSON.stringify(this.structuredAnswers)
      );
    }
  }

  _clearState() {
    localStorage.setItem('yp-survey-response-for-' + this.surveyGroup!.id, '');
  }

  _checkAndLoadState() {
    const answers = localStorage.getItem(
      'yp-survey-response-for-' + this.surveyGroup!.id
    );
    if (answers) {
      this.structuredAnswers = JSON.parse(answers);
      this.initiallyLoadedAnswers = JSON.parse(answers);
    }
  }

  _isIpad() {
    return /iPad/.test(navigator.userAgent) && !window.MSStream;
  }

  _surveyGroupIdChanged() {
    if (this.surveyGroupId) {
      this.surveyGroup = undefined;
      this._getSurveyGroup();
    }
  }

  async _getSurveyGroup() {
    const surveyGroup = (await window.serverApi.getSurveyGroup(
      this.surveyGroupId!
    )) as YpGroupData | void;
    if (surveyGroup) {
      this.surveyGroup = surveyGroup;
      this.structuredQuestions = this.surveyGroup.configuration.structuredQuestionsJson;
      this.surveyGroup.configuration = window.appGlobals.overrideGroupConfigIfNeeded(
        this.surveyGroup.id,
        this.surveyGroup.configuration
      );

      this.refresh();
      setTimeout(() => {
        this.liveQuestionIds = [];
        this.liveUniqueIds = [];
        this.liveUniqueIdsAll = [];
        this.uniqueIdsToElementIndexes = {};
        if (this.structuredQuestions) {
          this.structuredQuestions.forEach((question, index) => {
            if (
              question.type &&
              question.uniqueId &&
              (question.type.toLowerCase() === 'textfield' ||
                question.type.toLowerCase() === 'textfieldlong' ||
                question.type.toLowerCase() === 'textarea' ||
                question.type.toLowerCase() === 'textarealong' ||
                question.type.toLowerCase() === 'numberfield' ||
                question.type.toLowerCase() === 'checkboxes' ||
                question.type.toLowerCase() === 'radios' ||
                question.type.toLowerCase() === 'dropdown')
            ) {
              this.liveQuestionIds.push(index);
              this.uniqueIdsToElementIndexes[question.uniqueId!] = index;
              this.liveUniqueIds.push(question.uniqueId!);
              this.liveUniqueIdsAll.push({
                uniqueId: question.uniqueId!,
                atIndex: index,
              });
            }
          });
        }
        this._checkAndLoadState();
      });
    }
  }

  refresh() {
    if (this.surveyGroup) {
      if (this.surveyGroup.configuration.defaultLocale != null) {
        window.appGlobals.changeLocaleIfNeeded(
          this.surveyGroup.configuration.defaultLocale
        );
      }

      window.appGlobals.analytics.setCommunityAnalyticsTracker(
        this.surveyGroup.Community?.google_analytics_code
      );

      if (
        this.surveyGroup.theme_id != null ||
        (this.surveyGroup.configuration &&
          this.surveyGroup.configuration.themeOverrideColorPrimary != null)
      ) {
        window.appGlobals.theme.setTheme(
          this.surveyGroup.theme_id,
          this.surveyGroup.configuration
        );
      } else if (
        this.surveyGroup.Community &&
        (this.surveyGroup.Community.theme_id != null ||
          (this.surveyGroup.Community.configuration &&
            this.surveyGroup.Community.configuration.themeOverrideColorPrimary))
      ) {
        window.appGlobals.theme.setTheme(
          this.surveyGroup.Community.theme_id,
          this.surveyGroup.Community.configuration
        );
      } else if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.Domain &&
        this.surveyGroup.Community.Domain.theme_id != null
      ) {
        window.appGlobals.theme.setTheme(
          this.surveyGroup.Community.Domain.theme_id
        );
      } else {
        window.appGlobals.theme.setTheme(1);
      }

      window.appGlobals.setAnonymousGroupStatus(this.surveyGroup);
      window.appGlobals.setRegistrationQuestionGroup(this.surveyGroup);

      if (
        this.surveyGroup.configuration &&
        this.surveyGroup.configuration.disableFacebookLoginForGroup === true
      ) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }

      if (
        this.surveyGroup.configuration &&
        this.surveyGroup.configuration.externalGoalTriggerUrl
      ) {
        window.appGlobals.externalGoalTriggerGroupId = this.surveyGroup.id;
      } else {
        window.appGlobals.externalGoalTriggerGroupId = undefined;
      }

      if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.configuration &&
        this.surveyGroup.Community.configuration.signupTermsPageId &&
        this.surveyGroup.Community.configuration.signupTermsPageId != -1
      ) {
        window.appGlobals.signupTermsPageId = this.surveyGroup.Community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = undefined;
      }

      if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.configuration &&
        this.surveyGroup.Community.configuration.customSamlDeniedMessage
      ) {
        window.appGlobals.currentSamlDeniedMessage = this.surveyGroup.Community.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = undefined;
      }

      if (
        this.surveyGroup.Community &&
        this.surveyGroup.Community.configuration &&
        this.surveyGroup.Community.configuration.customSamlLoginMessage
      ) {
        window.appGlobals.currentSamlLoginMessage = this.surveyGroup.Community.configuration.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = undefined;
      }

      window.appGlobals.currentGroup = this.surveyGroup;

      if (
        (this.surveyGroup.configuration &&
          this.surveyGroup.configuration.forceSecureSamlLogin &&
          !YpAccessHelpers.checkGroupAccess(this.surveyGroup)) ||
        (this.surveyGroup.Community &&
          this.surveyGroup.Community.configuration &&
          this.surveyGroup.Community.configuration.forceSecureSamlLogin &&
          !YpAccessHelpers.checkCommunityAccess(this.surveyGroup.Community))
      ) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }
    }
  }
}
