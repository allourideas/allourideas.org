import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { classMap } from 'lit/directives/class-map.js';
import { accessibleSnackbarLabel } from '@material/mwc-snackbar/accessible-snackbar-label-directive.js';

import '../yp-user/yp-user-with-organization.js';
import { Snackbar } from '@material/mwc-snackbar';
import { YpBaseElement } from '../common/yp-base-element.js';

@customElement('ac-notification-toast')
export class AcNotificationToast extends Snackbar {
  @property({ type: String })
  notificationText = '';

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: String })
  icon: string | undefined;

  @property({ type: Boolean })
  largerFont = false

  static get styles() {
    return [
      super.styles as any,
      css`
        .icon {
          height: 32px;
          width: 32px;
          min-width: 32px;
          min-height: 32px;
        }

        .text[large-font] {
          margin: 8px;
          font-size: 16px;
          margin-left: 12px;
        }
      `,
    ];
  }

  render() {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };
    return html` <div
      class="mdc-snackbar ${classMap(classes)}"
      @keydown="${this._handleKeydown}"
    >
      <div class="mdc-snackbar__surface">
        ${this.user
          ? html`
              <yp-user-with-organization
                class="layout horizontal self-end"
                .user="${this.user}"
              ></yp-user-with-organization>
            `
          : nothing}
        <div class="layout horizontal">
          <mwc-icon
            class="icon"
            ?hidden="${!this.icon}"
            .icon="${this.icon}"
          ></mwc-icon>
          <!-- add larger-font -->
          ${accessibleSnackbarLabel(this.notificationText, this.open)}
        </div>
        <div class="mdc-snackbar__actions">
          <slot name="action" @click="${this._handleActionClick}"></slot>
          <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
        </div>
      </div>
    </div>`;
  }

  openDialog(
    user: YpUserData | undefined,
    notificationText: string,
    systemNotification: boolean,
    icon: string | undefined = undefined,
    timeoutMs: number | undefined = undefined,
    largerFont: boolean | undefined = undefined
  ) {
    this.notificationText = notificationText;
    if (!systemNotification) {
      this.user = user;
    }

    if (icon) {
      this.icon = icon;
    } else {
      this.icon = undefined;
    }

    if (largerFont) {
      this.largerFont = true;
    } else {
      this.largerFont = false;
    }

    if (timeoutMs) {
      this.timeoutMs = timeoutMs;
    }
    this.open = true;
  }
}
