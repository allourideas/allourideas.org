import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostActions } from '../yp-post-actions.js';
import '../yp-post-actions.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpPostActions', () => {
  let element: YpPostActions;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-actions
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-actions>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
