/**
@license
Copyright (c) 2015 Winston Howes. All rights reserved.
Copyright (c) 2016-2021 Citizens Foundation.
This code may only be used under the MIT license found at https://github.com/winhowes/file-upload/blob/master/LICENSE
*/
/**
An element providing a solution to no problem in particular.

Example:

    <file-upload target="/path/to/destination"></file-upload>
*/

import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-textarea';
import '@material/mwc-linear-progress';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import '@material/mwc-button';

import '../yp-post/yp-posts-list.js';
import '../common/yp-emoji-selector.js';
import '../yp-post/yp-post-card-add.js';
import './yp-set-video-cover.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpMediaRecorder } from '../yp-media-recorder/yp-media-recorder.js';

@customElement('yp-file-upload')
export class YpFileUpload extends YpBaseElement {
  /**
   * `target` is the target url to upload the files to.
   * Additionally by adding "<name>" in your url, it will be replaced by
   * the file name.
   */
  @property({ type: String })
  target = '';

  @property({ type: Number })
  uploadLimitSeconds: number | undefined;

  /**
   * `progressHidden` indicates whether or not the progress bar should be hidden.
   */
  @property({ type: Boolean })
  progressHidden = false;

  /**
   * `droppable` indicates whether or not to allow file drop.
   */
  @property({ type: Boolean })
  droppable = false;

  /**
   * `dropText` is the  text to display in the file drop area.
   */
  @property({ type: String })
  dropText = '';

  /**
   * `multi` indicates whether or not to allow multiple files to be uploaded.
   */
  @property({ type: Boolean })
  multi = false;

  /**
   * `files` is the list of files to be uploaded
   */
  @property({ type: Array })
  files: Array<YpUploadFileData> = [];

  /**
   * `method` is the http method to be used during upload
   */
  @property({ type: String })
  method = 'PUT';

  /**
   * `raised` indicates whether or not the button should be raised
   */
  @property({ type: Boolean })
  raised = false;

  @property({ type: String })
  subText: string | undefined;

  /**
   * `noink` indicates that the button should not have an ink effect
   */
  @property({ type: Boolean })
  noink = false;

  /**
   * `headers` is a key value map of header names and values
   */
  @property({ type: Object })
  headers: Record<string, string> = {};

  /**
   * `retryText` is the text for the tooltip to retry an upload
   */
  @property({ type: String })
  retryText = 'Retry Upload';

  /**
   * `removeText` is the text for the tooltip to remove an upload
   */
  @property({ type: String })
  removeText = 'Remove';

  /**
   * `successText` is the text for the tooltip of a successful upload
   */
  @property({ type: String })
  successText = 'Success';

  /**
   * `errorText` is the text to display for a failed upload
   */
  @property({ type: String })
  errorText = 'Error uploading file...';

  @property({ type: Boolean })
  noDefaultCoverImage = false;

  /**
   * `shownDropText` indicates whether or not the drop text should be shown
   */
  @property({ type: Boolean })
  shownDropText = false;

  @property({ type: Boolean })
  videoUpload = false;

  @property({ type: Boolean })
  audioUpload = false;

  @property({ type: Boolean })
  attachmentUpload = false;

  @property({ type: Number })
  currentVideoId: number | undefined;

  @property({ type: Number })
  currentAudioId: number | undefined;

  @property({ type: Number })
  transcodingJobId: number | undefined;

  @property({ type: Boolean })
  transcodingComplete = false;

  @property({ type: Object })
  currentFile: YpUploadFileData | undefined;

  @property({ type: Boolean })
  isPollingForTranscoding = false;

  @property({ type: Boolean })
  indeterminateProgress = false;

  @property({ type: String })
  uploadStatus: string | undefined;

