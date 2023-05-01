import { html, css, nothing, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/mwc-circular-progress-four-color';
import { CircularProgressFourColorBase } from '@material/mwc-circular-progress-four-color/mwc-circular-progress-four-color-base';
import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-snackbar';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-radio';
import '@material/mwc-formfield';
import '@material/mwc-select';
import { TextArea } from '@material/mwc-textarea';
import { DateTime } from 'luxon';

import { Radio } from '@material/mwc-radio';
import { Snackbar } from '@material/mwc-snackbar';
import { YpEditBase } from '../common/yp-edit-base.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpMagicText } from '../yp-magic-text/yp-magic-text.js';
import { YpFileUpload } from '../yp-file-upload/yp-file-upload.js';
import { YpEditDialog } from '../yp-edit-dialog/yp-edit-dialog.js';
import { YpEmojiSelector } from '../common/yp-emoji-selector.js';
import { YpStructuredQuestionEdit } from '../yp-survey/yp-structured-question-edit.js';

import './yp-post-location.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import '../yp-survey/yp-structured-question-edit.js';
import { YpSurveyHelpers } from '../yp-survey/YpSurveyHelpers.js';

export const EditPostTabs: Record<string, number> = {
  Description: 0,
  Point: 1,
  Location: 2,
  Media: 3,
};

@customElement('yp-post-edit')
export class YpPostEdit extends YpEditBase {
  @property({ type: String })
  action = '/posts';

  @property({ type: Boolean })
  newPost = false;

  @property({ type: Number })
  selectedCategoryArrayId: number | undefined;

  @property({ type: Array })
  initialStructuredAnswersJson: Array<YpStructuredAnswer> | undefined;

  @property({ type: Array })
  structuredQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Boolean })
  locationHidden = false;

  @property({ type: Object })
  location: YpLocationData | undefined;

  @property({ type: String })
  encodedLocation: string | undefined;

  @property({ type: Number })
  selectedCategoryId: number | undefined;

  @property({ type: Number })
  uploadedVideoId: number | undefined;

  @property({ type: Number })
  uploadedAudioId: number | undefined;

  @property({ type: Number })
  currentVideoId: number | undefined;

  @property({ type: Number })
  currentAudioId: number | undefined;

  @property({ type: Number })
  selected = 0;

  @property({ type: Boolean })
  mapActive = false;

  @property({ type: Boolean })
  hasOnlyOneTab = false;

  @property({ type: Number })
  postDescriptionLimit: number | undefined;

  @property({ type: String })
  sructuredAnswersString: string | undefined;

  @property({ type: String })
  structuredAnswersJson = '';

  @property({ type: String })
  structuredAnswersString = '';

  @property({ type: Array })
  translatedQuestions: Array<YpStructuredQuestionData> | undefined;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: String })
  uploadedDocumentUrl: string | undefined;

  @property({ type: String })
  uploadedDocumentFilename: string | undefined;

  @property({ type: String })
  selectedCoverMediaType = 'none';

  @property({ type: Number })
  uploadedHeaderImageId: number | undefined;

  @property({ type: String })
  customTitleQuestionText: string | undefined;

  emailValidationPattern =
    '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';

  liveQuestionIds: Array<number> = [];

  uniqueIdsToElementIndexes: Record<string, number> = {};

  liveUniqueIds: Array<string> = [];

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('post')) {
      this._postChanged();
    }

    if (changedProperties.has('locationHidden')) {
      this._locationHiddenChanged();
    }

    if (changedProperties.has('location')) {
      this._locationChanged();
    }

    if (changedProperties.has('selectedCategoryArrayId')) {
      this._selectedCategoryChanged();
    }

    if (changedProperties.has('selectedCoverMediaType')) {
      this._uploadedHeaderImageIdChanged();
    }
    if (changedProperties.has('group')) {
      this._groupChanged();
    }

    if (changedProperties.has('selected')) {
      this._selectedChanged();
      const a = this.selected;
    }

    this._setupStructuredQuestions();
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


  _groupChanged() {
    if (this.group &&
        this.group.configuration &&
        this.group.configuration.structuredQuestionsJson &&
        this.group.configuration.structuredQuestionsJson.length > 0) {
      if (window.autoTranslate) {
        this.autoTranslate = window.autoTranslate;
      }
      this._getTranslationsIfNeeded();
    }
   }

  static get styles() {
    return [
      super.styles,
      css`
        .access {
        }

        mwc-button {
          background-color: var(--accent-color);
          color: #fff;
        }

        yp-file-upload {
          margin-top: 16px;
        }

        .accessHeader {
          color: var(--primary-color, #777);
          font-weight: normal;
          margin-bottom: 0;
        }

        mwc-radio {
          display: block;
        }

        div {
          font-family: var(--app-header-font-family, Roboto);
        }

        .container {
          width: 100%;
          width: 100%;
        }

        yp-post-location {
          min-height: 320px;
        }

        @media (max-width: 600px) {
          .container {
            padding-right: 16px;
          }

          .subContainer {
          }

          mwc-tab {
            font-size: 12px;
          }
        }

        yp-post-location {
        }

        section {
          margin-top: 32px;
        }

        .imageSizeInfo {
          font-size: 12px;
          padding-bottom: 16px;
          color: #444;
        }

        mwc-select {
          max-width: 250px;
        }

        .optional {
          font-size: 12px;
        }

        .icon {
          padding-right: 8px;
        }

        [hidden] {
          display: none !important;
        }

        mwc-checkbox {
          margin-left: 8px;
          margin-top: 4px;
        }

        section {
          width: 100%;
        }

        .contactInfo {
          margin-top: 16px;
        }

        #description {
          --mwc-textfield-container-input: {
            max-height: 125px;
          }
        }

        .postEmoji {
          margin-left: 16px;
          direction: ltr !important;
        }

        .pointEmoji {
          direction: ltr !important;
        }

        .uploadSection {
          max-width: 220px;
          vertical-align: top;
          margin-left: 8px;
          margin-right: 8px;
        }

        @media (max-width: 600px) {
          .uploadSection {
            max-width: 100%;
          }

          .videoCam {
          }

          yp-structured-question-edit {
            max-width: calc(100vw - 64px);
          }
        }

        .postCoverVideoInfo {
          margin-top: 8px;
        }

        .videoUploadDisclamer {
          margin-top: 6px;
          font-size: 12px;
          padding: 0;
          max-width: 200px;
        }

        .categoryDropDown {
          margin-bottom: 8px;
        }

        .topNewPostContainer[no-title] {
          margin-top: -42px;
        }

        mwc-tab-bar[title-disabled] {
          margin-bottom: 24px;
        }

        .videoCamIcon {
          margin-left: 6px;
          margin-bottom: 2px;
        }

        .mediaTab {
          vertical-align: center;
        }

        #pointFor {
          width: 100%;
        }

        .attachmentInfo {
          margin-top: -8px;
          margin-left: 8px;
        }
      `,
    ];
  }

  _setSelectedTab(event: CustomEvent) {
    this.selected = event.detail.index;
  }

  renderTabs() {
    return html`
      <mwc-tab-bar
        ?title-disabled="${this.group!.configuration
          .hideNameInputAndReplaceWith}"
        .activeIndex="${this.selected}"
        @MDCTabBar:activated="${this._setSelectedTab}"
        id="paperTabs"
        focused
        ?hidden="${this.hasOnlyOneTab}">
        <mwc-tab
          stacked
          .label="${this.t('post.yourPost')}"
          icon="lightbulb_outline"></mwc-tab>

        ${this.newPointShown
          ? html`
              <mwc-tab
                stacked
                icon="comment"
                .label="${this.t('post.yourPoint')}">
              </mwc-tab>
            `
          : nothing}
        ${!this.locationHidden
          ? html`
              <mwc-tab
                stacked
                icon="location_on"
                .label="${this.t('post.location')}"></mwc-tab>
            `
          : nothing}
        ${!this.mediaHidden
          ? html`
              <mwc-tab stacked icon="videocam" .label=" ${this.t('media')}">
              </mwc-tab>
            `
          : nothing}
      </mwc-tab-bar>
    `;
  }

  renderMoreContactInfo() {
    return html`
      <h2 class="contactInfo">
        ${this.t('contactInformation')}
      </h2>
      <mwc-textfield
        id="contactName"
        name="contactName"
        type="text"
        .label="${this.t('user.name')}"
        charCounter>
      </mwc-textfield>
      <mwc-textfield
        id="contactEmail"
        name="contactEmail"
        type="text"
        .label="${this.t('user.email')}"
        charCounter>
      </mwc-textfield>
      <mwc-textfield
        id="contactTelephone"
        name="contacTelephone"
        type="text"
        .label="${this.t('contactTelephone')}"
        maxlength="20"
        charCounter>
      </mwc-textfield>
      <mwc-textfield
        id="contactAddress"
        name="contactAddress"
        type="text"
        ?hidden="${!this.group!.configuration.moreContactInformationAddress}"
        .label="${this.t('contactAddress')}"
        maxlength="300"
        charCounter>
      </mwc-textfield>
    `;
  }

  get titleQuestionText() {
    if (this.post && this.group && this.customTitleQuestionText) {
      return this.customTitleQuestionText;
    } if (
      this.post &&
      this.group &&
      this.group.configuration &&
      this.group.configuration.customTitleQuestionText
    ) {
      return this.group.configuration.customTitleQuestionText;
    } else {
      return this.t('title');
    }
  }

  renderDescriptionTab() {
    return this.group
      ? html`
          <section>
            <div class="layout vertical flex">
              ${this.group.configuration.hideNameInputAndReplaceWith
                ? html`
                    <input
                      type="hidden"
                      name="name"
                      .value="${this.replacedName || ''}" />
                  `
                : this.post
                ? html`
                    <mwc-textfield
                      id="name"
                      required
                      minlength="1"
                      name="name"
                      type="text"
                      .label="${this.titleQuestionText}"
                      .value="${this.post.name}"
                      maxlength="60"
                      charCounter>
                    </mwc-textfield>
                  `
                : nothing}
              ${this.showCategories && this.group.Categories
                ? html`
                    <mwc-select
                      class="categoryDropDown"
                      .label="${this.t('category.select')}"
                      @selected="${this._selectedCategory}"
                      ?required="${this.group.configuration
                        .makeCategoryRequiredOnNewPost}">
                      ${this.group.Categories.map(
                        category => html`
                          <mwc-list-item .data-category-id="${category.id}"
                            >${category.name}</mwc-list-item
                          >
                        `
                      )}
                    </mwc-select>
                    <input
                      type="hidden"
                      name="categoryId"
                      .value="${this.selectedCategoryId
                        ? this.selectedCategoryId.toString()
                        : ''}" />
                  `
                : nothing}
              ${this.group && this.group.configuration && this.group.configuration.usePostTags
                ? html`
                    <mwc-textfield
                      id="name"
                      name="tags"
                      type="text"
                      .label="${this.t('commaSeperatedTags')}"
                      .value="${this.post!.public_data!.tags}"
                      >
                    </mwc-textfield>`
                : nothing}
              ${this.postDescriptionLimit
                ? html`
                    <mwc-textarea
                      id="description"
                      ?hidden="${this.structuredQuestions != null}"
                      ?required="${this.structuredQuestions == null}"
                      minlength="1"
                      name="description"
                      .value="${this.post!.description}"
                      .label="${this.t('post.description')}"
                      @change="${this._resizeScrollerIfNeeded}"
                      char-counter
                      rows="2"
                      max-rows="5"
                      maxrows="5"
                      maxlength="${this.postDescriptionLimit}">
                    </mwc-textarea>

                    <div
                      class="horizontal end-justified layout postEmoji"
                      ?hidden="${this.group.configuration.hideEmoji}">
                      <emoji-selector
                        id="emojiSelectorDescription"
                        ?hidden="${this.structuredQuestions !=
                        undefined}"></emoji-selector>
                    </div>
                  `
                : nothing}
              ${this.structuredQuestions != undefined
                ? html`
                    ${this.structuredQuestions.map(
                      (
                        question: YpStructuredQuestionData,
                        index: number
                      ) => html`
                        <yp-structured-question-edit
                          .index="${index}"
                          is-from-new-post
                          use-small-font
                          id="structuredQuestionContainer_${index}"
                          ?dontFocusFirstQuestion="${!this.group!.configuration
                            .hideNameInputAndReplaceWith}"
                          @resize-scroller="${this._resizeScrollerIfNeeded}"
                          .structuredAnswers="${this
                            .initialStructuredAnswersJson}"
                          ?isLastRating="${this._isLastRating(index)}"
                          ?isFirstRating="${this._isFirstRating(index)}"
                          ?hideQuestionIndex="${this.group!.configuration
                            .hideQuestionIndexOnNewPost}"
                          .question="${question}">
                        </yp-structured-question-edit>
                      `
                    )}
                  `
                : nothing}
              ${this.group.configuration.attachmentsEnabled
                ? html`
                    <yp-file-upload
                      id="attachmentFileUpload"
                      raised
                      attachmentUpload
                      buttonIcon="attach_file"
                      .group="${this.group}"
                      .buttonText="${this.t('uploadAttachment')}"
                      accept="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,image/*"
                      .target="/api/groups/${this.group.id}/upload_document"
                      method="POST"
                      @success="${this._documentUploaded}">
                    </yp-file-upload>
                    <small class="attachmentInfo">${this.t('documentOnlyVisibleToAdmins')}</small>

                    ${this.post!.data?.attachment?.url
                      ? html`
                          <mwc-checkbox name="deleteAttachment"
                            >${this.t('deleteAttachment')}:
                            ${this.post!.data.attachment.filename}</mwc-checkbox
                          >
                        `
                      : nothing}
                  `
                : nothing}
              ${this.group.configuration.moreContactInformation
                ? this.renderMoreContactInfo()
                : nothing}
            </div>
          </section>
        `
      : nothing;
  }

  renderPointTab() {
    return this.newPointShown
      ? html`
          <section class="subContainer">
            <mwc-textarea
              id="pointFor"
              ?required="${!this.group!.configuration.newPointOptional}"
              minlength="1"
              name="pointFor"
              .value="${this.post!.pointFor || ''}"
              .label="${this.t('point.for')}"
              charCounter
              rows="2"
              max-rows="5"
              .maxlength="${this.pointMaxLength}">
            </mwc-textarea>
            <div
              class="horizontal end-justified layout pointEmoji"
              ?hidden="${this.group!.configuration.hideEmoji}">
              <emoji-selector id="emojiSelectorPointFor"></emoji-selector>
            </div>
          </section>
        `
      : nothing;
  }

  renderLocationTab() {
    return !this.locationHidden
      ? html`
          <section>
            ${this.mapActive && this.group
              ? html`
                  <yp-post-location
                    .encodedLocation="${this.encodedLocation}"
                    .location="${this.location}"
                    .group="${this.group}"
                    .post="${this.post}"></yp-post-location>
                `
              : nothing}
          </section>
        `
      : nothing;
  }

  renderCoverMediaSelection() {
    return html`
      <h3 class="accessHeader">${this.t('post.cover.media')}</h3>
      <div
        id="coverMediaType"
        name="coverMediaType"
        class="coverMediaType layout horizontal wrap"
        .selected="${this.selectedCoverMediaType}">
        <mwc-formfield label="${this.t('post.cover.none')}">
          <mwc-radio
            value="none"
            id="mediaNone"
            ?checked="${this.selectedCoverMediaType === 'none'}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        <mwc-formfield
          label="${this.t('post.cover.image')}"
          ?hidden="${!this.uploadedHeaderImageId}">
          <mwc-radio
            value="image"
            id="mediaImage"
            ?checked="${this.selectedCoverMediaType === 'image'}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        <mwc-formfield
          label="${this.t('postCoverVideo')}"
          ?hidden="${!this.showVideoCover}">
          <mwc-radio
            value="video"
            id="mediaVideo"
            ?checked="${this.selectedCoverMediaType === 'video'}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        <mwc-formfield
          label="${this.t('postCoverAudio')}"
          ?hidden="${!this.showAudioCover}">
          <mwc-radio
            value="audio"
            id="mediaAudio"
            ?checked="${this.selectedCoverMediaType === 'audio'}"
            @change="${this._setSelectedCoverMediaType}"
            name="radioButtonsMedia">
          </mwc-radio>
        </mwc-formfield>

        ${this.location
          ? html`
              <mwc-formfield label="${this.t('post.cover.map')}">
                <mwc-radio
                  value="map"
                  ?checked="${this.selectedCoverMediaType === 'map'}"
                  id="mediaMap"
                  @change="${this._setSelectedCoverMediaType}"
                  name="radioButtonsMedia">
                </mwc-radio>
              </mwc-formfield>

              <mwc-formfield label="${this.t('post.cover.streetview')}">
                <mwc-radio
                  value="streetView"
                  id="mediaStreetview"
                  ?checked="${this.selectedCoverMediaType === 'streetView'}"
                  @change="${this._setSelectedCoverMediaType}"
                  name="radioButtonsMedia">
                </mwc-radio>
              </mwc-formfield>
            `
          : nothing}
      </div>
    `;
  }

  renderMediaTab() {
    return html`
      <section>
        <div class="layout vertical center-center">
          <div class="layout horizontal center-center wrap">
            <div
              class="layout vertical center-center self-start uploadSection"
              ?hidden="${this.group!.configuration.hidePostImageUploads}">
              <yp-file-upload
                id="imageFileUpload"
                raised
                target="/api/images?itemType=post-header"
                method="POST"
                buttonIcon="photo_camera"
                .buttonText="${this.t('image.upload')}"
                @success="${this._imageUploaded}">
              </yp-file-upload>
              <div class="imageSizeInfo layout horizontal">
                <div>864 x 486 (16/9 widescreen)</div>
              </div>
              <div>${this.t('post.cover.imageInfo')}</div>
            </div>

            ${this.group!.configuration.allowPostVideoUploads
              ? html`
                  <div
                    class="layout vertical center-center self-start uploadSection">
                    <yp-file-upload
                      id="videoFileUpload"
                      container-type="posts"
                      .group="${this.group}"
                      raised
                      .uploadLimitSeconds="${this.group!.configuration
                        .videoPostUploadLimitSec}"
                      videoUpload
                      buttonIcon="videocam"
                      .buttonText="${this.t('uploadVideo')}"
                      method="POST"
                      @success="${this._videoUploaded}">
                    </yp-file-upload>
                    <div
                      class="videoUploadDisclamer"
                      ?hidden="${!this.group!.configuration
                        .showVideoUploadDisclaimer || !this.uploadedVideoId}">
                      ${this.t('videoUploadDisclaimer')}
                    </div>
                  </div>
                `
              : nothing}
            ${this.group!.configuration.allowPostAudioUploads
              ? html`
                  <div
                    class="layout vertical center-center self-start uploadSection">
                    <yp-file-upload
                      id="audioFileUpload"
                      containerType="posts"
                      .group="${this.group}"
                      raised
                      .uploadLimitSeconds="${this.group!.configuration
                        .audioPostUploadLimitSec}"
                      .multi="false"
                      audioUpload
                      method="POST"
                      buttonIcon="keyboard_voice"
                      .buttonText="${this.t('uploadAudio')}"
                      @success="${this._audioUploaded}">
                    </yp-file-upload>
                  </div>
                `
              : nothing}
          </div>
          <br />
          ${this.renderCoverMediaSelection()}
        </div>
      </section>
    `;
  }

  _setSelectedCoverMediaType(event: CustomEvent) {
    this.selectedCoverMediaType = (event.target as HTMLInputElement).value;
  }

  get _pointPageHidden() {
    return !this.newPointShown || this.selected !== EditPostTabs.Point;
  }

  get _mediaPageHidden() {
    if (this.mediaHidden) {
      return true;
    } if (
      this.newPointShown &&
      !this.locationHidden &&
      this.selected !== EditPostTabs.Media
    ) {
      return true;
    } else if (
      this.newPointShown &&
      this.locationHidden &&
      this.selected !== EditPostTabs.Media - 1
    ) {
      return true;
    } else if (
      !this.newPointShown &&
      this.locationHidden &&
      this.selected !== EditPostTabs.Media - 2
    ) {
      return true;
    } else if (
      !this.newPointShown &&
      !this.locationHidden &&
      this.selected !== EditPostTabs.Media - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  renderCurrentTabPage(): TemplateResult | undefined | {} {
    return html`
      <div ?hidden="${this.selected !== EditPostTabs.Description}">
        ${this.renderDescriptionTab()}
      </div>
      <div ?hidden="${this._pointPageHidden}">
        ${this.renderPointTab()}
      </div>
      <div ?hidden="${false}">
        ${this.renderLocationTab()}
      </div>
      <div ?hidden="${this._mediaPageHidden}">
        ${this.renderMediaTab()}
      </div>
    `;
  }

  renderHiddenInputs() {
    return html` <input
        type="hidden"
        name="location"
        .value="${this.encodedLocation || ''}" />
      <input
        type="hidden"
        name="coverMediaType"
        .value="${this.selectedCoverMediaType}" />
      <input
        type="hidden"
        name="uploadedHeaderImageId"
        .value="${this.uploadedHeaderImageId
          ? this.uploadedHeaderImageId.toString()
          : ''}" />
      <input
        type="hidden"
        name="uploadedDocumentUrl"
        .value="${this.uploadedDocumentUrl || ''}" />
      <input
        type="hidden"
        name="uploadedDocumentFilename"
        .value="${this.uploadedDocumentFilename || ''}" />
      <input
        type="hidden"
        name="structuredAnswers"
        .value="${this.structuredAnswersString}" />
      <input
        type="hidden"
        name="structuredAnswersJson"
        .value="${this.structuredAnswersJson}" />`;
  }

  render() {
    return html`
      <yp-edit-dialog
        name="postEdit"
        doubleWidth
        id="editDialog"
        icon="lightbulb_outline"
        .action="${this.action}"
        .useNextTabAction="${this.newPost}"
        @next-tab-action="${this._nextTab}"
        .method="${this.method}"
        .heading="${this.editHeaderText ? this.editHeaderText : ''}"
        .saveText="${this.saveText}"
        class="container"
        customSubmit
        .nextActionText="${this.t('next')}"
        .snackbarText="${this.snackbarText}"
        .params="${this.params}">
        ${this.group && this.post
          ? html`
              <div
                class="layout vertical wrap topNewPostContainer"
                ?no-title="${this.group.configuration
                  .hideNameInputAndReplaceWith}">
                ${this.renderTabs()} ${this.renderCurrentTabPage()}
              </div>
              ${this.renderHiddenInputs()}
            `
          : nothing}
      </yp-edit-dialog>

      ${this.group &&
      this.group.configuration.alternativeTextForNewIdeaButtonHeader
        ? html`
            <yp-magic-text
              id="alternativeTextForNewIdeaButtonHeaderId"
              hidden
              .contentId="${this.group.id}"
              textOnly
              .content="${this.group.configuration
                .alternativeTextForNewIdeaButtonHeader}"
              .contentLanguage="${this.group.language}"
              @new-translation="${this
                ._alternativeTextForNewIdeaButtonHeaderTranslation}"
              text-type="alternativeTextForNewIdeaButtonHeader"></yp-magic-text>
          `
        : nothing}
      ${this.group && this.group.configuration.customThankYouTextNewPosts
        ? html`
            <yp-magic-text
              id="customThankYouTextNewPostsId"
              hidden
              .contentId="${this.group.id}"
              text-only
              .content="${this.group.configuration.customThankYouTextNewPosts}"
              .contentLanguage="${this.group.language}"
              text-type="customThankYouTextNewPosts"></yp-magic-text>
          `
        : nothing}
      ${this.group && this.group.configuration.customTitleQuestionText
        ? html`
            <yp-magic-text
              id="customTitleQuestionTextId"
              hidden
              .contentId="${this.group.id}"
              text-only
              .content="${this.group.configuration.customTitleQuestionText}"
              .contentLanguage="${this.group.language}"
              @new-translation="${this._updatePostTitle}"
              text-type="customTitleQuestionText"></yp-magic-text>
          `
        : nothing}
      ${this.group && this.group.configuration.alternativeTextForNewIdeaSaveButton
        ? html`
            <yp-magic-text
              id="alternativeTextForNewIdeaSaveButtonId"
              hidden
              .contentId="${this.group.id}"
              text-only
              .content="${this.group.configuration.alternativeTextForNewIdeaSaveButton}"
              .contentLanguage="${this.group.language}"
              @new-translation="${this._alternativeTextForNewIdeaSaveButtonTranslation}"
              text-type="alternativeTextForNewIdeaSaveButton"></yp-magic-text>
          `
        : nothing}
    `;
  }

  _alternativeTextForNewIdeaSaveButtonTranslation() {
    setTimeout(() => {
      const label = this.$$("#alternativeTextForNewIdeaSaveButtonId") as YpMagicText;
      if (label && label.finalContent) {
        this.saveText = label.finalContent;
      }
    });
  }

  _updatePostTitle() {
    setTimeout( ()=> {
      const label = this.$$("#customTitleQuestionTextId") as YpMagicText;
      if (label && label.finalContent) {
        this.customTitleQuestionText = label.finalContent;
      }
    });
  }

  //TODO: Investigate if any are missing .html version of listeners
  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-form-invalid', this._formInvalid);
    this.addListener('yp-custom-form-submit', this._customSubmit);
    this.addListener('yp-skip-to-unique-id', this._skipToId);
    this.addListener('yp-open-to-unique-id', this._openToId);
    this.addListener('yp-goto-next-index', this._goToNextIndex);
    this.addGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-form-invalid', this._formInvalid);
    this.removeListener('yp-custom-form-submit', this._customSubmit);
    this.removeListener('yp-skip-to-unique-id', this._skipToId);
    this.removeListener('yp-open-to-unique-id', this._openToId);
    this.removeListener('yp-goto-next-index', this._goToNextIndex);
    this.removeGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
  }

  hasLongSaveText() {
    return (this.saveText && this.saveText.length>9);
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
    this._getTranslationsIfNeeded();
  }

  _isLastRating(index: number) {
    return (
      this.structuredQuestions &&
      this.structuredQuestions[index].subType === 'rating' &&
      index + 2 < this.structuredQuestions.length &&
      this.structuredQuestions[index + 1].subType !== 'rating'
    );
  }

  _isFirstRating(index: number) {
    return (
      this.structuredQuestions &&
      this.structuredQuestions[index].subType === 'rating' &&
      this.structuredQuestions[index - 1] &&
      this.structuredQuestions[index - 1].subType !== 'rating'
    );
  }

  _openToId(event: CustomEvent) {
    this._skipToId(event, true);
  }

  _goToNextIndex(event: CustomEvent) {
    const currentPos = this.liveQuestionIds.indexOf(event.detail.currentIndex);
    if (currentPos < this.liveQuestionIds.length - 1) {
      const item = this.$$(
        '#structuredQuestionContainer_' + this.liveQuestionIds[currentPos + 1]
      ) as HTMLElement;
      item.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      item.focus();
    }
  }

  _skipToId(event: CustomEvent, showItems: boolean) {
    let foundFirst = false;
    if (this.$$('#surveyContainer')) {
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
              (children[i] as HTMLElement).hidden = false;
            } else {
              (children[i] as HTMLElement).hidden = true;
            }
          }
        }
      }
    } else {
      console.error('No survey container found');
    }
  }

  get replacedName() {
    const {post} = this;
    const {group} = this;
    if (post && group && group.configuration.hideNameInputAndReplaceWith) {
      let text = group.configuration.hideNameInputAndReplaceWith;
      text = text.replace(
        '<DATESECONDS>',
        DateTime.now().toFormat('DD/MM/YYYY hh:mm:ss')
      );
      text = text.replace(
        '<DATEMINUTES>',
        DateTime.now().toFormat('DD/MM/YYYY hh:mm')
      );
      text = text.replace('<DATE>', DateTime.now().toFormat('DD/MM/YYYY'));
      return text;
    }

    return null;
  }

  get pointMaxLength() {
    const {group} = this;
    if (group && group.configuration && group.configuration.pointCharLimit) {
      return group.configuration.pointCharLimit;
    }
      return 500;

  }

  _floatIfValueOrIE(value: boolean) {
    const ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  get newPointShown() {
    let hideNewPoint = false;
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.hideNewPointOnNewIdea === true
    ) {
      hideNewPoint = true;
    }

    return this.newPost && !hideNewPoint;
  }

  _submitWithStructuredQuestionsJson() {
    const answers: Array<YpStructuredAnswer> = [];
    this.liveQuestionIds.forEach(liveIndex => {
      const questionElement = this.$$(
        '#structuredQuestionContainer_' + liveIndex
      ) as YpStructuredQuestionEdit;
      if (questionElement) {
        const answer = questionElement.getAnswer();
        if (answer) {
          answers.push(answer);
        } else {
          console.error("Can't find answer to question");
        }
      }
    });
    this.structuredAnswersJson = JSON.stringify(answers);
    (this.$$('#editDialog') as YpEditDialog)._reallySubmit();
  }

  _submitWithStructuredQuestionsString() {
    let description = '';
    let answers = '';

    for (let i = 0; i < this.structuredQuestions!.length; i += 1) {
      description += this.structuredQuestions![i].text;
      if (
        this.structuredQuestions![i].text &&
        this.structuredQuestions![i].text[
          this.structuredQuestions![i].text.length - 1
        ] !== '?'
      )
        description += ':';
      description += '\n';
      description += this.structuredQuestions![i].value;
      answers += this.structuredQuestions![i].value;
      if (i !== this.structuredQuestions!.length - 1) {
        answers += '%!#x';
        description += '\n\n';
      }
    }
    if (this.post) this.post.description = description;
    this.structuredAnswersString = answers;
    (this.$$('#editDialog') as YpEditDialog)._reallySubmit();
  }

  _customSubmit() {
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.structuredQuestionsJson
    ) {
      this._submitWithStructuredQuestionsJson();
    } else if (
      this.structuredQuestions &&
      this.structuredQuestions.length > 0
    ) {
      this._submitWithStructuredQuestionsString();
    } else {
      (this.$$('#editDialog') as YpEditDialog)._reallySubmit();
    }
  }

  _resizeScrollerIfNeeded() {
    (this.$$('#editDialog') as YpEditDialog).scrollResize();
  }

  _getStructuredQuestionsString() {
    const structuredQuestions: Array<YpStructuredQuestionData> = [];

    const questionComponents = this.group!.configuration.structuredQuestions!.split(
      ','
    );
    for (let i = 0; i < questionComponents.length; i += 2) {
      const question = questionComponents[i];
      const maxLength = questionComponents[i + 1];
      structuredQuestions.push({
        text: question,
        maxLength: parseInt(maxLength),
        value: '',
      });
    }
    if (
      !this.newPost &&
      this.post &&
      this.post.public_data &&
      this.post.public_data.structuredAnswers &&
      this.post.public_data.structuredAnswers !== ''
    ) {
      const answers = this.post.public_data.structuredAnswers.split('%!#x');
      for (let i = 0; i < answers.length; i += 1) {
        if (structuredQuestions[i]) structuredQuestions[i].value = answers[i];
      }
    }

    return structuredQuestions;
  }

  _setupStructuredQuestions() {
    const {post} = this;
    const {group} = this;
    if (this.translatedQuestions) {
      this.structuredQuestions = this.translatedQuestions;
    } else if (post && group && group.configuration.structuredQuestionsJson) {
      this.structuredQuestions = group.configuration.structuredQuestionsJson;
    } else if (
      post &&
      group &&
      group.configuration.structuredQuestions &&
      group.configuration.structuredQuestions !== ''
    ) {
      this.structuredQuestions = this._getStructuredQuestionsString();
    } else {
      return undefined;
    }
  }

  get showVideoCover() {
    return this.uploadedVideoId || this.currentVideoId;
  }

  get showAudioCover() {
    return this.uploadedAudioId || this.currentAudioId;
  }

  _videoUploaded(event: CustomEvent) {
    this.uploadedVideoId = event.detail.videoId;
    (this.$$('#mediaVideo') as Radio).checked = true;
    setTimeout(() => {
      this.fire('iron-resize');
    }, 50);
  }

  _audioUploaded(event: CustomEvent) {
    this.uploadedAudioId = event.detail.audioId;
    this.selectedCoverMediaType = 'audio';
    setTimeout(() => {
      this.fire('iron-resize');
    });
  }

  _documentUploaded(event: CustomEvent) {
    const responseURL = event.detail.xhr.responseURL.split("?")[0];
    this.uploadedDocumentUrl = responseURL;
    this.uploadedDocumentFilename = event.detail.filename;
  }

  customFormResponse() {
    window.appGlobals.groupLoadNewPost = true;
  }

  _updateEmojiBindings() {
    setTimeout(() => {
      const description = this.$$('#description') as HTMLInputElement;
      const emojiSelector = this.$$(
        '#emojiSelectorDescription'
      ) as YpEmojiSelector;
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Post edit: Can't bind emojis :(");
      }
      const emojiSelectorPointFor = this.$$(
        '#emojiSelectorPointFor'
      ) as YpEmojiSelector;
      const pointFor = this.$$('#pointFor') as HTMLInputElement;
      if (emojiSelectorPointFor && pointFor) {
        emojiSelectorPointFor.inputTarget = pointFor;
      }
    }, 500);
  }

  _locationHiddenChanged() {
    /*TODO: See if we need this
    setTimeout( () => {
      const pages = this.$$('#pages');
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      const paperTabs = this.$$('#paperTabs');
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
      }
      console.log('Location hidden changed');
    }, 10); */
  }

  _formInvalid() {
    if (
      this.newPointShown &&
      !(this.$$('#pointFor') as TextArea).checkValidity()
    ) {
      this.selected = 1;
    } else {
      this.selected = 0;
    }
    if (this.$$('#name')) (this.$$('#name') as TextArea).autoValidate = true;
    if (this.$$('#description'))
      (this.$$('#description') as TextArea).autoValidate = true;
    if (this.newPointShown) {
      (this.$$('#pointFor') as TextArea).autoValidate = true;
    }
  }

  _locationChanged() {
    if (
      this.location &&
      (!this.selectedCoverMediaType ||
        this.selectedCoverMediaType == '' ||
        this.selectedCoverMediaType == 'none')
    ) {
      this.selectedCoverMediaType = 'map';
    }
  }

  _uploadedHeaderImageIdChanged() {
    if (this.uploadedHeaderImageId) {
      this.selectedCoverMediaType = 'image';
    }
  }

  _getTabLength() {
    let length = 4;

    if (!this.newPointShown) {
      length -= 1;
    }

    if (this.locationHidden) {
      length -= 1;
    }

    if (this.mediaHidden) {
      length -= 1;
    }

    return length;
  }

  _nextTab() {
    const length = this._getTabLength();

    if (this.selected < length) {
      this.selected = this.selected + 1;
    }
  }

  _selectedChanged() {
    const newValue = this.selected;
    setTimeout(() => {
      if (!this.locationHidden && newValue == (this.newPointShown ? 2 : 1)) {
        this.mapActive = true;
      } else {
        this.mapActive = false;
      }

      const finalTabNumber = this._getTabLength() - 1;

      if (finalTabNumber === 0) {
        this.hasOnlyOneTab = true;
      }

      if (newValue == finalTabNumber) {
        (this.$$('#editDialog') as YpEditDialog).useNextTabAction = false;
      } else {
        (this.$$('#editDialog') as YpEditDialog).useNextTabAction = true;
      }

      if (newValue == 0) {
        const nameElement = this.$$('#name');
        if (nameElement) {
          nameElement.focus();
        }
      }
      if (newValue == 1 && this.newPointShown) {
        const pointFor = this.$$('#pointFor');
        if (pointFor) {
          pointFor.focus();
        }
      }
      setTimeout(() => {
        this._resizeScrollerIfNeeded();
      }, 50);
    });
  }

  _selectedCategory(event: CustomEvent) {
    this.selectedCategoryArrayId = event.detail.index;
  }

  _selectedCategoryChanged() {
    if (this.selectedCategoryArrayId && this.group && this.group.Categories)
      this.selectedCategoryId = this.group.Categories[
        this.selectedCategoryArrayId
      ].id;
  }

  get showCategories() {
    if (this.group && this.group.Categories) {
      return this.group.Categories.length > 0;
    }
      return false;

  }

  getPositionInArrayFromId(collection: Array<YpCategoryData>, id: number) {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].id == id) {
        return i;
      }
    }
    return undefined;
  }

  _postChanged() {
    if (this.newPost && this.post) {
      if (this.post.location) {
        this.location = this.post.location;
        this.encodedLocation = JSON.stringify(this.location);
      }
      if (this.post.cover_media_type)
        this.selectedCoverMediaType = this.post.cover_media_type;
    }
    this._updateEmojiBindings();
  }

  _updateInitialCategory(group: YpGroupData) {
    if (group && this.post && this.post.category_id && group.Categories) {
      this.selectedCategoryId = this.post.category_id;
      this.selectedCategoryArrayId = this.getPositionInArrayFromId(
        group.Categories,
        this.post.category_id
      );
    }
  }

  _imageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  async _redirectAfterVideo(post: YpPostData) {
    this.post = post;

    await window.serverApi.completeMediaPost('videos', 'PUT', this.post.id, {
      videoId: this.uploadedVideoId,
      appLanguage: this.language,
    });

    this._finishRedirect(post);

    setTimeout(() => {
      window.appGlobals.showSpeechToTextInfoIfNeeded();
    }, 20);
  }

  async _redirectAfterAudio(post: YpPostData) {
    this.post = post;

    await window.serverApi.completeMediaPost('audios', 'PUT', this.post.id, {
      audioId: this.uploadedAudioId,
      appLanguage: this.language,
    });

    this._finishRedirect(post);

    setTimeout(() => {
      window.appGlobals.showSpeechToTextInfoIfNeeded();
    }, 20);
  }

  customRedirect(post: YpPostData) {
    if (post) {
      if (
        post.newEndorsement &&
        window.appUser &&
        window.appUser.endorsementPostsIndex
      ) {
        window.appUser.endorsementPostsIndex[post.id] = post.newEndorsement;
      }

      if (this.uploadedVideoId) {
        this._redirectAfterVideo(post);
      } else if (this.uploadedAudioId && this.newPost) {
        this._redirectAfterAudio(post);
      } else {
        this._finishRedirect(post);
      }
    } else {
      console.warn('No post found on custom redirect');
    }
  }

  _finishRedirect(post: YpPostData) {
    this.fire('yp-reset-keep-open-for-page');
    window.appGlobals.activity('completed', 'newPost');

    let text = this.t('thankYouForYourSubmission');
    const customThankYouTextNewPostsId = this.$$(
      '#customThankYouTextNewPostsId'
    ) as YpMagicText;
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.customThankYouTextNewPosts &&
      customThankYouTextNewPostsId &&
      customThankYouTextNewPostsId.content
    ) {
      if (customThankYouTextNewPostsId.finalContent) {
        text = customThankYouTextNewPostsId.finalContent;
      } else {
        text = customThankYouTextNewPostsId.content;
      }
    }

    window.appDialogs.getDialogAsync('mastersnackbar', (snackbar: Snackbar) => {
      snackbar.textContent = text;
      snackbar.timeoutMs = 5000;
      snackbar.open = true;
    });

    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.allPostsBlockedByDefault
    ) {
      // Nothing?
    } else {
      YpNavHelpers.redirectTo('/post/' + (post ? post.id : this.post?.id));
    }
  }

  clear() {
    if (this.newPost) {
      this.post = {
        name: '',
        description: '',
        pointFor: '',
        categoryId: undefined,
      } as YpPostData;
      this.location = undefined;
      this.selectedCategoryArrayId = undefined;
      this.selectedCategoryId = undefined;
      this.selected = 0;
      this.uploadedHeaderImageId = undefined;
      this.uploadedVideoId = undefined;
      this.uploadedAudioId = undefined;
      this.currentVideoId = undefined;
      this.currentAudioId = undefined;
      this.selectedCoverMediaType = 'none';
      this.requestUpdate();
      if (this.$$('#imageFileUpload')) {
        (this.$$('#imageFileUpload') as YpFileUpload).clear();
      }
    }
  }

  setup(
    post: YpPostData | undefined,
    newNotEdit: boolean,
    refreshFunction: Function | undefined,
    group: YpGroupData
  ) {
    this._setupGroup(group);
    if (post) {
      this.post = post;
      if (post.PostVideos && post.PostVideos.length > 0) {
        this.currentVideoId = post.PostVideos[0].id;
      }

      if (post.PostAudios && post.PostAudios.length > 0) {
        this.currentAudioId = post.PostAudios[0].id;
      }
    } else {
      this.post = undefined;
    }
    this._updateInitialCategory(group);
    this.newPost = newNotEdit;
    this.refreshFunction = refreshFunction;
    this.setupTranslation();
    this.clear();
  }

  _setupGroup(group: YpGroupData | undefined) {
    if (group) {
      this.group = group;
      if (group.configuration) {
        if (group.configuration.locationHidden) {
          if (group.configuration.locationHidden == true) {
            this.locationHidden = true;
          } else {
            this.locationHidden = false;
          }
        } else {
          this.locationHidden = false;
        }
        if (group.configuration.postDescriptionLimit) {
          this.postDescriptionLimit = group.configuration.postDescriptionLimit;
        } else {
          this.postDescriptionLimit = 500;
        }

        if (group.configuration.structuredQuestionsJson) {
          setTimeout(() => {
            this.liveQuestionIds = [];
            this.uniqueIdsToElementIndexes = {};
            this.liveUniqueIds = [];

            group.configuration.structuredQuestionsJson!.forEach(
              (question, index) => {
                if (
                  question.type.toLowerCase() === 'textfield' ||
                  question.type.toLowerCase() === 'textfieldlong' ||
                  question.type.toLowerCase() === 'textarea' ||
                  question.type.toLowerCase() === 'textarealong' ||
                  question.type.toLowerCase() === 'numberfield' ||
                  question.type.toLowerCase() === 'checkboxes' ||
                  question.type.toLowerCase() === 'radios' ||
                  question.type.toLowerCase() === 'dropdown'
                ) {
                  this.liveQuestionIds.push(index);
                  this.uniqueIdsToElementIndexes[question.uniqueId] = index;
                  this.liveUniqueIds.push(question.uniqueId);
                }
              }
            );
          });
        }
      } else {
        this.postDescriptionLimit = 500;
      }

      setTimeout(() => {
        if (this.structuredQuestions) {
          this.postDescriptionLimit = 9999;
        }
      }, 50);
    }
  }

  get mediaHidden() {
    if (
      this.group &&
      this.group.configuration &&
      this.group.configuration.hideMediaInput === true
    ) {
      return true;
    }
      return false;

  }

  setupAfterOpen(params: YpEditFormParams) {
    this._setupGroup(params.group);
    setTimeout(() => {
      const nameElement = this.$$('#name');
      if (nameElement) {
        nameElement.focus();
      }
    }, 250);

    if (
      this.post &&
      !this.newPost &&
      this.post.public_data &&
      this.post.public_data.structuredAnswersJson
    ) {
      this.initialStructuredAnswersJson = this.post.public_data.structuredAnswersJson;
    }
  }

  _alternativeTextForNewIdeaButtonHeaderTranslation() {
    setTimeout(() => {
      const label = this.$$(
        '#alternativeTextForNewIdeaButtonHeaderId'
      ) as YpMagicText;
      if (label && label.finalContent) {
        this.editHeaderText = label.finalContent;
      }
    });
  }

  setupTranslation() {
    setTimeout(() => {
      if (this.t) {
        if (this.newPost) {
          if (
            this.group &&
            this.group.configuration &&
            this.group.configuration.alternativeTextForNewIdeaButtonHeader
          ) {
            const label = this.$$(
              '#alternativeTextForNewIdeaButtonHeaderId'
            ) as YpMagicText;
            this.editHeaderText =
              label && label.finalContent
                ? label.finalContent
                : this.group.configuration
                    .alternativeTextForNewIdeaButtonHeader;
          } else {
            this.editHeaderText = this.t('post.new');
          }

          if (this.group && this.group.configuration && this.group.configuration.alternativeTextForNewIdeaSaveButton) {
            const label = this.$$("#alternativeTextForNewIdeaSaveButtonId") as YpMagicText;
            this.saveText = (label && label.finalContent) ? label.finalContent : this.group.configuration.alternativeTextForNewIdeaSaveButton;
          } else {
            this.saveText = this.t('create');
          }
          this.snackbarText = this.t('postCreated');
        } else {
          this.saveText = this.t('save');
          this.editHeaderText = this.t('post.edit');
          this.snackbarText = this.t('postUpdated');
        }
      }
    }, 20);
  }
}
