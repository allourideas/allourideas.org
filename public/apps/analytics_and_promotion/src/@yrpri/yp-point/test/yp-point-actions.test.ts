import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPointActions } from '../yp-point-actions.js';
import '../yp-point-actions.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPointActions', () => {
  let element: YpPointActions;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-actions
        .point="${YpTestHelpers.getPoint()}"
      ></yp-point-actions>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
