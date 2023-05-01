import { html, css, nothing } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';

import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js';

import '@material/mwc-checkbox';
import '@material/mwc-radio';

import '@material/mwc-formfield';
import '@material/mwc-dialog';
import '@material/mwc-checkbox';

import { Checkbox } from '@material/mwc-checkbox';

import { Dialog } from '@material/mwc-dialog';

@customElement('yp-media-recorder')
export class YpMediaRecorder extends YpBaseElement {
  @property({ type: Object })
  recorder: RecordRTC | undefined;

  @property({ type: Object })
  mediaStream: MediaStream | undefined;

  @property({ type: Object })
  captureStream: MediaStream | undefined;

  @property({ type: Boolean })
  audioRecording = false;

  @property({ type: Boolean })
  videoRecording = false;

  @property({ type: Number })
  maxLength = 5;

  @property({ type: Object })
  recordedData: File | undefined;

  @property({ type: Boolean })
  recordingFinished = false;

  @property({ type: Boolean })
  isRecording = false;

  @property({ type: Boolean })
  rememberDevice = false;

  @property({ type: Boolean })
  previewActive = false;

  @property({ type: Object })
  callbackFunction: Function | undefined;

  @property({ type: Object })
  captureCallback: Function | undefined;

  @property({ type: Object })
  uploadFileFunction: Function | undefined;

  @property({ type: Object })
  selectDeviceFunction: Function | undefined;

  @property({ type: String })
  error: string | undefined;

  @property({ type: String })
  selectDeviceTitle: string | undefined;

  @property({ type: Number })
  recordSecondsLeft = 0;

  @property({ type: Array })
  audioDevices: Array<MediaDeviceInfo> | undefined;

  @property({ type: Array })
  videoDevices: Array<MediaDeviceInfo> | undefined;

  @property({ type: Array })
  allDevices: Array<MediaDeviceInfo> | undefined;

  @property({ type: Object })
  videoOptions: object | undefined;

  @property({ type: Object })
  surfer: WaveSurfer | undefined;

  @state()
  videoAspect = "portrait"

  selectedAudioDeviceId: string | null = null;
  selectedVideoDeviceId: string | null = null;

  videoSettings:
    | { width: number; height: number; deviceId?: string }
    | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        mwc-dialog {
          background-color: #fff;
        }

