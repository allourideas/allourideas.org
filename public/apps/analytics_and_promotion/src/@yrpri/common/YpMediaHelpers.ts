import { YpBaseElement } from './yp-base-element.js';

export class YpMediaHelpers {
  static _checkVideoLongPlayTimeAndReset(
    playbackElement: YpElementWithPlayback,
    videoPlayer: HTMLElement
  ) {
    const videoId = videoPlayer.getAttribute('data-id');
    if (playbackElement.playStartedAt && videoId) {
      const seconds =
        (new Date().getTime() - playbackElement.playStartedAt.getTime()) / 1000;
      if (seconds > 5) {
        window.appGlobals.sendLongVideoView(videoId);
      }
      window.appGlobals.activity('completed', 'video', seconds);
      playbackElement.playStartedAt = undefined;
    } else if (playbackElement.playStartedAt) {
      console.error('Got long view check without id');
      playbackElement.playStartedAt = undefined;
    }
  }

  static _checkAudioLongPlayTimeAndReset(
    playbackElement: YpElementWithPlayback,
    audioPlayer: HTMLElement
  ) {
    const audioId = audioPlayer.getAttribute('data-id');
    if (playbackElement.playStartedAt && audioId) {
      const seconds =
        (new Date().getTime() - playbackElement.playStartedAt.getTime()) / 1000;
      if (seconds > 5) {
        window.appGlobals.sendLongAudioListen(audioId);
      }
      window.appGlobals.activity('completed', 'audio', seconds);
      playbackElement.playStartedAt = undefined;
    } else if (playbackElement.playStartedAt) {
      console.error('Got long view check without audio id');
      playbackElement.playStartedAt = undefined;
    }
  }

  static getImageFormatUrl(
    images: Array<YpImageData> | undefined,
    formatId = 0
  ) {
    if (images && images.length > 0) {
      const formats = JSON.parse(images[images.length - 1].formats);
      if (formats && formats.length > 0) return formats[formatId];
    } else {
      return '';
    }
  }

  static setupTopHeaderImage(
    element: YpBaseElement,
    images: Array<YpImageData> | null
  ) {
    if (element.wide) {
      let path;
      if (images) {
        path = 'url(' + this.getImageFormatUrl(images, 0) + ')';
      } else {
        path = 'none';
      }
      window.appGlobals.theme.updateStyles({
        '--top-area-background-image': path,
      });
    }
  }

  // TODO: Test this well
  static attachMediaListeners(targetElement: YpElementWithPlayback) {
    setTimeout(() => {
      const videoPlayer = targetElement.$$('#videoPlayer');
      const audioPlayer = targetElement.$$('#audioPlayer');
      if (videoPlayer) {
        const videoId = videoPlayer.getAttribute('data-id');
        if (videoId) {
          targetElement.videoPlayListener = () => {
            targetElement.playStartedAt = new Date();
            window.appGlobals.sendVideoView(parseInt(videoId));
          };
          targetElement.videoPauseListener = () => {
            this._checkVideoLongPlayTimeAndReset(targetElement, videoPlayer);
          };
          targetElement.videoEndedListener = () => {
            this._checkVideoLongPlayTimeAndReset(targetElement, videoPlayer);
          };
          videoPlayer.addEventListener(
            'play',
            targetElement.videoPlayListener.bind(targetElement)
          );
          videoPlayer.addEventListener(
            'pause',
            targetElement.videoPauseListener.bind(targetElement)
          );
          videoPlayer.addEventListener(
            'ended',
            targetElement.videoEndedListener.bind(targetElement)
          );
        }
      }

      if (audioPlayer) {
        const audioId = audioPlayer.getAttribute('data-id');
        if (audioId) {
          targetElement.audioPlayListener = () => {
            targetElement.playStartedAt = new Date();
            window.appGlobals.sendAudioListen(audioId);
          };
          targetElement.audioPauseListener = () => {
            this._checkAudioLongPlayTimeAndReset(targetElement, audioPlayer);
          };
          targetElement.audioEndedListener = () => {
            this._checkAudioLongPlayTimeAndReset(targetElement, audioPlayer);
          };
          audioPlayer.addEventListener(
            'play',
            targetElement.audioPlayListener.bind(targetElement)
          );
          audioPlayer.addEventListener(
            'pause',
            targetElement.audioPauseListener.bind(targetElement)
          );
          audioPlayer.addEventListener(
            'ended',
            targetElement.audioEndedListener.bind(targetElement)
          );
        }
      }
    }, 200);
  }

