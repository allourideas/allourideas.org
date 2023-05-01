import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpSetVideoCover } from '../yp-set-video-cover.js';
import '../yp-set-video-cover.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpSetVideoCover', () => {
  let element: YpSetVideoCover;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const video = {
        videoId: 1
      }

    const videoImages = [
      "https://yrpri6-production.s3.amazonaws.com/Bc/6V/M6-retina.png",
      "https://yrpri6-production.s3.amazonaws.com/Bc/6V/M6-retina.png"
    ],

      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <yp-set-video-cover
          .video="${video}"
          .videoImages="${videoImages}">
        </yp-set-video-cover>
      `);
      await aTimeout(100);
    });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
