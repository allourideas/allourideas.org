import { LitElement, css, html, nothing } from 'lit';
import {
  property,
  customElement,
  queryAll,
  queryAsync,
} from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import '@material/web/formfield/formfield.js';
import '@material/web/radio/radio.js';
import '@material/web/button/tonal-button.js';
import '@material/web/button/text-button.js';

import '@material/web/checkbox/checkbox.js';

import '@material/mwc-textarea/mwc-textarea.js';

import '@material/web/textfield/outlined-text-field.js';
import '@material/web/textfield/filled-text-field.js';

import { Dialog } from '@material/mwc-dialog';
import { TonalButton } from '@material/web/button/lib/tonal-button.js';
import { TextArea } from '@material/mwc-textarea/mwc-textarea.js';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';
import { Checkbox } from '@material/web/checkbox/lib/checkbox.js';

import { YpCollectionHelpers } from '../@yrpri/common/YpCollectionHelpers';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';

import '../@yrpri/yp-file-upload/yp-file-upload-icon.js';

@customElement('yp-new-campaign')
export class YpNewCampaign extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Object })
  campaign: YpCampaignData | undefined;

  @property({ type: Boolean })
  previewEnabled = false;

  @property({ type: String })
  uploadedImageUrl: string | undefined;

  @property({ type: String })
  targetAudience: string | undefined;

  @property({ type: String })
  campaignName: string | undefined;

  @property({ type: String })
  promotionText: string | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog div {
          flex-direction: column;
        }

        @media (max-width: 1100px) {
        }

        mwc-dialog div,
        md-radio {
          display: flex;
        }

        .button {
        }

        .okButton {
          margin-right: 8px;
        }

        .collectionLogoImage {
          width: 350px;
          height: 197px;
        }

        @media (max-width: 1100px) {
          .collectionLogoImage {
            width: 100%;
          }
        }

        .headerText {
          color: var(--md-sys-color-on-surface);
          font-size: 18px;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        mwc-dialog {
          --mdc-shape-medium: 24px !important;
          --mdc-theme-surface: var(--md-sys-color-surface);
          --mdc-dialog-heading-ink-color: var(--md-sys-color-on-surface);
          --mdc-dialog-box-shadow: none;
        }

        md-outlined-text-field {
          width: 350px;
        }

        mwc-textarea {
          width: 350px;
          --mdc-theme-primary: var(--md-sys-color-primary);
          --mdc-text-field-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-on-surface-variant
          );
        }

        @media (max-width: 1100px) {
          md-outlined-text-field {
            width: 290px;
          }
          mwc-textarea {
            width: 290px;
          }
        }

        @media (max-width: 400px) {
          md-outlined-text-field {
            width: 270px;
          }
          mwc-textarea {
            width: 270px;
          }
        }

        mwc-textarea.rounded {
          --mdc-shape-small: 4px;
        }

        .formField {
          margin-top: 16px;
        }

        md-formfield {
          width: 130px;
        }

        .otherTextField {
          width: 79px;
        }

        .adMediumsList {
          margin-top: 3px;
        }

        .preview {
          background-color: var(--md-sys-color-container);
          color: var(--md-sys-color-on-container);
          padding-top: 8px;
          padding-bottom: 8px;
          width: 350px;
        }

        .linkContentPanel {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          padding: 0;
        }

        .linkDescription {
          padding: 8px;
        }

        .previewPromotionText {
          margin-bottom: 8px;
        }

        @media (max-width: 1100px) {
          .preview {
            width: 100%;
            margin-left: -16px;
            margin-right: -16px;
          }

          .previewPromotionText {
            padding: 16px;
          }
        }

        .linkTitle {
          font-weight: bold;
          margin-bottom: 8px;
          margin-top: 6px;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 8px;
        }

        .linkImage {
        }

        yp-file-upload-icon {
          top: 16px;
          right: 16px;
          margin-bottom: -56px;
          margin-left: 8px;
          z-index: 8;
        }
      `,
    ];
  }

  open() {
    const dialog = this.$$('#newCampaignDialog') as Dialog;
    dialog.show();
  }

  getMediums() {
    let mediums: string[] = [];

    const checkboxes = this.shadowRoot!.querySelectorAll(
      'md-checkbox'
    ) as NodeListOf<Checkbox>;

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        mediums.push(checkbox.name);
      }
    });

    return mediums;
  }

  async inputsChanged() {
    const okButton = this.$$('md-tonal-button') as TonalButton;
    const promotionTextArea = this.$$('mwc-textarea') as TextArea;
    const nameTextField = this.$$('#campaignName') as OutlinedTextField;

    //TODO: don't use timeout here, find away to wait for all the checkboxes to be updated
    setTimeout(() => {
      this.campaignName = nameTextField.value;
      this.promotionText = promotionTextArea.value;

      const mediums = this.getMediums();

      if (
        mediums.length > 0 &&
        nameTextField.value.length > 0 &&
        promotionTextArea.value.length > 0
      ) {
        this.previewEnabled = true;
        okButton.disabled = false;
      } else {
        this.previewEnabled = false;
        okButton.disabled = true;
      }
    }, 50);
  }

  save() {
    this.fire('save', {
      targetAudience: this.targetAudience,
      promotionText: this.promotionText,
      name: this.campaignName,
      shareImageUrl: this.uploadedImageUrl,
      mediums: this.getMediums(),
    });
    this.close();
  }

  discard() {
    this.close();
  }

  close() {
    const dialog = this.$$('#newCampaignDialog') as Dialog;
    dialog.close();
  }

  cancel() {
    if (this.previewEnabled) {
      const dialog = this.$$('#confirmationDialog') as Dialog;
      dialog.show();
    } else {
      this.discard();
    }
  }

  renderAdMediums() {
    return html`
      <div class="layout vertical adMediumsList" @click="${this.inputsChanged}">
        <md-formfield .label="${this.t('facebook')}">
          <md-checkbox name="facebook"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('twitter')}">
          <md-checkbox name="twitter"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('adwords')}">
          <md-checkbox name="adwords"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('linkedin')}">
          <md-checkbox name="linkedin"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('snapchat')}">
          <md-checkbox name="snapchat"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('instagram')}">
          <md-checkbox name="instagram"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('youtube')}">
          <md-checkbox name="youtube"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('tiktok')}">
          <md-checkbox name="tiktok"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('whatsapp')}">
          <md-checkbox name="whatsapp"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('email')}">
          <md-checkbox name="email"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('other')}" class="otherFormField">
          <md-checkbox name="other"></md-checkbox>
        </md-formfield>
        <md-outlined-text-field
          class="formField otherTextField"
          hidden
          .label="${this.t('other')}"
        ></md-outlined-text-field>
      </div>
    `;
  }

  renderTextInputs() {
    return html`
      <div class="layout horizontal">
        <div class="layout vertical">
          <md-outlined-text-field
            class="formField"
            id="campaignName"
            @keydown="${this.inputsChanged}"
            .label="${this.t('promotionName')}"
          ></md-outlined-text-field>

          <mwc-textarea
            rows="5"
            class="rounded formField"
            label="${this.t('promotionText')}"
            outlined
            charCounter
            maxLength="280"
            @keydown="${this.inputsChanged}"
          >
          </mwc-textarea>
        </div>
      </div>
    `;
  }

  imageUploadCompleted(event: CustomEvent) {
    const file = JSON.parse(event.detail.xhr.response);
    const formats = JSON.parse(file.formats);
    this.uploadedImageUrl = formats[0];
  }

  get collectionImageUrl() {
    return this.uploadedImageUrl || YpCollectionHelpers.logoImagePath(
      this.collectionType,
      this.collection!
    )
  }

  renderPreview() {
    return html`
      <div class="layout vertical center-center">
        <div class="headerText">${this.t('promotionPreview')}</div>
        <div class="preview">
          <div class="previewPromotionText">${this.promotionText}</div>
          <div class="linkImage">
            <yp-file-upload-icon
              target="/api/images?itemType=group-logo" method="POST"
              @success="${this.imageUploadCompleted}"
            ></yp-file-upload-icon>
            <yp-image
              class="collectionLogoImage"
              sizing="cover"
              .src="${this.collectionImageUrl}"
            ></yp-image>
          </div>
          <div class="linkContentPanel">
            <div class="linkTitle">${this.collection!.name}</div>
            <div class="linkDescription">
              ${YpFormattingHelpers.truncate(
                this.collection!.description || this.collection?.objectives!,
                150
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderConfirmationDialog() {
    return html`
      <mwc-dialog id="confirmationDialog" crimClickAction="" escapeKeyAction="">
        <div class="layout horizontal center-center">
          <div class="headerText">${this.t('discardDraft')}</div>
        </div>
        <md-text-button
          .label="${this.t('cancel')}"
          class="button"
          dialogAction="cancel"
          slot="secondaryAction"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          class="button okButton"
          .label="${this.t('discard')}"
          @click="${this.discard}"
          slot="primaryAction"
        >
        </md-tonal-button>
      </mwc-dialog>
    `;
  }

  render() {
    return html`
      <mwc-dialog
        id="newCampaignDialog"
        scrimClickAction=""
        escapeKeyAction=""
        modal
        heading="${this.t('newTrackingPromotion')}"
      >
        <div class="layout ${this.wide ? 'horizontal' : 'vertical'}">
          <div class="layout vertical">
            ${this.renderTextInputs()}
            ${!this.wide ? this.renderAdMediums() : nothing}
            ${this.renderPreview()}
          </div>
          ${this.wide ? this.renderAdMediums() : nothing}
        </div>
        <md-text-button
          .label="${this.t('cancel')}"
          class="button"
          @click="${this.cancel}"
          slot="secondaryAction"
        >
        </md-text-button>
        <md-tonal-button
          disabled
          class="button okButton"
          .label="${this.t('save')}"
          @click="${this.save}"
          slot="primaryAction"
        >
        </md-tonal-button>
      </mwc-dialog>
      ${this.renderConfirmationDialog()}
    `;
  }
}
