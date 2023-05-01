import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

import { YpCollection } from '../yp-collection/yp-collection.js';
import { nothing, html, TemplateResult, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TextArea } from '@material/mwc-textarea';
import '@material/mwc-linear-progress';
import { Radio } from '@material/mwc-radio';
import '@material/mwc-textarea';

import { Menu } from '@material/mwc-menu';

import '../yp-file-upload/yp-file-upload.js';
import '../common/yp-emoji-selector.js';

import { YpFileUpload } from '../yp-file-upload/yp-file-upload.js';
import { YpEmojiSelector } from '../common/yp-emoji-selector.js';
import '../yp-point/yp-point.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
import { RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';
import { LitVirtualizer } from '@lit-labs/virtualizer';
import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow.js';
import { YpMagicText } from '../yp-magic-text/yp-magic-text.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { Select } from '@material/mwc-select';

import { YpAutoTranslateDialog } from '../yp-dialog-container/yp-autotranslate-dialog.js';

@customElement('yp-post-points')
export class YpPostPoints extends YpBaseElementWithLogin {
  @property({ type: Boolean })
  fetchActive = false;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  disableDebate = false;

  @property({ type: Array })
  points: Array<YpPointData> | undefined;

  @property({ type: Array })
  downPoints: Array<YpPointData> | undefined;

  @property({ type: Array })
  upPoints: Array<YpPointData> | undefined;

  @property({ type: String })
  newPointTextCombined: string | undefined;

  @property({ type: Object })
  post!: YpPostData;

  @property({ type: String })
  labelMobileUpOrDown: string | undefined;

  @property({ type: String })
  labelUp: string | undefined;

  @property({ type: String })
  labelDown: string | undefined;

  @property({ type: String })
  pointUpOrDownSelected = 'pointFor';

  @property({ type: Object })
  latestPointCreatedAt: Date | undefined;

  @property({ type: Number })
  scrollToId: number | undefined;

  @property({ type: Boolean })
  addPointDisabled = false;

  @property({ type: Number })
  uploadedVideoUpId: number | undefined;

  @property({ type: Number })
  uploadedVideoDownId: number | undefined;

  @property({ type: Number })
  uploadedVideoMobileId: number | undefined;

  @property({ type: Number })
  currentVideoId: number | undefined;

  @property({ type: Boolean })
  hideUpVideo = false;

  @property({ type: Boolean })
  hideDownVideo = false;

  @property({ type: Boolean })
  hideMobileVideo = false;

  @property({ type: Number })
  uploadedAudioUpId: number | undefined;

  @property({ type: Number })
  uploadedAudioDownId: number | undefined;

  @property({ type: Number })
  uploadedAudioMobileId: number | undefined;

  @property({ type: Number })
  currentAudioId: number | undefined;

  @property({ type: Boolean })
  hideUpAudio = false;

  @property({ type: Boolean })
  hideDownAudio = false;

  @property({ type: Boolean })
  hideMobileAudio = false;

  @property({ type: Boolean })
  hideUpText = false;

  @property({ type: Boolean })
  hideDownText = false;

  @property({ type: Boolean })
  hideMobileText = false;

  @property({ type: Boolean })
  selectedPointForMobile = false;

  @property({ type: Boolean })
  isAndroid = false;

  @property({ type: String })
  hasCurrentUpVideo: string | undefined;

  @property({ type: String })
  hasCurrentDownVideo: string | undefined;

  @property({ type: String })
  hasCurrentMobileVideo: string | undefined;

  @property({ type: String })
  hasCurrentUpAudio: string | undefined;

  @property({ type: String })
  hasCurrentDownAudio: string | undefined;

  @property({ type: String })
  hasCurrentMobileAudio: string | undefined;

  @property({ type: Array })
  storedPoints: Array<YpPointData> | undefined;

  loadedPointIds: Record<number, boolean> = {};

  loadMoreInProgress = false;

  totalCount: number | undefined;

  storedUpPointsCount = 0;

  storedDownPointsCount = 0;

  noMorePoints = false;

  get textValueUp() { 
    if (this.$$('#up_point')) return (this.$$('#up_point') as TextArea).value;
    else return '';
  }

  _clearTextValueUp() {
    if (this.$$('#up_point')) (this.$$('#up_point') as TextArea).value = '';
  }

  get textValueDown() {
    if (this.$$('#down_point'))
      return (this.$$('#down_point') as TextArea).value;
    else return '';
  }

  _clearTextValueDown() {
    if (this.$$('#down_point')) (this.$$('#down_point') as TextArea).value = '';
  }

  get textValueMobileUpOrDown() {
    if (this.$$('#mobile_point'))
      return (this.$$('#mobile_point') as TextArea).value;
    else return '';
  }

  _clearTextValueMobileUpOrDown() {
    if (this.$$('#up_point')) (this.$$('#up_point') as TextArea).value = '';
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('wide')) {
      this._updateEmojiBindings();
    }
    if (changedProperties.has('points')) {
      this._pointsChanged();
    }

    if (changedProperties.has('post')) {
      this._postChanged();
    }

    if (changedProperties.has('isAdmin')) {
      this._isAdminChanged();
    }

    if (
      changedProperties.has('pointUpOrDownSelected') ||
      changedProperties.has('post')
    ) {
      this._pointUpOrDownSelectedChanged();
    }

    if (changedProperties.has('hasCurrentUpVideo')) {
      this._hasCurrentUpVideo();
    }

    if (changedProperties.has('hasCurrentDownVideo')) {
      this._hasCurrentDownVideo();
    }

    if (changedProperties.has('hasCurrentMobileVideo')) {
      this._hasCurrentMobileVideo();
    }
    if (changedProperties.has('hasCurrentUpAudio')) {
      this._hasCurrentUpAudio();
    }

    if (changedProperties.has('hasCurrentDownAudio')) {
      this._hasCurrentDownAudio();
    }

    if (changedProperties.has('hasCurrentMobileAudio')) {
      this._hasCurrentMobileAudio();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .processBar {
          height: 4px;
          margin: 0;
          padding: 0;
        }

        .main-container {
          background-color: var(--primary-background-color);
        }

        .point {
          padding-top: 32px;
          padding-bottom: 32px;
          padding-left: 24px;
          padding-right: 24px;
        }

        .pointInputMaterial {
          padding-top: 24px;
          padding-left: 16px;
          padding-right: 16px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          background-color: #fff;
        }

        yp-point {
          padding-top: 8px;
        }

        .pointMaterial {
          padding-top: 8px;
          background-color: #fff;
          padding-left: 0;
          padding-right: 0;
          width: 430px;
          margin-bottom: 12px;
        }

        .thumbIcon {
          height: 64px;
          width: 64px;
          padding-bottom: 16px;
          color: var(--primary-color);
        }

        .editIcon {
          height: 28px;
          width: 28px;
          padding-bottom: 16px;
          color: var(--primary-color);
        }

        .addPointFab {
          width: 100%;
          color: #fff;
          margin-bottom: 18px;
        }

        mwc-textarea {
          font-family: var(--app-header-font-family, Roboto);
        }

        .howToWriteInfoText {
          padding-top: 4px;
          color: var(--primary-color);
        }

        .point .main-container .topContainer {
          background-color: var(--primary-background-color) !important;
        }

        .penContainer {
          margin-top: 42px;
        }

        .upOrDown {
          margin-top: 72px;
        }

        #pointUpOrDownMaterial {
          margin-top: 16px;
          width: 100%;
        }

        .mobileFab {
          margin-top: 8px;
        }

        mwc-button {
          color: #fff;
          background-color: var(--accent-color);
          font-family: var(--app-header-font-family, Roboto);
        }

        lit-virtualizer {
          width: 450px;
          height: 80vh;
          overflow: hidden;
        }

        @media (max-width: 985px) {
          .pointInputMaterial {
            width: 100%;
            max-width: 568px;
            font-size: 14px;
            padding-top: 4px;
            margin-top: 0;
          }

          .pointMaterial {
            width: 100%;
            max-width: 600px;
            padding-left: 0;
            padding-right: 0;
          }

          .pointMaterial[is-last-point] {
            margin-bottom: 107px;
          }

          #pointUpOrDownMaterial {
            margin-top: 16px;
          }

          .main-container {
            width: 100%;
          }

          lit-virtualizer {
          }
        }

        @media (max-width: 420px) {
          .pointInputMaterial {
            width: 90%;
            max-width: 90%;
          }
        }

        .pointMainHeader {
          font-size: 26px;
          margin-bottom: 16px;
          color: #555;
        }

        #pointUpMaterialNotUsed {
          border-top: solid 2px;
          border-top-color: var(--master-point-up-color);
        }

        #pointDownMaterialNotUsed {
          border-top: solid 2px;
          border-top-color: var(--master-point-down-color);
        }

        .pointElement {
          margin-bottom: 18px;
        }

        [hidden] {
          display: none !important;
        }

        lit-virtualizer {
          height: 80vh;
        }

        #listMobile[debate-disabled] {
          margin-top: 16px;
        }

        .mainSpinner {
          margin: 32px;
        }

        .uploadNotLoggedIn {
          min-width: 100px;
          background-color: #fff;
          color: #000;
          margin-bottom: 24px;
        }

        .uploadNotLoggedIn > .icon {
          padding-right: 8px;
        }

        .pointButtons {
          margin-bottom: 4px;
        }

        .bottomDiv {
          margin-bottom: 64px;
        }

        .uploadSection {
          justify-content: space-evenly;
          width: 50%;
          margin-left: 8px;
          margin-right: 8px;
          vertical-align: top;
        }

        .videoUploadDisclamer {
          font-size: 12px;
          padding: 8px;
          margin-bottom: 4px;
        }

        div[rtl] {
          direction: rtl;
        }
      `,
    ];
  }

  renderAudioUpload(
    type: string,
    hideAudio: boolean,
    hasCurrentAudio: string | undefined,
    uploadAudioPointHeader: string
  ) {
    return this.post.Group.configuration.allowPointAudioUploads
      ? html`
          <div ?hidden="${hideAudio}" class="uploadSection">
            <div
              class="layout vertical center-center"
              ?hidden="${!this.isLoggedIn}"
            >
              <yp-file-upload
                id="audioFileUpload${type}"
                current-file="${ifDefined(hasCurrentAudio)}"
                container-type="points"
                .uploadlimitSeconds="${this.post.Group.configuration
                  .audioPointUploadLimitSec}"
                .group="${this.post.Group}"
                raised
                audioUpload
                buttonIcon="keyboard_voice"
                .buttonText="${uploadAudioPointHeader}"
                method="POST"
                @success="${this._audioUpUploaded}"
              >
              </yp-file-upload>
            </div>
            <div class="layout horizontal center-center">
              <mwc-button
                class="uploadNotLoggedIn"
                icon="keyboard_voice"
                raised
                ?hidden="${this.isLoggedIn}"
                @click="${this._openLogin}"
                .label="${uploadAudioPointHeader}"
              >
              </mwc-button>
            </div>
          </div>
        `
      : nothing;
  }

  renderVideoUpload(
    type: string,
    hideVideo: boolean,
    hasCurrentVideo: string | undefined,
    uploadVideoHeader: string,
    videoUploadedFunc: Function,
    uploadedVideoId: number | undefined
  ) {
    return this.post.Group.configuration.allowPointVideoUploads
      ? html`
          <div ?hidden="${hideVideo}" class="uploadSection">
            <div
              class="layout vertical center-center self-start"
              ?hidden="${!this.isLoggedIn}"
            >
              <yp-file-upload
                id="videoFileUpload${type}"
                noDefaultCoverImage
                .uploadLimitSeconds="${this.post.Group.configuration
                  .videoPointUploadLimitSec}"
                .currentFile="${hasCurrentVideo as unknown as YpUploadFileData}"
                containerType="points"
                .group="${this.post.Group}"
                raised
                videoUpload
                method="POST"
                buttonIcon="videocam"
                .buttonText="${uploadVideoHeader}"
                @success="${videoUploadedFunc}"
              >
              </yp-file-upload>
            </div>
            <div
              class="videoUploadDisclamer"
              ?hidden="${!this.post.Group.configuration
                .showVideoUploadDisclaimer || !uploadedVideoId}"
            >
              ${this.t('videoUploadDisclaimer')}
            </div>
            <div class="layout horizontal center-center">
              <mwc-button
                class="uploadNotLoggedIn"
                icon="videocam"
                raised
                ?hidden="${this.isLoggedIn}"
                @click="${this._openLogin}"
                .label="${uploadVideoHeader}"
              >
              </mwc-button>
            </div>
          </div>
        `
      : nothing;
  }

  renderMobilePointSelection() {
    html` <div class="layout vertical end-justified">
      <div
        class="layout horizontal center-center pointButtons"
        ?hidden="${this.post.Group.configuration.hidePointAgainst}"
      >
        <mwc-formfield .label="${this.t('pointForShort')}">
          <mwc-radio
            @click="${this._chooseUpOrDownRadio}"
            ?selected="${this.pointUpOrDownSelected == 'pointFor'}"
            id="upRadio"
            name="upOrDown"
          ></mwc-radio>
        </mwc-formfield>

        <mwc-formfield .label="${this.t('pointAgainstShort')}">
          <mwc-radio
            @click="${this._chooseUpOrDownRadio}"
            ?selected="${this.pointUpOrDownSelected == 'pointAgainst'}"
            id="downRadio"
            name="upOrDown"
          ></mwc-radio>
        </mwc-formfield>
      </div>
    </div>`;
  }

  renderPointItem(point: YpPointData, index: number): TemplateResult {
    return html`<div
      class="item layout-horizontal"
      tabindex="${index}"
      role="listitem"
      aria-level="3"
    >
      <div
        id="point${point.id}"
        class="pointMaterial"
        ?is-last-point="${point.isLastPointInList}"
      >
        <yp-point .point="${point}" .post="${this.post}"></yp-point>
      </div>
    </div>`;
  }

  renderPointHeader(
    header: string,
    alternativeHeader: string | undefined,
    headerTextType: string
  ) {
    return !alternativeHeader
      ? html`
          <div
            class="pointMainHeader layout horizontal center-center"
            role="heading"
            aria-level="2"
          >
            ${header}
          </div>
        `
      : html`
          <div class="pointMainHeader layout horizontal center-center">
            <yp-magic-text
              .contentId="${this.post.Group.id}"
              textOnly
              .content="${alternativeHeader}"
              .contentLanguage="${this.post.Group.language}"
              role="heading"
              aria-level="2"
              class="ratingName"
              textType="${headerTextType}"
            >
            </yp-magic-text>
          </div>
        `;
  }

  renderPointList(
    type: string,
    header: string,
    alternativeHeader: string | undefined,
    headerTextType: string,
    label: string | undefined,
    hideVideo: boolean,
    hideText: boolean,
    hasCurrentVideo: string | undefined,
    videoUploadedFunc: Function,
    uploadVideoHeader: string,
    uploadedVideoId: number | undefined,
    pointFocusFunction: Function,
    hideAudio: boolean,
    hasCurrentAudio: string | undefined,
    uploadAudioPointHeader: string,
    ifLengthIsRight: boolean,
    addPointFunc: Function,
    points: Array<YpPointData> | undefined,
    mobile = false
  ) {
    return html`
      <div class="point">
        ${this.renderPointHeader(header, alternativeHeader, headerTextType)}

        <div
          id="point${type}Material"
          class="pointInputMaterial
                    layout vertical
                  shadow-elevation-2dp shadow-transition"
          ?hidden="${this.post.Group.configuration.disableDebate}"
        >
          <mwc-textarea
            id="${type.toLowerCase()}_point"
            @focus="${pointFocusFunction}"
            @blur="${this.blurTextArea}"
            .label="${label ? label : ''}"
            charCounter
            rows="2"
            @keyup="${()=>{this.requestUpdate()}}"
            ?hidden="${hideText}"
            maxrows="3"
            .maxlength="${this.pointMaxLength}"
          >
          </mwc-textarea>

          ${mobile ? this.renderMobilePointSelection() : nothing}

          <div
            class="layout horizontal end"
            ?rtl="${this.rtl}"
            ?hidden="${this.post.Group.configuration.hideEmoji}"
          >
            <div class="flex"></div>
            <yp-emoji-selector
              id="point${type}EmojiSelector"
              ?hidden="${hideText}"
            ></yp-emoji-selector>
          </div>

          <div class="layout horizontal center-justified">
            ${this.renderVideoUpload(
              type,
              hideVideo,
              hasCurrentVideo,
              uploadVideoHeader,
              videoUploadedFunc,
              uploadedVideoId
            )}
            ${this.renderAudioUpload(
              type,
              hideAudio,
              hasCurrentAudio,
              uploadAudioPointHeader
            )}
          </div>

          <div>
            <div class="addPointFab layout horizontal center-center">
              <mwc-button
                raised
                class="submitButton"
                ?disabled="${this.addPointDisabled}"
                ?hidden="${!ifLengthIsRight}"
                icon="add"
                @click="${addPointFunc}"
                .label="${this.t('postPoint')}"
              ></mwc-button>
            </div>
          </div>
        </div>

        ${points
          ? html`
              <lit-virtualizer
                id="list${type}"
                .items=${points}
                .layout="${FlowLayout}"
                .scrollTarget="${window}"
                .renderItem=${this.renderPointItem.bind(this)}
                @rangeChanged=${this.scrollEvent}
              ></lit-virtualizer>
            `
          : nothing}
      </div>
    `;
  }

  scrollEvent(event: RangeChangedEvent) {
    //TODO
  }

  renderTranslationPlaceholders() {
    return html`${!this.post.Group.configuration.alternativePointForLabel
      ? html`
          <yp-magic-text
            id="alternativePointForLabelId"
            hidden
            contentId="${this.post.Group.id}"
            textOnly
            .content="${this.post.Group.configuration.alternativePointForLabel}"
            .contentLanguage="${this.post.Group.language}"
            @new-translation="${this._updatePointLabels}"
            role="heading"
            aria-level="2"
            textType="alternativePointForLabel"
          >
          </yp-magic-text>
        `
      : nothing}
    ${!this.post.Group.configuration.alternativePointAgainstLabel
      ? html`
          <yp-magic-text
            id="alternativePointAgainstLabelId"
            hidden
            contentId="${this.post.Group.id}"
            textOnly
            .content="${this.post.Group.configuration
              .alternativePointAgainstLabel}"
            .contentLanguage="${this.post.Group.language}"
            @new-translation="${this._updatePointLabels}"
            role="heading"
            aria-level="2"
            textType="alternativePointAgainstLabel"
          >
          </yp-magic-text>
        `
      : nothing}`;
  }

  render() {
    return html`
      <div class="processBar layout horizontal center-center">
        <mwc-linear-progress
          indeterminate
          ?hidden="${!this.fetchActive}"
        ></mwc-linear-progress>
      </div>

      ${this.wideReady
        ? html`
            <div
              ?rtl="${this.rtl}"
              class="layout vertical topContainer center-center"
            >
              <div class="main-container layout horizontal">
                ${this.renderPointList(
                  'Up',
                  this.t('pointsFor'),
                  this.post.Group.configuration.alternativePointForHeader,
                  'alternativePointForHeader',
                  this.labelUp,
                  this.hideUpVideo,
                  this.hideUpText,
                  this.hasCurrentUpVideo,
                  this._videoUpUploaded,
                  this.t('uploadVideoPointFor'),
                  this.uploadedVideoUpId,
                  this.focusUpPoint,
                  this.hideUpAudio,
                  this.hasCurrentUpAudio,
                  this.t('uploadAudioPointFor'),
                  this.ifLengthUpIsRight,
                  this.addPointUp,
                  this.upPoints
                )}
                ${this.renderPointList(
                  'Down',
                  this.t('pointsAgainst'),
                  this.post.Group.configuration.alternativePointAgainstHeader,
                  'alternativePointAgainstHeader',
                  this.labelDown,
                  this.hideDownVideo,
                  this.hideDownText,
                  this.hasCurrentDownVideo,
                  this._videoDownUploaded,
                  this.t('uploadVideoPointAgainst'),
                  this.uploadedVideoDownId,
                  this.focusDownPoint,
                  this.hideDownAudio,
                  this.hasCurrentDownAudio,
                  this.t('uploadAudioPointAgainst'),
                  this.ifLengthDownIsRight,
                  this.addPointDown,
                  this.downPoints
                )}
              </div>
            </div>
          `
        : nothing}
      ${this.smallReady
        ? html`
            <div ?rtl="${this.rtl}" class="layout vertical center-center">
              ${this.renderPointList(
                'Mobile',
                this.t('pointsAgainst'),
                this.post.Group.configuration.alternativePointAgainstHeader,
                'alternativePointAgainstHeader',
                this.labelMobileUpOrDown,
                this.hideMobileVideo,
                this.hideMobileText,
                this.hasCurrentMobileVideo,
                this._videoMobileUploaded,
                this.t('uploadVideoPointAgainst'),
                this.uploadedVideoMobileId,
                this.focusMobilePoint,
                this.hideMobileAudio,
                this.hasCurrentMobileAudio,
                this.t('uploadAudioPointAgainst'),
                this.ifLengthMobileIsRight,
                this.addMobilePointUpOrDown,
                this.points,
                true
              )}
            </div>
          `
        : nothing}
      ${this.renderTranslationPlaceholders()}
    `;
  }

  _chooseUpOrDownRadio() {
    const up = this.$$('#upRadio') as Radio;
    const down = this.$$('#downRadio') as Radio;
    if (up.checked) this.pointUpOrDownSelected = 'pointFor';
    else if (down.checked) this.pointUpOrDownSelected = 'pointAgainst';
  }

  get wideReady() {
    return this.wide && this.post;
  }

  get smallReady() {
    return !this.wide && this.post;
  }

  get pointMaxLength() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.pointCharLimit
    ) {
      return this.post.Group.configuration.pointCharLimit;
    } else {
      return 500;
    }
  }

  _openLogin() {
    this.fire('yp-open-login');
  }

  _videoUpUploaded(event: CustomEvent) {
    this.uploadedVideoUpId = event.detail.videoId;
  }

  _videoDownUploaded(event: CustomEvent) {
    this.uploadedVideoDownId = event.detail.videoId;
  }

  _videoMobileUploaded(event: CustomEvent) {
    this.uploadedVideoMobileId = event.detail.videoId;
  }

  _audioUpUploaded(event: CustomEvent) {
    this.uploadedAudioUpId = event.detail.audioId;
  }

  _audioDownUploaded(event: CustomEvent) {
    this.uploadedAudioDownId = event.detail.audioId;
  }

  _audioMobileUploaded(event: CustomEvent) {
    this.uploadedAudioMobileId = event.detail.audioId;
  }

  get mobileScrollOffset() {
    if (!this.wide && this.post) {
      const element = this.$$('#listMobile');
      if (element) {
        let top = element.getBoundingClientRect().top;
        if (top <= 0) {
          top = 800;
        }
        return top;
      } else {
        console.warn("Can't find mobile list element, returning 800");
        return 800;
      }
    }
  }

  get listResizeScrollThreshold() {
    if (!this.wide) {
      return 300;
    } else {
      return 300;
    }
  }

  get listPaddingTop() {
    if (this.wide) {
      return 600;
    } else {
      return 500;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    if (isAndroid) {
      this.isAndroid = true;
    }
    window.addEventListener('resize', this._processStoredPoints.bind(this));
    this.addListener('yp-point-deleted', this._pointDeleted);
    this.addListener('yp-update-point-in-list', this._updatePointInLists);
    this.addListener('yp-list-resize', this._listResize);
    this.addListener('yp-update-points-for-post', this._loadNewPointsIfNeeded);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._processStoredPoints);
    this.removeListener('yp-point-deleted', this._pointDeleted);
    this.removeListener('yp-update-point-in-list', this._updatePointInLists);
    this.removeListener('yp-list-resize', this._listResize);
    this.removeListener(
      'yp-update-points-for-post',
      this._loadNewPointsIfNeeded
    );
  }

  _listResize() {
    //TODO: Check if this
    if (this.$$('#listUp')) {
      //     ((this.$$('#listUp') as LitVirtualizer).layout).reflowIfNeeded(false);
    }
    if (this.$$('#listDown')) {
      //      ((this.$$('#listDown') as LitVirtualizer).layout as Layout1d).reflowIfNeeded(false);
    }
    if (this.$$('#listMobile')) {
      //      ((this.$$('#listMobile') as LitVirtualizer).layout as Layout1d).reflowIfNeeded(false);
    }
  }

  _loadNewPointsIfNeeded(event: CustomEvent) {
    if (this.post && this.post.id == event.detail.postId) {
      if (this.latestPointCreatedAt) {
        this._getNewPoints();
      } else {
        console.error('Trying to send point without latestPointCreatedAt');
      }
    }
  }

  _loadMorePoints() {
    if (!this.loadMoreInProgress && !this.noMorePoints) {
      this.loadMoreInProgress = true;
      if (this.post && this.storedPoints && this.storedPoints.length > 0) {
        this._getMorePoints();
      } else {
        console.warn('Trying to load more points early');
        this.loadMoreInProgress = false;
      }
    }
  }

  _interleaveMorePoints(points: Array<YpPointData>) {
    const upPoints = [];
    const downPoints = [];

    for (let i = 0; i < points.length; i++) {
      if (points[i].value > 0) {
        upPoints.push(points[i]);
      } else if (points[i].value < 0) {
        downPoints.push(points[i]);
      }
    }

    return this.interleaveArrays(upPoints, downPoints);
  }

  async _getMorePoints() {
    this.loadMoreInProgress = false;
    const pointsData = (await window.serverApi.getMorePoints(
      this.post.id,
      this.storedUpPointsCount ? this.storedUpPointsCount : 0,
      this.storedDownPointsCount ? this.storedDownPointsCount : 0
    )) as YpGetPointsResponse;

    let points = this._preProcessPoints(pointsData.points);
    if (points.length === 0) {
      this.noMorePoints = true;
    }

    let haveAddedPoint = false;
    points = this._interleaveMorePoints(points);
    points.forEach(point => {
      if (this._addMorePoint(point)) {
        haveAddedPoint = true;
      }
    });

    await this.updateComplete;

    this._listResize();

    if (haveAddedPoint) {
      this._clearScrollTrigger();
    }
  }

  _clearScrollTrigger() {
    //TODO: Get working if needed
    /*
    if (this.$$('#ironScrollThesholdUp'))
      this.$$('#ironScrollThesholdUp').clearTriggers();
    if (this.$$('#ironScrollThesholdDown'))
      this.$$('#ironScrollThesholdDown').clearTriggers();
    if (this.$$('#ironScrollThesholdMobile'))
      this.$$('#ironScrollThesholdMobile').clearTriggers();
      */
  }

  async _getNewPoints() {
    if (this.latestPointCreatedAt) {
      let points = (await window.serverApi.getNewPoints(
        this.post.id,
        this.latestPointCreatedAt
      )) as Array<YpPointData>;
      points = this._preProcessPoints(points);
      points.forEach(point => {
        this._insertNewPoint(point);
      });
      await this.updateComplete;

      this._listResize();
      this._updateCounterInfo();
      this.addPointDisabled = false;
    }
  }

  _pointDeleted() {
    this._getPoints();
  }

  _pointsChanged() {
    if (this.points) {
      this._updateEmojiBindings();
    }
  }

  _updateEmojiBindings() {
    setTimeout(() => {
      if (this.wide) {
        const upPoint = this.$$('#up_point') as HTMLInputElement;
        const downPoint = this.$$('#down_point') as HTMLInputElement;
        const upEmoji = this.$$('#pointUpEmojiSelector') as YpEmojiSelector;
        const downEmoji = this.$$('#pointDownEmojiSelector') as YpEmojiSelector;
        if (upPoint && downPoint && upEmoji && downEmoji) {
          upEmoji.inputTarget = upPoint;
          downEmoji.inputTarget = downPoint;
        } else {
          console.warn("Wide: Can't bind emojis :(");
        }
      } else {
        const upDownPoint = this.$$('#mobile_point') as HTMLInputElement;
        const upDownEmoji = this.$$(
          '#pointMobileEmojiSelector'
        ) as YpEmojiSelector;
        if (upDownPoint && upDownEmoji) {
          upDownEmoji.inputTarget = upDownPoint;
        } else {
          console.warn("Small: Can't bind emojis :(");
        }
      }
    }, 500);
  }

  _pointUpOrDownSelectedChanged() {
    if (this.pointUpOrDownSelected == 'pointFor') {
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointForLabel
      ) {
        this.labelMobileUpOrDown =
          this.post.Group.configuration.alternativePointForLabel;
      } else {
        this.labelMobileUpOrDown = this.t('point.for');
      }
      this.selectedPointForMobile = true;
    } else if (this.pointUpOrDownSelected == 'pointAgainst') {
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointAgainstLabel
      ) {
        this.labelMobileUpOrDown =
          this.post.Group.configuration.alternativePointAgainstLabel;
      } else {
        this.labelMobileUpOrDown = this.t('point.against');
      }
      this.selectedPointForMobile = false;
    }
  }

  _clearVideo() {
    this.uploadedVideoUpId = undefined;
    this.uploadedVideoDownId = undefined;
    this.uploadedVideoMobileId = undefined;
    this.currentVideoId = undefined;
    this.hideUpVideo = false;
    this.hideDownVideo = false;
    this.hideMobileVideo = false;
    if (this.$$('#videoFileUploadUp'))
      (this.$$('#videoFileUploadUp') as YpFileUpload).clear();
    if (this.$$('#videoFileUploadDown'))
      (this.$$('#videoFileUploadDown') as YpFileUpload).clear();
    if (this.$$('#videoFileUploadMobile'))
      (this.$$('#videoFileUploadMobile') as YpFileUpload).clear();
  }

  _clearAudio() {
    this.uploadedAudioUpId = undefined;
    this.uploadedAudioDownId = undefined;
    this.uploadedAudioMobileId = undefined;
    this.currentAudioId = undefined;
    this.hideUpAudio = false;
    this.hideDownAudio = false;
    this.hideMobileAudio = false;
    if (this.$$('#audioFileUploadUp'))
      (this.$$('#audioFileUploadUp') as YpFileUpload).clear();
    if (this.$$('#audioFileUploadDown'))
      (this.$$('#audioFileUploadDown') as YpFileUpload).clear();
    if (this.$$('#audioFileUploadMobile'))
      (this.$$('#audioFileUploadMobile') as YpFileUpload).clear();
  }

  _isAdminChanged() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.disableDebate
    ) {
      if (this.isAdmin && this.post.Group.configuration.allowAdminsToDebate) {
        this.disableDebate = false;
      } else {
        this.disableDebate = true;
      }
    } else {
      this.disableDebate = false;
    }
  }

  async _getPoints() {
    this.fetchActive = true;
    const pointsWithCount = (await window.serverApi.getPoints(
      this.post.id
    )) as YpGetPointsResponse;
    this.fetchActive = false;

    if (pointsWithCount) {
      this.storedPoints = this._preProcessPoints(pointsWithCount.points);
      this.totalCount = pointsWithCount.count;
      this.storedUpPointsCount = 0;
      this.storedDownPointsCount = 0;

      if (this.storedPoints) {
        for (let i = 0; i < this.storedPoints.length; i++) {
          if (this.storedPoints[i].value > 0) {
            this.storedUpPointsCount += 1;
          } else if (this.storedPoints[i].value < 0) {
            this.storedDownPointsCount += 1;
          }
          this.loadedPointIds[this.storedPoints[i].id] = true;
        }
        this._processStoredPoints();
        this.removeElementsByClass(this, 'inserted-outside-list');
        this._updateCounterInfo();
        this._scrollPointIntoView();
        this._checkForMultipleLanguages();
      }
    }
  }

  _postChanged() {
    // Remove any manually inserted points when the list is updated
    this.points = undefined;
    this.upPoints = undefined;
    this.downPoints = undefined;
    this.latestPointCreatedAt = undefined;
    this.storedPoints = undefined;
    this._clearVideo();
    this._clearAudio();
    this.loadedPointIds = {};

    this.storedUpPointsCount = 0;
    this.storedDownPointsCount = 0;

    if (this.post) {
      if (
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.disableDebate
      ) {
        this.disableDebate = true;
      } else {
        this.disableDebate = false;
      }

      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointForLabel
      ) {
        this.labelUp = this.post.Group.configuration.alternativePointForLabel;
      } else {
        this.labelUp = this.t('point.for');
      }
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.alternativePointAgainstLabel
      ) {
        this.labelDown =
          this.post.Group.configuration.alternativePointAgainstLabel;
      } else {
        this.labelDown = this.t('point.against');
      }
    }

    setTimeout(() => {
      this._updatePointLabels();
    });

    this._getPoints();
  }

  removeElementsByClass(rootElement: HTMLElement, className: string) {
    const elements = rootElement.getElementsByClassName(className);
    if (elements) {
      while (elements.length > 0) {
        elements![0].parentNode!.removeChild(elements[0]);
      }
    }
  }

  _updatePointLabels() {
    setTimeout(() => {
      const forLabel = this.$$('#alternativePointForLabelId') as YpMagicText;
      const againstLabel = this.$$(
        '#alternativePointAgainstLabelId'
      ) as YpMagicText;
      if (forLabel && forLabel.finalContent) {
        this.labelUp = forLabel.finalContent;
      }
      if (againstLabel && againstLabel.finalContent) {
        this.labelDown = againstLabel.finalContent;
      }
    });
  }

  _processStoredPoints() {
    console.info('_processStoredPoints');
    if (this.storedPoints && this.storedPoints.length > 0) {
      const upPoints = [];
      const downPoints = [];

      for (let i = 0; i < this.storedPoints.length; i++) {
        if (this.storedPoints[i].value > 0) {
          upPoints.push(this.storedPoints[i]);
        } else if (this.storedPoints[i].value < 0) {
          downPoints.push(this.storedPoints[i]);
        }
      }
      this.upPoints = upPoints;
      this.downPoints = downPoints;
    } else {
      this.upPoints = [];
      this.downPoints = [];
      this.points = [];
    }

    if (!this.wide && this.upPoints && this.downPoints) {
      this.points = this.interleaveArrays(this.upPoints, this.downPoints);
    }
    this._clearScrollTrigger();
  }

  _updatePointInLists(event: CustomEvent) {
    const changedPoint = event.detail as YpPointData;
    this.upPoints?.forEach((point, index) => {
      if (point.id === changedPoint.id) {
        this.upPoints![index] = changedPoint;
      }
    });

    this.downPoints?.forEach((point, index) => {
      if (point.id === changedPoint.id) {
        this.downPoints![index] = changedPoint;
      }
    });

    if (this.points && this.points.length > 0) {
      this.points.forEach((point, index) => {
        if (point.id === changedPoint.id) {
          this.points![index] = changedPoint;
        }
      });
    }
  }

  _checkForMultipleLanguages() {
    if (
      this.upPoints &&
      !localStorage.getItem('dontPromptForAutoTranslation') &&
      !sessionStorage.getItem('dontPromptForAutoTranslation')
    ) {
      let firstLanguage: string;
      let multipleLanguages = false;
      this.upPoints.forEach(function (point) {
        if (point.language && !multipleLanguages) {
          if (!firstLanguage && point.language !== '??') {
            firstLanguage = point.language;
          } else if (
            firstLanguage &&
            firstLanguage !== point.language &&
            point.language !== '??'
          ) {
            multipleLanguages = true;
            console.info(
              'Multiple point languages: ' +
                firstLanguage +
                ' and ' +
                point.language
            );
          }
        }
      });

      if (!multipleLanguages && this.downPoints) {
        this.downPoints.forEach(function (point) {
          if (point.language && !multipleLanguages) {
            if (!firstLanguage && point.language !== '??') {
              firstLanguage = point.language;
            } else if (
              firstLanguage &&
              firstLanguage != point.language &&
              point.language !== '??'
            ) {
              multipleLanguages = true;
              console.info(
                'Multiple point languages: ' +
                  firstLanguage +
                  ' and ' +
                  point.language
              );
            }
          }
        });
      }

      if (multipleLanguages) {
        window.appDialogs.getDialogAsync(
          'autoTranslateDialog',
          (dialog: YpAutoTranslateDialog) => {
            dialog.openLaterIfAutoTranslationEnabled();
          }
        );
      }
    }
  }

  interleaveArrays(arrayA: Array<YpPointData>, arrayB: Array<YpPointData>) {
    const arrs = [arrayA, arrayB];
    // eslint-disable-next-line prefer-spread
    const maxLength = Math.max.apply(
      Math,
      arrs.map(arr => {
        return arr.length;
      })
    );

    const result: Array<YpPointData> = [];

    for (let i = 0; i < maxLength; ++i) {
      arrs.forEach(function (arr) {
        if (arr.length > i) {
          result.push(arr[i]);
        }
      });
    }

    if (
      result.length > 0 &&
      (result.length === this.totalCount ||
        (this.points && this.points.length + result.length === this.totalCount))
    ) {
      result[result.length - 1].isLastPointInList = true;
    }

    return result;
  }

  _scrollPointIntoView() {
    if (this.scrollToId) {
      setTimeout(() => {
        let hasFoundIt = false;
        if (!this.wide && this.points) {
          this.points.forEach(point => {
            if (!hasFoundIt && point.id == this.scrollToId) {
              //TODO: Fix below
              //this.$$('#listMobile').scrollToItem(point);
              hasFoundIt = true;
            }
          });
        } else if (this.upPoints && this.downPoints) {
          this.upPoints.forEach(point => {
            if (!hasFoundIt && point.id == this.scrollToId) {
              //TODO: Make this work
              //this.$$('#listUp').scrollToItem(point);
              hasFoundIt = true;
            }
          });
          if (!hasFoundIt) {
            this.downPoints.forEach(point => {
              if (!hasFoundIt && point.id == this.scrollToId) {
                //TODO: Make this work
                //this.$$('#listDown').scrollToItem(point);
                hasFoundIt = true;
              }
            });
          }
        }

        if (hasFoundIt) {
          setTimeout(() => {
            // Change elevation
            //TODO: Get to work again, use a method to change the shadow-xp class
            /*const point = this.$$('#point' + this.scrollToId);
            if (point) {
              point.elevation = 5;
              point.elevation = 1;
              point.elevation = 5;
              setTimeout(() => {
                point.elevation = 1;
              }, 7000);
            } else {
              console.warn("Can't find point to elevate");
            }*/
            this.scrollToId = undefined;
          }, 50);
        }
      }, 20);
    }
  }

  _preProcessPoints(points: Array<YpPointData>): Array<YpPointData> {
    for (let i = 0; i < points.length; i++) {
      if (
        !this.latestPointCreatedAt ||
        !this.latestPointCreatedAt ||
        points[i].created_at > this.latestPointCreatedAt
      ) {
        this.latestPointCreatedAt = points[i].created_at;
      }
      if (
        points &&
        points.length > 0 &&
        points[i].PointRevisions &&
        points![i].PointRevisions!.length > 0 &&
        points![i].PointRevisions![points![i].PointRevisions!.length - 1] &&
        points![i].PointRevisions![points![i].PointRevisions!.length - 1]
          .content
      ) {
        points[i].latestContent =
          points![i].PointRevisions![
            points![i].PointRevisions!.length - 1
          ].content;
      } else {
        console.warn('No content for point in _preProcessPoints');
      }
    }
    return points;
  }

  _updateCounterInfo() {
    if (this.wide && this.upPoints) {
      this.fire('yp-debate-info', {
        count: this.totalCount,
        firstPoint: this.upPoints[0],
      });
    } else if (this.points) {
      this.fire('yp-debate-info', {
        count: this.totalCount,
        firstPoint: this.points[0],
      });
    }
  }

  async _insertNewPoint(point: YpPointData) {
    if (!this.loadedPointIds[point.id]) {
      this.loadedPointIds[point.id] = true;
      if (this.wide) {
        if (point.value > 0) {
          this.upPoints?.unshift(point);
        } else if (point.value < 0) {
          this.downPoints?.unshift(point);
        }
      } else {
        this.points?.unshift(point);
      }
      await this.requestUpdate();
      setTimeout(() => {
        this._listResize();
      }, 2500);
      this.storedPoints?.unshift(point);
    }
  }

  _addMorePoint(point: YpPointData) {
    let haveAddedPoints = false;
    if (!this.loadedPointIds[point.id]) {
      this.loadedPointIds[point.id] = true;
      haveAddedPoints = true;
      if (this.wide) {
        if (point.value > 0) {
          this.upPoints?.push(point);
        } else if (point.value < 0) {
          this.downPoints?.push(point);
        }
      } else {
        this.points?.push(point);
      }

      this.storedPoints?.push(point);

      if (point.value > 0) {
        this.storedUpPointsCount += 1;
      } else if (point.value < 0) {
        this.storedDownPointsCount += 1;
      }
    }

    return haveAddedPoints;
  }

  _completeNewPointResponse(point: YpPointData) {
    this.addPointDisabled = false;
    point = this._preProcessPoints([point])[0];
    if (this.currentVideoId) {
      point.checkTranscriptFor = 'video';
    } else if (this.currentAudioId) {
      point.checkTranscriptFor = 'audio';
    }
    if (point.value > 0) {
      this.newPointTextCombined =
        this.t('point.forAdded') +
        ' ' +
        YpFormattingHelpers.truncate(point.content, 21);
      this._clearTextValueUp();
    } else {
      this.newPointTextCombined =
        this.t('point.againstAdded') +
        ' ' +
        YpFormattingHelpers.truncate(point.content, 21);
      this._clearTextValueDown();
    }
    this._clearTextValueMobileUpOrDown();
    this._insertNewPoint(point);
    this.post.counter_points = this.post.counter_points + 1;
    //TODO: Get working with a global dialog with  this.newPointTextCombined
    //this.$$('#newPointToast').show();
    this._updateCounterInfo();
    if (point.value > 0) {
      window.appGlobals.activity('completed', 'newPointFor');
    } else {
      window.appGlobals.activity('completed', 'newPointAgainst');
    }
    this._clearVideo();
    this._clearAudio();
  }
  
  addPointUp() {
    this.addPoint(
      this.textValueUp,
      1,
      this.uploadedVideoUpId,
      this.uploadedAudioUpId
    );
    window.appGlobals.activity('add', 'pointUp');
  }

  addPointDown() {
    this.addPoint(
      this.textValueDown,
      -1,
      this.uploadedVideoDownId,
      this.uploadedAudioDownId
    );
    window.appGlobals.activity('add', 'pointDown');
  }

  addMobilePointUpOrDown() {
    if (this.pointUpOrDownSelected == 'pointFor') {
      this.addPoint(
        this.textValueMobileUpOrDown,
        1,
        this.uploadedVideoMobileId,
        this.uploadedAudioMobileId
      );
      window.appGlobals.activity('add', 'pointUp');
    } else if (this.pointUpOrDownSelected == 'pointAgainst') {
      this.addPoint(
        this.textValueMobileUpOrDown,
        -1,
        this.uploadedVideoMobileId,
        this.uploadedAudioMobileId
      );
      window.appGlobals.activity('add', 'pointDown');
    }
  }

  async addPoint(
    content: string,
    value: number,
    videoId: number | undefined,
    audioId: number | undefined
  ) {
    if (window.appUser.loggedIn() === true) {
      if (videoId) this.currentVideoId = videoId;
      else if (audioId) this.currentAudioId = audioId;
      this.addPointDisabled = true;
      let point;
      try {
        point = await window.serverApi.addPoint(this.post.group_id, {
          postId: this.post.id,
          content: content,
          value: value,
        });
      } catch (error: unknown) {
        if ((error as YpErrorData).offlineSendLater) {
          this.addPointDisabled = false;
          this._clearTextValueDown();
          this._clearTextValueUp();
          this._clearTextValueMobileUpOrDown();
        } else {
          console.error(error);
        }
      }
      point = this._preProcessPoints([point])[0];
      if (this.currentVideoId) {
        await window.serverApi.completeMediaPoint('videos', point.id, {
          videoId: this.currentVideoId,
          appLanguage: this.language,
        });
        window.appGlobals.showSpeechToTextInfoIfNeeded();
      } else if (this.currentAudioId) {
        await window.serverApi.completeMediaPoint('audios', point.id, {
          videoId: this.currentAudioId,
          appLanguage: this.language,
        });
        window.appGlobals.showSpeechToTextInfoIfNeeded();
      }
      this._completeNewPointResponse(point);
    } else {
      window.appUser.loginForNewPoint(this, { content: content, value: value });
    }
  }

  focusUpPoint() {
    window.appGlobals.activity('focus', 'pointUp');
  }

  focusDownPoint() {
    window.appGlobals.activity('focus', 'pointDown');
  }

  focusMobilePoint() {
    window.appGlobals.activity('focus', 'mobilePoint');
  }

  focusTextArea(event: CustomEvent) {
    if (window.innerWidth > 500) {
      //TODO: Get working again
      //event.currentTarget.parentElement.elevation = 2;
    }
  }

  blurTextArea(event: CustomEvent) {
    //TODO: Get working again
    //event.currentTarget.parentElement.elevation = 1;
  }

  _hasCurrentUpVideo() {
    if (this.hasCurrentUpVideo) {
      this.hideUpAudio = true;
      this.hideUpText = true;
    } else {
      this.hideUpAudio = false;
      this.hideUpText = false;
    }
  }

  _hasCurrentDownVideo() {
    if (this.hasCurrentDownVideo) {
      this.hideDownAudio = true;
      this.hideDownText = true;
    } else {
      this.hideDownAudio = false;
      this.hideDownText = false;
    }
  }

  _hasCurrentUpAudio() {
    if (this.hasCurrentUpAudio) {
      this.hideUpVideo = true;
      this.hideUpText = true;
    } else {
      this.hideUpVideo = false;
      this.hideUpText = false;
    }
  }

  _hasCurrentDownAudio() {
    if (this.hasCurrentDownAudio) {
      this.hideDownVideo = true;
      this.hideDownText = true;
    } else {
      this.hideDownVideo = false;
      this.hideDownText = false;
    }
  }

  _hasCurrentMobileVideo() {
    if (this.hasCurrentMobileVideo) {
      this.hideMobileAudio = true;
      this.hideMobileText = true;
    } else {
      this.hideMobileAudio = false;
      this.hideMobileText = false;
    }
  }

  _hasCurrentMobileAudio() {
    if (this.hasCurrentMobileAudio) {
      this.hideMobileVideo = true;
      this.hideMobileText = true;
    } else {
      this.hideMobileVideo = false;
      this.hideMobileText = false;
    }
  }

  get ifLengthUpIsRight() {
    
    return this.ifLengthIsRight(
      'up',
      this.textValueUp,
      this.uploadedVideoUpId,
      this.uploadedAudioUpId
    );
  }

  get ifLengthDownIsRight() {
    return this.ifLengthIsRight(
      'down',
      this.textValueDown,
      this.uploadedVideoDownId,
      this.uploadedAudioDownId
    );
  }

  get ifLengthMobileIsRight() {
    return this.ifLengthIsRight(
      'mobile',
      this.textValueMobileUpOrDown,
      this.uploadedVideoMobileId,
      this.uploadedAudioMobileId
    );
  }

  ifLengthIsRight(
    type: string,
    textValue: string | undefined,
    hasVideoId: number | undefined,
    hasAudioId: number | undefined
  ) {
    if (hasVideoId != undefined) {
      if (type === 'up') {
        this.hideUpVideo = false;
        this.hideUpAudio = true;
        this.hideUpText = true;
      }
      if (type === 'down') {
        this.hideDownVideo = false;
        this.hideDownAudio = true;
        this.hideDownText = true;
      }
      if (type === 'mobile') {
        this.hideMobileVideo = false;
        this.hideMobileAudio = true;
        this.hideMobileText = true;
      }
      return true;
    } else if (hasAudioId != undefined) {
      if (type === 'up') {
        this.hideUpAudio = false;
        this.hideUpVideo = true;
        this.hideUpText = true;
      }
      if (type === 'down') {
        this.hideDownAudio = false;
        this.hideDownVideo = true;
        this.hideDownText = true;
      }
      if (type === 'mobile') {
        this.hideMobileAudio = false;
        this.hideMobileVideo = true;
        this.hideMobileText = true;
      }
      return true;
    } else if (textValue && textValue.length === 0) {
      if (type === 'up') {
        this.hideUpVideo = false;
        this.hideUpAudio = false;
        this.hideUpText = false;
      }
      if (type === 'down') {
        this.hideDownVideo = false;
        this.hideDownAudio = false;
        this.hideDownText = false;
      }
      if (type === 'mobile') {
        this.hideMobileVideo = false;
        this.hideMobileAudio = false;
        this.hideMobileText = false;
      }
      return false;
    } else if (
      textValue != null &&
      textValue.length > 0 &&
      textValue.trim().length > 0
    ) {
      if (type === 'up') {
        this.hideUpVideo = true;
        this.hideUpAudio = true;
        this.hideUpText = false;
      }
      if (type === 'down') {
        this.hideDownVideo = true;
        this.hideDownAudio = true;
        this.hideDownText = false;
      }
      if (type === 'mobile') {
        this.hideMobileVideo = true;
        this.hideMobileAudio = true;
        this.hideMobileText = false;
      }
      return true;
    } else if (
      textValue != null &&
      textValue.length > 1 &&
      textValue.trim().length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
