import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostCardAdd } from '../yp-post-card-add.js';
import '../yp-post-card-add.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostCardAdd', () => {
  let element: YpPostCardAdd;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-card-add
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-card-add>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
