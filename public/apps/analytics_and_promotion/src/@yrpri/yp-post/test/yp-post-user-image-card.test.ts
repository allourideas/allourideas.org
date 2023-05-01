import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostUserImageCard } from '../yp-post-user-image-card.js';
import '../yp-post-user-image-card.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostUserImageCard', () => {
  let element: YpPostUserImageCard;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const image = {
      description: 'mynd af',
      photographer_name: 'Alexander',
      id: 2,
      formats: '["https://yrpri6-production.s3.amazonaws.com/5dddb81c-6023-4636-aae6-29e013e084d4-desktop-retina.png","https://yrpri6-production.s3.amazonaws.com/5dddb81c-6023-4636-aae6-29e013e084d4-mobile-retina.png","https://yrpri6-production.s3.amazonaws.com/5dddb81c-6023-4636-aae6-29e013e084d4-thumb.png"]',
      user_id: 2,
    } as YpImageData

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-user-image-card
        .post="${YpTestHelpers.getPost()}"
        .image="${image}"
      ></yp-post-user-image-card>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
