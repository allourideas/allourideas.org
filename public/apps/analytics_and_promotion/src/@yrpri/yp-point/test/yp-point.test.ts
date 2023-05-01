import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPoint } from '../yp-point.js';
import '../yp-point.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPoint', () => {
  let element: YpPoint;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point
        .point="${YpTestHelpers.getPoint()}"
      ></yp-point>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
