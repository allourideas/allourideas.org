import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostUserImageEdit } from '../yp-post-user-image-edit.js';
import '../yp-post-user-image-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostUserImageEdit', () => {
  let element: YpPostUserImageEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-user-image-edit
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-user-image-edit>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
