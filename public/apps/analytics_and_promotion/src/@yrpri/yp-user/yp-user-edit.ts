import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/mwc-button';
import '@material/mwc-textfield';

import '../ac-notifications/ac-notification-settings.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-app/yp-language-selector.js';

import { YpEditBase } from '../common/yp-edit-base.js';
import { YpFileUpload } from '../yp-file-upload/yp-file-upload.js';
import { YpConfirmationDialog } from '../yp-dialog-container/yp-confirmation-dialog.js';
import { YpUserDeleteOrAnonymize } from './yp-user-delete-or-anonymize.js';
import { YpApiActionDialog } from '../yp-api-action-dialog/yp-api-action-dialog.js';

@customElement('yp-user-edit')
export class YpUserEdit extends YpEditBase {
  @property({ type: String })
  action = '/users';

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Number })
  selected = 0;

  @property({ type: String })
  encodedUserNotificationSettings: string | undefined;

  @property({ type: String })
  currentApiKey: string | undefined;

  @property({ type: Number })
  uploadedProfileImageId: number | undefined;

  @property({ type: Number })
  uploadedHeaderImageId: number | undefined;

  @property({ type: Object })
  notificationSettings: AcNotificationSettingsData | undefined;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('user')) {
      this._userChanged();
    }

    if (changedProperties.has('notificationSettings')) {
      this._notificationSettingsChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        .container {
          height: 100%;
          min-height: 350px;
        }

        .additionalSettings {
          margin-top: 16px;
        }

        .icon {
          padding-right: 8px;
        }

        h2 {
          padding-top: 16px;
        }

        #deleteUser {
          max-width: 250px;
          margin-top: 16px;
          color: #f00;
        }

        .disconnectButtons {
          margin-top: 8px;
          max-width: 250px;
        }

        yp-language-selector {
          margin-bottom: 8px;
        }

        mwc-button {
          text-align: center;
        }

        .ssn {
          margin-top: 0;
          margin-bottom: 4px;
          font-weight: 400;
        }

        [hidden] {
          display: none !important;
        }

        .tempApiKeyContainer {
          margin-top: 16px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          padding-top: 8px;
        }

        .temporaryApiKeyInformation {
          color: #F00;
          font-size: 16px;
          margin-bottom: 8px;

        }

        .apiKey {
          font-size: 16px;
          padding-right: 8px;
          padding-top: 12px;
          font-weight: bold;
        }
      `,
    ];
  }

  render() {
    return this.user
      ? html`
          <yp-edit-dialog
            name="userEdit"
            id="editDialog"
            .title="${this.editHeaderText}"
            doubleWidth
            icon="face"
            .action="${this.action}"
            @iron-form-response="${this._editResponse}"
            method="${this.method}"
            .params="${this.params}"
            .saveText="${this.saveText}"
            .snackbarText="${this.snackbarText || ''}">
            <div class="container">
              <div class="layout vertical wrap container">
                <mwc-textfield
                  id="name"
                  name="name"
                  type="text"
                  .label="${this.t('Name')}"
                  .value="${this.user.name}"
                  maxlength="50"
                  char-counter>
                </mwc-textfield>

                <div class="ssn" ?hidden="${!this.user.ssn}">
                  ${this.t('ssn')}: ${this.user.ssn}
                </div>

                <mwc-textfield
                  id="email"
                  name="email"
                  type="text"
                  .label="${this.t('Email')}"
                  .value="${this.user.email || ''}">
                </mwc-textfield>

                <div class="layout horizontal wrap">
                  <div class="layout vertical additionalSettings">
                    <yp-file-upload
                      id="profileImageUpload"
                      raised
                      target="/api/images?itemType=user-profile"
                      method="POST"
                      buttonIcon="photo_camera"
                      .buttonText="${this.t('image.profile.upload')}"
                      @success="${this._profileImageUploaded}">
                    </yp-file-upload>
                  </div>

                  <div class="layout vertical additionalSettings" hidden="">
                    <yp-file-upload
                      id="headerImageUpload"
                      raised
                      target="/api/images?itemType=user-header"
                      method="POST"
                      buttonIcon="photo_camera"
                      .buttonText="${this.t('image.header.upload')}"
                      @success="${this._headerImageUploaded}">
                    </yp-file-upload>
                  </div>
                </div>

                <yp-language-selector
                  name="defaultLocale"
                  auto-translate-option-disabled=""
                  .selectedLocale="${this.user
                    .default_locale}"></yp-language-selector>

                <mwc-button ?hidden="${this.user.profile_data?.hasApiKey}" raised .label="${this.t('createApiKey')}" class="disconnectButtons" @click="${this._createApiKey}"></mwc-button>

                <mwc-button ?hidden="${!this.user.profile_data?.hasApiKey}" .label="${this.t('reCreateApiKey')}" raised class="disconnectButtons" @click="${this._reCreateApiKey}"></mwc-button>

                <div class="layout vertical tempApiKeyContainer" ?hidden$="${!this.currentApiKey}">
                  <div class="temporaryApiKeyInformation">${this.t('showingApiKeyOnce')}</div>
                  <div class="layout horizontal">
                    <div class="apiKey">${this.currentApiKey}</div>
                    <mwc-button raised .label="${this.t('copyApiKey')}" @click="${this._copyApiKey}"></mwc-button>
                  </div>
                </div>

                <mwc-button
                  ?hidden="${!this.user.facebook_id}"
                  class="disconnectButtons"
                  raised
                  .label="${this.t('disconnectFromFacebookLogin')}"
                  @click="${this._disconnectFromFacebookLogin}"></mwc-button>

                <mwc-button
                  ?hidden="${!this.user.ssn}"
                  raised
                  .label="${this.t('disconnectFromSamlLogin')}"
                  class="disconnectButtons"
                  @click="${this._disconnectFromSamlLogin}"></mwc-button>

                <mwc-button
                  id="deleteUser"
                  raised
                  .label="${this.t('deleteOrAnonymizeUser')}"
                  @click="${this._deleteOrAnonymizeUser}"></mwc-button>

                <input
                  type="hidden"
                  name="uploadedProfileImageId"
                  .value="${this.uploadedProfileImageId}" />

                <input
                  type="hidden"
                  name="uploadedHeaderImageId"
                  .value="${this.uploadedHeaderImageId}" />

                <h2>${this.t('user.notifications')}</h2>

                <ac-notification-settings
                  .notificationsSettings="${this
                    .notificationSettings!}"></ac-notification-settings>

                <input
                  type="hidden"
                  name="notifications_settings"
                  .value="${this.encodedUserNotificationSettings || ''}" />
              </div>
            </div>
          </yp-edit-dialog>
        `
      : nothing;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener(
      'yp-notifications-changed',
      this._setNotificationSettings.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener(
      'yp-notifications-changed',
      this._setNotificationSettings.bind(this)
    );
  }

  _editResponse(event: CustomEvent) {
    if (event.detail.response.duplicateEmail) {
      this.fire('yp-error', this.t('emailAlreadyRegisterred'))
    }
  }

  _checkIfValidEmail() {
    return (
      this.user &&
      this.user.email &&
      !(
        this.user.email.indexOf('@citizens.is') > -1 &&
        this.user.email.indexOf('anonymous') > -1
      )
    );
  }

  _disconnectFromFacebookLogin() {
    if (this._checkIfValidEmail()) {
      window.appDialogs
        .getDialogAsync(
          'confirmationDialog',
           (dialog: YpConfirmationDialog) => {
            dialog.open(
              this.t('areYouSureYouWantToDisconnectFacebookLogin'),
              this._reallyDisconnectFromFacebookLogin.bind(this),
              true
            );
          }
        );
    } else {
      this.fire('yp-error', this.t('cantDisconnectFromFacebookWithoutValidEmail'))
    }
  }

  async _reallyDisconnectFromFacebookLogin() {
    await window.serverApi.disconnectFacebookLogin();
    this.user!.facebook_id = undefined;
    window.appGlobals.notifyUserViaToast(
      this.t('disconnectedFacebookLoginFor') + ' ' + this.user!.email
    );
  }

  _disconnectFromSamlLogin() {
    if (this._checkIfValidEmail()) {
      window.appDialogs
        .getDialogAsync(
          'confirmationDialog',
           (dialog: YpConfirmationDialog) => {
            dialog.open(
              this.t('areYouSureYouWantToDisconnectSamlLogin'),
              this._reallyDisconnectFromSamlLogin.bind(this),
              true
            );
          }
        );
    } else {
      this.fire('yp-error', this.t('cantDisconnectFromSamlWithoutValidEmail'))
    }
  }

  async _reallyDisconnectFromSamlLogin() {
    await window.serverApi.disconnectSamlLogin();
    if (this.user) this.user.ssn = undefined;
    window.appGlobals.notifyUserViaToast(
      this.t('disconnectedSamlLoginFor') + ' ' + this.user!.email
    );
  }

  _setNotificationSettings(event: CustomEvent) {
    this.notificationSettings = event.detail;
    this.encodedUserNotificationSettings = this._encodeNotificationsSettings(
      this.notificationSettings
    );
  }

  _notificationSettingsChanged() {
    if (this.notificationSettings) {
      this.encodedUserNotificationSettings = this._encodeNotificationsSettings(
        this.notificationSettings
      );
    }
  }

  _encodeNotificationsSettings(
    settings: AcNotificationSettingsData | undefined
  ) {
    if (settings) {
      return JSON.stringify(settings);
    } else {
      return undefined;
    }
  }

  _userChanged() {
    if (this.user) {
      this.notificationSettings = this.user.notifications_settings;
    }
  }

  _profileImageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedProfileImageId = image.id;
  }

  _headerImageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  customRedirect() {
    window.appUser.checkLogin();
  }

  clear() {
    this.user = { name: '', email: '' } as YpUserData;
    this.uploadedProfileImageId = undefined;
    this.uploadedHeaderImageId = undefined;
    (this.$$('#headerImageUpload') as YpFileUpload).clear();
    (this.$$('#profileImageUpload') as YpFileUpload).clear();
  }

  _copyApiKey() {
    navigator.clipboard.writeText(this.currentApiKey!);
  }

  async _createApiKey() {
    window.appGlobals.activity('open', 'user.createApiKey');
    const response = await window.serverApi.createApiKey() as YpCreateApiKeyResponse;
    this.currentApiKey = response.apiKey;
    this.user!.profile_data!.hasApiKey = true;
  }

  _reCreateApiKey() {
    window.appGlobals.activity('open', 'user.reCreateApiKey');
    window.appDialogs.getDialogAsync("apiActionDialog", (dialog: YpApiActionDialog) => {
      dialog.setup('/api/users/createApiKey',
        this.t('areYouSureYouWantToRecreateApiKey'), this._createApiKey.bind(this), this.t('recreate'), "POST");
      dialog.open();
    });
  }

  setup(
    user: YpUserData,
    newNotEdit: boolean,
    refreshFunction: Function | undefined,
    openNotificationTab = false
  ) {
    this.user = user;
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    if (openNotificationTab) {
      this.selected = 1;
    }
    this.setupTranslation();
  }

  setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t('user.new');
      this.snackbarText = this.t('userToastCreated');
      this.saveText = this.t('create');
    } else {
      this.saveText = this.t('save');
      this.editHeaderText = this.t('user.edit');
      this.snackbarText = this.t('userToastUpdated');
    }
  }

  _deleteOrAnonymizeUser() {
    window.appDialogs
      .getDialogAsync(
        'userDeleteOrAnonymize',
         (dialog: YpUserDeleteOrAnonymize) => {
          dialog.open();
        }
      );
  }
}
