import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import './ac-notification-selection.js';

@customElement('ac-notification-settings')
export class AcNotificationSettings extends YpBaseElement {
  @property({ type: Object })
  notificationsSettings!: AcNotificationSettingsData;

  render() {
    return html`
      <ac-notification-selection
        .name="${this.t('notification.myPosts')}"
        .setting="${this.notificationsSettings.my_posts}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.myPostsEndorsements')}"
        .setting="${this.notificationsSettings.my_posts_endorsements}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.myPoints')}"
        .setting="${this.notificationsSettings.my_points}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.myPointEndorsements')}"
        .setting="${this.notificationsSettings.my_points_endorsements}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.allCommunity')}"
        .setting="${this.notificationsSettings.all_community}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.allGroup')}"
        .setting="${this.notificationsSettings.all_group}">
      </ac-notification-selection>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener(
      'yp-notification-changed',
      this._settingsChanged.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener(
      'yp-notification-changed',
      this._settingsChanged.bind(this)
    );
  }

  _settingsChanged() {
    this.fire('yp-notifications-changed', this.notificationsSettings);
  }
}
