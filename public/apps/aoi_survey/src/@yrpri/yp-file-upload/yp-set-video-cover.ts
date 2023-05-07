import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/web/textfield/outlined-text-field.js';
import '@material/mwc-linear-progress';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';

import '@material/web/radio/radio.js';
import { MdRadio } from '@material/web/radio/radio.js';

//import '../yp-post/yp-posts-list.js';
import '../common/yp-emoji-selector.js';
//import '../yp-post/yp-post-card-add.js';

import { YpBaseElement } from '../common/yp-base-element.js';

@customElement('yp-set-video-cover')
export class YpSetVideoCover extends YpBaseElement {
  @property({ type: Number })
  videoId!: number;

  @property({ type: String })
  previewVideoUrl: string | undefined;

  @property({ type: Array })
  videoImages: Array<string> | undefined;

  @property({ type: Number })
  selectedVideoCoverIndex = 0;

  @property({ type: Boolean })
  useMainPhotoForVideoCover = false;

  @property({ type: Boolean })
  noDefaultCoverImage = false;

  static get styles() {
    return [
      super.styles,
      css`
        .previewFrame {
          max-height: 50px;
          max-width: 89px;
          height: 50px;
          width: 89px;
          cursor: pointer;
        }

        .videoImages {
          overflow-x: auto;
          width: 200px;
          max-height: 70px;
          height: 70px;
        }

        .selectedCover {
          border-top: 2px solid var(--accent-color);
          max-height: 50px;
          max-width: 89px;
          white-space: nowrap;
        }

        .coverImage {
          max-height: 50px;
          max-width: 89px;
          white-space: nowrap;
        }

        .limitInfo {
          margin-top: 0;
          color: #656565;
          text-align: center;
          font-size: 14px;
        }

        .mainPhotoCheckbox {
          margin-top: 4px;
          margin-bottom: 4px;
        }
      `,
    ];
  }

  render() {
    return this.videoImages
      ? html`
          <video
            hidden
            controls
            class="previewVideo"
            .url="${this.previewVideoUrl}"></video>
          <div class="layout horizontal videoImages videoPreviewContainer">
            <div style="white-space: nowrap">
              ${this.videoImages.map(
                (image, index) => html`
                  <img
                    .class="${this._classFromImageIndex(index)}"
                    data-index="${index}"
                    @click="${this._selectVideoCover}"
                    sizing="cover"
                    class="previewFrame"
                    src="${image}" />
                `
              )}

              <div
                class="layout horizontal mainPhotoCheckbox"
                ?hidden="${this.noDefaultCoverImage}">
                <mwc-formfield .label="${this.t('useMainPhoto')}">
                  <md-radio
                    @click="${this._selectVideoCoverMainPhoto}"
                    name="useMainPhoto"></md-radio>
                </mwc-formfield>
              </div>
            </div>
          </div>

        `
      : nothing;
  }

  _classFromImageIndex(index: number) {
    if (index == this.selectedVideoCoverIndex) {
      return 'selectedCover';
    } else {
      return 'coverImage';
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('videoId')) {
      this._getVideoMeta();
    }
  }

  async _getVideoMeta() {
    if (this.videoId) {
      const response = await window.serverApi.getVideoFormatsAndImages(this.videoId);
      if (response.previewVideoUrl && response.videoImages) {
        this.previewVideoUrl = response.previewVideoUrl;
        this.videoImages = response.videoImages;
      }
     } else {
      console.error('_getVideoImages no video id');
    }
  }

  _selectVideoCover(event: CustomEvent) {
    const frameIndex = (event.target as HTMLElement).getAttribute('data-index');
    this.fire('set-cover', frameIndex);
    this.fire('set-default-cover', false);
    window.serverApi.setVideoCover(this.videoId,  { frameIndex: frameIndex });

  }

  _selectVideoCoverMainPhoto() {
    setTimeout(() => {
      if ((this.$$('#useMainPhotoId') as MdRadio).checked) {
        window.serverApi.setVideoCover(this.videoId,  { frameIndex: -2 });
        this.fire('set-default-cover', true);
      } else {
        this.fire('set-default-cover', false);
      }
    });
  }
}