  static detachMediaListeners(targetElement: YpElementWithPlayback) {
    const videoPlayer = targetElement.$$('#videoPlayer');
    const audioPlayer = targetElement.$$('#audioPlayer');
    if (videoPlayer) {
      if (targetElement.videoPlayListener) {
        videoPlayer.removeEventListener(
          'play',
          targetElement.videoPlayListener
        );
        targetElement.videoPlayListener = undefined;
      }
      if (targetElement.videoPauseListener) {
        videoPlayer.removeEventListener(
          'pause',
          targetElement.videoPauseListener
        );
        targetElement.videoPauseListener = undefined;
      }
      if (targetElement.videoEndedListener) {
        videoPlayer.removeEventListener(
          'ended',
          targetElement.videoEndedListener
        );
        targetElement.videoEndedListener = undefined;
      }
      this._checkVideoLongPlayTimeAndReset(targetElement, videoPlayer);
    }

    if (audioPlayer) {
      if (targetElement.audioPlayListener) {
        audioPlayer.removeEventListener(
          'play',
          targetElement.audioPlayListener
        );
        targetElement.audioPlayListener = undefined;
      }
      if (targetElement.audioPauseListener) {
        audioPlayer.removeEventListener(
          'pause',
          targetElement.audioPauseListener
        );
        targetElement.audioPauseListener = undefined;
      }
      if (targetElement.audioEndedListener) {
        audioPlayer.removeEventListener(
          'ended',
          targetElement.audioEndedListener
        );
        targetElement.audioEndedListener = undefined;
      }
      this._checkVideoLongPlayTimeAndReset(targetElement, audioPlayer);
    }
  }

  static pauseMediaPlayback(targetElement: YpElementWithPlayback) {
    const videoPlayer = targetElement.$$('#videoPlayer') as HTMLAudioElement;
    const audioPlayer = targetElement.$$('#audioPlayer') as HTMLVideoElement;
    if (videoPlayer) {
      videoPlayer.pause();
    }
    if (audioPlayer) {
      audioPlayer.pause();
    }
  }

  static getVideoURL(videos: Array<YpVideoData> | undefined) {
    if (
      videos &&
      videos.length > 0 &&
      videos[0].formats &&
      videos[0].formats.length > 0
    ) {
      return videos[0].formats[0];
    } else {
      return null;
    }
  }

  static isPortraitVideo(videos: Array<YpVideoData> | undefined) {
    if (
      videos &&
      videos.length > 0 &&
      videos[0].formats &&
      videos[0].formats.length > 0
    ) {
      if (
        videos[0].public_meta &&
        videos[0].public_meta.aspect &&
        videos[0].public_meta.aspect === 'portrait'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static getAudioURL(audios: Array<YpAudioData> | undefined) {
    if (
      audios &&
      audios.length > 0 &&
      audios[0].formats &&
      audios[0].formats.length > 0
    ) {
      return audios[0].formats[0];
    } else {
      return null;
    }
  }

  static getVideoPosterURL(
    videos: Array<YpVideoData> | undefined,
    images: Array<YpImageData> | undefined,
    selectedImageIndex = 0
  ) {
    if (
      videos &&
      videos.length > 0 &&
      videos[0].VideoImages &&
      videos[0].VideoImages.length > 0
    ) {
      if (
        videos[0].public_meta &&
        videos[0].public_meta.selectedVideoFrameIndex
      ) {
        selectedImageIndex = videos[0].public_meta.selectedVideoFrameIndex;
      }
      if (selectedImageIndex > videos[0].VideoImages.length - 1) {
        selectedImageIndex = 0;
      }
      if (selectedImageIndex === -2 && images) {
        return this.getImageFormatUrl(images, 0);
      } else {
        if (selectedImageIndex < 0) selectedImageIndex = 0;
        return JSON.parse(videos[0].VideoImages[selectedImageIndex].formats)[0];
      }
    } else {
      return null;
    }
  }
}