  @property({ type: String })
  accept = 'image/*';

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Boolean })
  capture = false;

  @property({ type: String })
  containerType: string | undefined;

  @property({ type: Number })
  selectedVideoCoverIndex = 0;

  @property({ type: Boolean })
  videoAspect: string | undefined;

  @property({ type: Boolean })
  useMainPhotoForVideoCover = false;

  @property({ type: String })
  buttonText = '';

  @property({ type: String })
  buttonIcon = 'file_upload';

  static get styles() {
    return [
      super.styles,
      css`
        .enabled {
          border: 1px dashed #555;
        }

        .hover {
          opacity: 0.7;
          border: 1px dashed #111;
        }

        #UploadBorder {
          vertical-align: middle;
          color: #555;
          padding: 8px;
          padding-right: 16px;
          max-height: 200px;
          overflow-y: auto;
          display: inline-block;
        }

        #dropArea {
          text-align: center;
        }

        mwc-button {
          margin-bottom: 8px;
        }

        .file {
          padding: 10px 0px;
        }

        .commands {
          float: right;
        }

        .commands iron-icon:not([icon='check-circle']) {
          cursor: pointer;
          opacity: 0.9;
        }

        .commands iron-icon:hover {
          opacity: 1;
        }

        [hidden] {
          display: none;
        }

        .error {
          color: #f40303;
          font-size: 11px;
          margin: 2px 0px -3px;
        }

        [hidden] {
          display: none !important;
        }
        ::slotted(iron-icon) {
          padding-right: 6px;
        }

        .mainContainer {
          width: 100%;
        }

        .removeButton {
          margin-bottom: 18px;
        }

        .limitInfo {
          margin-top: 0;
          color: #656565;
          text-align: center;
          font-size: 14px;
        }

        mwc-button {
          min-width: 100px;
        }

        .subText {
          font-size: 12px;
          font-style: italic;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical center-center mainContainer">
        <div class="layout vertical center-center">
          <div class="layout horizontal center-center">
            <mwc-button
              id="button"
              .icon="${this.buttonIcon}"
              class="blue"
              ?raised="${this.raised}"
              .label="${this.buttonText}"
              @click="${this._fileClick}">
            </mwc-button>
            <mwc-icon-button
              .ariaLabel="${this.t('deleteFile')}"
              class="removeButton layout self-start"
              icon="delete"
              @click="${this.clear}"
              ?hidden="${!this.currentFile}"></mwc-icon-button>
          </div>
          <div class="subText" ?hidden="${!this.subText}">${this.subText}</div>
          <div
            ?hidden="${!this.uploadLimitSeconds}"
            class="limitInfo layout horizontal center-center">
            <em ?hidden="${this.currentFile != null}"
              >${this.uploadLimitSeconds} ${this.t('seconds')}</em
            >
          </div>
        </div>
        <div id="UploadBorder">
          ${this.files.map(
            item => html`
              <div class="file">
                <div class="name">
                  <span>${this.uploadStatus}</span>
                  <div class="commands">
                    <mwc-icon
                      .title="${this.retryText}"
                      @click="${this._retryUpload}"
                      ?hidden="${!item.error}"
                      >autorenew</mwc-icon
                    >
                    <mwc-icon
                      icon="cancel"
                      .title="${this.removeText}"
                      @click="${this._cancelUpload}"
                      ?hidden="${item.complete}"
                      >cancel</mwc-icon
                    >
                    <mwc-icon
                      icon="check_circle"
                      .title="${this.successText}"
                      ?hidden="${!item.complete}"
                      >check_circle</mwc-icon
                    >
                  </div>
                </div>
                <div class="error" ?hidden="${!item.error}">
                  ${this.errorText}
                </div>
                <div ?hidden="${item.complete}">
                  <mwc-linear-progress
                    .value="${item.progress}"
                    ?indeterminate="${this.indeterminateProgress}"
                    .error="${item.error}"></mwc-linear-progress>
                </div>
              </div>
            `
          )}
        </div>
        ${this.currentVideoId && this.transcodingComplete
          ? html`<yp-set-video-cover
              .noDefaultCoverImage="${this.noDefaultCoverImage}"
              .videoId="${this.currentVideoId}"
              @set-cover="${this._setVideoCover}"
              @set-default-cover="${this
                ._setDefaultImageAsVideoCover}"></yp-set-video-cover> `
          : nothing}
      </div>
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}" />
    `;
  }

  /**
   * Fired when a response is received status code 200.
   *
   * @event success
   */
  /**
   * Fired when a response is received other status code.
   *
   * @event error
   */
  /**
   * Fired when a file is about to be uploaded.
   *
   * @event before-upload
   */

  /**
   * Clears the list of files
   */
  clear() {
    this.files = [];
    this._showDropText();
    this.uploadStatus = undefined;
    this.currentVideoId = undefined;
    this.currentAudioId = undefined;
    this.currentFile = undefined;
    this.transcodingJobId = undefined;
    this.indeterminateProgress = false;
    this.transcodingComplete = false;
    this.capture = false;
    this.isPollingForTranscoding = false;
    this.useMainPhotoForVideoCover = false;

    const fileInput = this.$$('#fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    if (this.videoUpload) this.fire('success', { detail: null, videoId: null });
    else if (this.audioUpload)
      this.fire('success', { detail: null, audioId: null });
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.raised) {
      this.$$('#button')?.toggleAttribute('raised', true);
    }
    if (this.droppable) {
      this._showDropText();
      this.setupDrop();
    }
    if (this.videoUpload) {
      this.accept = 'video/*';
      this.capture = true;
    } else if (this.audioUpload) {
      this.accept = 'audio/*';
      this.capture = true;
    }

    if (!this.uploadLimitSeconds && (this.videoUpload || this.audioUpload)) {
      this.uploadLimitSeconds = 600;
    }
  }

  /**
   * A function to set up a drop area for drag-and-drop file uploads
   */
  setupDrop() {
    const uploadBorder = this.$$('#UploadBorder');
    //this.toggleClass('enabled', true, uploadBorder);

    this.ondragover = e => {
      e.stopPropagation();
      //this.toggleClass('hover', true, uploadBorder);
      return false;
    };

    this.ondragleave = () => {
      //this.toggleClass('hover', false, uploadBorder);
      return false;
    };

    this.ondrop = event => {
      //this.toggleClass('hover', false, uploadBorder);
      event.preventDefault();
      if (event.dataTransfer) {
        const length = event.dataTransfer.files.length;
        for (let i = 0; i < length; i++) {
          const file = event.dataTransfer.files[i] as YpUploadFileData;
          file.progress = 0;
          file.error = false;
          file.complete = false;
          this.files.push(file);
          this.uploadFile(file);
        }
      }
    };
  }

  _hasRecorderApp() {
    const isIOs =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;
    if (this.videoUpload) {
      if (isIOs || isAndroid) {
        return true;
      } else {
        return false;
      }
    } else if (this.audioUpload) {
      return false;
    } else {
      return true;
    }
  }

  _fileClick() {
    const isFirefox =
      /firefox/.test(navigator.userAgent.toLowerCase()) && !window.MSStream;
    const rawChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    const chromeVersion = rawChrome ? parseInt(rawChrome[2], 10) : false;
    const isSamsungBrowser = /SamsungBrowser/.test(navigator.userAgent);
    const isIOs =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (this._hasRecorderApp()) {
      this._openFileInput();
    } else {
      if (
        (isIOs && this.audioUpload) ||
        isFirefox ||
        (chromeVersion && !isSamsungBrowser)
      ) {
        this._openMediaRecorder();
      } else {
        this._openFileInput();
      }
    }
  }

  _openFileInput(aspect: string | undefined = undefined) {
    if (aspect) {
      this.videoAspect = aspect;
    }
    const elem = this.$$('#fileInput');
    if (elem && document.createEvent) {
      // sanity check
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, false);
      elem.dispatchEvent(evt);
    }
  }

  _openMediaRecorder() {
    window.appGlobals.activity('open', 'mediaRecorder');
    window.appDialogs.getMediaRecorderAsync((dialog: YpMediaRecorder) => {
      dialog.open({
        callbackFunction: this._dataFromMediaRecorder.bind(this),
        videoRecording: this.videoUpload,
        audioRecording: this.audioUpload,
        uploadFileFunction: this._openFileInput.bind(this),
        maxLength: this.uploadLimitSeconds || 600,
      });
    });
  }

  _dataFromMediaRecorder(file: YpUploadFileData) {
    file.progress = 0;
    file.error = false;
    file.complete = false;
    this.files.push(file);
    this.uploadFile(file);
  }

  /**
   * Called whenever the list of selected files changes
   */
  _fileChange(e: { target: { files: Array<YpUploadFileData> } }) {
    const length = e.target.files.length;
    for (let i = 0; i < length; i++) {
      const file = e.target.files[i];
      file.progress = 0;
      file.error = false;
      file.complete = false;
      this.files.push(file);
      this.uploadFile(file);
    }
  }

  /**
   * Cancels the file upload for a specific file
   *
   * @param {object} a file, an element of the files array
   */
  cancel(file: YpUploadFileData) {
    if (file && file.xhr) {
      file.xhr.abort();
      this.files.splice(this.files.indexOf(file), 1);
      this._showDropText();
    }
  }

  /**
   * Cancels the file upload
   *
   * @param {object}, an event object
   */
  _cancelUpload(e: { model: { __data__: { item: YpUploadFileData } } }) {
    this.cancel(e.model.__data__.item);
  }

  /**
   * Retries to upload the file
   *
   * @param {object}, an event object
   */
  _retryUpload(e: {
    model: { item: YpUploadFileData; __data__: { item: any } };
  }) {
    e.model.item.error = false;
    e.model.item.progress = 0;
    // The async helps give visual feedback of a retry occurring, even though it's less efficient.
    setTimeout(() => {
      this.uploadFile(e.model.__data__.item);
    }, 50);
  }

  /**
   * Whether or not to display the drop text
   */
  _showDropText() {
    this.shownDropText = !this.files.length && this.droppable;
  }

  async uploadFile(file: YpUploadFileData) {
    if (this.videoUpload || this.audioUpload || this.attachmentUpload) {
      this.indeterminateProgress = true;
      this.currentFile = file;

      let mediaUrl: string;
      let ajaxBody = {};

      if (this.videoUpload) {
        window.appGlobals.activity('starting', 'videoUpload');
        this.uploadStatus = this.t('uploadingVideo');
        this.headers = { 'Content-Type': 'video/mp4' };

        if (this.group) {
          mediaUrl =
            '/api/videos/' + this.group.id + '/createAndGetPreSignedUploadUrl';
        } else {
          mediaUrl = '/api/videos/createAndGetPreSignedUploadUrlLoggedIn';
        }
      } else if (this.audioUpload) {
        window.appGlobals.activity('starting', 'audioUpload');
        this.uploadStatus = this.t('uploadingAudio');
        this.headers = { 'Content-Type': 'audio/mp4' };

        if (this.group) {
          mediaUrl =
            '/api/audios/' + this.group.id + '/createAndGetPreSignedUploadUrl';
        } else {
          mediaUrl = '/api/audios/createAndGetPreSignedUploadUrlLoggedIn';
        }
      } else if (this.attachmentUpload) {
        window.appGlobals.activity('starting', 'attachmentUpload');
        this.uploadStatus = this.t('attachmentUpload');

        if (this.group) {
          ajaxBody = {
            filename: file.name,
            contentType: file.type,
          };
          mediaUrl =
            '/api/groups/' + this.group.id + '/getPresignedAttachmentURL';
        } else {
          console.error('No group for attachment upload');
          return;
        }
      }

      const response = await window.serverApi.createPresignUrl(
        mediaUrl!,
        ajaxBody
      );

      this.target = response.presignedUrl;
      if (this.videoUpload) this.currentVideoId = response.videoId;
      else this.currentAudioId = response.audioId;
      this.method = 'PUT';
      this.indeterminateProgress = false;
      this.reallyUploadFile(this.currentFile);
    } else {
      window.appGlobals.activity('starting', 'imageUpload');
      this.uploadStatus = this.t('uploadingImage');
      this.reallyUploadFile(file);
    }
  }

  _checkTranscodingJob(jobId: string) {
    setTimeout(async () => {
      let mediaType, mediaId;
      if (this.videoUpload) {
        mediaType = 'videos';
        mediaId = this.currentVideoId;
      } else {
        mediaType = 'audios';
        mediaId = this.currentAudioId;
      }

      if (mediaId) {
        const detail = await window.serverApi.getTranscodingJobStatus(
          mediaType,
          mediaId,
          jobId
        );

        if (this.currentFile) {
          const fileIndex = this.files.indexOf(
            this.currentFile as YpUploadFileData
          );
          if (detail.status === 'Complete') {
            this.files[fileIndex].complete = true;
            this.uploadStatus = this.t('uploadCompleted');
            this.transcodingComplete = true;
            if (this.videoUpload) {
              this.fire('success', {
                detail: detail,
                videoId: this.currentVideoId,
              });
              this.uploadStatus = this.t('selectCoverImage');
            } else
              this.fire('success', {
                detail: detail,
                audioId: this.currentAudioId,
              });
            this.fire('file-upload-complete');
            window.appGlobals.activity('complete', 'mediaTranscoding');
          } else if (detail.error) {
            this.files[fileIndex].error = true;
            this.files[fileIndex].complete = false;
            this.files[fileIndex].progress = 100;
            this.requestUpdate();
            this.fire('error', { xhr: event });
            this.fire('file-upload-complete');
            window.appGlobals.activity('error', 'mediaTranscoding');
          } else {
            this._checkTranscodingJob(jobId);
          }
        } else {
          console.error('Trying to process non file');
        }
      } else {
        console.error('No media edit for transcoding check');
      }
    }, 1000);
  }

  _setVideoCover(event: CustomEvent) {
    this.selectedVideoCoverIndex = event.detail;
  }

  _setDefaultImageAsVideoCover(event: CustomEvent) {
    this.useMainPhotoForVideoCover = event.detail;
  }

  /**
   * Really uploads a file
   *
   * @param {object} a file, an element of the files array
   */
  reallyUploadFile(file: YpUploadFileData) {
    if (!file) {
      return;
    }

    let aspect = this.videoAspect;

    if (!aspect) {
      if (window.innerHeight > window.innerWidth) {
        aspect = 'portrait';
      } else {
        aspect = 'landscape';
      }
    }

    this.fire('file-upload-starting');
    this._showDropText();
    const fileIndex = this.files.indexOf(file);

    const xhr = (file.xhr = new XMLHttpRequest());

    xhr.upload.onprogress = e => {
      const done = e.loaded,
        total = e.total;
      this.files[fileIndex].progress = Math.floor((done / total) * 1000) / 10;
    };

    const url = this.target.replace('<name>', file.name);
    xhr.open(this.method, url, true);
    for (const key in this.headers) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, this.headers[key]);
      }
    }

    xhr.onload = async () => {
      if (xhr.status === 200) {
        if (this.videoUpload && this.currentVideoId) {
          this.indeterminateProgress = true;
          this.uploadStatus = this.t('transcodingVideo');

          let startType;
          if (this.group) {
            startType = 'startTranscoding';
          } else {
            startType = 'startTranscodingLoggedIn';
          }

          let options;

          if (this.containerType === 'posts' && this.group) {
            options = {
              videoPostUploadLimitSec: this.group.configuration
                .videoPostUploadLimitSec,
              aspect: '',
            };
          } else if (this.containerType === 'points' && this.group) {
            options = {
              videoPointUploadLimitSec: this.group.configuration
                .videoPointUploadLimitSec,
              aspect: '',
            };
          } else {
            options = {};
          }

          options.aspect = aspect;

          const response = (await window.serverApi.startTranscoding(
            'videos',
            this.currentVideoId,
            startType,
            options
          )) as StartTranscodingResponse;

          this._checkTranscodingJob(response.transcodingJobId);

          window.appGlobals.activity('complete', 'videoUpload');
          window.appGlobals.activity('start', 'mediaTranscoding');
        } else if (this.audioUpload && this.currentAudioId) {
          this.indeterminateProgress = true;
          this.uploadStatus = this.t('transcodingAudio');

          let startType;
          if (this.group) {
            startType = 'startTranscoding';
          } else {
            startType = 'startTranscodingLoggedIn';
          }

          let options;
          if (this.containerType === 'posts' && this.group) {
            options = {
              audioPostUploadLimitSec: this.group.configuration
                .audioPostUploadLimitSec,
            };
          } else if (this.containerType === 'points' && this.group) {
            options = {
              audioPointUploadLimitSec: this.group.configuration
                .audioPointUploadLimitSec,
            };
          } else {
            options = {};
          }

          const response = (await window.serverApi.startTranscoding(
            'audios',
            this.currentAudioId,
            startType,
            options
          )) as StartTranscodingResponse;

          this._checkTranscodingJob(response.transcodingJobId);

          window.appGlobals.activity('complete', 'audioUpload');
          window.appGlobals.activity('start', 'mediaTranscoding');
        } else if (this.attachmentUpload) {
          this.uploadStatus = this.t('uploadCompleted');
          this.fire('file-upload-complete');
          this.files[fileIndex].complete = true;
          this.fire('success', {xhr: xhr, filename: file.name });
          window.appGlobals.activity('complete', 'attachmentUpload');
        } else {
          this.uploadStatus = this.t('uploadCompleted');
          this.fire('file-upload-complete');
          this.files[fileIndex].complete = true;
          this.fire('success', { xhr: xhr, videoId: this.currentVideoId });
          window.appGlobals.activity('complete', 'imageUpload');
        }
      } else {
        this.fire('file-upload-complete');
        this.files[fileIndex].error = true;
        this.files[fileIndex].complete = false;
        this.files[fileIndex].progress = 100;
        this.requestUpdate();
        this.fire('error', { xhr: xhr });
        window.appGlobals.activity('error', 'mediaUpload');
      }
    };

    if (this.videoUpload || this.audioUpload || this.attachmentUpload) {
      xhr.send(file);
    } else {
      const formData = new FormData();
      formData.append('file', file, file.name);
      xhr.send(formData);
    }
  }
}
