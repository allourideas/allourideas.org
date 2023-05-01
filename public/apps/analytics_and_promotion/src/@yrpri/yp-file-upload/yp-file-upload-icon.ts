import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/web/iconbutton/outlined-icon-button.js';

import { YpFileUpload } from './yp-file-upload.js';

@customElement('yp-file-upload-icon')
export class YpFileUploadIcon extends YpFileUpload {
  @property({ type: String })
  buttonIcon = 'file_upload';

  static get styles() {
    return [super.styles, css``];
  }

  render() {
    return html`
      <md-outlined-icon-button
        id="button"
        .icon="${this.buttonIcon}"
        class="blue"
        ?raised="${this.raised}"
        .label="${this.buttonText}"
        @click="${this._fileClick}"
      >
      </md-outlined-icon-button>
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}"
      />
    `;
  }
}
