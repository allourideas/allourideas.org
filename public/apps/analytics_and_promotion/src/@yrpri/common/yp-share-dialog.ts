import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from './yp-base-element.js';

import 'share-menu';
import { ShareMenu } from 'share-menu';

@customElement('yp-share-dialog')
export class YpShareDialog extends YpBaseElement {
  @property({ type: Object })
  sharedContent: Function | undefined;

  @property({ type: String })
  url: string | undefined;

  @property({ type: String })
  label: string | undefined;

  render() {
    return html`
      <share-menu
        @share="${this.sharedContent}"
        class="shareIcon"
        id="shareButton"
        .title="${this.t('post.shareInfo')}"
        .url="${this.url || ''}"
      ></share-menu>
    `;
  }

  async open(url: string, label: string, sharedContent: Function) {
    this.url = url;
    this.label = label;
    this.sharedContent = sharedContent;

    await this.requestUpdate();
    (this.$$('#shareButton') as ShareMenu).socials = [
      'clipboard',
      'facebook',
      'twitter',
      'whatsapp',
      'email',
      'linkedin',
    ];
    (this.$$('#shareButton') as ShareMenu).share();
  }
}
