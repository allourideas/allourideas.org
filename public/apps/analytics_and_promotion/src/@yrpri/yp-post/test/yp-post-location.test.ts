import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostLocation } from '../yp-post-location.js';
import '../yp-post-location.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostLocation', () => {
  let element: YpPostLocation;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-location
        .group="${YpTestHelpers.getGroup()}"
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-location>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
