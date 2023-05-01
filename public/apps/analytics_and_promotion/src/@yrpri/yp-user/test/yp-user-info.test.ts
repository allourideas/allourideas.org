import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUserInfo } from '../yp-user-info.js';
import '../yp-user-info.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpUserInfo', () => {
  let element: YpUserInfo;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-info .user="${YpTestHelpers.getUser()}"></yp-user-info>
      `);
      await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
