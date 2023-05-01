import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpLogin } from '../yp-login.js';
import '../yp-login.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpLogin', () => {
  let element: YpLogin;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-login></yp-login>
      `);
      await aTimeout(100);

    element.open(undefined, undefined, undefined);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
