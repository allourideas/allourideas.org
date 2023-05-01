import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpResetPassword } from '../yp-reset-password.js';
import '../yp-reset-password.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpResetPassword', () => {
  let element: YpResetPassword;
  let fetchMock: any;
  let server: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-reset-password></yp-reset-password>
      `);
        await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
