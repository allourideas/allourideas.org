import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ifDefined } from 'lit/directives/if-defined.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

import '../common/yp-image.js';

//TODO: Integrate https://github.com/sachinchoolur/lightGallery/tree/master/lightgallery-lit

@customElement('yp-post-cover-media')
export class YpPostCoverMedia extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: Boolean })
  topRadius = false;

  @property({ type: Boolean })
  topLeftRadius = false;

  @property({ type: String })
  altTag: string | undefined;

  @property({ type: Number })
  postAudioId: number | undefined;

  @property({ type: Number })
  postVideoId: number | undefined;

  @property({ type: Boolean })
  headerMode = false;

  @property({ type: Boolean })
  disableMaps = false;

  @property({ type: Boolean })
  mapActivated = false;

  @property({ type: Boolean })
  streetViewActivated = false;

  @property({ type: Boolean })
  tiny = false;

  //TODO: Make this dynamic from server, even if this key is host protected
  @property({ type: String })
  staticMapsApiKey = 'AIzaSyBYy8UvdDD650mz7k1pY0j2hBFQmCPVnxA';

  @property({ type: Number })
  uploadedDefaultPostImageId: number | undefined;

  @property({ type: Number })
  defaultImageGroupId: number | undefined;

  @property({ type: Boolean })
  defaultPostImageEnabled = false;

  @property({ type: Boolean })
  showVideo = false;

  @property({ type: Boolean })
  showAudio = false;

  @property({ type: Boolean })
  portraitVideo = false;

  // From YpElementWithPlayback
  playStartedAt: Date | undefined;
  videoPlayListener: Function | undefined;
  videoPauseListener: Function | undefined;
  videoEndedListener: Function | undefined;
  audioPlayListener: Function | undefined;
  audioPauseListener: Function | undefined;
  audioEndedListener: Function | undefined;

  connectedCallback() {
    super.connectedCallback();
    if (this.headerMode) {
      YpMediaHelpers.attachMediaListeners(this as YpElementWithPlayback);
      this.addGlobalListener('yp-pause-media-playback', YpMediaHelpers.pauseMediaPlayback.bind(this));
    }
  }

  disconnectedCallback() {
    super.connectedCallback();
    if (this.headerMode) {
      YpMediaHelpers.attachMediaListeners(this as YpElementWithPlayback);
      this.removeGlobalListener('yp-pause-media-playback', YpMediaHelpers.pauseMediaPlayback.bind(this));
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('post')) {
      if (
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.uploadedDefaultPostImageId
      ) {
        this.uploadedDefaultPostImageId = this.post.Group.configuration.uploadedDefaultPostImageId;
        this.defaultImageGroupId = this.post.Group.id;
        this.defaultPostImageEnabled = true;
      } else {
        this.defaultPostImageEnabled = false;
        this.defaultImageGroupId = undefined;
        this.uploadedDefaultPostImageId = undefined;
      }
    }

    if (changedProperties.has('headerMode') && this.headerMode) {
      this.mapActivated = true;
      this.streetViewActivated = true;
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .topContainer {
          height: 100%;
        }

        .topContainer[top-radius] > yp-image,
        #videoPreviewImage {
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
        }

        video {
          outline: none !important;
        }

        .topContainer[top-left-radius] > yp-image,
        #videoPreviewImage,
        google-streetview-pano,
        google-map {
          border-top-left-radius: 4px;
        }

        .topContainer[top-left-radius] > video {
          border-top-left-radius: 4px;
        }

        google-streetview-pano {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        google-map {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .main-image,
        video {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .mapCanvas {
          width: 100%;
          height: 100%;
        }

        .category-icon {
          width: 200px;
          height: 200px;
          padding-top: 32px;
        }

        .category-icon[tiny] {
          width: 100px;
          height: 100px;
          padding-top: 24px;
        }

        .category-icon[large] {
          width: 100%;
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }

        @media (max-width: 960px) {
          .topContainer[top-left-radius] > yp-image {
            border-top-left-radius: 0;
          }
        }

        @media (max-width: 600px) {
          .category-icon {
            width: 130px;
            height: 130px;
          }

          .category-icon[large] {
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          .main-image[header-mode] {
            height: 100%;
          }

          video {
            height: 100%;
          }
        }

        .pointer {
          cursor: pointer;
        }

        .pointer[header-mode] {
          cursor: default;
        }

        [hidden] {
          display: none !important;
        }

        .videoCamStatic {
          width: 32px;
          height: 32px;
          color: var(--primary-background-color);
          margin-top: -68px;
          margin-left: 8px;
        }

        .voiceIcon {
          height: 42px;
          width: 42px;
          color: #333;
          margin-top: 96px;
        }

        @media (max-width: 600px) {
          .voiceIcon {
            height: 42px;
            width: 42px;
            color: #333;
            margin-top: 35px;
          }
        }

        audio {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .playInfo {
          font-style: italic;
        }

        @media (max-width: 960px) {
          .voiceIcon {
            margin-top: 35px;
          }
        }

        @media (max-width: 430px) {
          .voiceIcon {
            margin-top: 28px;
          }
        }

        video {
          background-color: #777;
        }

        #videoPlayer[portrait] {
          width: 100% !important;
          height: 100%;
        }

        .topContainer[portrait] {
          background-color: #777;
        }

        #videoPreviewImage[portrait] {
          width: 40%;
        }

        .videoPreviewContainer {
          width: 100%;
          height: 100%;
        }

        .videoPreviewContainer[portrait] {
          background-color: #777;
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="topContainer"
        top-radius="${this.topRadius}"
        top-left-radius="${this.topLeftRadius}">
        ${this.isNoneActive
          ? html`
              <yp-image
                ?header-mode="${this.headerMode}"
                sizing="cover"
                ?hidden="${this.defaultPostImageEnabled}"
                class="main-image pointer"
                src="https://i.imgur.com/sdsFAoT.png"
                @click="${this._goToPost}"></yp-image>

              ${this.activeDefaultImageUrl
                ? html`
                    <yp-image
                      ?headerMode="${this.headerMode}"
                      alt="${ifDefined(this.altTag)}"
                      sizing="cover"
                      class="main-image pointer"
                      src="${this.activeDefaultImageUrl}"
                      @click="${this._goToPost}"></yp-image>
                  `
                : nothing}
            `
          : nothing}
        ${this.isCategoryActive
          ? html`
              <div id="categoryImageId" class="layout horizontal center-center">
                <yp-image
                  ?header-mode="${this.headerMode}"
                  alt="${ifDefined(this.altTag)}"
                  ?tiny="${this.tiny}"
                  @click="${this._goToPost}"
                  class="category-icon pointer"
                  title="${ifDefined(this.post.Category?.name)}"
                  sizing="contain"
                  src="${this.categoryImagePath}"></yp-image>
              </div>
            `
          : nothing}
        ${this.isCategoryLargeActive
          ? html`
              <yp-image
                ?header-mode="${this.headerMode}"
                alt="${ifDefined(this.altTag)}"
                large
                @click="${this._goToPost}"
                class="category-icon pointer"
                title="${ifDefined(this.post.Category?.name)}"
                sizing="cover"
                src="${this.categoryImagePath}"></yp-image>
            `
          : nothing}
        ${this.isImageActive
          ? html`
              <yp-image
                .header-mode="${this.headerMode}"
                @click="${this._goToPost}"
                .sizing="${this.sizingMode}"
                class="main-image pointer"
                src="${this.postImagePath}"></yp-image>
            `
          : nothing}
        ${this.isVideoActive
          ? html`
              ${this.showVideo
                ? html`
                    <video
                      id="videoPlayer"
                      ?portrait="${this.portraitVideo}"
                      data-id="${ifDefined(this.postVideoId)}"
                      ?header-mode="${this.headerMode}"
                      controls
                      @click="${this._goToPost}"
                      preload="metadata"
                      class="pointer"
                      src="${ifDefined(this.postVideoPath)}"
                      playsinline
                      poster="${this.postVideoPosterPath}"></video>
                  `
                : html`
                    <div
                      class="layout vertical center-center videoPreviewContainer"
                      .portrait="${this.portraitVideo}">
                      <yp-image
                        id="videoPreviewImage layout-self-center"
                        .portrait="${this.portraitVideo}"
                        ?headerMode="${this.headerMode}"
                        @click="${this._goToPost}"
                        sizing="cover"
                        class="main-image pointer"
                        src="${this.postVideoPosterPath}"></yp-image>
                    </div>
                    <mwc-icon
                      class="videoCamStatic">videocam</mwc-icon>
                  `}
            `
          : nothing}
        ${this.showAudio
          ? html`
              <div class="layout vertical center-center">
                <audio
                  id="audioPlayer"
                  data-id="${ifDefined(this.postAudioId)}"
                  ?header-mode="${this.headerMode}"
                  controls
                  preload="metadata"
                  class="pointer"
                  src="${ifDefined(this.postAudioPath)}"
                  ?hidden="${!this.postAudioPath}"
                  playsinline></audio>
              </div>
            `
          : nothing}
        ${this.isAudioActive
          ? html`
              <div class="layout vertical center-center">
                <audio
                  id="audioPlayer"
                  .data-id="${this.postAudioId}"
                  .header-mode="${this.headerMode}"
                  controls
                  preload="metadata"
                  class="pointer"
                  src="${ifDefined(this.postAudioPath)}"
                  ?hidden="${!this.postAudioPath}"
                  playsinline></audio>
              </div>
              <div
                ?hidden="${this.showAudio}"
                class="layout horizontal center-center pointer"
                @click="${this._goToPost}">
                <mwc-icon class="voiceIcon">keyboard_voice</mwc-icon>
              </div>
            `
          : nothing}
        ${!this.disableMaps
          ? html`
              ${this.isStreetViewActive
                ? html`
                    <yp-image
                      @click="${this._goToPost}"
                      class="main-image pointer"
                      sizing="cover"
                      src="https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&amp;zoom=${this.zoomLevel}&amp;size=432x243&amp;maptype=hybrid&amp;markers=color:red%7Clabel:%7C${this.latitude},${this.longitude}&amp;key=${this.staticMapsApiKey}"
                      ?hidden="${this.streetViewActivated}"></yp-image>

                    ${this.streetViewActivated
                      ? html`
                          <google-streetview-pano
                            .position="${this.mapPosition}"
                            heading="330"
                            api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0"
                            pitch="2"
                            zoom="0.8"
                            disable-default-ui=""></google-streetview-pano>
                        `
                      : nothing}
                  `
                : nothing}
              ${this.isMapActive
                ? html`
                    <yp-image
                      @click="${this._goToPost}"
                      class="main-image pointer"
                      ?hidden="${this.mapActivated}"
                      sizing="cover"
                      src="https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&amp;size=432x243&amp;zoom=${this.zoomLevel}&amp;maptype=${this.mapType}&amp;markers=color:red%7Clabel:%7C${this.latitude},${this.longitude}&amp;key=${this.staticMapsApiKey}"></yp-image>

                    ${this.mapActivated
                      ? html`
                          <google-map
                            additional-map-options="{keyboardShortcuts:false}"
                            id="coverMediaMap"
                            class="map"
                            libraries="places"
                            fit-to-markers
                            .zoom="${this.zoomLevel}"
                            .map-type="${this.mapType}"
                            api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0">
                            <google-map-marker
                              slot="markers"
                              .latitude="${this.latitude}"
                              .longitude="${this
                                .longitude}"></google-map-marker>
                          </google-map>
                        `
                      : nothing}
                  `
                : nothing}
            `
          : nothing}
      </div>
    `;
  }

  get sizingMode() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.useContainImageMode
    ) {
      return 'contain';
    } else {
      return 'cover';
    }
  }

  get activeDefaultImageUrl() {
    if (
      this.defaultPostImageEnabled &&
      this.defaultImageGroupId &&
      this.uploadedDefaultPostImageId
    ) {
      return (
        '/api/groups/' +
        this.defaultImageGroupId +
        '/default_post_image/' +
        this.uploadedDefaultPostImageId
      );
    } else {
      return undefined;
    }
  }

  _goToPost() {
    if (
      this.post &&
      this.post.Group.configuration &&
      this.post.Group.configuration.resourceLibraryLinkMode
    ) {
      // Do nothing
    } else {
      if (this.post) {
        if (this.headerMode) {
          YpNavHelpers.goToPost(this.post.id);
        } else {
          YpNavHelpers.goToPost(this.post.id, undefined, undefined, this.post);
        }
      } else {
        console.error('No post in post cover media on goToPost');
      }
    }
  }

  get latitude() {
    if (this.post.location) return this.post.location.latitude;
    else return 0.0;
  }

  get longitude() {
    if (this.post.location) return this.post.location.longitude;
    else return 0.0;
  }

  get isNoneActive() {
    if (this._withCoverMediaType(this.post, 'none')) return true;
    else return false;
  }

  get isCategoryActive() {
    if (
      this.post &&
      this._withCoverMediaType(this.post, 'category') &&
      this.post.id <= 11000 &&
      this._isDomainWithOldCategories()
    )
      return true;
    else return false;
  }

  _isDomainWithOldCategories() {
    // Workaround to support old square category images on Citizens Foundation websites running since 2010
    const hostname = window.location.hostname;
    return (
      hostname.indexOf('betrireykjavik.is') > -1 ||
      hostname.indexOf('betraisland.is') > -1 ||
      hostname.indexOf('yrpri.org') > -1
    );
  }

  get isCategoryLargeActive() {
    if (
      this.post &&
      this._withCoverMediaType(this.post, 'category') &&
      (this.post.id > 11000 || !this._isDomainWithOldCategories())
    )
      return true;
    else return false;
  }

  get isImageActive() {
    if (this._withCoverMediaType(this.post, 'image')) {
      return true;
    } else {
      return false;
    }
  }

  get isVideoActive() {
    if (this._withCoverMediaType(this.post, 'video')) {
      return true;
    } else {
      return false;
    }
  }

  get isAudioActive() {
    if (this._withCoverMediaType(this.post, 'audio')) {
      return true;
    } else {
      return false;
    }
  }

  get isMapActive() {
    if (
      this.post &&
      this.post.location &&
      this.post.location.latitude &&
      this._withCoverMediaType(this.post, 'map')
    )
      return true;
    else return false;
  }

  get isStreetViewActive() {
    if (
      this.post &&
      this.post.location &&
      this.post.location.latitude &&
      this._withCoverMediaType(this.post, 'streetView')
    ) {
      return true;
    } else return false;
  }

  get zoomLevel() {
    if (
      this.post.location &&
      this.post.location.map_zoom
    ) {
      return this.post.location.map_zoom;
    } else return '10';
  }

  get mapType() {
    if (
      this.post.location &&
      this.post.location.mapType &&
      this.post.location.mapType != ''
    )
      return this.post.location.mapType;
    else return 'roadmap';
  }

  _withCoverMediaType(post: YpPostData, mediaType: string) {
    if (!post) {
      console.info('No post for ' + mediaType);
      return false;
    } else {
      if (mediaType == 'none') {
        return (
          !post.Category &&
          (!post.cover_media_type || post.cover_media_type == 'none')
        );
      } else if (
        mediaType == 'category' &&
        post.Category &&
        (!post.cover_media_type || post.cover_media_type == 'none')
      ) {
        return true;
      } else {
        return post && post.cover_media_type == mediaType;
      }
    }
  }

  get mapPosition() {
    if (this.post.location) {
      return {
        lat: this.post.location.latitude,
        lng: this.post.location.longitude,
      };
    } else {
      return { lat: 0, lng: 0 };
    }
  }

  get postImagePath() {
    if (this.post) {
      return YpMediaHelpers.getImageFormatUrl(this.post.PostHeaderImages, 0);
    } else {
      return '';
    }
  }

  get postVideoPath() {
    if (this.post && this.post.PostVideos) {
      const videoURL = YpMediaHelpers.getVideoURL(this.post.PostVideos);
      this.portraitVideo = YpMediaHelpers.isPortraitVideo(this.post.PostVideos);
      if (videoURL) {
        this.postVideoId = this.post.PostVideos[0].id;
        return videoURL;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  get postAudioPath() {
    if (this.post && this.post.PostAudios) {
      const audioURL = YpMediaHelpers.getAudioURL(this.post.PostAudios);
      if (audioURL) {
        this.postAudioId = this.post.PostAudios[0].id;
        return audioURL;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  get postVideoPosterPath() {
    if (this.post && this.post.PostVideos) {
      const videoPosterURL = YpMediaHelpers.getVideoPosterURL(
        this.post.PostVideos,
        this.post.PostHeaderImages
      );
      if (videoPosterURL) {
        return videoPosterURL;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  get categoryImagePath() {
    if (
      this.post &&
      this.post.Category &&
      this.post.Category.CategoryIconImages
    ) {
      return YpMediaHelpers.getImageFormatUrl(
        this.post.Category.CategoryIconImages,
        0
      );
    } else {
      return '';
    }
  }
}
