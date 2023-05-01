import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpMediaRecorder } from '../yp-media-recorder.js';
import '../yp-media-recorder.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpMediaRecorder', () => {
  let element: YpMediaRecorder;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const media = {
      captureCallback: function (data: any) {

      }
    }

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-media-recorder
        .media="${media}">
      </yp-media-recorder>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
