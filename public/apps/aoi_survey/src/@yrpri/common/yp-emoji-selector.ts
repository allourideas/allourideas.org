import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from './yp-base-element.js';
//import insertTextAtCursor from 'insert-text-at-cursor';

import '@material/web/iconbutton/outlined-icon-button.js';

//TODO: Load this one later emoji-button is 256KB!
@customElement('yp-emoji-selector')
export class YpEmojiSelector extends YpBaseElement {
  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  render() {
    return html`
      <md-outlined-icon-button
        .label="${this.t('addEmoji')}"
        id="trigger"
        icon="sentiment_satisfied_alt"
        @click="${this.togglePicker}"></md-outlined-icon-button>
    `;
  }

  togglePicker() {
    window.appDialogs.getDialogAsync("emojiDialog", (dialog: YpEmojiSelectorData) => {
      dialog.open(this.$$("#trigger") as HTMLInputElement, this.inputTarget!)
    })
  }
}
