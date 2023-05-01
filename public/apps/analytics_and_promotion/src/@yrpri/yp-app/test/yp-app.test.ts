import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpApp } from '../yp-app.js';
import '../yp-app.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpApp', () => {
  let element: YpApp;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-app

      ></yp-app>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