        #dialog[audio-recording] {
          width: 430px;
        }

        .mainbuttons {
          width: 100%;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .recording {
          color: #f00;
          animation-name: pulse;
          animation-duration: 1.3s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .recordingTime {
          color: #f00;
          animation-name: pulse;
          animation-duration: 1s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        @keyframes pulse {
          from {
            opacity: 1;
          }
          to {
            opacity: 0.5;
          }
        }

        .buttonText {
          margin-left: 6px;
        }

        .actionButton {
          color: var(--accent-color);
        }

        .iconButtons {
          margin-top: 2px;
        }

        #secondsLeft {
          margin-top: 12px;
          margin-left: 4px;
          margin-right: 4px;
        }

        .mainContainer {
          padding: 0 24px;
        }

        @media (max-width: 640px) {
          #dialog {
            padding: 0;
            margin: 0;
          }
          .mainContainer {
            padding: 0 0;
          }

          .mainbuttons {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: rgba(240, 240, 240, 0.5);
          }

          #dialog {
            min-height: 242px;
            min-width: 320px;
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .uploadFileText {
            display: none;
          }
        }

        .rememberBox {
          margin-top: 8px;
        }

        #checkBox {
          margin-left: 6px;
        }

        .header {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 10px;
        }

        #waveform {
          height: 128px;
        }

        [hidden] {
          display:none !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog id="dialog" modal ?audioRecording="${this.audioRecording}">
        <div class="layout vertical no-padding mainContainer">
          ${this.videoRecording
            ? html`
                <video
                  id="videoRecorder"
                  class="videoRecorder"
                  ?hidden="${this.previewActive}"></video>
                <video
                  id="videoPreviewer"
                  preload="auto"
                  class="videoRecorder"
                  ?hidden="${!this.previewActive}"></video>
              `
            : html``}
          ${this.audioRecording
            ? html`
                <div class="layout vertical center-center">
                  <div class="layout horizontal center-center header">
                    ${this.t('voiceRecorder')}
                  </div>
                  <div
                    id="waveform"
                    ?hidden="${this.recordedData != null}"></div>
                  <audio
                    id="audioRecorder"
                    class="audioRecorder"
                    ?hidden></audio>
                  <audio
                    id="audioPreviewer"
                    controls
                    preload="auto"
                    class="audioRecorder"
                    ?hidden="${!this.previewActive}"></audio>
                </div>
              `
            : html``}

          <div
            class="layout horizontal mainbuttons" slot="primaryAction"
            >
            <mwc-icon-button
              .label="${this.t('closeRecordingWindow')}"
              icon="clear"
              class="iconButtons"
              @click="${this._close}"></mwc-icon-button>
              <div class="layout layout horizontal" ?hidden="${!this.recorder}">
                <mwc-icon-button
                .label="${this.t('deleteRecordedMedia')}"
                icon="delete"
                class="iconButtons"
                @click="${this._deleteRecording}"
                ?hidden="${!this.recordedData}"></mwc-icon-button>
                <mwc-button
                  @click="${this._startRecording}"
                  class="buttonText"
                  .label="${this.t('record')}"
                  ?hidden="${this.recordedData != null}"
                  icon="fiber_manual_record">
                  <iron-icon id="recordingIcon"></iron-icon>
                </mwc-button>
                <div id="secondsLeft" ?hidden="${this.recordedData != null}">
                  ${this.recordSecondsLeft} ${this.t('seconds')}
                </div>
                <mwc-button
                  @click="${this._stopRecording}"
                  class="buttonText"
                  .label="${this.t('stop')}"
                  ?hidden="${!this.isRecording}"
                  icon="stop">
                </mwc-button>
              </div>
            <span ?hidden="${this.isRecording || this.audioRecording}">
              <div class="layout horizontal">
                <mwc-button
                  id="uploadFileButton"
                  icon="file-upload"
                  class="uploadFileButton"
                  .label="${this.t('uploadFile')}"
                  @click="${this._uploadFile}"
                  ?hidden="${this.recordedData != null}">
                  <div class="buttonText uploadFileText"></div>
                </mwc-button>
                <mwc-formfield label="landscape">
                  <mwc-radio
                    name="videoAspect"
                    @change="${this._setVideoAspect}"
                    value="landscape">
                  </mwc-radio>
                </mwc-formfield>
                <mwc-formfield label="portrait">
                  <mwc-radio
                    name="videoAspect"
                    @change="${this._setVideoAspect}"
                    value="portrait">
                  </mwc-radio>
                </mwc-formfield>

              </div>
            </span>
            <mwc-button
              @click="${this._sendBack}"
              class="buttonText actionButton"
              .label="${this.t('send')}"
              ?hidden="${!this.recordedData}"
              icon="send">
            </mwc-button>
          </div>
        </div>
        <div ?hidden="${!this.error}">
          ${this.error}
        </div>
      </mwc-dialog>
      ${this.allDevices
        ? html`
            <mwc-dialog id="selectDevices" modal>
              <h2>${this.selectDeviceTitle}</h2>
              <mwc-select id="deviceListBox">
                ${this.allDevices.map(
                  item => html`
                    <mwc-list-item
                      @click="${this.selectDeviceFunction}"
                      id="${item.deviceId}"
                      >${item.label}</mwc-list-item
                    >
                  `
                )}
              </mwc-select>
              <div class="layout horizontal rememberBox">
                <div>
                  ${this.t('rememberDevice')}
                </div>
                <input id="checkBox" type="checkbox" />
              </div>
            </mwc-dialog>
          `
        : nothing}
      <mwc-dialog id="noDevices">
        <h2>${this.t('noDevicesFound')}</h2>
        <div class="button layout horizontal center-center">
          <mwc-button
            slot="action"
            raised
            .label="${this.t('ok')}"></mwc-button>
        </div>
      </mwc-dialog>
    `;
  }

  _setVideoAspect(event: CustomEvent) {
    this.videoAspect = (event.target as HTMLInputElement).value as string;
  }

  _selectAudioDevice(event: CustomEvent) {
    const target = event.target as HTMLElement;
    if (target.id) {
      this.selectedAudioDeviceId = target.id;
    }

    if ((this.$$('#checkBox') as Checkbox).checked) {
      localStorage.setItem(
        'selectedAudioDeviceId',
        this.selectedAudioDeviceId!
      );
    }

    (this.$$('#selectDevices') as Dialog).open = false;
    this._openMediaSession(this.captureCallback);
  }

  _selectVideoDevice(event: CustomEvent) {
    if ((event.target as HTMLElement).id) {
      this.selectedVideoDeviceId = (event.target as HTMLElement).id;
    }

    if ((this.$$('#checkBox') as Checkbox).checked) {
      localStorage.setItem(
        'selectedVideoDeviceId',
        this.selectedVideoDeviceId!
      );
    }

    (this.$$('#selectDevices') as Dialog).open = false;
    this._checkAudioDevices();
  }

  async _checkAudioDevices() {
    if (this.audioDevices && this.audioDevices.length > 1) {
      if (localStorage.getItem('selectedAudioDeviceId')) {
        this.selectedAudioDeviceId = localStorage.getItem(
          'selectedAudioDeviceId'
        );
        this._openMediaSession(this.captureCallback);
      } else {
        this.selectDeviceTitle = this.t('selectAudioDevice');
        this.selectDeviceFunction = this._selectAudioDevice.bind(this);
        this.allDevices = this.audioDevices;
        //TODO: Fix this back in
        //this.$$('#deviceListBox').selected = null;
        await this.updateComplete;
        (this.$$('#checkBox') as Checkbox).checked = false;
        (this.$$('#selectDevices') as Dialog).open = true;
      }
    } else {
      this._openMediaSession(this.captureCallback);
    }
  }

  async _checkVideoDevices() {
    if (
      this.videoRecording &&
      this.videoDevices &&
      this.videoDevices.length > 1
    ) {
      if (localStorage.getItem('selectedVideoDeviceId')) {
        this.selectedVideoDeviceId = localStorage.getItem(
          'selectedVideoDeviceId'
        );
        await this._checkAudioDevices();
      } else {
        this.selectDeviceTitle = this.t('selectVideoDevice');
        this.rememberDevice = false;
        this.selectDeviceFunction = this._selectVideoDevice.bind(this);
        this.allDevices = this.videoDevices;
        //TODO: Fix this back in
        //this.$$('#deviceListBox').selected = null;
        await this.updateComplete;
        (this.$$('#checkBox') as Checkbox).checked = false;
        (this.$$('#selectDevices') as Dialog).open = true;
      }
    } else {
      await this._checkAudioDevices();
    }
  }

  _close() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    if (this.surfer) {
      this.surfer.microphone.stop();
      this.surfer.destroy();
    }
    this.previewActive = false;
    (this.$$('#dialog') as Dialog).open = false;
  }

  _uploadFile() {
    this._close();
    this.uploadFileFunction!(this.videoAspect);
  }

  _sendBack() {
    if (this.callbackFunction && this.recorder) {
      this.callbackFunction(this.recordedData);
      this.recordedData = undefined;
      this.recorder.clearRecordedData();
      this.recorder.reset();
      this.recorder = undefined;
      this._close();
    } else {
      console.error('No callback function for media player');
    }
  }

  checkDevices() {
    navigator.mediaDevices.enumerateDevices().then(devicesIn => {
      this.audioDevices = devicesIn.filter(d => {
        return d.kind === 'audioinput';
      });

      this.videoDevices = devicesIn.filter(d => {
        return d.kind === 'videoinput';
      });

      let hasLabels = false;

      this.videoDevices.forEach(function (device) {
        if (device.label && device.label != '') {
          hasLabels = true;
        }
      });

      if (!hasLabels) {
        this.videoDevices = undefined;
        this.audioDevices = undefined;
      }

      this._checkVideoDevices();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    if (window.innerHeight>window.innerWidth) {
      this.videoAspect = "portrait";
    } else {
      this.videoAspect = "landscape";
    }
  }

  captureUserMedia(callback: Function) {
    this.captureCallback = callback;
    this.checkDevices();
  }

  _openMediaSession(callback: Function | undefined) {
    debugger;
    if (callback) {
      if (this.selectedVideoDeviceId) {
        this.videoSettings!.deviceId = this.selectedVideoDeviceId;
      }

      const constraints = {
        audio: this.selectedAudioDeviceId
          ? { deviceId: this.selectedAudioDeviceId }
          : true,
        video: this.videoRecording ? this.videoSettings : undefined,
      };

      navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        stream.getTracks().forEach(function (track) {
          console.info(track.getCapabilities());
        });
        callback(stream);
      })
      .catch(function (error) {
        console.error(error);
        //TODO: Fire user error
        callback(null);
      });
    }
  }

  async open(options: {
    callbackFunction: Function | undefined;
    videoRecording: boolean;
    audioRecording: boolean;
    maxLength: number;
    uploadFileFunction: Function | undefined;
  }) {
    this.callbackFunction = options.callbackFunction;
    this.recordingFinished = false;
    this.error = undefined;
    this.audioRecording = false;
    this.videoRecording = false;
    if (options.videoRecording) {
      this.videoRecording = true;
    } else if (options.audioRecording) {
      this.audioRecording = true;
    }
    this.maxLength = options.maxLength;
    this.uploadFileFunction = options.uploadFileFunction;
    (this.$$('#secondsLeft') as HTMLElement).className = '';

    await this.requestUpdate();

    if (this.videoRecording) {
      const videoElement = this.shadowRoot!.querySelector(
        '#videoRecorder'
      ) as HTMLVideoElement;
      const videoPreviewElement = this.shadowRoot!.querySelector(
        '#videoPreviewer'
      ) as HTMLVideoElement;
      let width: string;
      let height: string;

      if (window.innerHeight > window.innerWidth) {
        this.videoSettings = { width: 720, height: 1280 };
        height = Math.min(1280, Math.abs(window.innerHeight)).toFixed();
        width = Math.min(720, Math.abs(parseInt(height) * 0.5625)).toFixed();
        console.info(
          'Portrait - width: ' +
            width +
            ' height: ' +
            height +
            ' video width: ' +
            720 +
            ' height: 1280'
        );
      } else {
        this.videoSettings = { width: 1280, height: 720 };
        let scaleFactor = 0.8;
        if (window.innerHeight < 700) scaleFactor = 0.7;
        if (window.innerHeight < 500) scaleFactor = 0.6;
        height = Math.min(
          720,
          Math.abs(window.innerHeight * scaleFactor)
        ).toFixed();
        width = Math.min(
          1280,
          Math.abs(parseInt(height) * 1.77777777778)
        ).toFixed();
        console.info('Landscape - width: ' + width + ' height: ' + height);
      }
      videoElement.style.height = height + 'px';
      videoElement.style.width = width + 'px';
      videoPreviewElement.style.height =
        (parseInt(height) * 0.8).toFixed() + 'px';
      videoPreviewElement.style.width =
        (parseInt(width) * 0.8).toFixed() + 'px';
      setTimeout(() => {
        (this.$$('#dialog') as Dialog).open = true;
      });
    } else if (this.audioRecording) {
      setTimeout(() => {
        (this.$$('#dialog') as Dialog).open = true;
      });
    }

    this.setupRecorders();
  }

  _generateRandomString() {
    if (window.crypto) {
      const a = window.crypto.getRandomValues(new Uint32Array(3));
      let token = '';
      for (let i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
      return token;
    } else {
      return (Math.random() * new Date().getTime())
        .toString(36)
        .replace(/\./g, '');
    }
  }

  _startRecording() {
    if (!this.isRecording) {
      this.recorder!.startRecording();
      this.recordSecondsLeft = this.maxLength;
      this.isRecording = true;
      (this.$$('#recordingIcon') as HTMLElement).className = 'recording';
      this._recordingTimer();
    } else {
      this._stopRecording();
    }
  }

  _stopRecording() {
    (this.$$('#recordingIcon') as HTMLElement).className = '';
    this.isRecording = false;
    this.recorder!.stopRecording(this._storeRecordedData.bind(this));
    (this.$$('#secondsLeft') as HTMLElement).className = '';
  }

  _deleteRecording() {
    this.recorder!.reset();
    this.previewActive = false;
    this.recordedData = undefined;
    this.recordSecondsLeft = this.maxLength;
    (this.$$('#secondsLeft') as HTMLElement).className = '';
    (this.$$('#recordingIcon') as HTMLElement).className = '';
  }

  _storeRecordedData() {
    const blob = this.recorder!.getBlob();
    let fileName;

    if (this.videoRecording) {
      const videoElement = this.shadowRoot!.querySelector(
        '#videoRecorder'
      ) as HTMLVideoElement;
      const videoPreviewer = this.shadowRoot!.querySelector(
        '#videoPreviewer'
      ) as HTMLVideoElement;
      fileName = this._generateRandomString() + '.webm';
      this.recordedData = new File([blob], fileName, {
        type: 'video/webm',
      });
      videoElement.controls = true;
      this.recorder!.reset();
      videoPreviewer.src = window.URL.createObjectURL(this.recordedData);
      videoPreviewer.controls = true;
      this.previewActive = true;
    } else if (this.audioRecording) {
      const audioElement = this.shadowRoot!.querySelector(
        '#audioRecorder'
      ) as HTMLAudioElement;
      const audioPreviewer = this.shadowRoot!.querySelector(
        '#audioPreviewer'
      ) as HTMLAudioElement;
      fileName = this._generateRandomString() + '.mp3';
      this.recordedData = new File([blob], fileName, {
        type: 'audio/mp3',
      });
      audioElement.controls = true;
      audioElement.pause();
      audioPreviewer.src = window.URL.createObjectURL(this.recordedData);
      audioPreviewer.controls = true;
      this.previewActive = true;
    }
  }

  _recordingTimer() {
    if (this.isRecording) {
      setTimeout(() => {
        if (this.isRecording) {
          if (this.recordSecondsLeft > 0) {
            this._recordingTimer();
          } else {
            this._stopRecording();
          }
          if (this.recordSecondsLeft > 0) this.recordSecondsLeft -= 1;
          if (this.recordSecondsLeft <= 5) {
            (this.$$('#secondsLeft') as HTMLElement).className =
              'recordingTime';
          }
        }
      }, 1000);
    } else {
      console.error('_recordingTimer called without in recording mode');
    }
  }

  setupRecorders() {
    this.recordSecondsLeft = this.maxLength;
    if (this.videoRecording) {
      const videoElement = this.shadowRoot!.querySelector(
        '#videoRecorder'
      ) as HTMLVideoElement;

      this.captureUserMedia((stream: MediaStream) => {
        if (stream) {
          this.mediaStream = stream;
          try {
            videoElement.srcObject = stream;
          } catch (error) {
            console.error(error);
            videoElement.src = window.URL.createObjectURL(stream as any);
          }
          videoElement.play();
          videoElement.muted = true;
          videoElement.controls = false;

          this.recorder = new RecordRTC(stream, {
            type: 'video',
          });
        } else {
          console.error("Can't find stream");
          (this.$$('#noDevices') as Dialog).open = true;
          (this.$$('#uploadFileButton') as HTMLElement).style.color = '#F00';
        }
      });
    } else if (this.audioRecording) {
      const audioElement = this.shadowRoot!.querySelector(
        '#audioRecorder'
      ) as HTMLAudioElement;

      this.captureUserMedia((stream: MediaStream) => {
        if (stream) {
          this.mediaStream = stream;
          try {
            audioElement.srcObject = stream;
          } catch (error) {
            console.error(error);
            audioElement.src = window.URL.createObjectURL(stream as any);
          }
          audioElement.play();
          audioElement.muted = true;
          audioElement.controls = false;
          this.surfer = WaveSurfer.create({
            container: this.$$('#waveform') as HTMLElement,
            waveColor: '#ff3d00',
            progressColor: '#ff3d00',
            cursorWidth: 0,
            plugins: [MicrophonePlugin.create({ stream: this.mediaStream })],
          });

          this.surfer.microphone.play();

          this.recorder = new RecordRTC(stream, {
            type: 'audio',
          });
        } else {
          console.error("Can't find stream");
          (this.$$('#noDevices') as Dialog).open = true;
          (this.$$('#uploadFileButton') as HTMLElement).style.color = '#F00';
        }
      });
    }
    setTimeout(() => {
      //TODO: Check this and add back if needed
      //(this.$$('#dialog') as Dialog).center();
    });
  }
}
